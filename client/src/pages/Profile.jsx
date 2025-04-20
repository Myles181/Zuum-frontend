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

 



  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  console.log(profile);
  

  return (
    <div className="relative min-h-screen">
    

      {/* Page content */}
      <Navbar toggleSidebar={toggleSidebar} name={"Profile"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="profile-container flex flex-col items-center  mt-4 mb-15">
      {error ? (
        <p className="text-red-500 text-center mt-4">{error}</p>
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