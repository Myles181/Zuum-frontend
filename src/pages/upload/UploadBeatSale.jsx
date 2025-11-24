import { useState, useRef, useEffect } from 'react';
import { Music, Upload, X, Check, Loader2 } from 'lucide-react';
import { useCreateBeatPost } from '../../../Hooks/beats/useBeats';
import Navbar from '../../components/profile/NavBar';
import Sidebar from '../../components/homepage/Sidebar';
import Overlay from '../../components/homepage/Overlay';
import BottomNav from '../../components/homepage/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from '../../contexts/AlertConntexts';

const UploadBeats = () => {
  const { createBeatPost, loading, error, success } = useCreateBeatPost();
  const [formData, setFormData] = useState({
    caption: '',
    description: '',
    amount: 999
  });

  const navigate = useNavigate();
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get alert functions from context
  const { showSuccess, showError, showInfo, showWarning } = useAlerts();

  // Dark mode styles
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-bg-tertiary': '#374151',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) : value
    });
  };
  
  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file
      if (!file.type.match('image.*')) {
        showError('Please select a valid image file (JPEG, PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('Cover photo must be less than 5MB');
        return;
      }
      setCoverPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target.result);
      reader.readAsDataURL(file);
      showInfo('Cover photo selected');
    }
  };
  
  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate audio file
      if (!file.type.match('audio.*')) {
        showError('Please select a valid audio file (MP3, WAV)');
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        showError('Audio file must be less than 50MB');
        return;
      }
      setAudioFile(file);
      showInfo('Audio file selected');
      // Reset audio player if there was a previous audio file
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
  const toggleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const removeCoverPhoto = () => {
    setCoverPhoto(null);
    setCoverPreview(null);
    showWarning('Cover photo removed');
  };
  
  const removeAudioFile = () => {
    setAudioFile(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    showWarning('Audio file removed');
  };
  
  const validateForm = () => {
    const isValid = formData.caption && formData.description && coverPhoto && audioFile;
    
    if (!formData.caption) {
      showError('Please add a title for your beat');
    }
    if (!formData.description) {
      showError('Please add a description for your beat');
    }
    if (!coverPhoto) {
      showError('Please select a cover photo');
    }
    if (!audioFile) {
      showError('Please select an audio file');
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) return;
    
    try {
      const submitData = new FormData();
      submitData.append('caption', formData.caption);
      submitData.append('description', formData.description);
      submitData.append('amount', formData.amount);
      submitData.append('cover_photo', coverPhoto);
      submitData.append('audio_upload', audioFile);
      
      await createBeatPost(submitData);
    } catch (err) {
      showError('Failed to upload beat. Please try again.');
      console.error('Upload error:', err);
    }
  };

  useEffect(() => {
    if (success) {
      showSuccess('Beat uploaded successfully!');
      // Reset form
      setFormData({
        caption: '',
        description: '',
        amount: 999
      });
      setCoverPhoto(null);
      setAudioFile(null);
      setCoverPreview(null);
      // Navigate after a short delay to allow the success message to be seen
      setTimeout(() => navigate('/home'), 1500);
    }
  }, [success, navigate, showSuccess]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const primaryColor = '#2D8C72';
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div 
      className="min-h-screen my-13"
      style={{ 
        backgroundColor: 'var(--color-bg-primary)',
        ...darkModeStyles
      }}
    >
      <Navbar name={"Upload Beats"} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        className="max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg"
        style={{ 
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)'
        }}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Beat Title
            </label>
            <input
              type="text"
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all ${
                submitAttempted && !formData.caption ? 'border-red-500' : 'border-gray-600'
              }`}
              style={{ 
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)'
              }}
              placeholder="Give your beat a catchy title"
              disabled={loading}
            />
            {submitAttempted && !formData.caption && (
              <p className="mt-1 text-sm text-red-500">Title is required</p>
            )}
          </div>
          
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all ${
                submitAttempted && !formData.description ? 'border-red-500' : 'border-gray-600'
              }`}
              style={{ 
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)'
              }}
              placeholder="Describe your beat, mention genre, mood, or inspiration"
              disabled={loading}
            ></textarea>
            {submitAttempted && !formData.description && (
              <p className="mt-1 text-sm text-red-500">Description is required</p>
            )}
          </div>
          
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Price
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span style={{ color: 'var(--color-text-secondary)' }}>₦</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  className="w-full pl-7 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all border-gray-600"
                  style={{ 
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                  disabled={loading}
                />
              </div>
            </div>
          
          <div>
            <p 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Cover Photo
            </p>
            {!coverPhoto ? (
              <div 
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  submitAttempted && !coverPhoto ? 'border-red-400' : 'border-gray-600'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#2D8C72]'}`}
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)'
                }}
                onClick={() => !loading && document.getElementById('cover-upload').click()}
              >
                <Upload className="h-10 w-10 mb-2" style={{ color: 'var(--color-text-secondary)' }} />
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Click to upload cover photo</p>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPhotoChange}
                  className="hidden"
                  disabled={loading}
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
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-colors"
                  disabled={loading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {submitAttempted && !coverPhoto && (
              <p className="mt-1 text-sm text-red-500">Cover photo is required</p>
            )}
          </div>
          
          <div>
            <p 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Audio File
            </p>
            {!audioFile ? (
              <div 
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  submitAttempted && !audioFile ? 'border-red-400' : 'border-gray-600'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#2D8C72]'}`}
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)'
                }}
                onClick={() => !loading && document.getElementById('audio-upload').click()}
              >
                <Music className="h-10 w-10 mb-2" style={{ color: 'var(--color-text-secondary)' }} />
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Click to upload audio file</p>
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="hidden"
                  disabled={loading}
                />
              </div>
            ) : (
              <div 
                className="border rounded-lg p-4 flex items-center justify-between"
                style={{ 
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-bg-primary)'
                }}
              >
                <div className="flex items-center overflow-hidden">
                  <button
                    type="button"
                    onClick={toggleAudioPlay}
                    className="rounded-full p-2 text-white mr-3 flex-shrink-0 transition-colors hover:bg-[#248066]"
                    style={{ backgroundColor: primaryColor }}
                    disabled={loading}
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
                  <span className="truncate text-sm" style={{ color: 'var(--color-text-primary)' }}>{audioFile.name}</span>
                  {audioFile && (
                    <audio ref={audioRef} src={URL.createObjectURL(audioFile)} onEnded={() => setIsPlaying(false)} />
                  )}
                </div>
                <button
                  type="button"
                  onClick={removeAudioFile}
                  className="ml-2 hover:text-gray-300 flex-shrink-0 transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  disabled={loading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {submitAttempted && !audioFile && (
              <p className="mt-1 text-sm text-red-500">Audio file is required</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-medium py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center transition-all hover:bg-[#248066]"
            style={{ 
              backgroundColor: primaryColor
            }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Uploading...
              </>
            ) : (
              'Upload Beat'
            )}
          </button>
        </form>
      </div>
      <BottomNav activeTab="upload" />
    </div>
  );
}

export default UploadBeats;