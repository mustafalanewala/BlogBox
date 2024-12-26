import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { UserCircle, Menu, X } from "lucide-react";

const Header = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation(); // Get the current route
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const linkClasses = (path) =>
    `block md:inline px-4 py-2 rounded-md transition-all ${
      pathname === path
        ? "bg-blue-700 text-white"
        : "hover:bg-blue-600 hover:text-white text-gray-200"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg z-50">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold hover:text-blue-200 transition-colors"
        >
          BlogBox
        </Link>

        {/* Hamburger Menu for Small Screens */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation Links */}
        <nav
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-blue-800 md:bg-transparent shadow-md md:shadow-none md:flex items-center space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0 transition-all ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          {isAuthenticated ? (
            <>
              <Link to="/blogs" className={linkClasses("/blogs")}>
                Blogs
              </Link>
              <Link to="/add-blog" className={linkClasses("/add-blog")}>
                Add Blog
              </Link>
              <Link to="/profile" className={linkClasses("/profile")}>
                <div className="flex items-center space-x-2">
                  <UserCircle className="w-6 h-6" />
                  <span>{user.name}</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="block md:inline bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClasses("/login")}>
                Login
              </Link>
              <Link
                to="/signup"
                className="block md:inline bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
