// import React, { useState, useRef, useEffect } from "react";
// import { 
//   FaLock, FaPlay, FaPause, FaStepBackward, FaStepForward, 
//   FaVolumeUp, FaVolumeMute, FaHeart, FaRegHeart, 
//   FaShareAlt, FaEllipsisH, FaShoppingCart, FaClock,
//   FaComment, FaMusic, FaSpotify, FaApple, FaYoutube
// } from "react-icons/fa";
// import { SiSoundcloud } from "react-icons/si";
// import { motion, AnimatePresence } from "framer-motion";

// const LockedMusicPlayer = ({ post }) => {
//   const [isLocked, setIsLocked] = useState(true);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(0.7);
//   const [isMuted, setIsMuted] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(10);
//   const [isLiked, setIsLiked] = useState(false);
//   const audioRef = useRef(null);
//   const timerRef = useRef(null);

//   // Default data
//   const defaultData = {
//     username: "Olusteve",
//     artist: "Artist",
//     caption: "Untitled Track",
//     likes: 243,
//     comments: 56,
//     cover_photo: "https://source.unsplash.com/random/600x600/?album,cover",
//     profile_picture: "https://source.unsplash.com/random/100x100/?artist",
//     price: "2.99",
//     duration: "3:45",
//     type: "Single",
//     description: "This captivating track blends electronic elements with organic instrumentation, creating a unique sonic experience that transports listeners to another dimension.",
//     bpm: 128,
//     key: "D Minor",
//     releaseDate: "May 2023",
//     tags: ["Electronic", "Ambient", "Chill"],
//     streamingLinks: {
//       spotify: "#",
//       apple: "#",
//       youtube: "#",
//       soundcloud: "#"
//     }
//   };

//   post = { ...defaultData, ...post };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const handleLockClick = () => {
//     setIsLocked(false);
//   };

