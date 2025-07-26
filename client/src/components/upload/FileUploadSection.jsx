import React from 'react';
import { FiImage, FiMusic, FiX } from 'react-icons/fi';
import { useDarkMode } from '../../contexts/DarkModeContext';

const FileUploadSection = ({
  previewImage,
  formData,
  errors,
  loading,
  triggerFileInput,
  handleFileChange,
  setPreviewImage,
  setFormData,
  fileInputRef,
  audioInputRef
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Cover Photo Upload */}
      <div className="space-y-2">
        <label 
          className="block text-sm font-medium"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Cover Photo
        </label>
        <div 
          className={`aspect-square border rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${previewImage ? 'p-0' : 'p-6'} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          style={{ 
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border)',
            '&:hover': {
              backgroundColor: isDarkMode ? 'var(--color-bg-tertiary)' : '#f3f4f6'
            }
          }}
          onClick={() => !loading && triggerFileInput('image')}
        >
          {previewImage ? (
            <div className="relative w-full h-full group">
              <img 
                src={previewImage} 
                alt="Cover preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!loading) {
                      setPreviewImage(null);
                      setFormData(prev => ({ ...prev, cover_photo: null }));
                      console.log('Removed cover photo');
                    }
                  }}
                  className="bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100"
                  disabled={loading}
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
              >
                <FiImage 
                  className="w-6 h-6" 
                  style={{ color: 'var(--color-text-secondary)' }}
                />
              </div>
              <p 
                className="font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Choose cover photo
              </p>
              <p 
                className="text-sm mt-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                JPG, PNG or GIF
              </p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            name="cover_photo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
        </div>
      </div>
      
      {/* Audio File Upload */}
      <div className="space-y-2">
        <label 
          className="block text-sm font-medium"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Audio File
        </label>
        <div 
          className={`w-full border rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all p-6 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          style={{ 
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: errors.audio_upload ? '#fca5a5' : 'var(--color-border)',
            '&:hover': {
              backgroundColor: isDarkMode ? 'var(--color-bg-tertiary)' : '#f3f4f6'
            }
          }}
          onClick={() => !loading && triggerFileInput('audio')}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
          >
            <FiMusic 
              className="w-6 h-6" 
              style={{ color: 'var(--color-text-secondary)' }}
            />
          </div>
          
          {formData.audio_upload ? (
            <>
              <p className="text-emerald-700 font-medium">File selected</p>
              <p 
                className="text-sm mt-1 text-center truncate max-w-full"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {formData.audio_upload.name}
              </p>
            </>
          ) : (
            <>
              <p 
                className="font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Choose audio file
              </p>
              <p 
                className="text-sm mt-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                MP3, WAV, FLAC or AAC
              </p>
            </>
          )}
          <input
            type="file"
            ref={audioInputRef}
            name="audio_upload"
            accept=".mp3,.wav,.flac,.aac"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
        </div>
        {errors.audio_upload && 
          <p className="text-rose-500 text-sm">{errors.audio_upload}</p>
        }
      </div>
    </div>
  );
};

export default FileUploadSection;