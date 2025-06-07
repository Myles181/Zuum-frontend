import { useState } from 'react';


import { 
  Newspaper, Tv, Radio, Globe, TrendingUp, ListMusic,
  X, Check, ChevronRight, Image, Video, Upload
} from 'lucide-react';
import { useMassPromotion } from '../../Hooks/search/useAllPost';

export const AllPromotionForms = ({ selectedPlatform, onClose }) => {
  // Use the actual hook instead of mock implementation
  const { createPromotion, loading, error } = useMassPromotion();

  console.log('Selected Platform:', selectedPlatform);
  
  const category = selectedPlatform?.category || 'print';

  // Form state management for each field type
  const [formData, setFormData] = useState(() => {
    const baseFields = { package_id: selectedPlatform?.id };
    
    switch(category) {
      case 'print':
      case 'national':
      case 'international':
        return { ...baseFields, title: '', body: '', description: '', image: null };
      case 'tv':
        return { ...baseFields, title: '', biography: '', hd_video: null };
      case 'radio':
      case 'chart':
      case 'playlist':
        return { ...baseFields, song_link: '' };
      case 'digital':
        return { ...baseFields, artist_name: '', biography: '', artist_photo: null };
      default:
        return baseFields;
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPromotion({
        ...formData,
        category: category
      });
      onClose();
    } catch (err) {
      // Error handling is already done in the hook
      console.error('Promotion failed:', err);
    }
  };


  const getCategoryIcon = () => {
    switch(category) {
      case 'print':
      case 'national':
      case 'international':
        return <Newspaper className="w-5 h-5 text-[#1a5f4b]" />;
      case 'tv':
        return <Tv className="w-5 h-5 text-[#1a5f4b]" />;
      case 'radio':
        return <Radio className="w-5 h-5 text-[#1a5f4b]" />;
      case 'chart':
      case 'playlist':
        return <ListMusic className="w-5 h-5 text-[#1a5f4b]" />;
      case 'digital':
        return <Globe className="w-5 h-5 text-[#1a5f4b]" />;
      default:
        return <TrendingUp className="w-5 h-5 text-[#1a5f4b]" />;
    }
  };

  const renderFormFields = () => {
    switch(category) {
      case 'print':
      case 'national':
      case 'international':
        return (
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f4b]/20 focus:border-[#1a5f4b] smooth-transition placeholder-gray-400"
                placeholder="Enter your promotion title"
                required
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f4b]/20 focus:border-[#1a5f4b] smooth-transition placeholder-gray-400 resize-none"
                placeholder="Write your promotion content here..."
                required
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Image <span className="text-red-500">*</span>
              </label>
              <FileUpload 
                accept="image/*"
                onChange={(file) => handleFileChange('image', file)}
                icon={<Image size={20} />}
                type="image"
              />
            </div>
            {(category === 'print' || category === 'international') && (
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f4b]/20 focus:border-[#1a5f4b] transition-all duration-200 placeholder-gray-400 resize-none"
                  placeholder="Add a brief description (optional)"
                />
              </div>
            )}
          </div>
        );

      case 'tv':
        return (
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f4b]/20 focus:border-[#1a5f4b] transition-all duration-200 placeholder-gray-400"
                placeholder="Enter TV promotion title"
                required
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Biography <span className="text-red-500">*</span>
              </label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f4b]/20 focus:border-[#1a5f4b] transition-all duration-200 placeholder-gray-400 resize-none"
                placeholder="Tell us about yourself or your story..."
                required
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                HD Video <span className="text-red-500">*</span>
              </label>
              <FileUpload 
                accept="video/*"
                onChange={(file) => handleFileChange('hd_video', file)}
                icon={<Video size={20} />}
                type="video"
              />
            </div>
          </div>
        );

      case 'radio':
      case 'chart':
      case 'playlist':
        return (
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Song Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="song_link"
                value={formData.song_link}
                onChange={handleChange}
                placeholder="https://example.com/song.mp3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f4b]/20 focus:border-[#1a5f4b] transition-all duration-200 placeholder-gray-400"
                required
              />
              <p className="text-xs text-gray-500 mt-2">Provide a direct link to your song file</p>
            </div>
          </div>
        );

      case 'digital':
        return (
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Artist Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="artist_name"
                value={formData.artist_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f4b]/20 focus:border-[#1a5f4b] transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your artist name"
                required
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Biography <span className="text-red-500">*</span>
              </label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5f4b]/20 focus:border-[#1a5f4b] transition-all duration-200 placeholder-gray-400 resize-none"
                placeholder="Share your artistic journey and background..."
                required
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Artist Photo <span className="text-red-500">*</span>
              </label>
              <FileUpload 
                accept="image/*"
                onChange={(file) => handleFileChange('artist_photo', file)}
                icon={<Image size={20} />}
                type="image"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Form not available for this category</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center my-13 ">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Bottom Sheet Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl max-h-[75vh] overflow-hidden animate-slide-up">
        {/* Header with drag handle */}
        <div className="relative bg-gradient-to-r from-[#1a5f4b] to-[#2d7a63] px-6 py-2">
          {/* Drag Handle */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              {getCategoryIcon()}
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedPlatform?.name || 'Promotion Form'}
                </h3>
                <p className="text-[#a7d4c7] text-sm font-medium">
                  {category?.charAt(0).toUpperCase() + category?.slice(1)} Campaign
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 smooth-transition backdrop-blur-sm hover:scale-110"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Form Content */}
        <div className="max-h-[calc(85vh-140px)] overflow-y-auto">
          <div className="p-6 pb-8">
            <div className="space-y-6">
              {renderFormFields()}
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons - Sticky at bottom */}
              <div className=" bottom-0 bg-white pt-6 border-t border-gray-100 -mx-6 px-6 -mb-13 pb-8">
                <div className="flex justify-between space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-600 font-semibold bg-gray-200 hover:bg-gray-200 rounded-xl smooth-transition hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-[#1a5f4b] hover:bg-[#0f3d2e] text-white font-semibold rounded-xl smooth-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern File Upload Component
const FileUpload = ({ accept, onChange, icon, type }) => {
  const [fileName, setFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-6 smooth-transition cursor-pointer ${
        isDragOver 
          ? 'border-[#1a5f4b] bg-[#1a5f4b]/5 scale-105' 
          : fileName 
            ? 'border-[#1a5f4b] bg-[#1a5f4b]/5' 
            : 'border-gray-300 hover:border-[#1a5f4b] hover:bg-gray-50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <label className="flex flex-col items-center justify-center cursor-pointer">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 smooth-transition ${
          fileName ? 'bg-[#1a5f4b] text-white animate-scale-in' : 'bg-gray-100 text-gray-400'
        }`}>
          {fileName ? <Check size={24} /> : icon}
        </div>
        
        <div className="text-center">
          <p className={`font-semibold ${fileName ? 'text-[#1a5f4b]' : 'text-gray-700'}`}>
            {fileName || `Upload ${type}`}
          </p>
          {!fileName && (
            <p className="text-xs text-gray-500 mt-1">
              Drag & drop or click to browse
            </p>
          )}
        </div>
        
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          required
        />
      </label>
      
      {fileName && (
        <div className="absolute top-2 right-2 animate-scale-in">
          <div className="w-6 h-6 bg-[#1a5f4b] rounded-full flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

