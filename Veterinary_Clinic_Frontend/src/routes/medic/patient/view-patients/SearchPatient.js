import React, { useState } from 'react';
import './PatientsView.css';
function SearchPatient({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (searchTerm) {
      onSearch(searchTerm);
    }
  };

  return (
    <div>
      <input
        className='search-width search-height search-bar-bar'
        type='text'
        placeholder='  Search by name...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <button className='small-width search-height reset-search-and-details-button' onClick={handleSearch} onClickCapture={handleSearch}>Search</button>
    </div>
  );
}

export default SearchPatient;