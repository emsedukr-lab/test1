import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { Heart, Bookmark, ArrowLeft, Edit, Share2, Trash2, Tag } from 'lucide-react'
import {
  getPostById, getAllPosts, toggleLike, toggleBookmark, isLiked, isBookmarked, deletePost
} from '../store/blogStore'
import CommentsSection from '../components/CommentsSection'
import { useAuth } from '../contexts/AuthContext'

function extractHeadings(content: string): { level: number; text: string; id: string }[] {
  return content
    .split('\n')
    .filter(line => /^#{1,3}\s/.test(line))
    .map(line => {
      const match = line.match(/^(#{1,3})\s+(.+)$/)
      if (!match) return null
      const level = match[1].length
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-가-힣]/g, '')
      return { level, text, id }
    })
    .filter((h): h is { level: number; text: string; id: string } => h !== null)
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const post = getPostById(id ?? '')
  const { user } = useAuth()
  const isOwner = !!(user && post?.authorId && post.authorId === user.id)
  const headings = post ? extractHeadings(post.content) : []
  const relatedPosts = post
    ? getAllPosts()
        .filter(p => p.id !== post.id)
        .filter(p => p.category === post.category || p.tags.some(t => post.tags.includes(t)))
        .slice(0, 3)
    : []

  const [liked, setLiked] = useState(() => isLiked(id ?? ''))
  const [likeCount, setLikeCount] = useState(() => post?.likes ?? 0)
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(id ?? ''))

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">포스트를 찾을 수 없어요</p>
        <Link to="/" className="text-blue-600 hover:underline">← 홈으로</Link>
      </div>
    )
  }

  const handleLike = () => {
    const result = toggleLike(post.id)
    setLiked(result.liked)
    setLikeCount(result.count)
  }

  const handleBookmark = () => {
    const result = toggleBookmark(post.id)
    setBookmarked(result)
  }

  const handleDelete = () => {
    if (window.confirm('이 포스트를 삭제할까요?')) {
      deletePost(post.id)
      navigate('/')
    }
  }

  const date = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <article className="max-w-2xl mx-auto space-y-8">
      {/* 뒤로가기 */}
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      {/* 헤더 */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            {post.category}
          </span>
          <span className="text-sm text-gray-400">{date}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {post.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          by {post.authorName}
        </p>
        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link
                key={tag}
                to={`/tags/${encodeURIComponent(tag)}`}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 액션 바 */}
      <div className="flex items-center justify-between border-y border-gray-200 dark:border-gray-700 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.title, url: window.location.href })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert('링크가 복사되었어요!')
              }
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            공유
          </button>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              liked
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </button>
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              bookmarked
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            {bookmarked ? '저장됨' : '저장'}
          </button>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <Link
              to={`/posts/${post.id}/edit`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 text-sm"
            >
              <Edit className="w-4 h-4" />
              수정
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-red-500 hover:bg-red-50 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 목차 */}
      {headings.length >= 2 && (
        <nav className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">목차</p>
          <ul className="space-y-1">
            {headings.map((h, i) => (
              <li key={i} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
                <a
                  href={`#${h.id}`}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* 마크다운 본문 */}
      <div className="prose prose-gray dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
        prose-p:text-gray-700 dark:prose-p:text-gray-300
        prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-gray-900 prose-pre:text-gray-100
        prose-a:text-blue-600 dark:prose-a:text-blue-400
        prose-blockquote:border-blue-400 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* 댓글 섹션 */}
      <CommentsSection postId={post.id} />

      {/* 관련 포스트 */}
      {relatedPosts.length > 0 && (
        <section className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">관련 포스트</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map(p => (
              <Link
                key={p.id}
                to={`/posts/${p.id}`}
                className="block rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
              >
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{p.category}</span>
                <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{p.title}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
