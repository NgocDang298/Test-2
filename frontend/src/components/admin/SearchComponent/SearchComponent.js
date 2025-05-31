import React, { useState } from 'react';
import './SearchComponent.css';

const SearchComponent = ({ onSearch, placeholder, searchType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('fullname');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim(), searchBy);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('', searchBy);
  };

  return (
    <div className="search-component">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <div className="search-field">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder || 'Nhập từ khóa tìm kiếm...'}
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="clear-button"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          {searchType === 'users' && (
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="search-select"
            >
              <option value="fullname">Tìm theo tên</option>
              <option value="email">Tìm theo email</option>
            </select>
          )}
          
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
            Tìm kiếm
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent; 