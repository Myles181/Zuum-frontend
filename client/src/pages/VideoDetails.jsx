import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom'; // To get the post ID from the URL
import c from "../assets/image/11429433 1.svg"; // Fallback image

import Navbar from '../components/profile/NavBar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import BottomNav from '../components/homepage/BottomNav';
import CommentSection from '../components/details/Comments';
import ReactionsSection from '../components/details/Reactions';
import Spinner from '../components/Spinner';
import { useGetVideoPost } from '../../Hooks/videoPosts/useCreateVideo';

const VideoDetails = () => {
  const { postId } = useParams(); // Get the post ID from the URL
  const { data, loading, error } = useGetVideoPost(postId); // Fetch the video post details
  const [showComments, setShowComments] = useState(false); // State to manage comments visibility
  const videoRef = useRef(null); // Reference to the video element
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play/pause
  const [currentTime, setCurrentTime] = useState(0); // State to track current playback time
  const [duration, setDuration] = useState(0); // State to track total duration
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log(data);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update current time and duration
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
  };

  // Format time (e.g., 01:23)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle seek
  const handleSeek = (e) => {
    const seekTime = e.target.value;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div className='mb-10'>
      <Navbar name={"Details"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="video-details-page flex justify-center mt-10">
        <div className="video-details bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
          {/* Display loading state */}
          {loading && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
              <Spinner /> {/* Show the spinner while loading */}
            </div>
          )}
          {/* Display error message */}
          {error && <p className="text-red-500">{error}</p>}
          {/* Display video post details */}
          {data && (
            <div className="space-y-4">
              {/* Video Player */}
              <div className="video-player relative">
                <video
                  ref={videoRef}
                  src={data.video_upload}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedData={() => setDuration(videoRef.current.duration)}
                  className="w-full h-64 object-cover rounded-lg"
                  controls={false} // Disable default controls
                />
                <button
                  onClick={togglePlayPause}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
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
              </div>
              {/* Caption */}
              <h1 className="text-2xl font-bold">{data.caption}</h1>
              {/* User Info */}
              <div className='flex justify-start items-center gap-3'>
                <img
                  src={data.profile_picture || c}
                  alt="Profile Picture"
                  className="w-10 h-10 rounded-full border-4 border-white shadow-lg"
                />
                <h3 className="ml-2">{data.username}</h3>
              </div>
              {/* Type */}
              <p className="text-sm text-gray-500">{data.type}</p>
              {/* Custom Video Player Controls */}
              <div className="video-controls mt-4 bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <button
                    onClick={togglePlayPause}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
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
                  {data.youtube && (
                    <a
                      href={data.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      YouTube
                    </a>
                  )}
                  {data.vimeo && (
                    <a
                      href={data.vimeo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Vimeo
                    </a>
                  )}
                </div>
              </div>
              {/* Comments Section */}
              {/* <CommentSection comments={data.comments} postId={postId} />
              {/* Reactions Section */}
              {/* <ReactionsSection reactions={data.reactions} />  */}
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

export default VideoDetails;