import AV1Core
import Combine
import Foundation
import UserNotifications

@MainActor
final class AppModel: ObservableObject {
    enum Section: String, CaseIterable, Identifiable {
        case queue
        case watchFolders
        case presets
        case history
        case settings

        var id: String { rawValue }

        var title: String {
            switch self {
            case .queue:
                return "Queue"
            case .watchFolders:
                return "Watch Folders"
            case .presets:
                return "Presets"
            case .history:
                return "History"
            case .settings:
                return "Settings"
            }
        }

        var iconName: String {
            switch self {
            case .queue:
                return "list.bullet.rectangle"
            case .watchFolders:
                return "folder.badge.gearshape"
            case .presets:
                return "slider.horizontal.3"
            case .history:
                return "clock.arrow.circlepath"
            case .settings:
                return "gearshape"
            }
        }
    }

    struct AlertContext: Identifiable {
        let id = UUID()
        let title: String
        let message: String
    }

    @Published var selectedSection: Section? = .queue
    @Published var jobs: [EncodeJob] = []
    @Published var customPresets: [PresetDefinition] = []
    @Published var watchFolderRules: [WatchFolderRule] = []
    @Published var settings: AppSettings = .init()
    @Published var selectedJobID: UUID?
    @Published var alertContext: AlertContext?
    @Published var toolchainDescription = "Detecting ffmpeg..."
    @Published var isQueueActive = false

    private let persistence: PersistenceController
    private let encoderRunner = EncoderRunner()
    private var activeTasks: [UUID: Task<Void, Never>] = [:]
    private var watchTask: Task<Void, Never>?
    private var observedFileSizes: [UUID: [String: Int64]] = [:]
    private let fileManager = FileManager.default
    private var toolchain: AV1Toolchain?

    init(persistence: PersistenceController = PersistenceController()) {
        self.persistence = persistence

        let state = persistence.load()
        jobs = state.jobs
        customPresets = state.customPresets
        watchFolderRules = state.watchFolderRules
        settings = state.settings
        selectedJobID = jobs.first?.id

        do {
            let toolchain = try ToolchainLocator.locate()
            self.toolchain = toolchain
            toolchainDescription = "ffmpeg: \(toolchain.ffmpeg.path)"
        } catch {
            toolchainDescription = error.localizedDescription
            alertContext = AlertContext(title: "Toolchain Missing", message: error.localizedDescription)
        }

        pruneLogs()
        startWatchLoop()
        Task {
            await requestNotificationPermission()
        }
    }

    deinit {
        watchTask?.cancel()
        activeTasks.values.forEach { $0.cancel() }
    }

    var allPresets: [PresetDefinition] {
        PresetCatalog.allPresets(customPresets: customPresets)
    }

    var runningJobs: [EncodeJob] {
        jobs.filter { $0.status == .running }
    }

    var historyJobs: [EncodeJob] {
        jobs
            .filter { $0.status.isTerminal }
            .sorted { ($0.completedAt ?? $0.createdAt) > ($1.completedAt ?? $1.createdAt) }
    }

    func job(for id: UUID?) -> EncodeJob? {
        guard let id else {
            return nil
        }
        return jobs.first(where: { $0.id == id })
    }

    func importFiles(_ urls: [URL], presetID: String? = nil, outputDirectory: URL? = nil) {
        guard ensureToolchain() else {
            return
        }

        for url in urls.map(\.standardizedFileURL) where isSupportedVideo(url) {
            guard !jobs.contains(where: { $0.sourceURL.standardizedFileURL == url }) else {
                continue
            }

            let initialPreset = presetID.flatMap { preset(for: $0) } ?? PresetCatalog.defaultSpeedPreset()
            let destination = outputDirectory ?? settings.defaultOutputDirectory
            let fileName = OutputPathResolver.defaultFileName(for: url, container: initialPreset.container)

            let job = EncodeJob(
                sourceURL: url,
                outputDirectory: destination,
                outputFileName: fileName,
                presetID: initialPreset.id,
                status: .analyzing
            )

            jobs.insert(job, at: 0)
            selectedJobID = job.id
            persist()

            Task {
                await analyzeJob(jobID: job.id)
            }
        }
    }

    func importFolder(_ folderURL: URL) {
        guard let contents = try? fileManager.contentsOfDirectory(at: folderURL, includingPropertiesForKeys: [.isRegularFileKey]) else {
            return
        }
        importFiles(contents.filter(isSupportedVideo))
    }

    func startQueue() {
        isQueueActive = true
        scheduleJobsIfNeeded()
    }

    func stopRunningJobs() {
        isQueueActive = false
        for job in runningJobs {
            cancelJob(job.id)
        }
    }

