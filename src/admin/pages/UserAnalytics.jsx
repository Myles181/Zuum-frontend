import { useState, useMemo, useEffect } from 'react';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Download,
  Music,
  Globe,
  Calendar,
  Activity,
  PlayCircle,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useProfileAnalytics } from '../hooks/useAnalytics';
import { useAudio } from '../hooks/useAudio';
import { useParams } from 'react-router-dom';
import { FiSearch, FiPlus, FiX, FiMusic } from 'react-icons/fi'; // Using react-icons primarily in this project

// Mock hook for demo - replace with actual import

const chartData = [
  { day: 'Mon', value: 65 },
  { day: 'Tue', value: 85 },
  { day: 'Wed', value: 75 },
  { day: 'Thu', value: 90 },
  { day: 'Fri', value: 95 },
  { day: 'Sat', value: 88 },
  { day: 'Sun', value: 100 },
];

const greenGradient = 'bg-gradient-to-br from-[#2D8C72] to-[#34A085]';

const AdminUserAnalyticsPage = () => {
  // Mock data - replace with actual router
  const { userId } = useParams();
  const selectedUser = { id: userId, username: userId };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');
  const [isEditing, setIsEditing] = useState(false);

  const {
    currentAnalytics,
    isLoading,
    error,
    success,
    getProfileAnalytics,
    updateAnalytics,
    createAnalytics,
  } = useProfileAnalytics();

  const { audioPosts, fetchAudioPosts, getAudioById } = useAudio();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Determine if we need to fetch initial list or use search
    // Since fetchAudioPosts returns all by default or filtered, we can use it.
    // However, for efficiency, let's only fetch when the search dropdown is opened (or user types).
    // For now, let's just ensure we have access to fetch.
  }, []);

  const handleSearchAudio = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      console.log('Searching for:', query);
      const posts = await fetchAudioPosts({ limit: 100, type: 'music' });
      console.log('Fetched posts:', posts);

      const filtered = posts.filter(post => {
        const title = (post.caption || post.title || post.name || '').toLowerCase();
        const q = query.toLowerCase();
        return title.includes(q);
      });
      console.log('Filtered results:', filtered);
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };


  // Load analytics on mount
  useEffect(() => {
    if (userId) {
      getProfileAnalytics(userId);
    }
  }, [userId]);

  // Form state
  const [form, setForm] = useState({
    total_streams: '',
    revenue: '',
    listeners: '',
    engagement: '',
  });

  const [songs, setSongs] = useState([]);
  const [displaySongs, setDisplaySongs] = useState([]);
  const [countries, setCountries] = useState([]);

  // Resolve songs when analytics change
  useEffect(() => {
    if (!currentAnalytics?.top_songs) {
      setDisplaySongs([]);
      return;
    }

    const resolveSongs = async () => {
      const rawSongs = currentAnalytics.top_songs || [];
      if (!rawSongs.length) {
        setDisplaySongs([]);
        return;
      }

      // If songs are already objects, just use them
      if (typeof rawSongs[0] === 'object') {
        setDisplaySongs(rawSongs);
        return;
      }

      // Otherwise resolve IDs
      try {
        const promises = rawSongs.map(id => getAudioById(id));
        const resolved = await Promise.all(promises);
        const validSongs = resolved.filter(Boolean).map(audio => ({
          ...audio,
          // Ensure we have displayable properties
          name: audio.caption || audio.title || audio.name || 'Unknown',
          streams: audio.streams || audio.plays || 0,
          growth: 0 // Not available from simple ID resolution
        }));
        setDisplaySongs(validSongs);
      } catch (err) {
        console.error('Failed to resolve song IDs:', err);
        setDisplaySongs([]);
      }
    };

    resolveSongs();
  }, [currentAnalytics, getAudioById]);

  // Sync form with current analytics when entering edit mode
  useEffect(() => {
    if (currentAnalytics && isEditing) {
      setForm({
        total_streams: String(currentAnalytics.total_streams || ''),
        revenue: String(currentAnalytics.revenue || ''),
        listeners: String(currentAnalytics.listeners || ''),
        engagement: String(currentAnalytics.engagement || ''),
      });
      // Use the already resolved displaySongs
      setSongs(displaySongs);
      setCountries(currentAnalytics.top_countries || []);
    }
  }, [currentAnalytics, isEditing, displaySongs]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value.replace(/[^\d.]/g, ''),
    }));
  };

  const handleSongChange = (index, field, value) => {
    setSongs((prev) =>
      prev.map((song, i) =>
        i === index ? { ...song, [field]: value } : song
      )
    );
  };

  /* Removed manual song add/remove in favor of Search Select */

  const selectSong = (audio) => {
    // Check if already added
    if (songs.find(s => s.id === audio.id)) return;

    // Add to songs list. 
    // We store the full object for display, but will only send IDs on save.
    // Initialize defaults for display if missing (streams/growth won't be editable or saved per requirements, but good for UI)
    setSongs(prev => [...prev, {
      ...audio,
      name: audio.caption || audio.title || audio.name, // Use caption as primary name
      streams: 0,
      growth: 0
    }]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeSong = (index) => {
    setSongs(prev => prev.filter((_, i) => i !== index));
  };

  const handleCountryChange = (index, field, value) => {
    setCountries((prev) =>
      prev.map((country, i) =>
        i === index ? { ...country, [field]: value } : country
      )
    );
  };

  const addCountry = () => {
    setCountries(prev => [...prev, { name: '', streams: 0, percentage: 0, flag: '🌍' }]);
  };

  const removeCountry = (index) => {
    setCountries(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const toNumber = (v, fallback) => {
      const n = Number(v);
      return Number.isNaN(n) ? fallback : n;
    };

    const payload = {
      total_streams: toNumber(form.total_streams, currentAnalytics?.total_streams || 0),
      revenue: toNumber(form.revenue, currentAnalytics?.revenue || 0),
      listeners: toNumber(form.listeners, currentAnalytics?.listeners || 0),
      engagement: toNumber(form.engagement, currentAnalytics?.engagement || 0),
      engagement: toNumber(form.engagement, currentAnalytics?.engagement || 0),
      top_songs: songs.map(s => s.id), // Send only IDs
      top_countries: countries,
    };

    if (currentAnalytics) {
      await updateAnalytics(userId, payload);
    } else {
      await createAnalytics({ ...payload, profileId: userId });
    }
    setIsEditing(false);
  };

  const handleReset = () => {
    if (currentAnalytics) {
      setForm({
        total_streams: String(currentAnalytics.total_streams || ''),
        revenue: String(currentAnalytics.revenue || ''),
        listeners: String(currentAnalytics.listeners || ''),
        engagement: String(currentAnalytics.engagement || ''),
      });
      setSongs(currentAnalytics.top_songs || []);
      setCountries(currentAnalytics.top_countries || []);
    }
  };

  const stats = useMemo(() => {
    if (!currentAnalytics) return [];
    return [
      {
        label: 'Total Streams',
        value: currentAnalytics.total_streams?.toLocaleString('en-US') || '0',
        change: '+12.4%',
        isPositive: true,
        icon: PlayCircle,
      },
      {
        label: 'Revenue',
        value: `₦${currentAnalytics.revenue?.toLocaleString()}`,
        change: '+5.8%',
        isPositive: true,
        icon: DollarSign,
      },
      {
        label: 'Listeners',
        value: currentAnalytics.listeners?.toLocaleString('en-US') || '0',
        change: '+8.4%',
        isPositive: true,
        icon: Users,
      },
      {
        label: 'Engagement',
        value: `${currentAnalytics.engagement}%`,
        change: '-2.3%',
        isPositive: false,
        icon: Activity,
      },
    ];
  }, [currentAnalytics]);

  if (!selectedUser) {
    return (
      <div className="flex h-screen bg-slate-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Unable to find user analytics for ID {userId}.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <button className="text-xs text-slate-400 hover:text-white mb-1 transition-colors">
                ← Back to users
              </button>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Analytics</h1>
                  <p className="text-slate-400">
                    Track performance for{' '}
                    <span className="font-semibold text-emerald-400">
                      {selectedUser.username}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800/60">
                    {['7days', '30days', '90days'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === range
                          ? 'text-white bg-slate-800 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                          }`}
                      >
                        {range === '7days' ? '7D' : range === '30days' ? '30D' : '90D'}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    {isEditing ? 'Close editor' : 'Edit analytics'}
                  </button>
                  <button className="p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-200">Error</p>
                  <p className="text-sm text-red-300/80">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-900/50 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-200">Success</p>
                  <p className="text-sm text-emerald-300/80">{success}</p>
                </div>
              </div>
            )}

             {/* Content */}
            <div className="space-y-6">
              {/* Edit form */}
              {isEditing && (
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 opacity-50"></div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                       Manual Override
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handleReset}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-1.5 rounded-lg text-xs font-medium text-black bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-900/20"
                      >
                        {isLoading ? 'Saving...' : 'Save analytics'}
                      </button>
                    </div>
                  </div>

                  {/* Top stats editor */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Total streams
                      </label>
                      <input
                        type="text"
                        name="total_streams"
                        value={form.total_streams}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        placeholder="427500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Revenue (NGN)
                      </label>
                      <input
                        type="text"
                        name="revenue"
                        value={form.revenue}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        placeholder="8705"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Listeners
                      </label>
                      <input
                        type="text"
                        name="listeners"
                        value={form.listeners}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        placeholder="24567"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Engagement (%)
                      </label>
                      <input
                        type="text"
                        name="engagement"
                        value={form.engagement}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        placeholder="67.8"
                      />
                    </div>
                  </div>

                  {/* Top songs editor */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-slate-200">
                        Top songs
                      </label>
                    </div>

                    {/* Song Search Input */}
                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-slate-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search for audio..."
                        value={searchQuery}
                        onChange={(e) => handleSearchAudio(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-sm placeholder-slate-600 transition-all"
                      />
                      {/* Dropdown Results */}
                      {searchQuery && (
                        <div className="absolute z-10 w-full mt-1 bg-slate-900 rounded-lg shadow-xl border border-slate-700 max-h-60 overflow-y-auto custom-scrollbar">
                          {isSearching ? (
                            <div className="p-4 text-center text-sm text-slate-400">Searching...</div>
                          ) : searchResults.length > 0 ? (
                            searchResults.map(audio => (
                              <button
                                key={audio.id}
                                onClick={() => selectSong(audio)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-800 flex items-center gap-3 transition-colors border-b border-slate-800/50 last:border-0"
                              >
                                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                  <FiMusic />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{audio.caption || audio.title}</div>
                                  <div className="text-xs text-slate-500">{audio.username || 'Unknown'}</div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-sm text-slate-500">No results found</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {songs.map((song, index) => (
                        <div key={index} className="flex gap-2 items-center bg-slate-950 border border-slate-800 p-2 rounded-lg">
                          <span className="text-xs font-bold text-slate-600 w-6">#{index + 1}</span>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-white">{song?.caption || song?.username}</div>
                            {/* Streams/Growth inputs removed as API only takes IDs */}
                          </div>

                          <button
                            onClick={() => removeSong(index)}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {songs.length === 0 && (
                        <div className="text-center py-6 text-sm text-slate-500 border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/50">
                          No top songs selected
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top countries editor */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-slate-200">
                        Top countries
                      </label>
                      <button
                        onClick={addCountry}
                        className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add country
                      </button>
                    </div>
                    <div className="space-y-3">
                      {countries.map((country, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="w-16">
                            <label className="block text-[10px] font-medium text-slate-500 mb-1">
                              Flag
                            </label>
                            <input
                              type="text"
                              value={country.flag}
                              onChange={(e) =>
                                handleCountryChange(index, 'flag', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-center text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                              placeholder="🌍"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[10px] font-medium text-slate-500 mb-1">
                              Country #{index + 1}
                            </label>
                            <input
                              type="text"
                              value={country.name}
                              onChange={(e) =>
                                handleCountryChange(index, 'name', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                              placeholder="Country name"
                            />
                          </div>
                          <div className="w-32">
                            <label className="block text-[10px] font-medium text-slate-500 mb-1">
                              Streams
                            </label>
                            <input
                              type="text"
                              value={country.streams}
                              onChange={(e) =>
                                handleCountryChange(index, 'streams', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                              placeholder="12345"
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-[10px] font-medium text-slate-500 mb-1">
                              Percentage
                            </label>
                            <input
                              type="text"
                              value={country.percentage}
                              onChange={(e) =>
                                handleCountryChange(index, 'percentage', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                              placeholder="45"
                            />
                          </div>
                          <div className="pt-5">
                            <button
                              onClick={() => removeCountry(index)}
                              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              {!isLoading && currentAnalytics && (
                <>
                  <div className="grid grid-cols-4 gap-6">
                    {stats.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={stat.label}
                          className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 hover:shadow-xl transition-all duration-300 group"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-900/30 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${stat.isPositive
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}
                            >
                              {stat.isPositive ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                              ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                              )}
                              {stat.change}
                            </div>
                          </div>
                          <div className="text-sm font-medium text-slate-400 mb-1 group-hover:text-slate-300 transition-colors">
                            {stat.label}
                          </div>
                          <div className="text-2xl font-bold text-white tracking-tight">
                            {stat.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Listener Growth */}
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Listener Growth
                        </h3>
                        <p className="text-sm text-slate-400">Weekly performance overview</p>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +8.4%
                      </div>
                    </div>
                    <div className="flex items-end justify-between h-64 gap-4">
                      {chartData.map((item) => (
                        <div key={item.day} className="flex-1 flex flex-col items-center group">
                          <div className="w-full bg-slate-800/50 rounded-t-lg relative flex-1 flex items-end overflow-hidden">
                            <div
                              className={`w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-500 opacity-80 group-hover:opacity-100 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] relative`}
                              style={{
                                height: `${item.value}%`,
                              }}
                            >
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30"></div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-slate-500 mt-3 group-hover:text-slate-300 transition-colors">
                            {item.day}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Top Songs */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            Top Songs
                          </h3>
                          <p className="text-sm text-slate-400">Most streamed tracks</p>
                        </div>
                        <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                          View all
                        </button>
                      </div>
                      <div className="space-y-4">
                        {displaySongs.map((song, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all group"
                          >
                            <div
                              className={`w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-emerald-900/20`}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                                {song.caption || song.title || song.name || 'Unknown'}
                              </div>
                              <div className="text-xs text-slate-500 group-hover:text-slate-400">
                                {(song.streams || 0).toLocaleString()} streams
                              </div>
                            </div>
                            <div
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 bg-slate-800 text-slate-400 border border-slate-700`}
                            >
                              <TrendingUp className="w-3 h-3" />
                              -
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Countries */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Top Countries
                        </h3>
                        <p className="text-sm text-slate-400">Geographic distribution</p>
                      </div>
                      <div className="space-y-5">
                        {currentAnalytics.top_countries?.map((country, index) => (
                          <div key={index} className="group">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl border border-slate-700/50">
                                  {country.flag}
                                </div>
                                <div>
                                  <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                    {country.name}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {country.streams?.toLocaleString()} streams
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm font-bold text-slate-300">
                                {country.percentage}%
                              </div>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.4)]`}
                                style={{ width: `${country.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Recent Activity
                      </h3>
                      <p className="text-sm text-slate-400">Latest updates</p>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          action: 'New peak streams',
                          song: 'Midnight Dreams',
                          time: '2 hours ago',
                          icon: TrendingUp,
                        },
                        {
                          action: 'Playlist added',
                          song: 'Summer Vibes',
                          time: '5 hours ago',
                          icon: Music,
                        },
                        {
                          action: 'Milestone reached',
                          song: '100K total streams',
                          time: '1 day ago',
                          icon: Activity,
                        },
                        {
                          action: 'New follower',
                          song: '+1,234 this week',
                          time: '2 days ago',
                          icon: Users,
                        },
                      ].map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all group"
                          >
                            <div className={`p-2.5 bg-slate-800 rounded-lg flex-shrink-0 text-emerald-400 border border-slate-700`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                {activity.action}
                              </div>
                              <div className="text-sm text-slate-400 group-hover:text-slate-300">{activity.song}</div>
                            </div>
                            <div className="text-xs text-slate-500 flex-shrink-0">
                              {activity.time}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Loading State */}
              {isLoading && !currentAnalytics && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading analytics...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserAnalyticsPage;