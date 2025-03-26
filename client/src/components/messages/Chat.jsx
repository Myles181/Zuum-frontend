import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../profile/NavBar';
import useJoinChat, { useFetchMessages, useReceiveMessages, useSendMessage } from '../../../Hooks/messages/useMessages';

const MessagePage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const { roomId } = useParams();
  const location = useLocation();
  const { userId, otherUserId, otherProfilePicture, otherUsername } = location.state || {};

  // Join the chat when the component mounts (if userId exists)
  const joinChat = useJoinChat();
  useEffect(() => {
    if (userId) {
      joinChat(userId);
    }
  }, [userId, joinChat]);

  // Use hooks for sending, receiving, and fetching messages
  const { sendMessage, error, isConnected } = useSendMessage();
  const receivedMessages = useReceiveMessages(roomId);
  const fetchedMessages = useFetchMessages(roomId);

  // Local state for message input and optimistic UI updates
  const [messageText, setMessageText] = useState('');
  const [optimisticMessages, setOptimisticMessages] = useState([]);

  // Combine all messages: fetched history, optimistic (just sent), and real-time received
  const messages = [...fetchedMessages, ...optimisticMessages, ...receivedMessages];

  // Auto-scroll to the bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
  
    try {
      const result = await sendMessage({
        content: messageText,
        roomId,
        receiverId: otherUserId
      });
      console.log('Message sent successfully:', result);
      setMessageText("")
    } catch (err) {
      console.error('Error sending message:', err);
      // Optionally clear input on error if desired:
      // setMessageText('');
    }
  };
  
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-white shadow-sm">
      <Navbar name={otherUsername} />

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[80%] p-3 rounded-2xl shadow-md ${
                  message.sender_id === userId
                    ? 'bg-[#2D8C72] text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs mt-1 text-right opacity-80">
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <input
              type="text"
              name="message"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm py-1 px-2"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className={`ml-2 p-1.5 rounded-full shadow-md ${
                !messageText.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#2D8C72] hover:bg-green-600'
              }`}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessagePage;
