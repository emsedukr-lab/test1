import type { Post, Comment, BlogStore } from '../types'

const STORAGE_KEY = 'blog-store'

function getStore(): BlogStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initStore()
    return JSON.parse(raw) as BlogStore
  } catch {
    return initStore()
  }
}

function saveStore(store: BlogStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function initStore(): BlogStore {
  const store: BlogStore = {
    posts: getSamplePosts(),
    comments: getSampleComments(),
    bookmarks: [],
    likedPosts: [],
  }
  saveStore(store)
  return store
}

// ── Posts ──────────────────────────────────────────────

export function getAllPosts(): Post[] {
  return getStore().posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getPostById(id: string): Post | undefined {
  return getStore().posts.find(p => p.id === id)
}

export function createPost(
  data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'viewCount'>
): Post {
  const store = getStore()
  const now = new Date().toISOString()
  const post: Post = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    likes: 0,
    viewCount: 0,
  }
  store.posts.push(post)
  saveStore(store)
  return post
}

export function updatePost(id: string, data: Partial<Omit<Post, 'id' | 'createdAt'>>): Post | null {
  const store = getStore()
  const idx = store.posts.findIndex(p => p.id === id)
  if (idx === -1) return null
  store.posts[idx] = { ...store.posts[idx], ...data, updatedAt: new Date().toISOString() }
  saveStore(store)
  return store.posts[idx]
}

export function deletePost(id: string): void {
  const store = getStore()
  store.posts = store.posts.filter(p => p.id !== id)
  store.comments = store.comments.filter(c => c.postId !== id)
  saveStore(store)
}

// ── Comments ───────────────────────────────────────────

export function getCommentsByPostId(postId: string): Comment[] {
  return getStore().comments.filter(c => c.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function addComment(data: Omit<Comment, 'id' | 'createdAt'>): Comment {
  const store = getStore()
  const comment: Comment = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  store.comments.push(comment)
  saveStore(store)
  return comment
}

export function deleteComment(id: string): void {
  const store = getStore()
  store.comments = store.comments.filter(c => c.id !== id)
  saveStore(store)
}

// ── Likes ──────────────────────────────────────────────

export function toggleLike(postId: string): { liked: boolean; count: number } {
  const store = getStore()
  const isLiked = store.likedPosts.includes(postId)
  if (isLiked) {
    store.likedPosts = store.likedPosts.filter(id => id !== postId)
  } else {
    store.likedPosts.push(postId)
  }
  const postIdx = store.posts.findIndex(p => p.id === postId)
  if (postIdx !== -1) {
    store.posts[postIdx].likes += isLiked ? -1 : 1
  }
  saveStore(store)
  return { liked: !isLiked, count: store.posts[postIdx]?.likes ?? 0 }
}

export function isLiked(postId: string): boolean {
  return getStore().likedPosts.includes(postId)
}

// ── Bookmarks ──────────────────────────────────────────

export function toggleBookmark(postId: string): boolean {
  const store = getStore()
  const isBookmarked = store.bookmarks.includes(postId)
  if (isBookmarked) {
    store.bookmarks = store.bookmarks.filter(id => id !== postId)
  } else {
    store.bookmarks.push(postId)
  }
  saveStore(store)
  return !isBookmarked
}

export function isBookmarked(postId: string): boolean {
  return getStore().bookmarks.includes(postId)
}

export function getBookmarkedPosts(): Post[] {
  const store = getStore()
  return store.posts.filter(p => store.bookmarks.includes(p.id))
}

// ── Tags ───────────────────────────────────────────────

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set(posts.flatMap(p => p.tags))
  return Array.from(tagSet).sort()
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter(p => p.tags.includes(tag))
}

// ── Categories ─────────────────────────────────────────

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const catSet = new Set(posts.map(p => p.category))
  return Array.from(catSet).sort()
}

// ── Views ──────────────────────────────────────────────

export function recordView(postId: string): void {
  const store = getStore()
  const idx = store.posts.findIndex(p => p.id === postId)
  if (idx !== -1) {
    store.posts[idx].viewCount = (store.posts[idx].viewCount ?? 0) + 1
    saveStore(store)
  }
}

// ── Sample Data ────────────────────────────────────────

function getSamplePosts(): Post[] {
  return [
    {
      id: 'post-1',
      title: 'React 19의 새로운 기능들',
      content: `# React 19의 새로운 기능들\n\nReact 19가 출시되면서 많은 새로운 기능이 추가되었습니다.\n\n## 주요 변경사항\n\n### 1. Actions\n\n비동기 함수를 자동으로 처리하는 Actions가 도입되었습니다.\n\n\`\`\`tsx\nfunction UpdateName() {\n  const [error, submitAction, isPending] = useActionState(\n    async (prev, formData) => {\n      const name = formData.get('name')\n      await updateName(name)\n      return null\n    },\n    null\n  )\n  return (\n    <form action={submitAction}>\n      <input type="text" name="name" />\n      <button disabled={isPending}>업데이트</button>\n      {error && <p>{error}</p>}\n    </form>\n  )\n}\n\`\`\`\n\n### 2. use() Hook\n\nPromise와 Context를 조건부로 읽을 수 있는 새로운 hook입니다.\n\n## 결론\n\nReact 19는 개발자 경험을 크게 향상시켰습니다.`,
      excerpt: 'React 19가 출시되면서 많은 새로운 기능이 추가되었습니다. Actions, use() Hook 등 주요 변경사항을 살펴봅니다.',
      category: '프론트엔드',
      tags: ['React', 'JavaScript', '웹개발'],
      authorName: '김개발',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 42,
      viewCount: 120,
    },
    {
      id: 'post-2',
      title: 'TypeScript 5.8 새 기능 소개',
      content: `# TypeScript 5.8 새 기능 소개\n\nTypeScript 5.8이 출시되었습니다.\n\n## 주요 기능\n\n### Granular Checks for Branches\n\n이제 조건부 반환에서 더 정확한 타입 체크가 가능합니다.\n\n\`\`\`typescript\nfunction getValue(condition: boolean): string | number {\n  if (condition) {\n    return "hello"  // string\n  }\n  return 42  // number\n}\n\`\`\`\n\n### require() 지원 개선\n\nESM과 CJS 모듈 간의 호환성이 개선되었습니다.`,
      excerpt: 'TypeScript 5.8의 새로운 기능들을 소개합니다. Granular Checks, require() 지원 개선 등을 다룹니다.',
      category: '언어',
      tags: ['TypeScript', '프로그래밍'],
      authorName: '이타입',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 28,
      viewCount: 85,
    },
    {
      id: 'post-3',
      title: 'Tailwind CSS 4.0 마이그레이션 가이드',
      content: `# Tailwind CSS 4.0 마이그레이션 가이드\n\nTailwind CSS 4.0은 큰 변화를 가져왔습니다.\n\n## 주요 변경사항\n\n### CSS-first 설정\n\n이제 \`tailwind.config.js\` 대신 CSS 파일에서 직접 설정합니다.\n\n\`\`\`css\n@import "tailwindcss";\n\n@theme {\n  --color-primary: #3b82f6;\n  --font-sans: "Pretendard", sans-serif;\n}\n\`\`\`\n\n### 성능 향상\n\n빌드 속도가 최대 10배 빨라졌습니다.\n\n## 마이그레이션 방법\n\n1. \`@tailwindcss/vite\` 플러그인 설치\n2. PostCSS 설정 제거\n3. CSS 파일 업데이트`,
      excerpt: 'Tailwind CSS 4.0으로 마이그레이션하는 방법을 단계별로 안내합니다. CSS-first 설정 방식과 성능 향상 내용을 다룹니다.',
      category: '프론트엔드',
      tags: ['Tailwind', 'CSS', '웹개발'],
      authorName: '박스타일',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 35,
      viewCount: 203,
    },
    {
      id: 'post-4',
      title: 'Vite 6 릴리즈 노트',
      content: `# Vite 6 릴리즈 노트\n\nVite 6이 출시되었습니다.\n\n## 주요 변경사항\n\n### Environment API\n\n새로운 Environment API를 통해 SSR과 클라이언트 환경을 더 잘 제어할 수 있습니다.\n\n### 성능 개선\n\n- HMR 속도 30% 향상\n- 빌드 메모리 사용량 감소\n\n## 업그레이드 방법\n\n\`\`\`bash\nnpm install vite@latest\n\`\`\``,
      excerpt: 'Vite 6의 주요 변경사항을 살펴봅니다. Environment API, 성능 개선 등 새로운 기능을 소개합니다.',
      category: '도구',
      tags: ['Vite', '빌드도구', '웹개발'],
      authorName: '최빌드',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 19,
      viewCount: 67,
    },
  ]
}

function getSampleComments(): Comment[] {
  return [
    {
      id: 'comment-1',
      postId: 'post-1',
      authorName: '독자1',
      content: '정말 유용한 글이에요! React 19 적용해봤는데 확실히 편해졌어요.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'comment-2',
      postId: 'post-1',
      authorName: '독자2',
      content: 'Actions 기능이 특히 마음에 드네요. 비동기 처리가 훨씬 깔끔해졌어요.',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'comment-3',
      postId: 'post-3',
      authorName: '독자3',
      content: 'CSS-first 설정이 처음엔 낯설었는데 익숙해지니 훨씬 직관적이에요.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}
