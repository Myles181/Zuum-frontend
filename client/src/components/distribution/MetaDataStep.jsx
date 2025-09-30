"use client"

import React from 'react';
import { Tag, Copyright, AlertCircle, Plus, X } from "lucide-react"

const MetadataStep = ({ formData, setFormData, errors, setErrors }) => {
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

  // Songwriter management
  const addSongwriter = () => {
    setFormData((prev) => ({
      ...prev,
      songwriters: [...prev.songwriters, ""],
    }))
  }

  const removeSongwriter = (index) => {
    if (formData.songwriters.length > 1) {
      setFormData((prev) => ({
        ...prev,
        songwriters: prev.songwriters.filter((_, i) => i !== index),
      }))
    }
  }

  const handleSongwriterChange = (index, value) => {
    setFormData((prev) => {
      const newSongwriters = [...prev.songwriters]
      newSongwriters[index] = value
      return {
        ...prev,
        songwriters: newSongwriters,
      }
    })
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
        <Tag className="text-[#2D8C72]" size={20} />
        Metadata & Rights
      </h2>

      {/* Genre */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Primary Genre</label>
        <select
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className={`w-full p-2.5 md:p-3 rounded-lg bg-[#2d2d2d] border ${
            errors.genre ? "border-red-500 ring-1 ring-red-500" : "border-[#374151]"
          } text-white focus:outline-none focus:ring-2 focus:ring-[#2D8C72] transition-all text-sm md:text-base`}
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
        {errors.genre && (
          <p className="text-red-400 text-xs md:text-sm flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.genre}
          </p>
        )}
      </div>

      {/* Secondary Genre */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Secondary Genre (Optional)</label>
        <select
          name="secondaryGenre"
          value={formData.secondaryGenre}
          onChange={handleChange}
          className="w-full p-2.5 md:p-3 rounded-lg bg-[#2d2d2d] border border-[#374151] text-white focus:outline-none focus:ring-2 focus:ring-[#2D8C72] transition-all text-sm md:text-base"
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

      {/* Release Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Release Date</label>
        <input
          type="date"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className={`w-full p-2.5 md:p-3 rounded-lg bg-[#2d2d2d] border ${
            errors.releaseDate ? "border-red-500 ring-1 ring-red-500" : "border-[#374151]"
          } text-white focus:outline-none focus:ring-2 focus:ring-[#2D8C72] transition-all text-sm md:text-base`}
        />
        {errors.releaseDate && (
          <p className="text-red-400 text-xs md:text-sm flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.releaseDate}
          </p>
        )}
      </div>

      {/* Explicit Content */}
      <div className="p-3 md:p-4 bg-[#2d2d2d] border border-[#374151] rounded-lg md:rounded-xl">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.isExplicit}
            onChange={() => setFormData((prev) => ({ ...prev, isExplicit: !prev.isExplicit }))}
            className="w-4 h-4 md:w-5 md:h-5 text-[#2D8C72] rounded focus:ring-[#2D8C72]"
          />
          <span className="text-gray-300 text-sm md:text-base">Contains explicit content</span>
        </label>
      </div>

      {/* Copyright */}
      <div className="space-y-4 p-3 md:p-5 bg-[#2d2d2d] rounded-lg md:rounded-xl border border-[#374151]">
        <h3 className="font-medium text-base md:text-lg text-white flex items-center gap-2">
          <Copyright className="text-[#2D8C72]" size={18} />
          Copyright Information
        </h3>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Copyright Year</label>
          <select
            value={formData.copyright.year}
            onChange={(e) => handleNestedChange("copyright", "year", e.target.value)}
            className="w-full p-2.5 md:p-3 rounded-lg bg-[#1a1a1a] border border-[#374151] text-white focus:outline-none focus:ring-2 focus:ring-[#2D8C72] transition-all text-sm md:text-base"
          >
            {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Copyright Owner</label>
          <input
            type="text"
            value={formData.copyright.owner}
            onChange={(e) => handleNestedChange("copyright", "owner", e.target.value)}
            placeholder="Enter copyright owner name"
            className={`w-full p-2.5 md:p-3 rounded-lg bg-[#1a1a1a] border ${
              errors["copyright.owner"] ? "border-red-500 ring-1 ring-red-500" : "border-[#374151]"
            } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] transition-all text-sm md:text-base`}
          />
          {errors["copyright.owner"] && (
            <p className="text-red-400 text-xs md:text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {errors["copyright.owner"]}
            </p>
          )}
        </div>
      </div>

      {/* Record Label */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Do you have a record label?</label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, recordLabel: "no" }))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              formData.recordLabel === "no"
                ? "bg-[#2D8C72] text-white shadow-md"
                : "bg-[#2d2d2d] border border-[#374151] text-gray-300 hover:bg-[#374151]"
            } text-sm md:text-base`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, recordLabel: "yes" }))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              formData.recordLabel === "yes"
                ? "bg-[#2D8C72] text-white shadow-md"
                : "bg-[#2d2d2d] border border-[#374151] text-gray-300 hover:bg-[#374151]"
            } text-sm md:text-base`}
          >
            Yes
          </button>
        </div>
      </div>

      {/* Record Label Name */}
      {formData.recordLabel === "yes" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Record Label Name</label>
          <input
            type="text"
            name="recordLabelName"
            value={formData.recordLabelName}
            onChange={handleChange}
            placeholder="Enter your record label name"
            className="w-full p-2.5 md:p-3 rounded-lg bg-[#2d2d2d] border border-[#374151] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] transition-all text-sm md:text-base"
          />
        </div>
      )}

      {/* Songwriter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Who wrote this song?</label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, songwriter: "self" }))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              formData.songwriter === "self"
                ? "bg-[#2D8C72] text-white shadow-md"
                : "bg-[#2d2d2d] border border-[#374151] text-gray-300 hover:bg-[#374151]"
            } text-sm md:text-base`}
          >
            I wrote this song myself
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, songwriter: "other" }))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              formData.songwriter === "other"
                ? "bg-[#2D8C72] text-white shadow-md"
                : "bg-[#2d2d2d] border border-[#374151] text-gray-300 hover:bg-[#374151]"
            } text-sm md:text-base`}
          >
            Another artist wrote this
          </button>
        </div>
      </div>

      {/* Songwriters */}
      {formData.songwriter === "self" && (
        <div className="space-y-4 p-3 md:p-5 bg-[#2d2d2d] rounded-lg md:rounded-xl border border-[#374151]">
          <h3 className="font-medium text-base md:text-lg text-white">Songwriters</h3>

          {formData.songwriters.map((songwriter, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={songwriter}
                onChange={(e) => handleSongwriterChange(index, e.target.value)}
                placeholder="Enter songwriter name"
                className="flex-1 p-2.5 md:p-3 rounded-lg bg-[#1a1a1a] border border-[#374151] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] transition-all text-sm md:text-base"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeSongwriter(index)}
                  className="p-2.5 md:p-3 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addSongwriter}
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-[#374151] text-gray-300 rounded-lg hover:bg-[#4b5563] transition-colors text-sm md:text-base"
          >
            <Plus size={16} /> Add Songwriter
          </button>

          {errors.songwriters && (
            <p className="text-red-400 text-xs md:text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.songwriters}
            </p>
          )}
        </div>
      )}

      {/* Cover Song Warning */}
      {formData.songwriter === "other" && (
        <div className="p-3 md:p-5 bg-red-900/20 text-red-400 rounded-lg md:rounded-xl border border-red-800/50">
          <h3 className="font-medium text-base md:text-lg flex items-center gap-2 mb-2">
            <AlertCircle size={18} />
            Important Notice
          </h3>
          <p className="text-sm md:text-base">
            We currently do not support cover song distribution. Please only upload original songs that you wrote
            yourself.
          </p>
        </div>
      )}

      {/* Lyrics - Single Only */}
      {formData.releaseType === "single" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Lyrics</label>
          <textarea
            name="lyrics"
            value={formData.lyrics}
            onChange={handleChange}
            rows={5}
            placeholder="Enter song lyrics here..."
            className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-[#2d2d2d] border ${
              errors.lyrics ? "border-red-500 ring-1 ring-red-500" : "border-[#374151]"
            } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] transition-all text-sm md:text-base`}
          ></textarea>
          {errors.lyrics && (
            <p className="text-red-400 text-xs md:text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.lyrics}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default MetadataStep