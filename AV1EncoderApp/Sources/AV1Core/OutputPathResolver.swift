import Foundation

public enum OutputPathResolver {
    public static func defaultFileName(for sourceURL: URL, container: ContainerFormat) -> String {
        let baseName = sourceURL.deletingPathExtension().lastPathComponent
        return "\(baseName)_av1.\(container.fileExtension)"
    }

    public static func resolveUniqueOutputURL(
        preferredDirectory: URL,
        preferredFileName: String,
        policy: ConflictPolicy,
        fileExists: (URL) -> Bool = { FileManager.default.fileExists(atPath: $0.path) }
    ) -> URL? {
        let preferredURL = preferredDirectory.appendingPathComponent(preferredFileName)
        if !fileExists(preferredURL) {
            return preferredURL
        }

        switch policy {
        case .overwrite:
            return preferredURL
        case .skip:
            return nil
        case .increment:
            let baseName = preferredURL.deletingPathExtension().lastPathComponent
            let fileExtension = preferredURL.pathExtension
            for index in 1...9_999 {
                let candidateName = "\(baseName)-\(index).\(fileExtension)"
                let candidateURL = preferredDirectory.appendingPathComponent(candidateName)
                if !fileExists(candidateURL) {
                    return candidateURL
                }
            }
            return nil
        }
    }
}
