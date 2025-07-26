import React, { useState } from 'react';
import Navbar from '../components/profile/NavBar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import BottomNav from '../components/homepage/BottomNav';
import backgroundImage from "../assets/public/Group 14.png";
import { Link, useNavigate } from 'react-router-dom';
import useNotifications from '../../Hooks/notification/useNotification';
import Spinner from '../components/Spinner';

// Black placeholder image using inline SVG
const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='black'/%3E%3C/svg%3E";

const ActivityPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications, loading, error, markNotificationAsRead } = useNotifications();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handlers for marking notifications as read and navigation
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err)
      }
    }
    if (notification.post_id) {
      navigate(`/music/${notification.post_id}`);
    }
  };

  const handleAudioReplyClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
    if (notification.post_id) {
      navigate(`/shared-audio/${notification.post_id}`);
    }
  };

  const handleVideoReplyClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
    if (notification.post_id) {
      navigate(`/videos/${notification.post_id}`);
    }
  };

  const handleFollowClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
    if (notification.action_user_id) {
      navigate(`/profile/${notification.action_user_id}`);
    }
  };

  // Render action button based on notification type
  const renderActionButton = (notification) => {
    switch (notification.type) {
      case 'POST_VIDEO':
        return (
          <button
            className="text-white text-sm px-4 py-1.5 rounded-full bg-[#2D8C72] hover:bg-[#256b58] transition-all shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleVideoReplyClick(notification);
            }}
          >
            View
          </button>
        );
      case 'FOLLOW':
        return (
          <button
            className="text-white text-sm px-4 py-1.5 rounded-full bg-[#2D8C72] hover:bg-[#256b58] transition-all shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleFollowClick(notification);
            }}
          >
            Follow
          </button>
        );
      case 'POST_AUDIO':
        return (
          <button
            className="text-white text-sm px-4 py-1.5 rounded-full bg-[#2D8C72] hover:bg-[#256b58] transition-all shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAudioReplyClick(notification);
            }}
          >
            View
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background with gradient overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10" 
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(18, 121, 155, 0.95), rgba(18, 101, 180, 0.95)), url(${backgroundImage})`
        }}
      />
      
      {/* Header */}
      <Navbar 
        toggleSidebar={toggleSidebar}
        name="Notifications"
      />
      
      {/* Sidebar and Overlay */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-2 py-4 mt-16 mb-20">
        <div 
          className="max-w-3xl mx-auto rounded-xl shadow-lg overflow-hidden"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
          {/* Header with Zuum News Link */}
          <div 
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ 
              backgroundColor: 'var(--color-bg-primary)',
              borderBottomColor: 'var(--color-border)'
            }}
          >
            <h2 
              className="text-xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Notifications
            </h2>
            <Link 
              to="/zuum-news"
              className="text-sm font-medium bg-[#2D8C72] text-white px-4 py-2 rounded-full hover:bg-[#256b58] transition duration-200"
            >
              Zuum News 
            </Link>
          </div>
          
          {/* Notification Content */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Spinner />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">
              Error: {error}
            </div>
          ) : notifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-gray-500">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm mt-1">We'll notify you when something happens</p>
            </div>
          ) : (
            <div 
              className="divide-y cursor-pointer transition-colors"
              style={{ borderTopColor: 'var(--color-border)' }}
            >
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-center justify-between p-4 ${
                    !notification.read ? "bg-green-50" : ""
                  }`}
                  style={{
                    borderBottomColor: 'var(--color-border)',
                    backgroundColor: notification.read ? 'var(--color-bg-primary)' : 'rgba(34, 197, 94, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = notification.read ? 'var(--color-bg-primary)' : 'rgba(34, 197, 94, 0.1)';
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={notification.action_user_image || placeholderImage}
                      alt={notification.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h4 
                        className="text-base font-semibold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {notification.name}
                      </h4>
                      <p 
                        className="text-sm mt-0.5"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {notification.message}
                      </p>
                      <p 
                        className="text-xs mt-1"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {notification.timestamp ? new Date(notification.timestamp).toLocaleString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <div>
                    {renderActionButton(notification)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ActivityPage;