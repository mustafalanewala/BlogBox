import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import store from './store'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import AddEditBlog from './pages/AddEditBlog'
import ProtectedRoute from './components/ProtectedRoute'
import { checkAuth } from './store/authSlice';

function App() {
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    dispatch(checkAuth()).finally(() => setChecking(false))
  }, [dispatch])

  if (checking) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/blogs" element={
                <ProtectedRoute>
                  <BlogList />
                </ProtectedRoute>
              } />
              <Route path="/blogs/:slug" element={
                <ProtectedRoute>
                  <BlogDetail />
                </ProtectedRoute>
              } />
              <Route path="/add-blog" element={
                <ProtectedRoute>
                  <AddEditBlog />
                </ProtectedRoute>
              } />
              <Route path="/edit-blog/:slug" element={
                <ProtectedRoute>
                  <AddEditBlog />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  )
}

export default App

