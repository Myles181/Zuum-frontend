import React from 'react';

const ActivityCategory = ({ title, children }) => {
  return (
    <div className="activity-category mt-5">
      <h3 className="text-gray-500 font-bold mb-3">{title}</h3>
      {children}
    </div>
  );
};

export default ActivityCategory;