//   const togglePlayPause = () => {
//     if (isPlaying) {
//       audioRef.current.pause();
//       clearInterval(timerRef.current);
//     } else {
//       audioRef.current.play();
//       timerRef.current = setInterval(() => {
//         setTimeLeft(prev => {
//           if (prev <= 1) {
//             clearInterval(timerRef.current);
//             setIsPlaying(false);
//             audioRef.current.pause();
//             audioRef.current.currentTime = 0;
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const handleTimeUpdate = () => {
//     setCurrentTime(audioRef.current.currentTime);
//     if (!duration) setDuration(audioRef.current.duration || 0);
//   };

//   const handleSeek = (e) => {
//     const seekTime = e.target.value;
//     audioRef.current.currentTime = seekTime;
//     setCurrentTime(seekTime);
//   };

//   const handleBuyClick = () => {
//     alert(`Purchased "${post.caption}" for $${post.price}`);
//   };

//   useEffect(() => {
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0;
//       }
//       clearInterval(timerRef.current);
//     };
//   }, []);

//   return (
//     <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden font-sans">
//       {/* Audio Element */}
//       <audio 
//         ref={audioRef} 
//         src={post.audio_upload || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
//         onTimeUpdate={handleTimeUpdate}
//         onLoadedData={() => setDuration(audioRef.current.duration || 0)}
//         onEnded={() => {
//           setIsPlaying(false);
//           clearInterval(timerRef.current);
//           setTimeLeft(10);
//         }}
//       />

//       <AnimatePresence>
//         {isLocked ? (
//           /* Locked State - Preview Mode */
//           <motion.div 
//             key="locked"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="relative h-full min-h-[500px]"
//           >
//             {/* Blurred background */}
//             <div
//               className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-md opacity-70"
//               style={{ backgroundImage: `url(${post.cover_photo})` }}
//             />
//             <div className="absolute inset-0 bg-black/30" />
            
//             {/* Content */}
//             <div className="relative z-10 p-6 flex flex-col h-full">
//               <div className="flex justify-between items-start">
//                 <div className="flex items-center space-x-3">
//                   <img
//                     src={post.profile_picture}
//                     alt="Profile"
//                     className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
//                   />
//                   <div>
//                     <h4 className="font-medium text-white">{post.username}</h4>
//                     <p className="text-xs text-white/80">{post.artist}</p>
//                   </div>
//                 </div>
                
//                 <motion.button 
//                   onClick={handleLockClick}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
//                 >
//                   <FaLock className="text-white text-lg" />
//                 </motion.button>
//               </div>
              
//               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
//                 <motion.div 
//                   initial={{ scale: 0.95 }}
//                   animate={{ scale: 1 }}
//                   className="w-48 h-48 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-white/20"
//                 >
//                   <img
//                     src={post.cover_photo}
//                     alt="Music Cover"
//                     className="w-full h-full object-cover"
//                   />
//                 </motion.div>
                
//                 <div>
//                   <h2 className="text-2xl font-bold text-white mb-1">{post.caption}</h2>
//                   <p className="text-white/80">{post.type} • {post.duration}</p>
//                 </div>
                
//                 <motion.button
//                   onClick={togglePlayPause}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full flex items-center space-x-2"
//                 >
//                   {isPlaying ? (
//                     <>
//                       <FaPause className="text-white" />
//                       <span className="text-white/90">Pause Preview</span>
//                     </>
//                   ) : (
//                     <>
//                       <FaPlay className="text-white" />
//                       <span className="text-white/90">Play 10s Preview</span>
//                     </>
//                   )}
//                 </motion.button>
//               </div>
              
//               <div className="flex justify-between text-white/80 text-sm">
//                 <div className="flex items-center space-x-1">
//                   <FaRegHeart />
//                   <span>{post.likes}</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <FaComment />
//                   <span>{post.comments}</span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         ) : (
//           /* Unlocked State - Full Player */
//           <motion.div 
//             key="unlocked"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="relative"
//           >
//             {/* Album Art Header */}
//             <div className="relative h-64 w-full overflow-hidden">
//               <img
//                 src={post.cover_photo}
//                 alt="Music Cover"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
              
//               {/* Back button */}
//               <motion.button 
//                 onClick={() => setIsLocked(true)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="absolute top-4 left-4 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </motion.button>
              
//               {/* Track Info */}
//               <div className="absolute bottom-6 left-6 right-6">
//                 <div className="flex justify-between items-end">
//                   <div>
//                     <h1 className="text-2xl font-bold text-white">{post.caption}</h1>
//                     <p className="text-white/80">{post.artist}</p>
//                   </div>
//                   <div className="text-white/70 text-sm bg-black/30 px-2 py-1 rounded">
//                     {post.duration}
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Player Controls */}
//             <div className="p-6">
//               {/* Progress Bar */}
//               <div className="mb-6">
//                 <div className="flex justify-between text-xs text-gray-500 mb-1">
//                   <span>{formatTime(currentTime)}</span>
//                   <span className="text-[#2D8C72] font-medium">
//                     {timeLeft}s preview remaining
//                   </span>
//                   <span>{formatTime(duration)}</span>
//                 </div>
//                 <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                   <motion.div 
//                     className="absolute top-0 left-0 h-full bg-[#2D8C72] rounded-full"
//                     style={{ width: `${(currentTime / duration) * 100}%` }}
//                     transition={{ duration: 0.1 }}
//                   />
//                 </div>
//               </div>
              
//               {/* Main Controls */}
//               <div className="flex items-center justify-center space-x-8 mb-8">
//                 <motion.button 
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   className="text-gray-500 hover:text-gray-700 p-2"
//                 >
//                   <FaStepBackward className="text-xl" />
//                 </motion.button>
                
//                 <motion.button
//                   onClick={togglePlayPause}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-[#2D8C72] text-white p-4 rounded-full shadow-lg hover:bg-[#247a61] transition-all"
//                 >
//                   {isPlaying ? (
//                     <FaPause className="text-xl" />
//                   ) : (
//                     <FaPlay className="text-xl ml-0.5" />
//                   )}
//                 </motion.button>
                
//                 <motion.button 
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   className="text-gray-500 hover:text-gray-700 p-2"
//                 >
//                   <FaStepForward className="text-xl" />
//                 </motion.button>
//               </div>
              
