import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import c from "../../assets/icons/ORSJOS0 1.png";
import d from "../../assets/icons/Mask group1.svg";
import { FiActivity, FiBarChart, FiGrid, FiHome } from "react-icons/fi"; // Import dashboard icon
import MusicSection from "./MusicSection";
import VideoSection from "./VideoSection";

const ProfileSection = ({ profile }) => {
  // Fallback data in case profile is null or undefined
  const fallbackProfile = useMemo(() => ({
    cover_image: c,
    image: d,
    username: "Dave_sings",
    identity: "Artist",
    bio: "I'm a singer-songwriter, weaving emotions into melodies that touch hearts and inspire minds.",
    followers_list: [],
    following_list: [],
  }), []);

  // Merge profile data with fallback data
  const mergedProfile = useMemo(() => ({ ...fallbackProfile, ...profile }), [profile, fallbackProfile]);

  // State to manage active tab
  const [activeTab, setActiveTab] = useState("audio");

  return (
    <div className="profile-container relative ">
      {/* Background Image with Dashboard Icon */}
      <div className="profile-background h-60 overflow-hidden rounded-t-lg relatve">
        <img
          src={mergedProfile.cover_image || c}
          alt="Profile Background"
          className="w-full h-full object-cover"
        />
        {/* Dashboard Icon */}
        <Link 
          to="/dashboard" 
          className="absolute top-4 right-4 bg-white/90 p-2 mt-10 rounded-full shadow-lg hover:bg-white transition-all"
          title="Go to Dashboard"
        >
          <FiBarChart className="w-5 h-5 text-[#008066]" />
        </Link>
      </div>

      {/* Profile Image */}
      <div className="profile-header absolute top-48 left-4">
        <img
          src={mergedProfile.image || d}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
      </div>

      {/* User Info */}
      <div className="stats-container flex flex-col items-center mt-16 w-full px-5 text-center">
        <h2 className="text-2xl text-[#008066]">{mergedProfile.username}</h2>
        <p className="text-gray-500">{mergedProfile.identity}</p>
      </div>

      <p className="bio text-gray-700 text-center px-5 mt-3">
        {mergedProfile.bio}
      </p>

      {/* Followers & Following */}
      <div className="stats flex justify-around w-full  max-w-md mt-4 gap-5 text-gray-500 ">
        {["Followers", "Following"].map((item, index) => (
          <div key={index} className="text-center">
            <p>{item}</p>
            <span className="text-[#008066] font-bold">
              {index === 0 ? mergedProfile.followers_list?.length || 0 : mergedProfile.following_list?.length || 0}
            </span>
          </div>
        ))}
      </div>

      {/* Profile Actions */}
      <div className="buttons flex justify-center mt-5 w-full gap-3">
        <Link to="/editprofile">
          <button className="bg-gray-200 text-[#008066] px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Edit Profile
          </button>
        </Link>
        <button className="bg-gray-200 text-[#008066] px-6 py-2 rounded-lg hover:bg-gray-300 transition">
          Share Profile
        </button>
      </div>

      {/* Tab Section */}
      <div className="tab-section mt-8 w-full">
        <div className="tab-buttons flex justify-center gap-8 border-b-2 border-gray-200">
          {["audio", "video"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={classNames(
                "pb-2 text-lg font-medium relative",
                activeTab === tab
                  ? "text-[#008066] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#008066] after:rounded-full"
                  : "text-gray-600 hover:text-[#008066] transition"
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content mt-4">
          {activeTab === "audio" ? (
            <MusicSection userId={mergedProfile.id} />
          ) : (
            <VideoSection userId={mergedProfile.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;