import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMessageCircle, FiPlusSquare, FiBell, FiUser } from 'react-icons/fi'; // Import icons from react-icons

const BottomNav = () => {
  const location = useLocation(); // Get current route

  const getLinkClass = (path) =>
    location.pathname === path ? "text-green-800" : "text-gray-700";

  return (
    <div className="bottom-nav fixed bottom-0 left-0 w-full bg-white flex justify-around p-4 shadow-t z-50">
      {/* Home */}
      <Link to='/home' className={`nav-item flex flex-col items-center text-sm ${getLinkClass('/home')}`}>
        <FiHome className="w-6 h-6" />
        <span>Home</span>
      </Link>

      {/* Messages */}
      <Link to='/messages' className={`nav-item flex flex-col items-center text-sm ${getLinkClass('/messages')}`}>
        <FiMessageCircle className="w-6 h-6" />
        <span>Message</span>
      </Link>

      {/* Add */}
      <Link to='/add' className={`nav-item flex flex-col items-center text-sm ${getLinkClass('/add')}`}>
        <FiPlusSquare className="w-6 h-6" />
        <span>Add</span>
      </Link>

      {/* Activities */}
      <Link to='/activity' className={`nav-item flex flex-col items-center text-sm ${getLinkClass('/activity')}`}>
        <FiBell className="w-6 h-6" />
        <span>Activities</span>
      </Link>

      {/* Profile */}
      <Link to='/profile' className={`nav-item flex flex-col items-center text-sm ${getLinkClass('/profile')}`}>
        <FiUser className="w-6 h-6" />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav;