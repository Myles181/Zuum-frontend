import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import c from "../../assets/icons/ORSJOS0 1.png";
import d from "../../assets/icons/Mask group1.svg";
import MusicSection from "./MusicSection";
import VideoSection from "./VideoSection";
import useProfile, { useFollowUser } from "../../../Hooks/useProfile";
import { useGetRoomId } from "../../../Hooks/messages/useMessages";


const UserProfileSection = ({ profiles, isOtherUser = true }) => {
  const { profile: authProfile, loading: authLoading } = useProfile();
  const { message, followUser } = useFollowUser();
  const { getRoomId, loading: roomLoading, error: roomError } = useGetRoomId(); // Destructure the hook
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("audio");
  const [followersCount, setFollowersCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const navigate = useNavigate();

  const fallbackProfile = {
    cover_image: c,
    image: d,
    username: "Dave_sings",
    identity: "Artist",
    bio: "I'm a singer-songwriter...",
    followers_list: [],
    following_list: []
  };

  const mergedProfile = { ...fallbackProfile, ...profiles?.data };

  useEffect(() => {
    if (!authLoading && authProfile && mergedProfile) {
      setIsOwnProfile(authProfile.id === mergedProfile.id);
      
      const isUserFollowing = mergedProfile.followers_list?.some((follower) =>
        typeof follower === "object" ? follower.id === authProfile.id : follower === authProfile.id
      );
      setIsFollowing(isUserFollowing);
      setFollowersCount(mergedProfile.followers_list?.length || 0);
    }
  }, [authProfile, mergedProfile, authLoading]);

  const handleFollow = async () => {
    try {
      await followUser(mergedProfile.id, !isFollowing);
      setIsFollowing((prev) => !prev);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  useEffect(() => {
    if (isOwnProfile) {
      navigate("/profile");
    }
  }, [isOwnProfile, navigate]);

  const handleMessageClick = async () => {
    if (!authProfile || !mergedProfile) return;
    
    try {
      const roomId = await getRoomId(authProfile.id, mergedProfile.id);
      if (roomId) {
        navigate(`/chat/${roomId}`, {
          state: {
            userId: authProfile.id,           // Current user's ID
            otherUserId: mergedProfile.id,    // Other user's ID
            roomId: roomId,                   // The chat room ID
            otherProfilePicture: mergedProfile.image || d,  // Other user's profile picture
            otherUsername: mergedProfile.username          // Other user's username (optional)
          }
        });
      }
    } catch (error) {
      console.error("Error getting room ID:", error);
      // You might want to show an error message to the user here
    }
  };

  if (authLoading) {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="profile-container relative">
      <div className="profile-background h-60 overflow-hidden rounded-t-lg relative">
        <img src={mergedProfile.cover_image || c} alt="Profile Background" className="w-full h-full object-cover" />
      </div>

      <div className="profile-header absolute top-48 left-4">
        <img src={mergedProfile.image || d} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
      </div>

      <div className="stats-container flex flex-col items-center mt-16 w-full px-5 text-center">
        <h2 className="text-2xl text-[#008066]">{mergedProfile.username}</h2>
        <p className="text-gray-500">{mergedProfile.identity}</p>

        <div className="stats flex justify-around w-full max-w-md mt-4 gap-5 text-gray-500 flex-wrap">
          <div className="followers text-center">
            <p>Followers</p>
            <span className="text-[#008066] font-bold">{followersCount}</span>
          </div>
          <div className="following text-center">
            <p>Following</p>
            <span className="text-[#008066] font-bold">{mergedProfile.following_list?.length || 0}</span>
          </div>
        </div>
      </div>

      <p className="bio text-gray-700 text-center px-5 mt-5">{mergedProfile.bio}</p>

      <div className="buttons flex justify-center mt-5 w-full gap-3">
        <button 
          onClick={handleFollow} 
          className="bg-gray-200 text-[#008066] px-6 py-2 rounded-lg"
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
        {isFollowing && (
          <button
            onClick={handleMessageClick}
            disabled={roomLoading}
            className={`bg-gray-200 text-[#008066] px-6 py-2 rounded-lg ${
              roomLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {roomLoading ? "Loading..." : "Message"}
          </button>
        )}
      </div>

      {message && <p className="text-green-500 text-center mt-3">{message}</p>}
      {roomError && <p className="text-red-500 text-center mt-3">{roomError}</p>}

      <div className="tab-section mt-8 w-full">
        <div className="tab-buttons flex justify-center gap-8 border-b-2 border-gray-200">
          {["audio", "video"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-lg font-medium relative ${
                activeTab === tab
                  ? "text-[#008066] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#008066] after:rounded-full"
                  : "text-gray-600 hover:text-[#008066] transition"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="tab-content mt-4">
          {activeTab === "audio" ? <MusicSection userId={mergedProfile?.id} /> : <VideoSection userId={mergedProfile?.id} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;