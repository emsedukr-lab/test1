import Foundation

public enum PresetCatalog {
    public static let builtInPresets: [PresetDefinition] = [
        PresetDefinition(
            id: "fast-av1",
            name: "Fast AV1",
            mode: .speedPriority,
            container: .mkv,
            crf: 36,
            preset: 10,
            pixelFormat: "yuv420p",
            enableFastDecode: true,
            tileColumns: 1,
            tileRows: 0,
            grainSynthesis: nil,
            audioMode: .preserve,
            estimatedSpeedClass: "Very High",
            estimatedQualityClass: "Good",
            isBuiltIn: true
        ),
        PresetDefinition(
            id: "balanced-av1",
            name: "Balanced AV1",
            mode: .balanced,
            container: .mkv,
            crf: 32,
            preset: 8,
            pixelFormat: "yuv420p10le",
            enableFastDecode: true,
            tileColumns: 1,
            tileRows: 0,
            grainSynthesis: nil,
            audioMode: .preserve,
            estimatedSpeedClass: "High",
            estimatedQualityClass: "Better",
            isBuiltIn: true
        ),
        PresetDefinition(
            id: "archive-av1",
            name: "Archive AV1",
            mode: .archive,
            container: .mkv,
            crf: 26,
            preset: 4,
            pixelFormat: "yuv420p10le",
            enableFastDecode: false,
            tileColumns: nil,
            tileRows: nil,
            grainSynthesis: 8,
            audioMode: .preserve,
            estimatedSpeedClass: "Medium",
            estimatedQualityClass: "Highest",
            isBuiltIn: true
        ),
    ]

    public static func allPresets(customPresets: [PresetDefinition]) -> [PresetDefinition] {
        builtInPresets + customPresets
    }

    public static func preset(id: String, customPresets: [PresetDefinition]) -> PresetDefinition? {
        allPresets(customPresets: customPresets).first(where: { $0.id == id })
    }

    public static func defaultSpeedPreset() -> PresetDefinition {
        builtInPresets[0]
    }

    public static func recommendedPreset(for mediaInfo: MediaInfo?) -> PresetDefinition {
        guard let mediaInfo else {
            return defaultSpeedPreset()
        }

        if mediaInfo.isHDR {
            return builtInPresets[1]
        }

        let width = mediaInfo.width ?? 0
        let height = mediaInfo.height ?? 0
        if max(width, height) >= 2160 {
            return builtInPresets[1]
        }

        return defaultSpeedPreset()
    }
}
