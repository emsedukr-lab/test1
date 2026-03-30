import Foundation

public struct EncodeJob: Identifiable, Codable, Hashable {
    public var id: UUID
    public var sourceURL: URL
    public var outputDirectory: URL?
    public var outputFileName: String
    public var presetID: String
    public var editDecisionList: EditDecisionList
    public var status: EncodeJobStatus
    public var progress: Double
    public var metrics: EncodeMetrics
    public var mediaInfo: MediaInfo?
    public var commandLine: String?
    public var logs: [String]
    public var createdAt: Date
    public var startedAt: Date?
    public var completedAt: Date?
    public var lastError: String?

    public init(
        id: UUID = UUID(),
        sourceURL: URL,
        outputDirectory: URL? = nil,
        outputFileName: String,
        presetID: String,
        editDecisionList: EditDecisionList = .init(),
        status: EncodeJobStatus = .queued,
        progress: Double = 0,
        metrics: EncodeMetrics = .init(),
        mediaInfo: MediaInfo? = nil,
        commandLine: String? = nil,
        logs: [String] = [],
        createdAt: Date = .now,
        startedAt: Date? = nil,
        completedAt: Date? = nil,
        lastError: String? = nil
    ) {
        self.id = id
        self.sourceURL = sourceURL
        self.outputDirectory = outputDirectory
        self.outputFileName = outputFileName
        self.presetID = presetID
        self.editDecisionList = editDecisionList
        self.status = status
        self.progress = progress
        self.metrics = metrics
        self.mediaInfo = mediaInfo
        self.commandLine = commandLine
        self.logs = logs
        self.createdAt = createdAt
        self.startedAt = startedAt
        self.completedAt = completedAt
        self.lastError = lastError
    }

    public var resolvedOutputURL: URL {
        let baseDirectory = outputDirectory ?? sourceURL.deletingLastPathComponent()
        return baseDirectory.appendingPathComponent(outputFileName)
    }
}

public enum EncodeJobStatus: String, Codable, CaseIterable, Hashable {
    case queued
    case analyzing
    case ready
    case running
    case waitingForFile
    case retrying
    case completed
    case failed
    case cancelled

    public var isTerminal: Bool {
        switch self {
        case .completed, .failed, .cancelled:
            return true
        default:
            return false
        }
    }

    public var displayName: String {
        rawValue.capitalized.replacingOccurrences(of: "For", with: " for ")
    }
}

public struct EditDecisionList: Codable, Hashable {
    public var trimStart: Double?
    public var trimEnd: Double?
    public var cropRect: CropRect?
    public var scale: ScaleDefinition?
    public var audioMode: AudioMode
    public var subtitleMode: SubtitleMode

    public init(
        trimStart: Double? = nil,
        trimEnd: Double? = nil,
        cropRect: CropRect? = nil,
        scale: ScaleDefinition? = nil,
        audioMode: AudioMode = .preserve,
        subtitleMode: SubtitleMode = .preserve
    ) {
        self.trimStart = trimStart
        self.trimEnd = trimEnd
        self.cropRect = cropRect
        self.scale = scale
        self.audioMode = audioMode
        self.subtitleMode = subtitleMode
    }
}

public struct CropRect: Codable, Hashable {
    public var x: Int
    public var y: Int
    public var width: Int
    public var height: Int

    public init(x: Int, y: Int, width: Int, height: Int) {
        self.x = x
        self.y = y
        self.width = width
        self.height = height
    }
}

public struct ScaleDefinition: Codable, Hashable {
    public var width: Int?
    public var height: Int?

    public init(width: Int? = nil, height: Int? = nil) {
        self.width = width
        self.height = height
    }
}

public enum AudioMode: String, Codable, CaseIterable, Hashable {
    case preserve
    case transcodeAAC
    case remove
}

public enum SubtitleMode: String, Codable, CaseIterable, Hashable {
    case preserve
    case remove
}

public struct EncodeMetrics: Codable, Hashable {
    public var fps: Double?
    public var bitrate: String?
    public var cpuUsage: Double?
    public var outputBytes: Int64?
    public var elapsed: Double?
    public var estimatedRemaining: Double?
    public var speedMultiplier: Double?

    public init(
        fps: Double? = nil,
        bitrate: String? = nil,
        cpuUsage: Double? = nil,
        outputBytes: Int64? = nil,
        elapsed: Double? = nil,
        estimatedRemaining: Double? = nil,
        speedMultiplier: Double? = nil
    ) {
        self.fps = fps
        self.bitrate = bitrate
        self.cpuUsage = cpuUsage
        self.outputBytes = outputBytes
        self.elapsed = elapsed
        self.estimatedRemaining = estimatedRemaining
        self.speedMultiplier = speedMultiplier
    }
}

public struct MediaInfo: Codable, Hashable {
    public var durationSeconds: Double
    public var containerName: String?
    public var videoCodec: String?
    public var width: Int?
    public var height: Int?
    public var frameRate: Double?
    public var audioCodecs: [String]
    public var subtitleCount: Int
    public var isHDR: Bool

