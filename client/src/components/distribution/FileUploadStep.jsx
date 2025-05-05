"use client"

import { useRef } from "react"
import { Upload, Music, ImageIcon, Check, X, AlertCircle } from "lucide-react"

const FileUploadStep = ({ formData, setFormData, errors, setErrors }) => {
  // Refs
  const audioInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const trackAudioRefs = useRef([])

  // Handle file uploads
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, coverArt: "Image exceeds 5MB limit" }))
        return
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png"]
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, coverArt: "Please upload JPG or PNG" }))
        return
      }

      setFormData((prev) => ({ ...prev, coverArt: file }))
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.coverArt
        return newErrors
      })
    }
  }

  const handleAudioChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (20MB max)
      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, audioFile: "Audio file exceeds 20MB limit" }))
        return
      }

      // Validate file type
      const validTypes = ["audio/mpeg", "audio/wav", "audio/flac"]
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, audioFile: "Please upload MP3, WAV, or FLAC" }))
        return
      }

      setFormData((prev) => ({ ...prev, audioFile: file }))
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.audioFile
        return newErrors
      })
    }
  }

  const handleTrackAudioChange = (e, index) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (20MB max)
      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [`track${index}Audio`]: "Audio file exceeds 20MB limit" }))
        return
      }

      // Validate file type
      const validTypes = ["audio/mpeg", "audio/wav", "audio/flac"]
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, [`track${index}Audio`]: "Please upload MP3, WAV, or FLAC" }))
        return
      }

      setFormData((prev) => {
        const newTracks = [...prev.tracks]
        newTracks[index] = {
          ...newTracks[index],
          audioFile: file,
        }
        return {
          ...prev,
          tracks: newTracks,
        }
      })

      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`track${index}Audio`]
        return newErrors
      })
    }
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <Upload className="text-[#247a63]" size={20} />
        Upload Files
      </h2>

      {/* Cover Art Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Cover Artwork</label>
        <div
          onClick={() => imageInputRef.current.click()}
          className={`border-2 border-dashed rounded-lg md:rounded-xl cursor-pointer hover:border-[#247a63] transition-all ${
            errors.coverArt
              ? "border-red-300 bg-red-50"
              : formData.coverArt
                ? "border-[#247a63]/30 bg-[#247a63]/5"
                : "border-gray-300"
          }`}
        >
          {formData.coverArt ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(formData.coverArt) || "/placeholder.svg"}
                alt="Cover preview"
                className="w-full h-48 md:h-80 object-cover rounded-lg md:rounded-xl"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFormData((prev) => ({ ...prev, coverArt: null }))
                }}
                className="absolute top-2 right-2 md:top-3 md:right-3 bg-white p-1.5 md:p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-4 rounded-b-lg md:rounded-b-xl">
                <p className="text-white font-medium truncate text-sm md:text-base">{formData.coverArt.name}</p>
                <p className="text-white/80 text-xs md:text-sm">
                  {(formData.coverArt.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-12 flex flex-col items-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-[#247a63]/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-[#247a63]" />
              </div>
              <p className="text-[#247a63] font-medium text-base md:text-lg">Click to upload artwork</p>
              <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2">JPG or PNG (max. 5MB)</p>
              <p className="text-gray-500 text-xs mt-2 md:mt-4">Recommended size: 3000x3000 pixels</p>
            </div>
          )}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        {errors.coverArt && (
          <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.coverArt}
          </p>
        )}
      </div>

      {/* Artwork Guidelines */}
      <div className="bg-[#247a63]/5 p-3 md:p-5 rounded-lg md:rounded-xl border border-[#247a63]/20">
        <h3 className="font-medium text-[#247a63] mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
          <ImageIcon size={16} />
          Artwork Guidelines
        </h3>
        <ul className="text-xs md:text-sm text-gray-600 space-y-1.5 md:space-y-2">
          <li className="flex items-start gap-2">
            <Check size={14} className="text-[#247a63] mt-0.5 flex-shrink-0" />
            Must be at least 3000 x 3000 pixels
          </li>
          <li className="flex items-start gap-2">
            <Check size={14} className="text-[#247a63] mt-0.5 flex-shrink-0" />
            No logos of other brands/platforms
          </li>
          <li className="flex items-start gap-2">
            <Check size={14} className="text-[#247a63] mt-0.5 flex-shrink-0" />
            No social media handles or links
          </li>
          <li className="flex items-start gap-2">
            <Check size={14} className="text-[#247a63] mt-0.5 flex-shrink-0" />
            No blurry, pixelated, or low-quality images
          </li>
        </ul>
      </div>

      {/* Audio Upload - Single */}
      {formData.releaseType === "single" && (
        <div className="space-y-2 mt-4 md:mt-6">
          <label className="block text-sm font-medium text-gray-700">Audio File</label>
          <div
            onClick={() => audioInputRef.current.click()}
            className={`border-2 border-dashed rounded-lg md:rounded-xl cursor-pointer hover:border-[#247a63] transition-all ${
              errors.audioFile
                ? "border-red-300 bg-red-50"
                : formData.audioFile
                  ? "border-[#247a63]/30 bg-[#247a63]/5"
                  : "border-gray-300"
            }`}
          >
            {formData.audioFile ? (
              <div className="relative p-4 md:p-6 flex items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#247a63] rounded-full flex items-center justify-center mr-3 md:mr-5 flex-shrink-0">
                  <Music className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate text-sm md:text-lg">{formData.audioFile.name}</p>
                  <p className="text-xs md:text-sm text-gray-500">
                    {(formData.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFormData((prev) => ({ ...prev, audioFile: null }))
                  }}
                  className="bg-gray-100 p-1.5 md:p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="p-8 md:p-12 flex flex-col items-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-[#247a63]/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <Music className="w-8 h-8 md:w-10 md:h-10 text-[#247a63]" />
                </div>
                <p className="text-[#247a63] font-medium text-base md:text-lg">Click to upload audio</p>
                <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2">MP3, WAV, or FLAC (max. 20MB)</p>
              </div>
            )}
            <input
              type="file"
              ref={audioInputRef}
              accept="audio/mpeg,audio/wav,audio/flac"
              onChange={handleAudioChange}
              className="hidden"
            />
          </div>
          {errors.audioFile && (
            <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.audioFile}
            </p>
          )}
        </div>
      )}

      {/* Audio Upload - Album */}
      {formData.releaseType === "album" && (
        <div className="space-y-3 md:space-y-4 mt-4 md:mt-6">
          <h3 className="font-medium text-base md:text-lg text-gray-800">Track Audio Files</h3>

          {formData.tracks.map((track, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Track {index + 1}: {track.title || `Untitled Track ${index + 1}`}
              </label>
              <div
                onClick={() => trackAudioRefs.current[index]?.click()}
                className={`border-2 border-dashed rounded-lg md:rounded-xl cursor-pointer hover:border-[#247a63] transition-all ${
                  errors[`track${index}Audio`]
                    ? "border-red-300 bg-red-50"
                    : track.audioFile
                      ? "border-[#247a63]/30 bg-[#247a63]/5"
                      : "border-gray-300"
                }`}
              >
                {track.audioFile ? (
                  <div className="relative p-3 md:p-4 flex items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#247a63] rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                      <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 truncate text-sm md:text-base">{track.audioFile.name}</p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {(track.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setFormData((prev) => {
                          const newTracks = [...prev.tracks]
                          newTracks[index] = {
                            ...newTracks[index],
                            audioFile: null,
                          }
                          return {
                            ...prev,
                            tracks: newTracks,
                          }
                        })
                      }}
                      className="bg-gray-100 p-1.5 md:p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 md:p-6 flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#247a63]/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
                      <Music className="w-6 h-6 md:w-8 md:h-8 text-[#247a63]" />
                    </div>
                    <p className="text-[#247a63] font-medium text-sm md:text-base">Click to upload track audio</p>
                    <p className="text-gray-500 text-xs mt-1">MP3, WAV, or FLAC (max. 20MB)</p>
                  </div>
                )}
                <input
                  id={`track-audio-${index}`}
                  type="file"
                  ref={(el) => (trackAudioRefs.current[index] = el)}
                  accept="audio/mpeg,audio/wav,audio/flac"
                  onChange={(e) => handleTrackAudioChange(e, index)}
                  className="hidden"
                />
              </div>
              {errors[`track${index}Audio`] && (
                <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors[`track${index}Audio`]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUploadStep
