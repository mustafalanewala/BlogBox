import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBlogs } from '../store/blogSlice'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const dispatch = useDispatch()
  const { blogs, loading, error } = useSelector(state => state.blog)

  useEffect(() => {
    dispatch(fetchBlogs())
  }, [dispatch])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map(blog => (
          <div key={blog.$id} className="bg-white p-4 rounded-lg shadow">
            {blog.image && (
              <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover mb-4 rounded" />
            )}
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
            <p className="text-gray-600 mb-4">{blog.content.substring(0, 100)}...</p>
            <Link to={`/blogs/${blog.slug}`} className="text-blue-500 hover:underline">
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogList

