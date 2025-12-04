import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import AdminSidebar from '../components/Sidebar';
import { useAdmins } from '../hooks/useUsers';

const chartData = [
  { day: 'Mon', value: 65 },
  { day: 'Tue', value: 85 },
  { day: 'Wed', value: 75 },
  { day: 'Thu', value: 90 },
  { day: 'Fri', value: 95 },
  { day: 'Sat', value: 88 },
  { day: 'Sun', value: 100 },
];

const defaultTopSongs = [
  { name: 'Midnight Dreams', streams: '120,453', growth: '+12.4%', isPositive: true },
  { name: 'Summer Vibes', streams: '110,234', growth: '+8.2%', isPositive: true },
  { name: 'City Lights', streams: '80,567', growth: '-2.1%', isPositive: false },
  { name: 'Ocean Waves', streams: '43,890', growth: '+5.3%', isPositive: true },
];

const defaultTopCountries = [
  { name: 'United States', streams: '12,345', percentage: 45, flag: 'US' },
  { name: 'United Kingdom', streams: '9,050', percentage: 33, flag: 'GB' },
  { name: 'Germany', streams: '8,950', percentage: 32, flag: 'DE' },
  { name: 'Canada', streams: '6,234', percentage: 22, flag: 'CA' },
];

const greenGradient = 'bg-gradient-to-br from-[#2D8C72] to-[#34A085]';

const AdminUserAnalyticsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');
  const [isEditing, setIsEditing] = useState(false);

  const { users } = useAdmins();

  const selectedUser = useMemo(
    () => users.find((u) => String(u.id) === String(userId)),
    [users, userId],
  );

  const [metrics, setMetrics] = useState({
    totalStreams: 427500,
    revenue: 8705,
    listeners: 24567,
    engagement: 67.8,
  });

  const [songs, setSongs] = useState(defaultTopSongs);
  const [countries, setCountries] = useState(defaultTopCountries);

  const [form, setForm] = useState({
    totalStreams: String(metrics.totalStreams),
    revenue: String(metrics.revenue),
    listeners: String(metrics.listeners),
    engagement: String(metrics.engagement),
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.replace(/[^\d.]/g, '') }));
  };

  const handleSongChange = (index, field, value) => {
    setSongs((prev) =>
      prev.map((song, i) =>
        i === index ? { ...song, [field]: value } : song,
      ),
    );
  };

  const handleCountryChange = (index, field, value) => {
    setCountries((prev) =>
      prev.map((country, i) =>
        i === index ? { ...country, [field]: value } : country,
      ),
    );
  };

  const handleSave = () => {
    const toNumber = (v, fallback) => {
      const n = Number(v);
      return Number.isNaN(n) ? fallback : n;
    };
    setMetrics({
      totalStreams: toNumber(form.totalStreams, metrics.totalStreams),
      revenue: toNumber(form.revenue, metrics.revenue),
      listeners: toNumber(form.listeners, metrics.listeners),
      engagement: toNumber(form.engagement, metrics.engagement),
    });
    setIsEditing(false);
  };

  const stats = [
    {
      label: 'Total Streams',
      value: metrics.totalStreams.toLocaleString('en-US'),
      change: '+12.4%',
      isPositive: true,
      icon: PlayCircle,
    },
    {
      label: 'Revenue',
      value: `₦${metrics.revenue.toLocaleString()}`,
      change: '+5.8%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: 'Listeners',
      value: metrics.listeners.toLocaleString('en-US'),
      change: '+8.4%',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'Engagement',
      value: `${metrics.engagement}%`,
      change: '-2.3%',
      isPositive: false,
      icon: Activity,
    },
  ];

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
    if (targetRoute) navigate(targetRoute);
  };

  if (!selectedUser) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar
          currentPage="users"
          onPageChange={handlePageChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div
          className={`flex-1 flex items-center justify-center text-sm text-gray-600 ${
            isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
          }`}
        >
          Unable to find user analytics for ID {userId}.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        currentPage="users"
        onPageChange={handlePageChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        <div className="flex flex-col overflow-hidden my-6 mx-4 rounded-2xl border border-gray-200 bg-white">
          {/* Header */}
          <div
            className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            style={{ borderBottom: '1px solid rgba(15,23,42,0.06)' }}
          >
            <div>
              <button
                type="button"
                onClick={() => navigate('/users')}
                className="text-xs text-gray-500 hover:text-gray-700 mb-1"
              >
                &larr; Back to users
              </button>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-7 h-7 text-[#2D8C72]" />
                Analytics
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Track performance for{' '}
                <span className="font-semibold text-gray-900">
                  {selectedUser.username}
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-gray-100">
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
                        timeRange === range
                          ? 'rgba(45,140,114,0.15)'
                          : 'transparent',
                    }}
                  >
                    {range === '7days'
                      ? '7D'
                      : range === '30days'
                      ? '30D'
                      : '90D'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {isEditing ? 'Close editor' : 'Edit analytics'}
              </button>

              <button
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)',
                }}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Edit form */}
            {isEditing && (
              <div className="rounded-2xl p-5 border border-gray-200 bg-gray-50 space-y-4">
                <p className="text-xs font-semibold text-gray-900">
                  Manual analytics override
                </p>

                {/* Top stats editor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Total streams
                    </label>
                    <input
                      type="text"
                      name="totalStreams"
                      value={form.totalStreams}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Revenue (NGN)
                    </label>
                    <input
                      type="text"
                      name="revenue"
                      value={form.revenue}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Listeners
                    </label>
                    <input
                      type="text"
                      name="listeners"
                      value={form.listeners}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Engagement (%)
                    </label>
                    <input
                      type="text"
                      name="engagement"
                      value={form.engagement}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                    />
                  </div>
                </div>

                {/* Top songs editor */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <p className="text-[11px] font-semibold text-gray-700">
                    Top songs
                  </p>
                  <div className="space-y-3">
                    {songs.map((song, index) => (
                      <div
                        key={song.name}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
                      >
                        <div>
                          <label className="block text-[11px] font-medium text-gray-700 mb-1">
                            Title #{index + 1}
                          </label>
                          <input
                            type="text"
                            value={song.name}
                            onChange={(e) =>
                              handleSongChange(index, 'name', e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-700 mb-1">
                            Streams
                          </label>
                          <input
                            type="text"
                            value={song.streams}
                            onChange={(e) =>
                              handleSongChange(index, 'streams', e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-700 mb-1">
                            Growth
                          </label>
                          <input
                            type="text"
                            value={song.growth}
                            onChange={(e) =>
                              handleSongChange(index, 'growth', e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top countries editor */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <p className="text-[11px] font-semibold text-gray-700">
                    Top countries
                  </p>
                  <div className="space-y-3">
                    {countries.map((country, index) => (
                      <div
                        key={country.name}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
                      >
                        <div>
                          <label className="block text-[11px] font-medium text-gray-700 mb-1">
                            Country #{index + 1}
                          </label>
                          <input
                            type="text"
                            value={country.name}
                            onChange={(e) =>
                              handleCountryChange(index, 'name', e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-700 mb-1">
                            Streams
                          </label>
                          <input
                            type="text"
                            value={country.streams}
                            onChange={(e) =>
                              handleCountryChange(
                                index,
                                'streams',
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-700 mb-1">
                            Percentage
                          </label>
                          <input
                            type="text"
                            value={country.percentage}
                            onChange={(e) =>
                              handleCountryChange(
                                index,
                                'percentage',
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D8C72]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        totalStreams: String(metrics.totalStreams),
                        revenue: String(metrics.revenue),
                        listeners: String(metrics.listeners),
                        engagement: String(metrics.engagement),
                      })
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 bg-white/10 hover:bg-white/15"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#2D8C72] hover:bg-[#34A085]"
                  >
                    Save analytics
                  </button>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl p-5 bg-white border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${greenGradient}`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm font-semibold ${
                          stat.isPositive ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {stat.isPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Listener Growth */}
              <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Listener Growth
                    </h3>
                    <p className="text-sm text-gray-600">
                      Weekly performance overview
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    +8.4%
                  </div>
                </div>
                <div className="h-56 flex items-end justify-between gap-2">
                  {chartData.map((item) => (
                    <div
                      key={item.day}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full relative group">
                        <div
                          className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                          style={{
                            height: `${(item.value / 100) * 200}px`,
                            background:
                              'linear-gradient(180deg, #2D8C72 0%, #34A085 100%)',
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Songs */}
              <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Top Songs
                    </h3>
                    <p className="text-sm text-gray-600">
                      Most streamed tracks
                    </p>
                  </div>
                  <button className="text-[#2D8C72] text-sm font-semibold hover:text-[#34A085] transition-colors">
                    View all
                  </button>
                </div>

                <div className="space-y-4">
                  {songs.map((song, index) => (
                      <div
                        key={song.name}
                        className="flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-gray-50 cursor-pointer group"
                      >
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg ${greenGradient}`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 mb-1 truncate">
                            {song.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {song.streams} streams
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1 text-sm font-semibold ${
                            song.isPositive ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {song.isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {song.growth}
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Top Countries */}
              <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Top Countries
                    </h3>
                    <p className="text-sm text-gray-600">
                      Geographic distribution
                    </p>
                  </div>
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {countries.map((country) => (
                    <div key={country.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <div>
                            <div className="text-gray-900 font-medium">
                              {country.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {country.streams} streams
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          {country.percentage}%
                        </div>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${country.percentage}%`,
                            background:
                              'linear-gradient(90deg, #2D8C72 0%, #34A085 100%)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Recent Activity
                    </h3>
                    <p className="text-sm text-gray-600">
                      Latest updates
                    </p>
                  </div>
                  <Calendar className="w-5 h-5 text-gray-400" />
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
                  ].map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.action}
                        className="flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#2D8C72]/10 to-[#34A085]/10 text-[#2D8C72]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 mb-1">
                            {activity.action}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {activity.song}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserAnalyticsPage;


