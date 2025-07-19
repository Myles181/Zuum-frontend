import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMessageCircle, FiPlusSquare, FiBell, FiUser } from 'react-icons/fi'; // Import icons from react-icons

const BottomNav = () => {
  const location = useLocation(); // Get current route

  const getLinkClass = (path) =>
    location.pathname === path ? "text-green-800" : "text-gray-700";

  return (
    <div className="bottom-nav fixed bottom-0 left-0 w-full bg-white flex justify-around p-1 z-50">
      {/* Home */}
      <Link to='/home' className={`nav-item flex flex-col items-center text-xs sm:text-sm ${getLinkClass('/home')}`}>
        <FiHome className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
        <span className="hidden xs:block">Home</span>
      </Link>

      {/* Messages */}
      <Link to='/message' className={`nav-item flex flex-col items-center text-xs sm:text-sm ${getLinkClass('/message')}`}>
        <FiMessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
        <span className="hidden xs:block">Message</span>
      </Link>

      {/* Add */}
      <Link to='/add' className={`nav-item flex flex-col items-center text-xs sm:text-sm ${getLinkClass('/add')}`}>
        <FiPlusSquare className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
        <span className="hidden xs:block">Add</span>
      </Link>

      {/* Activities */}
      <Link to='/activity' className={`nav-item flex flex-col items-center text-xs sm:text-sm ${getLinkClass('/activity')}`}>
        <FiBell className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
        <span className="hidden xs:block">Activities</span>
      </Link>

      {/* Profile */}
      <Link to='/profile' className={`nav-item flex flex-col items-center text-xs sm:text-sm ${getLinkClass('/profile')}`}>
        <FiUser className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
        <span className="hidden xs:block">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav; 