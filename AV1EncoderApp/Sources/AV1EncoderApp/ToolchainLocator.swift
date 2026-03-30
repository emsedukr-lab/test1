import Foundation

struct AV1Toolchain {
    let ffmpeg: URL
    let ffprobe: URL
}

enum ToolchainLocator {
    static func locate() throws -> AV1Toolchain {
        let ffmpegCandidates = candidates(named: "ffmpeg")
        let ffprobeCandidates = candidates(named: "ffprobe")

        guard let ffmpegURL = ffmpegCandidates.first(where: fileExists),
              let ffprobeURL = ffprobeCandidates.first(where: fileExists) else {
            throw ToolchainLocatorError.missingBinary
        }

        return AV1Toolchain(ffmpeg: ffmpegURL, ffprobe: ffprobeURL)
    }

    private static func candidates(named tool: String) -> [URL] {
        var urls: [URL] = []

        if let resourceURL = Bundle.main.resourceURL {
            urls.append(resourceURL.appendingPathComponent("Tools/\(tool)"))
            urls.append(resourceURL.appendingPathComponent(tool))
        }

        let environmentPaths = (ProcessInfo.processInfo.environment["PATH"] ?? "")
            .split(separator: ":")
            .map(String.init)
        for path in environmentPaths {
            urls.append(URL(fileURLWithPath: path).appendingPathComponent(tool))
        }

        urls.append(URL(fileURLWithPath: "/opt/homebrew/bin/\(tool)"))
        urls.append(URL(fileURLWithPath: "/usr/local/bin/\(tool)"))
        urls.append(URL(fileURLWithPath: "/usr/bin/\(tool)"))
        return urls
    }

    private static func fileExists(at url: URL) -> Bool {
        FileManager.default.isExecutableFile(atPath: url.path)
    }
}

enum ToolchainLocatorError: LocalizedError {
    case missingBinary

    var errorDescription: String? {
        "ffmpeg/ffprobe were not found. Install them with Homebrew or bundle binaries into Resources/Tools."
    }
}
