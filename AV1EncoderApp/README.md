# AV1EncoderApp

macOS 전용 AV1 인코딩 앱입니다. SwiftUI 기반 UI와 `ffmpeg`/`ffprobe` 실행 엔진을 결합해, 단일 파일과 배치 큐, 기본 편집, 폴더 감시, 커스텀 프리셋을 지원합니다.

## 현재 구현 범위

- SwiftUI 네이티브 macOS 앱 셸
- 파일 추가, 폴더 가져오기, 작업 큐 관리
- `ffprobe` 기반 미디어 분석
- `libsvtav1` 기반 AV1 인코딩
- `videotoolbox` 하드웨어 디코드 옵션
- 트림, 크롭, 리사이즈, 오디오/자막 보존 정책
- 프리셋 3종 + 사용자 정의 프리셋
- 폴더 감시 후 자동 큐 적재
- 로컬 JSON 상태 저장
- 작업 로그와 완료 알림

## 요구 사항

- macOS 14+
- Xcode 또는 최신 Swift toolchain
- `ffmpeg`와 `ffprobe`

Homebrew 예시:

```bash
brew install ffmpeg
```

`ffmpeg`는 `libsvtav1` 지원 빌드여야 합니다.

## 빌드

```bash
cd /Users/chungji/AV1EncoderApp
swift build
```

## 실행

```bash
cd /Users/chungji/AV1EncoderApp
swift run AV1EncoderApp
```

## 참고

- 현재 환경에서는 Swift Package 테스트용 `XCTest` 모듈이 Command Line Tools에서 제공되지 않아 `swift test` 검증은 보류했습니다.
- 앱은 우선 시스템 경로의 `ffmpeg`/`ffprobe`를 찾고, 없으면 앱 번들 `Resources/Tools` 경로를 찾습니다.
