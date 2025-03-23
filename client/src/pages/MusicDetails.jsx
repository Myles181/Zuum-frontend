import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import c from "../assets/image/11429433 1.svg"; // Fallback image
import Navbar from "../components/profile/NavBar";
import Sidebar from "../components/homepage/Sidebar";
import Overlay from "../components/homepage/Overlay";
import BottomNav from "../components/homepage/BottomNav";
import CommentSection from "../components/details/Comments";
import ReactionsSection from "../components/details/Reactions";
import Spinner from "../components/Spinner";
import useUserProfile from "../../Hooks/useProfile";
import useAudioPosts from "../../Hooks/audioPosts/useCreateAudio";
import { FaTrash } from "react-icons/fa"; // Import trash icon

const MusicDetailsPage = () => {
  const { postId } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate

  // Use the custom hook to fetch the specific audio post
  const { loading, error, posts } = useAudioPosts(1, 10, postId);

  // Extract the post data (since we're fetching a single post, posts[0] will contain the data)
  const data = posts.length > 0 ? posts[0] : null;

  const [showComments, setShowComments] = useState(false); // State to manage comments visibility
  const audioRef = useRef(null); // Reference to the audio element
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play/pause
  const [currentTime, setCurrentTime] = useState(0); // State to track current playback time
  const [duration, setDuration] = useState(0); // State to track total duration
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile } = useUserProfile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update current time and duration
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  // Format time (e.g., 01:23)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle seek
  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Handle audio post deletion
  const handleDeleteAudio = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this audio post?");
    if (confirmDelete) {
      // Call the delete function (you'll need to implement this)
      // await deleteAudioPost(postId);
      // Redirect to the profile page after successful deletion
      navigate("/profile"); // Replace '/profile' with your actual profile route
    }
  };

  // Check if the authenticated user is the owner of the post
  const isOwner = profile?.id === data?.profile_id;

  // Handle profile image click
  const handleProfileClick = () => {
    if (data?.profile_id) {
      navigate(`/profile/${data.profile_id}`); // Redirect to the author's profile
    }
  };

  return (
    <div className="mb-10 mt-20">
      <Navbar name={"Details"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="music-details-page flex justify-center mt-10">
        <div className="music-details bg-white rounded-lg shadow-md p-6 max-w-2xl w-full relative">
          {/* Display loading state */}
          {loading && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
              <Spinner /> {/* Show the spinner while loading */}
            </div>
          )}
          {/* Display error message */}
          {error && <p className="text-red-500">{error}</p>}
          {/* Display audio post details */}
          {data && (
            <div className="space-y-4">
              {/* Delete Button (Visible only to the owner) */}
              {isOwner && (
                <button
                  onClick={handleDeleteAudio}
                  disabled={loading}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition-colors"
                >
                  <FaTrash className="w-6 h-6" /> {/* Use trash icon */}
                </button>
              )}
              {/* Cover Image */}
              <img
                src={data.cover_photo || c} // Use a fallback image if cover_photo is not available
                alt="Cover"
                className="cover w-full h-64 object-cover rounded-lg"
              />
              <h1 className="text-2xl font-bold">{data.caption}</h1>
              {/* Caption */}
              <div className="flex justify-start items-center gap-3">
                <img
                  src={data.profile_picture || c}
                  alt="Profile Picture"
                  className="w-10 h-10 rounded-full border-4 border-white shadow-lg cursor-pointer"
                  onClick={handleProfileClick} // Redirect to profile on click
                />
                <h3 className="ml-2">{data.username}</h3>
              </div>
              {/* Type */}
              <p className="text-sm text-gray-500">{data.type}</p>
              {/* Custom Audio Player */}
              <div className="audio-player mt-4 bg-green-50 p-4 rounded-lg">
                <audio
                  ref={audioRef}
                  src={data.audio_upload}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedData={() => setDuration(audioRef.current.duration)}
                  className="hidden"
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={togglePlayPause}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                  >
                    {isPlaying ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 mx-4">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
              </div>
              {/* Streaming Links */}
              <div className="streaming-links mt-6 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Streaming Links</h2>
                <div className="space-y-2">
                  {data.boomplay && (
                    <a
                      href={data.boomplay}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Boomplay
                    </a>
                  )}
                  {data.apple_music && (
                    <a
                      href={data.apple_music}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Apple Music
                    </a>
                  )}
                  {data.spotify && (
                    <a
                      href={data.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Spotify
                    </a>
                  )}
                  {data.audiomark && (
                    <a
                      href={data.audiomark}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Audiomark
                    </a>
                  )}
                  {data.youtube_music && (
                    <a
                      href={data.youtube_music}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      YouTube Music
                    </a>
                  )}
                </div>
              </div>
              <CommentSection comments={data.comments} postId={postId} />
              <ReactionsSection reactions={data.reactions} />
              {/* Shares Section */}
              <div className="shares mt-6 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Shares</h2>
                {data.shares && data.shares.length > 0 ? (
                  <ul className="space-y-2">
                    {data.shares.map((share) => (
                      <li key={share.id} className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-gray-800">Shared by: {share.username}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No shares yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default MusicDetailsPage;