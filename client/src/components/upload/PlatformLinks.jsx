import React from 'react';

const PlatformLinks = () => {
  return (
    <div className="platform-links">
      <h4 className="text-gray-800 font-medium text-center mb-4">Account Details</h4>
      <label className="platform-label block text-gray-700 font-medium mb-2">Account Name</label>
      <input type="text" className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="" />
      <label className="platform-label block text-gray-700 font-medium mb-2">Account Number</label>
      <input type="text" className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="" />
      <label className="platform-label block text-gray-700 font-medium mb-2">Name of Bank</label>
      <input type="text" className="platform-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="" />
      <div className="save-button flex justify-center mt-6">
        <button className="svae-info bg-green-800 text-white px-6 py-3 rounded-full font-medium hover:bg-green-800 transition-colors duration-200">Save</button>
      </div>
      <div className="button-container flex justify-between mt-6">
        <button className="cancel-btn bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors duration-200">Cancel</button>
        <button className="submit-btn bg-green-800 text-white px-6 py-3 rounded-full font-medium hover:bg-green-800 transition-colors duration-200" id="upload-btn">Upload</button>
      </div>
    </div>
  );
};

export default PlatformLinks;