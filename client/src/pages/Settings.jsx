import React, { useState } from 'react'
import Navbar from '../components/profile/NavBar'
import Sidebar from '../components/homepage/Sidebar'
import Overlay from '../components/homepage/Overlay'
import BottomNav from '../components/homepage/BottomNav'
import { useAuth } from '../contexts/AuthContexts'
import { Link } from 'react-router-dom'

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { token, logout } = useAuth(); // Access auth context

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>{/* Settings Section */}
    <Navbar toggleSidebar={toggleSidebar} name={"Settings"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    <section id="settings-section" className="bg-white rounded-lg shadow-md p-5 mt-5 w-full">
    
      <ul className="mt-8">
        {/* Change Password */}
        <Link to='/dashboard' className="py-3 border-b border-gray-200 flex justify-between items-center">
        <span className="text-gray-700">Dashboard</span>
        </Link>
      
        {/* Deactivate Account */}
        <li className="py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="text-gray-700">Deactivate Account</span>
          <button className="text-red-600 hover:text-red-700">Deactivate</button>
        </li>
    
        {/* Delete Account */}
        <li className="py-3 flex justify-between items-center">
          <span className="text-gray-700">Delete Account</span>
          <button className="text-red-600 hover:text-red-700">Delete</button>
        </li>
      </ul>
    
      {/* Log Out Button */}
      <button className="bg-[#008066] text-white rounded-2xl px-6 py-3 block mx-auto mt-5 hover:bg-[#006652] transition-colors"
      onClick={logout} >
        Log Out
      </button>
    </section>
    <BottomNav />
    </div>
  )
}

export default Settings