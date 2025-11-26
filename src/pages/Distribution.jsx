import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { Music, ChevronLeft, ChevronRight, Upload, CheckCircle } from "lucide-react"
import ReleaseInfoStep from "../components/distribution/ReleaseInfoStep"
import ArtistProfileStep from "../components/distribution/ArtistPage"
import FileUploadStep from "../components/distribution/FileUploadStep"
import MetadataStep from "../components/distribution/MetaDataStep"
import DistributionStep from "../components/distribution/DistributionStep"
import Navbar from "../components/profile/NavBar"
import BottomNav from "../components/homepage/BottomNav"
import { useUserDistributionRequest } from "../../Hooks/distribution/useUserDistributionRequest"

// Step Components

const Distribution = () => {
  // Dark mode styles - consistent with other components
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

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const {
    createDistributionRequest,
    loading: submissionLoading,
    error: submissionError,
    reset: resetDistributionState,
  } = useUserDistributionRequest()

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

    const primaryAudioFile =
      formData.releaseType === "single"
        ? formData.audioFile
        : formData.tracks.find((track) => !!track.audioFile)?.audioFile || null

    if (!primaryAudioFile) {
      setErrors((prev) => ({ ...prev, submit: "Please upload at least one audio file." }))
      return
    }

    try {
      resetDistributionState()
      // Map existingProfiles to API format, providing defaults for required fields
      const socialLinks = {
        spotify: formData.existingProfiles.spotify || "https://spotify.com",
        apple_music: formData.existingProfiles.appleMusic || "https://apple.com",
        boomplay: "https://boomplay.com",
        audio_mark: "https://audiomack.com",
      }
      
      await createDistributionRequest({
        caption: formData.title.trim(),
        description: formData.lyrics.trim() || `Music release: ${formData.title}`,
        genre: formData.genre,
        social_links: socialLinks,
        audio_upload: primaryAudioFile,
        cover_photo: formData.coverArt,
      })

      setSuccess(true)
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error?.message || "Failed to submit. Please try again.",
      }))
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
    resetDistributionState()
  }

  // Render success state
  const renderSuccess = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 text-center">
      <div 
        className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <CheckCircle className="w-10 h-10 md:w-12 md:h-12" style={{ color: 'var(--color-primary)' }} />
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
        className="px-6 py-3 rounded-lg transition-colors text-base md:text-lg font-medium"
        style={{ 
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-on-primary)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--color-primary-light)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'var(--color-primary)';
        }}
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
                currentStep === step ? "w-4 h-4" : currentStep > step ? "" : ""
              }`}
              style={{
                backgroundColor: currentStep === step 
                  ? 'var(--color-primary)' 
                  : currentStep > step 
                    ? 'var(--color-primary)/60' 
                    : 'var(--color-border)'
              }}
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
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ 
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              backgroundColor: 'var(--color-primary)'
            }}
          ></div>

          {/* Step indicators */}
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="z-10">
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full text-sm font-medium transition-all ${
                  currentStep >= step
                    ? "shadow-md"
                    : "border-2"
                }`}
                style={{
                  backgroundColor: currentStep >= step
                    ? 'var(--color-primary)'
                    : 'var(--color-bg-primary)',
                  color: currentStep >= step
                    ? 'var(--color-text-on-primary)'
                    : 'var(--color-text-secondary)',
                  borderColor: currentStep >= step
                    ? 'var(--color-primary)'
                    : 'var(--color-border)'
                }}
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
      style={{ 
        ...darkModeStyles,
        backgroundColor: 'var(--color-bg-secondary)' 
      }}
    >
      <Navbar name='distribution'/>
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
            background: `linear-gradient(to right, var(--color-primary)/20, var(--color-bg-primary))`,
            borderBottom: '1px solid var(--color-border)'
          }}
        >
          <h1 
            className="text-2xl md:text-3xl font-bold flex items-center"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <Music className="mr-3 md:mr-4" style={{ color: 'var(--color-primary)' }} size={24} />
            Music Distribution
          </h1>
          <p 
            className="mt-1 md:mt-2 text-sm md:text-base"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Submit your music to major streaming platforms
          </p>
          <div className="mt-4">
            <Link
              to="/distribution-requests"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base transition-colors"
              style={{
                backgroundColor: 'rgba(45, 140, 114, 0.15)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(45, 140, 114, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(45, 140, 114, 0.15)'
              }}
            >
              View submitted requests
            </Link>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {renderProgressBar()}

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {(errors.submit || submissionError) && (
              <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                {errors.submit || submissionError?.message || "Something went wrong. Please try again."}
              </div>
            )}

            {!success && (
              <div className="mt-6 md:mt-10 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="px-4 md:px-6 py-2.5 md:py-3 flex items-center gap-1 md:gap-2 transition-colors text-sm md:text-base rounded-lg"
                    style={{ 
                      color: 'var(--color-text-secondary)',
                      backgroundColor: 'var(--color-bg-secondary)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-bg-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                    }}
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
                    className="px-5 md:px-8 py-2.5 md:py-3 rounded-lg transition-colors flex items-center gap-1 md:gap-2 shadow-md text-sm md:text-base"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-text-on-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-primary-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--color-primary)';
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submissionLoading}
                    className="px-5 md:px-8 py-2.5 md:py-3 rounded-lg transition-colors flex items-center gap-1 md:gap-2 shadow-md disabled:opacity-50 text-sm md:text-base"
                    style={{ 
                      backgroundColor: submissionLoading ? 'var(--color-border)' : 'var(--color-primary)',
                      color: 'var(--color-text-on-primary)'
                    }}
                    onMouseEnter={(e) => {
                      if (!submissionLoading) {
                        e.target.style.backgroundColor = 'var(--color-primary-light)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!submissionLoading) {
                        e.target.style.backgroundColor = 'var(--color-primary)';
                      }
                    }}
                  >
                    {submissionLoading ? "Submitting..." : "Submit Music"} <Upload size={16} />
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