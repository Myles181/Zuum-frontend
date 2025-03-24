import React, { useState, useEffect } from 'react';
import { useCreateComment } from '../../../Hooks/audioPosts/usePostInteractions';
import useUserProfile from "../../../Hooks/useProfile";

const CommentSection = ({ comments: initialComments, postId }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(initialComments || []); // Store comments locally
  const { profile } = useUserProfile();

  const { createComment, loading, error, success } = useCreateComment();

  useEffect(() => {
    if (success) {
      setNewComment('');
    }
  }, [success]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const commentData = {
          id: Date.now(), // Temporary ID (replace with actual ID from API if needed)
          username: 'You', // Assuming the current user is adding the comment
          profile_picture: profile.image, // Replace with actual user profile picture
          comment: newComment,
        };

        setComments([commentData, ...comments]); // Update the comments state immediately
        await createComment(postId, newComment); // Send the comment to the backend
      } catch (err) {
        console.error('Error posting comment:', err);
      }
    }
  };

  console.log(comments);
  

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
          <div className="mb-20">
            {comments.length > 0 ? (
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="bg-gray-100 p-4 rounded-lg border hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <img
                        src={comment.profile_picture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border"
                      />
                      <div>
                        <p className="text-gray-900 font-semibold">{comment.username}</p>
                        <p className="text-sm text-gray-500">Just now</p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{comment.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
            )}
          </div>
          {/* Comment Input Box */}
          <form onSubmit={handleSubmitComment} className="absolute bottom-0 left-0 right-0 bg-white p-2 border-t flex items-center gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              disabled={loading}
            >
              {loading ? '...' : 'Post'}
            </button>
          </form>
          {/* Display error message */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {/* Display success message */}
          {success && <p className="text-green-500 text-center mt-2">Comment added successfully!</p>}
        </>
      )}
    </div>
  );
};

export default CommentSection;
