import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiChevronLeft, FiSearch, FiSettings } from 'react-icons/fi';
import { MdRocketLaunch } from 'react-icons/md';

const Navbar = ({ 
  toggleSidebar, 
  name, 
  profilePicture, 
  goBack, 
  isDashboardPage,
  isMessagePage 
}) => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  
  // Dark mode styles - consistent with ProfileSection
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151'
  };

  // Truncate name if it's too long
  const displayName = name?.length > 8 ? name.substring(0, 10) + "..." : name;

  return (
    <div 
      className={`navbar backdrop-blur-md shadow-md flex items-center justify-between px-4 py-3 fixed top-0 left-0 w-full z-50 transition-colors duration-200 ${
        isProfilePage ? 'bg-transparent' : ''
      }`}
      style={{ 
        ...darkModeStyles,
        backgroundColor: isProfilePage ? 'transparent' : 'var(--color-bg-primary)',
        borderBottom: isProfilePage ? 'none' : '1px solid var(--color-border)',
        opacity: isProfilePage ? 1 : 0.95
      }}
    >
      {/* Left Section */}
      <div className="nav-left">
        {isMessagePage || isDashboardPage ? (
          <FiChevronLeft
            className={`w-6 h-6 cursor-pointer transition-colors hover:opacity-80 ${
              isProfilePage ? 'text-white' : 'text-[var(--color-text-primary)]'
            }`}
            onClick={goBack}
          />
        ) : (
          <Link to="/jet">
            <MdRocketLaunch 
              className={`w-6 h-6 transition-colors hover:opacity-80 ${
                isProfilePage ? 'text-white' : 'text-[var(--color-text-primary)]'
              }`}
            />
          </Link>
        )}
      </div>

      {/* Middle Section */}
      <div 
        className="flex items-center space-x-2 px-4 py-1 rounded-full transition-colors"
        style={{ 
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-on-primary)'
        }}
      >
        {isMessagePage && profilePicture && (
          <img
            src={profilePicture}
            alt={name}
            className="w-8 h-8 rounded-full object-cover border"
            style={{ borderColor: 'var(--color-primary-light)' }}
          />
        )}
        <div 
          className="rounded-full flex items-center"
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)'
          }}
        >
          <span 
            className="font-medium text-sm"
            style={{ color: 'var(--color-text-on-primary)' }}
          >
            {displayName || "User"}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="nav-right flex space-x-4">
        {!(isDashboardPage || isMessagePage) && !isProfilePage && (
          <>
            <Link 
              to="/search"
              className="p-1 rounded-lg transition-colors hover:bg-[var(--color-bg-secondary)]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <FiSearch className="w-5 h-5" />
            </Link>
            <Link 
              to="/settings"
              className="p-1 rounded-lg transition-colors hover:bg-[var(--color-bg-secondary)]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <FiSettings className="w-5 h-5" />
            </Link>
          </>
        )}
        
        {/* On profile page, show a settings icon with appropriate color */}
        {isProfilePage && (
          <Link 
            to="/settings"
            className="p-1 rounded-lg transition-colors hover:bg-white hover:bg-opacity-10"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <FiSettings className="w-5 h-5" />
          </Link>
        )}

        {/* Menu button for mobile/sidebar toggle */}
        <button 
          onClick={toggleSidebar}
          className={`p-1 rounded-lg transition-colors ${
            isProfilePage 
              ? 'hover:bg-white hover:bg-opacity-10' 
              : 'hover:bg-[var(--color-bg-secondary)]'
          }`}
          style={{ 
            color: isProfilePage ? 'var(--color-text-primary)' : 'var(--color-text-primary)'
          }}
        >
          <FiMenu className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;