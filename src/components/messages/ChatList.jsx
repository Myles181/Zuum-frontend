import { useEffect, useState } from "react";
import { useGetRooms } from "../../../Hooks/messages/useMessages";
import { useNavigate } from "react-router-dom";
import BottomNav from "../homepage/BottomNav";
import Overlay from "../homepage/Overlay";
import Navbar from "../profile/NavBar";
import Sidebar from "../homepage/Sidebar";
import Spinner from "../Spinner";
import useProfile from "../../../Hooks/useProfile";
import { FiMessageCircle, FiUsers } from "react-icons/fi";

const ChatListPage = () => {
  const { rooms, loading: roomsLoading, error, refreshRooms } = useGetRooms();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dark mode styles - consistent with other components
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151',
    '--color-error': '#EF4444',
    '--color-error-light': '#7F1D1D'
  };

  useEffect(() => {
    refreshRooms();
  }, []);

  // If profile is stuck in loading state for too long, force a rerender
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (profileLoading) {
        console.warn("Profile loading timeout - possible issue with useUserProfile");
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [profileLoading]);

  if (roomsLoading || profileLoading) {
    return (
      <div 
        className="fixed inset-0 z-50 flex justify-center items-center"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="max-w-2xl mx-auto rounded-lg shadow-lg p-6 mt-16"
        style={{ 
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div 
          className="text-center p-4 rounded-lg"
          style={{
            backgroundColor: 'var(--color-error-light)',
            color: 'var(--color-error)'
          }}
        >
          <p className="font-medium">Error loading conversations</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={refreshRooms}
            className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-on-primary)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-primary-light)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-primary)';
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const userId = profile?.id ?? "Unknown";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-[#1a1a1a]"
      style={darkModeStyles}
    >
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Navbar name="Messages" toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        className="max-w-2xl mx-auto h-full mt-13 shadow-lg overflow-hidden mb-20"
        style={{ 
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)'
        }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ 
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)'
          }}
        >
          <div className="flex items-center space-x-3">
            <FiMessageCircle 
              className="w-6 h-6" 
              style={{ color: 'var(--color-primary)' }} 
            />
            <h2 
              className="text-xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Messages
            </h2>
          </div>
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <FiUsers className="w-4 h-4" />
            <span className="text-sm font-medium">
              {rooms.length} {rooms.length === 1 ? 'chat' : 'chats'}
            </span>
          </div>
        </div>

        {/* Chat List */}
        <div 
          className="divide-y"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room.room_id}
                className="p-4 cursor-pointer transition-all duration-200 group"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onClick={() =>
                  navigate(`/chat/${room.room_id}`, {
                    state: { 
                      roomId: room.room_id, 
                      otherUserId: room.recipient_id, 
                      userId, 
                      otherUsername: room.recipient_profile_username,
                      otherProfilePicture: room.recipient_profile_image
                    },
                  })
                }
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={room.recipient_profile_image || "https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg"}
                      alt={room.recipient_profile_username}
                      className="w-12 h-12 rounded-full object-cover border-2 shadow-sm transition-transform group-hover:scale-105"
                      style={{ borderColor: 'var(--color-primary)' }}
                    />
                    {/* Online status indicator - you can add this if you have the data */}
                    {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 
                        className="font-semibold truncate text-base group-hover:text-[var(--color-primary)] transition-colors"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {room.recipient_profile_username || "Unknown User"}
                      </h3>
                      {room.last_message_timestamp && (
                        <span 
                          className="text-xs whitespace-nowrap ml-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {new Date(room.last_message_timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      )}
                    </div>
                    {room.last_message && (
                      <p 
                        className="text-sm truncate group-hover:text-[var(--color-text-primary)] transition-colors"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {room.last_message}
                      </p>
                    )}
                    {/* Unread message indicator - you can add this if you have the data */}
                    {/* {room.unread_count > 0 && (
                      <div 
                        className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium mt-1"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-text-on-primary)'
                        }}
                      >
                        {room.unread_count}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div 
              className="flex flex-col items-center justify-center py-16 px-4 text-center"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '2px solid var(--color-border)'
                }}
              >
                <FiMessageCircle className="w-8 h-8" />
              </div>
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                No conversations yet
              </h3>
              <p className="text-sm max-w-xs">
                Start a conversation by visiting someone's profile and sending them a message
              </p>
              <button
                onClick={() => navigate('/home')}
                className="mt-4 px-6 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-on-primary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-primary-light)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-primary)';
                }}
              >
                Discover Users
              </button>
            </div>
          )}
        </div>
      </div>
      <BottomNav activeTab="messages" />
    </div>
  );
};

export default ChatListPage;