    func startJob(_ jobID: UUID) {
        if let index = jobs.firstIndex(where: { $0.id == jobID }) {
            if jobs[index].status == .failed || jobs[index].status == .cancelled || jobs[index].status == .completed {
                jobs[index].status = .retrying
                jobs[index].progress = 0
            }
            isQueueActive = true
            persist()
            scheduleJobsIfNeeded()
        }
    }

    func cancelJob(_ jobID: UUID) {
        activeTasks[jobID]?.cancel()
        encoderRunner.cancel(jobID: jobID)
    }

    func retryJob(_ jobID: UUID) {
        startJob(jobID)
    }

    func updatePreset(jobID: UUID, presetID: String) {
        guard let index = jobs.firstIndex(where: { $0.id == jobID }),
              let preset = preset(for: presetID) else {
            return
        }

        jobs[index].presetID = presetID
        jobs[index].outputFileName = OutputPathResolver.defaultFileName(for: jobs[index].sourceURL, container: preset.container)
        persist()
    }

    func updateOutputDirectory(jobID: UUID, directory: URL) {
        guard let index = jobs.firstIndex(where: { $0.id == jobID }) else {
            return
        }

        jobs[index].outputDirectory = directory
        persist()
    }

    func updateEditDecisionList(jobID: UUID, editDecisionList: EditDecisionList) {
        guard let index = jobs.firstIndex(where: { $0.id == jobID }) else {
            return
        }

        jobs[index].editDecisionList = editDecisionList
        persist()
    }

    func addWatchFolderRule(
        sourceFolder: URL,
        destinationFolder: URL,
        presetID: String,
        includeSubfolders: Bool
    ) {
        let filters = WatchFolderFilters(includeSubfolders: includeSubfolders)
        let rule = WatchFolderRule(
            sourceFolder: sourceFolder,
            destinationFolder: destinationFolder,
            presetID: presetID,
            filters: filters
        )
        watchFolderRules.append(rule)
        persist()
    }

    func toggleWatchFolderRule(_ ruleID: UUID, isEnabled: Bool) {
        guard let index = watchFolderRules.firstIndex(where: { $0.id == ruleID }) else {
            return
        }
        watchFolderRules[index].isEnabled = isEnabled
        persist()
    }

    func removeWatchFolderRule(_ ruleID: UUID) {
        watchFolderRules.removeAll { $0.id == ruleID }
        observedFileSizes[ruleID] = nil
        persist()
    }

    func saveCustomPreset(_ preset: PresetDefinition) {
        if let index = customPresets.firstIndex(where: { $0.id == preset.id }) {
            customPresets[index] = preset
        } else {
            customPresets.append(preset)
        }
        persist()
    }

    func duplicatePreset(_ preset: PresetDefinition) {
        var duplicate = preset
        duplicate.id = "custom-\(UUID().uuidString)"
        duplicate.name = "\(preset.name) Copy"
        duplicate.mode = .custom
        duplicate.isBuiltIn = false
        saveCustomPreset(duplicate)
    }

    func deleteCustomPreset(_ presetID: String) {
        customPresets.removeAll { $0.id == presetID }
        for index in jobs.indices where jobs[index].presetID == presetID {
            jobs[index].presetID = PresetCatalog.defaultSpeedPreset().id
        }
        persist()
    }

    func updateDefaultOutputDirectory(_ directory: URL?) {
        settings.defaultOutputDirectory = directory
        persist()
    }

    func updateSettings(_ transform: (inout AppSettings) -> Void) {
        transform(&settings)
        persist()
        scheduleJobsIfNeeded()
    }

    func preset(for id: String) -> PresetDefinition? {
        PresetCatalog.preset(id: id, customPresets: customPresets)
    }

    private func analyzeJob(jobID: UUID) async {
        guard let toolchain,
              let index = jobs.firstIndex(where: { $0.id == jobID }) else {
            return
        }

        do {
            let mediaInfo = try await MediaProbeService(toolchain: toolchain).probe(url: jobs[index].sourceURL)
            if let latestIndex = jobs.firstIndex(where: { $0.id == jobID }) {
                let preset = preset(for: jobs[latestIndex].presetID) ?? PresetCatalog.recommendedPreset(for: mediaInfo)
                jobs[latestIndex].mediaInfo = mediaInfo
                jobs[latestIndex].presetID = preset.id
                jobs[latestIndex].outputFileName = OutputPathResolver.defaultFileName(for: jobs[latestIndex].sourceURL, container: preset.container)
                jobs[latestIndex].status = .ready
                jobs[latestIndex].logs.append("Analysis complete: \(mediaDescription(mediaInfo))")
                persist()
                scheduleJobsIfNeeded()
            }
        } catch {
            if let latestIndex = jobs.firstIndex(where: { $0.id == jobID }) {
                jobs[latestIndex].status = .failed
                jobs[latestIndex].lastError = error.localizedDescription
                jobs[latestIndex].logs.append(error.localizedDescription)
                persist()
            }
        }
    }

