import React from 'react';

const PlatformLinks = ({ onBoomplayChange, onAppleMusicChange, onSpotifyChange, onAudiomarkChange, onYoutubeMusicChange }) => {
  return (
    <div className="platform-links mt-6">
      <h4 className="text-gray-800 font-medium text-center mb-4">Streaming Links</h4>
      
      <label className="platform-label block text-gray-700 font-medium mb-2">Boomplay</label>
      <input
        type="text"
        className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 mb-4"
        placeholder="Enter Boomplay link"
        onChange={onBoomplayChange}
      />

      <label className="platform-label block text-gray-700 font-medium mb-2">Apple Music</label>
      <input
        type="text"
        className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 mb-4"
        placeholder="Enter Apple Music link"
        onChange={onAppleMusicChange}
      />

      <label className="platform-label block text-gray-700 font-medium mb-2">Spotify</label>
      <input
        type="text"
        className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 mb-4"
        placeholder="Enter Spotify link"
        onChange={onSpotifyChange}
      />

      <label className="platform-label block text-gray-700 font-medium mb-2">Audiomark</label>
      <input
        type="text"
        className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 mb-4"
        placeholder="Enter Audiomark link"
        onChange={onAudiomarkChange}
      />

      <label className="platform-label block text-gray-700 font-medium mb-2">YouTube Music</label>
      <input
        type="text"
        className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 mb-4"
        placeholder="Enter YouTube Music link"
        onChange={onYoutubeMusicChange}
      />
    </div>
  );
};

export default PlatformLinks;