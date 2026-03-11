export interface Post {
  id: string
  title: string
  content: string       // 마크다운
  excerpt: string       // 요약 (150자 이내)
  category: string
  tags: string[]
  coverImage?: string   // URL (선택)
  authorName: string
  authorId?: string     // 카카오 사용자 ID (선택, 하위 호환)
  createdAt: string     // ISO 8601
  updatedAt: string     // ISO 8601
  likes: number
  viewCount: number
}

export interface Comment {
  id: string
  postId: string
  authorName: string
  authorId?: string     // 카카오 사용자 ID (선택, 하위 호환)
  content: string
  createdAt: string
}

export interface BlogStore {
  posts: Post[]
  comments: Comment[]
  bookmarks: string[]   // post ids
  likedPosts: string[]  // post ids
}

export interface KakaoUser {
  id: string            // 카카오 사용자 고유 ID (숫자를 문자열로 저장)
  nickname: string
  profileImage?: string
}