    private func scheduleJobsIfNeeded() {
        guard isQueueActive, ensureToolchain() else {
            return
        }

        while activeTasks.count < settings.scheduler.maxConcurrentJobs {
            guard let nextJob = jobs.first(where: { $0.status == .ready || $0.status == .retrying || $0.status == .queued }) else {
                break
            }
            launch(jobID: nextJob.id)
        }
    }

    private func launch(jobID: UUID) {
        guard activeTasks[jobID] == nil,
              let toolchain,
              let index = jobs.firstIndex(where: { $0.id == jobID }),
              let preset = preset(for: jobs[index].presetID) else {
            return
        }

        let job = jobs[index]
        let outputDirectory = job.outputDirectory ?? settings.defaultOutputDirectory ?? job.sourceURL.deletingLastPathComponent()
        guard let outputURL = OutputPathResolver.resolveUniqueOutputURL(
            preferredDirectory: outputDirectory,
            preferredFileName: job.outputFileName,
            policy: .increment
        ) else {
            jobs[index].status = .failed
            jobs[index].lastError = "Could not resolve output path."
            persist()
            return
        }

        let threads = recommendedThreadCount()

        let command: FFmpegCommand
        do {
            command = try FFmpegCommandBuilder.build(
                job: job,
                preset: preset,
                outputURL: outputURL,
                settings: settings,
                threads: threads
            )
        } catch {
            jobs[index].status = .failed
            jobs[index].lastError = error.localizedDescription
            persist()
            return
        }

        jobs[index].outputDirectory = outputDirectory
        jobs[index].outputFileName = outputURL.lastPathComponent
        jobs[index].commandLine = "\(toolchain.ffmpeg.path) \(command.displayCommand)"
        jobs[index].status = .running
        jobs[index].startedAt = .now
        jobs[index].completedAt = nil
        jobs[index].lastError = nil
        jobs[index].logs.append("Starting encode with preset \(preset.name).")
        persist()

        let duration = effectiveDuration(for: jobs[index])
        let task = Task {
            do {
                let metrics = try await encoderRunner.run(
                    jobID: jobID,
                    executable: toolchain.ffmpeg,
                    command: command,
                    totalDuration: duration,
                    onProgress: { [weak self] update in
                        Task { @MainActor in
                            self?.applyProgress(update, to: jobID)
                        }
                    },
                    onLog: { [weak self] line in
                        Task { @MainActor in
                            self?.appendLog(line, to: jobID)
                        }
                    }
                )

                finish(jobID: jobID, status: .completed, metrics: metrics, error: nil)
            } catch is CancellationError {
                finish(jobID: jobID, status: .cancelled, metrics: nil, error: "Encoding cancelled.")
            } catch {
                finish(jobID: jobID, status: .failed, metrics: nil, error: error.localizedDescription)
            }
        }

        activeTasks[jobID] = task
    }

    private func finish(jobID: UUID, status: EncodeJobStatus, metrics: EncodeMetrics?, error: String?) {
        activeTasks[jobID] = nil
        guard let index = jobs.firstIndex(where: { $0.id == jobID }) else {
            return
        }

        jobs[index].status = status
        jobs[index].completedAt = .now
        jobs[index].lastError = error
        jobs[index].progress = status == .completed ? 1 : jobs[index].progress
        if let metrics {
            jobs[index].metrics = metrics
        }
        if let error {
            jobs[index].logs.append(error)
        } else {
            jobs[index].logs.append("Finished successfully.")
        }
        persist()

        if settings.notifyOnCompletion {
            sendNotification(for: jobs[index], status: status)
        }

        scheduleJobsIfNeeded()
    }

    private func applyProgress(_ update: FFmpegProgressUpdate, to jobID: UUID) {
        guard let index = jobs.firstIndex(where: { $0.id == jobID }) else {
            return
        }

        if let fraction = update.fractionCompleted {
            jobs[index].progress = fraction
        }
        jobs[index].metrics.fps = update.fps
        jobs[index].metrics.bitrate = update.bitrate
        jobs[index].metrics.speedMultiplier = update.speedMultiplier
        jobs[index].metrics.elapsed = update.elapsedSeconds
    }

    private func appendLog(_ line: String, to jobID: UUID) {
        guard let index = jobs.firstIndex(where: { $0.id == jobID }) else {
            return
        }

        jobs[index].logs.append(line)
        if jobs[index].logs.count > 400 {
            jobs[index].logs.removeFirst(jobs[index].logs.count - 400)
        }
    }

