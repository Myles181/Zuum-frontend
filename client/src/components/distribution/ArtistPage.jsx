"use client"

import { User, AlertCircle } from "lucide-react"

const ArtistProfileStep = ({ formData, setFormData, errors, setErrors }) => {
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
    <div className="space-y-5 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <User className="text-[#247a63]" size={20} />
        Artist Profile
      </h2>

      {/* Distribution History */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Have you distributed before?</label>
        <select
          name="hasDistributed"
          value={formData.hasDistributed}
          onChange={handleChange}
          className={`w-full p-2.5 md:p-3 rounded-lg bg-white border ${
            errors.hasDistributed ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-[#247a63] transition-all text-sm md:text-base`}
        >
          <option value="">Select...</option>
          <option value="yes">Yes — I already have a profile</option>
          <option value="no">No — I need to create a profile</option>
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
        <div className="space-y-4 p-4 md:p-5 bg-gray-50 rounded-lg md:rounded-xl border border-gray-200">
          <h3 className="font-medium text-base md:text-lg text-gray-800">Enter Your Existing Profiles</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Spotify URL</label>
            <input
              type="url"
              value={formData.existingProfiles.spotify}
              onChange={(e) => handleNestedChange("existingProfiles", "spotify", e.target.value)}
              placeholder="https://open.spotify.com/artist/..."
              className={`w-full p-2.5 md:p-3 rounded-lg bg-white border ${
                errors["existingProfiles.spotify"] ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-[#247a63] transition-all text-sm md:text-base`}
            />
            {errors["existingProfiles.spotify"] && (
              <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors["existingProfiles.spotify"]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Apple Music URL</label>
            <input
              type="url"
              value={formData.existingProfiles.appleMusic}
              onChange={(e) => handleNestedChange("existingProfiles", "appleMusic", e.target.value)}
              placeholder="https://music.apple.com/artist/..."
              className={`w-full p-2.5 md:p-3 rounded-lg bg-white border ${
                errors["existingProfiles.appleMusic"] ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-[#247a63] transition-all text-sm md:text-base`}
            />
            {errors["existingProfiles.appleMusic"] && (
              <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors["existingProfiles.appleMusic"]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">YouTube Music URL</label>
            <input
              type="url"
              value={formData.existingProfiles.youtubeMusic}
              onChange={(e) => handleNestedChange("existingProfiles", "youtubeMusic", e.target.value)}
              placeholder="https://music.youtube.com/channel/..."
              className={`w-full p-2.5 md:p-3 rounded-lg bg-white border ${
                errors["existingProfiles.youtubeMusic"] ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-[#247a63] transition-all text-sm md:text-base`}
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
        <div className="space-y-4 p-4 md:p-5 bg-gray-50 rounded-lg md:rounded-xl border border-gray-200">
          <h3 className="font-medium text-base md:text-lg text-gray-800">Create New Artist Profile</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Artist Name</label>
            <input
              type="text"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              placeholder="Enter Artist Name"
              className={`w-full p-2.5 md:p-3 rounded-lg bg-white border ${
                errors.artistName ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-[#247a63] transition-all text-sm md:text-base`}
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
                className="w-4 h-4 md:w-5 md:h-5 text-[#247a63] rounded focus:ring-[#247a63]"
              />
              <span className="text-gray-700 text-sm md:text-base">I confirm I own this Artist Name</span>
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
