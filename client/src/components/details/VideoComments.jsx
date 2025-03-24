import React, { useState, useEffect } from 'react';
import { useCreateVideoComment } from '../../../Hooks/videoPosts/useVideoPostInteractions';
import useUserProfile from "../../../Hooks/useProfile";

const CommentSection = ({ comments: initialComments, postId }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(initialComments || []);
  const { profile } = useUserProfile();

  // Using the video-specific comment hook
  const { createVideoComment, loading, error, success, reset } = useCreateVideoComment();

  // Reset form on successful submission
  useEffect(() => {
    if (success) {
      setNewComment('');
      reset(); // Clear success state after handling
    }
  }, [success, reset]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        // Optimistic UI update
        const tempComment = {
          id: Date.now(), // Temporary ID
          username: profile?.username || 'You',
          profile_picture: profile?.image || '/default-avatar.png',
          comment: newComment,
          created_at: new Date().toISOString()
        };

        setComments([tempComment, ...comments]);
        
        // Call the video-specific comment creation
        await createVideoComment({
          post_id: postId,
          comment: newComment
        });

      } catch (err) {
        // Revert optimistic update if error occurs
        setComments(comments.filter(c => c.id !== tempComment.id));
      }
    }
  };

  return (
    <div className="comments mt-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 relative">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-green-600 hover:text-green-800 transition-colors flex items-center gap-2 font-medium"
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>
      
      {showComments && (
        <>
          {/* Comments List */}
          <div className="mb-20 max-h-96 overflow-y-auto">
            {comments.length > 0 ? (
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.profile_picture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{comment.username}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700">{comment.comment}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || loading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition"
              >
                {loading ? '...' : 'Post'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default CommentSection;