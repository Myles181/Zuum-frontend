import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useReactToPost } from '../../../Hooks/audioPosts/usePostInteractions';

/**
 * A reusable like/reaction button.
 *
 * Props:
 * - postId: ID of the post to react to
 * - reactions: array of reaction objects [{ like, unlike, post_reacter_id, ... }]
 * - profileId: current user's profile ID
 */
const ReactionButton = ({ postId, reactions = [], profileId }) => {
  // Derive initial state from reactions array
  const initialLikeCount = reactions.filter(r => r.like).length;
  const initialLiked = reactions.some(
    r => r.post_reacter_id === profileId && r.like
  );

  console.log(reactions, initialLiked, initialLikeCount);
  

  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { reactToPost, loading } = useReactToPost();

  // Sync if reactions or profileId change
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [initialLiked, initialLikeCount]);

  const handleClick = async (e) => {
    e.stopPropagation();
    // Optimistic UI update
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(count => count - 1);
      await reactToPost(postId, false, true);
    } else {
      setIsLiked(true);
      setLikeCount(count => count + 1);
      await reactToPost(postId, true, false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className=" flex flex-col justify-center items-center gap-1 rounded-full shadow-md hover:bg-red-300 transition-all duration-200"
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {isLiked ? (
        <FaHeart className="text-green-700 text-xl" />
      ) : (
        <FaRegHeart className="text-gray-100 text-xl" />
      )}
      <span className="text-sm text-white">{likeCount}</span>
    </button>
  );
};

export default ReactionButton;
