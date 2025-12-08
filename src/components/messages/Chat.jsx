import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../profile/NavBar';
import useJoinChat, { useFetchMessages, useReceiveMessages, useSendMessage } from '../../../Hooks/messages/useMessages';
import Spinner from '../Spinner';
import { FaPaperPlane, FaSmile } from 'react-icons/fa';

const MessagePage = ({ profile }) => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const hasScrolledInitially = useRef(false);
  const { roomId } = useParams();
  const location = useLocation();
  const { userId: stateUserId, otherUserId, otherProfilePicture, otherUsername } = location.state || {};
  
  // Use profile.id as the primary userId, fallback to state if needed
  const userId = profile?.id || stateUserId;

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

  // Combine messages and remove duplicates based on content and timestamp
  const messages = React.useMemo(() => {
    const allMessages = [...fetchedMessages, ...optimisticMessages, ...receivedMessages];
    
    // Remove duplicates more aggressively
    const uniqueMessages = allMessages.reduce((acc, message) => {
      // Ensure sender_id exists
      const normalizedMessage = {
        ...message,
        sender_id: message.sender_id || message.senderId || message.user_id
      };
      
      // Check if this message already exists (duplicate check)
      // Consider messages duplicate if they have same content and are within 5 seconds
      const isDuplicate = acc.some(m => 
        m.content === normalizedMessage.content && 
        m.sender_id === normalizedMessage.sender_id &&
        Math.abs(new Date(m.created_at) - new Date(normalizedMessage.created_at)) < 5000
      );
      
      if (!isDuplicate) {
        acc.push(normalizedMessage);
      }
      
      return acc;
    }, []);
    
    // Sort by timestamp
    return uniqueMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [fetchedMessages, optimisticMessages, receivedMessages]);

  // Auto-scroll for new messages
  useEffect(() => {
    if (messages.length > 0) {
      const container = messagesContainerRef.current;
      if (!container) return;

      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      
      if (!hasScrolledInitially.current || isNearBottom) {
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'end'
          });
        });
        hasScrolledInitially.current = true;
      }
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    const tempId = `temp-${Date.now()}`; // Unique temporary ID
    const messageContent = messageText.trim(); // Store content before clearing
    
    const newMessage = {
      id: tempId,
      sender_id: userId,
      content: messageContent,
      created_at: new Date().toISOString(),
      status: 'sending'
    };
    
    setOptimisticMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageText("");

    // Send the message
    sendMessage({
      content: messageContent,
      roomId,
      receiverId: otherUserId
    }).then(() => {
      // Success - remove optimistic message
      setTimeout(() => {
        setOptimisticMessages((prevMessages) => 
          prevMessages.filter(msg => msg.id !== tempId)
        );
      }, 1000);
    }).catch((error) => {
      console.error('Send failed with error:', error);
      
      // Check if message appears in received messages despite the error
      // This handles the case where server doesn't send ACK but message was delivered
      setTimeout(() => {
        const messageWasReceived = receivedMessages.some(m => 
          m.content === messageContent && 
          Math.abs(new Date(m.created_at) - new Date(newMessage.created_at)) < 3000
        ) || fetchedMessages.some(m => 
          m.content === messageContent && 
          Math.abs(new Date(m.created_at) - new Date(newMessage.created_at)) < 3000
        );
        
        if (messageWasReceived) {
          // Message was actually delivered, just remove optimistic version
          console.log('Message delivered despite timeout, removing optimistic version');
          setOptimisticMessages((prevMessages) => 
            prevMessages.filter(msg => msg.id !== tempId)
          );
        } else {
          // Actually failed, mark as failed
          setOptimisticMessages((prevMessages) => 
            prevMessages.map(msg => msg.id === tempId ? { ...msg, status: 'failed' } : msg)
          );
        }
      }, 2000);
    });
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const shouldShowDateDivider = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.created_at).toDateString();
    const prevDate = new Date(prevMsg.created_at).toDateString();
    return currentDate !== prevDate;
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
      className="flex flex-col h-screen w-full max-w-md mx-auto"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      {/* Header */}
      <Navbar  
        name={otherUsername}
        profilePicture={otherProfilePicture || "https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg"}
        goBack={() => navigate(-1)}
        isMessagePage 
      />

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
        style={{ 
          backgroundColor: 'var(--color-bg-secondary)',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(45, 140, 114, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(45, 140, 114, 0.03) 0%, transparent 50%)',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {messages.length === 0 ? (
          <div 
            className="flex flex-col items-center justify-center h-full"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <div className="bg-gradient-to-br from-[#2D8C72]/10 to-[#2D8C72]/5 rounded-full p-8 mb-4">
              <svg
                className="w-16 h-16"
                style={{ color: '#2D8C72' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
              No messages yet
            </p>
            <p className="text-sm text-center px-8" style={{ color: 'var(--color-text-secondary)' }}>
              Send a message to start the conversation with {otherUsername}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => {
              const showDate = shouldShowDateDivider(message, messages[index - 1]);
              const isOwnMessage = Number(message.sender_id) === Number(userId);
              
              return (
                <React.Fragment key={message.id || index}>
                  {showDate && (
                    <div className="flex justify-center my-6">
                      <div 
                        className="px-4 py-1.5 rounded-full text-xs font-medium shadow-sm"
                        style={{ 
                          backgroundColor: 'var(--color-bg-primary)',
                          color: 'var(--color-text-secondary)'
                        }}
                      >
                        {new Date(message.created_at).toLocaleDateString([], { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`flex items-end gap-2 mb-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isOwnMessage && (
                      <img 
                        src={otherProfilePicture || "https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg"}
                        alt={otherUsername}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mb-1"
                      />
                    )}
                    
                    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`group relative max-w-[85%] px-4 py-2.5 shadow-sm transition-all duration-200 ${
                          isOwnMessage
                            ? 'bg-[#2D8C72] text-white rounded-[20px] rounded-br-md'
                            : 'rounded-[20px] rounded-bl-md'
                        }`}
                        style={{
                          backgroundColor: isOwnMessage ? '#2D8C72' : 'var(--color-bg-primary)',
                          color: isOwnMessage ? 'white' : 'var(--color-text-primary)'
                        }}
                      >
                        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                          {message.content}
                        </p>
                        
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className={`text-[11px] ${isOwnMessage ? 'text-white/70' : 'opacity-60'}`}>
                            {formatMessageTime(message.created_at)}
                          </span>
                          {isOwnMessage && (
                            <span className="text-white/70 text-xs">
                              {message.status === 'sending' ? '○' : message.status === 'failed' ? '✕' : '✓✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Container */}
      <div 
        className="p-3 border-t"
        style={{ 
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border)'
        }}
      >
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          {/* Message Input */}
          <div 
            className="flex-1 flex items-center gap-2 rounded-[24px] px-4 py-2 transition-all duration-200"
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)'
            }}
          >
            <input
              type="text"
              placeholder="Message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-[15px]"
              style={{ color: 'var(--color-text-primary)' }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!messageText.trim() || !isConnected}
            className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
              !messageText.trim() || !isConnected
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#2D8C72] hover:bg-[#256b5a] active:scale-95 shadow-md"
            }`}
          >
            <FaPaperPlane 
              className={`text-base ${messageText.trim() && isConnected ? 'text-white' : 'text-gray-500'}`}
            />
          </button>
        </form>

        {!isConnected && (
          <p className="text-xs text-center mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            Reconnecting...
          </p>
        )}
      </div>
    </div>
  );
};

export default MessagePage;