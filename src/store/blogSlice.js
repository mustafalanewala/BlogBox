import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  databases,
  DATABASE_ID,
  COLLECTION_ID,
  storage,
  BUCKET_ID,
} from "../appwrite";
import { Query } from "appwrite";
import { account } from "../appwrite";

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
      console.error("Error fetching blogs:", err);
      return rejectWithValue("Error fetching blogs.");
    }
  }
);

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
      } catch (err) {
        console.error("Image upload error:", err);
        return rejectWithValue("Error uploading image.");
      }
    }

    try {
      // Ensure the user is authenticated
      const user = await account.get();
      console.log("Authenticated user info:", user); // Log the user info to check

      if (!user || !user.$id) {
        console.error("User is not authenticated or user ID is missing.");
        return rejectWithValue("User not authenticated.");
      }

      const userId = user.$id;
      const username = user.name || "Anonymous"; // Use name or default to 'Anonymous'

      // Log the user details
      console.log("Creating blog for user:", username);

      // Create the blog document in the database
      const blog = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        "unique()",
        {
          title,
          content,
          slug,
          image: imageUrl,
          userId: userId,
          createdBy: username, // Store the username here
        }
      );

      return blog;
    } catch (err) {
      console.error("Error creating blog:", err);
      return rejectWithValue("Error creating blog.");
    }
  }
);

// Update an existing blog
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, title, content, image }) => {
    let imageUrl = "";
    if (image && typeof image !== "string") {
      const fileUpload = await storage.createFile(BUCKET_ID, "unique()", image);
      imageUrl = storage.getFileView(BUCKET_ID, fileUpload.$id);
    } else {
      imageUrl = image;
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

// Likes
export const toggleLike = createAsyncThunk(
  "blog/toggleLike",
  async ({ blogId, userId, isLiked }, { rejectWithValue }) => {
    try {
      const blog = await databases.getDocument(
        "databaseId",
        "collectionId",
        blogId
      );
      const updatedLikes = isLiked
        ? blog.likes.filter((id) => id !== userId) // Remove like
        : [...blog.likes, userId]; // Add like

      const updatedBlog = await databases.updateDocument(
        "databaseId",
        "collectionId",
        blogId,
        { likes: updatedLikes }
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
  reducers: {},
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
        state.blogs = state.blogs.map((blog) =>
          blog.$id === updatedBlog.$id ? updatedBlog : blog
        );
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
