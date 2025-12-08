import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaThumbsDown, FaRegThumbsDown } from 'react-icons/fa';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';
import { useNews } from '../admin/hooks/useNews';

const ZuumNews = () => {
  const [reactions, setReactions] = useState({});
  
  // Use the news hook
  const {
    news,
    isLoading,
    error,
    success,
    fetchNews,
    resetError,
  } = useNews();

  // Fetch news on component mount
  useEffect(() => {
    fetchNews({ limit: 50, offset: 0 });
  }, [fetchNews]);

  // Dark mode styles matching UploadPage
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151',
    '--color-success': '#10b981',
    '--color-error': '#ef4444'
  };

  const handleReaction = (id, type) => {
    setReactions(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
    
    // TODO: Implement API call to update reactions
    // This would require a new endpoint like:
    // POST /api/news/{id}/reaction
    // with body: { type: 'like' | 'dislike' }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleRefresh = () => {
    fetchNews({ limit: 50, offset: 0 });
  };

  // Calculate read time based on content length
  const calculateReadTime = (content) => {
    if (!content) return '1 min';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min`;
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
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Zuum News</h1>
            <p className="text-green-100 text-lg">Stay updated with music industry insights and platform updates</p>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-3 rounded-full border transition-colors disabled:opacity-50"
            style={{ 
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }}
            title="Refresh news"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="max-w-6xl mx-auto mt-4 p-3 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-100">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-6xl mx-auto mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-300" />
            <span className="text-sm text-red-100">{error}</span>
            <button
              onClick={resetError}
              className="ml-auto text-red-300 hover:text-white"
            >
              ×
            </button>
          </div>
        )}
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
            {/* Loading State */}
            {isLoading && news.length === 0 ? (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full" 
                     style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2D8C72' }} />
                </div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Loading news...
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Fetching the latest updates
                </p>
              </div>
            ) : news.length > 0 ? (
              /* News Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((newsItem) => {
                  const readTime = calculateReadTime(newsItem.content);
                  const likes = newsItem.likes || 0;
                  const dislikes = newsItem.dislikes || 0;
                  const userReaction = reactions[newsItem.id];
                  
                  return (
                    <article
                      key={newsItem.id}
                      className="rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2"
                      style={{ 
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <div className="relative h-48">
                        {newsItem.image ? (
                          <img
                            src={newsItem.image}
                            alt={newsItem.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop';
                            }}
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: '#374151' }}
                          >
                            <div className="text-4xl">📰</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 
                            className="text-lg font-bold line-clamp-2"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {newsItem.title}
                          </h3>
                        </div>
                        
                        <p 
                          className="text-sm mb-4 line-clamp-3"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {newsItem.content?.substring(0, 150)}...
                        </p>
                        
                        <div 
                          className="flex items-center justify-between text-xs mb-4"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          <span>{formatDate(newsItem.createdAt || newsItem.created_at)}</span>
                          <span>{readTime} read</span>
                        </div>
                        
                        {/* Reactions */}
                        <div 
                          className="flex items-center justify-between border-t pt-3"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          <div className="flex items-center space-x-4">
                            <button 
                              onClick={() => handleReaction(newsItem.id, 'like')}
                              className="flex items-center space-x-1 transition-colors duration-300"
                              style={{ 
                                color: userReaction === 'like' ? '#2D8C72' : 'var(--color-text-secondary)'
                              }}
                              onMouseEnter={(e) => {
                                if (userReaction !== 'like') {
                                  e.currentTarget.style.color = '#2D8C72';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (userReaction !== 'like') {
                                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                                }
                              }}
                            >
                              {userReaction === 'like' ? (
                                <FaHeart />
                              ) : (
                                <FaRegHeart />
                              )}
                              <span>{likes + (userReaction === 'like' ? 1 : 0)}</span>
                            </button>
                            
                            <button 
                              onClick={() => handleReaction(newsItem.id, 'dislike')}
                              className="flex items-center space-x-1 transition-colors duration-300"
                              style={{ 
                                color: userReaction === 'dislike' ? '#ef4444' : 'var(--color-text-secondary)'
                              }}
                              onMouseEnter={(e) => {
                                if (userReaction !== 'dislike') {
                                  e.currentTarget.style.color = '#ef4444';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (userReaction !== 'dislike') {
                                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                                }
                              }}
                            >
                              {userReaction === 'dislike' ? (
                                <FaThumbsDown />
                              ) : (
                                <FaRegThumbsDown />
                              )}
                              <span>{dislikes + (userReaction === 'dislike' ? 1 : 0)}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📰</div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  No news articles yet
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Check back later for updates
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