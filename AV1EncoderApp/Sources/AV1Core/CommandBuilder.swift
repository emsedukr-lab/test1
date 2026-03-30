import Foundation

public struct FFmpegCommand: Hashable {
    public var arguments: [String]
    public var outputURL: URL

    public init(arguments: [String], outputURL: URL) {
        self.arguments = arguments
        self.outputURL = outputURL
    }

    public var displayCommand: String {
        arguments.map(Self.shellEscape).joined(separator: " ")
    }

    private static func shellEscape(_ token: String) -> String {
        guard token.contains(where: { $0 == " " || $0 == "\"" || $0 == "'" }) else {
            return token
        }

        return "'" + token.replacingOccurrences(of: "'", with: "'\"'\"'") + "'"
    }
}

public enum FFmpegCommandBuilder {
    public static func build(
        job: EncodeJob,
        preset: PresetDefinition,
        outputURL: URL,
        settings: AppSettings,
        threads: Int? = nil
    ) throws -> FFmpegCommand {
        var arguments: [String] = [
            "-hide_banner",
            "-nostats",
            "-progress", "pipe:1",
        ]

        if settings.useHardwareDecoding {
            arguments += ["-hwaccel", "videotoolbox"]
        }

        if let trimStart = job.editDecisionList.trimStart, trimStart > 0 {
            arguments += ["-ss", format(seconds: trimStart)]
        }

        arguments += ["-i", job.sourceURL.path]

        if let trimEnd = job.editDecisionList.trimEnd {
            let trimStart = job.editDecisionList.trimStart ?? 0
            let duration = trimEnd - trimStart
            guard duration > 0 else {
                throw CommandBuilderError.invalidTrimRange
            }
            arguments += ["-t", format(seconds: duration)]
        }

        arguments += ["-map", "0:v:0"]

        let filterGraph = buildFilterGraph(from: job.editDecisionList)
        if !filterGraph.isEmpty {
            arguments += ["-vf", filterGraph]
        }

        arguments += [
            "-c:v", "libsvtav1",
            "-preset", "\(preset.preset)",
            "-crf", "\(preset.crf)",
            "-pix_fmt", preset.pixelFormat,
        ]

        var svtParameters: [String] = []
        if preset.enableFastDecode {
            svtParameters.append("fast-decode=1")
        }
        if let tileColumns = preset.tileColumns {
            svtParameters.append("tile-columns=\(tileColumns)")
        }
        if let tileRows = preset.tileRows {
            svtParameters.append("tile-rows=\(tileRows)")
        }
        if let grain = preset.grainSynthesis {
            svtParameters.append("film-grain=\(grain)")
        }
        if !svtParameters.isEmpty {
            arguments += ["-svtav1-params", svtParameters.joined(separator: ":")]
        }

        arguments += resolveAudioArguments(jobAudioMode: job.editDecisionList.audioMode, presetAudioMode: preset.audioMode)
        arguments += resolveSubtitleArguments(jobSubtitleMode: job.editDecisionList.subtitleMode)

        if let threads, threads > 0 {
            arguments += ["-threads", "\(threads)"]
        }

        arguments += preset.extraArguments

        if preset.container == .mp4 {
            arguments += ["-movflags", "+faststart"]
        }

        arguments += ["-y", outputURL.path]
        return FFmpegCommand(arguments: arguments, outputURL: outputURL)
    }

    public static func editSummary(for editDecisionList: EditDecisionList) -> String {
        var parts: [String] = []

        if let trimStart = editDecisionList.trimStart {
            if let trimEnd = editDecisionList.trimEnd {
                parts.append("Trim \(format(seconds: trimStart))-\(format(seconds: trimEnd))")
            } else {
                parts.append("Trim from \(format(seconds: trimStart))")
            }
        }

        if let crop = editDecisionList.cropRect {
            parts.append("Crop \(crop.width)x\(crop.height)+\(crop.x)+\(crop.y)")
        }

        if let scale = editDecisionList.scale {
            let width = scale.width.map(String.init) ?? "auto"
            let height = scale.height.map(String.init) ?? "auto"
            parts.append("Scale \(width)x\(height)")
        }

        if editDecisionList.audioMode != .preserve {
            parts.append("Audio \(editDecisionList.audioMode.rawValue)")
        }

        if editDecisionList.subtitleMode != .preserve {
            parts.append("Subtitles removed")
        }

        return parts.isEmpty ? "No edits" : parts.joined(separator: " • ")
    }

    private static func buildFilterGraph(from editDecisionList: EditDecisionList) -> String {
        var filters: [String] = []

        if let cropRect = editDecisionList.cropRect {
            filters.append("crop=\(cropRect.width):\(cropRect.height):\(cropRect.x):\(cropRect.y)")
        }

        if let scale = editDecisionList.scale {
            let width = scale.width.map(String.init) ?? "-2"
            let height = scale.height.map(String.init) ?? "-2"
            filters.append("scale=\(width):\(height):flags=lanczos")
        }

        return filters.joined(separator: ",")
    }

    private static func resolveAudioArguments(jobAudioMode: AudioMode, presetAudioMode: AudioMode) -> [String] {
        let resolvedMode = jobAudioMode == .preserve ? presetAudioMode : jobAudioMode
        switch resolvedMode {
        case .preserve:
            return ["-map", "0:a?", "-c:a", "copy"]
        case .transcodeAAC:
            return ["-map", "0:a?", "-c:a", "aac", "-b:a", "192k"]
        case .remove:
            return ["-an"]
        }
    }

    private static func resolveSubtitleArguments(jobSubtitleMode: SubtitleMode) -> [String] {
        switch jobSubtitleMode {
        case .preserve:
            return ["-map", "0:s?", "-c:s", "copy"]
        case .remove:
            return ["-sn"]
        }
    }

    private static func format(seconds: Double) -> String {
        String(format: "%.3f", seconds)
    }
}

public enum CommandBuilderError: LocalizedError {
    case invalidTrimRange

    public var errorDescription: String? {
        switch self {
        case .invalidTrimRange:
            return "Trim end must be greater than trim start."
        }
    }
}
