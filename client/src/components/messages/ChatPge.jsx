import React, { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import MessagesNavbar from './ChatHeader';

const ChatPage = ({ goBack }) => {
  const [messages, setMessages] = useState([]);

  const sendMessage = (messageText) => {
    if (messageText.trim() === '') return;
    const newMessage = {
      message: messageText,
      sent: true,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="chat-page flex flex-col h-screen bg-white">
      {/* Navbar at the top */}
      <MessagesNavbar goBack={goBack} />

      {/* Chat Messages - Takes up remaining space */}
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} />
      </div>

      {/* Chat Input at the bottom */}
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatPage;