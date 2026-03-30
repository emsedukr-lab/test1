import AV1Core
import Foundation

final class MediaProbeService {
    private let toolchain: AV1Toolchain

    init(toolchain: AV1Toolchain) {
        self.toolchain = toolchain
    }

    func probe(url: URL) async throws -> MediaInfo {
        let arguments = [
            "-v", "error",
            "-show_format",
            "-show_streams",
            "-of", "json",
            url.path,
        ]

        let result = try await ProcessRunner.run(executable: toolchain.ffprobe, arguments: arguments)
        guard result.exitCode == 0 else {
            let stderr = String(decoding: result.stderr, as: UTF8.self)
            throw MediaProbeError.probeFailed(stderr.isEmpty ? "Unknown ffprobe error." : stderr)
        }

        let payload = try JSONDecoder().decode(FFprobePayload.self, from: result.stdout)
        let videoStream = payload.streams.first(where: { $0.codecType == "video" })
        let audioCodecs = payload.streams
            .filter { $0.codecType == "audio" }
            .compactMap(\.codecName)
        let subtitleCount = payload.streams.filter { $0.codecType == "subtitle" }.count

        return MediaInfo(
            durationSeconds: Double(payload.format?.duration ?? "") ?? 0,
            containerName: payload.format?.formatName,
            videoCodec: videoStream?.codecName,
            width: videoStream?.width,
            height: videoStream?.height,
            frameRate: Self.frameRate(from: videoStream?.avgFrameRate),
            audioCodecs: audioCodecs,
            subtitleCount: subtitleCount,
            isHDR: Self.detectHDR(videoStream)
        )
    }

    private static func frameRate(from raw: String?) -> Double? {
        guard let raw, raw != "0/0" else {
            return nil
        }

        let components = raw.split(separator: "/").map(String.init)
        guard components.count == 2,
              let numerator = Double(components[0]),
              let denominator = Double(components[1]),
              denominator != 0 else {
            return nil
        }

        return numerator / denominator
    }

    private static func detectHDR(_ stream: FFprobeStream?) -> Bool {
        guard let stream else {
            return false
        }

        let markers = [
            stream.colorTransfer,
            stream.colorSpace,
            stream.colorPrimaries,
        ].compactMap { $0?.lowercased() }

        return markers.contains(where: { $0.contains("bt2020") || $0.contains("smpte2084") || $0.contains("arib-std-b67") })
    }
}

private struct FFprobePayload: Decodable {
    let streams: [FFprobeStream]
    let format: FFprobeFormat?
}

private struct FFprobeStream: Decodable {
    let codecType: String?
    let codecName: String?
    let width: Int?
    let height: Int?
    let avgFrameRate: String?
    let colorTransfer: String?
    let colorSpace: String?
    let colorPrimaries: String?

    enum CodingKeys: String, CodingKey {
        case codecType = "codec_type"
        case codecName = "codec_name"
        case width
        case height
        case avgFrameRate = "avg_frame_rate"
        case colorTransfer = "color_transfer"
        case colorSpace = "color_space"
        case colorPrimaries = "color_primaries"
    }
}

private struct FFprobeFormat: Decodable {
    let formatName: String?
    let duration: String?

    enum CodingKeys: String, CodingKey {
        case formatName = "format_name"
        case duration
    }
}

enum MediaProbeError: LocalizedError {
    case probeFailed(String)

    var errorDescription: String? {
        switch self {
        case .probeFailed(let message):
            return message
        }
    }
}
