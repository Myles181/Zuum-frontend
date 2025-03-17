import React, { useEffect, useRef } from 'react';

const ChatMessages = ({ messages }) => {
  const messagesContainerRef = useRef(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="chat-messages h-full flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
      ref={messagesContainerRef}
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message flex ${
            msg.sent ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-xl ${
              msg.sent
                ? 'bg-green-800 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-500 rounded-bl-none'
            } shadow-sm`}
          >
            <p className="text-sm">{msg.message}</p>
            <span className="text-xs text-gray-300 block mt-1">
              {msg.time || 'Just now'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;