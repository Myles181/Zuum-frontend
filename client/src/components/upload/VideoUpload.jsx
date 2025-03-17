import React from 'react';
import { FaPlus } from 'react-icons/fa';

const VideoUpload = ({ handleVideoFileChange, videoPreview, openEditor }) => {
  return (
<div className="upload-section mb-10 flex flex-col justify-center items-center bg-gray-100 border-2 border-dashed border-green-800 rounded-lg p-6 text-center cursor-pointer hover:bg-green-50 hover:border-green-800 transition-colors duration-300"
     onClick={() => document.getElementById('file-input').click()}
    >
        <FaPlus className="upload-icon w-10 h-10 mb-2 text-green-800" />
        <p className="upload-text text-green-800 font-medium">Choose a video</p>
        <input
          type="file"
          id="file-input"
          accept="video/*"
          onChange={handleVideoFileChange}
          className="hidden"
        />
        <div className="video-container relative w-full h-full mt-4" style={{ display: videoPreview ? 'block' : 'none' }}>
          <video id="preview-video" className="w-full h-full object-cover rounded-lg" controls></video>
          <button className="edit-button absolute top-2 right-2 bg-gray-800 bg-opacity-80 rounded-full px-2 py-1 text-xl cursor-pointer shadow-md" onClick={openEditor}>
            ✏️
          </button>
        </div>
     
    </div>

    
  );
};

export default VideoUpload;
