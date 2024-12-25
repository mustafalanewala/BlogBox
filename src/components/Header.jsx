import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'

const Header = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">BlogBox</Link>
        <nav>
          {isAuthenticated ? (
            <>
              <span className="mr-4">Welcome, {user.name}</span>
              <Link to="/blogs" className="mr-4">Blogs</Link>
              <Link to="/add-blog" className="mr-4">Add Blog</Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/signup" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

