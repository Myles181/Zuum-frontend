import React, { useState } from 'react';
import MessagesList from '../components/messages/MessageList';
import ChatPage from '../components/messages/ChatPge';
import BottomNav from '../components/homepage/BottomNav';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import a from "../assets/public/Group 14.png";
import Navbar from '../components/profile/NavBar';

const Chat = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [showChatPage, setShowChatPage] = useState(false);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openChat = (name, image) => {
    setUserName(name);
    setUserImage(image);
    setShowChatPage(true);
  };

  const goBack = () => {
    setShowChatPage(false);
  };

  const messages = [
    { profileimage: a, name: "Stephen", message: "My blood this app madd ❤️‍🔥", time: "1:25" },
    { profileimage: a, name: "Raymond", message: "I love your Music", time: "9:15" },
    { profileimage: a, name: "FAV", message: "Can we do a remix", time: "9:15" },
    { profileimage: a, name: "FAV", message: "I don stream ur song", time: "9:15" },
    { profileimage: a, name: "Destiny", message: "the music is a banger", time: "9:15" },
    { profileimage: a, name: "Destiny", message: "The verse madddd ❤️‍🔥", time: "9:15" },
    { profileimage: a, name: "Destiny", message: "Trust u're doin good", time: "9:15" },
    { profileimage: a, name: "Stephen", message: "My blood Olamide just posted u", time: "7:25" },
    { profileimage: a, name: "Stephen", message: "Doctor booking scheme", time: "3:75" },
    { profileimage: a, name: "Jane", message: "Hey there!", time: "14:05" }
  ];

  return (
    <div className="bg-gray-200 h-screen mb-30"  >
      {/* Overlay for sidebar */}
      <div className="absolute inset-0 bg-black opacity-50" style={{ display: sidebarOpen ? 'block' : 'none' }} onClick={toggleSidebar}></div>
      <div className="relative z-10">
        {/* Conditionally render Navbar */}
        {!showChatPage && <Navbar name={"Messages"} toggleSidebar={toggleSidebar} />}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="container flex flex-col flex-1 max-w-90% mx-auto bg-gray-200 rounded-lg border border-gray-300 h-full">
          {!showChatPage && (
            <>
              <MessagesList messages={messages} openChat={openChat} />
              <BottomNav activeTab={activeTab} />
            </>
          )}
          {showChatPage && (
            <ChatPage goBack={goBack} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;