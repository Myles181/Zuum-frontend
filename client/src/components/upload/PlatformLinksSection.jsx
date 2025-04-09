import React from 'react';
import { FaSpotify, FaApple, FaYoutube} from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';

const PlatformLinksSection = ({ formData, errors, loading, handleChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Streaming Platform Links
        </label>
        <span className="text-xs text-gray-500">At least one required</span>
      </div>
      
      <div className="space-y-3">
        {/* Spotify */}
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-emerald-200 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
          <div className="bg-emerald-50 p-3">
            <FaSpotify className="text-xl text-emerald-700" />
          </div>
          <input
            type="url"
            name="spotify"
            value={formData.spotify}
            onChange={handleChange}
            placeholder="Spotify link"
            className="flex-1 p-3 focus:outline-none text-sm"
            disabled={loading}
          />
        </div>
        
        {/* Apple Music */}
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-emerald-200 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
          <div className="bg-emerald-50 p-3">
            <FaApple className="text-xl text-emerald-700" />
          </div>
          <input
            type="url"
            name="apple_music"
            value={formData.apple_music}
            onChange={handleChange}
            placeholder="Apple Music link"
            className="flex-1 p-3 focus:outline-none text-sm"
            disabled={loading}
          />
        </div>
        
        {/* YouTube Music */}
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-emerald-200 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
          <div className="bg-emerald-50 p-3">
            <FaYoutube className="text-xl text-emerald-700" />
          </div>
          <input
            type="url"
            name="youtube_music"
            value={formData.youtube_music}
            onChange={handleChange}
            placeholder="YouTube Music link"
            className="flex-1 p-3 focus:outline-none text-sm"
            disabled={loading}
          />
        </div>
        
        {/* Other Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Boomplay */}
          <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-emerald-200 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
            <div className="bg-emerald-50 p-3">
              <FiLink className="text-xl text-emerald-700" />
            </div>
            <input
              type="url"
              name="boomplay"
              value={formData.boomplay}
              onChange={handleChange}
              placeholder="Boomplay link"
              className="flex-1 p-3 focus:outline-none text-sm"
              disabled={loading}
            />
          </div>
          
          {/* Audiomark */}
          <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-emerald-200 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
            <div className="bg-emerald-50 p-3">
              <FiLink className="text-xl text-emerald-700" />
            </div>
            <input
              type="url"
              name="audiomark"
              value={formData.audiomark}
              onChange={handleChange}
              placeholder="Audiomark link"
              className="flex-1 p-3 focus:outline-none text-sm"
              disabled={loading}
            />
          </div>
        </div>
      </div>
      {errors.platforms && <p className="text-rose-500 text-sm mt-1">{errors.platforms}</p>}
    </div>
  );
};

export default PlatformLinksSection;