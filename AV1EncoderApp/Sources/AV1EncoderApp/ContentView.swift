import AV1Core
import AVKit
import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        NavigationSplitView {
            List(AppModel.Section.allCases, selection: $model.selectedSection) { section in
                Label(section.title, systemImage: section.iconName)
                    .tag(Optional(section))
            }
            .navigationTitle("AV1 Encoder")
        } detail: {
            Group {
                switch model.selectedSection ?? .queue {
                case .queue:
                    QueueView()
                case .watchFolders:
                    WatchFoldersView()
                case .presets:
                    PresetsView()
                case .history:
                    HistoryView()
                case .settings:
                    SettingsView()
                }
            }
            .padding()
        }
        .alert(item: $model.alertContext) { alert in
            Alert(title: Text(alert.title), message: Text(alert.message), dismissButton: .default(Text("OK")))
        }
    }
}

private struct QueueView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        VStack(spacing: 16) {
            HStack(spacing: 12) {
                Button("Add Files") {
                    if let urls = PanelPicker.chooseFiles() {
                        model.importFiles(urls)
                    }
                }

                Button("Add Folder") {
                    if let url = PanelPicker.chooseFolder(prompt: "Choose a folder to import") {
                        model.importFolder(url)
                    }
                }

                Button("Start Queue") {
                    model.startQueue()
                }
                .buttonStyle(.borderedProminent)

                Button("Stop Running") {
                    model.stopRunningJobs()
                }

                Spacer()

                HStack(spacing: 8) {
                    Text("Active: \(model.runningJobs.count)")
                    Text("Queued: \(model.jobs.filter { $0.status == .ready || $0.status == .queued || $0.status == .analyzing }.count)")
                }
                .foregroundStyle(.secondary)
            }

            HSplitView {
                jobList
                    .frame(minWidth: 360)
                jobDetail
                    .frame(minWidth: 520)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .dropDestination(for: URL.self) { items, _ in
            model.importFiles(items)
            return true
        }
    }

    private var jobList: some View {
        List(selection: $model.selectedJobID) {
            if model.jobs.isEmpty {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Drop files here or choose Add Files.")
                        .font(.headline)
                    Text("Fast AV1 is used by default, then you can adjust edits, output folder, or expert settings from the detail panel.")
                        .foregroundStyle(.secondary)
                }
                .padding(.vertical, 24)
            } else {
                ForEach(model.jobs) { job in
                    JobRowView(job: job)
                        .tag(Optional(job.id))
                }
            }
        }
        .listStyle(.inset)
    }

    private var jobDetail: some View {
        Group {
            if let jobID = model.selectedJobID {
                JobDetailView(jobID: jobID)
            } else {
                ContentUnavailableView("Select a Job", systemImage: "video", description: Text("Choose a file from the queue to inspect presets, edits, and logs."))
            }
        }
        .padding(.leading, 12)
    }
}

private struct JobRowView: View {
    let job: EncodeJob

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(job.sourceURL.lastPathComponent)
                    .font(.headline)
                    .lineLimit(1)
                Spacer()
                Text(job.status.displayName)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(statusColor)
            }

            HStack(spacing: 12) {
                Text(job.outputFileName)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)

                if let fps = job.metrics.fps {
                    Text(String(format: "%.1f fps", fps))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            ProgressView(value: job.progress)
        }
        .padding(.vertical, 4)
    }

    private var statusColor: Color {
        switch job.status {
        case .completed:
            return .green
        case .failed, .cancelled:
            return .red
        case .running:
            return .orange
        default:
            return .secondary
        }
    }
}

private struct JobDetailView: View {
    @EnvironmentObject private var model: AppModel
    let jobID: UUID

    @State private var isEditing = false

