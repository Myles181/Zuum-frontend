import React from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiSearch, FiSettings } from 'react-icons/fi'; // Import icons from react-icons

const Navbar = ({ toggleSidebar, name }) => {
  return (
    <div className="navbar bg-white shadow-md flex items-center justify-between px-4 py-3 fixed top-0 left-0 w-full z-50">
      {/* Left Section: Menu Icon */}
      <div className="nav-left">
        <FiMenu
          className="w-6 h-6 cursor-pointer text-gray-700"
          onClick={toggleSidebar}
        />
      </div>

      {/* Middle Section: Toggle Container */}
      <div className="toggle-container bg-[#2D8C72] rounded-full px-3 py-1 flex">
        <div className="toggle-btn active px-10 py-1 rounded-full text-white font-bold">
          {name}
        </div>
      </div>

      {/* Right Section: Search and Settings Icons */}
      <div className="nav-right flex space-x-4">
        <Link to="/search">
          <FiSearch className="w-6 h-6 text-gray-700" />
        </Link>
        <Link to="/settings">
          <FiSettings className="w-6 h-6 text-gray-700" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;