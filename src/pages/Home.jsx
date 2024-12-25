import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to BlogBox</h1>
      <p className="text-xl mb-8">Share your thoughts with the world!</p>
      <Link to="/blogs" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg">
        Explore Blogs
      </Link>
    </div>
  )
}

export default Home

