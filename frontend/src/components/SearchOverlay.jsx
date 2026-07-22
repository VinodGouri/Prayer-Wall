import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export default function SearchOverlay({ onClose, onSearch }) {
  const [query, setQuery] = useState('');
  const { t } = useLang();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="search-overlay"
      id="search-overlay"
      style={{ background: 'var(--color-surface-card)' }}
    >
      <motion.form
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        onSubmit={handleSearch}
      >
        <div className="search-bar">
          <button type="button" onClick={onClose} aria-label="Close search" style={{ fontSize: '1.1rem' }}>
            ←
          </button>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            id="search-input"
          />
          <button type="submit" aria-label={t('search')} style={{ fontSize: '1rem' }}>
            🔍
          </button>
        </div>
      </motion.form>

      {query.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}
        >
          {t('pressEnterToSearch')} "{query}"
        </motion.div>
      )}
    </motion.div>
  );
}

