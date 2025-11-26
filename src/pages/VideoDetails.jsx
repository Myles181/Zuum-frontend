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
import useProfile, { useUserProfile } from '../../Hooks/useProfile';
import ReactionButton from '../components/details/VideoReactions';
import VideoInfo from '../components/homepage/details/VideoInfo';
import VideoPlayer from '../components/homepage/details/VideoPlayer';

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
  const { profile, loading: authLoading } = useProfile();
  
  
  const navigate = useNavigate();

  console.log(data);

  console.log(profile);
  
  

 

 
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



  const handleShare = () => {
    setIsShared(!isShared);
    // Here you would implement your share functionality
    // For example: navigator.share() or opening a share dialog
  };

  const handlePromote = () => {
    setIsPromoted(!isPromoted);
    // Here you would implement your promote functionality
  };

  console.log(profile?.id);
  

  return (
    <div className="bg-gray-100 min-h-screen mb-15 mt-16">
      <Navbar name={"Details"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="max-w-7xl mx-auto px-0">
        {loading && <Spinner />}
        {error && <p className="text-red-500 text-center py-10">{error}</p>}
        
        {data && (
          <div className="flex flex-col lg:flex-row">
            <div className="w-full">
              <VideoPlayer 
                videoUrl={data.video_upload}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                onPlayPause={togglePlayPause}
                isPlaying={isPlaying}
              />
              
              <VideoInfo
                data={data}
                profile={profile}
                onUserClick={handleUserClick}
                onShare={handleShare}
                onPromote={handlePromote}
                isShared={isShared}
                isPromoted={isPromoted}
              />
              
              <CommentSection comments={data.comments} postId={postId} />
            </div>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default VideoDetails;