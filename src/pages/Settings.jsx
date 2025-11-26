import React, { useState } from 'react'
import Navbar from '../components/profile/NavBar'
import Sidebar from '../components/homepage/Sidebar'
import Overlay from '../components/homepage/Overlay'
import BottomNav from '../components/homepage/BottomNav'
import { useAuth } from '../contexts/AuthContexts'
import { Link } from 'react-router-dom'
import DarkModeSettings from '../components/DarkModeSettings'
import { useDarkMode } from '../contexts/DarkModeContext'

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { token, logout } = useAuth(); // Access auth context
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Access dark mode context

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: isDarkMode ? '#f9fafb' : '#1f2937' }}
    >
    <Navbar toggleSidebar={toggleSidebar} name={"Settings"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="pt-16 pb-20 px-4 max-w-2xl mx-auto">
        {/* Dark Mode Settings */}
        <div className="mb-6">
          <DarkModeSettings />
        </div>
        
        {/* Test Panel */}
        <div 
          className="mb-6 p-4 rounded-lg"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)'
          }}
        >
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Dark Mode Test
          </h3>
          <p 
            className="mb-4"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            This panel should change colors in dark mode
          </p>
          <div 
            className="p-3 rounded"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)'
            }}
          >
            <p>Test content</p>
          </div>
        </div>
        
        {/* Debug Panel */}
        <div 
          className="mb-6 p-4 rounded-lg"
          style={{
            backgroundColor: isDarkMode ? '#fef3c7' : '#92400e',
            border: `1px solid ${isDarkMode ? '#f59e0b' : '#fbbf24'}`
          }}
        >
          <h3 
            className="text-sm font-semibold mb-2"
            style={{ color: isDarkMode ? '#92400e' : '#fef3c7' }}
          >
            Debug Info
          </h3>
          <div 
            className="text-xs space-y-1"
            style={{ color: isDarkMode ? '#a16207' : '#fde68a' }}
          >
            <p>Dark Mode State: {isDarkMode ? 'ON' : 'OFF'}</p>
            <p>Document Class: {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</p>
            <p>Body Class: {document.body.classList.contains('dark') ? 'dark' : 'light'}</p>
            <p>localStorage: {localStorage.getItem('darkMode')}</p>
            <p>System Preference: {window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}</p>
            <button 
              onClick={toggleDarkMode}
              className="mt-2 px-3 py-1 rounded text-xs"
              style={{
                backgroundColor: isDarkMode ? '#d97706' : '#f59e0b',
                color: 'white'
              }}
            >
              Toggle Dark Mode
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('darkMode');
                window.location.reload();
              }}
              className="mt-2 ml-2 px-3 py-1 rounded text-xs"
              style={{
                backgroundColor: isDarkMode ? '#dc2626' : '#ef4444',
                color: 'white'
              }}
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Other Settings */}
        <section 
          id="settings-section" 
          className="rounded-lg shadow-md p-5 w-full"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)'
          }}
        >
          <h2 
            className="text-xl font-semibold mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Account Settings
          </h2>
          
                      <ul className="space-y-4">
              {/* Dashboard */}
              <Link 
                to='/dashboard' 
                className="py-3 border-b flex justify-between items-center rounded-lg px-3 transition-colors"
                style={{
                  borderBottomColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span>Dashboard</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>→</span>
        </Link>
      
        {/* Deactivate Account */}
              <li 
                className="py-3 border-b flex justify-between items-center rounded-lg px-3 transition-colors"
                style={{
                  borderBottomColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span>Deactivate Account</span>
                <button 
                  className="hover:text-red-700 transition-colors"
                  style={{ color: '#dc2626' }}
                >
                  Deactivate
                </button>
        </li>
    
        {/* Delete Account */}
              <li 
                className="py-3 flex justify-between items-center rounded-lg px-3 transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span>Delete Account</span>
                <button 
                  className="hover:text-red-700 transition-colors"
                  style={{ color: '#dc2626' }}
                >
                  Delete
                </button>
        </li>
      </ul>
    
      {/* Log Out Button */}
          <button className="bg-[#008066] text-white rounded-2xl px-6 py-3 block mx-auto mt-8 hover:bg-[#006652] transition-colors"
      onClick={logout} >
        Log Out
      </button>
    </section>
      </div>
      
    <BottomNav />
    </div>
  )
}

export default Settings