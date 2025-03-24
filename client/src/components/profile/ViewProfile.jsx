


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import c from "../../assets/icons/ORSJOS0 1.png";
import d from "../../assets/icons/Mask group1.svg";
import MusicSection from "./MusicSection";
import VideoSection from "./VideoSection";
import useProfile, { useFollowUser } from "../../../Hooks/useProfile";

const ProfileSection = ({ profiles, isOtherUser = true }) => {
  const { profile: authProfile } = useProfile();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("audio");
  const navigate = useNavigate();
  const { loading, error, message, followUser } = useFollowUser();

  // Fallback data
  const fallbackProfile = {
    cover_image: c,
    image: d,
    username: "Dave_sings",
    identity: "Artist",
    bio: "I'm a singer-songwriter...",
    followers_list: [], // Added to fallback
    following_list: [] // Added to fallback
  };

  // Merge profile data
  const mergedProfile = { ...fallbackProfile, ...profiles.data };

  // Check if viewing own profile
  const isOwnProfile = authProfile?.id === mergedProfile?.id;

  // Set initial follow status
  useEffect(() => {
    if (authProfile && mergedProfile.followers_list) {
      // For followers_list containing objects
      const isUserFollowing = Array.isArray(mergedProfile.followers_list) && 
        mergedProfile.followers_list.some(follower => 
          typeof follower === 'object' ? 
          follower.id === authProfile.id : 
          follower === authProfile.id
        );
      
      // For following_list containing just IDs (like [7])
      const isUserFollowingAlt = Array.isArray(mergedProfile.following_list) && 
        mergedProfile.following_list.includes(authProfile.id);
      
      setIsFollowing(isUserFollowing || isUserFollowingAlt);
    }
  }, [authProfile, mergedProfile.followers_list, mergedProfile.following_list]);

  // Redirect if viewing own profile
  // useEffect(() => {
    if (isOwnProfile) {
      navigate("/profile");
    }
  // }, [isOwnProfile, navigate]);

  const handleFollow = async () => {
    try {
      await followUser(mergedProfile.id, !isFollowing);
      setIsFollowing(prev => !prev);
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

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
    <span className="text-[#008066] font-bold">
      {mergedProfile.followers_list?.length || 0}
    </span>
  </div>
  <div className="following text-center">
    <p>Following</p>
    <span className="text-[#008066] font-bold">
      {mergedProfile.following_list?.length || 0}
    </span>
  </div>
</div>
      </div>

      <p className="bio text-gray-700 text-center px-5 mt-5">
        {mergedProfile.bio}
      </p>

      {/* Follow/Unfollow Button */}
      <div className="buttons flex justify-center mt-5 w-full gap-3">
        <button
          onClick={handleFollow}
          disabled={loading} // Disable button while loading
          className="bg-gray-200 text-[#008066] px-6 py-2 rounded-lg"
        >
          {loading
            ? "Loading..."
            : isFollowing
            ? "Unfollow"
            : "Follow"}
        </button>
        <button className="bg-gray-200 text-[#008066] px-6 py-2 rounded-lg">
          Message
        </button>
      </div>

      {/* Display error or success messages */}
      {error && (
        <p className="text-red-500 text-center mt-3">{error}</p>
      )}
      {message && (
        <p className="text-green-500 text-center mt-3">{message}</p>
      )}

      {/* Tab Section */}
      <div className="tab-section mt-8 w-full">
        <div className="tab-buttons flex justify-center gap-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab("audio")}
            className={`pb-2 text-lg font-medium relative ${
              activeTab === "audio"
                ? "text-[#008066] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#008066] after:rounded-full"
                : "text-gray-600 hover:text-[#008066] transition"
            }`}
          >
            Audio
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`pb-2 text-lg font-medium relative ${
              activeTab === "video"
                ? "text-[#008066] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#008066] after:rounded-full"
                : "text-gray-600 hover:text-[#008066] transition"
            }`}
          >
            Video
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content mt-4">
          {activeTab === "audio" ? (
            <MusicSection userId={mergedProfile?.id} /> // Pass the userId to MusicSection
          ) : (
            <VideoSection userId={mergedProfile?.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;