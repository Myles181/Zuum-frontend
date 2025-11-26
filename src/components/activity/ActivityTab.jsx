import React from 'react';

const ActivityTabs = () => {
  return (
    <div className="activity-tabs text-xs flex gap-5 pb-5 border-b border-gray-300 text-gray-700 font-bold">
      <span className="active cursor-pointer">All</span>
      <span className="cursor-pointer">Promotion</span>
      <span className="cursor-pointer">Like</span>
      <span className="cursor-pointer">Comment</span>
      <span className="cursor-pointer">Follower</span>
    </div>
  );
};

export default ActivityTabs;