import React, { useState } from 'react';
import Navbar from '../components/profile/NavBar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import ActivitySection from '../components/activity/ActivitySection';
import BottomNav from '../components/homepage/BottomNav';
import a from "../assets/public/Group 14.png"
import NotificationSection from '../components/activity/NotificationSection';


const ActivityPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-cover bg-center bg-no-repeat mt-15 bg-fixed mb-10" style={{ backgroundImage: `linear-gradient(rgba(18, 121, 155, 0.89), rgba(18, 101, 180, 0.89)), url(${a})`}}>

   
        <Navbar toggleSidebar={toggleSidebar}
                name={"Activities"}
                />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        {/* <ActivitySection /> */}
        <NotificationSection />
        <BottomNav />
      
    </div>
  );
};

export default ActivityPage;