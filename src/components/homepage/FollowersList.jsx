import React from "react";
import { Link } from "react-router-dom";
import useProfile from "../../../Hooks/useProfile";

const FollowersPage = ({ showAll = false }) => {
  const { profile: authProfile, loading: authLoading } = useProfile();

  if (authLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!authProfile) return <p className="text-center text-red-500">Error loading profile.</p>;

  const followingUsers = authProfile.following_list || [];
  const displayedUsers = showAll ? followingUsers : followingUsers.slice(0, 3);

  return (
    <div className="max-w-lg mx-auto">
      <ul className="space-y-4">
        {displayedUsers.map((user) => (
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
        ))}
      </ul>

      {!showAll && followingUsers.length > 3 && (
        <div className="mt-4 text-center">
          <Link to="/all" className="text-blue-500 hover:underline">
            See More
          </Link>
        </div>
      )}
    </div>
  );
};

export default FollowersPage;
