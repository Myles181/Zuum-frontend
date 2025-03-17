import React, { useState } from 'react';
import a from "../assets/icons/dots-icon.svg";
import b from "../assets/icons/search-icon.png";
import c from "../assets/icons/ORSJOS0 1.png";
import d from "../assets/icons/Mask group1.svg";
import e from "../assets/icons/dots-icon.svg";
import f from "../assets/icons/dots-icon.svg";
import BottomNav from '../components/homepage/BottomNav';
import Navbar from '../components/profile/NavBar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';

const Settings = () => {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };


 
   const toggleSidebar = () => {
     setSidebarOpen(!sidebarOpen);
   };
 

  return (
<div>


    <Navbar toggleSidebar={toggleSidebar}
    name={"Settings"}
    />
      
    <div className="profile-container flex flex-col items-center mt-2 ">
   
      <section>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="profile-info bg-white mt-5 p-5  rounded-lg shadow-md relative">
  <div className="profile-container relative">
    {/* Background Image */}
    <div className="profile-background h-40 overflow-hidden rounded-t-lg relative">
      <img src={c} alt="Profile Background" className="w-full h-full object-cover" />
    </div>

    {/* Profile Image (Absolute Positioning) */}
    <div className="profile-header absolute bottom-0 left-4 translate-y-1/2">
      <img src={d} alt="Profile Picture" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
    </div>
  </div>

  {/* Profile Content (Name, Bio, etc.) */}
  <div className="text-center mt-12">
    <h2 className="text-xl font-semibold">User Name</h2>
    <p className="text-gray-500">User Bio</p>
  </div>


     

          <div className="profile-details mt-10">
            <div className="form-group mb-5">
              <label htmlFor="username" className="block text-sm text-gray-500">Username</label>
              <input
                type="text"
                id="username"
                defaultValue="Olusteve"
                className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800"
              />
            </div>
            <div className="form-group mb-5">
              <label htmlFor="bio" className="block text-sm text-gray-500">Bio</label>
              <textarea
                id="bio"
                defaultValue="I'm a singer-songwriter, weaving emotions into melodies that touches.."
                className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800 resize-y h-32"
              ></textarea>
            </div>
            <div className="form-group mb-5">
              <label htmlFor="email" className="block text-sm text-gray-500">Email</label>
              <input
                type="email"
                id="email"
                defaultValue="olusteve@gmail.com"
                className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800"
              />
            </div>
            <div className="form-group mb-5">
              <label htmlFor="phone" className="block text-sm text-gray-500">Phone Number</label>
              <input
                type="tel"
                id="phone"
                defaultValue="+2345678901"
                className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-green-500 text-gray-800"
              />
            </div>
          </div>
        </div>

        <div className="buttons flex justify-center mt-5 mb-10">
          <button className="cancel bg-white text-green-700 border border-green-700 rounded-2xl px-6 py-3 mr-3">Cancel</button>
          <button className="save bg-green-700 text-white rounded-2xl px-6 py-3">Save</button>
        </div>
      </section>

      {/* Settings Section */}
      <section id="settings-section" className="flex flex-col items-start">
    
        <h2 className="text-xl font-bold mt-5 ">Settings</h2>
        <ul className="mt-5">
          <li className="py-3 border-b border-gray-200">Change Password</li>
          <li className="py-3 border-b border-gray-200">Language</li>
          <li className="py-3 border-b border-gray-200">Contact Us</li>
          <li className="py-3 border-b border-gray-200">Deactivate Account</li>
          <li className="py-3">Delete Account</li>
        </ul>
        <button className="bg-green-700 text-white rounded-2xl px-6 py-3 block mx-auto mt-5">Log Out</button>
      </section>

<BottomNav />
    </div>
    </div>
  );
};

export default Settings;