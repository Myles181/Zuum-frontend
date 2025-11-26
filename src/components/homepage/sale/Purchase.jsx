import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart, Play, Pause, MessageCircle } from "lucide-react";
import { useFetchBeats } from "../../../../Hooks/beats/useBeats";
import useProfile from "../../../../Hooks/useProfile";
import Navbar from "../../profile/NavBar";
import BottomNav from "../BottomNav";
import a from "../../../assets/icons/Mask group1.svg";

export default function UserBeatsPage() {
  const { userId } = useParams();
  const { profile: authProfile } = useProfile();

  // Debug: Log the profile structure
  console.log("Auth Profile:", authProfile);

  const {
    loading: beatsLoading,
    error: beatsError,
    beats,
  } = useFetchBeats({ initialPage: 1, initialLimit: 20 });

  const userBeats = Array.isArray(beats)
    ? beats.filter((beat) => beat.profile_id === Number(userId))
    : [];

  if (beatsLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#2D8C72] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (beatsError) {
    return <div>Error loading beats: {beatsError}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-gray-50">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800 px-4">
        My Beats
      </h1>

      {userBeats.length === 0 ? (
        <p className="text-center text-gray-600 px-4">You have no beats yet.</p>
      ) : (
        // Full-page scroll-snap container
        <div className="overflow-y-auto snap-y snap-mandatory h-screen w-full">
          {userBeats.map((beat) => (
            <BeatItem key={beat.id} beat={beat} />
          ))}
        </div>
      )}
    </div>
  );
}

function BeatItem({ beat }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const { profile: authProfile } = useProfile();

  // Debug: Log the profile structure
  console.log("BeatItem Auth Profile:", authProfile);
  console.log("Available properties:", Object.keys(authProfile || {}));

  const formattedDate = new Date(beat.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      clearInterval(timerRef.current);
    } else {
      audioRef.current.play();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsPlaying((prev) => !prev);
  };

  return (
    // Full-page snap boundary with vertical margin
    <div className="snap-start h-screen overflow-hidden shadow-lg bg-white w-full">
      <Navbar name="Beats" />
      <audio
        ref={audioRef}
        src={beat.audio_upload}
        onEnded={() => {
          clearInterval(timerRef.current);
          setTimeLeft(10);
          setIsPlaying(false);
        }}
      />

      <div className="relative h-full">  
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${beat.cover_photo})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 p-4 sm:p-6 flex flex-col h-full">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img
                src={authProfile?.image || authProfile?.profile_picture || a}
                alt="Profile"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white border-opacity-30"
              />
              <div>
                <h4 className="font-medium text-white drop-shadow-md text-sm sm:text-base">{beat.username}</h4>
                <p className="text-xs text-white text-opacity-80 drop-shadow-md">{formattedDate}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 my-4 sm:my-8">
            <div className="w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-white/30">
              <img
                src={beat.cover_photo}
                alt="Music Cover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-white drop-shadow-md px-2">
              <h2 className="text-lg sm:text-2xl font-bold mb-1">{beat.caption}</h2>
              <p className="text-white/80 text-sm sm:text-base">{beat.description}</p>
            </div>

            <button
              onClick={togglePlayPause}
              className="bg-[#2D8C72] px-4 sm:px-6 py-2 sm:py-2 rounded-full flex items-center space-x-2 hover:bg-opacity-90 transition shadow-lg text-sm sm:text-base"
            >
              {isPlaying ? (
                <>
                  <Pause className="text-white" size={16} />
                  <span className="text-white">Pause ({timeLeft}s)</span>
                </>
              ) : (
                <>
                  <Play className="text-white" size={16} />
                  <span className="text-white">Play 10s Preview</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full px-2">
              {[
                { label: "Price", value: `₦${beat.amount}` },
                { label: "Buyers", value: beat.total_buyers },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-2 sm:p-3 text-center shadow-md"
                >
                  <p className="text-white/80 text-xs">{item.label}</p>
                  <p className="text-white font-bold drop-shadow-sm text-sm sm:text-base">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between text-white text-opacity-80 text-sm mb-16 sm:mb-20 px-2">
            <div className="flex items-center space-x-2 drop-shadow-md">
              <Heart size={16} />
              <span className="text-xs sm:text-sm">{beat.likes}</span>
            </div>
            <button className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-[#2D8C72] text-white text-sm sm:text-base font-semibold shadow-lg hover:bg-[#256b58] hover:scale-105 transform transition-all duration-200 animate-pulse">
              View Beat
            </button>
            <div className="flex items-center space-x-2 drop-shadow-md">
              <MessageCircle size={16} />
              <span className="text-xs sm:text-sm">{beat.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
