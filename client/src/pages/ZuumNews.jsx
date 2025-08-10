import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaThumbsDown, FaRegThumbsDown } from 'react-icons/fa';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';

const ZuumNews = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [reactions, setReactions] = useState({});

  // Mock data for news articles
  const newsArticles = [
    {
      id: 1,
      title: "Zuum Launches New AI-Powered Music Discovery Feature",
      excerpt: "Revolutionary AI technology helps artists and listeners discover new music like never before.",
      category: "feature",
      date: "2024-01-15",
      readTime: "3 min",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      likes: 124,
      dislikes: 5,
      featured: true
    },
    {
      id: 2,
      title: "Top 10 Emerging Artists to Watch in 2024",
      excerpt: "Discover the most promising new talents that are making waves in the music industry.",
      category: "artists",
      date: "2024-01-14",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=250&fit=crop",
      likes: 89,
      dislikes: 2
    },
    {
      id: 3,
      title: "How to Optimize Your Music for Streaming Platforms",
      excerpt: "Expert tips and strategies to help your music stand out on streaming platforms.",
      category: "tips",
      date: "2024-01-13",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=250&fit=crop",
      likes: 156,
      dislikes: 8
    },
    {
      id: 4,
      title: "Zuum Platform Update: Enhanced User Experience",
      excerpt: "Major platform improvements including faster loading times and better mobile experience.",
      category: "update",
      date: "2024-01-12",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
      likes: 203,
      dislikes: 12
    },
    {
      id: 5,
      title: "The Future of Music Distribution: Trends to Watch",
      excerpt: "Explore the latest trends in music distribution and how they're shaping the industry.",
      category: "trends",
      date: "2024-01-11",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=250&fit=crop",
      likes: 167,
      dislikes: 9
    },
    {
      id: 6,
      title: "Success Story: How Artist X Gained 1M Followers",
      excerpt: "An inspiring journey of how one artist used Zuum's platform to build a massive following.",
      category: "success",
      date: "2024-01-10",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      likes: 234,
      dislikes: 15
    }
  ];

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'feature', name: 'Features' },
    { id: 'artists', name: 'Artists' },
    { id: 'tips', name: 'Tips' },
    { id: 'update', name: 'Updates' },
    { id: 'trends', name: 'Trends' },
    { id: 'success', name: 'Success' }
  ];

  const filteredArticles = newsArticles.filter(article => 
    activeCategory === 'all' || article.category === activeCategory
  );

  const handleReaction = (id, type) => {
    setReactions(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  return (
    <div className="min-h-screen my-10 bg-gray-50 dark:bg-gray-900">
      <Navbar name="Zuum News" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1c6350] to-[#2a9d8f] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Zuum News</h1>
          <p className="text-green-100 text-lg">Stay updated with music industry insights and platform updates</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-[#1c6350] text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <article
              key={article.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-[#1c6350] text-white px-3 py-1 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2">
                    {article.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                
                {/* Reactions */}
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleReaction(article.id, 'like')}
                      className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-[#1c6350] dark:hover:text-[#2d8c72]"
                    >
                      {reactions[article.id] === 'like' ? (
                        <FaHeart className="text-[#1c6350] dark:text-[#2d8c72]" />
                      ) : (
                        <FaRegHeart />
                      )}
                      <span>{article.likes + (reactions[article.id] === 'like' ? 1 : 0)}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleReaction(article.id, 'dislike')}
                      className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-500"
                    >
                      {reactions[article.id] === 'dislike' ? (
                        <FaThumbsDown className="text-red-500" />
                      ) : (
                        <FaRegThumbsDown />
                      )}
                      <span>{article.dislikes + (reactions[article.id] === 'dislike' ? 1 : 0)}</span>
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
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try selecting a different category</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ZuumNews;