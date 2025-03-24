import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useNotifications from '../../../Hooks/notification/useNotification'; // Import the hook
import Spinner from '../Spinner';

const NotificationSection = () => {
  const { notifications, loading, error, markNotificationAsRead } = useNotifications(); // Add markNotificationAsRead from the hook
  const navigate = useNavigate(); // Initialize useNavigate

  console.log(notifications);

  if (loading) {
    return <div className="w-full h-full"><Spinner /></div>;
  }

  if (error) {
    return <div className="text-center p-5 text-red-500">Error: {error}</div>;
  }

  if (notifications.length === 0) {
    return <div className="text-center p-5 h-full">No notifications found.</div>;
  }

  // Function to handle notification click
  const handleNotificationClick = async (notification) => {
    if (notification.type === 'POST_AUDIO' && !notification.read) {
      try {
        // Mark the notification as read
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }

    // Navigate to the post
    if (notification.post_id) {
      navigate(`/music/${notification.post_id}`);
    }
  };

  // Function to handle reply button click
  const handleAudioReplyClick = async (notification) => {
    if (!notification.read) {
      try {
        // Mark the notification as read
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }

    // Navigate to the post
    if (notification.post_id) {
      navigate(`/music/${notification.post_id}`);
    }
  };

  const handleVideoReplyClick = async (notification) => {
    if (!notification.read) {
      try {
        // Mark the notification as read
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }

    // Navigate to the post
    if (notification.post_id) {
      navigate(`/video/${notification.post_id}`);
    }
  };


  const handleFollowClick = async (notification) => {
    if (!notification.read) {
      try {
        // Mark the notification as read
        await markNotificationAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }

    // Navigate to the post
    if (notification.
      action_user_id) {
      
          navigate(`/profile/${notification.
            action_user_id}`); // Redirect to the user's profile
       
      
    }
  };

  // Function to render the appropriate button based on notification type
  const renderActionButton = (notification) => {
    switch (notification.type) {
      case 'POST_VIDEO':
        return (
          <button
            className="comment-btn bg-[#1f8c5a] text-white px-3 py-1 rounded"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the parent onClick from firing
              handleVideoReplyClick(notification);
            }}
          >
            View
          </button>
        );
      case 'FOLLOW':
        return (
          <button
            className="comment-btn bg-[#1f8c5a] text-white px-3 py-1 rounded"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the parent onClick from firing
              handleFollowClick(notification);
            }}
          >
            Follow
          </button>
        )
      case 'POST_AUDIO':
        return (
          <button
            className="comment-btn bg-[#1f8c5a] text-white px-3 py-1 rounded"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the parent onClick from firing
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
    <div className="notification-section p-3 bg-gray-100 h-full">
      <div className="notifications-container bg-white p-4 rounded-lg shadow-md h-full">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item bg-white p-3 rounded-lg shadow-md flex justify-between items-center mb-3 cursor-pointer ${
              !notification.read ? "bg-gray-50" : ""
            }`}
            onClick={() => handleNotificationClick(notification)} // Handle click
          >
            <div className="notification-content flex items-center">
              <img
                src={notification.action_user_image || "default-avatar.png"} // Use a fallback avatar if none is provided
                alt={notification.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h4 className="text-sm font-bold">{notification.name}</h4>
                <p className="text-xs text-gray-500">{notification.message}</p>
              </div>
            </div>
            {renderActionButton(notification)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSection;