import { useEffect, useState } from "react";
import { useGetRooms } from "../../../Hooks/messages/useMessages";
import { useNavigate } from "react-router-dom";
import BottomNav from "../homepage/BottomNav";
import Overlay from "../homepage/Overlay";
import Navbar from "../profile/NavBar";
import Sidebar from "../homepage/Sidebar";
import Spinner from "../Spinner";
import useProfile from "../../../Hooks/useProfile";


const ChatListPage = () => {
  const { rooms, loading: roomsLoading, error, refreshRooms } = useGetRooms();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Debugging logs
  console.log("Rooms Loading:", roomsLoading, "Rooms Data:", rooms);

  useEffect(() => {
    refreshRooms();
  }, []);

  // If profile is stuck in loading state for too long, force a rerender
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (profileLoading) {
        console.warn("Profile loading timeout - possible issue with useUserProfile");
      }
    }, 5000); // Warn if loading takes longer than 5 seconds

    return () => clearTimeout(timeout);
  }, [profileLoading]);

  if (roomsLoading || profileLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="max-w-2xl mx-auto rounded-lg shadow p-4"
        style={{ 
          backgroundColor: 'var(--color-bg-primary)',
          color: '#ef4444'
        }}
      >
        Error: {error}
      </div>
    );
  }

  

  const userId = profile?.id ?? "Unknown"; // Fallback to avoid null

  return (
    <div 
      className="max-w-2xl mx-auto mt-15 rounded-lg shadow"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <Overlay isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Navbar name="Messages" toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div 
        className="divide-y"
        style={{ borderTopColor: 'var(--color-border)' }}
      >
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room.room_id}
              className="p-4 cursor-pointer flex items-center"
              style={{
                borderBottomColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-bg-secondary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-bg-primary)';
              }}
              onClick={() =>
                navigate(`/chat/${room.room_id}`, {
                  state: { roomId: room.room_id, otherUserId: room.recipient_id, userId, otherUsername: room.recipient_profile_username , otherProfilePicture: room.recipient_profile_image
                  },
                })
              }
            >
              <img
                src={room.recipient_profile_image || "https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg"}
                alt={room.other_user?.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 
                    className="font-medium truncate"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {room.recipient_profile_username || "Unknown User"}
                  </h3>
                 
                </div>
               
              </div>
            </div>
          ))
        ) : (
          <div 
            className="p-8 text-center"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            You don't have any conversations yet
          </div>
        )}
      </div>
      <BottomNav activeTab="messages" />
    </div>
  );
};

export default ChatListPage;
