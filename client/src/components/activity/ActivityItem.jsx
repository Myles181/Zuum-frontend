import React from 'react';

const ActivityItem = ({ avatar, name, description, thumbnail, action }) => {
  return (
    <div className="activity-item bg-white p-3 rounded-lg shadow-md flex justify-between items-center mb-3">
      <img src={avatar} alt={name} className="activity-avatar w-10 h-10 rounded-full object-cover" />
      <div className="activity-info flex-grow ml-3">
        <h4 className="text-sm font-bold">{name}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {thumbnail && <img src={thumbnail} alt="Thumbnail" className="activity-thumbnail w-9 h-9 rounded object-cover" />}
      {action}
    </div>
  );
};

export default ActivityItem;