import { useState, useRef, useEffect } from 'react';
import { Music, Upload, X, Loader2, Disc, Plus, Calendar, Clock, Users, Share2 } from 'lucide-react';
import Navbar from '../components/profile/NavBar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import BottomNav from '../components/homepage/BottomNav';
import PromotionDetails from '../components/promotion/PromotionDetails';
import ActivePromotions from '../components/promotion/ActivePromotions';
import PreviewModal from '../components/promotion/PreviewModal';
import { usePromotePost, useUserPosts } from '../../Hooks/search/useAllPost';

const Jet = () => {
  // State for tab switching
  const [activeTab, setActiveTab] = useState('promotion'); // 'promotion' or 'distribution'
  
  // Common UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Promotion tab specific state
  const [selectedContent, setSelectedContent] = useState(null);
  const [duration, setDuration] = useState(7);
  const [currentItem, setCurrentItem] = useState(null);
  const [showLockedModal, setShowLockedModal] = useState(false);
  
  // Distribution tab specific state
  const [promotedAudios, setPromotedAudios] = useState([]);
  const [contentType, setContentType] = useState('beat');
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  
  const audioRef = useRef(null);
  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Use the post hooks for promotion tab
  const {
    beats,
    videos,
    audios,
    allPosts,
    loading: postsLoading,
    error: postsError,
    isEmpty,
    refetch
  } = useUserPosts();

  // Use promotion hook
  const { 
    promotePost, 
    loading: promotionLoading, 
    error: promotionError,
    success: promotionSuccess,
    reset: resetPromotion
  } = usePromotePost();

  // Load sample data for distribution tab
  useEffect(() => {
    if (activeTab === 'distribution') {
      // Simulate API call to fetch distributions
      setTimeout(() => {
        setPromotedAudios([
          {
            id: 1,
            title: "Summer Vibes",
            type: "beat",
            coverImage: "/api/placeholder/400/320",
            status: "Active",
            createdAt: "2025-04-20",
            duration: "02:45",
            listeners: 342
          },
          {
            id: 2,
            title: "Late Night Thoughts",
            type: "audio",
            coverImage: "/api/placeholder/400/320",
            status: "Pending",
            createdAt: "2025-04-25",
            duration: "03:21",
            listeners: 120
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [activeTab]);

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Toggle content selection (promotion tab)
  const toggleContentSelection = (item) => {
    setSelectedContent(prev => prev?.id === item.id ? null : item);
    resetPromotion(); // Reset promotion state when changing selection
  };

  // Handle promotion
  const handlePromote = async () => {
    if (!selectedContent) return;
    
    try {
      await promotePost(selectedContent.id, selectedContent.type);
      // On success, refetch the posts to update the promoted status
      refetch.all();
    } catch (err) {
      console.error('Promotion failed:', err);
    }
  };

  // Input change handlers for distribution form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('audio.*')) {
        alert('Please select a valid audio file (MP3, WAV)');
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert('Audio file must be less than 50MB');
        return;
      }
      setAudioFile(file);
      
      // Reset audio player if there was a previous audio file
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please select a valid image file (JPEG, PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Cover photo must be less than 5MB');
        return;
      }
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  const toggleAudioPlay = (id) => {
    if (id !== undefined) {
      // Handle playing from the list
      if (currentlyPlaying === id) {
        setCurrentlyPlaying(null);
      } else {
        setCurrentlyPlaying(id);
      }
    } else {
      // Handle playing from the form
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };
  
  const removeCoverPhoto = () => {
    setCoverFile(null);
    setCoverPreview(null);
  };
  
  const removeAudioFile = () => {
    setAudioFile(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const validateForm = () => {
    return formData.title && formData.description && coverFile && audioFile;
  };

  // Distribution form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Add the new promotion to the list
      const newPromotion = {
        id: Date.now(),
        title: formData.title,
        type: contentType,
        coverImage: coverPreview,
        status: "Pending",
        createdAt: new Date().toISOString().split('T')[0],
        duration: "00:00", // Would be calculated from the actual audio
        listeners: 0
      };
      
      setPromotedAudios([newPromotion, ...promotedAudios]);
      
      // Reset form
      setFormData({
        title: '',
        description: ''
      });
      setCoverFile(null);
      setCoverPreview(null);
      setAudioFile(null);
      setShowForm(false);
      
      alert('Distribution request submitted successfully!');
    }, 1500);
  };

  // Styling variables
  const tealColor = '#2D8C72';

  // Loading state for promotion tab
  if (activeTab === 'promotion' && postsLoading.all) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 my-13 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2D8C72]"></div>
      </div>
    );
  }

  // Error state for promotion tab
  if (activeTab === 'promotion' && postsError.any) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 my-13 flex flex-col justify-center items-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 max-w-md">
          <p className="text-red-700">Failed to load your content. Please try again.</p>
        </div>
        <button 
          onClick={refetch.all}
          className="mt-4 px-6 py-2 rounded-lg bg-[#2D8C72] text-white hover:bg-[#1E6B5E]"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state for promotion tab
  if (activeTab === 'promotion' && isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 my-13 flex flex-col justify-center items-center">
        <div className="text-center max-w-md">
          <Music className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No content to promote</h3>
          <p className="mt-2 text-gray-500">You haven't uploaded any beats, videos, or audios yet.</p>
          <button className="mt-6 px-6 py-2 rounded-lg bg-[#2D8C72] text-white hover:bg-[#1E6B5E]">
            Upload Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 my-13 pb-20">
      <Navbar 
        name={activeTab === 'promotion' ? 'Promote Content' : 'Distribution'} 
        toggleSidebar={toggleSidebar} 
      />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`max-w-${activeTab === 'promotion' ? '4xl' : '2xl'} mx-auto bg-white`}>
        {/* Tab switcher */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('promotion')}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'promotion' 
                ? 'text-[#2D8C72] border-b-2 border-[#2D8C72]' 
                : 'text-gray-500'
            }`}
          >
            Promotion
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'distribution' 
                ? 'text-[#2D8C72] border-b-2 border-[#2D8C72]' 
                : 'text-gray-500'
            }`}
          >
            Distribution
          </button>
        </div>
        
        {/* Promotion Tab Content */}
        {activeTab === 'promotion' && (
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Music className="text-[#2D8C72]" /> Promote Your Content
              </h1>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Content Selection */}
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Music /> Your Uploads ({allPosts.length})
                </h2>
                
                {allPosts.map(item => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden border ${
                      selectedContent?.id === item.id 
                        ? 'border-[#2D8C72] ring-1 ring-[#2D8C72]' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex">
                      <div 
                        className="w-24 h-24 bg-gray-100 relative cursor-pointer"
                        onClick={() => {
                          setCurrentItem(item);
                          setShowLockedModal(true);
                        }}
                      >
                        <img 
                          src={item.cover_photo || '/api/placeholder/400/320'} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="text-white text-lg">▶</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-500 capitalize">
                              {item.type} • {item.duration || '--:--'}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleContentSelection(item)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              selectedContent?.id === item.id
                                ? 'bg-[#2D8C72] text-white'
                                : 'border-2 border-gray-300'
                            }`}
                            disabled={promotionLoading}
                          >
                            {selectedContent?.id === item.id && '✓'}
                          </button>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {item.plays_count?.toLocaleString() || '0'} plays
                          </span>
                          <span className="font-medium">
                            ₦{item.price?.toLocaleString() || '0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Preview Modal */}
                {showLockedModal && currentItem && (
                  <PreviewModal 
                    item={currentItem}
                    isSelected={selectedContent?.id === currentItem.id}
                    toggleContentSelection={() => toggleContentSelection(currentItem)}
                    onClose={() => setShowLockedModal(false)}
                  />
                )}
              </div>
              
              {/* Promotion Details */}
              <PromotionDetails 
                selectedContent={selectedContent}
                duration={duration}
                setDuration={setDuration}
                onPromote={handlePromote}
                promotionLoading={promotionLoading}
                promotionError={promotionError}
              />
            </div>
            
            {/* Active Promotions */}
            <ActivePromotions activePromotions={beats.filter(b => b.is_promoted)} />
          </div>
        )}

        {/* Distribution Tab Content */}
        {activeTab === 'distribution' && (
          <div>
            {/* Header with request button */}
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">My Distributions</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center text-white rounded-lg px-3 py-2 text-sm font-medium bg-[#2D8C72]"
              >
                {showForm ? (
                  'Cancel'
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Request Distribution
                  </>
                )}
              </button>
            </div>
            
            {/* Distribution form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="p-6 space-y-6 border-b border-gray-200">
                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-teal-600 focus:ring-2 focus:ring-teal-500 border-gray-300"
                        checked={contentType === 'beat'}
                        onChange={() => setContentType('beat')}
                      />
                      <span className="ml-2 text-gray-700 flex items-center">
                        <Disc className="h-4 w-4 mr-1" /> Beat
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-teal-600 focus:ring-2 focus:ring-teal-500 border-gray-300"
                        checked={contentType === 'audio'}
                        onChange={() => setContentType('audio')}
                      />
                      <span className="ml-2 text-gray-700 flex items-center">
                        <Music className="h-4 w-4 mr-1" /> Audio
                      </span>
                    </label>
                  </div>
                </div>
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {contentType === 'beat' ? 'Beat Title' : 'Audio Title'}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      submitAttempted && !formData.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={`Give your ${contentType} a catchy title`}
                  />
                  {submitAttempted && !formData.title && (
                    <p className="mt-1 text-sm text-red-500">Title is required</p>
                  )}
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      submitAttempted && !formData.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your content, mention genre, mood, or inspiration"
                  ></textarea>
                  {submitAttempted && !formData.description && (
                    <p className="mt-1 text-sm text-red-500">Description is required</p>
                  )}
                </div>
                
                {/* Cover Photo */}
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</p>
                  {!coverFile ? (
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 ${
                        submitAttempted && !coverFile ? 'border-red-400' : 'border-gray-300'
                      }`}
                      onClick={() => coverInputRef.current.click()}
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload cover photo</p>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG (max 5MB)</p>
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden h-48">
                      <img 
                        src={coverPreview} 
                        alt="Cover preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeCoverPhoto}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  {submitAttempted && !coverFile && (
                    <p className="mt-1 text-sm text-red-500">Cover photo is required</p>
                  )}
                </div>
                
                {/* Audio File */}
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">
                    {contentType === 'beat' ? 'Beat File' : 'Audio File'}
                  </p>
                  {!audioFile ? (
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 ${
                        submitAttempted && !audioFile ? 'border-red-400' : 'border-gray-300'
                      }`}
                      onClick={() => audioInputRef.current.click()}
                    >
                      <Music className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload {contentType === 'beat' ? 'beat' : 'audio'} file</p>
                      <p className="text-xs text-gray-500 mt-1">MP3, WAV (max 50MB)</p>
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAudioPlay()}
                          className="rounded-full p-2 text-white mr-3 flex-shrink-0 bg-[#2D8C72]"
                        >
                          {isPlaying ? (
                            <div className="h-5 w-5 relative">
                              <span className="absolute h-3 w-1 bg-white left-1"></span>
                              <span className="absolute h-3 w-1 bg-white right-1"></span>
                            </div>
                          ) : (
                            <div className="h-5 w-5 flex justify-center items-center">
                              <span className="h-0 w-0 border-l-8 border-t-4 border-b-4 border-l-white border-t-transparent border-b-transparent ml-1"></span>
                            </div>
                          )}
                        </button>
                        <span className="truncate text-sm">{audioFile.name}</span>
                        {audioFile && (
                          <audio ref={audioRef} src={URL.createObjectURL(audioFile)} onEnded={() => setIsPlaying(false)} />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={removeAudioFile}
                        className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  {submitAttempted && !audioFile && (
                    <p className="mt-1 text-sm text-red-500">Audio file is required</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white font-medium py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70 flex items-center justify-center bg-[#2D8C72]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Request Distribution'
                  )}
                </button>
              </form>
            )}
            
            {/* Distributions List */}
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
                </div>
              ) : promotedAudios.length > 0 ? (
                <div className="space-y-4">
                  {promotedAudios.map((audio) => (
                    <div key={audio.id} className="flex border border-gray-200 rounded-lg overflow-hidden">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img src={audio.coverImage} alt={audio.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{audio.title}</h3>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <span className="flex items-center mr-3">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {audio.createdAt}
                                </span>
                                <span className="flex items-center mr-3">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {audio.duration}
                                </span>
                                <span className="flex items-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  {audio.listeners}
                                </span>
                              </div>
                            </div>
                            <span 
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                audio.status === "Active" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {audio.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            {audio.type === "beat" ? (
                              <Disc className="h-4 w-4 text-gray-500 mr-1" />
                            ) : (
                              <Music className="h-4 w-4 text-gray-500 mr-1" />
                            )}
                            <span className="text-xs text-gray-500">
                              {audio.type === "beat" ? "Beat" : "Audio"}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleAudioPlay(audio.id)}
                            className="rounded-full p-2 text-white flex-shrink-0 bg-[#2D8C72]"
                          >
                            {currentlyPlaying === audio.id ? (
                              <div className="h-4 w-4 relative">
                                <span className="absolute h-2 w-1 bg-white left-1"></span>
                                <span className="absolute h-2 w-1 bg-white right-1"></span>
                              </div>
                            ) : (
                              <div className="h-4 w-4 flex justify-center items-center">
                                <span className="h-0 w-0 border-l-6 border-t-3 border-b-3 border-l-white border-t-transparent border-b-transparent ml-1"></span>
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Share2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No distributions yet</h3>
                  <p className="text-gray-500 mb-6">Request a distribution to share your music with the world</p>
                  {!showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                 
                      className="inline-flex items-center px-4 py-2 text-white rounded-lg bg-[#2D8C72]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Request Distribution
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <BottomNav activeTab={activeTab === 'promotion' ? 'home' : 'upload'} />
    </div>
  );
};

export default Jet;