import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlogBySlug, deleteBlog } from "../store/blogSlice";
import {
  UserCircle,
  Calendar,
  Edit,
  Trash,
  ArrowLeft,
  Share2,
} from "lucide-react";

const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, error } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBlogBySlug(slug));
  }, [dispatch, slug]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await dispatch(deleteBlog(currentBlog.$id)).unwrap();
        navigate("/blogs");
      } catch (err) {
        console.error("Failed to delete blog:", err);
      }
    }
  };

  const handleShare = () => {
    const blogUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: currentBlog.title,
        url: blogUrl,
      });
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold text-xl">
        Error: {error}
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="text-center text-lg text-gray-500">Blog not found</div>
    );
  }

  return (
    <div className="max-w-4xl mt-16 mx-auto bg-gradient-to-br from-blue-50 via-teal-50 to-white rounded-lg shadow-lg overflow-hidden p-6">
      {/* Back to Blogs Button */}
      <button
        onClick={() => navigate("/blogs")}
        className="flex items-center text-blue-500 hover:text-blue-700 mb-6 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Blogs
      </button>

      {/* Blog Image */}
      {currentBlog.image && (
        <img
          src={currentBlog.image}
          alt={currentBlog.title}
          className="w-full h-72 object-cover rounded-lg shadow-md"
        />
      )}

      <div className="pt-6">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-4 text-gray-800 hover:text-blue-600 transition-all duration-300 ease-in-out">
          {currentBlog.title}
        </h2>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <UserCircle className="w-6 h-6 mr-2 text-blue-600" />
            <span className="text-gray-700 font-medium">
              {currentBlog.createdBy}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            <span>{new Date(currentBlog.$createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Blog Content */}
        <div className="prose max-w-none mb-8 text-gray-700">
          {currentBlog.content}
        </div>

        {/* Buttons - Share, Edit, Delete */}
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={handleShare}
            className="flex items-center bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </button>

          {/* Edit and Delete Buttons */}
          {user && user.$id === currentBlog.userId && (
            <>
              <button
                onClick={() => navigate(`/edit-blog/${currentBlog.slug}`)}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Trash className="w-5 h-5 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
