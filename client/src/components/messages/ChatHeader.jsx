import React from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; // Back icon
import { IoIosSettings } from 'react-icons/io'; // Settings icon
import { CgProfile } from 'react-icons/cg'; // Profile icon

const MessagesNavbar = ({ onBackClick }) => {
  return (
    <nav className=" flex items-center justify-between p-4 bg-white border-b border-gray-300">
      {/* Left Section: Back Button and Profile Icon */}
      <div className="nav-left flex items-center space-x-4">
        <IoArrowBack
          className="w-6 h-6 cursor-pointer text-gray-700"
          onClick={onBackClick}
        />
        <CgProfile className="w-8 h-8 text-gray-700" />
      </div>

      {/* Middle Section: Green Text Bubble */}
      <div className="nav-middle">
        <div className="bg-green-800 text-white rounded-full px-3 py-1 text-sm">
       Username
        </div>
      </div>

      {/* Right Section: Settings Icon */}
      <div className="nav-right">
        <Link to="/settings">
          <IoIosSettings className="w-6 h-6 text-gray-700" />
        </Link>
      </div>
    </nav>
  );
};

export default MessagesNavbar;