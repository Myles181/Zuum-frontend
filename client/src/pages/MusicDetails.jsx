import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import c from "../assets/image/11429433 1.svg";
import { 
  FaPlay, FaPause, FaStepBackward, FaStepForward, 
  FaVolumeUp, FaVolumeMute, FaHeart, FaRegHeart, 
  FaShare, FaEllipsisH, FaTrash 
} from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../components/profile/NavBar";
import Sidebar from "../components/homepage/Sidebar";
import Overlay from "../components/homepage/Overlay";
import BottomNav from "../components/homepage/BottomNav";
import CommentSection from "../components/details/Comments";
import Spinner from "../components/Spinner";
import useUserProfile from "../../Hooks/useProfile";
import useAudioPosts from "../../Hooks/audioPosts/useCreateAudio";


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

  ;
  

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
            {/* Cover Art with Floating Shadow */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative w-64 h-64 md:w-72 md:h-72 mx-auto mb-8"
            >
              <div className="absolute inset-0 rounded-2xl shadow-xl shadow-gray-400/20"></div>
              <img
                src={data.cover_photo || c}
                alt="Cover"
                className="relative z-10 w-full h-full object-cover rounded-2xl border border-white/20"
              />
              {isOwner && (
                <button
                  onClick={handleDeleteAudio}
                  className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all z-20"
                >
                  <FaTrash className="text-red-500 text-sm" />
                </button>
              )}
            </motion.div>
            
            {/* Track Info */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.caption}</h1>
              <p className="text-gray-600">{data.type}</p>
              
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="inline-block mt-4"
                onClick={() => handleUserClick(data.profile_id)}
              >
                <div className="flex items-center justify-center space-x-2 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-sm cursor-pointer transition-all">
                  <img
                    src={data.profile_picture || c}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-gray-800 font-medium">{data.username}</span>
                </div>
              </motion.div>
            </div>

            {/* Modern Player Controls */}
            <div className=" rounded-2xl shadow-lg p-6 mb-8 border border-white/10 backdrop-blur-sm bg-white/80">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
              
              {/* Main Controls */}
              <div className="flex items-center justify-between mb-4">
                <button className="text-gray-500 hover:text-gray-900 transition-colors p-2">
                  <FaStepBackward className="text-xl" />
                </button>
                
                <motion.button
                  onClick={togglePlayPause}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  {isPlaying ? (
                    <FaPause className="text-xl" />
                  ) : (
                    <FaPlay className="text-xl ml-0.5" />
                  )}
                </motion.button>
                
                <button className="text-gray-500 hover:text-gray-900 transition-colors p-2">
                  <FaStepForward className="text-xl" />
                </button>
              </div>
              
              {/* Audio element */}
              <audio
                ref={audioRef}
                src={data.audio_upload}
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={() => setDuration(audioRef.current.duration || 0)}
                className="hidden"
              />
              
              {/* Secondary Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                <div className="flex items-center space-x-4">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    {isLiked ? (
                      <FaHeart className="text-red-500 text-xl" />
                    ) : (
                      <FaRegHeart className="text-xl" />
                    )}
                  </motion.button>
                  
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <FaShare className="text-xl" />
                  </motion.button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={toggleMute}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {isMuted ? (
                      <FaVolumeMute className="text-xl" />
                    ) : (
                      <FaVolumeUp className="text-xl" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Streaming Platforms - Modern Card */}
            <div className=" rounded-2xl shadow-lg p-6 mb-8 border border-white/10 backdrop-blur-sm bg-white/80">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Streaming Platforms</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.spotify && (
                  <motion.a 
                    whileHover={{ y: -2 }}
                    href={data.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200/70 rounded-xl p-3 flex items-center justify-center transition-all"
                  >
                    <span className="text-sm font-medium">Spotify</span>
                  </motion.a>
                )}
                {data.apple_music && (
                  <motion.a 
                    whileHover={{ y: -2 }}
                    href={data.apple_music}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200/70 rounded-xl p-3 flex items-center justify-center transition-all"
                  >
                    <span className="text-sm font-medium">Apple Music</span>
                  </motion.a>
                )}
                {data.youtube_music && (
                  <motion.a 
                    whileHover={{ y: -2 }}
                    href={data.youtube_music}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200/70 rounded-xl p-3 flex items-center justify-center transition-all"
                  >
                    <span className="text-sm font-medium">YouTube Music</span>
                  </motion.a>
                )}
                {/* Add other platforms similarly */}
              </div>
            </div>

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
    </div>
  );
};

export default MusicDetailsPage;