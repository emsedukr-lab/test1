import { useEffect, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Eye, Edit3, Save, X, Plus, LogIn } from 'lucide-react'
import {
  getPostById,
  createPost,
  updatePost,
  getAllCategories,
  getAllTags,
} from '../store/blogStore'
import { useAuth } from '../contexts/AuthContext'

interface DraftData {
  title: string
  content: string
  category: string
  tags: string[]
  savedAt: string
}

const CATEGORIES = ['프론트엔드', '백엔드', '언어', '도구', '기타']

export default function PostEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id
  const existing = isEdit && id ? getPostById(id) : undefined
  const { user, login } = useAuth()

  const [title, setTitle] = useState(existing?.title ?? '')
  const [content, setContent] = useState(existing?.content ?? '')
  const [category, setCategory] = useState(existing?.category ?? CATEGORIES[0])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(existing?.tags ?? [])
  const [preview, setPreview] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [savedAt, setSavedAt] = useState<string | null>(null)

  useEffect(() => {
    setTitle(existing?.title ?? '')
    setContent(existing?.content ?? '')
    setCategory(existing?.category ?? CATEGORIES[0])
    setTagInput('')
    setTags(existing?.tags ?? [])
    setErrors({})
  }, [existing])

  useEffect(() => {
    if (isEdit) return
    const raw = localStorage.getItem('blog-draft-new')
    if (!raw) return
    try {
      const draft: DraftData = JSON.parse(raw)
      if (window.confirm('저장된 임시 초안이 있어요. 불러올까요?')) {
        setTitle(draft.title)
        setContent(draft.content)
        setCategory(draft.category)
        setTags(draft.tags)
      }
    } catch {
      localStorage.removeItem('blog-draft-new')
    }
  }, [isEdit])

  useEffect(() => {
    const draftKey = 'blog-draft-' + (isEdit ? (id ?? 'new') : 'new')
    const timer = setTimeout(() => {
      if (title || content) {
        const draft: DraftData = {
          title,
          content,
          category,
          tags,
          savedAt: new Date().toISOString(),
        }
        localStorage.setItem(draftKey, JSON.stringify(draft))
        setSavedAt(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }))
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [title, content, category, tags, isEdit, id])

  const allCategories = [...new Set([...CATEGORIES, ...getAllCategories()])]
  const suggestedTags = getAllTags().filter(t => !tags.includes(t))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = '제목을 입력해주세요'
    if (!content.trim()) e.content = '내용을 입력해주세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const addTag = (tag: string) => {
    const t = tag.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag))

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(tagInput)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    const excerpt =
      content.replace(/[#*`\[\]]/g, '').slice(0, 150).trim() + (content.length > 150 ? '...' : '')

    if (isEdit && id) {
      updatePost(id, {
        title: title.trim(),
        content,
        excerpt,
        category,
        tags,
        authorName: user!.nickname,
        authorId: user!.id,
      })
      localStorage.removeItem('blog-draft-' + (id ?? 'new'))
      navigate(`/posts/${id}`)
    } else {
      const post = createPost({
        title: title.trim(),
        content,
        excerpt,
        category,
        tags,
        authorName: user!.nickname,
        authorId: user!.id,
      })
      localStorage.removeItem('blog-draft-new')
      navigate(`/posts/${post.id}`)
    }
  }

  // 비로그인 가드
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-gray-500 dark:text-gray-400">글을 작성하려면 로그인이 필요해요</p>
        <button
          onClick={login}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-medium"
        >
          <LogIn className="w-4 h-4" />
          카카오 로그인
        </button>
      </div>
    )
  }

  // 수정 시 소유권 체크
  if (isEdit && existing && existing.authorId && existing.authorId !== user.id) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-gray-500 dark:text-gray-400">본인이 작성한 글만 수정할 수 있어요</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm">
          ← 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? '포스트 수정' : '새 포스트'}
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreview(p => !p)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200"
          >
            {preview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? '편집' : '미리보기'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full px-4 py-3 text-xl font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              카테고리
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allCategories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              작성자
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.nickname} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.nickname[0]}
                </div>
              )}
              {user.nickname}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            태그
          </label>
          <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm"
              >
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="태그 입력 후 Enter"
              className="flex-1 min-w-24 bg-transparent text-sm focus:outline-none"
            />
          </div>
          {suggestedTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {suggestedTags.slice(0, 8).map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600"
                >
                  <Plus className="w-3 h-3" /> {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {preview ? (
          <div className="min-h-64 p-4 rounded-lg border border-gray-200 dark:border-gray-700 prose prose-gray dark:prose-invert max-w-none">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <p className="text-gray-400">내용을 입력하면 여기에 미리보기가 표시됩니다</p>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="마크다운으로 내용을 작성하세요...&#10;&#10;# 제목&#10;## 소제목&#10;**굵게**, *기울임*, `코드`"
              rows={16}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-gray-400">
            {savedAt && <span>임시저장됨 {savedAt}</span>}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 text-sm font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              {isEdit ? '수정 완료' : '발행'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
