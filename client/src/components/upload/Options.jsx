import React from 'react';
import { FaUserTag, FaGlobe, FaMapMarkerAlt, FaAngleRight } from 'react-icons/fa';

const Options = () => {
  return (
    <div className="option-wrapper bg-white p-2 rounded-lg shadow-md mb-6">
      <div className="option-row flex justify-between items-center pb-4 border-b border-gray-200">
        <div className="option-left flex items-center gap-2">
          <FaUserTag className="w-6 h-6 text-green-800" />
          <span>Tag people</span>
        </div>
        <FaAngleRight className="w-6 h-6 text-gray-500" />
      </div>
      <div className="option-row flex justify-between items-center py-4 border-b border-gray-200 privacy">
        <div className="option-left flex items-center gap-2">
          <FaGlobe className="w-6 h-6 text-green-800" />
          <span>Everyone can view</span>
        </div>
        <FaAngleRight className="w-6 h-6 text-gray-500" />
      </div>
      <div className="option-row flex justify-between items-center pt-4">
        <div className="option-left flex items-center gap-2">
          <FaMapMarkerAlt className="w-6 h-6 text-green-800" />
          <span>Add location</span>
        </div>
        <FaAngleRight className="w-6 h-6 text-gray-500" />
      </div>
    </div>
  );
};

export default Options;