import React, { useState } from 'react';
import a from "../../assets/icons/menu-icon.png";
import b from "../../assets/icons/search-icon.png";
import c from "../../assets/icons/settings-icon.png";
import {Link} from 'react-router-dom';


const Navbar = ({ toggleSidebar }) => {
  const [activeTab, setActiveTab] = useState('new');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <nav className="navbar flex items-center justify-between p-4 bg-white border-b border-gray-300">
      <div className="nav-left">
        <img
          src={a}
          alt="Menu"
          className="w-6 h-6 cursor-pointer"
          onClick={toggleSidebar}
        />
      </div>
      <div className="toggle-container bg-gray-200 rounded-full p-1 flex">
        <div
          className={`toggle-btn px-4 py-2 rounded-full ${
            activeTab === 'new' ? 'bg-green-700 text-white' : ''
          }`}
          onClick={() => handleTabClick('new')}
        >
          New
        </div>
        <div
          className={`toggle-btn px-4 py-2 rounded-full ${
            activeTab === 'recent' ? 'bg-green-800 text-white' : ''
          }`}
          onClick={() => handleTabClick('recent')}
        >
          Recently
        </div>
      </div>
      <div className="nav-right flex space-x-4">
        <Link to="/search">
          <img src={b} alt="Search" className="w-6 h-6" />
        </Link>
        <Link to="/settings">
          <img src={c} alt="Settings" className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;