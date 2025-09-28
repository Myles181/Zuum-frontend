import React, { useEffect, useState } from "react";
import Sidebar from "../components/homepage/Sidebar";
import Overlay from "../components/homepage/Overlay";
import ProfileSection from '../components/profile/ProfileSection';
import MusicSection from "../components/profile/MusicSection";
import BottomNav from "../components/homepage/BottomNav";
import Navbar from "../components/profile/NavBar";
import useUserProfile from "../../Hooks/useProfile"; // Import the custom hook
import Spinner from "../components/Spinner";

const ArtistPage = ({profile, error}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  console.log(profile);
  
  return (
    <div 
      className="relative min-h-screen"
      style={darkModeStyles}
    >
      {/* Page content */}
      <Navbar toggleSidebar={toggleSidebar} name={"Profile"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div 
        className="profile-container flex flex-col items-center mt-4 mb-15"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        {error ? (
          <p 
            className="text-red-500 text-center mt-4"
            style={{ color: 'var(--color-error)' }}
          >
            {error}
          </p>
        ) : (
          <>
            <ProfileSection profile={profile} />
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ArtistPage;