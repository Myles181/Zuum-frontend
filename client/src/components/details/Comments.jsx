import React, { useState, useEffect, useRef } from 'react';
import { useCreateComment } from '../../../Hooks/audioPosts/usePostInteractions';
import { FaComment, FaTimes, FaHeart, FaRegHeart, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useProfile from '../../../Hooks/useProfile';

const CommentModal = ({ comments: initialComments, postId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  // ← Initialize from props ONCE via function initializer
  const [comments, setComments] = useState(() =>
    Array.isArray(initialComments) ? initialComments : []
  );
  const [optimisticId, setOptimisticId] = useState(null);
  const commentsEndRef = useRef(null);

  const { createComment, isLoading, error, isSuccess, commentData } = useCreateComment();
  const { profile } = useProfile();

  // Now this effect only runs if the PARENT actually passes a new array
  useEffect(() => {
    if (Array.isArray(initialComments)) {
      setComments(initialComments);
    }
  }, [initialComments]);

  // … rest is unchanged …

  // On successful create, replace optimistic entry with server response
  useEffect(() => {
    if (isSuccess && commentData && optimisticId) {
      setComments(prev => prev.map(comment =>
        comment.id === optimisticId
          ? {
              id: commentData.id,
              username: commentData.username || profile?.username || 'You',
              profile_picture: commentData.profile_picture || profile?.image || '/default-profile.jpg',
              comment: commentData.comment,
              created_at: commentData.created_at,
              likes: commentData.likes ?? 0,
              isLiked: false,
            }
          : comment
      ));
      setOptimisticId(null);
      scrollToBottom();
    }
  }, [isSuccess, commentData, optimisticId, profile]);

  const scrollToBottom = () => {
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;

    const tempId = Date.now();
    const tempComment = {
      id: tempId,
      username: profile?.username || 'You',
      profile_picture: profile?.image || '/default-profile.jpg',
      comment: trimmedComment,
      created_at: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setOptimisticId(tempId);
    setComments(prev => [...prev, tempComment]);
    setNewComment('');
    scrollToBottom();

    try {
      await createComment(postId, trimmedComment);
    } catch {
      setComments(prev => prev.filter(c => c.id !== tempId));
      setOptimisticId(null);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h`;
    return `${Math.floor(diff/86400)}d`;
  };


  return (
    <>
      {/* Comment Trigger */}
      <button onClick={() => setIsModalOpen(true)} className="flex flex-col items-center text-white rounded-full" aria-label="View comments">
        <div className="rounded-full p-2 hover:bg-white/10 transition-colors">
          <FaComment className="text-xl" />
        </div>
        <span className="text-sm">{comments.length}</span>
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50">
            <motion.div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
            <motion.div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden flex flex-col" style={{ height: '70vh' }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>

              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-lg">{comments.length} comments</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 p-2 hover:text-gray-700" aria-label="Close comments">
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto px-4">
                <div className="space-y-4 py-2">
                  {comments.length ? comments.map(comment => (
                    <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex gap-3">
                      <img src={comment.profile_picture} alt="Profile" className="w-10 h-10 rounded-full object-cover" onError={e => e.target.src = '/default-profile.jpg'} />
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-100 rounded-2xl p-3">
                          <p className="font-semibold text-sm">{comment.username}</p>
                          <p className="text-gray-800 mt-1 break-words">{comment.comment}</p>
                        </div>
                        <div className="flex items-center mt-1 ml-2 gap-4 text-xs text-gray-500">
                          <span>{formatDate(comment.created_at)}</span>
                         
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-10 text-gray-500">No comments yet. Be the first to comment!</div>
                  )}
                  <div ref={commentsEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
                  <img src={profile?.image || '/default-profile.jpg'} alt="Your profile" className="w-10 h-10 rounded-full object-cover" onError={e => e.target.src = '/default-profile.jpg'} />
                  <div className="flex-1 relative">
                    <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2D8C72]" disabled={isLoading} aria-label="Comment input" />
                    <button type="submit" disabled={!newComment.trim() || isLoading} className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${newComment.trim() ? 'text-[#2D8C72]' : 'text-gray-400'}`} aria-label="Submit comment">
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-500 text-sm mt-2 text-center">
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
