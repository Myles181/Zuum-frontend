import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import c from "../../assets/icons/ORSJOS0 1.png";
import d from "../../assets/icons/Mask group1.svg";
import classNames from "classnames";
import MusicSection from "./MusicSection";
import VideoSection from "./VideoSection";
import useProfile, { useFollowUser } from "../../../Hooks/useProfile";
import { useGetRoomId } from "../../../Hooks/messages/useMessages";
import { FiMail, FiPhone, FiCalendar, FiCreditCard, FiGrid, FiPlay, FiUser } from "react-icons/fi";
import { Headphones } from "lucide-react";

const UserProfileSection = ({ profiles, isOtherUser = true }) => {
  const { profile: authProfile, loading: authLoading } = useProfile();
  const { message, followUser } = useFollowUser();
  const { getRoomId, loading: roomLoading, error: roomError } = useGetRoomId();
  const navigate = useNavigate();

  // Dark mode styles - consistent with other components
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151',
    '--color-success': '#10B981',
    '--color-success-light': '#064E3B',
    '--color-error': '#EF4444',
    '--color-error-light': '#7F1D1D'
  };

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
    <div 
      className="max-w-2xl mx-auto pb-16 font-sans"
      style={{ 
        backgroundColor: 'var(--color-bg-secondary)',
        ...darkModeStyles
      }}
    >
      {/* Header Section */}
      <div 
        className="p-5"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        {/* Profile Info Row */}
        <div className="flex items-center space-x-8 mb-6">
          <div className="relative">
            <div 
              className="w-28 h-28 rounded-full p-1"
              style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-light))' }}
            >
              <img
                src={mergedProfile.image || fallbackProfile.image}
                alt="Profile"
                className="w-full h-full rounded-full border-2 object-cover"
                style={{ borderColor: 'var(--color-bg-primary)' }}
              />
            </div>
            {mergedProfile.is_admin && (
              <span 
                className="absolute bottom-0 right-0 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-on-primary)'
                }}
              >
                Admin
              </span>
            )}
          </div>
          
          <div className="flex-1 mt-13">
            <div className="flex items-center mb-3">
              <h2 
                className="text-2xl font-light mr-3"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {mergedProfile.username}
              </h2>
              <span 
                className="text-xs px-3 py-1.5 rounded-full capitalize font-medium"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                {mergedProfile.identity}
              </span>
            </div>
            
            <div className="flex space-x-6 mb-4 text-center">
              <div>
                <span 
                  className="block font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {mergedProfile.posts || 0}
                </span>
                <span 
                  className="text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Posts
                </span>
              </div>
              <div>
                <span 
                  className="block font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {followersCount}
                </span>
                <span 
                  className="text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Followers
                </span>
              </div>
              <div>
                <span 
                  className="block font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {mergedProfile.following_list?.length || 0}
                </span>
                <span 
                  className="text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Following
                </span>
              </div>
            </div>
            
            {/* Follow / Message buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                  followLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ 
                  backgroundColor: followLoading 
                    ? 'var(--color-bg-secondary)' 
                    : isFollowing 
                      ? 'var(--color-bg-primary)' 
                      : 'var(--color-primary)',
                  border: isFollowing ? '1px solid var(--color-primary)' : 'none',
                  color: followLoading 
                    ? 'var(--color-text-secondary)' 
                    : isFollowing 
                      ? 'var(--color-primary)' 
                      : 'var(--color-text-on-primary)'
                }}
                onMouseEnter={(e) => {
                  if (!followLoading && isFollowing) {
                    e.target.style.backgroundColor = 'var(--color-error)';
                    e.target.style.color = 'var(--color-text-on-primary)';
                    e.target.style.borderColor = 'var(--color-error)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!followLoading && isFollowing) {
                    e.target.style.backgroundColor = 'var(--color-bg-primary)';
                    e.target.style.color = 'var(--color-primary)';
                    e.target.style.borderColor = 'var(--color-primary)';
                  }
                }}
              >
                {followLoading
                  ? (isFollowing ? "Unfollowing..." : "Following...")
                  : (isFollowing ? "Unfollow" : "Follow")
                }
              </button>

              {isFollowing && (
                <button
                  onClick={handleMessageClick}
                  disabled={roomLoading}
                  className={`p-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                    roomLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{ 
                    backgroundColor: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-primary)',
                    color: 'var(--color-primary)'
                  }}
                  onMouseEnter={(e) => {
                    if (!roomLoading) {
                      e.target.style.backgroundColor = 'var(--color-primary)';
                      e.target.style.color = 'var(--color-text-on-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!roomLoading) {
                      e.target.style.backgroundColor = 'var(--color-bg-primary)';
                      e.target.style.color = 'var(--color-primary)';
                    }
                  }}
                >
                  <FiMail className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-5">
          <p 
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {mergedProfile.firstname} {mergedProfile.middlename} {mergedProfile.lastname}
          </p>
          <p 
            className="text-sm mt-2 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {mergedProfile.bio}
          </p>
        </div>

        {/* Highlights (Contact info) - Uncomment if needed */}
        {/* <div className="flex space-x-5 mb-6 overflow-x-auto pb-2 hide-scrollbar">
          {[
            { title: 'Contact', icon: <FiPhone className="w-5 h-5" />, value: mergedProfile.phonenumber || "N/A" },
            { title: 'Email', icon: <FiMail className="w-5 h-5" />, value: mergedProfile.email || "N/A" },
            { title: 'Joined', icon: <FiCalendar className="w-5 h-5" />, value: new Date(mergedProfile.created_at).toLocaleDateString() || "N/A" },
            { title: 'Subscription', icon: <FiCreditCard className="w-5 h-5" />, value: mergedProfile.subscription_status || "None" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-2 flex-shrink-0">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center p-0.5"
                style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-light))' }}
              >
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-bg-primary)' }}
                >
                  <span style={{ color: 'var(--color-primary)' }}>{item.icon}</span>
                </div>
              </div>
              <span 
                className="text-xs font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {item.title}
              </span>
              <span 
                className="text-xs text-center max-w-16 truncate"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div> */}
      </div> 

      {/* Status Messages */}
      {message && (
        <div className="px-5 mb-4">
          <p 
            className="text-center text-sm p-2 rounded-lg"
            style={{ 
              backgroundColor: 'var(--color-success-light)',
              color: 'var(--color-success)' 
            }}
          >
            {message}
          </p>
        </div>
      )}
      
      {roomError && (
        <div className="px-5 mb-4">
          <p 
            className="text-center text-sm p-2 rounded-lg"
            style={{ 
              backgroundColor: 'var(--color-error-light)',
              color: 'var(--color-error)' 
            }}
          >
            {roomError}
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div 
        className="border-t"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={classNames(
                "flex items-center justify-center py-4 flex-1 font-medium text-sm relative group transition-colors",
                activeTab === tab
                  ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5"
                  : ""
              )}
              style={{
                color: activeTab === tab 
                  ? 'var(--color-primary)' 
                  : 'var(--color-text-secondary)',
                backgroundColor: activeTab === tab
                  ? 'var(--color-bg-primary)'
                  : 'var(--color-bg-secondary)'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.target.style.color = 'var(--color-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.target.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              {activeTab === tab && (
                <div 
                  className="after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                ></div>
              )}
              {tab === "audio" && <FiGrid className="mr-1.5" />}
              {tab === "video" && <FiPlay className="mr-1.5" />}
              {tab === "beats" && <FiUser className="mr-1.5" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div 
        className="p-5"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        {activeTab === "audio" && (
          <MusicSection userId={mergedProfile.id} />
        )}

        {activeTab === "video" && (
          <VideoSection userId={mergedProfile.id} />
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default UserProfileSection;