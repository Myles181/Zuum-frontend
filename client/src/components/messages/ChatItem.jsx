import React from 'react';

const ChatItem = ({ profileImage, name, message, time, openChat }) => {
  return (
    <div className="chat-item flex items-center px-4 py-3 border-b border-gray-200 cursor-pointer" onClick={() => openChat(name, profileImage)}>
      <img src={profileImage} alt="User" className="w-12 h-12 rounded-full mr-2" />
      <div className="chat-details flex-grow">
        <div className="chat-name font-bold">{name}</div>
        <div className="chat-message text-gray-500">{message}</div>
      </div>
      <div className="chat-time text-gray-500">{time}</div>
    </div>
  );
};

export default ChatItem;