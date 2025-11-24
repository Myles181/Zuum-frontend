import React from 'react';
import { FaMusic } from 'react-icons/fa';

const MusicUpload = ({ handleMusicFileChange, musicFile }) => {
  return (
    <div className="upload-section bg-gray-100 border-2 border-dashed border-green-800 rounded-lg p-6 text-center cursor-pointer hover:bg-green-50 hover:border-green-800 transition-colors duration-300"
      onClick={() => document.getElementById('musicFile').click()}
    >
      <p className="text-green-800 font-medium mb-2">Choose beat file to upload</p>
      <small className="text-gray-500">Select MP3, WAV, FLAC or AAC</small>
      <input
        type="file"
        id="musicFile"
        accept=".mp3,.wav,.flac,.aac"
        onChange={handleMusicFileChange}
        className="hidden"
      />
      {musicFile && <p className="mt-2 text-gray-800">Selected: {musicFile.name}</p>}

      {/* Music Info Section */}
      <div className="music-info bg-white p-4 rounded-lg shadow-md flex items-center mt-4">
        <FaMusic className="music-icon w-8 h-8 text-green-800 mr-4" />
        <div>
          <div className="text-gray-800 font-medium">Beat</div>
          <small className="text-gray-500">Min: 5 seconds</small>
        </div>
      </div>
    </div>
  );
};

export default MusicUpload;