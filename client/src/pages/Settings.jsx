import React, { useState } from 'react'
import Navbar from '../components/profile/NavBar'
import Sidebar from '../components/homepage/Sidebar'
import Overlay from '../components/homepage/Overlay'
import BottomNav from '../components/homepage/BottomNav'
import { useAuth } from '../contexts/AuthContexts'

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
    
      <ul className="mt-5">
        {/* Change Password */}
        <li className="py-3 border-b border-gray-200 flex justify-between items-center mt-10">
          <span className="text-gray-700">Change Password</span>
          <button className="text-green-700 hover:text-green-800">Edit</button>
        </li>
    
        {/* Language */}
        <li className="py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="text-gray-700">Language</span>
          <button className="text-green-700 hover:text-green-800">Edit</button>
        </li>
    
        {/* Contact Us */}
        <li className="py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="text-gray-700">Contact Us</span>
          <button className="text-green-700 hover:text-green-800">Edit</button>
        </li>
    
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