    var body: some View {
        if let job = model.job(for: jobID) {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    VideoPreview(url: job.sourceURL)
                        .frame(height: 260)
                        .clipShape(RoundedRectangle(cornerRadius: 16))

                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(job.sourceURL.lastPathComponent)
                                .font(.title2.weight(.semibold))
                            Text(job.resolvedOutputURL.path)
                                .foregroundStyle(.secondary)
                                .textSelection(.enabled)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 8) {
                            Text(job.status.displayName)
                                .font(.headline)
                            Text(UIFormatting.percent(job.progress))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }

                    HStack(spacing: 12) {
                        Button("Edit") {
                            isEditing = true
                        }

                        Button("Choose Output Folder") {
                            if let url = PanelPicker.chooseFolder(prompt: "Choose output folder") {
                                model.updateOutputDirectory(jobID: job.id, directory: url)
                            }
                        }

                        if job.status == .running {
                            Button("Cancel") {
                                model.cancelJob(job.id)
                            }
                        } else {
                            Button(job.status.isTerminal ? "Retry" : "Start") {
                                model.startJob(job.id)
                            }
                            .buttonStyle(.borderedProminent)
                        }
                    }

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Preset")
                            .font(.headline)
                        Picker("Preset", selection: Binding(
                            get: { job.presetID },
                            set: { model.updatePreset(jobID: job.id, presetID: $0) }
                        )) {
                            ForEach(model.allPresets) { preset in
                                Text("\(preset.name) • \(preset.estimatedSpeedClass)")
                                    .tag(preset.id)
                            }
                        }
                        .pickerStyle(.menu)
                    }

                    metricsSection(job)
                    mediaSection(job)
                    editSection(job)
                    logSection(job)
                }
                .padding(.trailing, 12)
            }
            .sheet(isPresented: $isEditing) {
                EditJobSheet(job: job) { editDecisionList in
                    model.updateEditDecisionList(jobID: job.id, editDecisionList: editDecisionList)
                }
                .frame(minWidth: 680, minHeight: 620)
            }
        }
    }

    @ViewBuilder
    private func metricsSection(_ job: EncodeJob) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Metrics")
                .font(.headline)

            LazyVGrid(columns: [.init(.flexible()), .init(.flexible())], alignment: .leading, spacing: 12) {
                metricTile("Elapsed", UIFormatting.duration(job.metrics.elapsed))
                metricTile("Output Size", UIFormatting.byteCount(job.metrics.outputBytes))
                metricTile("FPS", job.metrics.fps.map { String(format: "%.1f", $0) } ?? "n/a")
                metricTile("Speed", job.metrics.speedMultiplier.map { String(format: "%.2fx", $0) } ?? "n/a")
            }
        }
    }

    @ViewBuilder
    private func mediaSection(_ job: EncodeJob) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Source")
                .font(.headline)

            if let mediaInfo = job.mediaInfo {
                LazyVGrid(columns: [.init(.flexible()), .init(.flexible())], alignment: .leading, spacing: 12) {
                    metricTile("Resolution", "\(mediaInfo.width ?? 0)x\(mediaInfo.height ?? 0)")
                    metricTile("Codec", mediaInfo.videoCodec ?? "n/a")
                    metricTile("Duration", UIFormatting.duration(mediaInfo.durationSeconds))
                    metricTile("Container", mediaInfo.containerName ?? "n/a")
                }
            } else {
                Text("Analyzing source metadata...")
                    .foregroundStyle(.secondary)
            }
        }
    }

    @ViewBuilder
    private func editSection(_ job: EncodeJob) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Edit Summary")
                .font(.headline)
            Text(FFmpegCommandBuilder.editSummary(for: job.editDecisionList))
                .foregroundStyle(.secondary)
        }
    }

    @ViewBuilder
    private func logSection(_ job: EncodeJob) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Execution")
                .font(.headline)

            if let commandLine = job.commandLine {
                Text(commandLine)
                    .font(.caption.monospaced())
                    .textSelection(.enabled)
                    .padding(10)
                    .background(.quaternary.opacity(0.4), in: RoundedRectangle(cornerRadius: 12))
            }

            ScrollView {
                Text(job.logs.joined(separator: "\n"))
                    .font(.caption.monospaced())
                    .textSelection(.enabled)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(10)
            }
            .frame(minHeight: 180)
            .background(.quaternary.opacity(0.4), in: RoundedRectangle(cornerRadius: 12))
        }
    }

    private func metricTile(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.body.weight(.medium))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(.quaternary.opacity(0.4), in: RoundedRectangle(cornerRadius: 12))
    }
}

private struct VideoPreview: View {
    let url: URL

    var body: some View {
        VideoPlayer(player: AVPlayer(url: url))
    }
}

private struct EditJobSheet: View {
    let job: EncodeJob
    let onSave: (EditDecisionList) -> Void

    @Environment(\.dismiss) private var dismiss

    @State private var trimStartText = ""
    @State private var trimEndText = ""
    @State private var cropXText = ""
    @State private var cropYText = ""
    @State private var cropWidthText = ""
    @State private var cropHeightText = ""
    @State private var scaleWidthText = ""
    @State private var scaleHeightText = ""
    @State private var audioMode: AudioMode = .preserve
    @State private var subtitleMode: SubtitleMode = .preserve

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text("Edit \(job.sourceURL.lastPathComponent)")
                .font(.title3.weight(.semibold))

