import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../store/blogSlice";
import { useNavigate } from "react-router-dom";
import { UserCircle, Calendar } from "lucide-react";

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleBlogClick = (slug) => {
    navigate(`/blogs/${slug}`);
  };

  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  if (!blogs.length)
    return (
      <div className="text-center text-gray-500">
        <p>No blogs available. Please check back later!</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 py-8">
      <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900">
        Latest Blogs
      </h2>
      <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogs.map((blog) => (
          <div
            key={blog.$id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => handleBlogClick(blog.slug)}
          >
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-40 object-cover" // Adjust height for image
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 hover:text-blue-600 transition-colors duration-300">
                {blog.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                {blog.content}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <UserCircle className="w-5 h-5 text-gray-500" />
                  <span>{blog.createdBy || "Anonymous"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>{new Date(blog.$createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
