import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMessageCircle, FiPlusSquare, FiBell, FiUser } from 'react-icons/fi'; // Import icons from react-icons

const BottomNav = () => {
  const location = useLocation(); // Get current route

  const getLinkClass = (path) =>
    location.pathname === path ? "text-green-800 dark:text-green-400" : "";

  return (
    <div 
      className="bottom-nav fixed bottom-0 left-0 w-full border-t flex justify-around p-1 z-50"
      style={{ 
        backgroundColor: 'var(--color-bg-primary)',
        borderTopColor: 'var(--color-border)'
      }}
    >
      {/* Home */}
      <Link 
        to='/home' 
        className={`nav-item flex flex-col items-center text-xs sm:text-sm ${getLinkClass('/home')}`}
        style={{ 
          color: location.pathname === '/home' ? '#166534' : 'var(--color-text-secondary)'
        }}
      >
        <FiHome className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
        <span className="hidden xs:block">Home</span>
      </Link>

      {/* Messages */}
      <Link 
        to='/message' 
        className={`nav-item flex flex-col items-center text-xs sm:text-sm ${getLinkClass('/message')}`}
        style={{ 
          color: location.pathname === '/message' ? '#166534' : 'var(--color-text-secondary)'
        }}
      >
        <FiMessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
        <span className="hidden xs:block">Message</span>
      </Link>

      {/* Add */}
      <Link 
        to='/add' 
        className={`nav-item flex flex-col items-center text-xs sm:text-sm ${getLinkClass('/add')}`}
        style={{ 
          color: location.pathname === '/add' ? '#166534' : 'var(--color-text-secondary)'
        }}
      >
        <FiPlusSquare className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
        <span className="hidden xs:block">Add</span>
      </Link>

      {/* Activities */}
      <Link 
        to='/activity' 
        className={`nav-item flex flex-col items-center text-xs sm:text-sm ${getLinkClass('/activity')}`}
        style={{ 
          color: location.pathname === '/activity' ? '#166534' : 'var(--color-text-secondary)'
        }}
      >
        <FiBell className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
        <span className="hidden xs:block">Activities</span>
      </Link>

      {/* Profile */}
      <Link 
        to='/profile' 
        className={`nav-item flex flex-col items-center text-xs sm:text-sm ${getLinkClass('/profile')}`}
        style={{ 
          color: location.pathname === '/profile' ? '#166534' : 'var(--color-text-secondary)'
        }}
      >
        <FiUser className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
        <span className="hidden xs:block">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav; 