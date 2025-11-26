import React from 'react';
import ActivityTabs from './ActivityTab';
import ActivityCategory from './ActivityCategory';
import ActivityItem from './ActivityItem';
import c from "../../assets/image/11429433 1.svg";
import useNotifications from '../../../Hooks/notification/useNotification';
import useUserProfile from "../../../Hooks/useProfile";

const ActivitySection = () => {
  const { profile } = useUserProfile();

  // Handle case where profile is null or undefined
  if (!profile) {
    return <div className="text-center p-5">Loading profile...</div>;
  }

  const userId = profile.id; // Safely access profile.id
  const { notifications, loading, error } = useNotifications(userId); // Fetch notifications

  if (loading) {
    return <div className="text-center p-5">Loading notifications...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-red-500">Error: {error}</div>;
  }

  // Group notifications by date (today, yesterday, etc.)
  const groupNotificationsByDate = (notifications) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]; // Get yesterday's date

    const grouped = {
      today: [],
      yesterday: [],
    };

    notifications.forEach((notification) => {
      const notificationDate = notification.created_at.split('T')[0]; // Extract date from timestamp

      if (notificationDate === today) {
        grouped.today.push(notification);
      } else if (notificationDate === yesterday) {
        grouped.yesterday.push(notification);
      }
    });

    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <div className="activity-section p-3 bg-gray-100">
      <div className="activities-container bg-white p-4 rounded-lg shadow-md">
        <ActivityTabs />
        <ActivityCategory title="Today">
          {groupedNotifications.today.map((notification) => (
            <ActivityItem
              key={notification.id}
              avatar={c} // Replace with actual avatar URL if available in the API response
              name={notification.message}
              description={notification.type}
              action={
                notification.type === 'like' ? (
                  <button className="view-btn bg-[#1f8c5a] text-white px-3 py-1 rounded">View</button>
                ) : notification.type === 'follow' ? (
                  <button className="follow-btn bg-[#1f8c5a] text-white px-3 py-1 rounded">Follow Back</button>
                ) : null
              }
            />
          ))}
        </ActivityCategory>
        <ActivityCategory title="Yesterday">
          {groupedNotifications.yesterday.map((notification) => (
            <ActivityItem
              key={notification.id}
              avatar={c} // Replace with actual avatar URL if available in the API response
              name={notification.message}
              description={notification.type}
              action={
                notification.type === 'like' ? (
                  <button className="view-btn bg-[#1f8c5a] text-white px-3 py-1 rounded">View</button>
                ) : notification.type === 'follow' ? (
                  <button className="follow-btn bg-[#1f8c5a] text-white px-3 py-1 rounded">Follow Back</button>
                ) : null
              }
            />
          ))}
        </ActivityCategory>
      </div>
    </div>
  );
};

export default ActivitySection;