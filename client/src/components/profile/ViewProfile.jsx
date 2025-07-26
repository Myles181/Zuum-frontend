import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import c from "../../assets/icons/ORSJOS0 1.png";
import d from "../../assets/icons/Mask group1.svg";
import classNames from "classnames";
import MusicSection from "./MusicSection";
import VideoSection from "./VideoSection";
import useProfile, { useFollowUser } from "../../../Hooks/useProfile";
import { useGetRoomId } from "../../../Hooks/messages/useMessages";

const UserProfileSection = ({ profiles, isOtherUser = true }) => {
  const { profile: authProfile, loading: authLoading } = useProfile();
  const { message, followUser } = useFollowUser();
  const { getRoomId, loading: roomLoading, error: roomError } = useGetRoomId();
  const navigate = useNavigate();

  // local UI state
  const [isFollowing, setIsFollowing]       = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile]     = useState(false);
  const [followLoading, setFollowLoading]   = useState(false);
  const [activeTab, setActiveTab]           = useState("audio");

  // ensure we only seed followersCount once
  const didInitFollowers = useRef(false);

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

  // On first load, set isOwnProfile and initial followers count
  useEffect(() => {
    if (!authLoading && authProfile && mergedProfile && !didInitFollowers.current) {
      setIsOwnProfile(authProfile.id === mergedProfile.id);
      setFollowersCount(mergedProfile.followers_list?.length || 0);
      // set whether current user is following
      const followed = mergedProfile.followers_list?.some(f =>
        typeof f === "object" ? f.id === authProfile.id : f === authProfile.id
      );
      setIsFollowing(followed);
      didInitFollowers.current = true;
    }
  }, [authLoading, authProfile, mergedProfile]);

  // Redirect to own profile if they navigate here themselves
  useEffect(() => {
    if (isOwnProfile) navigate("/profile");
  }, [isOwnProfile, navigate]);

  const handleFollow = async () => {
    if (!authProfile) return;

    const willFollow = !isFollowing;

    // 1) Optimistic UI update
    setIsFollowing(willFollow);
    setFollowersCount(count => willFollow ? count + 1 : count - 1);
    setFollowLoading(true);

    // 2) Fire & forget the server call, revert on error
    try {
      await followUser(mergedProfile.id, willFollow);
    } catch (err) {
      console.error(err);
      // rollback
      setIsFollowing(followed => !followed);
      setFollowersCount(count => willFollow ? count - 1 : count + 1);
    } finally {
      setFollowLoading(false);
    }
  };

   
    const tabs = mergedProfile.identity.toLowerCase() === "producer" || "dev"
      ? ["beats", "audio", "video"]
      : ["audio", "video"];
  
    // Handle tab clicks
    const handleTabClick = (tab) => {
      if (tab === "beats") {
        // Pass mergedProfile.id via route param to purchased beats page
        navigate(`/userbeats/${mergedProfile.id}`);
      } else {
        setActiveTab(tab);
      }
    };
  

  const handleMessageClick = async () => {
    if (!authProfile) return;
    try {
      const roomId = await getRoomId(authProfile.id, mergedProfile.id);
      navigate(`/chat/${roomId}`, {
        state: {
          userId: authProfile.id,
          otherUserId: mergedProfile.id,
          roomId,
          otherProfilePicture: mergedProfile.image,
          otherUsername: mergedProfile.username
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-container relative">
      {/* Cover & Avatar */}
      <div className="profile-background h-60 overflow-hidden rounded-t-lg">
        <img
          src={mergedProfile.cover_image}
          alt="Profile Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="profile-header absolute top-48 left-4">
        <img
          src={mergedProfile.image}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 shadow-lg"
          style={{ borderColor: 'var(--color-bg-primary)' }}
        />
      </div>

      {/* Stats */}
      <div className="stats-container flex flex-col items-center mt-16 px-5 text-center">
        <h2 className="text-2xl text-[#008066]">{mergedProfile.username}</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>{mergedProfile.identity}</p>
        <div 
          className="stats flex justify-around w-full max-w-md mt-4 gap-5"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <div>
            <p>Followers</p>
            <span className="text-[#008066] font-bold">{followersCount}</span>
          </div>
          <div>
            <p>Following</p>
            <span className="text-[#008066] font-bold">
              {mergedProfile.following_list?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p 
        className="bio text-center px-5 mt-5"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {mergedProfile.bio}
      </p>

      {/* Follow / Message buttons */}
      <div className="buttons flex justify-center mt-5 gap-3">
  <button
    onClick={handleFollow}
    disabled={followLoading}
    className={`px-6 py-2 rounded-lg ${
      followLoading
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : isFollowing
          ? "bg-white text-[#008066] border border-[#008066]"
          : "bg-[#008066] text-white"
    }`}
  >
    {followLoading
      ? (isFollowing ? "Following..." : "Unfollowing...")
      : (isFollowing ? "Unfollow" : "Follow")
    }
  </button>

  {isFollowing && (
    <button
      onClick={handleMessageClick}
      disabled={roomLoading}
      className={`px-6 py-2 rounded-lg bg-gray-200 text-[#008066] ${
        roomLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {roomLoading ? "Loading..." : "Message"}
    </button>
  )}
</div>

      {message && <p className="text-green-500 text-center mt-3">{message}</p>}
      {roomError && <p className="text-red-500 text-center mt-3">{roomError}</p>}

      {/* Tabs */}
      <div 
        className="tab-section pt-4 w-full rounded-b-lg"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div className="tab-buttons flex justify-center gap-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={classNames(
                "pb-4 px-6 text-lg font-medium relative transition-all",
                activeTab === tab
                  ? "text-[#008066] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#008066] after:rounded-t-lg"
                  : "text-gray-500 hover:text-[#008066]"
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="tab-content p-6">
          {activeTab === "audio" && (
            <MusicSection userId={mergedProfile.id} />
          )}

          {activeTab === "video" && (
            <VideoSection userId={mergedProfile.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
