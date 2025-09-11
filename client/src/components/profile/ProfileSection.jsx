import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import c from "../../assets/icons/ORSJOS0 1.png";
import d from "../../assets/icons/Mask group1.svg";
import { FiBarChart, FiMail, FiPhone, FiCalendar, FiCreditCard, FiEdit, FiShare2, FiGrid, FiPlay, FiUser } from "react-icons/fi";
import MusicSection from "./MusicSection";
import VideoSection from "./VideoSection";
import { Headphones } from "lucide-react";

const ProfileSection = ({ profile }) => {
  const navigate = useNavigate();

  // Fallback data in case profile is null or undefined
  const fallbackProfile = useMemo(
    () => ({
      cover_image: c,
      image: d,
      username: "Dave_sings",
      identity: "Artist",
      bio: "I'm a singer-songwriter, weaving emotions into melodies that touch hearts and inspire minds.",
      followers_list: [],
      following_list: [],
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      subscription_status: null,
      created_at: null,
      posts: 42,
      beats: 15
    }),
    []
  );

  // Merge profile data with fallback data
  const mergedProfile = useMemo(
    () => ({ ...fallbackProfile, ...profile }),
    [profile, fallbackProfile]
  );

  // Tab state
  const [activeTab, setActiveTab] = useState("audio");
 const tabs = ["producer", "dev"].includes(mergedProfile.identity.toLowerCase())
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

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div 
      className="max-w-2xl mx-auto pb-16 font-sans"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      {/* Header Section */}
      <div 
        className="p-5 mt-13"
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
                src={mergedProfile.image || d}
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
          
          <div className="flex-1 ">
            <div className="flex items-center mb-3">
              <h2 
                className="text-2xl font-light mr-3"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {mergedProfile.username}
              </h2>
              <span 
                className="bg-gray-700 text-xs px-3 py-1.5 rounded-full capitalize font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
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
                  {mergedProfile.posts}
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
                  {mergedProfile.followers_list.length || 0}
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
                  {mergedProfile.following_list.length || 0}
                </span>
                <span 
                  className="text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Following
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link to="/editprofile" className="flex-1">
                <button 
                  className="border px-4 py-2 rounded-lg text-sm font-medium w-full transition-colors shadow-sm"
                  style={{ 
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--color-bg-primary)';
                  }}
                >
                  Edit Profile
                </button>
              </Link>
              <button 
                className="border p-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-primary)';
                }}
              >
                <FiShare2 className="w-4 h-4" />
              </button>
            
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
            {mergedProfile.bio || "No bio provided"}
          </p>
       
        </div>

        {/* Highlights (Instagram-style stories) */}
    <div className="flex space-x-5 mb-6 overflow-x-auto pb-2 hide-scrollbar">
  {[
    { title: 'Contact', icon: <FiPhone className="w-5 h-5" />, value: mergedProfile.phonenumber || "N/A" },
    { title: 'Email', icon: <FiMail className="w-5 h-5" />, value: mergedProfile.email || "N/A" },
    {
      title: `My Beats (${mergedProfile.beats})`,
      icon: <Headphones className="w-5 h-5" />,
      value: "View purchased beats",
      link: "/purchasedbeats"
    },
    { title: 'Subscription', icon: <FiCreditCard className="w-5 h-5" />, value: mergedProfile.subscription_status || "None" }
  ].map((item, idx) => {
    const CardContent = (
      <div className="flex flex-col items-center space-y-2 flex-shrink-0">
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
        {item.value && (
          <span 
            className="text-xs text-center max-w-16 truncate"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {item.value}
          </span>
        )}
      </div>
    );

    return item.link ? (
      <a key={idx} href={item.link} className="flex-shrink-0">
        {CardContent}
      </a>
    ) : (
      <div key={idx} className="flex-shrink-0">
        {CardContent}
      </div>
    );
  })}
</div>

</div>

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

export default ProfileSection;