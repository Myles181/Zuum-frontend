"use client"

import { Globe, DollarSign, AlertCircle, Check } from "lucide-react"

const DistributionStep = ({ formData, setFormData, errors, setErrors }) => {
  // Dark mode styles
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151'
  };

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
    <div style={darkModeStyles}>
      <div className="space-y-5 md:space-y-6" style={{ color: 'var(--color-text-primary)' }}>
        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
          <Globe className="text-[#2D8C72]" size={20} />
          Distribution & Agreements
        </h2>

        {/* Platform Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Do you want your music on all platforms?
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, allPlatforms: true }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                formData.allPlatforms
                  ? "text-white shadow-md"
                  : "border text-gray-300 hover:bg-gray-700"
              } text-sm md:text-base`}
              style={{ 
                backgroundColor: formData.allPlatforms ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)'
              }}
            >
              Yes, all platforms
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, allPlatforms: false }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                !formData.allPlatforms
                  ? "text-white shadow-md"
                  : "border text-gray-300 hover:bg-gray-700"
              } text-sm md:text-base`}
              style={{ 
                backgroundColor: !formData.allPlatforms ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)'
              }}
            >
              No, select specific platforms
            </button>
          </div>
        </div>

        {/* Platform Checkboxes */}
        {!formData.allPlatforms && (
          <div 
            className="space-y-3 p-3 md:p-5 rounded-lg md:rounded-xl border"
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)'
            }}
          >
            <h3 className="font-medium text-base md:text-lg">Choose platforms:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mt-3">
              <button
                type="button"
                onClick={() => handlePlatformToggle("spotify")}
                className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                  formData.platforms.spotify
                    ? "text-white shadow-md"
                    : "border text-gray-300 hover:bg-gray-700"
                }`}
                style={{ 
                  backgroundColor: formData.platforms.spotify ? 'var(--color-primary)' : 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <span
                  className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                    formData.platforms.spotify ? "bg-white" : "bg-gray-600"
                  }`}
                >
                  {formData.platforms.spotify && <Check size={12} className="text-[#2D8C72]" />}
                </span>
                <span className="font-medium text-sm md:text-base">Spotify</span>
              </button>
              <button
                type="button"
                onClick={() => handlePlatformToggle("appleMusic")}
                className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                  formData.platforms.appleMusic
                    ? "text-white shadow-md"
                    : "border text-gray-300 hover:bg-gray-700"
                }`}
                style={{ 
                  backgroundColor: formData.platforms.appleMusic ? 'var(--color-primary)' : 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <span
                  className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                    formData.platforms.appleMusic ? "bg-white" : "bg-gray-600"
                  }`}
                >
                  {formData.platforms.appleMusic && <Check size={12} className="text-[#2D8C72]" />}
                </span>
                <span className="font-medium text-sm md:text-base">Apple Music</span>
              </button>
              <button
                type="button"
                onClick={() => handlePlatformToggle("youtubeMusic")}
                className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                  formData.platforms.youtubeMusic
                    ? "text-white shadow-md"
                    : "border text-gray-300 hover:bg-gray-700"
                }`}
                style={{ 
                  backgroundColor: formData.platforms.youtubeMusic ? 'var(--color-primary)' : 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <span
                  className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                    formData.platforms.youtubeMusic ? "bg-white" : "bg-gray-600"
                  }`}
                >
                  {formData.platforms.youtubeMusic && <Check size={12} className="text-[#2D8C72]" />}
                </span>
                <span className="font-medium text-sm md:text-base">YouTube Music</span>
              </button>
              <button
                type="button"
                onClick={() => handlePlatformToggle("amazonMusic")}
                className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                  formData.platforms.amazonMusic
                    ? "text-white shadow-md"
                    : "border text-gray-300 hover:bg-gray-700"
                }`}
                style={{ 
                  backgroundColor: formData.platforms.amazonMusic ? 'var(--color-primary)' : 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <span
                  className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                    formData.platforms.amazonMusic ? "bg-white" : "bg-gray-600"
                  }`}
                >
                  {formData.platforms.amazonMusic && <Check size={12} className="text-[#2D8C72]" />}
                </span>
                <span className="font-medium text-sm md:text-base">Amazon Music</span>
              </button>
              <button
                type="button"
                onClick={() => handlePlatformToggle("tidal")}
                className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                  formData.platforms.tidal
                    ? "text-white shadow-md"
                    : "border text-gray-300 hover:bg-gray-700"
                }`}
                style={{ 
                  backgroundColor: formData.platforms.tidal ? 'var(--color-primary)' : 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <span
                  className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                    formData.platforms.tidal ? "bg-white" : "bg-gray-600"
                  }`}
                >
                  {formData.platforms.tidal && <Check size={12} className="text-[#2D8C72]" />}
                </span>
                <span className="font-medium text-sm md:text-base">Tidal</span>
              </button>
              <button
                type="button"
                onClick={() => handlePlatformToggle("deezer")}
                className={`p-3 md:p-4 rounded-lg md:rounded-xl flex items-center transition-all ${
                  formData.platforms.deezer
                    ? "text-white shadow-md"
                    : "border text-gray-300 hover:bg-gray-700"
                }`}
                style={{ 
                  backgroundColor: formData.platforms.deezer ? 'var(--color-primary)' : 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <span
                  className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 inline-flex items-center justify-center rounded-full ${
                    formData.platforms.deezer ? "bg-white" : "bg-gray-600"
                  }`}
                >
                  {formData.platforms.deezer && <Check size={12} className="text-[#2D8C72]" />}
                </span>
                <span className="font-medium text-sm md:text-base">Deezer</span>
              </button>
            </div>

            {errors.platforms && (
              <p className="text-red-400 text-xs md:text-sm flex items-center gap-1 mt-2">
                <AlertCircle size={14} />
                {errors.platforms}
              </p>
            )}
          </div>
        )}

        {/* Promotion Packages */}
        <div 
          className="space-y-4 p-3 md:p-5 rounded-lg md:rounded-xl border"
          style={{ 
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)'
          }}
        >
          <h3 className="font-medium text-base md:text-lg flex items-center gap-2">
            <DollarSign className="text-[#2D8C72]" size={18} />
            Promotion Packages
          </h3>

          <div className="space-y-2 md:space-y-3 mt-2">
            <div
              className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all ${
                formData.promotionPackage === "none"
                  ? "border-[#2D8C72]"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              style={{ 
                backgroundColor: formData.promotionPackage === "none" ? 'var(--color-primary)' : 'var(--color-bg-primary)',
                color: formData.promotionPackage === "none" ? 'var(--color-text-on-primary)' : 'var(--color-text-primary)'
              }}
              onClick={() => setFormData((prev) => ({ ...prev, promotionPackage: "none" }))}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm md:text-base">No Promotion</h4>
                <div
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${
                    formData.promotionPackage === "none" ? "border-white bg-white" : "border-gray-400"
                  }`}
                >
                  {formData.promotionPackage === "none" && <Check size={10} className="text-[#2D8C72]" />}
                </div>
              </div>
              <p className="text-xs md:text-sm mt-1" style={{ color: formData.promotionPackage === "none" ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)' }}>
                Distribute your music without additional promotion
              </p>
            </div>

            <div
              className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all ${
                formData.promotionPackage === "basic"
                  ? "border-[#2D8C72]"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              style={{ 
                backgroundColor: formData.promotionPackage === "basic" ? 'var(--color-primary)' : 'var(--color-bg-primary)',
                color: formData.promotionPackage === "basic" ? 'var(--color-text-on-primary)' : 'var(--color-text-primary)'
              }}
              onClick={() => setFormData((prev) => ({ ...prev, promotionPackage: "basic" }))}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm md:text-base">Basic Package — ₦20,000</h4>
                <div
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${
                    formData.promotionPackage === "basic" ? "border-white bg-white" : "border-gray-400"
                  }`}
                >
                  {formData.promotionPackage === "basic" && <Check size={10} className="text-[#2D8C72]" />}
                </div>
              </div>
              <p className="text-xs md:text-sm mt-1" style={{ color: formData.promotionPackage === "basic" ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)' }}>
                Get on 5 curated playlists, social media shoutouts
              </p>
            </div>

            <div
              className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all ${
                formData.promotionPackage === "standard"
                  ? "border-[#2D8C72]"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              style={{ 
                backgroundColor: formData.promotionPackage === "standard" ? 'var(--color-primary)' : 'var(--color-bg-primary)',
                color: formData.promotionPackage === "standard" ? 'var(--color-text-on-primary)' : 'var(--color-text-primary)'
              }}
              onClick={() => setFormData((prev) => ({ ...prev, promotionPackage: "standard" }))}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm md:text-base">Standard Package — ₦50,000</h4>
                <div
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${
                    formData.promotionPackage === "standard" ? "border-white bg-white" : "border-gray-400"
                  }`}
                >
                  {formData.promotionPackage === "standard" && <Check size={10} className="text-[#2D8C72]" />}
                </div>
              </div>
              <p className="text-xs md:text-sm mt-1" style={{ color: formData.promotionPackage === "standard" ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)' }}>
                Get on 15 curated playlists, blog feature, TikTok promo
              </p>
            </div>

            <div
              className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all ${
                formData.promotionPackage === "premium"
                  ? "border-[#2D8C72]"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              style={{ 
                backgroundColor: formData.promotionPackage === "premium" ? 'var(--color-primary)' : 'var(--color-bg-primary)',
                color: formData.promotionPackage === "premium" ? 'var(--color-text-on-primary)' : 'var(--color-text-primary)'
              }}
              onClick={() => setFormData((prev) => ({ ...prev, promotionPackage: "premium" }))}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm md:text-base">Premium Package — ₦100,000</h4>
                <div
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${
                    formData.promotionPackage === "premium" ? "border-white bg-white" : "border-gray-400"
                  }`}
                >
                  {formData.promotionPackage === "premium" && <Check size={10} className="text-[#2D8C72]" />}
                </div>
              </div>
              <p className="text-xs md:text-sm mt-1" style={{ color: formData.promotionPackage === "premium" ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)' }}>
                Full editorial consideration on Spotify, Apple, Boomplay; influencer campaign
              </p>
            </div>
          </div>
        </div>

        {/* Agreements */}
        <div 
          className="space-y-4 p-3 md:p-5 rounded-lg md:rounded-xl border"
          style={{ 
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)'
          }}
        >
          <h3 className="font-medium text-base md:text-lg">Please confirm before submitting:</h3>

          <div className="space-y-3">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.agreements.youtubeAck}
                onChange={() => handleCheckboxChange("agreements", "youtubeAck")}
                className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#2D8C72] rounded focus:ring-[#2D8C72]"
                style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
              />
              <span className="text-xs md:text-sm" style={{ color: 'var(--color-text-primary)' }}>
                I selected "YouTube Music". So I won't email later asking, "why'd you upload my music to YouTube?!" …mkay?
              </span>
            </label>
            {errors["agreements.youtubeAck"] && (
              <p className="text-red-400 text-xs flex items-center gap-1 ml-7 md:ml-8">
                <AlertCircle size={12} />
                {errors["agreements.youtubeAck"]}
              </p>
            )}

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.agreements.promoAck}
                onChange={() => handleCheckboxChange("agreements", "promoAck")}
                className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#2D8C72] rounded focus:ring-[#2D8C72]"
                style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
              />
              <span className="text-xs md:text-sm" style={{ color: 'var(--color-text-primary)' }}>
                I won't use "promo services" that guarantee streams or playlisting—even if they claim "organic and real" streams.
              </span>
            </label>
            {errors["agreements.promoAck"] && (
              <p className="text-red-400 text-xs flex items-center gap-1 ml-7 md:ml-8">
                <AlertCircle size={12} />
                {errors["agreements.promoAck"]}
              </p>
            )}

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.agreements.rightsAck}
                onChange={() => handleCheckboxChange("agreements", "rightsAck")}
                className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#2D8C72] rounded focus:ring-[#2D8C72]"
                style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
              />
              <span className="text-xs md:text-sm" style={{ color: 'var(--color-text-primary)' }}>
                I recorded this music, and am authorized to sell it in stores worldwide & collect all royalties.
              </span>
            </label>
            {errors["agreements.rightsAck"] && (
              <p className="text-red-400 text-xs flex items-center gap-1 ml-7 md:ml-8">
                <AlertCircle size={12} />
                {errors["agreements.rightsAck"]}
              </p>
            )}

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.agreements.nameAck}
                onChange={() => handleCheckboxChange("agreements", "nameAck")}
                className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#2D8C72] rounded focus:ring-[#2D8C72]"
                style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
              />
              <span className="text-xs md:text-sm" style={{ color: 'var(--color-text-primary)' }}>
                I'm not using any other artist's name in my name, song titles, or album title, without their approval.
              </span>
            </label>
            {errors["agreements.nameAck"] && (
              <p className="text-red-400 text-xs flex items-center gap-1 ml-7 md:ml-8">
                <AlertCircle size={12} />
                {errors["agreements.nameAck"]}
              </p>
            )}

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.agreements.distributionAck}
                onChange={() => handleCheckboxChange("agreements", "distributionAck")}
                className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#2D8C72] rounded focus:ring-[#2D8C72]"
                style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
              />
              <span className="text-xs md:text-sm" style={{ color: 'var(--color-text-primary)' }}>
                I have read and agree to the terms of the Distribution Agreement.
              </span>
            </label>
            {errors["agreements.distributionAck"] && (
              <p className="text-red-400 text-xs flex items-center gap-1 ml-7 md:ml-8">
                <AlertCircle size={12} />
                {errors["agreements.distributionAck"]}
              </p>
            )}

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.agreements.terms}
                onChange={() => handleCheckboxChange("agreements", "terms")}
                className="w-4 h-4 md:w-5 md:h-5 mt-0.5 text-[#2D8C72] rounded focus:ring-[#2D8C72]"
                style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
              />
              <span className="text-xs md:text-sm" style={{ color: 'var(--color-text-primary)' }}>
                I agree to the terms and conditions
              </span>
            </label>
            {errors["agreements.terms"] && (
              <p className="text-red-400 text-xs flex items-center gap-1 ml-7 md:ml-8">
                <AlertCircle size={12} />
                {errors["agreements.terms"]}
              </p>
            )}
          </div>
        </div>

        {errors.submit && (
          <div 
            className="p-3 md:p-4 rounded-lg border"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: '#fca5a5'
            }}
          >
            <p className="flex items-center gap-2 text-xs md:text-sm">
              <AlertCircle size={14} />
              {errors.submit}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DistributionStep