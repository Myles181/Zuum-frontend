import React from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiSearch, FiSettings } from "react-icons/fi";

const Navbar = ({ toggleSidebar, activeTab, handleTabClick }) => {
  return (
    <div className="navbar bg-white shadow-md flex items-center justify-between px-4 py-3 fixed top-0 left-0 w-full z-50">
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
   </div>
  );
};

export default Navbar;
