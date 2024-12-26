import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserCircle, Mail, Calendar } from "lucide-react";
import { fetchBlogs } from "../store/blogSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { blogs, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const userBlogs = blogs.filter((blog) => blog.userId === user.$id);

  if (loading)
    return <div className="text-gray-600 text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const handleBlogClick = (slug) => {
    navigate(`/blogs/${slug}`);
  };

  return (
    <div className="max-w-5xl mt-16 mx-auto px-4 py-8">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <UserCircle className="w-16 h-16 text-blue-500 mr-6" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <div className="flex items-center text-gray-600 mt-2">
              <Mail className="w-5 h-5 mr-2" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center text-gray-600 mt-1">
              <Calendar className="w-5 h-5 mr-2" />
              <span>
                Joined on {new Date(user.$createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Blogs Section */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Your Blogs</h3>
      {userBlogs.length === 0 ? (
        <p className="text-gray-600">You haven't created any blogs yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {userBlogs.map((blog) => (
            <div
              key={blog.$id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
              onClick={() => handleBlogClick(blog.slug)}
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600">
                  {blog.title}
                </h4>
                <p className="text-gray-600 mb-4 text-sm">
                  {blog.content.substring(0, 80)}...
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(blog.$createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
