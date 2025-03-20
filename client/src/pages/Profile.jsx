import React, { useEffect, useState } from "react";
import Sidebar from "../components/homepage/Sidebar";
import Overlay from "../components/homepage/Overlay";
import ProfileSection from "../components/profile/ProfileSection";
import MusicSection from "../components/profile/MusicSection";
import BottomNav from "../components/homepage/BottomNav";
import Navbar from "../components/profile/NavBar";
import { useProfile } from "../../Hooks/useProfile"; // Import the custom hook

const ArtistPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { getProfile, loading, error } = useProfile(); // Get the function from the hook
  const [profile, setProfile] = useState(null); // Store profile data

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile(); // Fetch profile data
        setProfile(profileData); // Store it in state
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} name={"Profile"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {loading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ProfileSection profile={profile} />
      )}

      <MusicSection />
      <BottomNav />
    </div>
  );
};

export default ArtistPage;
