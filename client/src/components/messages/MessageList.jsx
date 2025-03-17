import React from 'react';
import ChatItem from './ChatItem';



const MessagesList = ({ messages, openChat }) => {
  return (
    <div className="messages-list flex-1 bg-gray-500 overflow-y-auto p-4 rounded-2xl">
      
      {messages.map((msg, index) => (
        <ChatItem
          key={index}
          profileImage={msg.profileimage}
          name={msg.name}
          message={msg.message}
          time={msg.time}
          openChat={openChat}
        />
      ))}
    </div>
  );
};

export default MessagesList;