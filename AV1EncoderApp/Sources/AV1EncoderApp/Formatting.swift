import Foundation

enum UIFormatting {
    static func percent(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .percent
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: value)) ?? "0%"
    }

    static func byteCount(_ value: Int64?) -> String {
        guard let value else {
            return "n/a"
        }
        let formatter = ByteCountFormatter()
        formatter.countStyle = .file
        return formatter.string(fromByteCount: value)
    }

    static func duration(_ seconds: Double?) -> String {
        guard let seconds else {
            return "n/a"
        }
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = seconds >= 3600 ? [.hour, .minute, .second] : [.minute, .second]
        formatter.zeroFormattingBehavior = [.pad]
        return formatter.string(from: seconds) ?? "0:00"
    }

    static func date(_ date: Date?) -> String {
        guard let date else {
            return "n/a"
        }
        return date.formatted(date: .abbreviated, time: .shortened)
    }
}
