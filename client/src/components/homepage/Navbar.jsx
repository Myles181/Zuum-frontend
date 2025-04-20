import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiSettings } from "react-icons/fi";
import { MdRocketLaunch } from "react-icons/md";  // ← using the rocket launch icon

const Navbar = ({ activeTab, handleTabClick }) => {
  return (
    <div className="navbar bg-white/20 backdrop-blur-lg border-b border-white/10 shadow-sm flex items-center justify-between px-4 py-2 fixed top-0 left-0 w-full z-50">
      <div className="nav-left">
        <Link
          to="/promotion"
          className="text-white/80 hover:text-white transition-colors"
        >
          <MdRocketLaunch className="w-6 h-6" />  {/* ← swapped here */}
        </Link>
      </div>

      <div className="toggle-container bg-black/10 backdrop-blur-md rounded-full p-1 flex border border-white/10">
        <button
          className={`toggle-btn px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === "audio"
              ? "bg-[#2D8C72] text-white shadow-inner"
              : "text-white/80 hover:text-white"
          }`}
          onClick={() => handleTabClick("audio")}
        >
          Audio
        </button>
        <button
          className={`toggle-btn px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === "video"
              ? "bg-[#2D8C72] text-white shadow-inner"
              : "text-white/80 hover:text-white"
          }`}
          onClick={() => handleTabClick("video")}
        >
          Video
        </button>
      </div>

      <div className="nav-right flex space-x-4">
        <Link
          to="/search"
          className="text-white/80 hover:text-white transition-colors"
        >
          <FiSearch className="w-6 h-6" />
        </Link>
        <Link
          to="/settings"
          className="text-white/80 hover:text-white transition-colors"
        >
          <FiSettings className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
