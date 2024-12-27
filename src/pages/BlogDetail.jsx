import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlogBySlug, deleteBlog, toggleLike } from "../store/blogSlice";
import {
  UserCircle,
  Calendar,
  Edit,
  Trash,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react";

const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, error, allBlogs } = useSelector((state) => state.blog); // Assuming `allBlogs` is available
  const { user } = useSelector((state) => state.auth);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  const handleLike = () => {
    if (!currentBlog) return; // Guard against null currentBlog

    const isLiked = currentBlog.likes.includes(user.$id);

    dispatch(
      toggleLike({ blogId: currentBlog.$id, userId: user.$id, isLiked })
    );
  };

  const handleSwipe = () => {
    const currentIndex = allBlogs.findIndex((blog) => blog.slug === slug);

    if (touchEnd - touchStart > 100) {
      // Swipe right (go to previous blog)
      const prevBlog = allBlogs[currentIndex - 1];
      if (prevBlog) {
        navigate(`/blog/${prevBlog.slug}`);
      }
    }

    if (touchStart - touchEnd > 100) {
      // Swipe left (go to next blog)
      const nextBlog = allBlogs[currentIndex + 1];
      if (nextBlog) {
        navigate(`/blog/${nextBlog.slug}`);
      }
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
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

  const isLiked = user && currentBlog.likes.includes(user.$id);

  return (
    <div
      className="max-w-4xl mt-16 mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-teal-50 to-white rounded-lg shadow-lg overflow-hidden p-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex justify-between">
        {/* Back Button */}
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center text-blue-500 hover:text-blue-700 mb-6 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Blogs
        </button>

        {/* Like Button Positioned After the Back Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLike}
            className="flex items-center justify-center text-xl"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={`w-6 h-6 ${isLiked ? "bg-red-500" : "bg-gray-500"} p-1 rounded-full mr-1`}
            />
          </button>
          <span className="text-xl text-gray-600">{currentBlog.likes.length}</span>
        </div>
      </div>

      {/* Blog Image */}
      {currentBlog.image && (
        <img
          src={currentBlog.image}
          alt={currentBlog.title}
          className="w-full h-72 object-cover rounded-lg shadow-md mb-6 sm:h-96"
        />
      )}

      <div className="relative pt-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 hover:text-blue-600 transition-all duration-300 ease-in-out">
          {currentBlog.title}
        </h2>

        <div className="flex flex-col sm:flex-row sm:justify-between text-md text-gray-600 mb-6 gap-4">
          <div className="flex items-center">
            <UserCircle className="w-7 h-7 mr-2 text-blue-600" />
            <span>{currentBlog.createdBy}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            <span>{new Date(currentBlog.$createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="prose max-w-none mb-8 text-gray-700 text-base sm:text-lg">
          {currentBlog.content}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-4 mb-8">
          <button
            onClick={handleShare}
            className="flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </button>

          {user && user.$id === currentBlog.userId && (
            <>
              <button
                onClick={() => navigate(`/edit-blog/${currentBlog.slug}`)}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto"
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
