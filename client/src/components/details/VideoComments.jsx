import React, { useState, useEffect, useRef } from 'react';
import { useCreateVideoComment } from '../../../Hooks/videoPosts/useVideoPostInteractions';
import { FaComment, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useProfile from '../../../Hooks/useProfile';

const VideoCommentModal = ({ comments: initialComments, postId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState(Array.isArray(initialComments) ? initialComments : []);
  const [newComment, setNewComment] = useState('');
  const [optimisticId, setOptimisticId] = useState(null);
  const commentsEndRef = useRef(null);

  const { createVideoComment, loading, error, success } = useCreateVideoComment();
  const { profile } = useProfile();

  // Sync when initialComments prop changes
  useEffect(() => {
    if (Array.isArray(initialComments)) setComments(initialComments);
  }, [initialComments]);

  // On successful API comment, replace optimistic comment
  useEffect(() => {
    if (success && optimisticId) {
      // Assuming createVideoComment returns new comment data via success state
      // If the hook returns data, you'd capture it in the hook and use it here
      setComments(prev => prev.map(c => {
        if (c.id === optimisticId) {
          // Replace temp comment with actual (no structural change if no data)
          return { ...c, id: `srv-${optimisticId}`, isPending: false };
        }
        return c;
      }));
      setOptimisticId(null);
      scrollToBottom();
    }
  }, [success, optimisticId]);

  const scrollToBottom = () => {
    setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const text = newComment.trim();
    if (!text) return;

    const tempId = Date.now();
    const temp = {
      id: tempId,
      username: profile?.username || 'You',
      profile_picture: profile?.image || '/default-avatar.png',
      comment: text,
      created_at: new Date().toISOString(),
      likes: 0,
      isPending: true,
    };

    // Optimistic add
    setComments(prev => [...prev, temp]);
    setOptimisticId(tempId);
    setNewComment('');
    scrollToBottom();

    try {
      await createVideoComment({ post_id: postId, comment: text });
    } catch {
      // Remove optimistic on failure
      setComments(prev => prev.filter(c => c.id !== tempId));
      setOptimisticId(null);
    }
  };

  const formatDate = iso => {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h`;
    return `${Math.floor(diff/86400)}d`;
  };

  return (
    <>
      <button
        onClick={e => { e.stopPropagation(); setIsOpen(true); }}
        className="flex flex-col items-center text-white"
        aria-label="View comments"
      >
        <FaComment className="text-xl" />
        <span className="text-sm">{comments.length}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50">
            <motion.div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl flex flex-col"
              style={{ height: '70vh' }}
              onClick={e => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">{comments.length} Comments</h3>
                <button onClick={() => setIsOpen(false)} aria-label="Close">
                  <FaTimes className="text-xl text-gray-600" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto px-4 py-2">
                {comments.length ? (
                  comments.map(c => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 mb-3"
                    >
                      <img
                        src={c.profile_picture}
                        alt={c.username}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={e => e.target.src = '/default-avatar.png'}
                      />
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl p-3">
                          <p className="font-semibold text-sm">{c.username}</p>
                          <p className="mt-1 text-gray-800 break-words">{c.comment}</p>
                        </div>
                        <div className="mt-1 ml-2 text-xs text-gray-500">
                          {formatDate(c.created_at)}{c.isPending && ' • Sending...'}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">No comments yet.</div>
                )}
                <div ref={commentsEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-white">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <img
                    src={profile?.image || '/default-avatar.png'}
                    alt="Your profile"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={e => e.target.src = '/default-avatar.png'}
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || loading}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${newComment.trim() ? 'text-[#2D8C72]' : 'text-gray-400'}`}
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 text-center">
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

export default VideoCommentModal;
