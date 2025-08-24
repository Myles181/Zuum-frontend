import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import c from "../../assets/icons/ORSJOS0 1.png";
import d from "../../assets/icons/Mask group1.svg";
import { FiBarChart, FiMail, FiPhone, FiCalendar, FiCreditCard, FiEdit, FiShare2 } from "react-icons/fi";
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
      created_at: null
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
      className="profile-container relative"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      {/* Background Image with Dashboard Icon */}
      <div className="profile-background h-64 overflow-hidden rounded-t-lg relative">
        <img
          src={mergedProfile.cover_image || c}
          alt="Profile Background"
          className="w-full h-full object-cover"
        />
        <Link
          to="/dashboard"
          className="absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          }}
          title="Go to Dashboard"
        >
          <FiBarChart className="w-5 h-5 text-[#008066]" />
        </Link>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Profile Image */}
      <div className="profile-header absolute top-20 ml-6 transform -translate-x-1">
        <div className="relative">
          <img
            src={mergedProfile.image || d}
            alt="Profile"
            className="w-25 h-25 rounded-full border-4 shadow-lg object-cover"
            style={{ borderColor: 'var(--color-bg-primary)' }}
          />
          {mergedProfile.is_admin && (
            <span className="absolute bottom-1 right-1 bg-[#008066] text-white text-xs px-3 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* User Info */}
      <div  className="flex flex-col justify-between my-5">

  
      <div className="stats-container flex flex-col items-center  w-full px-5 text-center">
        <h2 className="text-2xl font-bold text-[#008066]">{mergedProfile.username}</h2>
        <p className="text-gray-500 capitalize">{mergedProfile.identity}</p>
        <p 
          className="text-sm mt-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {mergedProfile.firstname} {mergedProfile.middlename} {mergedProfile.lastname}
        </p>
      </div>

      <div className="stats flex-1 p-4">
        <div className="flex justify-around gap-4">
          {["Followers", "Following"].map((item, index) => (
            <div key={index} className="text-center">
              <span className="text-lg font-bold text-[#008066]">
                {index === 0 ? mergedProfile.followers_list.length || 0 : mergedProfile.following_list.length || 0}
              </span>
              <p 
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

          </div>

      {/* Profile Action Buttons */}
      <div className="buttons flex justify-center mb-6 w-full gap-4 px-8">
        <Link to="/editprofile" className="flex-1">
          <button 
          className="w-full border border-[#008066] text-[#008066] px-6 py-2 rounded-lg transition shadow-sm font-medium flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--color-bg-secondary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--color-bg-primary)';
          }}
        >
            <FiEdit className="mr-2" /> Edit
          </button>
        </Link>
       
        <button className="flex-1 bg-[#008066] text-white px-6 py-2 rounded-lg hover:bg-[#006e58] transition shadow-sm font-medium flex items-center justify-center">
          <FiShare2 className="mr-2" /> Share
        </button>
        <Link to="/dashboard" className="flex-1">
          <button 
          className="w-full border border-[#008066] text-[#008066] px-3 py-3 rounded-lg transition shadow-sm font-medium flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--color-bg-secondary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--color-bg-primary)';
          }}
        >
            <FiBarChart className="mr-2" /> 
          </button>
        </Link>
      </div>
          <Link to="/purchasedbeats" className="flex-1">
      <div className="flex justify-center items-center mb-6 w-full px-5 text-[#008066] text-center gap-1">
        <Headphones />
      <h2 className="text-xl font-stretch-50% text-center ">My Beats</h2>

      </div>
      </Link>

      {/* Bio */}
      <div className="bio-container mt-4 px-8">
        <div 
          className="p-4 rounded-lg shadow-sm"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
          <h3 
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Bio
          </h3>
          <p style={{ color: 'var(--color-text-primary)' }}>
            {mergedProfile.bio || "No bio provided"}
          </p>
        </div>
      </div>

      {/* Stats and Contact in Flex Row */}
      <div className="flex flex-col md:flex-row justify-between px-8 mt-6 gap-4">
        {/* Contact Information */}
        <div 
          className="contact-info flex-1 p-4 rounded-lg shadow-sm"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
          <h3 
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Contact Info
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <FiMail className="mr-2 text-[#008066]" />
              <span style={{ color: 'var(--color-text-secondary)' }}>{mergedProfile.email || "N/A"}</span>
            </div>
            <div className="flex items-center text-sm">
              <FiPhone className="mr-2 text-[#008066]" />
              <span style={{ color: 'var(--color-text-secondary)' }}>{mergedProfile.phonenumber || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex flex-col md:flex-row justify-between px-8 mt-4 gap-4 mb-6">
        <div 
          className="flex-1 p-4 rounded-lg shadow-sm"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
          <div className="flex items-center text-sm">
            <FiCalendar className="mr-2 text-[#008066]" />
            <span style={{ color: 'var(--color-text-secondary)' }}>Joined: {formatDate(mergedProfile.created_at)}</span>
          </div>
        </div>
        <div 
          className="flex-1 p-4 rounded-lg shadow-sm"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
          <div className="flex items-center text-sm">
            <FiCreditCard className="mr-2 text-[#008066]" />
            <span style={{ color: 'var(--color-text-secondary)' }}>Subscription: {mergedProfile.subscription_status || "None"}</span>
          </div>
        </div>
      </div>

      {/* Tab Section */}
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

export default ProfileSection;
