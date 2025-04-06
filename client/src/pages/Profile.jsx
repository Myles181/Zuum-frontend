import React, { useEffect, useState } from "react";
import Sidebar from "../components/homepage/Sidebar";
import Overlay from "../components/homepage/Overlay";
import ProfileSection from '../components/profile/ProfileSection';
import MusicSection from "../components/profile/MusicSection";
import BottomNav from "../components/homepage/BottomNav";
import Navbar from "../components/profile/NavBar";
import useUserProfile from "../../Hooks/useProfile"; // Import the custom hook
import Spinner from "../components/Spinner";

const ArtistPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use the useUserProfile hook to fetch profile data
  const { profile, loading, error } = useUserProfile();

  // Debugging: Log profile data
  console.log("Profile Data:", profile);
  console.log("Loading:", loading);
  console.log("Error:", error);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative min-h-screen">
      {/* Full-page spinner overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <Spinner /> {/* Show the spinner while loading */}
        </div>
      )}

      {/* Page content */}
      <Navbar toggleSidebar={toggleSidebar} name={"Profile"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="profile-container flex flex-col items-center  mt-4 mb-15">
      {error ? (
        <p className="text-red-500 text-center mt-4">{error}</p>
      ) : (
        <>
          <ProfileSection profile={profile || {}} />
         
        </>
      )}
        </div>
      <BottomNav />
    </div>
  );
};

export default ArtistPage;