import React, { useState, useEffect, useRef } from 'react';
import a from "../assets/icons/settings-icon.png";
import BottomNav from '../components/homepage/BottomNav';

const Search = () => {
  const [searchInput, setSearchInput] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Election',
    'All Lori Nugses',
    'Acquitter',
    'Jay-Z'
  ]);

  const searchInputRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearClick = () => {
    setSearchInput('');
    searchInputRef.current.focus();
  };

  const handleRemoveClick = (index) => {
    const newSearches = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(newSearches);
  };

  useEffect(() => {
    const clearButton = document.getElementById('clear-input');
    if (clearButton) {
      clearButton.style.display = searchInput ? 'block' : 'none';
    }
  }, [searchInput]);

  useEffect(() => {
    renderSearchItems();
  }, [recentSearches]);

  const renderSearchItems = () => {
    return recentSearches.map((search, index) => (
      <div key={index} className="search-item flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <span>{search}</span>
        <button
          className="remove-button text-gray-500 text-lg font-bold cursor-pointer"
          onClick={() => handleRemoveClick(index)}
        >
          ×
        </button>
      </div>
    ));
  };

  return (
    <div className="container max-w-480 mx-auto h-screen flex flex-col bg-white shadow-lg">
      {/* Search Header */}
      <div className="search-header flex items-center px-4 py-2 border-b border-gray-200">
        <button className="back-button" onClick={() => window.history.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19L5 12L12 5"></path>
          </svg>
        </button>
        <div className="search-bar flex items-center bg-gray-100 rounded-full px-4 py-2 ml-2 flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            id="search-input"
            placeholder="Search"
            value={searchInput}
            onChange={handleInputChange}
            className="border-none outline-none bg-transparent flex-1 ml-2 text-gray-800 rounded-full"
            ref={searchInputRef}
          />
          <button
            id="clear-input"
            className="clear-button text-gray-500 text-2xl font-bold cursor-pointer"
            style={{ display: searchInput ? 'block' : 'none' }}
            onClick={handleClearClick}
          >
            ×
          </button>
        </div>
        <button className="settings-button ml-2">
          <a href="../LabelSettings/index.html" className="text-black">
            <img src={a} alt="Settings" className="w-6 h-6" />
          </a>
        </button>
      </div>

      {/* Search Results */}
      <div className="search-results flex-1 bg-gray-100 rounded-t-lg p-4 overflow-y-auto">
        {renderSearchItems()}
      </div>

     <BottomNav />
    </div>
  );
};

export default Search;