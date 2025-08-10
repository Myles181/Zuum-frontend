import { useState } from 'react';
import { 
  Newspaper, Tv, Radio, Globe, ListMusic, Youtube, 
  Clock, CheckCircle, XCircle, AlertCircle, ChevronDown,
  ChevronUp, Filter, Loader2, ChevronRight, ChevronLeft,
  Eye, X, User
} from 'lucide-react';
import { useUserPromotions } from '../../Hooks/search/useAllPost';
import BottomNav from '../components/homepage/BottomNav';
import Navbar from '../components/profile/NavBar';


export const UserPromotions = () => {
  const [filters, setFilters] = useState({
    category: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { promotions, loading, error, pagination, refetch, loadMore, setLimit } = useUserPromotions();

  // Handle view promotion details
  const handleViewPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setIsViewModalOpen(true);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'national':
      case 'international':
        return <Newspaper className="w-4 h-4 text-[#008066]" />;
      case 'tv':
        return <Tv className="w-4 h-4 text-[#008066]" />;
      case 'radio':
        return <Radio className="w-4 h-4 text-[#008066]" />;
      case 'chart':
      case 'playlist':
        return <ListMusic className="w-4 h-4 text-[#008066]" />;
      case 'digital':
        return <Globe className="w-4 h-4 text-[#008066]" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-[#008066]" />;
      case 'tiktok':
        return <Globe className="w-4 h-4 text-[#008066]" />;
      default:
        return <Newspaper className="w-4 h-4 text-[#008066]" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    
    switch(status) {
      case 'active':
      case 'completed':
      case 'success':
        return (
          <span className={`${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200`}>
            <CheckCircle className="w-3 h-3" />
            {status}
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200`}>
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
      case 'expired':
      case 'failed':
      case 'cancelled':
        return (
          <span className={`${baseClasses} bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200`}>
            <XCircle className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`}>
            <AlertCircle className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    refetch({
      category_type: filters.category,
      status: filters.status
    });
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({ category: '', status: '' });
    refetch({ category_type: '', status: '' });
    setShowFilters(false);
  };

  return (
    <div 
      className="rounded-xl shadow-sm overflow-hidden my-13"
      style={{ 
        backgroundColor: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border)'
      }}
    >
      <Navbar name="User Promotion" />
      
      {/* Header */}
      <div 
        className="px-6 py-4"
        style={{ 
          background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-dark))'
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">My Promotions</h2>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div 
          className="px-6 py-4"
          style={{ 
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg focus:ring-[#008066] focus:border-[#008066]"
                style={{ 
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <option value="">All Categories</option>
                <option value="national">National</option>
                <option value="international">International</option>
                <option value="tv">TV</option>
                <option value="radio">Radio</option>
                <option value="chart">Chart</option>
                <option value="playlist">Playlist</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg focus:ring-[#008066] focus:border-[#008066]"
                style={{ 
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-[#008066] text-white rounded-lg hover:bg-[#006e58] transition-colors"
              >
                Apply
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                style={{ 
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
        {loading && !promotions.length ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 text-[#008066] animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-center" style={{ color: 'var(--color-error)' }}>{error}</div>
        ) : promotions.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
            No promotions found. Create your first promotion to get started!
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y" style={{ borderColor: 'var(--color-border)' }}>
                <thead style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Promotion
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Category
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Status
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Date
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-primary)' }}>
                  {promotions.map((promo, index) => (
                    <tr 
                      key={`${promo.id}-${index}`} 
                      className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--color-primary-light)' }}
                          >
                            {getCategoryIcon(promo.category_type)}
                          </div>
                          <div className="ml-4">
                            <div style={{ color: 'var(--color-text-primary)' }} className="text-sm font-medium">
                              {promo.title || promo.name || 'Untitled Promotion'}
                            </div>
                            <div style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                              {promo.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="text-sm capitalize"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {promo.category_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(promo.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="text-sm"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {new Date(promo.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewPromotion(promo)}
                          className="inline-flex items-center transition duration-150"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          <Eye size={16} className="mr-1" /> 
                          <span className="hidden sm:inline">View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div 
              className="px-6 py-4 flex items-center justify-between"
              style={{ 
                backgroundColor: 'var(--color-bg-secondary)',
                borderTop: '1px solid var(--color-border)'
              }}
            >
              <div className="flex-1 flex justify-between items-center gap-4">
                <button
                  onClick={() => loadMore(pagination.offset - pagination.limit)}
                  disabled={pagination.offset === 0}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-bg-primary)'
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Showing <span className="font-medium">{pagination.offset + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(pagination.offset + pagination.limit, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>

                <select
                  value={pagination.limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="ml-3 relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-[#008066] focus:border-[#008066]"
                  style={{ 
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'var(--color-bg-primary)'
                  }}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>

                <button
                  onClick={() => loadMore(pagination.offset + pagination.limit)}
                  disabled={pagination.offset + pagination.limit >= pagination.total}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-bg-primary)'
                  }}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* View Promotion Modal */}
      {isViewModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div 
            className="rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            style={{ 
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div 
              className="flex justify-between items-center p-6"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <h2 
                className="text-xl font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Promotion Details
              </h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="focus:outline-none focus:ring-2 focus:ring-[#008066] p-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {selectedPromotion ? (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div 
                      className="h-20 w-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-primary-light)' }}
                    >
                      {getCategoryIcon(selectedPromotion.category_type)}
                    </div>
                    <h3 
                      className="mt-4 text-lg font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {selectedPromotion.title || selectedPromotion.name || 'Untitled Promotion'}
                    </h3>
                    <p 
                      className="mt-1 text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {selectedPromotion.name}
                    </p>
                    <span className={`mt-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedPromotion.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                      selectedPromotion.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                      selectedPromotion.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    }`}>
                      {selectedPromotion.status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <h4 
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Promotion ID
                      </h4>
                      <p 
                        className="mt-1 text-sm font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {selectedPromotion.id}
                      </p>
                    </div>
                    
                    <div>
                      <h4 
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Category
                      </h4>
                      <p 
                        className="mt-1 text-sm font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {selectedPromotion.category_type?.replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Package
                      </h4>
                      <p 
                        className="mt-1 text-sm font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {selectedPromotion.name || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Status
                      </h4>
                      <p 
                        className="mt-1 text-sm font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {selectedPromotion.status?.replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Created At
                      </h4>
                      <p 
                        className="mt-1 text-sm font-medium"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {new Date(selectedPromotion.created_at).toLocaleString()}
                      </p>
                    </div>
                    
                    {selectedPromotion.start_date && (
                      <div>
                        <h4 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Start Date
                        </h4>
                        <p 
                          className="mt-1 text-sm font-medium"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {new Date(selectedPromotion.start_date).toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {selectedPromotion.end_date && (
                      <div>
                        <h4 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          End Date
                        </h4>
                        <p 
                          className="mt-1 text-sm font-medium"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {new Date(selectedPromotion.end_date).toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {selectedPromotion.price && (
                      <div>
                        <h4 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Price
                        </h4>
                        <p 
                          className="mt-1 text-sm font-medium"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          ₦{selectedPromotion.price.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {selectedPromotion.package_id && (
                      <div>
                        <h4 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Package ID
                        </h4>
                        <p 
                          className="mt-1 text-sm font-medium"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {selectedPromotion.package_id}
                        </p>
                      </div>
                    )}
                    
                    {selectedPromotion.description && (
                      <div>
                        <h4 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Description
                        </h4>
                        <p 
                          className="mt-1 text-sm"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {selectedPromotion.description}
                        </p>
                      </div>
                    )}
                    
                    {selectedPromotion.body && (
                      <div>
                        <h4 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Content
                        </h4>
                        <p 
                          className="mt-1 text-sm"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {selectedPromotion.body}
                        </p>
                      </div>
                    )}
                    
                    {selectedPromotion.image && (
                      <div>
                        <h4 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Image
                        </h4>
                        <img 
                          src={selectedPromotion.image} 
                          alt="Promotion" 
                          className="mt-1 w-20 h-20 object-cover rounded"
                        />
                      </div>
                    )}
                    
                    {selectedPromotion.video && (
                      <div>
                        <h4 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Video
                        </h4>
                        <video 
                          src={selectedPromotion.video} 
                          controls 
                          className="mt-1 w-full max-w-xs rounded"
                        />
                      </div>
                    )}
                    
                    {selectedPromotion.song_link && (
                      <div>
                        <h4 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Song Link
                        </h4>
                        <a 
                          href={selectedPromotion.song_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-1 text-sm break-all"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {selectedPromotion.song_link}
                        </a>
                      </div>
                    )}
                    
                    {selectedPromotion.video_link && (
                      <div>
                        <h4 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Video Link
                        </h4>
                        <a 
                          href={selectedPromotion.video_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-1 text-sm break-all"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {selectedPromotion.video_link}
                        </a>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p style={{ color: 'var(--color-text-secondary)' }}>No promotion selected</p>
                </div>
              )}
            </div>
            
            <div 
              className="p-6 flex justify-end"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-[#008066] text-white rounded-md hover:bg-[#006e58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008066] transition duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav activeTab="home" />
    </div>
  );
};