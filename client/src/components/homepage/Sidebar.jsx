import React from 'react';
import a from "../../assets/icons/Vector1.png";
import b from "../../assets/icons/arcticons_huawei-assistant.png"
import c from "../../assets/icons/Mask group.png";
import d from "../../assets/icons/Mask group1.png";
import e from "../../assets/icons/Mask group2.png";


const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
    className={`sidebar fixed top-0 left-0 w-5/6 h-full bg-white shadow-lg p-5 overflow-y-auto transition-transform duration-300 z-50 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
  
      <img src="icons/Group 5.svg" alt="ZUUM Logo" className="logo w-30 mb-5" />
      <a href="#" className="menu-item flex items-center gap-2 mb-3">
        <img src={a} alt="Home" className="w-6 h-6" />
        Home
      </a>
      <a href="../PromotionAddCardSubcription/index.html" className="menu-item flex items-center gap-2 mb-3">
        <img src={b} alt="Promotions" className="w-6 h-6" />
        Promotions
      </a>
      <button className="logout-btn w-full bg-green-700 text-white py-2 rounded-lg mt-5">Log Out</button>
      <div className="section-title font-bold mt-5">Followed Artists/ Producers</div>
      <div className="artist-list mt-2">
        <div className="artist-item flex items-center gap-2 mb-2">
          <img src={c} alt="Olusteve" className="w-8 h-8 rounded-full" />
          Olusteve
        </div>
        <div className="artist-item flex items-center gap-2 mb-2">
          <img src={d} alt="Tennet" className="w-8 h-8 rounded-full" />
          Tennet
        </div>
        <div className="artist-item flex items-center gap-2 mb-2">
          <img src={e} alt="Alpha Rey" className="w-8 h-8 rounded-full" />
          Alpha Rey
        </div>
        <div className="see-more text-green-500 cursor-pointer">See more</div>
      </div>
      <div className="section-title font-bold mt-5">Company</div>
      <a href="#" className="menu-item flex items-center gap-2 mb-3">
        Instant Share
      </a>
      <a href="../PromotionAddCardSubcription/index.html" className="menu-item flex items-center gap-2 mb-3">
        Music Promotion
      </a>
      <div className="section-title font-bold mt-5">Products</div>
      <a href="#" className="menu-item flex items-center gap-2 mb-3">
        Home
      </a>
      <a href="#" className="menu-item flex items-center gap-2 mb-3">
        Zuum News
      </a>
      <a href="#" className="menu-item flex items-center gap-2 mb-3">
        Contact Us
      </a>
      <a href="#" className="menu-item flex items-center gap-2 mb-3">
        About Us
      </a>
      <div className="section-title font-bold mt-5">Help</div>
      <a href="#" className="menu-item flex items-center gap-2 mb-3">
        FAQ
      </a>
      <a href="#" className="menu-item flex items-center gap-2 mb-3">
        Support Centre
      </a>
    </div>
  );
};

export default Sidebar;