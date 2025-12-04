import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Disc,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Music,
  User,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useBeats } from '../hooks/useBeats';

const BeatPostsPage = () => {
  const navigate = useNavigate();
  const {
    beats,
    isLoading,
    error,
    pagination,
    fetchBeats,
    updateBeatStatus,
    deleteBeat,
    resetError,
  } = useBeats();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, blocked
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const actionsMenuRef = useRef(null);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setSelectedBeat(null);
      }
    };

    if (selectedBeat) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedBeat]);

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

  // Fetch beats on component mount and when filters change
  useEffect(() => {
    const options = {
      limit,
      offset: (currentPage - 1) * limit,
    };

    if (statusFilter !== 'all') {
      options.status = statusFilter;
    }

    fetchBeats(options);
  }, [statusFilter, currentPage, limit, fetchBeats]);

  // Calculate stats
  const stats = useMemo(() => {
    const allBeats = Array.isArray(beats) ? beats : [];
    return {
      total: allBeats.length,
      pending: allBeats.filter((b) => b.status === 'pending').length,
      approved: allBeats.filter((b) => b.status === 'approved').length,
      blocked: allBeats.filter((b) => b.status === 'blocked').length,
    };
  }, [beats]);

  // Filter beats by search term
  const filteredBeats = useMemo(() => {
    if (!Array.isArray(beats)) return [];
    
    const term = searchTerm.toLowerCase();
    return beats.filter((beat) => {
      const matchesSearch =
        !term ||
        (beat.title && beat.title.toLowerCase().includes(term)) ||
        (beat.caption && beat.caption.toLowerCase().includes(term)) ||
        (beat.username && beat.username.toLowerCase().includes(term)) ||
        (beat.artist_name && beat.artist_name.toLowerCase().includes(term));

      return matchesSearch;
    });
  }, [beats, searchTerm]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedBeat || !newStatus) return;

    const success = await updateBeatStatus(selectedBeat.id, newStatus);
    if (success) {
      setIsStatusModalOpen(false);
      setSelectedBeat(null);
      setNewStatus('');
      // Refresh the list
      const options = {
        limit,
        offset: (currentPage - 1) * limit,
      };
      if (statusFilter !== 'all') {
        options.status = statusFilter;
      }
      fetchBeats(options);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedBeat) return;

    const success = await deleteBeat(selectedBeat.id);
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedBeat(null);
      // Refresh the list
      const options = {
        limit,
        offset: (currentPage - 1) * limit,
      };
      if (statusFilter !== 'all') {
        options.status = statusFilter;
      }
      fetchBeats(options);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        icon: Clock,
        label: 'Pending',
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: CheckCircle,
        label: 'Approved',
      },
      blocked: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: XCircle,
        label: 'Blocked',
      },
    };

    return badges[status] || badges.pending;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        currentPage="beat-posts"
        onPageChange={handlePageChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Beat Posts Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and moderate beat posts on the platform
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Disc className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Blocked</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.blocked}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search beats by title, artist, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a63] focus:border-transparent text-gray-900"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a63] focus:border-transparent text-gray-900 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <button
                onClick={resetError}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d7a63]"></div>
            </div>
          ) : filteredBeats.length === 0 ? (
            <div className="text-center py-12">
              <Disc className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No beat posts found</p>
              <p className="text-gray-500 text-sm mt-2">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No beats have been posted yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBeats.map((beat) => {
                const statusBadge = getStatusBadge(beat.status);
                const StatusIcon = statusBadge.icon;

                return (
                  <div
                    key={beat.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Beat Image/Thumbnail */}
                      {beat.cover_image || beat.image ? (
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={beat.cover_image || beat.image}
                            alt={beat.title || beat.caption || 'Beat'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Music className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      {/* Beat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {beat.title || beat.caption || 'Untitled Beat'}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              {beat.username && (
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>{beat.username}</span>
                                </div>
                              )}
                              {beat.artist_name && (
                                <div className="flex items-center gap-1">
                                  <Music className="w-4 h-4" />
                                  <span>{beat.artist_name}</span>
                                </div>
                              )}
                              {beat.created_at && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(beat.created_at)}</span>
                                </div>
                              )}
                            </div>
                            {beat.description && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {beat.description}
                              </p>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusBadge.label}
                            </span>

                            {/* Actions Menu */}
                            <div className="relative" ref={actionsMenuRef}>
                              <button
                                onClick={() => setSelectedBeat(selectedBeat?.id === beat.id ? null : beat)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-5 h-5 text-gray-500" />
                              </button>
                              {selectedBeat?.id === beat.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <button
                                    onClick={() => {
                                      setNewStatus(
                                        beat.status === 'pending'
                                          ? 'approved'
                                          : beat.status === 'approved'
                                          ? 'blocked'
                                          : 'pending'
                                      );
                                      setIsStatusModalOpen(true);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Change Status
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedBeat(beat);
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Post
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.hasMore && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.ceil(pagination.total / limit)}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!pagination.hasMore}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {isStatusModalOpen && selectedBeat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Beat Status
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Change status for: <strong>{selectedBeat.title || selectedBeat.caption || 'Untitled Beat'}</strong>
            </p>
            <div className="space-y-2 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="pending"
                  checked={newStatus === 'pending'}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="text-[#2d7a63]"
                />
                <span className="text-sm text-gray-700">Pending</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="approved"
                  checked={newStatus === 'approved'}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="text-[#2d7a63]"
                />
                <span className="text-sm text-gray-700">Approved</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="blocked"
                  checked={newStatus === 'blocked'}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="text-[#2d7a63]"
                />
                <span className="text-sm text-gray-700">Blocked</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleStatusUpdate}
                className="flex-1 bg-[#2d7a63] text-white px-4 py-2 rounded-lg hover:bg-[#245a4f] transition-colors"
              >
                Update Status
              </button>
              <button
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setSelectedBeat(null);
                  setNewStatus('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedBeat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Beat Post
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete <strong>{selectedBeat.title || selectedBeat.caption || 'this beat post'}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedBeat(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeatPostsPage;

