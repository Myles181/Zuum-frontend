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
  isMessagePage,
  activeTab,
  handleTabClick,
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

  const isHomePage = location.pathname === '/home';
  const currentTab = activeTab || 'audio';

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

      {/* Middle Section - Audio/Video switch (only on Home) */}
      <div 
        className="flex items-center space-x-2 px-4 py-1 rounded-full transition-colors"
      >
        {isMessagePage && profilePicture && (
          <img
            src={profilePicture}
            alt={name}
            className="w-8 h-8 rounded-full object-cover border"
            style={{ borderColor: 'var(--color-primary-light)' }}
          />
        )}
        {isHomePage && (
          <div className="relative flex items-center w-30 text-xs rounded-full bg-white/5 border border-white/15 px-1 py-1">
            <button
              type="button"
              onClick={() => handleTabClick && handleTabClick('audio')}
              className={`relative z-10 px-3 py-1.5 font-medium transition-all duration-200 ${
                currentTab === 'audio'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-on-primary)]/75'
              }`}
            >
              Audio
            </button>
            <button
              type="button"
              onClick={() => handleTabClick && handleTabClick('video')}
              className={`relative z-10 px-3 py-1.5 font-medium transition-all duration-200 ${
                currentTab === 'video'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-on-primary)]/75'
              }`}
            >
              Video
            </button>
            {/* Sliding pill background */}
            <div
              className="absolute inset-y-1 w-14 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out"
              style={{
                transform: currentTab === 'audio' ? 'translateX(0%)' : 'translateX(100%)',
              }}
            />
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="nav-right flex space-x-4">
        {!(isDashboardPage || isMessagePage) && !isProfilePage && (
          <>
            <Link 
              to="/search"
              className="p-1 rounded-lg transition-colors hover:bg-[var(--color-bg-secondary)]"
            >
              <FiSearch 
                className="w-5 h-5" 
                style={{ color: 'var(--color-text-primary)' }}
              />
            </Link>
            <Link 
              to="/settings"
              className="p-1 rounded-lg transition-colors hover:bg-[var(--color-bg-secondary)]"
            >
              <FiSettings 
                className="w-5 h-5" 
                style={{ color: 'var(--color-text-primary)' }}
              />
            </Link>
          </>
        )}
        
        {/* On profile page, show a settings icon with appropriate color */}
        {isProfilePage && (
          <Link 
            to="/settings"
            className="p-1 rounded-lg transition-colors hover:bg-white hover:bg-opacity-10"
          >
            <FiSettings 
              className="w-5 h-5 text-white" 
            />
          </Link>
        )}

        {/* Menu button for mobile/sidebar toggle */}
        {/* <button 
          onClick={toggleSidebar}
          className={`p-1 rounded-lg transition-colors ${
            isProfilePage 
              ? 'hover:bg-white hover:bg-opacity-10 text-white' 
              : 'hover:bg-[var(--color-bg-secondary)]'
          }`}
          style={{ 
            color: isProfilePage ? 'white' : 'var(--color-text-primary)'
          }}
        >
          <FiMenu className="w-5 h-5" />
        </button> */}
      </div>
    </div>
  );
};

export default Navbar;