import React, { useState } from 'react';
import { FaBars, FaSearch, FaUserCircle } from 'react-icons/fa';
import Navbar from '../../components/profile/NavBar';
import BottomNav from '../../components/homepage/BottomNav';
import { Link } from 'react-router-dom';

const UploadPage = ({ profile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Dark mode styles
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

  console.log(profile?.identity);

  return (
    <div style={darkModeStyles}>
      <Navbar name="Upload" toggleSidebar={toggleSidebar} />

      <div 
        className="flex items-center justify-center mt-10 mb-10"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div 
          className="container w-full md:w-2/3 overflow-hidden rounded-lg shadow-lg"
          style={{ 
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div className="content flex-1 p-10 text-center flex flex-col justify-center items-center">
            <div 
              className="title text-2xl md:text-3xl lg:text-4xl font-medium mb-10"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Choose the track you'd like to upload!<br />
              What would you like to share with us today?
            </div>

            <div className="upload-options grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-900 mx-auto">
              {/* Upload Music/Beat */}
              <div 
                className="upload-option group flex flex-col items-center border-2 rounded-xl p-8 text-center cursor-pointer transform transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-4 hover:shadow-2xl hover:border-green-400 active:scale-95"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-primary)';
                }}
              >
                <div className="option-icon-wrapper mb-4 transform transition-transform duration-500 group-hover:scale-125">
                  <svg className="option-icon w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18V5L21 3V16" stroke="#2D8C72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="6" cy="18" r="3" stroke="#2D8C72" strokeWidth="2"/>
                    <circle cx="18" cy="16" r="3" stroke="#2D8C72" strokeWidth="2"/>
                  </svg>
                </div>
                <Link to="/addbeat" className="w-full">
                  <button 
                    className="w-full text-green-600 px-6 py-3 rounded-full font-medium hover:bg-[#2D8C72] hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2D8C72';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                      e.target.style.color = '#2D8C72';
                    }}
                  >
                    Upload Music
                  </button>
                </Link>
              </div>

              {/* Upload a short video */}
              <div 
                className="upload-option group flex flex-col items-center border-2 rounded-xl p-8 text-center cursor-pointer transform transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-4 hover:shadow-2xl hover:border-green-400 active:scale-95"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-primary)';
                }}
              >
                <div className="option-icon-wrapper mb-4 transform transition-transform duration-500 group-hover:scale-125">
                  <svg className="option-icon w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#2D8C72" strokeWidth="2"/>
                    <path d="M10 16L16 12L10 8V16Z" fill="#2D8C72"/>
                  </svg>
                </div>
                <Link to="/addvideo" className="w-full">
                  <button 
                    className="w-full text-green-600 px-6 py-3 rounded-full font-medium hover:bg-[#2D8C72] hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2D8C72';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                      e.target.style.color = '#2D8C72';
                    }}
                  >
                    Upload a short video
                  </button>
                </Link>
              </div>

              {/* Upload beat for sale - only for producers */}
              {(profile?.identity === 'producer' || profile?.identity === 'dev') && (
                <div 
                  className="upload-option group flex flex-col items-center border-2 rounded-xl p-8 text-center cursor-pointer transform transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-4 hover:shadow-2xl hover:border-green-400 active:scale-95"
                  style={{ 
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: 'var(--color-border)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--color-bg-primary)';
                  }}
                >
                  <div className="option-icon-wrapper mb-4 transform transition-transform duration-500 group-hover:scale-125">
                    <svg className="option-icon w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2V6" stroke="#2D8C72" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M18.36 6.64L15.64 9.36" stroke="#2D8C72" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M22 12H18" stroke="#2D8C72" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M19.9 19H4.1C2.6 19 2 18.4 2 16.9V15.1C2 13.6 2.6 13 4.1 13H19.9C21.4 13 22 13.6 22 15.1V16.9C22 18.4 21.4 19 19.9 19Z" stroke="#2D8C72" strokeWidth="2"/>
                      <path d="M6 17V15" stroke="#2D8C72" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M10 17V15" stroke="#2D8C72" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <Link to="/addpaybeat" className="w-full">
                    <button 
                      className="w-full text-green-600 px-6 py-3 rounded-full font-medium hover:bg-[#2D8C72] hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#2D8C72';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                        e.target.style.color = '#2D8C72';
                      }}
                    >
                      Upload beat for sale
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default UploadPage;