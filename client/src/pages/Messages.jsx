import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatListPage from '../components/messages/ChatList';
import BottomNav from '../components/homepage/BottomNav';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import Navbar from '../components/profile/NavBar';

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Dark mode styles - consistent with other components
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151'
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div 
      className="min-h-screen bg-[#1a1a1a]"
      style={{ 
        ...darkModeStyles
      }}
    >
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="relative z-10">
        <Navbar name="Messages" toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main 
          className="max-w-2xl mx-auto pt-16"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
          <ChatListPage style={{ paddingTop: '4rem' }} />
          <BottomNav activeTab="messages" />
        </main>
      </div>
    </div>
  );
};

export default Chat;