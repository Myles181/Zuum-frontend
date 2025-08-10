"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Music, ChevronLeft, ChevronRight, Upload, CheckCircle } from "lucide-react"
import ReleaseInfoStep from "../components/distribution/ReleaseInfoStep"
import ArtistProfileStep from "../components/distribution/ArtistPage"
import FileUploadStep from "../components/distribution/FileUploadStep"
import MetadataStep from "../components/distribution/MetaDataStep"
import DistributionStep from "../components/distribution/DistributionStep"
import Navbar from "../components/profile/NavBar"
import BottomNav from "../components/homepage/BottomNav"

// Step Components


const Distribution = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // Form data state
  const [formData, setFormData] = useState({
    // Artist Profile
    hasDistributed: "",
    artistName: "",
    existingProfiles: {
      spotify: "",
      appleMusic: "",
      youtubeMusic: "",
    },

    // Release Info
    releaseType: "single",
    title: "",
    numberOfTracks: 2,
    tracks: [],

    // Artwork & Audio
    coverArt: null,
    audioFile: null,

    // Metadata
    genre: "",
    secondaryGenre: "",
    releaseDate: "",
    isExplicit: false,
    clipStartTime: 0,

    // Rights & Distribution
    copyright: {
      year: new Date().getFullYear(),
      owner: "",
    },
    recordLabel: "no",
    recordLabelName: "",
    songwriter: "self",
    songwriters: [""],
    lyrics: "",

    // Distribution
    allPlatforms: true,
    platforms: {
      spotify: true,
      appleMusic: true,
      youtubeMusic: true,
      amazonMusic: false,
      tidal: false,
      deezer: false,
    },

    // Promotion
    promotionPackage: "none",

    // Agreements
    agreements: {
      terms: false,
      youtubeAck: false,
      promoAck: false,
      rightsAck: false,
      nameAck: false,
      distributionAck: false,
    },
  })

  // UI state
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Initialize tracks when number changes
  useEffect(() => {
    if (formData.releaseType === "album") {
      const trackCount = Number.parseInt(formData.numberOfTracks)
      const newTracks = []

      for (let i = 0; i < trackCount; i++) {
        newTracks.push({
          title: formData.tracks[i]?.title || "",
          songwriter: formData.tracks[i]?.songwriter || "",
          featuredArtist: formData.tracks[i]?.featuredArtist || "",
          lyrics: formData.tracks[i]?.lyrics || "",
          clipStartTime: formData.tracks[i]?.clipStartTime || 0,
          genre: formData.tracks[i]?.genre || "",
          audioFile: formData.tracks[i]?.audioFile || null,
        })
      }

      setFormData((prev) => ({
        ...prev,
        tracks: newTracks,
      }))
    }
  }, [formData.numberOfTracks, formData.releaseType])

  // Form validation
  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1: // Artist Profile
        if (!formData.hasDistributed) {
          newErrors.hasDistributed = "Please select an option"
        } else if (formData.hasDistributed === "yes") {
          if (!formData.existingProfiles.spotify) newErrors["existingProfiles.spotify"] = "Spotify URL is required"
          if (!formData.existingProfiles.appleMusic)
            newErrors["existingProfiles.appleMusic"] = "Apple Music URL is required"
          if (!formData.existingProfiles.youtubeMusic)
            newErrors["existingProfiles.youtubeMusic"] = "YouTube Music URL is required"
        } else if (formData.hasDistributed === "no") {
          if (!formData.artistName.trim()) newErrors.artistName = "Artist name is required"
        }
        break

      case 2: // Release Info
        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (formData.releaseType === "album") {
          // Validate album tracks
          formData.tracks.forEach((track, index) => {
            if (!track.title.trim()) newErrors[`track${index}Title`] = "Track title is required"
          })
        }
        break

      case 3: // Artwork & Audio
        if (!formData.coverArt) newErrors.coverArt = "Cover art is required"
        if (formData.releaseType === "single" && !formData.audioFile) {
          newErrors.audioFile = "Audio file is required"
        } else if (formData.releaseType === "album") {
          formData.tracks.forEach((track, index) => {
            if (!track.audioFile) newErrors[`track${index}Audio`] = "Audio file is required"
          })
        }
        break

      case 4: // Metadata & Rights
        if (!formData.genre) newErrors.genre = "Primary genre is required"
        if (!formData.releaseDate) newErrors.releaseDate = "Release date is required"
        if (!formData.copyright.owner.trim()) newErrors["copyright.owner"] = "Copyright owner is required"
        if (formData.songwriter === "self" && formData.songwriters.some((sw) => !sw.trim())) {
          newErrors.songwriters = "All songwriter fields must be filled"
        }
        if (formData.releaseType === "single" && !formData.lyrics.trim()) {
          newErrors.lyrics = "Lyrics are required"
        }
        break

      case 5: // Distribution & Agreements
        if (!formData.allPlatforms && !Object.values(formData.platforms).some((v) => v)) {
          newErrors.platforms = "Select at least one platform"
        }

        // Check all agreements
        Object.keys(formData.agreements).forEach((key) => {
          if (!formData.agreements[key]) {
            newErrors[`agreements.${key}`] = "You must agree to continue"
          }
        })
        break

      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step navigation
  const goToNextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setLoading(true)

    try {
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Build FormData for API submission
      const submitData = new FormData()

      // Add all form data
      submitData.append("artistName", formData.artistName)
      submitData.append("hasDistributed", formData.hasDistributed)
      submitData.append("existingProfiles", JSON.stringify(formData.existingProfiles))
      submitData.append("releaseType", formData.releaseType)
      submitData.append("title", formData.title)
      submitData.append("coverArt", formData.coverArt)

      if (formData.releaseType === "single") {
        submitData.append("audioFile", formData.audioFile)
        submitData.append("lyrics", formData.lyrics)
      } else {
        submitData.append(
          "tracks",
          JSON.stringify(
            formData.tracks.map((t) => ({
              ...t,
              audioFile: null, // Don't stringify the file
            })),
          ),
        )

        // Add each track audio file separately
        formData.tracks.forEach((track, index) => {
          if (track.audioFile) {
            submitData.append(`track${index}Audio`, track.audioFile)
          }
        })
      }

      submitData.append("genre", formData.genre)
      submitData.append("secondaryGenre", formData.secondaryGenre)
      submitData.append("releaseDate", formData.releaseDate)
      submitData.append("isExplicit", formData.isExplicit)
      submitData.append("clipStartTime", formData.clipStartTime)
      submitData.append("copyright", JSON.stringify(formData.copyright))
      submitData.append("recordLabel", formData.recordLabel)
      submitData.append("recordLabelName", formData.recordLabelName)
      submitData.append("songwriter", formData.songwriter)
      submitData.append("songwriters", JSON.stringify(formData.songwriters))
      submitData.append("allPlatforms", formData.allPlatforms)
      submitData.append("platforms", JSON.stringify(formData.platforms))
      submitData.append("promotionPackage", formData.promotionPackage)
      submitData.append("agreements", JSON.stringify(formData.agreements))

      // For demo purposes, just log the data
      console.log("Submitting music:", Object.fromEntries(submitData.entries()))

      setSuccess(true)
    } catch (error) {
      console.error("Submission error:", error)
      setErrors((prev) => ({ ...prev, submit: "Failed to submit. Please try again." }))
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      // Artist Profile
      hasDistributed: "",
      artistName: "",
      existingProfiles: {
        spotify: "",
        appleMusic: "",
        youtubeMusic: "",
      },

      // Release Info
      releaseType: "single",
      title: "",
      numberOfTracks: 2,
      tracks: [],

      // Artwork & Audio
      coverArt: null,
      audioFile: null,

      // Metadata
      genre: "",
      secondaryGenre: "",
      releaseDate: "",
      isExplicit: false,
      clipStartTime: 0,

      // Rights & Distribution
      copyright: {
        year: new Date().getFullYear(),
        owner: "",
      },
      recordLabel: "no",
      recordLabelName: "",
      songwriter: "self",
      songwriters: [""],
      lyrics: "",

      // Distribution
      allPlatforms: true,
      platforms: {
        spotify: true,
        appleMusic: true,
        youtubeMusic: true,
        amazonMusic: false,
        tidal: false,
        deezer: false,
      },

      // Promotion
      promotionPackage: "none",

      // Agreements
      agreements: {
        terms: false,
        youtubeAck: false,
        promoAck: false,
        rightsAck: false,
        nameAck: false,
        distributionAck: false,
      },
    })
    setCurrentStep(1)
    setSuccess(false)
    setErrors({})
  }

  // Render success state
  const renderSuccess = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 text-center">
      <div 
        className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
      >
        <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-[#008066]" />
      </div>
      <h2 
        className="text-2xl md:text-3xl font-bold mb-3 md:mb-4"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Submission Successful!
      </h2>
      <p 
        className="mb-6 md:mb-8 text-base md:text-lg"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Your music has been submitted for distribution.
      </p>
      <button
        onClick={handleReset}
        className="px-6 py-3 bg-[#008066] text-white rounded-lg hover:bg-[#006e58] transition-colors text-base md:text-lg font-medium"
      >
        Submit Another Release
      </button>
    </motion.div>
  )

  // Progress indicator
  const renderProgressBar = () => {
    if (success) return null

    return (
      <div className="mb-6 md:mb-10">
        {/* Mobile progress indicator (dots) */}
        <div className="flex md:hidden justify-center items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentStep === step ? "bg-[#008066] w-4 h-4" : currentStep > step ? "bg-[#008066]/60" : "bg-gray-200 dark:bg-gray-600"
              }`}
            ></div>
          ))}
        </div>
        <div 
          className="text-center md:hidden mb-4 text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Step {currentStep}:{currentStep === 1 && " Artist Profile"}
          {currentStep === 2 && " Release Information"}
          {currentStep === 3 && " Upload Files"}
          {currentStep === 4 && " Metadata & Rights"}
          {currentStep === 5 && " Distribution"}
        </div>

        {/* Desktop progress indicator (icons) */}
        <div className="hidden md:flex justify-between items-center mb-6 relative">
          {/* Progress line */}
          <div 
            className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 z-0"
            style={{ backgroundColor: 'var(--color-border)' }}
          ></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#008066] -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>

          {/* Step indicators */}
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="z-10">
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full text-sm font-medium transition-all ${
                  currentStep >= step
                    ? "bg-[#008066] text-white shadow-md"
                    : "bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-400"
                }`}
              >
                {step}
                <span 
                  className="absolute -bottom-8 text-xs font-medium whitespace-nowrap text-center"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {step === 1 && "Artist"}
                  {step === 2 && "Release"}
                  {step === 3 && "Files"}
                  {step === 4 && "Metadata"}
                  {step === 5 && "Distribution"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render current step content
  const renderStepContent = () => {
    if (success) {
      return renderSuccess()
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <ArtistProfileStep formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}

          {currentStep === 2 && (
            <ReleaseInfoStep formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}

          {currentStep === 3 && (
            <FileUploadStep formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}

          {currentStep === 4 && (
            <MetadataStep formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}

          {currentStep === 5 && (
            <DistributionStep formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          )}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div 
      className="h-full md:py-12 my-13"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
    <Navbar  name='distribution'/>
      <div 
        className="max-w-3xl mx-auto rounded-xl md:rounded-2xl shadow-lg overflow-hidden"
        style={{ 
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div 
          className="p-4 md:p-8"
          style={{ 
            background: `linear-gradient(to right, rgba(0, 128, 102, 0.2), var(--color-bg-primary))`,
            borderBottom: '1px solid var(--color-border)'
          }}
        >
          <h1 
            className="text-2xl md:text-3xl font-bold flex items-center"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <Music className="mr-3 md:mr-4 text-[#008066]" size={24} />
            Music Distribution
          </h1>
          <p 
            className="mt-1 md:mt-2 text-sm md:text-base"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Submit your music to major streaming platforms
          </p>
        </div>

        <div className="p-4 md:p-8">
          {renderProgressBar()}

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {!success && (
              <div className="mt-6 md:mt-10 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="px-4 md:px-6 py-2.5 md:py-3 flex items-center gap-1 md:gap-2 transition-colors text-sm md:text-base"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-5 md:px-8 py-2.5 md:py-3 bg-[#008066] text-white rounded-lg hover:bg-[#006e58] transition-colors flex items-center gap-1 md:gap-2 shadow-md text-sm md:text-base"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 md:px-8 py-2.5 md:py-3 bg-[#008066] text-white rounded-lg hover:bg-[#006e58] transition-colors flex items-center gap-1 md:gap-2 shadow-md disabled:opacity-50 disabled:hover:bg-[#008066] text-sm md:text-base"
                  >
                    {loading ? "Submitting..." : "Submit Music"} <Upload size={16} />
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export default Distribution