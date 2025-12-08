import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Newspaper,
  Plus,
  X,
  Edit,
  Trash2,
  Image as ImageIcon,
  Save,
  Search,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useNews } from '../hooks/useNews';

const AdminZuumNewsPage = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Use the news hook
  const {
    news,
    isLoading,
    error,
    success,
    pagination,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
    resetError,
    resetSuccess,
  } = useNews();

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    imagePreview: null,
  });

  // Fetch news on component mount
  useEffect(() => {
    fetchNews({ limit: 50, offset: 0 });
  }, [fetchNews]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: null,
      imagePreview: null,
    });
  };

  const handleAddNews = () => {
    resetForm();
    resetError();
    setShowAddModal(true);
  };

  const handleEditNews = (newsItem) => {
    setSelectedNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      image: null,
      imagePreview: newsItem.image,
    });
    resetError();
    setShowEditModal(true);
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      const result = await deleteNews(id);
      if (!result) {
        // Error is handled by the hook
      }
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);

    try {
      if (showAddModal) {
        const result = await createNews({
          title: formData.title,
          content: formData.content,
          image: formData.image,
        });

        if (result) {
          resetForm();
          setShowAddModal(false);
        }
      } else if (showEditModal && selectedNews) {
        const result = await updateNews(selectedNews.id, {
          title: formData.title,
          content: formData.content,
          image: formData.image,
        });

        if (result) {
          resetForm();
          setShowEditModal(false);
          setSelectedNews(null);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    resetForm();
    resetError();
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedNews(null);
  };

  const filteredNews = news.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleRefresh = () => {
    fetchNews({ limit: 50, offset: 0 });
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar
        currentPage="zuum-news"
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
                <Newspaper size={22} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Zuum News</h1>
                <p className="text-sm text-gray-500">Manage news articles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d7a63] to-[#1f5f4a] flex items-center justify-center shadow-lg">
                    <Newspaper className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Zuum News</h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage and publish news articles ({pagination.total} total)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>

                  {/* Search */}
                  <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search news..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63]"
                    />
                  </div>

                  {/* Add News Button */}
                  <button
                    onClick={handleAddNews}
                    className="px-4 py-2 rounded-lg bg-[#2d7a63] text-white font-semibold text-sm hover:bg-[#245a4f] inline-flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add News
                  </button>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">{success}</span>
                <button
                  onClick={resetSuccess}
                  className="ml-auto text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
                <button
                  onClick={resetError}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Add Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={handleAddNews}
                className="w-full px-4 py-2 rounded-lg bg-[#2d7a63] text-white font-semibold text-sm hover:bg-[#245a4f] inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add News
              </button>
            </div>

            {/* Loading State */}
            {isLoading && news.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Loader2 className="w-12 h-12 text-[#2d7a63] mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Loading news...
                </h3>
                <p className="text-sm text-gray-500">
                  Please wait while we fetch the news articles
                </p>
              </div>
            ) : filteredNews.length > 0 ? (
              /* News Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((newsItem) => (
                  <div
                    key={newsItem.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {newsItem.image ? (
                        <img
                          src={newsItem.image}
                          alt={newsItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={() => handleEditNews(newsItem)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(newsItem.id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(newsItem.createdAt || newsItem.created_at)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {newsItem.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {newsItem.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No news found' : 'No news articles yet'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Get started by adding your first news article'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleAddNews}
                    className="px-4 py-2 rounded-lg bg-[#2d7a63] text-white font-semibold text-sm hover:bg-[#245a4f] inline-flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add News
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit News Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2d7a63] bg-opacity-10 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-[#2d7a63]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {showAddModal ? 'Add New News' : 'Edit News'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {showAddModal
                      ? 'Create a new news article'
                      : 'Update news article details'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Error */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  News Image
                </label>
                {formData.imagePreview ? (
                  <div className="relative">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, image: null, imagePreview: null })
                      }
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#2d7a63] transition-colors bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag
                        and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter news title..."
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] text-sm"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  News Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={8}
                  placeholder="Enter news content..."
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a63] focus:border-[#2d7a63] text-sm resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-[#2d7a63] text-sm font-semibold text-white hover:bg-[#245a4f] inline-flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {showAddModal ? 'Publishing...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {showAddModal ? 'Publish News' : 'Save Changes'}
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

export default AdminZuumNewsPage;
