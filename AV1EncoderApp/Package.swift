// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "AV1EncoderApp",
    platforms: [
        .macOS(.v14),
    ],
    products: [
        .library(
            name: "AV1Core",
            targets: ["AV1Core"]
        ),
        .executable(
            name: "AV1EncoderApp",
            targets: ["AV1EncoderApp"]
        ),
    ],
    targets: [
        .target(
            name: "AV1Core"
        ),
        .executableTarget(
            name: "AV1EncoderApp",
            dependencies: ["AV1Core"]
        ),
        .testTarget(
            name: "AV1CoreTests",
            dependencies: ["AV1Core"]
        ),
    ]
)
