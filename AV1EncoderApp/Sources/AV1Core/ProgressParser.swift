import Foundation

public struct FFmpegProgressUpdate: Equatable {
    public var fractionCompleted: Double?
    public var fps: Double?
    public var bitrate: String?
    public var speedMultiplier: Double?
    public var elapsedSeconds: Double?
    public var rawProgress: String?

    public init(
        fractionCompleted: Double? = nil,
        fps: Double? = nil,
        bitrate: String? = nil,
        speedMultiplier: Double? = nil,
        elapsedSeconds: Double? = nil,
        rawProgress: String? = nil
    ) {
        self.fractionCompleted = fractionCompleted
        self.fps = fps
        self.bitrate = bitrate
        self.speedMultiplier = speedMultiplier
        self.elapsedSeconds = elapsedSeconds
        self.rawProgress = rawProgress
    }
}

public struct FFmpegProgressParser {
    private let totalDuration: Double?
    private var values: [String: String] = [:]

    public init(totalDuration: Double?) {
        self.totalDuration = totalDuration
    }

    public mutating func consume(line: String) -> FFmpegProgressUpdate? {
        let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else {
            return nil
        }

        let components = trimmed.split(separator: "=", maxSplits: 1).map(String.init)
        guard components.count == 2 else {
            return nil
        }

        values[components[0]] = components[1]
        guard components[0] == "progress" else {
            return nil
        }

        let elapsedSeconds = Self.parseOutTime(values["out_time_ms"])
        let completion: Double?
        if let elapsedSeconds, let totalDuration, totalDuration > 0 {
            completion = min(max(elapsedSeconds / totalDuration, 0), 1)
        } else {
            completion = nil
        }

        return FFmpegProgressUpdate(
            fractionCompleted: completion,
            fps: Double(values["fps"] ?? ""),
            bitrate: values["bitrate"],
            speedMultiplier: Self.parseSpeed(values["speed"]),
            elapsedSeconds: elapsedSeconds,
            rawProgress: values["progress"]
        )
    }

    private static func parseOutTime(_ raw: String?) -> Double? {
        guard let raw, let milliseconds = Double(raw) else {
            return nil
        }
        return milliseconds / 1_000_000
    }

    private static func parseSpeed(_ raw: String?) -> Double? {
        guard let raw else {
            return nil
        }

        let normalized = raw.replacingOccurrences(of: "x", with: "")
        return Double(normalized)
    }
}
