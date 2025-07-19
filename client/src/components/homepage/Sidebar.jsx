import React from 'react';
import a from "../../assets/icons/Vector1.png";
import b from "../../assets/icons/arcticons_huawei-assistant.png"
import c from "../../assets/icons/Mask group.png";
import d from "../../assets/icons/Mask group1.png";
import e from "../../assets/icons/Mask group2.png";
import FollowersList from './FollowersList';


const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
    className={`sidebar fixed top-0 left-0 w-4/5 sm:w-5/6 md:w-80 lg:w-96 h-full bg-white shadow-lg p-4 sm:p-5 overflow-y-auto transition-transform duration-300 z-50 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
  
      <img src="icons/Group 5.svg" alt="ZUUM Logo" className="logo w-24 sm:w-30 mb-4 sm:mb-5" />
      <a href="#" className="menu-item flex items-center gap-2 mb-3 text-sm sm:text-base hover:bg-gray-50 p-2 rounded-lg transition-colors">
        <img src={a} alt="Home" className="w-5 h-5 sm:w-6 sm:h-6" />
        Home
      </a>
      <a href="../PromotionAddCardSubcription/index.html" className="menu-item flex items-center gap-2 mb-3 text-sm sm:text-base hover:bg-gray-50 p-2 rounded-lg transition-colors">
        <img src={b} alt="Promotions" className="w-5 h-5 sm:w-6 sm:h-6" />
        Promotions
      </a>
      <button className="logout-btn w-full bg-green-700 text-white py-2 sm:py-3 rounded-lg mt-4 sm:mt-5 text-sm sm:text-base hover:bg-green-800 transition-colors">Log Out</button>
      <div className="section-title font-bold mt-4 sm:mt-5 text-sm sm:text-base">Followed Artists/ Producers</div>
      <FollowersList />
      
      <div className="section-title font-bold mt-4 sm:mt-5 text-sm sm:text-base">Company</div>
      <a href="#" className="menu-item flex items-center gap-2 mb-3 text-sm sm:text-base hover:bg-gray-50 p-2 rounded-lg transition-colors">
        Instant Share
      </a>
      <a href="../PromotionAddCardSubcription/index.html" className="menu-item flex items-center gap-2 mb-3 text-sm sm:text-base hover:bg-gray-50 p-2 rounded-lg transition-colors">
        Music Promotion
      </a>
      <div className="section-title font-bold mt-4 sm:mt-5 text-sm sm:text-base">Products</div>
      <a href="#" className="menu-item flex items-center gap-2 mb-3 text-sm sm:text-base hover:bg-gray-50 p-2 rounded-lg transition-colors">
        Home
      </a>
      <a href="#" className="menu-item flex items-center gap-2 mb-3 text-sm sm:text-base hover:bg-gray-50 p-2 rounded-lg transition-colors">
        Zuum News
      </a>
      <a href="#" className="menu-item flex items-center gap-2 mb-3 text-sm sm:text-base hover:bg-gray-50 p-2 rounded-lg transition-colors">
        Contact Us
      </a>
      <a href="#" className="menu-item flex items-center gap-2 mb-3 text-sm sm:text-base hover:bg-gray-50 p-2 rounded-lg transition-colors">
        About Us
      </a>
      <div className="section-title font-bold mt-4 sm:mt-5 text-sm sm:text-base">Help</div>
      <a href="#" className="menu-item flex items-center gap-2 mb-3 text-sm sm:text-base hover:bg-gray-50 p-2 rounded-lg transition-colors">
        FAQ
      </a>
      <a href="#" className="menu-item flex items-center gap-2 mb-3 text-sm sm:text-base hover:bg-gray-50 p-2 rounded-lg transition-colors">
        Support Centre
      </a>
    </div>
  );
};

export default Sidebar;