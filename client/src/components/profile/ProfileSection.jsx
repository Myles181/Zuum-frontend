import React, { useState } from "react";
import c from "../../assets/icons/ORSJOS0 1.png";
import d from "../../assets/icons/Mask group1.svg";
import { Link } from "react-router-dom";
import MusicSection from "./MusicSection";
import VideoSection from "./VideoSection";


const ProfileSection = ({ profile }) => {
  // Fallback data in case profile is null or undefined
  const fallbackProfile = {
    cover_image: c, // Default cover image
    image: d, // Default profile image
    username: "Dave_sings", // Default username
    identity: "Artist", // Default identity
    bio: "I'm a singer-songwriter, weaving emotions into melodies that touch hearts and inspire minds.", // Default bio
  };

  // Merge profile data with fallback data
  const mergedProfile = { ...fallbackProfile, ...profile };

  // State to manage active tab
  const [activeTab, setActiveTab] = useState("audio"); // Default to "audio"

  return (
    <div className="profile-container relative">
      {/* Background Image */}
      <div className="profile-background h-60 overflow-hidden rounded-t-lg relative">
        <img
          src={mergedProfile.cover_image ? mergedProfile.cover_image : c}
          alt="Profile Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Image (Floating Over Background) */}
      <div className="profile-header absolute top-48 left-4">
        <img
          src={mergedProfile.image ? mergedProfile.image : d}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
      </div>

      <div className="stats-container flex flex-col items-center mt-16 w-full px-5 text-center">
        <div className="username">
          <h2 className="text-2xl text-[#008066]">{mergedProfile.username}</h2>
          <p className="text-gray-500">{mergedProfile.identity}</p>
        </div>

        <div className="stats flex justify-around w-full max-w-md mt-4 gap-5 text-gray-500 flex-wrap">
          <div className="followers text-center">
            <p>Followers</p>
            <span className="text-[#008066] font-bold">42k</span>
          </div>
          <div className="following text-center">
            <p>Following</p>
            <span className="text-[#008066] font-bold">5.2k</span>
          </div>
        </div>
      </div>

      <p className="bio text-gray-700 text-center px-5 mt-5">
        {mergedProfile.bio}
      </p>

      <div className="buttons flex justify-center mt-5 w-full gap-3">
        <Link to="/editprofile">
          <button className="bg-gray-200 text-[#008066] px-6 py-2 rounded-lg">
            Edit Profile
          </button>
        </Link>
        <button className="bg-gray-200 text-[#008066] px-6 py-2 rounded-lg">
          Share Profile
        </button>
      </div>

      {/* Tab Section */}
      <div className="tab-section mt-8 w-full">
        <div className="tab-buttons flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("audio")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "audio"
                ? "bg-[#008066] text-white"
                : "bg-gray-200 text-[#008066]"
            }`}
          >
            Audio
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "video"
                ? "bg-[#008066] text-white"
                : "bg-gray-200 text-[#008066]"
            }`}
          >
            Video
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content mt-4">
          {activeTab === "audio" ? <MusicSection /> : <VideoSection />}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;