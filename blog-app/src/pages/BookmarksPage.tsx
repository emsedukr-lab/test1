import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { getBookmarkedPosts } from '../store/blogStore'
import PostCard from '../components/PostCard'

export default function BookmarksPage() {
  const [posts] = useState(() => getBookmarkedPosts())

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">저장한 포스트</h1>
        <span className="text-sm text-gray-400">({posts.length}개)</span>
      </div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">저장한 포스트가 없어요</p>
          <Link to="/" className="mt-2 inline-block text-blue-600 hover:underline text-sm">
            ← 포스트 둘러보기
          </Link>
        </div>
      )}
    </div>
  )
}
