"use client"

import { User, AlertCircle } from "lucide-react"

const ArtistProfileStep = ({ formData, setFormData, errors, setErrors }) => {
  // Dark mode styles
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151',
    '--color-error': '#ef4444',
    '--color-error-light': '#fca5a5'
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear related errors
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle nested object changes
  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))

    // Clear related errors
    if (errors[`${category}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`${category}.${field}`]
        return newErrors
      })
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (category, field) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field],
      },
    }))
  }

  return (
    <div style={darkModeStyles} className="space-y-5 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2"
          style={{ color: 'var(--color-text-primary)' }}>
        <User className="text-[#2D8C72]" size={20} />
        Artist Profile
      </h2>

      {/* Distribution History */}
      <div className="space-y-2">
        <label className="block text-sm font-medium"
               style={{ color: 'var(--color-text-secondary)' }}>
          Have you distributed before?
        </label>
        <select
          name="hasDistributed"
          value={formData.hasDistributed}
          onChange={handleChange}
          className={`w-full p-2.5 md:p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
            errors.hasDistributed 
              ? "border-red-500 ring-1 ring-red-500" 
              : "border-gray-600"
          }`}
          style={{ 
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)'
          }}
        >
          <option value="" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>Select...</option>
          <option value="yes" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>Yes — I already have a profile</option>
          <option value="no" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>No — I need to create a profile</option>
        </select>
        {errors.hasDistributed && (
          <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.hasDistributed}
          </p>
        )}
      </div>

      {/* Existing Profile Links */}
      {formData.hasDistributed === "yes" && (
        <div className="space-y-4 p-4 md:p-5 rounded-lg md:rounded-xl border"
             style={{ 
               backgroundColor: 'var(--color-bg-secondary)',
               borderColor: 'var(--color-border)'
             }}>
          <h3 className="font-medium text-base md:text-lg"
              style={{ color: 'var(--color-text-primary)' }}>
            Enter Your Existing Profiles
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium"
                   style={{ color: 'var(--color-text-secondary)' }}>
              Spotify URL
            </label>
            <input
              type="url"
              value={formData.existingProfiles.spotify}
              onChange={(e) => handleNestedChange("existingProfiles", "spotify", e.target.value)}
              placeholder="https://open.spotify.com/artist/..."
              className={`w-full p-2.5 md:p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
                errors["existingProfiles.spotify"] 
                  ? "border-red-500 ring-1 ring-red-500" 
                  : "border-gray-600"
              }`}
              style={{ 
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)'
              }}
            />
            {errors["existingProfiles.spotify"] && (
              <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors["existingProfiles.spotify"]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium"
                   style={{ color: 'var(--color-text-secondary)' }}>
              Apple Music URL
            </label>
            <input
              type="url"
              value={formData.existingProfiles.appleMusic}
              onChange={(e) => handleNestedChange("existingProfiles", "appleMusic", e.target.value)}
              placeholder="https://music.apple.com/artist/..."
              className={`w-full p-2.5 md:p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
                errors["existingProfiles.appleMusic"] 
                  ? "border-red-500 ring-1 ring-red-500" 
                  : "border-gray-600"
              }`}
              style={{ 
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)'
              }}
            />
            {errors["existingProfiles.appleMusic"] && (
              <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors["existingProfiles.appleMusic"]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium"
                   style={{ color: 'var(--color-text-secondary)' }}>
              YouTube Music URL
            </label>
            <input
              type="url"
              value={formData.existingProfiles.youtubeMusic}
              onChange={(e) => handleNestedChange("existingProfiles", "youtubeMusic", e.target.value)}
              placeholder="https://music.youtube.com/channel/..."
              className={`w-full p-2.5 md:p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
                errors["existingProfiles.youtubeMusic"] 
                  ? "border-red-500 ring-1 ring-red-500" 
                  : "border-gray-600"
              }`}
              style={{ 
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)'
              }}
            />
            {errors["existingProfiles.youtubeMusic"] && (
              <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors["existingProfiles.youtubeMusic"]}
              </p>
            )}
          </div>
        </div>
      )}

      {/* New Artist Profile */}
      {formData.hasDistributed === "no" && (
        <div className="space-y-4 p-4 md:p-5 rounded-lg md:rounded-xl border"
             style={{ 
               backgroundColor: 'var(--color-bg-secondary)',
               borderColor: 'var(--color-border)'
             }}>
          <h3 className="font-medium text-base md:text-lg"
              style={{ color: 'var(--color-text-primary)' }}>
            Create New Artist Profile
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium"
                   style={{ color: 'var(--color-text-secondary)' }}>
              Artist Name
            </label>
            <input
              type="text"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              placeholder="Enter Artist Name"
              className={`w-full p-2.5 md:p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
                errors.artistName 
                  ? "border-red-500 ring-1 ring-red-500" 
                  : "border-gray-600"
              }`}
              style={{ 
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)'
              }}
            />
            {errors.artistName && (
              <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.artistName}
              </p>
            )}
          </div>

          <div className="mt-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.agreements.nameAck}
                onChange={() => handleCheckboxChange("agreements", "nameAck")}
                className="w-4 h-4 md:w-5 md:h-5 rounded focus:ring-[#2D8C72]"
                style={{ 
                  color: '#2D8C72',
                  backgroundColor: formData.agreements.nameAck ? '#2D8C72' : 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border)'
                }}
              />
              <span className="text-sm md:text-base"
                    style={{ color: 'var(--color-text-secondary)' }}>
                I confirm I own this Artist Name
              </span>
            </label>
            {errors["agreements.nameAck"] && (
              <p className="text-red-500 text-xs md:text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors["agreements.nameAck"]}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtistProfileStep