import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useNotifications from '../../../Hooks/notification/useNotification';
import Spinner from '../Spinner';

// Black placeholder image using inline SVG
const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='black'/%3E%3C/svg%3E";

const NotificationSection = () => {
  const { notifications, loading, error, markNotificationAsRead } = useNotifications();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-3 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center p-3 h-full">
        No notifications found.
      </div>
    );
  }

  // Handlers for marking notifications as read and navigation
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
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
      navigate(`/music/${notification.post_id}`);
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
      navigate(`/video/${notification.post_id}`);
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

  // Render action button based solely on green styling.
  const renderActionButton = (notification) => {
    switch (notification.type) {
      case 'POST_VIDEO':
        return (
          <button
            className="bg-[#2D8C72] text-white px-3 py-1 rounded shadow hover:bg-green-700 transition-all text-sm"
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
            className="bg-[#2D8C72] text-white px-3 py-1 rounded shadow hover:bg-green-700 transition-all text-sm"
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
            className="bg-[#2D8C72] text-white px-3 py-1 rounded shadow hover:bg-green-700 transition-all text-sm"
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
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
  <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
  <Link 
    to="/zuum-news"
    className="text-sm font-medium bg-[#2D8C72] text-white px-3 py-1.5 rounded-md hover:bg-[#256b58] transition duration-200 cursor-pointer"
  >
    Zuum News 
  </Link>
</div>

        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? "bg-green-50" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={notification.action_user_image || placeholderImage}
                  alt={notification.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-base font-semibold text-gray-800">
                    {notification.name}
                  </h4>
                  <p className="text-xs text-gray-600">{notification.message}</p>
                </div>
              </div>
              <div>
                {renderActionButton(notification)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;
