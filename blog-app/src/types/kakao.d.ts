// Global type declarations for Kakao JavaScript SDK v2

interface KakaoAuth {
  login(settings: {
    success?: (authObj: KakaoAuthResponse) => void
    fail?: (error: KakaoError) => void
    scope?: string
    throughTalk?: boolean
    prompt?: string
  }): void
  logout(callback?: () => void): void
  getAccessToken(): string | null
  setAccessToken(token: string): void
}

interface KakaoAPI {
  request(settings: {
    url: string
    data?: Record<string, unknown>
    success?: (response: KakaoUserResponse) => void
    fail?: (error: KakaoError) => void
  }): void
}

interface KakaoAuthResponse {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
}

interface KakaoUserResponse {
  id: number
  kakao_account?: {
    profile?: {
      nickname?: string
      thumbnail_image_url?: string
      profile_image_url?: string
    }
    email?: string
  }
}

interface KakaoError {
  error: string
  error_description: string
}

interface KakaoSDK {
  init(appKey: string): void
  isInitialized(): boolean
  Auth: KakaoAuth
  API: KakaoAPI
}

declare global {
  interface Window {
    Kakao: KakaoSDK
  }
}

export {}
