import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { databases, storage, account } from "../appwrite";
import { Query } from "appwrite";
import { DATABASE_ID, COLLECTION_ID, BUCKET_ID } from "../appwrite";

// Fetch blog by slug
export const fetchBlogBySlug = createAsyncThunk(
  "blog/fetchBlogBySlug",
  async (slug) => {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("slug", slug),
    ]);
    return response.documents[0];
  }
);

// Fetch all blogs
export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );
      return response.documents.map((blog) => ({
        ...blog,
        createdBy: blog.createdBy || "Unknown", // Fallback if 'createdBy' is missing
      }));
    } catch (err) {
      return rejectWithValue("Error fetching blogs.");
    }
  }
);

// Create a new blog
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async ({ title, content, image }, { rejectWithValue }) => {
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    let imageUrl = "";
    if (image) {
      try {
        const fileUpload = await storage.createFile(
          BUCKET_ID,
          "unique()",
          image
        );
        imageUrl = storage.getFileView(BUCKET_ID, fileUpload.$id);
      } catch {
        return rejectWithValue("Error uploading image.");
      }
    }

    try {
      const user = await account.get();
      if (!user?.$id) return rejectWithValue("User not authenticated.");

      const userId = user.$id;
      const username = user.name || "Anonymous";

      const blog = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        "unique()",
        {
          title,
          content,
          slug,
          image: imageUrl,
          userId,
          createdBy: username,
        }
      );

      return blog;
    } catch {
      return rejectWithValue("Error creating blog.");
    }
  }
);

// Update an existing blog
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, title, content, image }) => {
    let imageUrl = image;
    if (image && typeof image !== "string") {
      const fileUpload = await storage.createFile(BUCKET_ID, "unique()", image);
      imageUrl = storage.getFileView(BUCKET_ID, fileUpload.$id);
    }

    const blog = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id,
      {
        title,
        content,
        image: imageUrl,
      }
    );

    return blog;
  }
);

// Delete a blog
export const deleteBlog = createAsyncThunk("blog/deleteBlog", async (id) => {
  await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
  return id;
});

// Toggle like on a blog
export const toggleLike = createAsyncThunk(
  "blog/toggleLike",
  async ({ blogId, userId, isLiked }, { rejectWithValue }) => {
    try {
      const blog = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        blogId
      );
      const updatedLikes = isLiked
        ? blog.likes.filter((id) => id !== userId)
        : [...(blog.likes || []), userId];

      const updatedBlog = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        blogId,
        {
          likes: updatedLikes,
        }
      );

      return updatedBlog;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    currentBlog: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.currentBlog = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(
          (blog) => blog.$id === action.payload.$id
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        state.currentBlog = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.$id !== action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const updatedBlog = action.payload;
        const index = state.blogs.findIndex(
          (blog) => blog.$id === updatedBlog.$id
        );
        if (index !== -1) {
          state.blogs[index] = updatedBlog;
        }
        state.currentBlog = updatedBlog;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        console.error("Failed to update like:", action.payload);
      });
  },
});

export default blogSlice.reducer;
