import React from 'react';
import { Link } from 'react-router-dom';
import { Dog, LogIn, UserPlus, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Dog className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-800">PawRescue</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/report"
                  className="flex items-center space-x-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Report Case</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;