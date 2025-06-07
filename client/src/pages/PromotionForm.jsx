import { useState } from 'react';
import { 
  Newspaper, Tv, Radio, Globe, TrendingUp, ListMusic,
  X, Check, ChevronRight, Image, Video, Upload, Youtube, Music
} from 'lucide-react';
import { useMassPromotion } from '../../Hooks/search/useAllPost';

export const AllPromotionForms = ({ selectedPlatform, onClose }) => {
  const { createPromotion, loading, error } = useMassPromotion();

  console.log('Selected Platform:', selectedPlatform);
  
  const category = selectedPlatform?.category || 'print';

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
      case 'youtube':
        return { ...baseFields, video_link: '', title: '', description: '' };
      case 'tiktok':
        return { 
          ...baseFields, 
          video_link: '', 
          title: '', 
          description: '',
          hashtags: '',
          music: ''
        };
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
      case 'youtube':
        return <Youtube className="w-5 h-5 text-[#FF0000]" />;
      case 'tiktok':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      default:
        return <TrendingUp className="w-5 h-5 text-[#1a5f4b]" />;
    }
  };

  const getCategoryColor = () => {
    switch(category) {
      case 'youtube':
        return {
          bgFrom: 'from-[#FF0000]',
          bgTo: 'to-[#CC0000]',
          text: 'text-[#FF0000]',
          hover: 'hover:bg-[#CC0000]',
          focusRing: 'focus:ring-red-500/20 focus:border-red-500'
        };
      case 'tiktok':
        return {
          bgFrom: 'from-[#000000]',
          bgTo: 'to-[#000000]',
          text: 'text-[#000000]',
          hover: 'hover:bg-[#222222]',
          focusRing: 'focus:ring-gray-600/20 focus:border-gray-700'
        };
      default:
        return {
          bgFrom: 'from-[#1a5f4b]',
          bgTo: 'to-[#2d7a63]',
          text: 'text-[#1a5f4b]',
          hover: 'hover:bg-[#0f3d2e]',
          focusRing: 'focus:ring-[#1a5f4b]/20 focus:border-[#1a5f4b]'
        };
    }
  };

  const colors = getCategoryColor();

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

      case 'youtube':
        return (
          <div className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                YouTube Video Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="video_link"
                value={formData.video_link}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 placeholder-gray-400"
                required
              />
              <p className="text-xs text-gray-500 mt-2">Paste the full YouTube video URL</p>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your video title"
                required
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 placeholder-gray-400 resize-none"
                placeholder="Add a description for your video..."
              />
            </div>
          </div>
        );

      case 'tiktok':
        return (
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                TikTok Video Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="video_link"
                value={formData.video_link}
                onChange={handleChange}
                placeholder="https://tiktok.com/@username/video/..."
                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none ${colors.focusRing} transition-all duration-200 placeholder-gray-400`}
                required
              />
              <p className="text-xs text-gray-500 mt-2">Paste the full TikTok video URL</p>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none ${colors.focusRing} transition-all duration-200 placeholder-gray-400`}
                placeholder="Enter your catchy title"
                required
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none ${colors.focusRing} transition-all duration-200 placeholder-gray-400 resize-none`}
                placeholder="Add a description for your TikTok..."
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Hashtags
              </label>
              <input
                type="text"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none ${colors.focusRing} transition-all duration-200 placeholder-gray-400`}
                placeholder="#viral #trending #fyp"
              />
              <p className="text-xs text-gray-500 mt-2">Separate with spaces, include the # symbol</p>
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
    <div className="fixed inset-0 z-50 flex items-end justify-center my-13">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl max-h-[75vh] overflow-hidden animate-slide-up">
        <div className={`relative bg-gradient-to-r ${colors.bgFrom} ${colors.bgTo} px-6 py-2`}>
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
                <p className="text-white/80 text-sm font-medium">
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
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

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

              <div className="bottom-0 bg-white pt-6 border-t border-gray-100 -mx-6 px-6 -mb-13 pb-8">
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
                    className={`px-8 py-3 ${colors.bgFrom.replace('from-', 'bg-' || "#000")} ${colors.hover} text-white font-semibold rounded-xl smooth-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105`}
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

// FileUpload component remains the same
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
          ? 'border-current bg-current/5 scale-105' 
          : fileName 
            ? 'border-current bg-current/5' 
            : 'border-gray-300 hover:border-current hover:bg-gray-50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <label className="flex flex-col items-center justify-center cursor-pointer">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 smooth-transition ${
          fileName ? 'bg-current text-white animate-scale-in' : 'bg-gray-100 text-gray-400'
        }`}>
          {fileName ? <Check size={24} /> : icon}
        </div>
        
        <div className="text-center">
          <p className={`font-semibold ${fileName ? 'text-current' : 'text-gray-700'}`}>
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
          <div className="w-6 h-6 bg-current rounded-full flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};