"use client"

import { Music, FileMusic, ListMusic, AlertCircle } from "lucide-react"

const ReleaseInfoStep = ({ formData, setFormData, errors, setErrors }) => {
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

  // Handle track changes
  const handleTrackChange = (index, field, value) => {
    setFormData((prev) => {
      const newTracks = [...prev.tracks]
      newTracks[index] = {
        ...newTracks[index],
        [field]: value,
      }
      return {
        ...prev,
        tracks: newTracks,
      }
    })

    // Clear related errors
    if (errors[`track${index}${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`track${index}${field}`]
        return newErrors
      })
    }
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <Music className="text-[#247a63]" size={20} />
        Release Information
      </h2>

      {/* Release Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Release Type</label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, releaseType: "single" }))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              formData.releaseType === "single"
                ? "bg-[#247a63] text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            } text-sm md:text-base`}
          >
            <FileMusic size={16} /> Single
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, releaseType: "album" }))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              formData.releaseType === "album"
                ? "bg-[#247a63] text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            } text-sm md:text-base`}
          >
            <ListMusic size={16} /> Album
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {formData.releaseType === "single" ? "Track Title" : "Album Title"}
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full p-2.5 md:p-3 rounded-lg bg-white border ${
            errors.title ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-[#247a63] transition-all text-sm md:text-base`}
          placeholder={`Enter ${formData.releaseType === "single" ? "track" : "album"} title`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.title}
          </p>
        )}
      </div>

      {/* Album Tracks */}
      {formData.releaseType === "album" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Number of Tracks</label>
            <select
              name="numberOfTracks"
              value={formData.numberOfTracks}
              onChange={handleChange}
              className="w-full p-2.5 md:p-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#247a63] transition-all text-sm md:text-base"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                <option key={num} value={num}>
                  {num} Tracks
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 mt-4">
            <h3 className="font-medium text-base md:text-lg text-gray-800">Track Information</h3>

            {formData.tracks.map((track, index) => (
              <div key={index} className="p-3 md:p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="font-medium text-[#247a63] mb-2 md:mb-3 text-sm md:text-base">Track {index + 1}</h4>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Track Title</label>
                    <input
                      type="text"
                      value={track.title}
                      onChange={(e) => handleTrackChange(index, "title", e.target.value)}
                      placeholder="Enter track title"
                      className={`w-full p-2.5 md:p-3 rounded-lg bg-white border ${
                        errors[`track${index}Title`] ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-[#247a63] transition-all text-sm md:text-base`}
                    />
                    {errors[`track${index}Title`] && (
                      <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors[`track${index}Title`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Featured Artist (Optional)</label>
                    <input
                      type="text"
                      value={track.featuredArtist}
                      onChange={(e) => handleTrackChange(index, "featuredArtist", e.target.value)}
                      placeholder="Enter featured artist name"
                      className="w-full p-2.5 md:p-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#247a63] transition-all text-sm md:text-base"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Genre</label>
                    <select
                      value={track.genre}
                      onChange={(e) => handleTrackChange(index, "genre", e.target.value)}
                      className="w-full p-2.5 md:p-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#247a63] transition-all text-sm md:text-base"
                    >
                      <option value="">Select genre</option>
                      <option value="pop">Pop</option>
                      <option value="rock">Rock</option>
                      <option value="hip-hop">Hip-Hop</option>
                      <option value="electronic">Electronic</option>
                      <option value="jazz">Jazz</option>
                      <option value="classical">Classical</option>
                      <option value="r&b">R&B</option>
                      <option value="country">Country</option>
                      <option value="folk">Folk</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReleaseInfoStep
