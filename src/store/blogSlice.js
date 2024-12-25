import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { databases, DATABASE_ID, COLLECTION_ID, storage, BUCKET_ID } from '../appwrite'
import { Query } from 'appwrite'

export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID)
  return response.documents
})

export const fetchBlogBySlug = createAsyncThunk('blog/fetchBlogBySlug', async (slug) => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('slug', slug)])
  return response.documents[0]
})

export const createBlog = createAsyncThunk('blog/createBlog', async ({ title, content, image }) => {
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  
  let imageUrl = ''
  if (image) {
    const fileUpload = await storage.createFile(BUCKET_ID, 'unique()', image)
    imageUrl = storage.getFileView(BUCKET_ID, fileUpload.$id)
  }

  const blog = await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', {
    title,
    content,
    slug,
    image: imageUrl,
    userId: 'current', // This will be replaced with the actual user ID by Appwrite
  })

  return blog
})

export const updateBlog = createAsyncThunk('blog/updateBlog', async ({ id, title, content, image }) => {
  let imageUrl = ''
  if (image && typeof image !== 'string') {
    const fileUpload = await storage.createFile(BUCKET_ID, 'unique()', image)
    imageUrl = storage.getFileView(BUCKET_ID, fileUpload.$id)
  } else {
    imageUrl = image
  }

  const blog = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
    title,
    content,
    image: imageUrl,
  })

  return blog
})

export const deleteBlog = createAsyncThunk('blog/deleteBlog', async (id) => {
  await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
  return id
})

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogs: [],
    currentBlog: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload
        state.loading = false
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.error = action.error.message
        state.loading = false
      })
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.currentBlog = action.payload
        state.loading = false
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.error = action.error.message
        state.loading = false
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload)
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(blog => blog.$id === action.payload.$id)
        if (index !== -1) {
          state.blogs[index] = action.payload
        }
        state.currentBlog = action.payload
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(blog => blog.$id !== action.payload)
      })
  },
})

export default blogSlice.reducer
