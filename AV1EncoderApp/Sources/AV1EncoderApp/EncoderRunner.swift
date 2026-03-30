import AV1Core
import Foundation

final class EncoderRunner {
    private let lock = NSLock()
    private var activeProcesses: [UUID: Process] = [:]

    func run(
        jobID: UUID,
        executable: URL,
        command: FFmpegCommand,
        totalDuration: Double?,
        onProgress: @escaping (FFmpegProgressUpdate) -> Void,
        onLog: @escaping (String) -> Void
    ) async throws -> EncodeMetrics {
        let process = Process()
        let stdoutPipe = Pipe()
        let stderrPipe = Pipe()
        let progressState = ProgressState(totalDuration: totalDuration)

        process.executableURL = executable
        process.arguments = command.arguments
        process.standardOutput = stdoutPipe
        process.standardError = stderrPipe

        register(process: process, for: jobID)

        let stdoutHandler = stdoutPipe.fileHandleForReading
        stdoutHandler.readabilityHandler = { handle in
            let data = handle.availableData
            guard !data.isEmpty else {
                return
            }

            let text = String(decoding: data, as: UTF8.self)
            progressState.consume(text: text, onProgress: onProgress)
        }

        let stderrHandler = stderrPipe.fileHandleForReading
        stderrHandler.readabilityHandler = { handle in
            let data = handle.availableData
            guard !data.isEmpty else {
                return
            }

            let text = String(decoding: data, as: UTF8.self)
            for rawLine in text.split(whereSeparator: \.isNewline) {
                onLog(String(rawLine))
            }
        }

        let startDate = Date()

        do {
            try process.run()
        } catch {
            clearProcess(for: jobID)
            stdoutHandler.readabilityHandler = nil
            stderrHandler.readabilityHandler = nil
            throw error
        }

        return try await withTaskCancellationHandler {
            let terminationStatus = try await withCheckedThrowingContinuation { continuation in
                process.terminationHandler = { process in
                    stdoutHandler.readabilityHandler = nil
                    stderrHandler.readabilityHandler = nil

                    let remainingStdout = stdoutHandler.readDataToEndOfFile()
                    if !remainingStdout.isEmpty {
                        let text = String(decoding: remainingStdout, as: UTF8.self)
                        progressState.consume(text: text, onProgress: onProgress)
                    }

                    let remainingStderr = stderrHandler.readDataToEndOfFile()
                    if !remainingStderr.isEmpty {
                        let text = String(decoding: remainingStderr, as: UTF8.self)
                        for rawLine in text.split(whereSeparator: \.isNewline) {
                            onLog(String(rawLine))
                        }
                    }

                    continuation.resume(returning: process.terminationStatus)
                }
            }

            clearProcess(for: jobID)

            if terminationStatus != 0 {
                throw EncoderRunnerError.encodingFailed("ffmpeg exited with code \(terminationStatus).")
            }

            let outputSize = (try? FileManager.default.attributesOfItem(atPath: command.outputURL.path)[.size] as? NSNumber)?.int64Value
            let elapsed = Date().timeIntervalSince(startDate)
            let latestUpdate = progressState.latestUpdate
            return EncodeMetrics(
                fps: latestUpdate.fps,
                bitrate: latestUpdate.bitrate,
                cpuUsage: nil,
                outputBytes: outputSize,
                elapsed: elapsed,
                estimatedRemaining: 0,
                speedMultiplier: latestUpdate.speedMultiplier
            )
        } onCancel: {
            self.cancel(jobID: jobID)
        }
    }

    func cancel(jobID: UUID) {
        lock.lock()
        let process = activeProcesses[jobID]
        lock.unlock()
        process?.terminate()
    }

    private func register(process: Process, for jobID: UUID) {
        lock.lock()
        activeProcesses[jobID] = process
        lock.unlock()
    }

    private func clearProcess(for jobID: UUID) {
        lock.lock()
        activeProcesses[jobID] = nil
        lock.unlock()
    }
}

private final class ProgressState {
    private let lock = NSLock()
    private var parser: FFmpegProgressParser
    private(set) var latestUpdate = FFmpegProgressUpdate()

    init(totalDuration: Double?) {
        parser = FFmpegProgressParser(totalDuration: totalDuration)
    }

    func consume(text: String, onProgress: (FFmpegProgressUpdate) -> Void) {
        for rawLine in text.split(whereSeparator: \.isNewline) {
            lock.lock()
            let update = parser.consume(line: String(rawLine))
            if let update {
                latestUpdate = update
            }
            lock.unlock()

            if let update {
                onProgress(update)
            }
        }
    }
}

enum EncoderRunnerError: LocalizedError {
    case encodingFailed(String)

    var errorDescription: String? {
        switch self {
        case .encodingFailed(let message):
            return message
        }
    }
}
