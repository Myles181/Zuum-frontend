import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useReactToBeatPost } from '../../../Hooks/beats/useBeats';


/**
 * A reusable like/reaction button for beat posts.
 *
 * Props:
 * - postId: ID of the beat post to react to
 * - reactions: array of reaction objects [{ like, unlike, post_reacter_id, ... }]
 * - profileId: current user's profile ID
 */
const BeatReactionButton = ({ postId, reactions = [], profileId }) => {
  // Derive initial state from reactions array
  const initialLikeCount = reactions.filter(r => r.like).length;
  const initialLiked = reactions.some(
    r => r.post_reacter_id === profileId && r.like
  );

  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { reactToBeatPost, loading, error } = useReactToBeatPost();

  // Sync if reactions or profileId change
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [initialLiked, initialLikeCount]);

  const handleClick = async (e) => {
    e.stopPropagation();
    
    try {
      // Optimistic UI update
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
      
      // Call the API
      await reactToBeatPost(postId, newLikedState ? 'like' : 'unlike');
      
    } catch (err) {
      // Revert optimistic update if API call fails
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      console.error('Failed to update reaction:', err);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex  justify-center items-center gap-1  hover:bg-red-300 transition-all duration-200"
      aria-label={isLiked ? 'Unlike this beat' : 'Like this beat'}
    >
      {isLiked ? (
        <FaHeart className="text-green-700 text-xl" />
      ) : (
        <FaRegHeart className="text-gray-900 text-xl" />
      )}
      <span className="text-sm text-black">{likeCount}</span>
    </button>
  );
};

export default BeatReactionButton;