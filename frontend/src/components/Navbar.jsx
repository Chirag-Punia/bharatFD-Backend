import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Settings } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/login") || location.pathname.startsWith("/admin");

  return (
    <nav
      className={`border-b border-gray-200 ${
        isAdmin ? "bg-blue-50" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <BookOpen
              className={`h-8 w-8 ${
                isAdmin ? "text-blue-700" : "text-blue-600"
              }`}
            />
            <div>
              <span className="text-xl font-bold text-gray-900">
                FAQ System
              </span>
              {isAdmin && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Admin
                </span>
              )}
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                !isAdmin
                  ? "text-blue-700 bg-blue-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              View FAQs
            </Link>
            <Link
              to="/admin"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                isAdmin
                  ? "text-blue-700 bg-blue-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
