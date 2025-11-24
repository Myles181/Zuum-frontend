import React, { useState } from 'react';
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
  PlayCircle
} from 'lucide-react';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const topSongs = [
    { name: 'Midnight Dreams', streams: '120,453', growth: '+12.4%', isPositive: true },
    { name: 'Summer Vibes', streams: '110,234', growth: '+8.2%', isPositive: true },
    { name: 'City Lights', streams: '80,567', growth: '-2.1%', isPositive: false },
    { name: 'Ocean Waves', streams: '43,890', growth: '+5.3%', isPositive: true }
  ];

  const topCountries = [
    { name: 'United States', streams: '12,345', percentage: 45, flag: 'US' },
    { name: 'United Kingdom', streams: '9,050', percentage: 33, flag: 'GB' },
    { name: 'Germany', streams: '8,950', percentage: 32, flag: 'DE' },
    { name: 'Canada', streams: '6,234', percentage: 22, flag: 'CA' }
  ];

  const stats = [
    {
      label: 'Total Streams',
      value: '427,500',
      change: '+12.4%',
      isPositive: true,
      icon: PlayCircle,
    },
    {
      label: 'Revenue',
      value: '$8,705',
      change: '+5.8%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: 'Listeners',
      value: '24,567',
      change: '+8.4%',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'Engagement',
      value: '67.8%',
      change: '-2.3%',
      isPositive: false,
      icon: Activity,
    }
  ];

  const chartData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 85 },
    { day: 'Wed', value: 75 },
    { day: 'Thu', value: 90 },
    { day: 'Fri', value: 95 },
    { day: 'Sat', value: 88 },
    { day: 'Sun', value: 100 }
  ];

  // Green gradient for all icons
  const greenGradient = 'bg-gradient-to-br from-[#2D8C72] to-[#34A085]';

  return (
    <div className="min-h-screen overflow-hidden my-13" style={{ background: '#0a0a0a' }}>
      <Navbar name="Analytics" />

      {/* Main Content */}
      <div className="flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <h2 className="text-3xl font-bold text-white">Analytics</h2>
            <p className="text-sm text-gray-400 mt-1">Track your music performance</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {['7days', '30days', '90days'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  style={{
                    background: timeRange === range ? 'rgba(45,140,114,0.2)' : 'transparent'
                  }}
                >
                  {range === '7days' ? '7D' : range === '30days' ? '30D' : '90D'}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl p-5 transition-all hover:scale-[1.02] cursor-pointer"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${greenGradient}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Listener Growth Chart */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Listener Growth</h3>
                  <p className="text-sm text-gray-400">Weekly performance</p>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +8.4%
                </div>
              </div>
              
              <div className="h-56 flex items-end justify-between gap-2">
                {chartData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative group">
                      <div
                        className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                        style={{ 
                          height: `${(item.value / 100) * 200}px`,
                          background: 'linear-gradient(180deg, #2D8C72 0%, #34A085 100%)'
                        }}
                      />
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ background: 'rgba(0,0,0,0.9)' }}>
                        <div className="text-white text-sm font-semibold">{item.value}K</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Songs */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Top Songs</h3>
                  <p className="text-sm text-gray-400">Most streamed tracks</p>
                </div>
                <button className="text-[#2D8C72] text-sm font-semibold hover:text-[#34A085] transition-colors">
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {topSongs.map((song, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/5 cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg ${greenGradient}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white mb-1 truncate">{song.name}</div>
                      <div className="text-sm text-gray-400">{song.streams} streams</div>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${song.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {song.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {song.growth}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Top Countries</h3>
                  <p className="text-sm text-gray-400">Geographic distribution</p>
                </div>
                <Globe className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {topCountries.map((country, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <div className="text-white font-medium">{country.name}</div>
                          <div className="text-sm text-gray-400">{country.streams} streams</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-400">{country.percentage}%</div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${country.percentage}%`,
                          background: 'linear-gradient(90deg, #2D8C72 0%, #34A085 100%)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Recent Activity</h3>
                  <p className="text-sm text-gray-400">Latest updates</p>
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {[
                  { action: 'New peak streams', song: 'Midnight Dreams', time: '2 hours ago', icon: TrendingUp },
                  { action: 'Playlist added', song: 'Summer Vibes', time: '5 hours ago', icon: Music },
                  { action: 'Milestone reached', song: '100K total streams', time: '1 day ago', icon: Activity },
                  { action: 'New follower', song: '+1,234 this week', time: '2 days ago', icon: Users }
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-white/5 cursor-pointer">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#2D8C72]/10 to-[#34A085]/10 text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white mb-1">{activity.action}</div>
                        <div className="text-sm text-gray-400 truncate">{activity.song}</div>
                        <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav activeTab="analytics" />
    </div>
  );
};

export default Analytics;