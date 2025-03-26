import React, { useState, useEffect } from 'react';
import { useReactToPost } from '../../../Hooks/audioPosts/usePostInteractions';
import { useUserProfile } from '../../../Hooks/useProfile';



const ReactionsSection = ({ reactions, postId }) => {
  const [userReaction, setUserReaction] = useState(null); // Track the user's reaction
  const [showReactions, setShowReactions] = useState(false); // Track if reactions are visible
  const { profile } = useUserProfile();

  // Import the useReactToPost hook
  const { reactToPost, loading, error, success } = useReactToPost();

  console.log(postId);

  console.log(profile);
  
  

  // Effect to update userReaction based on existing reactions
  useEffect(() => {
    const userReact = reactions.find(reaction => reaction.user_id === profile?.id); 
    if (userReact) {
      setUserReaction(userReact.like ? 'like' : 'unlike');
    }
  }, [reactions]);

  // Function to handle like/unlike toggle
  const handleReactionToggle = async (type) => {
    if (userReaction === type) {
      setUserReaction(null); // Remove reaction if already selected
      await reactToPost(postId, false, true); // Unlike the post
    } else {
      setUserReaction(type); // Set new reaction
      await reactToPost(postId, type === 'like', type === 'unlike'); // Like or unlike the post
    }
  };

  return (
    <div className="reactions mt-6 bg-gray-50 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Reactions</h2>
        <div className="flex items-center space-x-4">
          {/* Reaction Count */}
          <span className="text-gray-600">{reactions.length} reactions</span>
          {/* Collapse Button */}
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            {showReactions ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Like/Unlike Buttons */}
      <div className="flex space-x-4 mt-4 mb-6">
        <button
          onClick={() => handleReactionToggle('like')}
          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
            userReaction === 'like'
              ? 'bg-green-50 text-green-600'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>Like</span>
        </button>
        <button
          onClick={() => handleReactionToggle('unlike')}
          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
            userReaction === 'unlike'
              ? 'bg-red-50 text-red-600'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5M17 13H9"
            />
          </svg>
          <span>Unlike</span>
        </button>
      </div>

      {/* Reactions List */}
      {showReactions && (
        <>
          {reactions && reactions.length > 0 ? (
            <ul className="space-y-4">
              {reactions.map((reaction) => (
                <li
                  key={reaction.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    {/* Profile Picture */}
                    <img
                      src={reaction.profile_picture}
                      alt={reaction.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">{reaction.username}</p>
                      <p className="text-sm text-gray-500">
                        Reacted with {reaction.like ? 'like' : 'unlike'} •{' '}
                        {new Date(reaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Reaction Icon */}
                    <div
                      className={`p-2 rounded-full ${
                        reaction.like
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {reaction.like ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5M17 13H9"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No reactions yet.</p>
          )}
        </>
      )}

      {/* Loading/Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Reaction saved successfully!</p>}
    </div>
  );
};

export default ReactionsSection;