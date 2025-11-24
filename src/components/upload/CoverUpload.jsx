import React, { useState } from 'react';

const CoverUpload = ({ handleCoverFileChange, coverPreview, setIsEditing }) => {
  return (
    <div
      className="cover-section mt-10 mb-10 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-green-50 hover:border-green-800 transition-colors duration-300"
      onClick={() => document.getElementById('coverFile').click()}
    >
      <div id="coverPlaceholder" className={!coverPreview ? 'block' : 'hidden'}>
        <p className="text-gray-500">Choose a cover photo</p>
      </div>
      <div className="cover-preview relative" style={{ display: coverPreview ? 'block' : 'none' }}>
        <img id="coverImage" src={coverPreview} alt="Cover Image" className="w-full h-full object-cover" />
        <button className="edit-btn absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 text-xl cursor-pointer shadow-md" onClick={() => setIsEditing(true)}>
          ✏️
        </button>
      </div>
      <input
        type="file"
        id="coverFile"
        accept="image/*"
        onChange={handleCoverFileChange}
        className="hidden"
      />
    </div>
  );
};

export default CoverUpload;