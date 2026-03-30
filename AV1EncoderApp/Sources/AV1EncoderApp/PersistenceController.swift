import AV1Core
import Foundation

struct PersistedState: Codable {
    var jobs: [EncodeJob]
    var customPresets: [PresetDefinition]
    var watchFolderRules: [WatchFolderRule]
    var settings: AppSettings

    static let empty = PersistedState(
        jobs: [],
        customPresets: [],
        watchFolderRules: [],
        settings: .init()
    )
}

final class PersistenceController {
    private let stateURL: URL
    private let fileManager: FileManager

    init(fileManager: FileManager = .default) {
        self.fileManager = fileManager

        let appSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        let directory = appSupport.appendingPathComponent("AV1EncoderApp", isDirectory: true)
        try? fileManager.createDirectory(at: directory, withIntermediateDirectories: true)
        self.stateURL = directory.appendingPathComponent("state.json")
    }

    func load() -> PersistedState {
        guard fileManager.fileExists(atPath: stateURL.path),
              let data = try? Data(contentsOf: stateURL),
              let decoded = try? JSONDecoder().decode(PersistedState.self, from: data) else {
            return .empty
        }

        return decoded
    }

    func save(_ state: PersistedState) throws {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        let data = try encoder.encode(state)
        try data.write(to: stateURL, options: .atomic)
    }
}
