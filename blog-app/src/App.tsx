import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PostListPage from './pages/PostListPage'
import PostDetailPage from './pages/PostDetailPage'
import PostEditorPage from './pages/PostEditorPage'
import TagPage from './pages/TagPage'
import BookmarksPage from './pages/BookmarksPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostListPage />} />
        <Route path="posts/:id" element={<PostDetailPage />} />
        <Route path="posts/new" element={<PostEditorPage />} />
        <Route path="posts/:id/edit" element={<PostEditorPage />} />
        <Route path="tags/:tag" element={<TagPage />} />
        <Route path="bookmarks" element={<BookmarksPage />} />
      </Route>
    </Routes>
  )
}
