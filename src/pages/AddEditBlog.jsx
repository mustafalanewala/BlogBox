import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createBlog, updateBlog, fetchBlogBySlug } from '../store/blogSlice'

const AddEditBlog = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { slug } = useParams()
  const { currentBlog, loading, error } = useSelector(state => state.blog)

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlug(slug))
    }
  }, [dispatch, slug])

  useEffect(() => {
    if (currentBlog && slug) {
      setTitle(currentBlog.title)
      setContent(currentBlog.content)
      setImage(currentBlog.image)
    }
  }, [currentBlog, slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (slug) {
        await dispatch(updateBlog({ id: currentBlog.$id, title, content, image })).unwrap()
      } else {
        await dispatch(createBlog({ title, content, image })).unwrap()
      }
      navigate('/blogs')
    } catch (err) {
      console.error('Failed to save blog:', err)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{slug ? 'Edit Blog' : 'Add New Blog'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-1">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded h-64"
          ></textarea>
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">Image</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        {image && typeof image === 'string' && (
          <img src={image} alt="Current blog image" className="w-full h-64 object-cover rounded" />
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {slug ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </div>
  )
}

export default AddEditBlog

