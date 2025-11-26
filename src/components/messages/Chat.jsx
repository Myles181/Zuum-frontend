import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../profile/NavBar';
import useJoinChat, { useFetchMessages, useReceiveMessages, useSendMessage } from '../../../Hooks/messages/useMessages';
import Spinner from '../Spinner';
import { FaPaperPlane } from 'react-icons/fa';

const MessagePage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const hasScrolledInitially = useRef(false);
  const { roomId } = useParams();
  const location = useLocation();
  const { userId, otherUserId, otherProfilePicture, otherUsername } = location.state || {};

  console.log("Profile Picture URL:", otherProfilePicture);

  
  const joinChat = useJoinChat();
  useEffect(() => {
    if (userId) {
      joinChat(userId);
    }
  }, [userId, joinChat]);

  const { sendMessage, error, isConnected } = useSendMessage();
  const receivedMessages = useReceiveMessages(roomId);
  const { fetchedMessages, loading } = useFetchMessages(roomId);

  const [messageText, setMessageText] = useState('');
  const [optimisticMessages, setOptimisticMessages] = useState([]);

  const messages = [...fetchedMessages, ...optimisticMessages, ...receivedMessages];

  useEffect(() => {
    if (!hasScrolledInitially.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      hasScrolledInitially.current = true;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    const newMessage = {
      sender_id: userId,
      content: messageText,
      created_at: new Date().toISOString()
    };
    
    setOptimisticMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageText("");

    sendMessage({
      content: messageText,
      roomId,
      receiverId: otherUserId
    }).catch(() => {
      setOptimisticMessages((prevMessages) => prevMessages.filter(msg => msg !== newMessage));
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <Spinner />
      </div>
    );
  }
  
  return (
    <div 
      className="flex flex-col h-screen w-full max-w-md mx-auto shadow-sm"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <Navbar  name={otherUsername}
  profilePicture={otherProfilePicture || "https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg"} // Use a placeholder if undefined
  goBack={() => navigate(-1)}
  isMessagePage />

      <div 
        className="flex-1 p-4 overflow-y-auto flex flex-col items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="space-y-4 w-full mt-30">
          {messages.length === 0 ? (
            <div 
              className="flex flex-col items-center justify-center h-full text-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <svg
                className="w-16 h-16 mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12c0 4.418-4.03 8-9 8-1.993 0-3.837-.58-5.335-1.566A8.963 8.963 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="font-medium">No messages yet</p>
              <p className="text-sm">Start a conversation now!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-[80%] p-3 rounded-2xl shadow-md ${
                    message.sender_id === userId
                      ? 'bg-[#2D8C72] text-white rounded-br-none'
                      : 'rounded-bl-none'
                  }`}
                  style={{
                    backgroundColor: message.sender_id === userId 
                      ? '#2D8C72' 
                      : 'var(--color-bg-primary)',
                    color: message.sender_id === userId 
                      ? 'white' 
                      : 'var(--color-text-primary)'
                  }}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs mt-1 text-right opacity-80">
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-2">
  <form onSubmit={handleSendMessage} className="relative">
    <div 
      className="flex items-center border rounded-full px-4 py-2 shadow-md focus-within:ring-2 focus-within:ring-[#2D8C72] transition-all"
      style={{ 
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Input Field */}
      <input
        type="text"
        name="message"
        placeholder="Type a message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm px-2"
        style={{ 
          color: 'var(--color-text-primary)',
          backgroundColor: 'transparent'
        }}
      />

      {/* Send Button */}
      <button
        type="submit"
        disabled={!messageText.trim()}
        className={`p-3 rounded-full shadow-md transition-all duration-300 ease-in-out ${
          !messageText.trim()
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-[#2D8C72] hover:bg-green-600 active:scale-90 text-white"
        }`}
      >
        <FaPaperPlane className="text-lg" />
      </button>
    </div>

        </form>
      </div>
    </div>
  );
};

export default MessagePage;
