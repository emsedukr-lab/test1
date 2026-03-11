import { Link } from 'react-router-dom'
import { Heart, Bookmark, MessageCircle, Tag } from 'lucide-react'
import { isLiked, isBookmarked } from '../store/blogStore'
import type { Post } from '../types'

interface Props {
  post: Post
}

export default function PostCard({ post }: Props) {
  const liked = isLiked(post.id)
  const bookmarked = isBookmarked(post.id)
  const date = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
  const readingTime = Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/posts/${post.id}`} className="block p-5">
        {/* 카테고리 + 날짜 */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{date} · {readingTime}분 읽기</span>
        </div>

        {/* 제목 */}
        <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
          {post.title}
        </h2>

        {/* 요약 */}
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* 하단 바 */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">{post.authorName}</span>
        <div className="flex items-center gap-3 text-gray-400">
          <span className="flex items-center gap-1 text-xs">
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            {post.likes}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
          </span>
          <span className="flex items-center gap-1 text-xs">
            <MessageCircle className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  )
}
