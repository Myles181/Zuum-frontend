import { useState } from 'react';
import { Newspaper, Tv, Radio, Globe, TrendingUp, ListMusic, PlayCircle, Music2, Check, Upload } from 'lucide-react';

const PromotionRequirementsForm = () => {
  const [formData, setFormData] = useState({
    promotionType: '',
    selectedPlatforms: [],
    contentLink: '',
    contentTitle: '',
    contentDescription: '',
    imageFile: null,
    videoFile: null,
    biography: '',
    targetCountries: '',
    preferredDates: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const promotionTypes = [
    { id: 'print', name: 'Print Media', icon: <Newspaper size={16} /> },
    { id: 'tv', name: 'TV Promotion', icon: <Tv size={16} /> },
    { id: 'radio', name: 'Radio', icon: <Radio size={16} /> },
    { id: 'digital', name: 'Digital', icon: <Globe size={16} /> },
    { id: 'charts', name: 'Charts', icon: <TrendingUp size={16} /> },
    { id: 'playlist', name: 'Playlist', icon: <ListMusic size={16} /> },
    { id: 'youtube', name: 'YouTube', icon: <PlayCircle size={16} /> },
    { id: 'tiktok', name: 'TikTok', icon: <Music2 size={16} /> }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => {
      const newPlatforms = prev.selectedPlatforms.includes(platform)
        ? prev.selectedPlatforms.filter(p => p !== platform)
        : [...prev.selectedPlatforms, platform];
      return { ...prev, selectedPlatforms: newPlatforms };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // Submit form data
      console.log('Submitting:', formData);
      setTimeout(() => setIsSubmitting(false), 2000);
    } else {
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.promotionType) newErrors.promotionType = 'Please select a promotion type';
    if (!formData.contentLink) newErrors.contentLink = 'Content link is required';
    if (!formData.contactName) newErrors.contactName = 'Name is required';
    if (!formData.contactEmail) newErrors.contactEmail = 'Email is required';
    if (!formData.contactPhone) newErrors.contactPhone = 'Phone is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    return newErrors;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Promotion Requirements</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Promotion Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Type *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {promotionTypes.map(type => (
              <button
                type="button"
                key={type.id}
                onClick={() => setFormData(prev => ({ ...prev, promotionType: type.id }))}
                className={`flex flex-col items-center p-3 border rounded-lg transition-all ${
                  formData.promotionType === type.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-600' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="mb-1">{type.icon}</span>
                <span className="text-sm">{type.name}</span>
              </button>
            ))}
          </div>
          {errors.promotionType && <p className="mt-1 text-sm text-red-600">{errors.promotionType}</p>}
        </div>

        {/* Platform Selection */}
        {formData.promotionType && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Platforms *</label>
            <div className="flex flex-wrap gap-2">
              {getPlatformOptions(formData.promotionType).map(platform => (
                <button
                  type="button"
                  key={platform}
                  onClick={() => handlePlatformToggle(platform)}
                  className={`px-3 py-1.5 text-sm rounded-full border ${
                    formData.selectedPlatforms.includes(platform)
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Requirements */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Content Requirements</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Link *</label>
              <input
                type="url"
                name="contentLink"
                value={formData.contentLink}
                onChange={handleChange}
                placeholder="https://example.com/content"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {errors.contentLink && <p className="mt-1 text-sm text-red-600">{errors.contentLink}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
                <input
                  type="text"
                  name="contentTitle"
                  value={formData.contentTitle}
                  onChange={handleChange}
                  placeholder="Title of your content"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Countries</label>
                <input
                  type="text"
                  name="targetCountries"
                  value={formData.targetCountries}
                  onChange={handleChange}
                  placeholder="Nigeria, UK, US, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Description</label>
              <textarea
                name="contentDescription"
                value={formData.contentDescription}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of your content"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                rows={2}
                placeholder="Artist/company background (for media features)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                <label className="flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer">
                  <Upload className="h-5 w-5 mb-1 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formData.imageFile ? formData.imageFile.name : 'Upload image (JPG/PNG)'}
                  </span>
                  <input 
                    type="file" 
                    name="imageFile"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video File (for TV/Radio)</label>
                <label className="flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer">
                  <Upload className="h-5 w-5 mb-1 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formData.videoFile ? formData.videoFile.name : 'Upload video (MP4)'}
                  </span>
                  <input 
                    type="file" 
                    name="videoFile"
                    onChange={handleChange}
                    className="hidden"
                    accept="video/*"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Terms and Submission */}
        <div className="mt-8">
          <div className="flex items-start mb-4">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-1 mr-2"
            />
            <label className="text-sm text-gray-700">
              I agree to the terms of service and understand that my content may be adjusted to meet platform standards. *
            </label>
          </div>
          {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Promotion Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper function to get platform options based on promotion type
function getPlatformOptions(promotionType) {
  switch(promotionType) {
    case 'print':
      return [
        'Thisday', 'Sunnews', 'Thenation', 'Guardian', 'Tribune', 'Vanguard',
        'Businessday', 'Leadership', 'Dailytrust', 'Independent', 'News Digest',
        'Withinnigeria', 'Pmnewsnigeria', 'Telegraph', 'Premium Times', 'Punch',
        'Legit.ng', 'Yabaleft', 'Pulse'
      ];
    case 'tv':
      return [
        'Trace TV (New)', 'Trace TV (B2B)', 'MTV Base (3x weekly)', 'MTV Base (5x weekly)',
        'SoundCity (5x weekly)', 'SoundCity (2x daily)', 'Hip TV (3x weekly)',
        'Hip TV (Nextrated Interview)', 'Afropop TV (2x daily)', 'Afropop TV (5x daily)',
        'On TV', 'Terrestrial TV Stations', 'BRT TV (Established)', 'BRT TV (Up & Coming)'
      ];
    case 'radio':
      return [
        'Beat FM', 'Tincity', 'Lagos Talks FM', 'Solid FM', 'Nigeria Info FM',
        'Cool FM', 'Ray Power FM', 'Brila FM', 'Max FM', 'Wazobia FM', 'Naija FM'
      ];
    case 'digital':
      return [
        'Audiomack front page', 'Boomplay front page', 'EPK', 'Instablog9ja',
        'Gossipmill', 'Legit', 'Tunde Ednut', 'Yabaleft', 'Pulse', 'GoldMyne TV',
        'Gistreel', 'Kraks TV'
      ];
    case 'charts':
      return ['Deezer Top 50', 'Audiomack chart (afro sound)', 'Audiomack Hiphop Chart'];
    case 'playlist':
      return [
        'Spotify Curated', 'Apple Music Curated', 'Audiomack Curated',
        'Boomplay Editorials', 'Audiomack Editorials'
      ];
    case 'youtube':
      return ['Normal Promotion', 'Mid Promotion', 'Wild Promotion', 'Mass Promotion'];
    case 'tiktok':
      return ['Mid Promotion', 'Wild Promotion', 'Mass Promotion'];
    case 'international':
      return ['$700 Package', 'Forbes', 'AP News', 'New York Times', 'Business Insider'];
    default:
      return [];
  }
}

export default PromotionRequirementsForm;