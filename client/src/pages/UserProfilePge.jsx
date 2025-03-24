import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get userId from the URL
import Sidebar from "../components/homepage/Sidebar";
import Overlay from "../components/homepage/Overlay";
// import ProfileSection from '../components/profile/ProfileSection';
import BottomNav from "../components/homepage/BottomNav";
import Navbar from "../components/profile/NavBar";

import Spinner from "../components/Spinner";
import ProfileSection from "../components/profile/ViewProfile";
import { useUserProfile } from "../../Hooks/useProfile";

const UserProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId } = useParams(); // Get the userId from the URL
  console.log(userId);
  

  // Use the useUserProfile hook to fetch profile data for the user being viewed
  const { profile, loading, error } = useUserProfile(userId);
  console.log(profile);
  

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
      <div className="profile-container flex flex-col items-center mt-4 mb-15">
        {error ? (
          <p className="text-red-500 text-center mt-4">{error}</p>
        ) : (
          <>
            <ProfileSection profiles={profile || {}}  />
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default UserProfilePage;