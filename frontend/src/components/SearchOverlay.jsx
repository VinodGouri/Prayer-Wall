import { useState } from 'react';

export default function SearchOverlay({ onClose, onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="search-overlay" id="search-overlay">
      <form onSubmit={handleSearch}>
        <div className="search-bar">
          <button type="button" onClick={onClose} aria-label="Close search" style={{ fontSize: '1.1rem' }}>
            ←
          </button>
          <input
            type="text"
            placeholder="Search prayers, names, churches..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            id="search-input"
          />
          <button type="submit" aria-label="Search" style={{ fontSize: '1rem' }}>
            🔍
          </button>
        </div>
      </form>

      {query.length > 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
          Press Enter to search for "{query}"
        </div>
      )}
    </div>
  );
}
