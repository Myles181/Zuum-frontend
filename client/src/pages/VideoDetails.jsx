import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import c from "../assets/image/11429433 1.svg";
import { FaHeart, FaRegHeart, FaShare, FaRegShareSquare, FaRocket, FaRegPaperPlane } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import { IoRocketOutline, IoRocketSharp } from 'react-icons/io5';

import Navbar from '../components/profile/NavBar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import BottomNav from '../components/homepage/BottomNav';
import Spinner from '../components/Spinner';
import { useGetVideoPost } from '../../Hooks/videoPosts/useCreateVideo';
import CommentSection from '../components/details/VideoComments';

const VideoDetails = () => {
  const { postId } = useParams();
  const { data, loading, error } = useGetVideoPost(postId);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isShared, setIsShared] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setLikeCount(data.likes || 0);
      setIsLiked(data.is_liked || false);
    }
  }, [data]);

 
  useEffect(() => {
    if (isPlaying) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(timeout);
    }
    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [isPlaying, currentTime]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || 0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    setShowControls(true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      videoRef.current.volume = volume;
    } else {
      videoRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  const handleUserClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const showControlsHandler = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
  };


  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    // Here you would typically call your API to like/unlike the post
  };

  const handleShare = () => {
    setIsShared(!isShared);
    // Here you would implement your share functionality
    // For example: navigator.share() or opening a share dialog
  };

  const handlePromote = () => {
    setIsPromoted(!isPromoted);
    // Here you would implement your promote functionality
  };

  return (
    <div className="bg-gray-100 min-h-screen mb-15 mt-16">
      <Navbar name={"Details"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="max-w-7xl mx-auto px-0">
        {loading && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <Spinner />
          </div>
        )}
        
        {error && <p className="text-red-500 text-center py-10">{error}</p>}
        
        {data && (
          <div className="flex flex-col lg:flex-row ">
            {/* Main Video Content (Left Column) */}
            <div className="w-full">
              {/* Video Player */}
              <div 
                className="relative bg-black"
                onMouseMove={showControlsHandler}
                onMouseLeave={() => isPlaying && setShowControls(false)}
              >
                <video
                  ref={videoRef}
                  src={data.video_upload}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedData={() => setDuration(videoRef.current.duration)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={togglePlayPause}
                  className="w-full aspect-video"
                  autoPlay
                  muted={isMuted}
                />
                
                {/* Custom Video Controls */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                >
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600"
                    />
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button onClick={togglePlayPause} className="text-white">
                        {isPlaying ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                        )}
                      </button>
                      
                      <div className="flex items-center space-x-2 text-white text-sm">
                        <span>{formatTime(currentTime)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      
                      <button onClick={toggleMute} className="text-white">
                        {isMuted || volume === 0 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : volume > 0.5 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button onClick={handleFullscreen} className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a1 1 0 011-1h2a1 1 0 110 2H6a1 1 0 01-1-1zm5-1a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 00-1-1zM5 13v2a1 1 0 001 1h2a1 1 0 110-2H6a1 1 0 00-1-1zm10-2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Play/Pause overlay */}
                {!showControls && !isPlaying && (
                  <button 
                    onClick={togglePlayPause}
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/80 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </button>
                )}
              </div>
              </div>
              
              
            
            {/* Video Info */}
            <div className="bg-white p-4">
              <h1 className="text-xl font-bold">{data.caption}</h1>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div 
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => handleUserClick(data.profile_id)}
                >
                  <img
                    src={data.profile_picture || c}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{data.username}</h3>
                  </div>
                </div>
                
                <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm font-medium">
                  Follow
                </button>
              </div>
              
              {/* Like, Share, Promote Buttons */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                <button 
                  onClick={handleLike}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-500 transition-colors"
                >
                  {isLiked ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <FaRegHeart className="text-xl" />
                  )}
                  <span>{likeCount}</span>
                </button>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition-colors"
                >
                  {isShared ? (
                    <FaShare className="text-blue-500 text-xl" />
                  ) : (
                    <FiShare2 className="text-xl" />
                  )}
                  <span>Share</span>
                </button>
                
                <button 
                  onClick={handlePromote}
                  className="flex items-center space-x-1 text-gray-700 hover:text-purple-500 transition-colors"
                >
                  {isPromoted ? (
                    <IoRocketSharp className="text-purple-500 text-xl" />
                  ) : (
                    <IoRocketOutline className="text-xl" />
                  )}
                  <span>Promote</span>
                </button>
              </div>
              
              <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-800">{data.description || "No description provided"}</p>
              </div>
            </div>
            
            {/* Comments Section */}
            <CommentSection comments={data.comments} postId={postId} />
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default VideoDetails;