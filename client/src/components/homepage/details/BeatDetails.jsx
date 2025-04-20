import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  MessageSquare,
  ShoppingCart,
  Play,
  Pause,
  ArrowLeft,
  Package,
  Loader,
  Clock,
} from 'lucide-react';
import Navbar from '../../../components/profile/NavBar';
import Sidebar from '../../../components/homepage/Sidebar';
import Overlay from '../../../components/homepage/Overlay';
import BottomNav from '../../../components/homepage/BottomNav';
import { useGetBeatPost } from '../../../../Hooks/beats/useBeats';
import BeatReactionButton from '../../details/BeatReaction';
import useProfile from '../../../../Hooks/useProfile';
import BeatCommentModal from '../../details/BeatComment';


const BeatDetails = React.memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { beat, loading, error, fetchBeatPost } = useGetBeatPost(id);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { profile } = useProfile();

  useEffect(() => {
    if (beat) {
      setIsLiked(false); // Replace with actual like check
    }
  }, [beat]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  console.log(beat);
  

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(prev => !prev);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleLike = () => setIsLiked(prev => !prev);
  const handleShare = () => alert('Share functionality');
  const handleComment = () => alert('Comment functionality');
  const handlePurchase = () => alert('Purchase functionality');
  const handleGoBack = () => navigate(-1);

  const handleNavigateToProfile = () => {
    navigate(`/profile/${beat.post.profile_id}`);
  };

  const availableSupply = beat
    ? beat.post.total_supply - (beat.post.total_buyers || 0)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900/90 flex justify-center items-center">
        <Loader className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-2 text-gray-300">Loading beat...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900/90 flex flex-col justify-center items-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-800 mb-3">Error Loading Beat</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex">
            <button
              onClick={() => fetchBeatPost()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 ml-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!beat) return null;

  return (
    <div className="min-h-screen bg-gray-900/90 text-gray-900">
      <Navbar name="Beat Details" toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${beat.post.cover_photo})` }}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/40 to-transparent flex flex-col justify-end p-6">
          <div className="max-w-4xl mx-auto w-full">
            {/* Beat Title and Artist */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                {beat.post.caption}
              </h1>
              <div 
                onClick={handleNavigateToProfile}
                className="flex items-center group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={beat.post.profile_picture}
                    alt="Artist"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/80"
                  />
                </div>
                <span className="ml-3 text-lg font-medium text-gray-200 group-hover:text-white">
                  {beat.post.username}
                </span>
              </div>
            </div>

            {/* Audio Player Controls */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border mb-7 border-white/10 shadow-sm">
              {/* Progress Bar */}
              <div className="relative h-1.5 bg-gray-700 rounded-full mb-3">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#2D8C72] rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">
                  {formatTime(currentTime)}
                </span>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={toggleAudioPlay}
                    className="p-3 bg-[#2D8C72] rounded-full hover:bg-teal-600 transition transform hover:scale-105 text-white"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-current" />
                    ) : (
                      <Play className="h-5 w-5 fill-current" />
                    )}
                  </button>
                </div>
                <span className="text-xs text-gray-300">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mt-16 px-4 pb-24">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Stats Ribbon with Social Actions */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200">
            {/* Available Supply */}
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="font-medium">{availableSupply}/{beat.post.total_supply}</p>
              </div>
            </div>
            
            {/* Duration */}
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-medium">{formatTime(duration)}</p>
              </div>
            </div>
            
            {/* Like Button */}
         <BeatReactionButton 
              postId={beat.post?.id}
              reactions={beat?.reactions}
              profileId={profile?.id} />
            
            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="flex items-center justify-center space-x-2 group"
            >
              <Share2 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Share</p>
              </div>
            </button>
          </div>

          {/* Description */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">
                About This Beat
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {beat.post.description || "No description provided."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePurchase}
                className="flex-1 flex items-center justify-center py-3 px-6 rounded-lg bg-[#2D8C72] text-white font-medium hover:bg-teal-600 transition transform hover:-translate-y-0.5"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Buy License - ₦{beat.post.amount}
              </button>
            </div>
          </div>

          {/* Comment Button - Now at the bottom */}
          <div className="p-4 border-t border-gray-200 flex justify-center">
           
          
           

              <BeatCommentModal comments={beat?.post?.comments} postId={beat?.post?.id} />
             
        
          </div>
        </div>
      </div>

      <BottomNav activeTab="home" />
      <audio
        ref={audioRef}
        src={beat.post.audio_upload}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
});

export default BeatDetails;