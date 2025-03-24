import React, { useState } from 'react';
import { useVideoReaction } from '../../../Hooks/videoPosts/useVideoPostInteractions';


const ReactionsSection = ({ postId, initialReactions = [] }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState(initialReactions);
  const { reactToVideo, loading, error, reaction: apiReaction } = useVideoReaction();

  // Handle reaction toggle with API integration
  const handleReaction = async (type) => {
    const currentReaction = apiReaction === type ? null : type;
    const isLike = type === 'like';
    
    try {
      // Optimistic UI update
      setReactions(prev => {
        // In a real app, you'd want to merge with existing reactions
        // This is a simplified version for demonstration
        return currentReaction 
          ? [{ id: Date.now(), type, user: 'You' }, ...prev]
          : prev.filter(r => r.user !== 'You');
      });

      // Call API
      await reactToVideo({
        post_id: postId,
        like: isLike && currentReaction === 'like',
        unlike: !isLike && currentReaction === 'unlike'
      });

    } catch (err) {
      // Revert optimistic update on error
      setReactions(initialReactions);
    }
  };

  // Count reactions by type
  const likeCount = reactions.filter(r => r.type === 'like').length;
  const unlikeCount = reactions.filter(r => r.type === 'unlike').length;

  return (
    <div className="reactions-section bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Reactions</h3>
        <button 
          onClick={() => setShowReactions(!showReactions)}
          className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
        >
          {showReactions ? 'Hide' : 'Show'} Reactions
          <ChevronIcon direction={showReactions ? 'up' : 'down'} />
        </button>
      </div>

      {/* Reaction Buttons */}
      <div className="flex gap-4 mb-4">
        <ReactionButton
          type="like"
          active={apiReaction === 'like'}
          count={likeCount}
          onClick={() => handleReaction('like')}
          loading={loading}
        />
        <ReactionButton
          type="unlike"
          active={apiReaction === 'unlike'}
          count={unlikeCount}
          onClick={() => handleReaction('unlike')}
          loading={loading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Reactions List */}
      {showReactions && (
        <div className="border-t pt-4">
          {reactions.length > 0 ? (
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {reactions.map((react) => (
                <ReactionItem 
                  key={react.id} 
                  reaction={react} 
                  isCurrentUser={react.user === 'You'}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No reactions yet. Be the first to react!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Sub-components for better organization
const ChevronIcon = ({ direction }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d={direction === 'up' 
        ? "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
        : "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"}
      clipRule="evenodd"
    />
  </svg>
);

const ReactionButton = ({ type, active, count, onClick, loading }) => {
  const isLike = type === 'like';
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        active 
          ? isLike 
            ? 'bg-green-50 text-green-600' 
            : 'bg-red-50 text-red-600'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }`}
    >
      {isLike ? (
        <LikeIcon filled={active} />
      ) : (
        <UnlikeIcon filled={active} />
      )}
      <span>{count}</span>
      {loading && active && <span className="animate-pulse">...</span>}
    </button>
  );
};

const ReactionItem = ({ reaction, isCurrentUser }) => (
  <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
    <div className={`p-2 rounded-full ${
      reaction.type === 'like' ? 'bg-green-50' : 'bg-red-50'
    }`}>
      {reaction.type === 'like' ? <LikeIcon /> : <UnlikeIcon />}
    </div>
    <div className="flex-1">
      <p className="font-medium">
        {isCurrentUser ? 'You' : reaction.user}
      </p>
      <p className="text-sm text-gray-500">
        {reaction.type === 'like' ? 'Liked' : 'Disliked'} this video
      </p>
    </div>
    <span className="text-xs text-gray-400">
      {new Date(reaction.created_at).toLocaleDateString()}
    </span>
  </li>
);

const LikeIcon = ({ filled = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
    />
  </svg>
);

const UnlikeIcon = ({ filled = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5M17 13H9"
    />
  </svg>
);

export default ReactionsSection;