//               {/* Purchase Section */}
//               <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 className="bg-gray-50 rounded-xl p-4 mb-6"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <div>
//                     <p className="text-sm text-gray-500">Full Track Price</p>
//                     <p className="text-2xl font-bold text-gray-800">${post.price}</p>
//                   </div>
//                   <motion.button 
//                     onClick={handleBuyClick}
//                     whileHover={{ scale: 1.03 }}
//                     whileTap={{ scale: 0.97 }}
//                     className="flex items-center space-x-2 bg-[#2D8C72] hover:bg-[#247a61] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
//                   >
//                     <FaShoppingCart />
//                     <span>Buy Now</span>
//                   </motion.button>
//                 </div>
//                 <p className="text-xs text-gray-400">Preview will automatically stop after 10 seconds</p>
//               </motion.div>
              
//               {/* Track Details */}
//               <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.1 }}
//                 className="mb-6"
//               >
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                   <FaMusic className="mr-2 text-[#2D8C72]" />
//                   About This Track
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed mb-4">{post.description}</p>
                
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="bg-gray-100 p-3 rounded-lg">
//                     <p className="text-xs text-gray-500 uppercase tracking-wider">BPM</p>
//                     <p className="font-medium">{post.bpm}</p>
//                   </div>
//                   <div className="bg-gray-100 p-3 rounded-lg">
//                     <p className="text-xs text-gray-500 uppercase tracking-wider">Key</p>
//                     <p className="font-medium">{post.key}</p>
//                   </div>
//                   <div className="bg-gray-100 p-3 rounded-lg">
//                     <p className="text-xs text-gray-500 uppercase tracking-wider">Released</p>
//                     <p className="font-medium">{post.releaseDate}</p>
//                   </div>
//                   <div className="bg-gray-100 p-3 rounded-lg">
//                     <p className="text-xs text-gray-500 uppercase tracking-wider">Tags</p>
//                     <div className="flex flex-wrap gap-1 mt-1">
//                       {post.tags.map((tag, i) => (
//                         <span key={i} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
              
//               {/* Streaming Platforms */}
//               <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="mb-6"
//               >
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                   <FaShareAlt className="mr-2 text-[#2D8C72]" />
//                   Streaming Platforms
//                 </h3>
//                 <div className="grid grid-cols-2 gap-3">
//                   <a href={post.streamingLinks.spotify} className="bg-[#1DB954] hover:bg-[#1aa34a] text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors">
//                     <FaSpotify className="mr-2" />
//                     Spotify
//                   </a>
//                   <a href={post.streamingLinks.apple} className="bg-[#FC3C44] hover:bg-[#e6353d] text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors">
//                     <FaApple className="mr-2" />
//                     Apple Music
//                   </a>
//                   <a href={post.streamingLinks.youtube} className="bg-[#FF0000] hover:bg-[#e60000] text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors">
//                     <FaYoutube className="mr-2" />
//                     YouTube
//                   </a>
//                   <a href={post.streamingLinks.soundcloud} className="bg-[#FF5500] hover:bg-[#e64d00] text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors">
//                     <SiSoundcloud className="mr-2" />
//                     SoundCloud
//                   </a>
//                 </div>
//               </motion.div>
              
//               {/* Social Actions */}
//               <motion.div 
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className="flex items-center justify-between border-t border-gray-100 pt-4"
//               >
//                 <motion.button 
//                   onClick={() => setIsLiked(!isLiked)}
//                   whileTap={{ scale: 0.9 }}
//                   className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
//                 >
//                   {isLiked ? <FaHeart /> : <FaRegHeart />}
//                   <span>{post.likes}</span>
//                 </motion.button>
                
//                 <motion.button 
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <FaComment />
//                   <span>{post.comments}</span>
//                 </motion.button>
                
//                 <motion.button 
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <FaShareAlt />
//                   <span>Share</span>
//                 </motion.button>
                
//                 <motion.button 
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <FaEllipsisH />
//                 </motion.button>
//               </motion.div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default LockedMusicPlayer;