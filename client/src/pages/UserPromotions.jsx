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
        return <Newspaper className="w-4 h-4 text-[#1a5f4b]" />;
      case 'tv':
        return <Tv className="w-4 h-4 text-[#1a5f4b]" />;
      case 'radio':
        return <Radio className="w-4 h-4 text-[#1a5f4b]" />;
      case 'chart':
      case 'playlist':
        return <ListMusic className="w-4 h-4 text-[#1a5f4b]" />;
      case 'digital':
        return <Globe className="w-4 h-4 text-[#1a5f4b]" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-[#1a5f4b]" />;
      case 'tiktok':
        return <Globe className="w-4 h-4 text-[#1a5f4b]" />;
      default:
        return <Newspaper className="w-4 h-4 text-[#1a5f4b]" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    
    switch(status) {
      case 'active':
      case 'completed':
      case 'success':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="w-3 h-3" />
            {status}
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
      case 'expired':
      case 'failed':
      case 'cancelled':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden my-13">
        <Navbar name="User Promotion" />
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a5f4b] to-[#2d7a63] px-6 py-4">
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
        <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1a5f4b] focus:border-[#1a5f4b]"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1a5f4b] focus:border-[#1a5f4b]"
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
                className="px-4 py-2 bg-[#1a5f4b] text-white rounded-lg hover:bg-[#0f3d2e] transition-colors"
              >
                Apply
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {loading && !promotions.length ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 text-[#1a5f4b] animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : promotions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No promotions found. Create your first promotion to get started!
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promotions.map((promo, index) => (
                    <tr key={`${promo.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#1a5f4b]/10 flex items-center justify-center">
                            {getCategoryIcon(promo.category_type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{promo.title || promo.name || 'Untitled Promotion'}</div>
                            <div className="text-sm text-gray-500">{promo.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{promo.category_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(promo.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(promo.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewPromotion(promo)}
                          className="inline-flex items-center text-[#1a5f4b] hover:text-[#0f3d2e] transition duration-150"
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
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between items-center gap-4">
                <button
                  onClick={() => loadMore(pagination.offset - pagination.limit)}
                  disabled={pagination.offset === 0}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{pagination.offset + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(pagination.offset + pagination.limit, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>

                <select
                  value={pagination.limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#1a5f4b] focus:border-[#1a5f4b]"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>

                <button
                  onClick={() => loadMore(pagination.offset + pagination.limit)}
                  disabled={pagination.offset + pagination.limit >= pagination.total}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Promotion Details</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1a5f4b] p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {selectedPromotion ? (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="h-20 w-20 bg-[#1a5f4b] bg-opacity-10 rounded-full flex items-center justify-center">
                      {getCategoryIcon(selectedPromotion.category_type)}
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">{selectedPromotion.title || selectedPromotion.name || 'Untitled Promotion'}</h3>
                    <p className="mt-1 text-sm text-gray-500">{selectedPromotion.name}</p>
                    <span className={`mt-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedPromotion.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedPromotion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedPromotion.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedPromotion.status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion ID</h4>
                      <p className="mt-1 text-sm text-black font-medium">{selectedPromotion.id}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</h4>
                      <p className="mt-1 text-sm text-black font-medium">{selectedPromotion.category_type?.replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Package</h4>
                      <p className="mt-1 text-sm text-black font-medium">{selectedPromotion.name || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</h4>
                      <p className="mt-1 text-sm text-black font-medium">{selectedPromotion.status?.replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</h4>
                      <p className="mt-1 text-sm text-black font-medium">{new Date(selectedPromotion.created_at).toLocaleString()}</p>
                    </div>
                    
                    {selectedPromotion.start_date && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</h4>
                        <p className="mt-1 text-sm text-black font-medium">{new Date(selectedPromotion.start_date).toLocaleString()}</p>
                      </div>
                    )}
                    
                    {selectedPromotion.end_date && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</h4>
                        <p className="mt-1 text-sm text-black font-medium">{new Date(selectedPromotion.end_date).toLocaleString()}</p>
                      </div>
                    )}
                    
                    {selectedPromotion.price && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Price</h4>
                        <p className="mt-1 text-sm text-black font-medium">₦{selectedPromotion.price.toLocaleString()}</p>
                      </div>
                    )}
                    
                    {selectedPromotion.package_id && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Package ID</h4>
                        <p className="mt-1 text-sm text-black font-medium">{selectedPromotion.package_id}</p>
                      </div>
                    )}
                    
                    {selectedPromotion.description && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</h4>
                        <p className="mt-1 text-sm text-black">{selectedPromotion.description}</p>
                      </div>
                    )}
                    
                    {selectedPromotion.body && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Content</h4>
                        <p className="mt-1 text-sm text-black">{selectedPromotion.body}</p>
                      </div>
                    )}
                    
                    {selectedPromotion.image && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Image</h4>
                        <img 
                          src={selectedPromotion.image} 
                          alt="Promotion" 
                          className="mt-1 w-20 h-20 object-cover rounded"
                        />
                      </div>
                    )}
                    
                    {selectedPromotion.video && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Video</h4>
                        <video 
                          src={selectedPromotion.video} 
                          controls 
                          className="mt-1 w-full max-w-xs rounded"
                        />
                      </div>
                    )}
                    
                    {selectedPromotion.song_link && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Song Link</h4>
                        <a 
                          href={selectedPromotion.song_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-600 hover:text-blue-800 break-all"
                        >
                          {selectedPromotion.song_link}
                        </a>
                      </div>
                    )}
                    
                    {selectedPromotion.video_link && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Video Link</h4>
                        <a 
                          href={selectedPromotion.video_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-600 hover:text-blue-800 break-all"
                        >
                          {selectedPromotion.video_link}
                        </a>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No promotion selected</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-[#1a5f4b] text-white rounded-md hover:bg-[#0f3d2e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a5f4b] transition duration-150"
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