    private func recommendedThreadCount() -> Int? {
        if let explicit = settings.scheduler.threadsPerJob, explicit > 0 {
            return explicit
        }

        let processors = max(1, ProcessInfo.processInfo.activeProcessorCount)
        let concurrent = max(1, settings.scheduler.maxConcurrentJobs)
        var recommended = processors / concurrent

        switch settings.scheduler.powerMode {
        case .speed:
            recommended = max(4, recommended)
        case .balanced:
            recommended = max(2, recommended - 1)
        case .efficiency:
            recommended = max(1, recommended / 2)
        }

        if settings.scheduler.thermalFallbackEnabled {
            switch ProcessInfo.processInfo.thermalState {
            case .serious, .critical:
                recommended = max(1, recommended / 2)
            default:
                break
            }
        }

        return recommended
    }

    private func effectiveDuration(for job: EncodeJob) -> Double? {
        let base = job.mediaInfo?.durationSeconds
        guard let base else {
            return nil
        }

        let trimStart = job.editDecisionList.trimStart ?? 0
        if let trimEnd = job.editDecisionList.trimEnd {
            return max(0, trimEnd - trimStart)
        }
        return max(0, base - trimStart)
    }

    private func mediaDescription(_ mediaInfo: MediaInfo) -> String {
        let resolution = [mediaInfo.width, mediaInfo.height]
            .compactMap { $0.map(String.init) }
            .joined(separator: "x")
        return [
            resolution.isEmpty ? nil : resolution,
            mediaInfo.videoCodec,
            mediaInfo.containerName,
        ]
        .compactMap { $0 }
        .joined(separator: " • ")
    }

    private func persist() {
        do {
            try persistence.save(
                PersistedState(
                    jobs: jobs,
                    customPresets: customPresets,
                    watchFolderRules: watchFolderRules,
                    settings: settings
                )
            )
        } catch {
            alertContext = AlertContext(title: "Save Failed", message: error.localizedDescription)
        }
    }

    private func pruneLogs() {
        let cutoff = Calendar.current.date(byAdding: .day, value: -settings.logRetentionDays, to: .now) ?? .distantPast
        jobs.removeAll { ($0.completedAt ?? .distantFuture) < cutoff && $0.status.isTerminal }
        persist()
    }

    private func ensureToolchain() -> Bool {
        if toolchain == nil {
            alertContext = AlertContext(title: "ffmpeg Missing", message: toolchainDescription)
            return false
        }
        return true
    }

    private func isSupportedVideo(_ url: URL) -> Bool {
        let supportedExtensions = ["mov", "mp4", "m4v", "mkv", "avi", "webm"]
        return supportedExtensions.contains(url.pathExtension.lowercased())
    }

    private func startWatchLoop() {
        watchTask?.cancel()
        watchTask = Task {
            while !Task.isCancelled {
                await scanWatchFoldersOnce()
                try? await Task.sleep(for: .seconds(5))
            }
        }
    }

    private func scanWatchFoldersOnce() async {
        for rule in watchFolderRules where rule.isEnabled {
            let candidates = enumeratedFiles(for: rule)
            var knownSizes = observedFileSizes[rule.id] ?? [:]

            for fileURL in candidates {
                let key = fileURL.standardizedFileURL.path
                let fileSize = ((try? fileManager.attributesOfItem(atPath: fileURL.path)[.size] as? NSNumber)?.int64Value) ?? 0
                defer { knownSizes[key] = fileSize }

                guard !jobs.contains(where: { $0.sourceURL.standardizedFileURL == fileURL.standardizedFileURL }) else {
                    continue
                }

                guard let previousSize = knownSizes[key], previousSize == fileSize else {
                    continue
                }

                importFiles([fileURL], presetID: rule.presetID, outputDirectory: rule.destinationFolder)
            }

            observedFileSizes[rule.id] = knownSizes
        }
    }

    private func enumeratedFiles(for rule: WatchFolderRule) -> [URL] {
        if rule.filters.includeSubfolders,
           let enumerator = fileManager.enumerator(
            at: rule.sourceFolder,
            includingPropertiesForKeys: [.isRegularFileKey],
            options: [.skipsHiddenFiles]
           ) {
            return enumerator.compactMap { $0 as? URL }.filter(isSupportedVideo)
        }

        let contents = (try? fileManager.contentsOfDirectory(
            at: rule.sourceFolder,
            includingPropertiesForKeys: [.isRegularFileKey],
            options: [.skipsHiddenFiles]
        )) ?? []
        return contents.filter(isSupportedVideo)
    }

    private func requestNotificationPermission() async {
        _ = try? await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound])
    }

    private func sendNotification(for job: EncodeJob, status: EncodeJobStatus) {
        let content = UNMutableNotificationContent()
        content.title = job.sourceURL.lastPathComponent
        content.body = status == .completed ? "AV1 encoding completed." : "AV1 encoding failed."
        content.sound = .default
        let request = UNNotificationRequest(identifier: job.id.uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request)
    }
}
