import React from 'react';

const PlatformLinks = () => {
  return (
    <div className="platform-links bg-white p-4 rounded-lg shadow-md mb-6">
      <h4 className="text-gray-800 font-medium text-center mb-4">Streaming Platform Links</h4>
      <label className="platform-label block text-gray-700 font-medium mb-2">Apple Music</label>
      <input type="url" className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="" />
      <label className="platform-label block text-gray-700 font-medium mb-2">Spotify</label>
      <input type="url" className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="" />
      <label className="platform-label block text-gray-700 font-medium mb-2">Audiomack</label>
      <input type="url" className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="" />
      <label className="platform-label block text-gray-700 font-medium mb-2">Youtube Music</label>
      <input type="url" className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="" />
      <label className="platform-label block text-gray-700 font-medium mb-2">Boomplay Music</label>
      <input type="url" className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="" />
      <div className="save-button flex justify-center mt-6">
        <button className="svae-info bg-gray-100 text-green-500 px-6 py-3 rounded-full font-medium hover:bg-green-600 hover:text-white transition-colors duration-200">Save</button>
      </div>
      <div className="button-container flex justify-between mt-6">
        <button className="cancel-btn bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors duration-200">Cancel</button>
        <button className="submit-btn bg-green-800 text-white px-6 py-3 rounded-full font-medium hover:bg-green-800 transition-colors duration-200" id="upload-btn">Upload</button>
      </div>
    </div>
  );
};

export default PlatformLinks;