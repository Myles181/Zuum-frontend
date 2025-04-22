import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMusic, 
  FiHeart, 
  FiDownload, 
  FiClock,
  FiShoppingBag,
  FiSearch,
  FiPlay,
  FiPause
} from 'react-icons/fi';
import Navbar from '../../profile/NavBar';
import Sidebar from '../Sidebar';
import Overlay from '../Overlay';
import BottomNav from '../BottomNav';
import { usePurchasedBeats } from '../../../../Hooks/beats/useBeats';


const PurchasedBeats = () => {
  // Color variables
  const teal = '#008066';
  const tealLight = 'rgba(0, 128, 102, 0.1)';
  const tealDark = '#006652';

  // Use the purchased beats hook
  const { purchasedBeats, loading, error, refetch } = usePurchasedBeats();
  const [beats, setBeats] = useState([]);

  console.log(purchasedBeats);
  

  // Transform API data to match your component's structure
  useEffect(() => {
    if (purchasedBeats.length > 0) {
      const transformedBeats = purchasedBeats.map(beat => ({
        id: beat.id,
        title: beat.caption || 'Untitled Beat',
        artist: beat.username || 'Unknown Artist',
        coverArt: beat.cover_photo || 'https://source.unsplash.com/random/300x300/?music',
        price: beat.amount || 0,
        purchasedDate: beat.purchase_date || new Date().toISOString(),
        duration: '3:45', // You might want to calculate this from audio duration
        genre: beat.genre || 'Unknown Genre',
        downloadsRemaining: beat.downloads_remaining || 0,
        audioUrl: beat.audio_upload || '#',
        isPlaying: false,
        isFavorite: false
      }));
      setBeats(transformedBeats);
    }
  }, [purchasedBeats]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentAudio, setCurrentAudio] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter beats
  const filteredBeats = beats.filter(beat => 
    `${beat.title} ${beat.artist} ${beat.genre}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Audio control
  const togglePlay = (beat) => {
    if (currentAudio) {
      currentAudio.pause();
      if (currentAudio.src !== beat.audioUrl) {
        currentAudio.currentTime = 0;
      }
    }

    if (beat.isPlaying) {
      setBeats(beats => beats.map(b => ({ ...b, isPlaying: false })));
      setCurrentAudio(null);
    } else {
      const audio = new Audio(beat.audioUrl);
      audio.play();
      audio.onended = () => {
        setBeats(beats => beats.map(b => ({ ...b, isPlaying: false })));
        setCurrentAudio(null);
      };
      
      setCurrentAudio(audio);
      setBeats(beats => beats.map(b => ({
        ...b, 
        isPlaying: b.id === beat.id
      })));
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleFavorite = (id) => {
    setBeats(beats => beats.map(beat => 
      beat.id === id 
        ? { ...beat, isFavorite: !beat.isFavorite } 
        : beat
    ));
  };

  const handleDownload = (id) => {
    setBeats(beats => beats.map(beat => 
      beat.id === id 
        ? { ...beat, downloadsRemaining: beat.downloadsRemaining - 1 } 
        : beat
    ));
    // Actual download implementation would go here
  };

  // Clean up
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 my-13 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#008066]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 my-13 flex flex-col justify-center items-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={refetch}
          className="mt-4 px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
          style={{ backgroundColor: teal, color: 'white' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 my-13">
      <Navbar name="Your Beats" toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <FiShoppingBag className="text-2xl" style={{ color: teal }} />
            <h1 className="text-3xl font-bold text-gray-900 ml-3">Your Library</h1>
          </div>
          <p className="text-gray-500">
            {beats.length} purchased beats {beats.length > 0 && `• Last added ${new Date(beats[0].purchasedDate).toLocaleDateString('en-US')}`}
          </p>
        </div>

        {/* Beats Grid */}
        {filteredBeats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBeats.map(beat => (
              <div key={beat.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Cover Art */}
                <div className="relative aspect-square">
                  <img 
                    src={beat.coverArt} 
                    alt={beat.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
                    <button
                      onClick={() => togglePlay(beat)}
                      className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full hover:bg-white transition-all shadow-md"
                      style={{ color: teal }}
                    >
                      {beat.isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
                    </button>
                    <div>
                      <p className="text-xs font-medium text-white/90">{beat.genre}</p>
                      <h3 className="text-lg font-bold text-white">{beat.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Beat Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-500">{beat.artist}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <FiClock className="mr-1" />
                        <span>{beat.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Info */}
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Purchased</p>
                      <p className="text-sm font-medium">
                        {new Date(beat.purchasedDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Downloads left</p>
                      <p className="text-sm font-medium">
                        {beat.downloadsRemaining > 0 ? beat.downloadsRemaining : 'None'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => handleDownload(beat.id)}
                      disabled={beat.downloadsRemaining <= 0}
                      className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg transition-colors ${
                        beat.downloadsRemaining > 0 
                          ? 'hover:bg-opacity-90' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      style={{ 
                        backgroundColor: beat.downloadsRemaining > 0 ? teal : '',
                        color: beat.downloadsRemaining > 0 ? 'white' : ''
                      }}
                    >
                      <FiDownload className="mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <FiMusic className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm ? 'No matching beats found' : 'Your library is empty'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? 'Try a different search term' 
                : 'Browse our catalog and find your next favorite beat'}
            </p>
            <Link 
              to="/beats"
              className="inline-flex items-center px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: teal, color: 'white' }}
            >
              Explore Beats
            </Link>
          </div>
        )}
      </div>
      <BottomNav activeTab="home" />
    </div>
  );
};

export default PurchasedBeats;