// Chat.jsx
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-white min-h-screen">
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="relative z-10">
        <Navbar name="Messages" toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main className="max-w-2xl mx-auto pt-16">
          <ChatListPage style={{ paddingTop: '4rem' }} />
          <BottomNav activeTab="messages" />
        </main>
      </div>
    </div>
  );
};

export default Chat;
