import React from 'react';
import ActivityTabs from './ActivityTab';
import ActivityCategory from './ActivityCategory';
import ActivityItem from './ActivityItem';
import c from "../../assets/image/11429433 1.svg";


const ActivitySection = () => {
  return (
    <div className="activity-section p-3 bg-gray-100">
      <div className="activities-container bg-white p-4 rounded-lg shadow-md">
        <ActivityTabs />
        <ActivityCategory title="Today">
          <ActivityItem
            avatar={c}
            name="Music World Record Label"
            description="Wants to add you to a record label"
            action={<button className="view-btn bg-[#1f8c5a] text-white px-3 py-1 rounded">View</button>}
          />
          <ActivityItem
            avatar={c}
            name="Sayo"
            description="Promoted your music"
            thumbnail={c}
          />
          <ActivityItem
            avatar={c}
            name="Electron"
            description="Liked your post"
            thumbnail={c}
          />
          <ActivityItem
            avatar={c}
            name="Maaq"
            description="Followed you"
            action={<button className="follow-btn bg-[#1f8c5a] text-white px-3 py-1 rounded">Follow Back</button>}
          />
        </ActivityCategory>
        <ActivityCategory title="Yesterday">
          <ActivityItem
            avatar={c}
            name="JayD"
            description="Liked your post"
            thumbnail={c}
          />
          <ActivityItem
            avatar={c}
            name="Sayo"
            description="Promoted your music"
            thumbnail={c}
          />
          <ActivityItem
            avatar={c}
            name="Sayo"
            description="Liked your music"
            thumbnail={c}
          />
          <ActivityItem
            avatar={c}
            name="Maaq"
            description="Followed you"
            action={<button className="follow-btn bg-[#1f8c5a] text-white px-3 py-1 rounded">Follow Back</button>}
          />
          <ActivityItem
            avatar={c}
            name="Sayo"
            description="Promoted your music"
            thumbnail={c}
          />
          <ActivityItem
            avatar={c}
            name="Music World Record Label"
            description="Removed you from the Record Label"
            action={<button className="view-btn bg-[#1f8c5a] text-white px-3 py-1 rounded">View</button>}
          />
        </ActivityCategory>
      </div>
    </div>
  );
};

export default ActivitySection;