            VideoPreview(url: job.sourceURL)
                .frame(height: 260)
                .clipShape(RoundedRectangle(cornerRadius: 16))

            Form {
                Section("Trim") {
                    TextField("Start seconds", text: $trimStartText)
                    TextField("End seconds", text: $trimEndText)
                }

                Section("Crop") {
                    TextField("X", text: $cropXText)
                    TextField("Y", text: $cropYText)
                    TextField("Width", text: $cropWidthText)
                    TextField("Height", text: $cropHeightText)
                }

                Section("Scale") {
                    TextField("Width", text: $scaleWidthText)
                    TextField("Height", text: $scaleHeightText)
                }

                Section("Streams") {
                    Picker("Audio", selection: $audioMode) {
                        ForEach(AudioMode.allCases, id: \.self) { mode in
                            Text(mode.rawValue).tag(mode)
                        }
                    }
                    Picker("Subtitles", selection: $subtitleMode) {
                        ForEach(SubtitleMode.allCases, id: \.self) { mode in
                            Text(mode.rawValue).tag(mode)
                        }
                    }
                }
            }

            HStack {
                Spacer()
                Button("Cancel") {
                    dismiss()
                }
                Button("Save") {
                    onSave(buildEditDecisionList())
                    dismiss()
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .padding(20)
        .onAppear {
            populate()
        }
    }

    private func populate() {
        trimStartText = job.editDecisionList.trimStart.map { String($0) } ?? ""
        trimEndText = job.editDecisionList.trimEnd.map { String($0) } ?? ""
        cropXText = job.editDecisionList.cropRect.map { String($0.x) } ?? ""
        cropYText = job.editDecisionList.cropRect.map { String($0.y) } ?? ""
        cropWidthText = job.editDecisionList.cropRect.map { String($0.width) } ?? ""
        cropHeightText = job.editDecisionList.cropRect.map { String($0.height) } ?? ""
        scaleWidthText = job.editDecisionList.scale?.width.map(String.init) ?? ""
        scaleHeightText = job.editDecisionList.scale?.height.map(String.init) ?? ""
        audioMode = job.editDecisionList.audioMode
        subtitleMode = job.editDecisionList.subtitleMode
    }

    private func buildEditDecisionList() -> EditDecisionList {
        let cropRect: CropRect?
        if let x = Int(cropXText),
           let y = Int(cropYText),
           let width = Int(cropWidthText),
           let height = Int(cropHeightText) {
            cropRect = CropRect(x: x, y: y, width: width, height: height)
        } else {
            cropRect = nil
        }

        let scale = ScaleDefinition(width: Int(scaleWidthText), height: Int(scaleHeightText))
        let normalizedScale = scale.width == nil && scale.height == nil ? nil : scale

        return EditDecisionList(
            trimStart: Double(trimStartText),
            trimEnd: Double(trimEndText),
            cropRect: cropRect,
            scale: normalizedScale,
            audioMode: audioMode,
            subtitleMode: subtitleMode
        )
    }
}

private struct WatchFoldersView: View {
    @EnvironmentObject private var model: AppModel

    @State private var sourceFolder: URL?
    @State private var destinationFolder: URL?
    @State private var selectedPresetID = PresetCatalog.defaultSpeedPreset().id
    @State private var includeSubfolders = false

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text("Watch Folders")
                .font(.largeTitle.weight(.semibold))

            HStack(spacing: 12) {
                Button("Source Folder") {
                    sourceFolder = PanelPicker.chooseFolder(prompt: "Choose folder to watch")
                }
                Text(sourceFolder?.path ?? "No source selected")
                    .foregroundStyle(.secondary)

                Button("Destination Folder") {
                    destinationFolder = PanelPicker.chooseFolder(prompt: "Choose output folder")
                }
                Text(destinationFolder?.path ?? "No destination selected")
                    .foregroundStyle(.secondary)
            }

            HStack(spacing: 12) {
                Picker("Preset", selection: $selectedPresetID) {
                    ForEach(model.allPresets) { preset in
                        Text(preset.name).tag(preset.id)
                    }
                }
                Toggle("Include Subfolders", isOn: $includeSubfolders)
                Button("Add Rule") {
                    guard let sourceFolder, let destinationFolder else {
                        return
                    }
                    model.addWatchFolderRule(
                        sourceFolder: sourceFolder,
                        destinationFolder: destinationFolder,
                        presetID: selectedPresetID,
                        includeSubfolders: includeSubfolders
                    )
                    self.sourceFolder = nil
                    self.destinationFolder = nil
                }
                .buttonStyle(.borderedProminent)
            }

