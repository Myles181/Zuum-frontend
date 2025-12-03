import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  Music,
  Calendar,
  User,
  DollarSign,
  FileText,
  Globe,
  CheckCircle,
  XCircle,
  PlayCircle,
  ExternalLink,
  Tag,
  Clock,
  Award,
  Building,
  Users,
  FileMusic,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useDistributionRequests } from '../hooks/useDistributionRequests';
import { useUserById } from '../hooks/useUserById';

const DistributionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { requests, fetchRequests } = useDistributionRequests();
  const { user: userInfo, isLoading: isLoadingUser, fetchUserById } = useUserById();

  useEffect(() => {
    const loadRequest = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch requests if not already loaded
        if (!requests || requests.length === 0) {
          await fetchRequests();
        }
        
        // Find the request by ID
        const foundRequest = requests?.find(req => req.id === parseInt(id));
        
        if (foundRequest) {
          setRequest(foundRequest);
          
          // Fetch user information using profile_id
          if (foundRequest.profile_id) {
            await fetchUserById(foundRequest.profile_id);
          }
        } else {
          setError('Distribution request not found');
        }
      } catch (err) {
        setError('Failed to load distribution request');
        console.error('Error loading request:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadRequest();
    }
  }, [id, requests, fetchRequests]);

  // Parse details if it's a string
  const parsedDetails = request?.details 
    ? (typeof request.details === 'string' ? JSON.parse(request.details) : request.details)
    : null;

  const adminRoutes = {
    users: '/users',
    distribution: '/addistributions',
    beat: '/adbeat',
    'beat-posts': '/admin-beat-posts',
    'audio-posts': '/admin-audio-posts',
    promotion: '/adpromotion',
    wallet: '/admin-wallet',
    subscriptions: '/admin-subscriptions',
  };

  const handlePageChange = (pageId) => {
    const targetRoute = adminRoutes[pageId];
    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar
          currentPage="distribution"
          onPageChange={handlePageChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className={`flex-1 flex items-center justify-center transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d7a63] mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading distribution request...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar
          currentPage="distribution"
          onPageChange={handlePageChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className={`flex-1 flex items-center justify-center transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}>
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 mb-2">Error</p>
            <p className="text-sm text-gray-600 mb-4">{error || 'Distribution request not found'}</p>
            <button
              onClick={() => navigate('/addistributions')}
              className="px-4 py-2 bg-[#2d7a63] text-white rounded-lg hover:bg-[#245a4f] transition-colors"
            >
              Back to Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        currentPage="distribution"
        onPageChange={handlePageChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2D8C72] to-[#34A085] text-white p-6 shadow-lg">
          <button
            onClick={() => navigate('/addistributions')}
            className="mb-4 inline-flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Requests
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {request.caption || parsedDetails?.title || 'Distribution Request'}
              </h1>
              <p className="text-white/80">Request #{request.id}</p>
            </div>
            <div className="flex items-center gap-3">
              {request.paid ? (
                <span className="px-4 py-2 bg-green-500/30 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Paid
                </span>
              ) : (
                <span className="px-4 py-2 bg-amber-500/30 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Pending Payment
                </span>
              )}
              {request.read ? (
                <span className="px-4 py-2 bg-blue-500/30 backdrop-blur-sm rounded-full text-sm font-semibold">
                  Read
                </span>
              ) : (
                <span className="px-4 py-2 bg-orange-500/30 backdrop-blur-sm rounded-full text-sm font-semibold">
                  Unread
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Cover Art & Audio Preview */}
            {(request.cover_photo || request.audio_upload) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {request.cover_photo && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ImageIcon className="w-5 h-5 text-gray-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Cover Art</h3>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={request.cover_photo} 
                        alt="Cover Art" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                {request.audio_upload && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileMusic className="w-5 h-5 text-gray-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Audio Preview</h3>
                    </div>
                    <div className="space-y-4">
                      <audio controls className="w-full rounded-lg">
                        <source src={request.audio_upload} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                      <a 
                        href={request.audio_upload} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#2d7a63] hover:text-[#245a4f] font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open audio file in new tab
                      </a>
                      
                      {/* User Information */}
                      {isLoadingUser ? (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2d7a63]"></div>
                            Loading user information...
                          </div>
                        </div>
                      ) : userInfo ? (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <User className="w-5 h-5 text-gray-500" />
                            <h4 className="text-sm font-semibold text-gray-900">Artist Information</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              {userInfo.image ? (
                                <img 
                                  src={userInfo.image} 
                                  alt={userInfo.username || userInfo.email} 
                                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                                  <User className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {userInfo.username || userInfo.email || 'Unknown User'}
                                </p>
                                {userInfo.email && (
                                  <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                                )}
                                {(userInfo.firstname || userInfo.lastname) && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {[userInfo.firstname, userInfo.middlename, userInfo.lastname].filter(Boolean).join(' ')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              {userInfo.phonenumber && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="truncate">{userInfo.phonenumber}</span>
                                </div>
                              )}
                              {userInfo.identity && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Tag className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="truncate capitalize">{userInfo.identity}</span>
                                </div>
                              )}
                              {userInfo.balance !== undefined && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="truncate">₦{userInfo.balance?.toLocaleString() || '0'}</span>
                                </div>
                              )}
                              {userInfo.subscription_status && (
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    userInfo.subscription_status === 'active' || userInfo.subscription_status === '5'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {userInfo.subscription_status === 'active' || userInfo.subscription_status === '5' ? 'Subscribed' : 'Not Subscribed'}
                                  </span>
                                </div>
                              )}
                            </div>
                            {userInfo.bio && (
                              <div className="pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500 line-clamp-2">{userInfo.bio}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : request.profile_id ? (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500">User information not available</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Request ID</p>
                  <p className="text-base font-semibold text-gray-900">#{request.id}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Profile ID</p>
                  <p className="text-base font-semibold text-gray-900">{request.profile_id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-base font-semibold text-gray-900">
                    ₦{request.amount?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Genre</p>
                  <p className="text-base font-semibold text-gray-900">{request.genre || parsedDetails?.genre || 'N/A'}</p>
                </div>
                {parsedDetails?.secondaryGenre && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Secondary Genre</p>
                    <p className="text-base font-semibold text-gray-900">{parsedDetails.secondaryGenre}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Release Type</p>
                  <p className="text-base font-semibold text-gray-900 capitalize">
                    {parsedDetails?.releaseType || 'Single'}
                  </p>
                </div>
                {parsedDetails?.releaseDate && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Release Date</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(parsedDetails.releaseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created At</p>
                  <p className="text-base font-semibold text-gray-900">
                    {request.created_at 
                      ? new Date(request.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </p>
                </div>
                {parsedDetails?.isExplicit !== undefined && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Explicit Content</p>
                    <p className="text-base font-semibold text-gray-900">
                      {parsedDetails.isExplicit ? 'Yes' : 'No'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Artist Information */}
            {parsedDetails && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  Artist Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parsedDetails.artistName && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Artist Name</p>
                      <p className="text-base font-semibold text-gray-900">{parsedDetails.artistName}</p>
                    </div>
                  )}
                  {parsedDetails.hasDistributed && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Previously Distributed</p>
                      <p className="text-base font-semibold text-gray-900 capitalize">{parsedDetails.hasDistributed}</p>
                    </div>
                  )}
                  {parsedDetails.existingProfiles && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Existing Profiles</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {parsedDetails.existingProfiles.spotify && (
                          <a
                            href={parsedDetails.existingProfiles.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Spotify</span>
                          </a>
                        )}
                        {parsedDetails.existingProfiles.appleMusic && (
                          <a
                            href={parsedDetails.existingProfiles.appleMusic}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-pink-600" />
                            <span className="text-sm font-medium text-pink-700">Apple Music</span>
                          </a>
                        )}
                        {parsedDetails.existingProfiles.youtubeMusic && (
                          <a
                            href={parsedDetails.existingProfiles.youtubeMusic}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-700">YouTube Music</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Release Details */}
            {parsedDetails && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Music className="w-5 h-5 text-gray-500" />
                  Release Details
                </h3>
                <div className="space-y-4">
                  {parsedDetails.title && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Title</p>
                      <p className="text-base font-semibold text-gray-900">{parsedDetails.title}</p>
                    </div>
                  )}
                  {parsedDetails.description && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Description</p>
                      <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {parsedDetails.description}
                      </p>
                    </div>
                  )}
                  {parsedDetails.lyrics && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Lyrics</p>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {parsedDetails.lyrics}
                        </p>
                      </div>
                    </div>
                  )}
                  {parsedDetails.numberOfTracks && parsedDetails.releaseType === 'album' && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Number of Tracks</p>
                      <p className="text-base font-semibold text-gray-900">{parsedDetails.numberOfTracks}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Copyright & Rights */}
            {parsedDetails?.copyright && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-500" />
                  Copyright & Rights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parsedDetails.copyright.year && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Copyright Year</p>
                      <p className="text-base font-semibold text-gray-900">{parsedDetails.copyright.year}</p>
                    </div>
                  )}
                  {parsedDetails.copyright.owner && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Copyright Owner</p>
                      <p className="text-base font-semibold text-gray-900">{parsedDetails.copyright.owner}</p>
                    </div>
                  )}
                  {parsedDetails.recordLabel && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Record Label</p>
                      <p className="text-base font-semibold text-gray-900 capitalize">
                        {parsedDetails.recordLabel === 'no' ? 'No' : parsedDetails.recordLabel}
                      </p>
                    </div>
                  )}
                  {parsedDetails.recordLabelName && parsedDetails.recordLabel === 'yes' && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Record Label Name</p>
                      <p className="text-base font-semibold text-gray-900">{parsedDetails.recordLabelName}</p>
                    </div>
                  )}
                  {parsedDetails.songwriter && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Songwriter</p>
                      <p className="text-base font-semibold text-gray-900 capitalize">{parsedDetails.songwriter}</p>
                    </div>
                  )}
                  {parsedDetails.songwriters && Array.isArray(parsedDetails.songwriters) && parsedDetails.songwriters.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Songwriters</p>
                      <div className="flex flex-wrap gap-2">
                        {parsedDetails.songwriters.map((sw, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                            {sw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Distribution Platforms */}
            {parsedDetails?.platforms && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  Distribution Platforms
                </h3>
                <div className="space-y-4">
                  {parsedDetails.allPlatforms ? (
                    <p className="text-base font-semibold text-gray-900">All Platforms Selected</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Object.entries(parsedDetails.platforms).map(([platform, enabled]) => (
                        enabled && (
                          <div key={platform} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {platform.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {request.social_links && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-gray-500" />
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {request.social_links.spotify && (
                    <a
                      href={request.social_links.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-green-700">Spotify</p>
                        <p className="text-xs text-green-600 truncate">{request.social_links.spotify}</p>
                      </div>
                    </a>
                  )}
                  {request.social_links.apple_music && (
                    <a
                      href={request.social_links.apple_music}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-pink-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-pink-700">Apple Music</p>
                        <p className="text-xs text-pink-600 truncate">{request.social_links.apple_music}</p>
                      </div>
                    </a>
                  )}
                  {request.social_links.boomplay && (
                    <a
                      href={request.social_links.boomplay}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-blue-700">Boomplay</p>
                        <p className="text-xs text-blue-600 truncate">{request.social_links.boomplay}</p>
                      </div>
                    </a>
                  )}
                  {request.social_links.audio_mark && (
                    <a
                      href={request.social_links.audio_mark}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-amber-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-amber-700">Audiomack</p>
                        <p className="text-xs text-amber-600 truncate">{request.social_links.audio_mark}</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Agreements */}
            {parsedDetails?.agreements && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-500" />
                  Agreements & Acknowledgments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(parsedDetails.agreements).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {value ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promotion Package */}
            {parsedDetails?.promotionPackage && parsedDetails.promotionPackage !== 'none' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-500" />
                  Promotion Package
                </h3>
                <p className="text-base font-semibold text-gray-900 capitalize">
                  {parsedDetails.promotionPackage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionDetailsPage;

