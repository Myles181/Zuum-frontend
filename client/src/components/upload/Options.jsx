import React, { useState } from 'react';
import { FaUserTag, FaGlobe, FaMapMarkerAlt, FaAngleRight } from 'react-icons/fa';

const Options = ({
  taggedPeople,
  setTaggedPeople,
  isPublic,
  setIsPublic,
  location,
  setLocation,
}) => {
  const [showTagModal, setShowTagModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleTagPeople = () => {
    setShowTagModal(true);
    // In a real app, you would open a modal or dropdown to select people to tag
    console.log('Open a modal to tag people');
  };

  const handlePrivacy = () => {
    setShowPrivacyModal(true);
    // In a real app, you would open a modal or dropdown to select privacy settings
    console.log('Open a modal to toggle privacy');
  };

  const handleLocation = () => {
    setShowLocationModal(true);
    // In a real app, you would open a modal or dropdown to add a location
    console.log('Open a modal to add location');
  };

  return (
    <div className="option-wrapper bg-white p-2 rounded-lg shadow-md mb-6">
      {/* Tag People Option */}
      <div
        className="option-row flex justify-between items-center pb-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleTagPeople}
      >
        <div className="option-left flex items-center gap-2">
          <FaUserTag className="w-6 h-6 text-green-800" />
          <span>Tag people</span>
        </div>
        <FaAngleRight className="w-6 h-6 text-gray-500" />
      </div>

      {/* Privacy Option */}
      <div
        className="option-row flex justify-between items-center py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handlePrivacy}
      >
        <div className="option-left flex items-center gap-2">
          <FaGlobe className="w-6 h-6 text-green-800" />
          <span>{isPublic ? 'Everyone can view' : 'Only you can view'}</span>
        </div>
        <FaAngleRight className="w-6 h-6 text-gray-500" />
      </div>

      {/* Add Location Option */}
      <div
        className="option-row flex justify-between items-center pt-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleLocation}
      >
        <div className="option-left flex items-center gap-2">
          <FaMapMarkerAlt className="w-6 h-6 text-green-800" />
          <span>{location || 'Add location'}</span>
        </div>
        <FaAngleRight className="w-6 h-6 text-gray-500" />
      </div>

      {/* Modals (Placeholder) */}
      {showTagModal && (
        <div className="modal">
          <p>Tag people modal (to be implemented)</p>
          <button onClick={() => setShowTagModal(false)}>Close</button>
        </div>
      )}
      {showPrivacyModal && (
        <div className="modal">
          <p>Privacy modal (to be implemented)</p>
          <button onClick={() => setShowPrivacyModal(false)}>Close</button>
        </div>
      )}
      {showLocationModal && (
        <div className="modal">
          <p>Location modal (to be implemented)</p>
          <button onClick={() => setShowLocationModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Options;