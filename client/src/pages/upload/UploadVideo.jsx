import React, { useState, useRef, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import { FiX, FiVideo, FiMapPin, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import Navbar from '../../components/profile/NavBar';
import Sidebar from '../../components/homepage/Sidebar';
import Overlay from '../../components/homepage/Overlay';
import BottomNav from '../../components/homepage/BottomNav';
import { useCreateVideoPost } from '../../../Hooks/videoPosts/useCreateVideo';
import { useNavigate } from 'react-router-dom';


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

  // hook
  const { createVideoPost, loading, error: apiError, success } = useCreateVideoPost();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState(prev => ({ ...prev, [name]: value }));
  };

  const handleTogglePublic = () => {
    setFormDataState(prev => ({ ...prev, public: !prev.public }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormDataState(prev => ({ ...prev, video_upload: file }));
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
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormDataState(prev => ({
      ...prev,
      tagged_people: prev.tagged_people.filter(t => t !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formDataState.caption) errs.caption = 'Caption is required';
    if (!formDataState.video_upload) errs.video_upload = 'Video file is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // build multipart form data
    const fd = new FormData();
    fd.append('caption', formDataState.caption);
    fd.append('location', formDataState.location);
    fd.append('public', formDataState.public);
    // send tagged_people as JSON string or send multiple fields depending on backend
    fd.append('tagged_people', JSON.stringify(formDataState.tagged_people));
    fd.append('video_upload', formDataState.video_upload);

    await createVideoPost(fd);

    // optionally, reset form on success
    if (success) {
      setFormDataState({
        caption: '',
        location: '',
        public: true,
        tagged_people: [],
        video_upload: null
      });
      setPreview(null);
     
    }
  };

  useEffect(() => {
      if (success) {
        navigate('/home');
      }
    }, [success, navigate]);
  

  const triggerVideoInput = () => videoInputRef.current.click();
  const toggleSidebar = () => setSidebarOpen(o => !o);

  return (
    <div className="min-h-screen bg-gray-50 my-13">
      <Navbar name="Upload Video" toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Caption */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Caption</label>
            <input
              type="text"
              name="caption"
              value={formDataState.caption}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
              placeholder="Describe your video..."
            />
            {errors.caption && <p className="text-rose-500 text-sm mt-1">{errors.caption}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiMapPin className="text-gray-500" /> Location
            </label>
            <input
              type="text"
              name="location"
              value={formDataState.location}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
              placeholder="Add a location..."
            />
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Visibility</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleTogglePublic}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  formDataState.public ? 'bg-[#2D8C72] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <FiEye size={18} /> Public
              </button>
              <button
                type="button"
                onClick={handleTogglePublic}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  !formDataState.public ? 'bg-[#2D8C72] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <FiEyeOff size={18} /> Private
              </button>
            </div>
          </div>

          {/* Tag People */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiUser className="text-gray-500" /> Tag People
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                placeholder="Enter a name..."
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
            {formDataState.tagged_people.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formDataState.tagged_people.map((tag, i) => (
                  <div key={i} className="bg-blue-50 text-[#2D8C72] px-3 py-1 rounded-full flex items-center gap-1">
                    <span>{tag}</span>
                    <button onClick={() => handleRemoveTag(tag)}><FiX size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Video File</label>
            <div
              onClick={triggerVideoInput}
              className={`border-2 border-dashed rounded-lg cursor-pointer hover:border-[#2D8C72] transition-all ${
                errors.video_upload ? 'border-rose-300' : 'border-gray-300'
              }`}
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
                    className="absolute top-2 right-2 bg-white p-2 rounded-full"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <FiVideo className="w-8 h-8 text-[#2D8C72]" />
                  </div>
                  <p className="text-[#2D8C72] font-medium">Click to upload video</p>
                  <p className="text-gray-500 text-sm mt-1">MP4, MOV, or AVI (max. 50MB)</p>
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

          {/* API Error */}
          {apiError && <p className="text-rose-500 text-center">{apiError}</p>}
          {/* Success Message */}
          {success && <p className="text-green-600 text-center">Video uploaded successfully!</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D8C72] bg-[#2D8C72] text-white disabled:opacity-50"
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
