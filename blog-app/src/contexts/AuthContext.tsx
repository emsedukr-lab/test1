import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { KakaoUser } from '../types'

interface AuthContextValue {
  user: KakaoUser | null
  isLoading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const AUTH_STORAGE_KEY = 'blog-auth-user'
const TOKEN_STORAGE_KEY = 'blog-auth-token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<KakaoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined
    if (!kakaoKey || kakaoKey === 'YOUR_KAKAO_JAVASCRIPT_KEY_HERE') {
      console.warn(
        '[Auth] VITE_KAKAO_JS_KEY가 설정되지 않았습니다.\n' +
        '카카오 개발자 센터(https://developers.kakao.com)에서 앱을 등록하고\n' +
        '.env 파일에 VITE_KAKAO_JS_KEY=발급받은_키 를 입력해주세요.'
      )
      setIsLoading(false)
      return
    }

    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey)
    }

    // 로컬스토리지에서 이전 세션 복원
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY)
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser) as KakaoUser)
        if (window.Kakao?.Auth) {
          window.Kakao.Auth.setAccessToken(savedToken)
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    setIsLoading(false)
  }, [])

  const login = useCallback(() => {
    if (!window.Kakao?.Auth) {
      alert('카카오 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.')
      return
    }

    window.Kakao.Auth.login({
      success: (authObj) => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res) => {
            const profile = res.kakao_account?.profile
            const kakaoUser: KakaoUser = {
              id: String(res.id),
              nickname: profile?.nickname ?? '사용자',
              profileImage: profile?.thumbnail_image_url,
            }
            setUser(kakaoUser)
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(kakaoUser))
            localStorage.setItem(TOKEN_STORAGE_KEY, authObj.access_token)
          },
          fail: (error) => {
            console.error('[Auth] 사용자 정보 조회 실패:', error)
            alert('사용자 정보를 가져오는 데 실패했습니다.')
          },
        })
      },
      fail: (error) => {
        // 사용자가 팝업을 닫은 경우는 정상 취소이므로 alert 생략
        console.error('[Auth] 카카오 로그인 실패:', error)
      },
    })
  }, [])

  const logout = useCallback(() => {
    if (window.Kakao?.Auth?.getAccessToken()) {
      window.Kakao.Auth.logout(() => {
        setUser(null)
        localStorage.removeItem(AUTH_STORAGE_KEY)
        localStorage.removeItem(TOKEN_STORAGE_KEY)
      })
    } else {
      setUser(null)
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다')
  }
  return context
}
