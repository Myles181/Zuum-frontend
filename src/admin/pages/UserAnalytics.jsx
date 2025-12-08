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
import { useParams } from 'react-router-dom';

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
  const [countries, setCountries] = useState([]);

  // Sync form with current analytics when entering edit mode
  useEffect(() => {
    if (currentAnalytics && isEditing) {
      setForm({
        total_streams: String(currentAnalytics.total_streams || ''),
        revenue: String(currentAnalytics.revenue || ''),
        listeners: String(currentAnalytics.listeners || ''),
        engagement: String(currentAnalytics.engagement || ''),
      });
      setSongs(currentAnalytics.top_songs || []);
      setCountries(currentAnalytics.top_countries || []);
    }
  }, [currentAnalytics, isEditing]);

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

  const addSong = () => {
    setSongs(prev => [...prev, { id: Date.now(), name: '', streams: 0, growth: 0 }]);
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
      top_songs: songs,
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
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Unable to find user analytics for ID {userId}.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <button className="text-xs text-gray-500 hover:text-gray-700 mb-1">
                ← Back to users
              </button>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
                  <p className="text-gray-600">
                    Track performance for{' '}
                    <span className="font-semibold text-gray-900">
                      {selectedUser.username}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {['7days', '30days', '90days'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        timeRange === range
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                      style={{
                        background:
                          timeRange === range ? 'rgba(45,140,114,0.15)' : 'transparent',
                      }}
                    >
                      {range === '7days' ? '7D' : range === '30days' ? '30D' : '90D'}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {isEditing ? 'Close editor' : 'Edit analytics'}
                  </button>
                  <button className="p-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Success</p>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="space-y-6">
              {/* Edit form */}
              {isEditing && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Manual analytics override
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handleReset}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 bg-white/10 hover:bg-white/15"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-[#2D8C72] hover:bg-[#267A60] disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save analytics'}
                      </button>
                    </div>
                  </div>

                  {/* Top stats editor */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Total streams
                      </label>
                      <input
                        type="text"
                        name="total_streams"
                        value={form.total_streams}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                        placeholder="427500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Revenue (NGN)
                      </label>
                      <input
                        type="text"
                        name="revenue"
                        value={form.revenue}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                        placeholder="8705"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Listeners
                      </label>
                      <input
                        type="text"
                        name="listeners"
                        value={form.listeners}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                        placeholder="24567"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Engagement (%)
                      </label>
                      <input
                        type="text"
                        name="engagement"
                        value={form.engagement}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                        placeholder="67.8"
                      />
                    </div>
                  </div>

                  {/* Top songs editor */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-gray-900">
                        Top songs
                      </label>
                      <button
                        onClick={addSong}
                        className="text-xs font-medium text-[#2D8C72] hover:text-[#267A60] flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add song
                      </button>
                    </div>
                    <div className="space-y-3">
                      {songs.map((song, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] font-medium text-gray-600 mb-1">
                              Title #{index + 1}
                            </label>
                            <input
                              type="text"
                              value={song.name}
                              onChange={(e) =>
                                handleSongChange(index, 'name', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                              placeholder="Song name"
                            />
                          </div>
                          <div className="w-32">
                            <label className="block text-[10px] font-medium text-gray-600 mb-1">
                              Streams
                            </label>
                            <input
                              type="text"
                              value={song.streams}
                              onChange={(e) =>
                                handleSongChange(index, 'streams', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                              placeholder="120453"
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-[10px] font-medium text-gray-600 mb-1">
                              Growth
                            </label>
                            <input
                              type="text"
                              value={song.growth}
                              onChange={(e) =>
                                handleSongChange(index, 'growth', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                              placeholder="+12.4%"
                            />
                          </div>
                          <div className="pt-5">
                            <button
                              onClick={() => removeSong(index)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top countries editor */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-gray-900">
                        Top countries
                      </label>
                      <button
                        onClick={addCountry}
                        className="text-xs font-medium text-[#2D8C72] hover:text-[#267A60] flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add country
                      </button>
                    </div>
                    <div className="space-y-3">
                      {countries.map((country, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="w-16">
                            <label className="block text-[10px] font-medium text-gray-600 mb-1">
                              Flag
                            </label>
                            <input
                              type="text"
                              value={country.flag}
                              onChange={(e) =>
                                handleCountryChange(index, 'flag', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-center focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                              placeholder="🌍"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[10px] font-medium text-gray-600 mb-1">
                              Country #{index + 1}
                            </label>
                            <input
                              type="text"
                              value={country.name}
                              onChange={(e) =>
                                handleCountryChange(index, 'name', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                              placeholder="Country name"
                            />
                          </div>
                          <div className="w-32">
                            <label className="block text-[10px] font-medium text-gray-600 mb-1">
                              Streams
                            </label>
                            <input
                              type="text"
                              value={country.streams}
                              onChange={(e) =>
                                handleCountryChange(index, 'streams', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                              placeholder="12345"
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-[10px] font-medium text-gray-600 mb-1">
                              Percentage
                            </label>
                            <input
                              type="text"
                              value={country.percentage}
                              onChange={(e) =>
                                handleCountryChange(index, 'percentage', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                              placeholder="45"
                            />
                          </div>
                          <div className="pt-5">
                            <button
                              onClick={() => removeCountry(index)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50"
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
                          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${greenGradient}`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                stat.isPositive
                                  ? 'bg-green-50 text-green-600'
                                  : 'bg-red-50 text-red-600'
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
                          <div className="text-sm font-medium text-gray-500 mb-1">
                            {stat.label}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Listener Growth */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Listener Growth
                        </h3>
                        <p className="text-sm text-gray-500">Weekly performance overview</p>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-sm font-semibold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +8.4%
                      </div>
                    </div>
                    <div className="flex items-end justify-between h-64 gap-4">
                      {chartData.map((item) => (
                        <div key={item.day} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-gray-100 rounded-t-lg relative flex-1 flex items-end">
                            <div
                              className={`w-full ${greenGradient} rounded-t-lg transition-all duration-500 hover:opacity-80`}
                              style={{
                                height: `${item.value}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs font-medium text-gray-600 mt-3">
                            {item.day}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Top Songs */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Top Songs
                          </h3>
                          <p className="text-sm text-gray-500">Most streamed tracks</p>
                        </div>
                        <button className="text-sm font-medium text-[#2D8C72] hover:text-[#267A60]">
                          View all
                        </button>
                      </div>
                      <div className="space-y-4">
                        {currentAnalytics.top_songs?.map((song, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div
                              className={`w-10 h-10 ${greenGradient} rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">
                                {song.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {song.streams?.toLocaleString()} streams
                              </div>
                            </div>
                            <div
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                                song.growth >= 0
                                  ? 'bg-green-50 text-green-600'
                                  : 'bg-red-50 text-red-600'
                              }`}
                            >
                              {song.growth >= 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {song.growth >= 0 ? '+' : ''}{song.growth}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Countries */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Top Countries
                        </h3>
                        <p className="text-sm text-gray-500">Geographic distribution</p>
                      </div>
                      <div className="space-y-5">
                        {currentAnalytics.top_countries?.map((country, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                                  {country.flag}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {country.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {country.streams?.toLocaleString()} streams
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm font-bold text-gray-900">
                                {country.percentage}%
                              </div>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${greenGradient} transition-all duration-500`}
                                style={{ width: `${country.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Recent Activity
                      </h3>
                      <p className="text-sm text-gray-500">Latest updates</p>
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
                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className={`p-2.5 ${greenGradient} rounded-lg flex-shrink-0`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900">
                                {activity.action}
                              </div>
                              <div className="text-sm text-gray-600">{activity.song}</div>
                            </div>
                            <div className="text-xs text-gray-500 flex-shrink-0">
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D8C72] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
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