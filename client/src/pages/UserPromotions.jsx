import { useState } from 'react';
import { 
  Newspaper, Tv, Radio, Globe, ListMusic, Youtube, 
  Clock, CheckCircle, XCircle, AlertCircle, ChevronDown,
  ChevronUp, Filter, Loader2, ChevronRight, ChevronLeft
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
  const { promotions, loading, error, pagination, refetch, loadMore, setLimit } = useUserPromotions();

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
    refetch(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({ category: '', status: '' });
    refetch({ category: '', status: '' });
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
                <option value="digital">Digital</option>
                <option value="playlist">Playlist</option>
                <option value="youtube">YouTube</option>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#1a5f4b]/10 flex items-center justify-center">
                            {getCategoryIcon(promo.category)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{promo.title || 'Untitled Promotion'}</div>
                            <div className="text-sm text-gray-500">{promo.package_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{promo.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(promo.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(promo.created_at).toLocaleDateString()}
                        </div>
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
                  onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
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
                  onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
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
      <BottomNav activeTab="home" />
    </div>
  );
};