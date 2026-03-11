import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getAllPosts, getAllCategories, getAllTags } from '../store/blogStore'
import PostCard from '../components/PostCard'

export default function PostListPage() {
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<string>('전체')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')

  const searchQuery = searchParams.get('search') ?? ''
  const posts = getAllPosts()
  const categories = ['전체', ...getAllCategories()]
  const allTags = getAllTags()

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchCat = activeCategory === '전체' || p.category === activeCategory
      const q = searchQuery.toLowerCase()
      const matchSearch = !q || p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [posts, activeCategory, searchQuery])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sortBy === 'oldest') {
      arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (sortBy === 'popular') {
      arr.sort((a, b) => b.likes - a.likes)
    } else {
      arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return arr
  }, [filtered, sortBy])

  return (
    <div className="space-y-8">
      {/* 카테고리 필터 */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
          className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="popular">인기순</option>
        </select>
      </div>

      {/* 검색 결과 안내 */}
      {searchQuery && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-white">"{searchQuery}"</span>
          {' '}검색 결과 {sorted.length}개
        </p>
      )}

      {/* 포스트 그리드 */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sorted.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">포스트가 없어요</p>
          <Link to="/posts/new" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
            첫 글을 작성해보세요 →
          </Link>
        </div>
      )}

      {/* 인기 태그 */}
      {allTags.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">태그</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Link
                key={tag}
                to={`/tags/${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
