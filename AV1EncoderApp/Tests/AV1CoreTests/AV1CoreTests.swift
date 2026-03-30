import XCTest
@testable import AV1Core

final class AV1CoreTests: XCTestCase {
    func testBuildsFastPresetCommand() throws {
        let preset = PresetCatalog.defaultSpeedPreset()
        let job = EncodeJob(
            sourceURL: URL(fileURLWithPath: "/tmp/input.mov"),
            outputFileName: "input_av1.mkv",
            presetID: preset.id
        )
        let settings = AppSettings()
        let outputURL = URL(fileURLWithPath: "/tmp/input_av1.mkv")

        let command = try FFmpegCommandBuilder.build(
            job: job,
            preset: preset,
            outputURL: outputURL,
            settings: settings,
            threads: 6
        )

        XCTAssertTrue(command.arguments.contains("libsvtav1"))
        XCTAssertTrue(command.arguments.contains("videotoolbox"))
        XCTAssertTrue(command.arguments.contains("pipe:1"))
        XCTAssertTrue(command.arguments.contains("/tmp/input.mov"))
        XCTAssertTrue(command.arguments.contains("/tmp/input_av1.mkv"))
    }

    func testBuildsFilterGraphWhenEditing() throws {
        let preset = PresetCatalog.defaultSpeedPreset()
        let editDecisionList = EditDecisionList(
            trimStart: 1.5,
            trimEnd: 5.0,
            cropRect: CropRect(x: 10, y: 12, width: 1920, height: 800),
            scale: ScaleDefinition(width: 1280, height: 720),
            audioMode: .transcodeAAC,
            subtitleMode: .remove
        )
        let job = EncodeJob(
            sourceURL: URL(fileURLWithPath: "/tmp/input.mov"),
            outputFileName: "input_av1.mkv",
            presetID: preset.id,
            editDecisionList: editDecisionList
        )

        let command = try FFmpegCommandBuilder.build(
            job: job,
            preset: preset,
            outputURL: URL(fileURLWithPath: "/tmp/input_av1.mkv"),
            settings: AppSettings(useHardwareDecoding: false),
            threads: nil
        )

        XCTAssertTrue(command.arguments.contains("-vf"))
        XCTAssertTrue(command.arguments.contains("crop=1920:800:10:12,scale=1280:720:flags=lanczos"))
        XCTAssertTrue(command.arguments.contains("aac"))
        XCTAssertTrue(command.arguments.contains("-sn"))
    }

    func testParsesProgressBlocks() {
        var parser = FFmpegProgressParser(totalDuration: 20)
        _ = parser.consume(line: "frame=100")
        _ = parser.consume(line: "fps=54.3")
        _ = parser.consume(line: "bitrate=1800kbits/s")
        _ = parser.consume(line: "out_time_ms=5000000")
        _ = parser.consume(line: "speed=1.75x")
        let update = parser.consume(line: "progress=continue")

        XCTAssertEqual(update?.fractionCompleted, 0.25)
        XCTAssertEqual(update?.fps, 54.3)
        XCTAssertEqual(update?.bitrate, "1800kbits/s")
        XCTAssertEqual(update?.speedMultiplier, 1.75)
        XCTAssertEqual(update?.elapsedSeconds, 5.0)
    }

    func testIncrementsOutputPathOnCollision() {
        let result = OutputPathResolver.resolveUniqueOutputURL(
            preferredDirectory: URL(fileURLWithPath: "/tmp"),
            preferredFileName: "demo_av1.mkv",
            policy: .increment,
            fileExists: { url in
                let taken = [
                    "/tmp/demo_av1.mkv",
                    "/tmp/demo_av1-1.mkv",
                ]
                return taken.contains(url.path)
            }
        )

        XCTAssertEqual(result?.lastPathComponent, "demo_av1-2.mkv")
    }
}
