import React, { useState, useEffect } from 'react';
import { useCreateVideoComment } from '../../../Hooks/videoPosts/useVideoPostInteractions';
import useUserProfile from "../../../Hooks/useProfile";
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ comments: initialComments, postId }) => {
  const [showComments, setShowComments] = useState(true); // Show by default
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(initialComments || []);
  const { profile } = useUserProfile();

  const { createVideoComment, loading, error, success, reset } = useCreateVideoComment();

  useEffect(() => {
    if (success) {
      setNewComment('');
      reset();
    }
  }, [success, reset]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const tempComment = {
          id: Date.now(),
          username: profile?.username || 'You',
          profile_picture: profile?.image || '/default-avatar.png',
          comment: newComment,
          created_at: new Date().toISOString(),
          likes: 0,
          replies: []
        };

        setComments([tempComment, ...comments]);
        
        await createVideoComment({
          post_id: postId,
          comment: newComment
        });

      } catch (err) {
        setComments(comments.filter(c => c.id !== tempComment.id));
      }
    }
  };

  return (
    <div className="comments mt-4 bg-white rounded-lg">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h2>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            {showComments ? 'Hide comments' : 'Show comments'}
          </button>
        </div>
      </div>
      
      {showComments && (
        <div className="divide-y divide-gray-100">
          {/* Comment Input - Fixed at top */}
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <img
                src={profile?.image || '/default-avatar.png'}
                alt="Your profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <form onSubmit={handleSubmitComment} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-2 pr-12 border-b border-gray-200 focus:border-gray-300 focus:outline-none text-sm"
                    disabled={loading}
                  />
                  {newComment.trim() && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 font-semibold text-sm hover:text-blue-700"
                    >
                      Post
                    </button>
                  )}
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </form>
            </div>
          </div>

          {/* Comments List */}
          <div className="max-h-[500px] overflow-y-auto">
            {comments.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {comments.map((comment) => (
                  <li key={comment.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex space-x-3">
                      <img
                        src={comment.profile_picture}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {comment.username}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
                          {comment.comment}
                        </p>
                        
                        {/* Comment Actions */}
                        <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                          <button className="hover:text-gray-700 hover:underline">
                            Like
                          </button>
                          <button className="hover:text-gray-700 hover:underline">
                            Reply
                          </button>
                          {comment.likes > 0 && (
                            <span>{comment.likes} likes</span>
                          )}
                        </div>
                        
                        {/* Reply form would go here */}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;