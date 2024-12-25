import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { account } from '../appwrite'

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const session = await account.createEmailPasswordSession(email, password)
  const user = await account.get()
  return { session, user }
})

export const signup = createAsyncThunk('auth/signup', async ({ email, password, name }) => {
  await account.create('unique()', email, password, name)
  const session = await account.createEmailPasswordSession(email, password)
  const user = await account.get()
  return { session, user }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await account.deleteSession('current')
})

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  try {
    const user = await account.get()
    return { user }
  } catch (error) {
    console.error('CheckAuth Error:', error)
    throw error
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.isAuthenticated = true
        state.loading = false
      })
  },
})

export default authSlice.reducer

