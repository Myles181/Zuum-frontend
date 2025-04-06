import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import c from "../assets/image/11429433 1.svg";
import { FaHeart, FaRegHeart, FaEllipsisH, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../components/profile/NavBar";
import Sidebar from "../components/homepage/Sidebar";
import Overlay from "../components/homepage/Overlay";
import BottomNav from "../components/homepage/BottomNav";
import CommentSection from "../components/details/Comments";
import Spinner from "../components/Spinner";
import useUserProfile from "../../Hooks/useProfile";
import useAudioPosts from "../../Hooks/audioPosts/useCreateAudio";
import ReactionButton from "../components/details/Reactions";
import AudioPlayerControls from "../components/homepage/details/AudioControls";
import TrackHeader from "../components/homepage/details/TrackHeader";
import StreamingPlatforms from "../components/homepage/details/StreamingPlatforms";

const MusicDetailsPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { loading, error, posts } = useAudioPosts(1, 10, postId);
  const data = posts.length > 0 ? posts[0] : null;
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { profile } = useUserProfile();
  const isOwner = profile?.id === data?.profile_id;

  console.log(data);
  

  useEffect(() => {
    if (data) {
      setIsLiked(data.is_liked || false);
    }
  }, [data]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleUserClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const handleDeleteAudio = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this audio post?");
    if (confirmDelete) {
      // await deleteAudioPost(postId);
      navigate("/profile");
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Navbar name={"Details"} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      
      <div className="pt-20 pb-32 px-4 max-w-4xl mx-auto">
        {loading && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-sm">
            <Spinner />
          </div>
        )}
        
        {error && <p className="text-red-500 text-center py-10">{error}</p>}
        
        {data && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col"
          >
            <TrackHeader 
              data={data}
              isOwner={isOwner}
              handleDeleteAudio={handleDeleteAudio}
              handleUserClick={handleUserClick}
              c={c}
            />

            <AudioPlayerControls
            data={data}
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
              currentTime={currentTime}
              duration={duration}
              handleSeek={handleSeek}
              volume={volume}
              isMuted={isMuted}
              toggleMute={toggleMute}
              handleVolumeChange={handleVolumeChange}
              formatTime={formatTime}
              postId={postId}
              reactions={data.reactions}
              userId={profile?.id}
            />

            {/* Reactions Section */} 
            {/* edited out */}
            {/* {data.reactions && (
              <div className="mb-8">
                <ReactionButton reactions={data.reactions} postId={postId} />
              </div>
            )} */}

            <StreamingPlatforms data={data} />

            {/* Description - Glass Morphism Card */}
            {data.description && (
              <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8 border border-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Track</h3>
                <p className="text-gray-700 leading-relaxed">{data.description}</p>
              </div>
            )}

            {/* Comments Section */}
            <CommentSection comments={data.comments} postId={postId} />
          </motion.div>
        )}
      </div>
      
      <BottomNav />

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={data?.audio_upload}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => setDuration(audioRef.current?.duration || 0)}
        className="hidden"
      />
    </div>
  );
};

export default MusicDetailsPage;