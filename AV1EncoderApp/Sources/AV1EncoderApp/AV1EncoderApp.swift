import SwiftUI

@main
struct AV1EncoderAppMain: App {
    @StateObject private var model = AppModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(model)
                .frame(minWidth: 1280, minHeight: 840)
        }
        .windowResizability(.contentSize)
    }
}
