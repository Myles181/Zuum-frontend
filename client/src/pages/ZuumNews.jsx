import React, { useState } from 'react';
import { FaSearch, FaFilter, FaBookmark, FaShare, FaHeart, FaEye, FaCalendar, FaUser, FaTag } from 'react-icons/fa';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';

const ZuumNews = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for news articles
  const newsArticles = [
    {
      id: 1,
      title: "Zuum Launches New AI-Powered Music Discovery Feature",
      excerpt: "Revolutionary AI technology helps artists and listeners discover new music like never before. The new feature uses advanced algorithms to match listeners with their perfect sound.",
      category: "feature",
      author: "Zuum Team",
      date: "2024-01-15",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      likes: 124,
      views: 2340,
      featured: true
    },
    {
      id: 2,
      title: "Top 10 Emerging Artists to Watch in 2024",
      excerpt: "Discover the most promising new talents that are making waves in the music industry. From hip-hop to electronic, these artists are redefining the sound of tomorrow.",
      category: "artists",
      author: "Music Editor",
      date: "2024-01-14",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=250&fit=crop",
      likes: 89,
      views: 1567
    },
    {
      id: 3,
      title: "How to Optimize Your Music for Streaming Platforms",
      excerpt: "Expert tips and strategies to help your music stand out on streaming platforms. Learn about metadata, artwork, and promotional techniques that drive engagement.",
      category: "tips",
      author: "Industry Expert",
      date: "2024-01-13",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=250&fit=crop",
      likes: 156,
      views: 2890
    },
    {
      id: 4,
      title: "Zuum Platform Update: Enhanced User Experience",
      excerpt: "Major platform improvements including faster loading times, better mobile experience, and new collaboration features for artists and producers.",
      category: "update",
      author: "Zuum Team",
      date: "2024-01-12",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
      likes: 203,
      views: 3456
    },
    {
      id: 5,
      title: "The Future of Music Distribution: Trends to Watch",
      excerpt: "Explore the latest trends in music distribution and how they're shaping the industry. From blockchain to AI, discover what's next for music creators.",
      category: "trends",
      author: "Industry Analyst",
      date: "2024-01-11",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=250&fit=crop",
      likes: 167,
      views: 2789
    },
    {
      id: 6,
      title: "Success Story: How Artist X Gained 1M Followers",
      excerpt: "An inspiring journey of how one artist used Zuum's platform to build a massive following and launch their career to new heights.",
      category: "success",
      author: "Success Stories",
      date: "2024-01-10",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      likes: 234,
      views: 4123
    }
  ];

  const categories = [
    { id: 'all', name: 'All News', icon: '📰' },
    { id: 'feature', name: 'Features', icon: '⭐' },
    { id: 'artists', name: 'Artists', icon: '🎤' },
    { id: 'tips', name: 'Tips & Tricks', icon: '💡' },
    { id: 'update', name: 'Updates', icon: '🔄' },
    { id: 'trends', name: 'Trends', icon: '📈' },
    { id: 'success', name: 'Success Stories', icon: '🏆' }
  ];

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = newsArticles.find(article => article.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar name="Zuum News" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Zuum News</h1>
          <p className="text-green-100 text-lg mb-6">Stay updated with the latest music industry insights, platform updates, and artist success stories</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && activeCategory === 'all' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Story</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                    <span className="text-gray-500 text-sm">{featuredArticle.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{featuredArticle.title}</h3>
                  <p className="text-gray-600 mb-4">{featuredArticle.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FaUser className="text-green-600" />
                        {featuredArticle.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendar className="text-green-600" />
                        {featuredArticle.date}
                      </span>
                    </div>
                    <span>{featuredArticle.readTime}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Read More
                    </button>
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaHeart className="text-red-500" />
                        {featuredArticle.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye className="text-blue-500" />
                        {featuredArticle.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <FaBookmark className="text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-green-600" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-green-600" />
                    {article.date}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{article.readTime}</span>
                  <div className="flex items-center gap-3 text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaHeart className="text-red-500" />
                      {article.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaEye className="text-blue-500" />
                      {article.views}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <FaShare className="text-green-600" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ZuumNews; 