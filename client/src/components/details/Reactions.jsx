import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useReactToPost } from '../../../Hooks/audioPosts/usePostInteractions';

const ReactionButton = ({ postId, initialLiked = false, initialLikeCount = 0 }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { reactToPost, loading } = useReactToPost();

  // Check and update the like status when initial props change.
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [initialLiked, initialLikeCount]);

  const handleClick = async (e) => {
    e.stopPropagation(); // Prevent triggering parent onClick events.
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(likeCount - 1);
      await reactToPost(postId, false, true); // Remove like
    } else {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
      await reactToPost(postId, true, false); // Add like
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
    >
      {isLiked ? <FaHeart style={{ color: 'green' }} /> : <FaRegHeart className="text-gray-500" />}
      <span className="text-sm text-gray-600">{likeCount}</span>
    </button>
  );
};

export default ReactionButton;