            List {
                ForEach(model.watchFolderRules) { rule in
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            VStack(alignment: .leading) {
                                Text(rule.sourceFolder.path)
                                Text("to \(rule.destinationFolder.path)")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Toggle("Enabled", isOn: Binding(
                                get: { rule.isEnabled },
                                set: { model.toggleWatchFolderRule(rule.id, isEnabled: $0) }
                            ))
                            .toggleStyle(.switch)
                        }

                        HStack {
                            Text(model.preset(for: rule.presetID)?.name ?? rule.presetID)
                                .font(.caption)
                            if rule.filters.includeSubfolders {
                                Text("Recursive")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Button("Remove") {
                                model.removeWatchFolderRule(rule.id)
                            }
                        }
                    }
                    .padding(.vertical, 6)
                }
            }
            .listStyle(.inset)
        }
    }
}

private struct PresetsView: View {
    @EnvironmentObject private var model: AppModel
    @State private var selectedPresetID = PresetCatalog.defaultSpeedPreset().id
    @State private var isPresentingEditor = false

    var body: some View {
        HSplitView {
            List(selection: $selectedPresetID) {
                ForEach(model.allPresets) { preset in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(preset.name)
                        Text("\(preset.estimatedSpeedClass) • CRF \(preset.crf)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .tag(preset.id)
                }
            }
            .frame(minWidth: 260)

            VStack(alignment: .leading, spacing: 16) {
                if let preset = model.preset(for: selectedPresetID) {
                    Text(preset.name)
                        .font(.largeTitle.weight(.semibold))

                    LazyVGrid(columns: [.init(.flexible()), .init(.flexible())], alignment: .leading, spacing: 12) {
                        presetTile("Mode", preset.mode.rawValue)
                        presetTile("Container", preset.container.rawValue.uppercased())
                        presetTile("CRF", "\(preset.crf)")
                        presetTile("Preset", "\(preset.preset)")
                        presetTile("Pixel Format", preset.pixelFormat)
                        presetTile("Fast Decode", preset.enableFastDecode ? "Enabled" : "Off")
                    }

                    HStack {
                        Button("Duplicate") {
                            model.duplicatePreset(preset)
                        }
                        if !preset.isBuiltIn {
                            Button("Delete") {
                                model.deleteCustomPreset(preset.id)
                                selectedPresetID = PresetCatalog.defaultSpeedPreset().id
                            }
                        }
                        Spacer()
                        Button("New Custom Preset") {
                            isPresentingEditor = true
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
            }
            .padding(.leading, 20)
        }
        .sheet(isPresented: $isPresentingEditor) {
            PresetEditorSheet { preset in
                model.saveCustomPreset(preset)
                selectedPresetID = preset.id
            }
            .frame(width: 460, height: 500)
        }
    }

    private func presetTile(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(value)
        }
        .padding(12)
        .background(.quaternary.opacity(0.4), in: RoundedRectangle(cornerRadius: 12))
    }
}

private struct PresetEditorSheet: View {
    let onSave: (PresetDefinition) -> Void

    @Environment(\.dismiss) private var dismiss

    @State private var name = ""
    @State private var mode: PresetMode = .custom
    @State private var container: ContainerFormat = .mkv
    @State private var crf = 32
    @State private var presetValue = 8
    @State private var pixelFormat = "yuv420p10le"
    @State private var fastDecode = true
    @State private var speedClass = "Custom"
    @State private var qualityClass = "Custom"

    var body: some View {
        Form {
            TextField("Name", text: $name)
            Picker("Container", selection: $container) {
                ForEach(ContainerFormat.allCases, id: \.self) { item in
                    Text(item.rawValue.uppercased()).tag(item)
                }
            }
            Stepper("CRF \(crf)", value: $crf, in: 0...63)
            Stepper("Preset \(presetValue)", value: $presetValue, in: 0...13)
            TextField("Pixel Format", text: $pixelFormat)
            Toggle("Fast Decode", isOn: $fastDecode)
            TextField("Speed Label", text: $speedClass)
            TextField("Quality Label", text: $qualityClass)
        }
        .padding(20)
        .overlay(alignment: .bottomTrailing) {
            HStack {
                Button("Cancel") {
                    dismiss()
                }
                Button("Save") {
                    onSave(
                        PresetDefinition(
                            id: "custom-\(UUID().uuidString)",
                            name: name.isEmpty ? "Custom Preset" : name,
                            mode: mode,
                            container: container,
                            crf: crf,
                            preset: presetValue,
                            pixelFormat: pixelFormat,
                            enableFastDecode: fastDecode,
                            audioMode: .preserve,
                            estimatedSpeedClass: speedClass,
                            estimatedQualityClass: qualityClass,
                            isBuiltIn: false
                        )
                    )
                    dismiss()
                }
                .buttonStyle(.borderedProminent)
            }
            .padding(20)
        }
    }
}

private struct HistoryView: View {
    @EnvironmentObject private var model: AppModel
    @State private var selectedHistoryID: UUID?

    var body: some View {
        HSplitView {
            List(selection: $selectedHistoryID) {
                ForEach(model.historyJobs) { job in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(job.sourceURL.lastPathComponent)
                        Text("\(job.status.displayName) • \(UIFormatting.date(job.completedAt))")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .tag(Optional(job.id))
                }
            }
            .frame(minWidth: 300)

            Group {
                if let selectedHistoryID, let job = model.job(for: selectedHistoryID) {
                    VStack(alignment: .leading, spacing: 16) {
                        Text(job.sourceURL.lastPathComponent)
                            .font(.title2.weight(.semibold))
                        Text(job.lastError ?? "Completed successfully.")
                            .foregroundStyle(job.status == .completed ? Color.secondary : Color.red)
                        Button("Requeue") {
                            model.retryJob(job.id)
                        }
                        .buttonStyle(.borderedProminent)
                        Spacer()
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                } else {
                    ContentUnavailableView("No History Selected", systemImage: "clock.arrow.circlepath")
                }
            }
            .padding(.leading, 20)
        }
    }
}

private struct SettingsView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        Form {
            Section("Output") {
                HStack {
                    Text(model.settings.defaultOutputDirectory?.path ?? "Same as source folder")
                        .foregroundStyle(.secondary)
                    Spacer()
                    Button("Choose") {
                        let folder = PanelPicker.chooseFolder(prompt: "Choose default output folder")
                        model.updateDefaultOutputDirectory(folder)
                    }
                }
            }

            Section("Queue") {
                Stepper(
                    "Concurrent Jobs: \(model.settings.scheduler.maxConcurrentJobs)",
                    value: Binding(
                        get: { model.settings.scheduler.maxConcurrentJobs },
                        set: { newValue in
                            model.updateSettings { $0.scheduler.maxConcurrentJobs = newValue }
                        }
                    ),
                    in: 1...4
                )

                Picker(
                    "Power Mode",
                    selection: Binding(
                        get: { model.settings.scheduler.powerMode },
                        set: { newValue in
                            model.updateSettings { $0.scheduler.powerMode = newValue }
                        }
                    )
                ) {
                    ForEach(PowerMode.allCases, id: \.self) { mode in
                        Text(mode.rawValue.capitalized).tag(mode)
                    }
                }

                Toggle(
                    "Thermal Fallback",
                    isOn: Binding(
                        get: { model.settings.scheduler.thermalFallbackEnabled },
                        set: { newValue in
                            model.updateSettings { $0.scheduler.thermalFallbackEnabled = newValue }
                        }
                    )
                )
            }

            Section("Processing") {
                Toggle(
                    "Use Hardware Decoding",
                    isOn: Binding(
                        get: { model.settings.useHardwareDecoding },
                        set: { newValue in
                            model.updateSettings { $0.useHardwareDecoding = newValue }
                        }
                    )
                )
                Toggle(
                    "Completion Notifications",
                    isOn: Binding(
                        get: { model.settings.notifyOnCompletion },
                        set: { newValue in
                            model.updateSettings { $0.notifyOnCompletion = newValue }
                        }
                    )
                )
                Stepper(
                    "Log Retention: \(model.settings.logRetentionDays) days",
                    value: Binding(
                        get: { model.settings.logRetentionDays },
                        set: { newValue in
                            model.updateSettings { $0.logRetentionDays = newValue }
                        }
                    ),
                    in: 1...365
                )
            }

            Section("Toolchain") {
                Text(model.toolchainDescription)
                    .textSelection(.enabled)
            }
        }
        .formStyle(.grouped)
    }
}
