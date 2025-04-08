import { useVideoReaction } from '../../../Hooks/videoPosts/useVideoPostInteractions';
import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

/**
 * A reusable like/reaction button.
 *
 * Props:
 * - postId: ID of the post to react to
 * - reactions: array of reaction objects [{ like, unlike, post_reacter_id, ... }]
 * - profileId: current user's profile ID
 */
const ReactionButton = ({ postId, reactions = [], profileId }) => {

  console.log(profileId);
  
  // Derive initial state from reactions array
  const initialLikeCount = reactions.filter(r => r.like).length;
  const initialLiked = reactions.some(
    r => r.post_reacter_id === profileId && r.like
  );

  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { reactToVideo, loading, error } = useVideoReaction();

  // Sync if reactions or profileId change
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [initialLiked, initialLikeCount]);

  const handleClick = async (e) => {
    e.stopPropagation();

    // Prepare new state
    const nextLiked = !isLiked;
    const nextCount = likeCount + (nextLiked ? 1 : -1);

    // Optimistic UI update
    setIsLiked(nextLiked);
    setLikeCount(nextCount);

    try {
      await reactToVideo({
        post_id: postId,
        like: nextLiked,
        unlike: !nextLiked
      });
    } catch (errMsg) {
      // Revert on error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      console.error('Reaction failed:', errMsg);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-gray-100 flex justify-center items-center gap-2 px-4 py-2 rounded-full shadow-md hover:bg-red-300 transition-all duration-200"
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {isLiked ? (
        <FaHeart className="text-green-700" />
      ) : (
        <FaRegHeart className="text-gray-500" />
      )}
      <span className="text-sm text-gray-700">{likeCount}</span>
    </button>
  );
};

export default ReactionButton;
