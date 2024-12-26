import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createBlog, updateBlog, fetchBlogBySlug } from "../store/blogSlice";

const AddEditBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { currentBlog, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlug(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (currentBlog && slug) {
      setTitle(currentBlog.title);
      setContent(currentBlog.content);
      setImage(currentBlog.image);
      setImagePreview(currentBlog.image);
    }
  }, [currentBlog, slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (slug) {
        await dispatch(
          updateBlog({ id: currentBlog.$id, title, content, image })
        ).unwrap();
      } else {
        await dispatch(createBlog({ title, content, image })).unwrap();
      }
      navigate("/blogs");
    } catch (err) {
      console.error("Failed to save blog:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // Preview image immediately
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-3xl mx-auto mt-24 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        {slug ? "Edit Blog" : "Add New Blog"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="content" className="block text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-36 resize-none"
            placeholder="Write your blog content here"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-gray-700 mb-2">
            Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-full max-w-full h-32 object-cover rounded-lg"
              />
            </div>
          )} */}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300"
          >
            {slug ? "Update Blog" : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditBlog;
