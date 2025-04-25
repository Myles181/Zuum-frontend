import { useVideoReaction } from '../../../Hooks/videoPosts/useVideoPostInteractions';
import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

/**

/**
 * A reusable like/reaction button.
 *
 * Props:
 * - postId: ID of the post to react to
 * - reactions: array of reaction objects [{ like, unlike, post_reacter_id, ... }]
 * - profileId: current user's profile ID
 */
const ReactionButton = ({ postId, reactions, profileId }) => {
  const { reactToVideo, loading, error } = useVideoReaction();

  const safeReactions = Array.isArray(reactions) ? reactions : [];

  const initialLikeCount = safeReactions.filter(r => r.like).length;
  const initialLiked =
    profileId &&
    safeReactions.some(r => r.post_reacter_id === profileId && r.like);

  const [isLiked, setIsLiked] = useState(initialLiked || false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    setLikeCount(initialLikeCount);
    setIsLiked(initialLiked || false);
  }, [initialLikeCount, initialLiked]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!profileId) return;

    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
      await reactToVideo(postId, false, true);
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      await reactToVideo(postId, true, false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || !profileId}
      className="flex flex-col justify-center items-center gap-1 rounded-full shadow-md hover:bg-red-300 transition-all duration-200"
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {profileId ? (
        isLiked ? (
          <FaHeart className="text-green-700 text-xl" />
        ) : (
          <FaRegHeart className="text-gray-100 text-xl" />
        )
      ) : (
        <FaRegHeart className="text-gray-400 text-xl" />
      )}
      <span className="text-sm text-white">{likeCount}</span>
    </button>
  );
};

export default ReactionButton;
