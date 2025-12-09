import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMessageCircle, FiPlusSquare, FiBell, FiUser } from 'react-icons/fi';

const BottomNav = ({ onHomeClick }) => {
  const location = useLocation();

  // Dark mode styles - consistent with other components
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

  // Improved active path detection
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div
      className="fixed bottom-0 left-0 w-full flex justify-around py-2 z-50"
      style={{
        ...darkModeStyles,
        backgroundColor: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border)'
      }}
    >
      {/* Home */}
      <Link
        to='/home'
        state={{ openAnnouncement: true }}
        onClick={(e) => {
          if (isActive('/home') && onHomeClick) {
            e.preventDefault();
            onHomeClick();
          }
        }}
        className="flex flex-col items-center p-2 transition-colors duration-200"
        style={{
          color: isActive('/home') ? 'var(--color-primary)' : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/home')) {
            e.target.style.color = 'var(--color-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive('/home')) {
            e.target.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        <FiHome className="w-6 h-6" />
        <span className="text-xs mt-1 hidden xs:block">Home</span>
      </Link>

      {/* Messages */}
      <Link
        to='/message'
        className="flex flex-col items-center p-2 transition-colors duration-200"
        style={{
          color: isActive('/message') ? 'var(--color-primary)' : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/message')) {
            e.target.style.color = 'var(--color-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive('/message')) {
            e.target.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        <FiMessageCircle className="w-6 h-6" />
        <span className="text-xs mt-1 hidden xs:block">Message</span>
      </Link>

      {/* Add */}
      <Link
        to='/add'
        className="flex flex-col items-center p-2 transition-colors duration-200"
        style={{
          color: isActive('/add') ? 'var(--color-primary)' : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/add')) {
            e.target.style.color = 'var(--color-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive('/add')) {
            e.target.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        <FiPlusSquare className="w-6 h-6" />
        <span className="text-xs mt-1 hidden xs:block">Add</span>
      </Link>

      {/* Activities */}
      <Link
        to='/activity'
        className="flex flex-col items-center p-2 transition-colors duration-200"
        style={{
          color: isActive('/activity') ? 'var(--color-primary)' : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/activity')) {
            e.target.style.color = 'var(--color-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive('/activity')) {
            e.target.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        <FiBell className="w-6 h-6" />
        <span className="text-xs mt-1 hidden xs:block">Activities</span>
      </Link>

      {/* Profile */}
      <Link
        to='/profile'
        className="flex flex-col items-center p-2 transition-colors duration-200"
        style={{
          color: isActive('/profile') ? 'var(--color-primary)' : 'var(--color-text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!isActive('/profile')) {
            e.target.style.color = 'var(--color-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive('/profile')) {
            e.target.style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        <FiUser className="w-6 h-6" />
        <span className="text-xs mt-1 hidden xs:block">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav;