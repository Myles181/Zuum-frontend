import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Spinner";

const TikTokScroll = ({ items, loadMore, hasMore, loading, onLike, renderItem }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRefs = useRef({});
  const scrollObserver = useRef(null);
  const loadObserver = useRef(null);
  
  // Track audio playback state for each post
  const [playbackStates, setPlaybackStates] = useState({});

  // Reset audio refs when items change
  useEffect(() => {
    // Keep audioRefs clean without unnecessary references
    const validIds = items.map(item => `${item.type}-${item.id}`);
    const newAudioRefs = {};
    
    Object.keys(audioRefs.current).forEach(key => {
      if (validIds.includes(key)) {
        newAudioRefs[key] = audioRefs.current[key];
      }
    });
    
    audioRefs.current = newAudioRefs;
  }, [items]);

  // Infinite load trigger
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (loadObserver.current) loadObserver.current.disconnect();
      loadObserver.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold: 0.5 }
      );
      if (node) loadObserver.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  // Handle scroll to change active index
  useEffect(() => {
    if (!containerRef.current) return;
    
    const options = { 
      root: containerRef.current,
      threshold: 0.7,
      rootMargin: "0px 0px -50% 0px"
    };
    
    if (scrollObserver.current) {
      scrollObserver.current.disconnect();
    }
    
    scrollObserver.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const newIndex = Number(entry.target.dataset.index);
          const newItemId = `${items[newIndex].type}-${items[newIndex].id}`;
          
          // If the index changed, handle audio transitions
          if (newIndex !== currentIndex) {
            // Pause all other audios
            Object.entries(audioRefs.current).forEach(([id, audio]) => {
              if (audio && id !== newItemId) {
                audio.pause();
                audio.currentTime = 0; // Reset playback position
                
                // Update playback state
                setPlaybackStates(prev => ({
                  ...prev,
                  [id]: {
                    isPlaying: false,
                    currentTime: 0,
                    duration: audio.duration || 0
                  }
                }));
              }
            });
            
            // Play the new active audio
            const activeAudio = audioRefs.current[newItemId];
            if (activeAudio) {
              activeAudio.play().catch(e => {
                console.log("Auto-play prevented", e);
              });
              
              // Update playback state
              setPlaybackStates(prev => ({
                ...prev,
                [newItemId]: {
                  ...prev[newItemId],
                  isPlaying: true
                }
              }));
            }
            
            setCurrentIndex(newIndex);
          }
        }
      });
    }, options);
    
    const slides = containerRef.current.querySelectorAll(".snap-slide");
    slides.forEach((slide) => scrollObserver.current.observe(slide));
    
    return () => {
      if (scrollObserver.current) {
        scrollObserver.current.disconnect();
      }
    };
  }, [items, currentIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Pause all audios when component unmounts
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) audio.pause();
      });
    };
  }, []);

  const setAudioRef = useCallback((id, el) => {
    if (el) {
      audioRefs.current[id] = el;
      
      // Initialize playback state for this audio
      setPlaybackStates(prev => ({
        ...prev,
        [id]: {
          isPlaying: false,
          currentTime: 0,
          duration: 0
        }
      }));
    }
  }, []);

  const handleTimeUpdate = useCallback((id, e) => {
    setPlaybackStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        currentTime: e.target.currentTime
      }
    }));
  }, []);

  const handleLoadedMetadata = useCallback((id, e) => {
    setPlaybackStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        duration: e.target.duration
      }
    }));
  }, []);

  // Toggle play/pause for the current audio
  const handleTap = useCallback((id, idx) => {
    const audio = audioRefs.current[id];
    if (!audio) return;
    
    const isCurrentlyPlaying = !audio.paused;
    
    if (isCurrentlyPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => {
        console.log("Play prevented", e);
      });
    }
    
    setPlaybackStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isPlaying: !isCurrentlyPlaying
      }
    }));
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black"
      style={{ overscrollBehavior: "none" }}
    >
      {items.map((item, idx) => {
        const itemId = `${item.type}-${item.id}`;
        const playState = playbackStates[itemId] || { isPlaying: false, currentTime: 0, duration: 0 };
        const isActive = idx === currentIndex;
        
        return (
          <div
            key={itemId}
            data-index={idx}
            ref={idx === items.length - 1 ? lastItemRef : null}
            className="snap-start relative flex items-center justify-center snap-slide h-screen w-full"
          >
            {renderItem({
              item,
              isActive,
              onTap: () => handleTap(itemId, idx),
              currentTime: playState.currentTime,
              duration: playState.duration,
              showTapIcon: true,
              tapIconType: playState.isPlaying ? 'pause' : 'play',
              setAudioRef: (el) => setAudioRef(itemId, el),
              onTimeUpdate: (e) => handleTimeUpdate(itemId, e),
              onLoadedMetadata: (e) => handleLoadedMetadata(itemId, e)
            })}
          </div>
        );
      })}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default TikTokScroll;