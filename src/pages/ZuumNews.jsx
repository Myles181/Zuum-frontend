import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaThumbsDown, FaRegThumbsDown } from 'react-icons/fa';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';

const ZuumNews = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [reactions, setReactions] = useState({});

  // Dark mode styles matching UploadPage
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151'
  };

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
    <div style={darkModeStyles}>
      <Navbar name="Zuum News" />
      
      {/* Header */}
      <div 
        className="text-white py-12 px-4"
        style={{ 
          background: 'linear-gradient(to right, #2D8C72, #1f6352)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Zuum News</h1>
          <p className="text-green-100 text-lg">Stay updated with music industry insights and platform updates</p>
        </div>
      </div>

      <div 
        className="flex items-center justify-center mt-10 mb-10"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div 
          className="container w-full md:w-11/12 lg:w-5/6 overflow-hidden rounded-lg shadow-lg"
          style={{ 
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div className="p-8">
            {/* Categories */}
            <div className="mb-8 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 transform hover:scale-105`}
                    style={
                      activeCategory === category.id
                        ? { 
                            backgroundColor: '#2D8C72', 
                            color: 'white' 
                          }
                        : { 
                            backgroundColor: 'var(--color-bg-secondary)', 
                            color: 'var(--color-text-secondary)',
                            border: '1px solid var(--color-border)'
                          }
                    }
                    onMouseEnter={(e) => {
                      if (activeCategory !== category.id) {
                        e.target.style.backgroundColor = '#374151';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeCategory !== category.id) {
                        e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                      }
                    }}
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
                  className="rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2"
                  style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div className="relative h-48">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: '#2D8C72' }}
                      >
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 
                        className="text-lg font-bold line-clamp-2"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {article.title}
                      </h3>
                    </div>
                    
                    <p 
                      className="text-sm mb-4 line-clamp-3"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {article.excerpt}
                    </p>
                    
                    <div 
                      className="flex items-center justify-between text-xs mb-4"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                    
                    {/* Reactions */}
                    <div 
                      className="flex items-center justify-between border-t pt-3"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleReaction(article.id, 'like')}
                          className="flex items-center space-x-1 transition-colors duration-300"
                          style={{ 
                            color: reactions[article.id] === 'like' ? '#2D8C72' : 'var(--color-text-secondary)'
                          }}
                          onMouseEnter={(e) => {
                            if (reactions[article.id] !== 'like') {
                              e.currentTarget.style.color = '#2D8C72';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (reactions[article.id] !== 'like') {
                              e.currentTarget.style.color = 'var(--color-text-secondary)';
                            }
                          }}
                        >
                          {reactions[article.id] === 'like' ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                          <span>{article.likes + (reactions[article.id] === 'like' ? 1 : 0)}</span>
                        </button>
                        
                        <button 
                          onClick={() => handleReaction(article.id, 'dislike')}
                          className="flex items-center space-x-1 transition-colors duration-300"
                          style={{ 
                            color: reactions[article.id] === 'dislike' ? '#ef4444' : 'var(--color-text-secondary)'
                          }}
                          onMouseEnter={(e) => {
                            if (reactions[article.id] !== 'dislike') {
                              e.currentTarget.style.color = '#ef4444';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (reactions[article.id] !== 'dislike') {
                              e.currentTarget.style.color = 'var(--color-text-secondary)';
                            }
                          }}
                        >
                          {reactions[article.id] === 'dislike' ? (
                            <FaThumbsDown />
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
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  No articles found
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Try selecting a different category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ZuumNews;