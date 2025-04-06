import React, { useState } from "react";
import { Link } from "react-router-dom";
import useProfile from "../../../Hooks/useProfile";
import Navbar from "../profile/NavBar";
import BottomNav from "./BottomNav";
import Spinner from "../Spinner";

const FollowersListPage = () => {
  const { profile: authProfile, loading: authLoading } = useProfile();
  const [activeTab, setActiveTab] = useState("followers"); // State to track active tab

  if (authLoading) return <Spinner />;
  if (!authProfile) return <p className="text-center text-red-500">Error loading profile.</p>;

  const followers = authProfile.followers_list || [];
  const following = authProfile.following_list || [];

  // Determine which list to display
  const displayedUsers = activeTab === "followers" ? followers : following;

  return (
    <div className="max-w-lg mx-auto">
        <Navbar name={"followers"} />
      <h2 className="text-2xl font-bold text-center mb-4 mt-8">Your Connections</h2>

      {/* Tabs for Followers and Following */}
      <div className="flex justify-center border-b mb-4">
        <button
          className={`px-4 py-2 text-lg ${activeTab === "followers" ? "border-b-2 border-[#2D8C72] font-bold" : "text-gray-500"}`}
          onClick={() => setActiveTab("followers")}
        >
          Followers ({followers.length})
        </button>
        <button
          className={`px-4 py-2 text-lg ${activeTab === "following" ? "border-b-2 border-[#2D8C72] font-bold" : "text-gray-500"}`}
          onClick={() => setActiveTab("following")}
        >
          Following ({following.length})
        </button>
      </div>

      {/* List of users based on the selected tab */}
      <ul className="space-y-4">
        {displayedUsers.length === 0 ? (
          <p className="text-center text-gray-500">No {activeTab} yet.</p>
        ) : (
          displayedUsers.map((user) => (
            <li key={user.id}>
              <Link to={`/profile/${user.id}`} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg">
                <img
                  src={user.image || "https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <span className="text-gray-800 font-medium">{user.username}</span>
              </Link>
            </li>
          ))
        )}
      </ul>
      <BottomNav />
    </div>
  );
};

export default FollowersListPage;
