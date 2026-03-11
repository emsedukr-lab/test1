import { useState, useEffect } from 'react'
import { MessageCircle, Trash2, Send, LogIn } from 'lucide-react'
import { getCommentsByPostId, addComment, deleteComment } from '../store/blogStore'
import type { Comment } from '../types'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  postId: string
}

export default function CommentsSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>(() => getCommentsByPostId(postId))
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const { user, login } = useAuth()

  useEffect(() => {
    setComments(getCommentsByPostId(postId))
  }, [postId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!content.trim()) { setError('댓글을 입력해주세요'); return }

    const newComment = addComment({
      postId,
      authorName: user!.nickname,
      authorId: user!.id,
      content: content.trim(),
    })
    setComments(prev => [...prev, newComment])
    setContent('')
  }

  const handleDelete = (id: string) => {
    if (window.confirm('댓글을 삭제할까요?')) {
      deleteComment(id)
      setComments(prev => prev.filter(c => c.id !== id))
    }
  }

  return (
    <section className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
        <MessageCircle className="w-5 h-5" />
        댓글 {comments.length}개
      </h2>

      {/* 댓글 목록 */}
      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map(comment => (
            <li key={comment.id} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {comment.authorName[0]}
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {comment.authorName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    {user && comment.authorId === user.id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                        aria-label="댓글 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">
          첫 댓글을 남겨보세요!
        </p>
      )}

      {/* 댓글 작성 */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.nickname} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                {user.nickname[0]}
              </div>
            )}
            <span>{user.nickname}</span>
          </div>
          <div className="flex gap-2">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              type="submit"
              className="self-end px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">댓글을 작성하려면 로그인이 필요해요</p>
          <button
            onClick={login}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-300 hover:bg-yellow-400 text-gray-900 text-sm font-medium"
          >
            <LogIn className="w-4 h-4" />
            로그인
          </button>
        </div>
      )}
    </section>
  )
}
