import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Shield,
  FileText,
  UserCog,
  Lock,
  Bell,
  Globe,
  Mail,
  CreditCard,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Save,
  Search,
  Newspaper,
  Megaphone,
  Send,
  Loader2,
  Trash2,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useAnnouncements } from '../hooks/useAnnouncements';

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Form states for different settings
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [termsOfService, setTermsOfService] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [announcementContent, setAnnouncementContent] = useState('');

  // Use the announcements hook
  const {
    announcements,
    isLoading: isAnnouncementLoading,
    error: announcementError,
    success: announcementSuccess,
    fetchAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    resetError: resetAnnouncementError,
    resetSuccess: resetAnnouncementSuccess,
  } = useAnnouncements();

  const adminRoutes = {
    users: '/users',
    distribution: '/addistributions',
    beat: '/adbeat',
    'beat-posts': '/admin-beat-posts',
    'audio-posts': '/admin-audio-posts',
    promotion: '/adpromotion',
    wallet: '/admin-wallet',
    cryptoWallet: '/admin-wallet-crypto',
    subscriptions: '/admin-subscriptions',
    settings: '/admin-settings',
    'zuum-news': '/admin-zuum-news',
  };

  const handlePageChange = (pageId) => {
    const targetRoute = adminRoutes[pageId];
    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  const handleCardClick = (cardId, modalData) => {
    // Navigate to Zuum News page if it's the zuum-news card
    if (cardId === 'zuum-news') {
      navigate('/admin-zuum-news');
      return;
    }

    // Fetch announcements when opening announcement modal
    if (cardId === 'announcement') {
      fetchAnnouncements({ limit: 10, offset: 0 });
      setAnnouncementContent('');
      resetAnnouncementError();
      resetAnnouncementSuccess();
    }
    
    setActiveCard(cardId);
    setModalContent(modalData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveCard(null);
    setModalContent(null);
  };

  const handleSave = async () => {
    // Handle announcement separately
    if (activeCard === 'announcement') {
      if (!announcementContent.trim()) {
        alert('Please enter announcement content');
        return;
      }

      const result = await createAnnouncement(announcementContent);
      if (result) {
        setAnnouncementContent('');
      }
      return;
    }

    // TODO: Implement API calls for each setting
    console.log('Saving settings:', { activeCard, modalContent });
    // Show success message
    closeModal();
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const settingsCards = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'Manage and update privacy policy content',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
      action: 'Edit Policy',
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      description: 'Manage and update terms of service content',
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
      action: 'Edit Terms',
    },
    {
      id: 'makeAdmin',
      title: 'Make User Admin',
      description: 'Grant admin privileges to users',
      icon: UserCog,
      color: 'bg-emerald-50 text-emerald-600',
      iconBg: 'bg-emerald-100',
      action: 'Select User',
    },
    {
      id: 'removeAdmin',
      title: 'Remove Admin',
      description: 'Revoke admin privileges from users',
      icon: Shield,
      color: 'bg-red-50 text-red-600',
      iconBg: 'bg-red-100',
      action: 'Select Admin',
    },
    {
      id: 'adminAccount',
      title: 'Admin Account',
      description: 'Update admin email and password',
      icon: Lock,
      color: 'bg-amber-50 text-amber-600',
      iconBg: 'bg-amber-100',
      action: 'Update Account',
    },
    {
      id: 'announcement',
      title: 'Send Announcement',
      description: 'Send announcements to all users',
      icon: Megaphone,
      color: 'bg-orange-50 text-orange-600',
      iconBg: 'bg-orange-100',
      action: 'Send Now',
    },
    // {
    //   id: 'notifications',
    //   title: 'Notification Settings',
    //   description: 'Configure system notification preferences',
    //   icon: Bell,
    //   color: 'bg-indigo-50 text-indigo-600',
    //   iconBg: 'bg-indigo-100',
    //   action: 'Configure',
    // },
    // {
    //   id: 'general',
    //   title: 'General Settings',
    //   description: 'Manage general platform settings',
    //   icon: Globe,
    //   color: 'bg-slate-50 text-slate-600',
    //   iconBg: 'bg-slate-100',
    //   action: 'Manage',
    // },
    // {
    //   id: 'email',
    //   title: 'Email Settings',
    //   description: 'Configure email service and templates',
    //   icon: Mail,
    //   color: 'bg-cyan-50 text-cyan-600',
    //   iconBg: 'bg-cyan-100',
    //   action: 'Configure',
    // },
    // {
    //   id: 'payment',
    //   title: 'Payment Settings',
    //   description: 'Manage payment gateway configurations',
    //   icon: CreditCard,
    //   color: 'bg-green-50 text-green-600',
    //   iconBg: 'bg-green-100',
    //   action: 'Manage',
    // },
    // {
    //   id: 'database',
    //   title: 'Database Settings',
    //   description: 'View and manage database configurations',
    //   icon: Database,
    //   color: 'bg-orange-50 text-orange-600',
    //   iconBg: 'bg-orange-100',
    //   action: 'View',
    // },
    // {
    //   id: 'api',
    //   title: 'API Keys',
    //   description: 'Manage API keys and integrations',
    //   icon: Key,
    //   color: 'bg-pink-50 text-pink-600',
    //   iconBg: 'bg-pink-100',
    //   action: 'Manage Keys',
    // },
    // {
    //   id: 'security',
    //   title: 'Security Settings',
    //   description: 'Configure security policies and rules',
    //   icon: AlertTriangle,
    //   color: 'bg-rose-50 text-rose-600',
    //   iconBg: 'bg-rose-100',
    //   action: 'Configure',
    // },
    {
      id: 'zuum-news',
      title: 'Zuum News',
      description: 'Manage and publish news articles',
      icon: Newspaper,
      color: 'bg-teal-50 text-teal-600',
      iconBg: 'bg-teal-100',
      action: 'Manage News',
    },
  ];

  const renderModalContent = () => {
    if (!activeCard || !modalContent) return null;

    switch (activeCard) {
      case 'privacy':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy Policy Content
              </label>
              <textarea
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] text-sm text-black"
                placeholder="Enter privacy policy content..."
              />
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms of Service Content
              </label>
              <textarea
                value={termsOfService}
                onChange={(e) => setTermsOfService(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] text-sm text-black"
                placeholder="Enter terms of service content..."
              />
            </div>
          </div>
        );

      case 'makeAdmin':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID or Email
              </label>
              <input
                type="text"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] text-sm"
                placeholder="Enter user ID or email..."
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                This will grant full admin privileges to the selected user.
              </p>
            </div>
          </div>
        );

      case 'removeAdmin':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin User ID or Email
              </label>
              <input
                type="text"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] text-sm"
                placeholder="Enter admin user ID or email..."
              />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-800">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                This will revoke admin privileges from the selected user.
              </p>
            </div>
          </div>
        );

      case 'adminAccount':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] text-sm"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] text-sm"
                placeholder="Enter new password..."
              />
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Notification Channels
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Email Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.email}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        email: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#2d7a63] rounded focus:ring-[#2d7a63]"
                  />
                </label>
                <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">SMS Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.sms}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        sms: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#2d7a63] rounded focus:ring-[#2d7a63]"
                  />
                </label>
                <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Push Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.push}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        push: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#2d7a63] rounded focus:ring-[#2d7a63]"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case 'announcement':
        return (
          <div className="space-y-4">
            {/* Success Message */}
            {announcementSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">{announcementSuccess}</span>
                <button
                  onClick={resetAnnouncementSuccess}
                  className="ml-auto text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error Message */}
            {announcementError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">{announcementError}</span>
                <button
                  onClick={resetAnnouncementError}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* New Announcement Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Announcement Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] text-sm resize-none"
                placeholder="Enter your announcement message..."
                disabled={isAnnouncementLoading}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <Bell className="w-4 h-4 inline mr-1" />
                This announcement will be sent to all registered users via push notification.
              </p>
            </div>

            {/* Previous Announcements */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Previous Announcements</h4>
                <button
                  onClick={() => fetchAnnouncements({ limit: 10, offset: 0 })}
                  disabled={isAnnouncementLoading}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${isAnnouncementLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {isAnnouncementLoading && announcements.length === 0 ? (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
                  <p className="text-xs text-gray-500 mt-2">Loading announcements...</p>
                </div>
              ) : announcements.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {announcements.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-700 flex-1">{item.content}</p>
                        <button
                          onClick={() => handleDeleteAnnouncement(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(item.createdAt || item.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <Megaphone className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No announcements yet</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              Configuration options for this setting will be available soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar
        currentPage="settings"
        onPageChange={handlePageChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <SettingsIcon size={22} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Manage platform settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d7a63] to-[#1f5f4a] flex items-center justify-center shadow-lg">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage platform configurations and policies
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {settingsCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id, card)}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-[#2d7a63] transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className={`w-6 h-6 ${card.color.split(' ')[1]}`} />
                      </div>
                      <span className="text-xs font-semibold text-[#2d7a63] opacity-0 group-hover:opacity-100 transition-opacity">
                        {card.action}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {card.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showModal && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${modalContent.iconBg} flex items-center justify-center`}
                >
                  <modalContent.icon
                    className={`w-5 h-5 ${modalContent.color.split(' ')[1]}`}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {modalContent.title}
                  </h2>
                  <p className="text-xs text-gray-500">{modalContent.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">{renderModalContent()}</div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                disabled={isAnnouncementLoading}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isAnnouncementLoading}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white inline-flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 ${
                  activeCard === 'announcement'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-[#2d7a63] hover:bg-[#245a4f]'
                }`}
              >
                {isAnnouncementLoading && activeCard === 'announcement' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : activeCard === 'announcement' ? (
                  <>
                    <Send className="w-4 h-4" />
                    Send Announcement
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;

