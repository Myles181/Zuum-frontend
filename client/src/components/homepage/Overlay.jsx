import React from 'react';

const Overlay = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`overlay fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={toggleSidebar}
    ></div>
  );
};

export default Overlay;