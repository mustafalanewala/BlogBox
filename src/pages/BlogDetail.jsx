import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBlogBySlug, deleteBlog } from '../store/blogSlice'

const BlogDetail = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentBlog, loading, error } = useSelector(state => state.blog)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(fetchBlogBySlug(slug))
  }, [dispatch, slug])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await dispatch(deleteBlog(currentBlog.$id)).unwrap()
        navigate('/blogs')
      } catch (err) {
        console.error('Failed to delete blog:', err)
      }
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!currentBlog) return <div>Blog not found</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{currentBlog.title}</h2>
      {currentBlog.image && (
        <img src={currentBlog.image} alt={currentBlog.title} className="w-full h-64 object-cover mb-4 rounded" />
      )}
      <p className="text-gray-600 mb-8">{currentBlog.content}</p>
      {user && user.$id === currentBlog.userId && (
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/edit-blog/${currentBlog.slug}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default BlogDetail

