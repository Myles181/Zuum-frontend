import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiSettings } from "react-icons/fi";
import { MdRocketLaunch } from "react-icons/md";  // ← using the rocket launch icon
import DarkModeToggle from "../DarkModeToggle";

const Navbar = ({ activeTab, handleTabClick }) => {
  return (
    <div 
      className="navbar backdrop-blur-lg border-b shadow-sm flex items-center justify-between px-3 sm:px-4 py-2 fixed top-0 left-0 w-full z-50"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderBottomColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="nav-left">
        <Link
          to="/jet"
          className="text-white/80 hover:text-white transition-colors"
        >
          <MdRocketLaunch className="w-5 h-5 sm:w-6 sm:h-6" />  {/* ← responsive sizing */}
        </Link>
      </div>

      <div 
        className="toggle-container backdrop-blur-md rounded-full p-1 flex border"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <button
          className={`toggle-btn px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
            activeTab === "audio"
              ? "bg-[#2D8C72] text-white shadow-inner"
              : "text-white/80 hover:text-white"
          }`}
          onClick={() => handleTabClick("audio")}
        >
          Audio
        </button>
        <button
          className={`toggle-btn px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
            activeTab === "video"
              ? "bg-[#2D8C72] text-white shadow-inner"
              : "text-white/80 hover:text-white"
          }`}
          onClick={() => handleTabClick("video")}
        >
          Video
        </button>
      </div>

      <div className="nav-right flex items-center space-x-2 sm:space-x-4">
        <DarkModeToggle 
          size="sm" 
          className="border" 
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)'
          }}
        />
        <Link
          to="/search"
          className="text-white/80 hover:text-white transition-colors"
        >
          <FiSearch className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
        <Link
          to="/settings"
          className="text-white/80 hover:text-white transition-colors"
        >
          <FiSettings className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
