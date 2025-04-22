import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart, Play, Pause, MessageCircle } from "lucide-react";
import { useFetchBeats } from "../../../../Hooks/beats/useBeats";
import Navbar from "../../profile/NavBar";
import BottomNav from "../BottomNav";

export default function UserBeatsPage() {
  const { userId } = useParams();

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
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        My Beats
      </h1>

      {userBeats.length === 0 ? (
        <p className="text-center text-gray-600">You have no beats yet.</p>
      ) : (
        // Full-page scroll-snap container
        <div className="overflow-y-auto snap-y snap-mandatory h-screen">
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
    <div className="snap-start my-13 h-screen overflow-hidden shadow-lg bg-white ">
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

        <div className="relative z-10 p-6 flex flex-col h-full">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <img
                src={beat.image}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white border-opacity-30"
              />
              <div>
                <h4 className="font-medium text-white drop-shadow-md">{beat.username}</h4>
                <p className="text-xs text-white text-opacity-80 drop-shadow-md">{formattedDate}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 my-8">
            <div className="w-48 h-48 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-white/30">
              <img
                src={beat.cover_photo}
                alt="Music Cover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-white drop-shadow-md">
              <h2 className="text-2xl font-bold mb-1">{beat.caption}</h2>
              <p className="text-white/80">{beat.description}</p>
            </div>

            <button
              onClick={togglePlayPause}
              className="bg-[#2D8C72] px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-opacity-90 transition shadow-lg"
            >
              {isPlaying ? (
                <>
                  <Pause className="text-white" size={18} />
                  <span className="text-white">Pause ({timeLeft}s)</span>
                </>
              ) : (
                <>
                  <Play className="text-white" size={18} />
                  <span className="text-white">Play 10s Preview</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-3 gap-4 w-full">
              {[
                { label: "Price", value: `₦${beat.amount}` },
                { label: "Supply", value: beat.total_supply },
                { label: "Buyers", value: beat.total_buyers },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-center shadow-md"
                >
                  <p className="text-white/80 text-xs">{item.label}</p>
                  <p className="text-white font-bold drop-shadow-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between text-white text-opacity-80 text-sm">
            <div className="flex items-center space-x-2 drop-shadow-md">
              <Heart size={18} />
              <span>{beat.likes}</span>
            </div>
            <button className="flex items-center mb-23 px-4 py-2 rounded-full bg-[#2D8C72] text-white text-sm shadow-md">
              View Beat
            </button>
            <div className="flex items-center space-x-2 drop-shadow-md">
              <MessageCircle size={18} />
              <span>{beat.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
