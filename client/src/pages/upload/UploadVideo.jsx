import React, { useState, useRef, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import { FiX, FiVideo, FiMapPin, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import Navbar from '../../components/profile/NavBar';
import Sidebar from '../../components/homepage/Sidebar';
import Overlay from '../../components/homepage/Overlay';
import BottomNav from '../../components/homepage/BottomNav';
import { useCreateVideoPost } from '../../../Hooks/videoPosts/useCreateVideo';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from '../../contexts/AlertConntexts';
import { useDarkMode } from '../../contexts/DarkModeContext';

const VideoUpload = () => {
  const [formDataState, setFormDataState] = useState({
    caption: '',
    location: '',
    public: true,
    tagged_people: [],
    video_upload: null
  });
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const videoInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get alert functions from context
  const { showSuccess, showError, showInfo, showWarning } = useAlerts();
  const { isDarkMode } = useDarkMode();

  // hook
  const { createVideoPost, loading, error: apiError, success } = useCreateVideoPost();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState(prev => ({ ...prev, [name]: value }));
  };

  const handleTogglePublic = () => {
    setFormDataState(prev => ({ ...prev, public: !prev.public }));
    showInfo(`Video will be ${!formDataState.public ? 'public' : 'private'}`);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (example: 50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        showError('Video file size exceeds 50MB limit');
        return;
      }
      
      // Check file type
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
      if (!validTypes.includes(file.type)) {
        showError('Please upload a valid video file (MP4, MOV, or AVI)');
        return;
      }
      
      setFormDataState(prev => ({ ...prev, video_upload: file }));
      showSuccess('Video file selected');
    }
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !formDataState.tagged_people.includes(tag)) {
      setFormDataState(prev => ({
        ...prev,
        tagged_people: [...prev.tagged_people, tag]
      }));
      setNewTag('');
      showInfo(`${tag} added to tags`);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormDataState(prev => ({
      ...prev,
      tagged_people: prev.tagged_people.filter(t => t !== tagToRemove)
    }));
    showWarning(`${tagToRemove} removed from tags`);
  };

  const validateForm = () => {
    const errs = {};
    if (!formDataState.caption) {
      errs.caption = 'Caption is required';
      showError('Please add a caption for your video');
    }
    if (!formDataState.video_upload) {
      errs.video_upload = 'Video file is required';
      showError('Please select a video file to upload');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // build multipart form data
      const fd = new FormData();
      fd.append('caption', formDataState.caption);
      fd.append('location', formDataState.location);
      fd.append('public', formDataState.public);
      fd.append('tagged_people', JSON.stringify(formDataState.tagged_people));
      fd.append('video_upload', formDataState.video_upload);

      await createVideoPost(fd);

      if (success) {
        showSuccess('Video uploaded successfully!');
        setFormDataState({
          caption: '',
          location: '',
          public: true,
          tagged_people: [],
          video_upload: null
        });
        navigate('/home');
      }
    } catch (error) {
      showError('Failed to upload video. Please try again.');
    }
  };

  useEffect(() => {
    if (apiError) {
      showError(apiError);
    }
  }, [apiError, showError]);

  const triggerVideoInput = () => videoInputRef.current.click();
  const toggleSidebar = () => setSidebarOpen(o => !o);

  return (
    <div 
      className="min-h-screen my-13"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <Navbar name="Upload Video" toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div 
        className="max-w-3xl mx-auto rounded-xl shadow-sm overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Caption */}
          <div className="space-y-2">
            <label 
              className="block text-sm font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Caption
            </label>
            <input
              type="text"
              name="caption"
              value={formDataState.caption}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                '--tw-ring-color': '#2D8C72'
              }}
              placeholder="Describe your video..."
            />
            {errors.caption && <p className="text-rose-500 text-sm mt-1">{errors.caption}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label 
              className="block text-sm font-medium flex items-center gap-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <FiMapPin style={{ color: 'var(--color-text-secondary)' }} /> Location
            </label>
            <input
              type="text"
              name="location"
              value={formDataState.location}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                '--tw-ring-color': '#2D8C72'
              }}
              placeholder="Add a location..."
            />
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <label 
              className="block text-sm font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Visibility
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleTogglePublic}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  formDataState.public ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: formDataState.public ? '#2D8C72' : 'var(--color-bg-primary)',
                  color: formDataState.public ? 'white' : 'var(--color-text-primary)',
                  border: formDataState.public ? 'none' : '1px solid var(--color-border)'
                }}
              >
                <FiEye size={18} /> Public
              </button>
              <button
                type="button"
                onClick={handleTogglePublic}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  !formDataState.public ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: !formDataState.public ? '#2D8C72' : 'var(--color-bg-primary)',
                  color: !formDataState.public ? 'white' : 'var(--color-text-primary)',
                  border: !formDataState.public ? 'none' : '1px solid var(--color-border)'
                }}
              >
                <FiEyeOff size={18} /> Private
              </button>
            </div>
          </div>

          {/* Tag People */}
          <div className="space-y-2">
            <label 
              className="block text-sm font-medium flex items-center gap-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <FiUser style={{ color: 'var(--color-text-secondary)' }} /> Tag People
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': '#2D8C72'
                }}
                placeholder="Enter a name..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className="px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: '#2D8C72' }}
              >
                Add
              </button>
            </div>
            {formDataState.tagged_people.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formDataState.tagged_people.map((tag, i) => (
                  <div 
                    key={i} 
                    className="px-3 py-1 rounded-full flex items-center gap-1"
                    style={{ 
                      backgroundColor: isDarkMode ? '#1e3a8a' : '#dbeafe',
                      color: '#2D8C72'
                    }}
                  >
                    <span>{tag}</span>
                    <button onClick={() => handleRemoveTag(tag)}><FiX size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <label 
              className="block text-sm font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Video File
            </label>
            <div
              onClick={triggerVideoInput}
              className={`border-2 border-dashed rounded-lg cursor-pointer hover:border-[#2D8C72] transition-all ${
                errors.video_upload ? 'border-rose-300' : ''
              }`}
              style={{
                borderColor: errors.video_upload ? '#fca5a5' : 'var(--color-border)'
              }}
            >
              {formDataState.video_upload ? (
                <div className="relative">
                  <video
                    src={URL.createObjectURL(formDataState.video_upload)}
                    className="w-full h-64 object-cover rounded-lg"
                    controls
                  />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setFormDataState(prev => ({ ...prev, video_upload: null }));
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full"
                    style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                  >
                    <FiX size={18} style={{ color: 'var(--color-text-primary)' }} />
                  </button>
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: isDarkMode ? '#1e3a8a' : '#dbeafe' }}
                  >
                    <FiVideo className="w-8 h-8" style={{ color: '#2D8C72' }} />
                  </div>
                  <p className="font-medium" style={{ color: '#2D8C72' }}>Click to upload video</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>MP4, MOV, or AVI (max. 50MB)</p>
                </div>
              )}
              <input
                type="file"
                ref={videoInputRef}
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </div>
            {errors.video_upload && <p className="text-rose-500 text-sm">{errors.video_upload}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{
              backgroundColor: '#2D8C72',
              color: 'white',
              '--tw-ring-color': '#2D8C72'
            }}
          >
            {loading ? 'Uploading…' : <div className="flex items-center justify-center gap-2"><FaUpload /> Upload Video</div>}
          </button>
        </form>
      </div>

      <BottomNav activeTab="upload" />
    </div>
  );
};

export default VideoUpload;