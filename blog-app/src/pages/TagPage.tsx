import { useParams, Link } from 'react-router-dom'
import { getPostsByTag } from '../store/blogStore'
import PostCard from '../components/PostCard'
import { Tag } from 'lucide-react'

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>()
  const decodedTag = decodeURIComponent(tag ?? '')
  const posts = getPostsByTag(decodedTag)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">#{decodedTag}</h1>
        <span className="text-sm text-gray-400">({posts.length}개)</span>
      </div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p>해당 태그의 포스트가 없어요</p>
          <Link to="/" className="mt-2 inline-block text-blue-600 hover:underline text-sm">← 홈으로</Link>
        </div>
      )}
    </div>
  )
}
