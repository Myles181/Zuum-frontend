import React from 'react';
import { FiImage, FiMusic, FiX } from 'react-icons/fi';

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
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Cover Photo Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Cover Photo</label>
        <div 
          className={`aspect-square bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-gray-100 ${previewImage ? 'p-0' : 'p-6'} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <FiImage className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-800 font-medium">Choose cover photo</p>
              <p className="text-gray-500 text-sm mt-1">JPG, PNG or GIF</p>
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
        <label className="block text-sm font-medium text-gray-700">Audio File</label>
        <div 
          className={`w-full  bg-gray-50 border ${errors.audio_upload ? 'border-rose-300' : 'border-gray-200'} rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all p-6 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          onClick={() => !loading && triggerFileInput('audio')}
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <FiMusic className="w-6 h-6 text-gray-400" />
          </div>
          
          {formData.audio_upload ? (
            <>
              <p className="text-emerald-700 font-medium">File selected</p>
              <p className="text-gray-500 text-sm mt-1 text-center truncate max-w-full">
                {formData.audio_upload.name}
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-800 font-medium">Choose audio file</p>
              <p className="text-gray-500 text-sm mt-1">MP3, WAV, FLAC or AAC</p>
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