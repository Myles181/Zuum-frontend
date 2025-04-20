import React, { useState, useEffect, useRef } from 'react';
import useUserProfile from "../../../Hooks/useProfile";
import { FaComment, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommentOnBeatPost } from '../../../Hooks/beats/useBeats';
import { MessageCircle } from 'lucide-react';

const BeatCommentModal = ({ comments: initialComments = [], postId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(initialComments);
  const { profile } = useUserProfile();
  const commentsEndRef = useRef(null);

  const { commentOnBeatPost, loading, error, success } = useCommentOnBeatPost();

  // Scroll to bottom when comments change
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [comments.length, isModalOpen]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Define tempComment outside try-catch so it's accessible in catch
      const tempComment = {
        id: Date.now(), // Temporary ID until we get the real one
        username: profile.username || 'You',
        profile_picture: profile.image,
        comment: newComment,
        created_at: new Date().toISOString(),
      };

      try {
        // Optimistic UI update
        setComments(prev => [...prev, tempComment]);
        await commentOnBeatPost(postId, newComment);
        
        // Clear input on success
        if (success) {
          setNewComment('');
        }
      } catch (err) {
        // Remove the optimistic update if API call fails
        setComments(prev => prev.filter(c => c.id !== tempComment.id));
        console.error('Error posting comment:', err);
      }
    }
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
      <div className="p-4 border-t border-gray-200 flex justify-center">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          aria-label="View comments"
        >
          <div className="rounded-full p-2">
            <MessageCircle className="text-xl" />
          </div>
          <span className="text-sm">{comments.length}</span>
          <span>Leave a Comment</span>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50">
            {/* Semi-transparent background */}
            <motion.div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Comment panel */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden flex flex-col"
              style={{ height: '70vh' }}
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
                  aria-label="Close comments"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              {/* Comments list */}
              <div className="flex-1 overflow-y-auto px-4">
                <div className="space-y-4 py-2">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img
                          src={comment.profile_picture || '/default-profile.png'}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/default-profile.png';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-100 rounded-2xl p-3">
                            <p className="font-semibold text-sm">{comment.username}</p>
                            <p className="text-gray-800 mt-1 break-words">{comment.comment}</p>
                          </div>
                          <div className="mt-1 ml-2 text-xs text-gray-500">
                            {formatDate(comment.created_at)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      No comments yet. Be the first to comment!
                    </div>
                  )}
                  <div ref={commentsEndRef} />
                </div>
              </div>
              
              {/* Comment input */}
              <div className="p-3 border-t border-gray-200 mb-13 bg-white">
                <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
                  <img
                    src={profile?.image || '/default-profile.png'}
                    alt="Your profile"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/default-profile.png';
                    }}
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || loading}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                        newComment.trim() ? 'text-green-500' : 'text-gray-400'
                      }`}
                      aria-label="Post comment"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
                {error && (
                  <div className="text-red-500 text-sm mt-2 text-center">
                    {error}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BeatCommentModal;