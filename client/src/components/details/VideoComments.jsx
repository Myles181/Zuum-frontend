import React, { useState, useEffect, useRef } from 'react';
import { useCreateVideoComment } from '../../../Hooks/videoPosts/useVideoPostInteractions';
import { FaComment, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useProfile from '../../../Hooks/useProfile';

const CommentModal = ({ comments: initialComments, postId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(() =>
    Array.isArray(initialComments) ? initialComments : []
  );
  const commentsEndRef = useRef(null);

  const { createComment, isLoading, error } = useCreateVideoComment();
  const { profile } = useProfile();

  // Sync comments when prop updates, but preserve our optimistic ones
  useEffect(() => {
    if (Array.isArray(initialComments)) {
      // Keep our local comments that aren't in the server data
      const localOnlyComments = comments.filter(
        localComment => !initialComments.some(
          serverComment => serverComment.id === localComment.id
        )
      );
      
      // Combine server data with local-only comments
      setComments([...initialComments, ...localOnlyComments]);
    }
  }, [initialComments]);

  const scrollToBottom = () => {
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Submit new comment with optimistic UI
  const handleSubmitComment = async e => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;

    // Generate a temporary ID for the optimistic comment
    const tempId = `temp-${Date.now()}`;
    
    // Create optimistic comment object
    const tempComment = {
      id: tempId,
      username: profile?.username || 'You',
      profile_picture: profile?.image || '/default-profile.jpg',
      comment: trimmedComment,
      created_at: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      isOptimistic: true // Flag to identify our local comments
    };

    // Add comment to UI immediately
    setComments(prev => [...prev, tempComment]);
    setNewComment(''); // Clear input field
    
    // Scroll to the new comment
    scrollToBottom();

    // Now attempt to send to server, but don't update our UI on success
    try {
      await createComment(postId, trimmedComment);
      // Don't do anything with the response - we want to keep our optimistic UI
    } catch (err) {
      // Mark as failed but keep it visible
      setComments(prev => prev.map(c => 
        c.id === tempId 
          ? {...c, isFailed: true}
          : c
      ));
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h`;
    return `${Math.floor(diff/86400)}d`;
  };

  // Generate a safe key for React lists
  const generateSafeKey = (comment, index) => {
    if (comment.id) return `comment-${comment.id}`;
    return `comment-index-${index}`;
  };

  return (
    <>
      {/* Comment Trigger */}
      <button
        onClick={e => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className="flex flex-col items-center text-white rounded-full"
        aria-label="View comments"
      >
        <div className="rounded-full p-2 hover:bg-white/10 transition-colors">
          <FaComment className="text-xl" />
        </div>
        <span className="text-sm">{comments.length}</span>
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Modal Panel */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden flex flex-col"
              style={{ height: '70vh' }}
              onClick={e => e.stopPropagation()} // Stop backdrop click
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-lg">{comments.length} comments</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 p-2 hover:text-gray-700"
                  aria-label="Close comments"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto px-4">
                <div className="space-y-4 py-2">
                  {comments.length ? (
                    comments.map((comment, index) => (
                      <motion.div
                        key={generateSafeKey(comment, index)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3"
                      >
                        <img
                          src={comment.profile_picture}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                          onError={e => e.target.src = '/default-profile.jpg'}
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`bg-gray-100 rounded-2xl p-3 ${comment.isFailed ? 'border border-red-300' : ''}`}>
                            <div className="flex justify-between items-start">
                              <p className="font-semibold text-sm">{comment.username}</p>
                              {comment.isFailed && (
                                <span className="text-xs text-red-500 ml-2">Failed to send</span>
                              )}
                            </div>
                            <p className="text-gray-800 mt-1 break-words">{comment.comment}</p>
                          </div>
                          <div className="flex items-center mt-1 ml-2 gap-4 text-xs text-gray-500">
                            <span>{formatDate(comment.created_at)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">No comments yet. Be the first to comment!</div>
                  )}
                  <div ref={commentsEndRef} />
                </div>
              </div>

              {/* Input Field */}
              <div className="p-3 border-t border-gray-200 bg-white mb-10">
                <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
                  <img
                    src={profile?.image || '/default-profile.jpg'}
                    alt="Your profile"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={e => e.target.src = '/default-profile.jpg'}
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                      disabled={isLoading}
                      aria-label="Comment input"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isLoading}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${newComment.trim() ? 'text-[#2D8C72]' : 'text-gray-400'}`}
                      aria-label="Submit comment"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-500 text-sm mt-2 text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommentModal;