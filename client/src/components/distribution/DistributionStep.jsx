"use client"

import { Globe, DollarSign, AlertCircle, Check } from "lucide-react"

const DistributionStep = ({ formData, setFormData, errors, setErrors }) => {
  // Handle platform toggles
  const handlePlatformToggle = (platform) => {
    setFormData((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform],
      },
    }))
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
        <Globe className="text-[#247a63]" size={20} />
        Distribution & Agreements
      </h2>

      {/* Platform Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Do you want your music on all platforms?</label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, allPlatforms: true }))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              formData.allPlatforms
                ? "bg-[#247a63] text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            } text-sm md:text-base`}
          >
            Yes, all platforms
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, allPlatforms: false }))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              !formData.allPlatforms
                ? "bg-[#247a63] text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            } text-sm md:text-base`}
          >
            No, select specific platforms
          </button>
        </div>
      </div>

      {/* Platform Checkboxes */}
      {!formData.allPlatforms && (
        <div className="space-y-3 p-3 md:p-5 bg-gray-50 rounded-lg md:rounded-xl border border-gray-200">
          <h3 className="font-medium text-base md:text-lg text-gray-800">Choose platforms:</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mt-3">
            <button
              type="button"
              onClick={() => handlePlatformToggle("spotify")}
              className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                formData.platforms.spotify
                  ? "bg-[#247a63] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                  formData.platforms.spotify ? "bg-white" : "bg-gray-100"
                }`}
              >
                {formData.platforms.spotify && <Check size={12} className="text-[#247a63]" />}
              </span>
              <span className="font-medium text-sm md:text-base">Spotify</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlatformToggle("appleMusic")}
              className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                formData.platforms.appleMusic
                  ? "bg-[#247a63] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                  formData.platforms.appleMusic ? "bg-white" : "bg-gray-100"
                }`}
              >
                {formData.platforms.appleMusic && <Check size={12} className="text-[#247a63]" />}
              </span>
              <span className="font-medium text-sm md:text-base">Apple Music</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlatformToggle("youtubeMusic")}
              className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                formData.platforms.youtubeMusic
                  ? "bg-[#247a63] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                  formData.platforms.youtubeMusic ? "bg-white" : "bg-gray-100"
                }`}
              >
                {formData.platforms.youtubeMusic && <Check size={12} className="text-[#247a63]" />}
              </span>
              <span className="font-medium text-sm md:text-base">YouTube Music</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlatformToggle("amazonMusic")}
              className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                formData.platforms.amazonMusic
                  ? "bg-[#247a63] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                  formData.platforms.amazonMusic ? "bg-white" : "bg-gray-100"
                }`}
              >
                {formData.platforms.amazonMusic && <Check size={12} className="text-[#247a63]" />}
              </span>
              <span className="font-medium text-sm md:text-base">Amazon Music</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlatformToggle("tidal")}
              className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                formData.platforms.tidal
                  ? "bg-[#247a63] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                  formData.platforms.tidal ? "bg-white" : "bg-gray-100"
                }`}
              >
                {formData.platforms.tidal && <Check size={12} className="text-[#247a63]" />}
              </span>
              <span className="font-medium text-sm md:text-base">Tidal</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlatformToggle("deezer")}
              className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                formData.platforms.deezer
                  ? "bg-[#247a63] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                  formData.platforms.deezer ? "bg-white" : "bg-gray-100"
                }`}
              >
                {formData.platforms.deezer && <Check size={12} className="text-[#247a63]" />}
              </span>
              <span className="font-medium text-sm md:text-base">Deezer</span>
            </button>
          </div>

          {errors.platforms && (
            <p className="text-red-500 text-xs md:text-sm flex items-center gap-1 mt-2">
              <AlertCircle size={14} />
              {errors.platforms}
            </p>
          )}
        </div>
      )}

      {/* Promotion Packages */}
      <div className="space-y-4 p-3 md:p-5 bg-gray-50 rounded-lg md:rounded-xl border border-gray-200">
        <h3 className="font-medium text-base md:text-lg text-gray-800 flex items-center gap-2">
          <DollarSign className="text-[#247a63]" size={18} />
          Promotion Packages
        </h3>

        <div className="space-y-2 md:space-y-3 mt-2">
          <div
            className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all ${
              formData.promotionPackage === "none"
                ? "border-[#247a63] bg-[#247a63]/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            onClick={() => setFormData((prev) => ({ ...prev, promotionPackage: "none" }))}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm md:text-base">No Promotion</h4>
              <div
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${
                  formData.promotionPackage === "none" ? "border-[#247a63] bg-[#247a63]" : "border-gray-300"
                }`}
              >
                {formData.promotionPackage === "none" && <Check size={10} className="text-white" />}
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Distribute your music without additional promotion</p>
          </div>

          <div
            className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all ${
              formData.promotionPackage === "basic"
                ? "border-[#247a63] bg-[#247a63]/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            onClick={() => setFormData((prev) => ({ ...prev, promotionPackage: "basic" }))}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm md:text-base">Basic Package — ₦20,000</h4>
              <div
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${
                  formData.promotionPackage === "basic" ? "border-[#247a63] bg-[#247a63]" : "border-gray-300"
                }`}
              >
                {formData.promotionPackage === "basic" && <Check size={10} className="text-white" />}
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Get on 5 curated playlists, social media shoutouts</p>
          </div>

          <div
            className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all ${
              formData.promotionPackage === "standard"
                ? "border-[#247a63] bg-[#247a63]/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            onClick={() => setFormData((prev) => ({ ...prev, promotionPackage: "standard" }))}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm md:text-base">Standard Package — ₦50,000</h4>
              <div
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${
                  formData.promotionPackage === "standard" ? "border-[#247a63] bg-[#247a63]" : "border-gray-300"
                }`}
              >
                {formData.promotionPackage === "standard" && <Check size={10} className="text-white" />}
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Get on 15 curated playlists, blog feature, TikTok promo
            </p>
          </div>

          <div
            className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all ${
              formData.promotionPackage === "premium"
                ? "border-[#247a63] bg-[#247a63]/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            onClick={() => setFormData((prev) => ({ ...prev, promotionPackage: "premium" }))}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm md:text-base">Premium Package — ₦100,000</h4>
              <div
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${
                  formData.promotionPackage === "premium" ? "border-[#247a63] bg-[#247a63]" : "border-gray-300"
                }`}
              >
                {formData.promotionPackage === "premium" && <Check size={10} className="text-white" />}
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Full editorial consideration on Spotify, Apple, Boomplay; influencer campaign
            </p>
          </div>
        </div>
      </div>

      {/* Agreements */}
      <div className="space-y-4 p-3 md:p-5 bg-gray-50 rounded-lg md:rounded-xl border border-gray-200">
        <h3 className="font-medium text-base md:text-lg text-gray-800">Please confirm before submitting:</h3>

        <div className="space-y-3">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.agreements.youtubeAck}
              onChange={() => handleCheckboxChange("agreements", "youtubeAck")}
              className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#247a63] rounded focus:ring-[#247a63]"
            />
            <span className="text-gray-700 text-xs md:text-sm">
              I selected "YouTube Music". So I won't email later asking, "why'd you upload my music to YouTube?!" …mkay?
            </span>
          </label>
          {errors["agreements.youtubeAck"] && (
            <p className="text-red-500 text-xs flex items-center gap-1 ml-7 md:ml-8">
              <AlertCircle size={12} />
              {errors["agreements.youtubeAck"]}
            </p>
          )}

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.agreements.promoAck}
              onChange={() => handleCheckboxChange("agreements", "promoAck")}
              className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#247a63] rounded focus:ring-[#247a63]"
            />
            <span className="text-gray-700 text-xs md:text-sm">
              I won't use "promo services" that guarantee streams or playlisting—even if they claim "organic and real"
              streams.
            </span>
          </label>
          {errors["agreements.promoAck"] && (
            <p className="text-red-500 text-xs flex items-center gap-1 ml-7 md:ml-8">
              <AlertCircle size={12} />
              {errors["agreements.promoAck"]}
            </p>
          )}

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.agreements.rightsAck}
              onChange={() => handleCheckboxChange("agreements", "rightsAck")}
              className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#247a63] rounded focus:ring-[#247a63]"
            />
            <span className="text-gray-700 text-xs md:text-sm">
              I recorded this music, and am authorized to sell it in stores worldwide & collect all royalties.
            </span>
          </label>
          {errors["agreements.rightsAck"] && (
            <p className="text-red-500 text-xs flex items-center gap-1 ml-7 md:ml-8">
              <AlertCircle size={12} />
              {errors["agreements.rightsAck"]}
            </p>
          )}

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.agreements.nameAck}
              onChange={() => handleCheckboxChange("agreements", "nameAck")}
              className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#247a63] rounded focus:ring-[#247a63]"
            />
            <span className="text-gray-700 text-xs md:text-sm">
              I'm not using any other artist's name in my name, song titles, or album title, without their approval.
            </span>
          </label>
          {errors["agreements.nameAck"] && (
            <p className="text-red-500 text-xs flex items-center gap-1 ml-7 md:ml-8">
              <AlertCircle size={12} />
              {errors["agreements.nameAck"]}
            </p>
          )}

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.agreements.distributionAck}
              onChange={() => handleCheckboxChange("agreements", "distributionAck")}
              className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#247a63] rounded focus:ring-[#247a63]"
            />
            <span className="text-gray-700 text-xs md:text-sm">
              I have read and agree to the terms of the Distribution Agreement.
            </span>
          </label>
          {errors["agreements.distributionAck"] && (
            <p className="text-red-500 text-xs flex items-center gap-1 ml-7 md:ml-8">
              <AlertCircle size={12} />
              {errors["agreements.distributionAck"]}
            </p>
          )}

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.agreements.terms}
              onChange={() => handleCheckboxChange("agreements", "terms")}
              className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#247a63] rounded focus:ring-[#247a63]"
            />
            <span className="text-gray-700 text-xs md:text-sm">I agree to the terms and conditions</span>
          </label>
          {errors["agreements.terms"] &&
            (
              <p className="text-red-500 text-xs flex items-center gap-1 ml-7">
            
              <AlertCircle size={12} />
              {errors["agreements.terms"]}
            </p>
            )}
        </div>
      </div>

      
      {errors.submit && (
        <div className="p-3 md:p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <p className="flex items-center gap-2 text-xs md:text-sm">
            <AlertCircle size={14} />
            {errors.submit}
          </p>
        </div>
      )}
  </div>
  )
}

export default DistributionStep
