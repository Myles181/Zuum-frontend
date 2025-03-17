import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';

const ChatInput = ({ sendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="w-full flex items-center p-4 border-t border-gray-200 bg-white">
      <input
        type="text"
        id="messageInput"
        placeholder="Type a message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:border-green-800"
      />
      <button
        onClick={() => {
          sendMessage(inputValue);
          setInputValue('');
        }}
        className="bg-green-800 text-white px-4 py-2 rounded-lg"
      >
      <IoSend />
      </button>
    </div>
  );
};

export default ChatInput;