    public init(
        durationSeconds: Double = 0,
        containerName: String? = nil,
        videoCodec: String? = nil,
        width: Int? = nil,
        height: Int? = nil,
        frameRate: Double? = nil,
        audioCodecs: [String] = [],
        subtitleCount: Int = 0,
        isHDR: Bool = false
    ) {
        self.durationSeconds = durationSeconds
        self.containerName = containerName
        self.videoCodec = videoCodec
        self.width = width
        self.height = height
        self.frameRate = frameRate
        self.audioCodecs = audioCodecs
        self.subtitleCount = subtitleCount
        self.isHDR = isHDR
    }
}

public struct PresetDefinition: Identifiable, Codable, Hashable {
    public var id: String
    public var name: String
    public var mode: PresetMode
    public var container: ContainerFormat
    public var crf: Int
    public var preset: Int
    public var pixelFormat: String
    public var enableFastDecode: Bool
    public var tileColumns: Int?
    public var tileRows: Int?
    public var grainSynthesis: Int?
    public var audioMode: AudioMode
    public var extraArguments: [String]
    public var estimatedSpeedClass: String
    public var estimatedQualityClass: String
    public var isBuiltIn: Bool

    public init(
        id: String,
        name: String,
        mode: PresetMode,
        container: ContainerFormat,
        crf: Int,
        preset: Int,
        pixelFormat: String,
        enableFastDecode: Bool,
        tileColumns: Int? = nil,
        tileRows: Int? = nil,
        grainSynthesis: Int? = nil,
        audioMode: AudioMode = .preserve,
        extraArguments: [String] = [],
        estimatedSpeedClass: String,
        estimatedQualityClass: String,
        isBuiltIn: Bool = false
    ) {
        self.id = id
        self.name = name
        self.mode = mode
        self.container = container
        self.crf = crf
        self.preset = preset
        self.pixelFormat = pixelFormat
        self.enableFastDecode = enableFastDecode
        self.tileColumns = tileColumns
        self.tileRows = tileRows
        self.grainSynthesis = grainSynthesis
        self.audioMode = audioMode
        self.extraArguments = extraArguments
        self.estimatedSpeedClass = estimatedSpeedClass
        self.estimatedQualityClass = estimatedQualityClass
        self.isBuiltIn = isBuiltIn
    }
}

public enum PresetMode: String, Codable, CaseIterable, Hashable {
    case speedPriority
    case balanced
    case archive
    case custom
}

public enum ContainerFormat: String, Codable, CaseIterable, Hashable {
    case mkv
    case mp4

    public var fileExtension: String {
        rawValue
    }
}

public struct WatchFolderRule: Identifiable, Codable, Hashable {
    public var id: UUID
    public var sourceFolder: URL
    public var destinationFolder: URL
    public var presetID: String
    public var filters: WatchFolderFilters
    public var conflictPolicy: ConflictPolicy
    public var isEnabled: Bool

    public init(
        id: UUID = UUID(),
        sourceFolder: URL,
        destinationFolder: URL,
        presetID: String,
        filters: WatchFolderFilters = .init(),
        conflictPolicy: ConflictPolicy = .increment,
        isEnabled: Bool = true
    ) {
        self.id = id
        self.sourceFolder = sourceFolder
        self.destinationFolder = destinationFolder
        self.presetID = presetID
        self.filters = filters
        self.conflictPolicy = conflictPolicy
        self.isEnabled = isEnabled
    }
}

public struct WatchFolderFilters: Codable, Hashable {
    public var allowedExtensions: [String]
    public var includeSubfolders: Bool
    public var minimumDurationSeconds: Double?

    public init(
        allowedExtensions: [String] = ["mp4", "mov", "mkv", "m4v", "avi"],
        includeSubfolders: Bool = false,
        minimumDurationSeconds: Double? = nil
    ) {
        self.allowedExtensions = allowedExtensions
        self.includeSubfolders = includeSubfolders
        self.minimumDurationSeconds = minimumDurationSeconds
    }
}

public struct SchedulerPolicy: Codable, Hashable {
    public var maxConcurrentJobs: Int
    public var threadsPerJob: Int?
    public var powerMode: PowerMode
    public var thermalFallbackEnabled: Bool

    public init(
        maxConcurrentJobs: Int = 2,
        threadsPerJob: Int? = nil,
        powerMode: PowerMode = .balanced,
        thermalFallbackEnabled: Bool = true
    ) {
        self.maxConcurrentJobs = maxConcurrentJobs
        self.threadsPerJob = threadsPerJob
        self.powerMode = powerMode
        self.thermalFallbackEnabled = thermalFallbackEnabled
    }
}

public enum PowerMode: String, Codable, CaseIterable, Hashable {
    case speed
    case balanced
    case efficiency
}

public enum ConflictPolicy: String, Codable, CaseIterable, Hashable {
    case increment
    case overwrite
    case skip
}

public struct AppSettings: Codable, Hashable {
    public var defaultOutputDirectory: URL?
    public var scheduler: SchedulerPolicy
    public var useHardwareDecoding: Bool
    public var notifyOnCompletion: Bool
    public var logRetentionDays: Int

    public init(
        defaultOutputDirectory: URL? = nil,
        scheduler: SchedulerPolicy = .init(),
        useHardwareDecoding: Bool = true,
        notifyOnCompletion: Bool = true,
        logRetentionDays: Int = 30
    ) {
        self.defaultOutputDirectory = defaultOutputDirectory
        self.scheduler = scheduler
        self.useHardwareDecoding = useHardwareDecoding
        self.notifyOnCompletion = notifyOnCompletion
        self.logRetentionDays = logRetentionDays
    }
}
