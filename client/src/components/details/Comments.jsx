import React, { useState, useEffect, useRef } from 'react';
import { useCreateComment } from '../../../Hooks/audioPosts/usePostInteractions';
import useUserProfile from "../../../Hooks/useProfile";
import { FaComment, FaTimes, FaHeart, FaRegHeart, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CommentModal = ({ comments: initialComments = [], postId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(initialComments);
  const { profile } = useUserProfile();
  const commentsEndRef = useRef(null);

  const { createComment, loading, error, success } = useCreateComment();

  // Update local comments when initialComments changes
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    if (success) {
      setNewComment('');
      // Auto-scroll to bottom when new comment is added
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [success, comments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const tempComment = {
          id: Date.now(),
          username: profile.username || 'You',
          profile_picture: profile.image,
          comment: newComment,
          created_at: new Date().toISOString(),
          likes: 0,
          isLiked: false
        };

        setComments([...comments, tempComment]);
        await createComment(postId, newComment);
      } catch (err) {
        console.error('Error posting comment:', err);
      }
    }
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <>
      {/* Comment Trigger Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex flex-col items-center text-white rounded-full"
      >
        <div className="rounded-full p-2">
          <FaComment className="text-xl" />
        </div>
        <span className="text-sm">{comments.length }</span>
      </button>

      {/* TikTok-style Modal with Animation */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50">
            {/* Semi-transparent background with fade animation */}
            <motion.div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Comment panel with slide-up animation */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden flex flex-col"
              style={{ height: '70vh' }} // Fixed height (75% of viewport)
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center py-2 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
              </div>
              
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-lg">{comments.length} comments</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 p-2"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              {/* Comments list container with fixed height */}
              <div className="flex-1 overflow-y-auto px-4">
                <div className="space-y-4 py-2">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={comment.profile_picture || 'https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg'}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                       
                      />
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-100 rounded-2xl p-3">
                          <p className="font-semibold text-sm">{comment.username}</p>
                          <p className="text-gray-800 mt-1 break-words">{comment.comment}</p>
                        </div>
                        <div className="flex items-center mt-1 ml-2 gap-4 text-xs text-gray-500">
                          <span>{formatDate(comment.created_at)}</span>
                          <button 
                            className="flex items-center gap-1"
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            {comment.isLiked ? (
                              <FaHeart className="text-red-500" />
                            ) : (
                              <FaRegHeart />
                            )}
                            {comment.likes > 0 && <span>{comment.likes}</span>}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>
              </div>
              
              {/* Fixed comment input at bottom */}
              <div className="p-3 border-t mb-10 border-gray-200 bg-white">
                <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
                  <img
                    src={profile?.image || 'https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg'}
                    alt="Your profile"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg';
                    }}
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || loading}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${newComment.trim() ? 'text-green-500' : 'text-gray-400'}`}
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommentModal;