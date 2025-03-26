import { useEffect, useState } from "react";
import { useGetRooms } from "../../../Hooks/messages/useMessages";
import { useNavigate } from "react-router-dom";
import BottomNav from "../homepage/BottomNav";
import Overlay from "../homepage/Overlay";
import Navbar from "../profile/NavBar";
import Sidebar from "../homepage/Sidebar";
import Spinner from "../Spinner";

const ChatListPage = () => {
  
  // Changed from useChatRooms to useGetRooms
  const { rooms, loading, error, refreshRooms } = useGetRooms();
   const navigate = useNavigate();

   const [sidebarOpen, setSidebarOpen] = useState(false);
     
   
     const toggleSidebar = () => {
       setSidebarOpen(!sidebarOpen);
     };
  // Add useEffect to load rooms on component mount
  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <Spinner /> {/* Show the spinner while loading */}
        </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Navbar name="Messages" toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="divide-y divide-gray-200">
        {rooms.length > 0 ? (
          rooms.map(room => (
            <div 
              key={room.room_id} 
              className="p-4 hover:bg-gray-50 cursor-pointer flex items-center"
              onClick={() => navigate(`/chat/${room.room_id}`, { state: room })}
            >
              {/* Update these fields based on your actual API response structure */}
              <img 
                src={room.other_user?.image || '/default-avatar.png'} 
                alt={room.other_user?.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 truncate">
                    {room.other_user?.name || 'Unknown User'}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date(room.last_message_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {room.last_message || 'No messages yet'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            You don't have any conversations yet
          </div>
        )}
      </div>
      <BottomNav activeTab="messages" />
    </div>
  );
};

export default ChatListPage