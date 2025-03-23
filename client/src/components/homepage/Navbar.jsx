import React from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiSearch, FiSettings } from "react-icons/fi";

const Navbar = ({ toggleSidebar, activeTab, handleTabClick }) => {
  return (
    <nav className="navbar fixed top-0 left-0 right-0 flex items-center justify-between p-1 bg-white border-b border-gray-300 z-50">
      <div className="nav-left">
        <FiMenu
          className="w-6 h-6 cursor-pointer"
          onClick={toggleSidebar}
        />
      </div>
      <div className="toggle-container bg-gray-200 rounded-full p-1 flex">
        <div
          className={`toggle-btn px-2 py-1 rounded-full ${
            activeTab === "audio" ? "bg-[#2D8C72] text-white" : ""
          }`}
          onClick={() => handleTabClick("audio")}
        >
          Audio
        </div>
        <div
          className={`toggle-btn px-2 py-1 rounded-full ${
            activeTab === "video" ? "bg-[#2D8C72] text-white" : ""
          }`}
          onClick={() => handleTabClick("video")}
        >
          Video
        </div>
      </div>
      <div className="nav-right flex space-x-4">
        <Link to="/search">
          <FiSearch className="w-6 h-6" />
        </Link>
        <Link to="/settings">
          <FiSettings className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
