import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMessageCircle, FiPlusSquare, FiBell, FiUser } from 'react-icons/fi';

const BottomNav = () => {
  const location = useLocation();

  // Improved active path detection
  const isActive = (path) => 
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div 
      className="fixed bottom-0 left-0 w-full flex justify-around py-2 z-50"
      style={{ 
        backgroundColor: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border)'
      }}
    >
      {/* Home */}
      <Link 
        to='/home' 
        className="flex flex-col items-center p-2"
        style={{ 
          color: isActive('/home') ? '#166534' : 'var(--color-text-secondary)'
        }}
      >
        <FiHome className="w-6 h-6" />
        <span className="text-xs mt-1 hidden xs:block">Home</span>
      </Link>

      {/* Messages */}
      <Link 
        to='/message' 
        className="flex flex-col items-center p-2"
        style={{ 
          color: isActive('/message') ? '#166534' : 'var(--color-text-secondary)'
        }}
      >
        <FiMessageCircle className="w-6 h-6" />
        <span className="text-xs mt-1 hidden xs:block">Message</span>
      </Link>

      {/* Add */}
      <Link 
        to='/add' 
        className="flex flex-col items-center p-2"
        style={{ 
          color: isActive('/add') ? '#166534' : 'var(--color-text-secondary)'
        }}
      >
        <FiPlusSquare className="w-6 h-6" />
        <span className="text-xs mt-1 hidden xs:block">Add</span>
      </Link>

      {/* Activities */}
      <Link 
        to='/activity' 
        className="flex flex-col items-center p-2"
        style={{ 
          color: isActive('/activity') ? '#166534' : 'var(--color-text-secondary)'
        }}
      >
        <FiBell className="w-6 h-6" />
        <span className="text-xs mt-1 hidden xs:block">Activities</span>
      </Link>

      {/* Profile */}
      <Link 
        to='/profile' 
        className="flex flex-col items-center p-2"
        style={{ 
          color: isActive('/profile') ? '#166534' : 'var(--color-text-secondary)'
        }}
      >
        <FiUser className="w-6 h-6" />
        <span className="text-xs mt-1 hidden xs:block">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav;