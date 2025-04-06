import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import { useGetVideoPosts } from "../../../Hooks/videoPosts/useCreateVideo"; // Hook for video posts
import Spinner from "../Spinner";
import a from "../../assets/icons/Mask group1.svg";
import b from "../../assets/icons/dots-icon.svg";
import c from "../../assets/image/11429433 1.svg";
import d from "../../assets/icons/Vector2.png";
import e from "../../assets/icons/stream-icon.svg";
import { FaHeart, FaComment } from "react-icons/fa"; // React Icons for like and comment
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";

const Post = ({ postId, postType }) => {
  const navigate = useNavigate();

  // Fetch audio post using the custom hook
  const {
    loading: audioLoading,
    error: audioError,
    posts: audioPosts,
  } = useAudioPosts(1, 10, postId);

  // Fetch video post using the video hook
  // const {
  //   data: videoPost,
  //   loading: videoLoading,
  //   error: videoError,
  // } = useGetVideoPosts(postId);

  // Determine which post to display based on postType
  const post = postType === "music" ? audioPosts[0] : videoPost;
  const loading = postType === "music" ? audioLoading : videoLoading;
  const error = postType === "music" ? audioError : videoError;

  const handlePostClick = () => {
    // Check if the post data is available
    if (post) {
      navigate(`/${postType}/${postId}`);
    } else {
      console.error("Post data is not available.");
      // Optionally, show a user-friendly message or prevent navigation
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!post) {
    return <p>No post data found.</p>;
  }

  return (
    <div
      className="post bg-white rounded-lg shadow-lg p-4 mb-5 cursor-pointer transition transform hover:scale-105"
      onClick={handlePostClick}
    >
      <div className="user-info flex items-center gap-3 justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.profile_picture || post.image || a}
            alt="Profile"
            className="profile-pic w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-bold">{post.username || "Olusteve"}</h4>
            <p className="text-gray-500">{post.artist || "Artist"}</p>
          </div>
        </div>
        <img src={b} className="menu-icon w-6 h-6 cursor-pointer" alt="Options" />
      </div>

      <div className="post-media relative mb-3">
        {postType === "music" ? (
          <img
            src={post.cover_photo || c}
            alt="Music Cover"
            className="w-full rounded-lg"
          />
        ) : (
          <>
            {/* Display video instead of thumbnail */}
            <video
              src={post.video_upload}
              className="w-full rounded-lg"
              controls // Add controls to allow play/pause
              poster={c} // Optional: Add a poster (thumbnail) for the video
            />
            <div className="play-overlay absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img src={d} alt="Play" className="w-10 h-10" />
            </div>
          </>
        )}
      </div>

      <div className="post-caption mb-3">
        <p className="text-sm">
          <strong>{post.caption || "My African Reggae"}</strong> by{" "}
          {post.username || "Olusteve"}
        </p>
      </div>

      <div className="post-actions flex items-center gap-5 mb-3">
        <span className="action flex items-center gap-1">
          <FaHeart color="gray" /> {/* Like icon */}
          <span>{post.likes || 0}</span> {/* Like count */}
        </span>
        <span className="action flex items-center gap-1">
          <FaComment color="gray" /> {/* Comment icon */}
          <span>{post.comments?.length || 0}</span> {/* Comment count */}
        </span>
      </div>

      <div className="post-buttons flex flex-col items-end gap-2">
        <a
          href="../PromotionAddCardSubscription/index.html"
          className="promote bg-white border border-gray-300 text-green-500 px-4 py-2 rounded-lg flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          Promote
        </a>
        <a
          href="#"
          className="stream bg-white text-green-500 px-4 py-2 rounded-lg flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={e} alt="Stream" className="w-4 h-4" /> Stream{" "}
          {postType === "music" ? "Music" : "Video"}
        </a>
      </div>
    </div>
  );
};

export default Post;