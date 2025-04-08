import React, { useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const AudioPlayerControls = ({
  isActive,
  audioSrc,
  setAudioRef,
  onTimeUpdate,
  onLoadedMetadata,
  currentTime,
  duration,
  showTapIcon,
  tapIconType
}) => {
  const audioRef = (el) => {
    setAudioRef(el);
  };

  return (
    <>
      {/* hidden audio */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />
      
      {/* tap icon */}
      {showTapIcon && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          {tapIconType === "play" ? (
            <FaPlay className="text-white text-6xl bg-black/50 rounded-full p-4" />
          ) : (
            <FaPause className="text-white text-6xl bg-black/50 rounded-full p-4" />
          )}
        </div>
      )}
      
      {/* bottom progress bar */}
      <div className="absolute bottom-13 left-0 w-full h-1 bg-gray-600 z-20">
        <div
          className="h-full bg-white"
          style={{
            width: duration ? `${(currentTime / duration) * 100}%` : "0%",
          }}
        />
      </div>
    </>
  );
};

export default React.memo(AudioPlayerControls);