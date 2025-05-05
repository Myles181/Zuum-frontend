import React, { useState, useRef, useEffect } from 'react';
import { 
  FaUpload, 
  FaMusic, 
  FaUserAlt, 
  FaGlobe, 
  FaCalendarAlt, 
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaImage
} from 'react-icons/fa';
import { FiX, FiCheckCircle, FiUser, FiEye, FiEyeOff, FiDollarSign, FiTag } from 'react-icons/fi';

const MusicDistributionForm = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Form data state
  const [formData, setFormData] = useState({
    // Basic info
    title: '',
    artist: '',
    genre: '',
    releaseDate: '',
    // Artwork
    coverArt: null,
    // Audio
    audioFile: null,
    // Distribution
    platforms: {
      spotify: true,
      appleMusic: true,
      amazonMusic: false,
      youtubeMusic: false,
      tidal: false,
      deezer: false
    },
    isExplicit: false,
    pricing: 'standard',
    tags: [],
    description: '',
    public: true
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Refs
  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle platform toggles
  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform]
      }
    }));
  };
  
  // Handle file uploads
  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (20MB max)
      if (file.size > 20 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, audioFile: 'Audio file exceeds 20MB limit' }));
        return;
      }
      
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, audioFile: 'Please upload MP3, WAV, or FLAC' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, audioFile: file }));
      setErrors(prev => ({ ...prev, audioFile: null }));
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, coverArt: 'Image exceeds 5MB limit' }));
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, coverArt: 'Please upload JPG or PNG' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, coverArt: file }));
      setErrors(prev => ({ ...prev, coverArt: null }));
    }
  };
  
  // Tag management
  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Toggle public/private
  const handleTogglePublic = () => {
    setFormData(prev => ({ ...prev, public: !prev.public }));
  };
  
  // Form validation
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.artist.trim()) newErrors.artist = 'Artist name is required';
        if (!formData.genre.trim()) newErrors.genre = 'Genre is required';
        if (!formData.releaseDate) newErrors.releaseDate = 'Release date is required';
        break;
      case 2:
        if (!formData.coverArt) newErrors.coverArt = 'Cover art is required';
        break;
      case 3:
        if (!formData.audioFile) newErrors.audioFile = 'Audio file is required';
        break;
      case 4:
        // Check if at least one platform is selected
        if (!Object.values(formData.platforms).some(val => val)) {
          newErrors.platforms = 'Select at least one platform';
        }
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Step navigation
  const goToNextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Build FormData for API submission
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('artist', formData.artist);
      submitData.append('genre', formData.genre);
      submitData.append('releaseDate', formData.releaseDate);
      submitData.append('coverArt', formData.coverArt);
      submitData.append('audioFile', formData.audioFile);
      submitData.append('platforms', JSON.stringify(formData.platforms));
      submitData.append('isExplicit', formData.isExplicit);
      submitData.append('pricing', formData.pricing);
      submitData.append('tags', JSON.stringify(formData.tags));
      submitData.append('description', formData.description);
      submitData.append('public', formData.public);
      
      // For demo purposes, just log the data
      console.log('Submitting music:', Object.fromEntries(submitData.entries()));
      
      setSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to submit. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form when success is cleared
  const handleReset = () => {
    setFormData({
      title: '',
      artist: '',
      genre: '',
      releaseDate: '',
      coverArt: null,
      audioFile: null,
      platforms: {
        spotify: true,
        appleMusic: true,
        amazonMusic: false,
        youtubeMusic: false,
        tidal: false,
        deezer: false
      },
      isExplicit: false,
      pricing: 'standard',
      tags: [],
      description: '',
      public: true
    });
    setCurrentStep(1);
    setSuccess(false);
    setErrors({});
  };
  
  // Render step content
  const renderStepContent = () => {
    if (success) {
      return (
        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Submission Successful!</h2>
          <p className="text-gray-600 mb-6">Your music has been submitted for distribution.</p>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-[#2D8C72] text-white rounded-lg hover:bg-[#247a63] transition-colors"
          >
            Submit Another Track
          </button>
        </div>
      );
    }
    
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Track Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-gray-50 border ${errors.title ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2D8C72]`}
                placeholder="Enter track title"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            
            {/* Artist */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Artist Name</label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-gray-50 border ${errors.artist ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2D8C72]`}
                placeholder="Enter artist name"
              />
              {errors.artist && <p className="text-red-500 text-sm">{errors.artist}</p>}
            </div>
            
            {/* Genre */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Genre</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-gray-50 border ${errors.genre ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2D8C72]`}
              >
                <option value="">Select genre</option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="hip-hop">Hip-Hop</option>
                <option value="electronic">Electronic</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Classical</option>
                <option value="r&b">R&B</option>
                <option value="country">Country</option>
                <option value="folk">Folk</option>
                <option value="other">Other</option>
              </select>
              {errors.genre && <p className="text-red-500 text-sm">{errors.genre}</p>}
            </div>
            
            {/* Release Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-3 rounded-lg bg-gray-50 border ${errors.releaseDate ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2D8C72]`}
              />
              {errors.releaseDate && <p className="text-red-500 text-sm">{errors.releaseDate}</p>}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Cover Artwork</h2>
            
            {/* Cover Art Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Cover Image</label>
              <div
                onClick={() => imageInputRef.current.click()}
                className={`border-2 border-dashed rounded-lg cursor-pointer hover:border-[#2D8C72] transition-all ${
                  errors.coverArt ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {formData.coverArt ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.coverArt)}
                      alt="Cover preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, coverArt: null }));
                      }}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <FaImage className="w-8 h-8 text-[#2D8C72]" />
                    </div>
                    <p className="text-[#2D8C72] font-medium">Click to upload artwork</p>
                    <p className="text-gray-500 text-sm mt-1">JPG or PNG (max. 5MB)</p>
                    <p className="text-gray-500 text-xs mt-3">Recommended size: 3000x3000 pixels</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {errors.coverArt && <p className="text-red-500 text-sm">{errors.coverArt}</p>}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Artwork Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Square image (1:1 ratio)</li>
                <li>• Minimum 3000x3000 pixels</li>
                <li>• No text in outer 10% of image</li>
                <li>• No explicit content or third-party logos</li>
              </ul>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Audio File</h2>
            
            {/* Audio Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Audio File</label>
              <div
                onClick={() => audioInputRef.current.click()}
                className={`border-2 border-dashed rounded-lg cursor-pointer hover:border-[#2D8C72] transition-all ${
                  errors.audioFile ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {formData.audioFile ? (
                  <div className="relative p-6 flex items-center">
                    <div className="w-16 h-16 bg-[#2D8C72] rounded-full flex items-center justify-center mr-4">
                      <FaMusic className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 truncate">{formData.audioFile.name}</p>
                      <p className="text-sm text-gray-500">{(formData.audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, audioFile: null }));
                      }}
                      className="bg-gray-100 p-2 rounded-full"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <FaMusic className="w-8 h-8 text-[#2D8C72]" />
                    </div>
                    <p className="text-[#2D8C72] font-medium">Click to upload audio</p>
                    <p className="text-gray-500 text-sm mt-1">MP3, WAV, or FLAC (max. 20MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={audioInputRef}
                  accept="audio/mpeg,audio/wav,audio/flac"
                  onChange={handleAudioChange}
                  className="hidden"
                />
              </div>
              {errors.audioFile && <p className="text-red-500 text-sm">{errors.audioFile}</p>}
            </div>
            
            {/* Explicit Content */}
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isExplicit}
                  onChange={() => setFormData(prev => ({ ...prev, isExplicit: !prev.isExplicit }))}
                  className="w-5 h-5 text-[#2D8C72] rounded focus:ring-[#2D8C72]"
                />
                <span className="text-gray-700">Contains explicit content</span>
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Audio Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Uncompressed WAV or FLAC for best quality</li>
                <li>• Minimum bitrate 320 kbps for MP3</li>
                <li>• No voice-overs or DJ drops</li>
                <li>• No unauthorized samples</li>
              </ul>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Distribution Details</h2>
            
            {/* Distribution Platforms */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Distribution Platforms</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handlePlatformToggle('spotify')}
                  className={`p-3 rounded-lg flex items-center ${
                    formData.platforms.spotify 
                      ? 'bg-[#2D8C72] text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-white rounded-full">
                    {formData.platforms.spotify && <FaCheck size={12} className="text-[#2D8C72]" />}
                  </span>
                  Spotify
                </button>
                <button
                  type="button"
                  onClick={() => handlePlatformToggle('appleMusic')}
                  className={`p-3 rounded-lg flex items-center ${
                    formData.platforms.appleMusic 
                      ? 'bg-[#2D8C72] text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-white rounded-full">
                    {formData.platforms.appleMusic && <FaCheck size={12} className="text-[#2D8C72]" />}
                  </span>
                  Apple Music
                </button>
                <button
                  type="button"
                  onClick={() => handlePlatformToggle('amazonMusic')}
                  className={`p-3 rounded-lg flex items-center ${
                    formData.platforms.amazonMusic 
                      ? 'bg-[#2D8C72] text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-white rounded-full">
                    {formData.platforms.amazonMusic && <FaCheck size={12} className="text-[#2D8C72]" />}
                  </span>
                  Amazon Music
                </button>
                <button
                  type="button"
                  onClick={() => handlePlatformToggle('youtubeMusic')}
                  className={`p-3 rounded-lg flex items-center ${
                    formData.platforms.youtubeMusic 
                      ? 'bg-[#2D8C72] text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-white rounded-full">
                    {formData.platforms.youtubeMusic && <FaCheck size={12} className="text-[#2D8C72]" />}
                  </span>
                  YouTube Music
                </button>
                <button
                  type="button"
                  onClick={() => handlePlatformToggle('tidal')}
                  className={`p-3 rounded-lg flex items-center ${
                    formData.platforms.tidal 
                      ? 'bg-[#2D8C72] text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-white rounded-full">
                    {formData.platforms.tidal && <FaCheck size={12} className="text-[#2D8C72]" />}
                  </span>
                  Tidal
                </button>
                <button
                  type="button"
                  onClick={() => handlePlatformToggle('deezer')}
                  className={`p-3 rounded-lg flex items-center ${
                    formData.platforms.deezer 
                      ? 'bg-[#2D8C72] text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-white rounded-full">
                    {formData.platforms.deezer && <FaCheck size={12} className="text-[#2D8C72]" />}
                  </span>
                  Deezer
                </button>
              </div>
              {errors.platforms && <p className="text-red-500 text-sm">{errors.platforms}</p>}
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full p-3 rounded-lg bg-gray-50 border ${errors.description ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#2D8C72]`}
                placeholder="Tell listeners about your track..."
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            
            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiTag className="text-gray-500" /> Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                  placeholder="Add relevant tags..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  className="px-4 py-2 bg-[#2D8C72] text-white rounded-lg"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, i) => (
                    <div key={i} className="bg-blue-50 text-[#2D8C72] px-3 py-1 rounded-full flex items-center gap-1">
                      <span>{tag}</span>
                      <button onClick={() => handleRemoveTag(tag)}><FiX size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Pricing */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pricing</label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, pricing: 'free' }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    formData.pricing === 'free' ? 'bg-[#2D8C72] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, pricing: 'standard' }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    formData.pricing === 'standard' ? 'bg-[#2D8C72] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <FiDollarSign /> Standard
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, pricing: 'premium' }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    formData.pricing === 'premium' ? 'bg-[#2D8C72] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <FiDollarSign /><FiDollarSign /> Premium
                </button>
              </div>
            </div>
            
            {/* Visibility */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Visibility</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleTogglePublic}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    formData.public ? 'bg-[#2D8C72] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <FiEye size={18} /> Public
                </button>
                <button
                  type="button"
                  onClick={handleTogglePublic}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    !formData.public ? 'bg-[#2D8C72] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <FiEyeOff size={18} /> Private
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Progress indicator
  const renderProgressBar = () => {
    if (success) return null;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-[#2D8C72] text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
              <span className="absolute -bottom-6 text-xs whitespace-nowrap">
                {step === 1 && 'Basic Info'}
                {step === 2 && 'Artwork'}
                {step === 3 && 'Audio'}
                {step === 4 && 'Distribution'}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#2D8C72] transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gradient-to-r from-[#2D8C72]/10 to-white p-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaMusic className="mr-3 text-[#2D8C72]" />
            Music Distribution Form
          </h1>
          <p className="text-gray-600 mt-1">Submit your music to major streaming platforms</p>
        </div>
        
        <div className="p-6">
          {renderProgressBar()}
          
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            {!success && (
              <div className="mt-8 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="px-6 py-2 flex items-center gap-2 text-gray-700 hover:text-[#2D8C72] transition-colors"
                  >
                    <FaChevronLeft size={12} /> Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-2 bg-[#2D8C72] text-white rounded-lg hover:bg-[#247a63] transition-colors flex items-center gap-2"
                  >
                    Next <FaChevronRight size={12} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-[#2D8C72] text-white rounded-lg hover:bg-[#247a63] transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Music'} <FaUpload size={14} />
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MusicDistributionForm;