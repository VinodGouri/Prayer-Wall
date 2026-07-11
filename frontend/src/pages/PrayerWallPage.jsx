import { useState, useEffect } from 'react';
import TopHeader from '../components/TopHeader';
import PrayerCard from '../components/PrayerCard';
import SearchOverlay from '../components/SearchOverlay';
import { useLang } from '../context/LanguageContext';
import api from '../api';

export default function PrayerWallPage() {
  const { t } = useLang();
  const [prayers, setPrayers] = useState([]);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const SORT_OPTIONS = [
    { key: 'newest', label: t('newest') },
    { key: 'most_prayed', label: t('mostPrayed') },
    { key: 'oldest', label: t('oldest') },
  ];

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: 20 };
      if (search) params.search = search;
      const data = await api.getPrayers(params);
      setPrayers(data.prayers);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching prayers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrayers();
  }, [sort, search, page]);

  const handlePray = async (prayerId) => {
    await api.prayFor(prayerId);
  };

  const handleSearch = (query) => {
    setSearch(query);
    setShowSearch(false);
    setPage(1);
  };

  return (
    <>
      <TopHeader title={t('prayerWall')} onSearchOpen={() => setShowSearch(true)} />

      {showSearch && (
        <SearchOverlay
          onClose={() => setShowSearch(false)}
          onSearch={handleSearch}
        />
      )}

      {/* Hero section */}
      <div className="wall-hero">
        <p className="wall-hero-label">{t('morningDevotion')}</p>
        <h1 className="wall-hero-title">{t('heroTitle')}</h1>
      </div>

      {/* Sort chips */}
      <div className="filter-chips">
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.key}
            className={`filter-chip ${sort === opt.key ? 'active' : ''}`}
            onClick={() => { setSort(opt.key); setPage(1); }}
            id={`sort-${opt.key}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {search && (
        <div style={{ padding: '0 20px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{t('resultsFor')} "{search}"</span>
          <button
            onClick={() => { setSearch(''); setPage(1); }}
            style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}
          >
            {t('clear')}
          </button>
        </div>
      )}

      {/* Prayer list */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">🙏</div>
          <p className="empty-state-text">{t('loadingPrayers')}</p>
        </div>
      ) : prayers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🕊️</div>
          <p className="empty-state-title">{t('noPrayersYet')}</p>
          <p className="empty-state-text">{t('noPrayersDesc')}</p>
        </div>
      ) : (
        <>
          {prayers.map(prayer => (
            <PrayerCard key={prayer._id} prayer={prayer} onPray={handlePray} />
          ))}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', padding: '20px' }}>
              <button
                className="filter-chip"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {t('prev')}
              </button>
              <span style={{ padding: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                {page} / {totalPages}
              </span>
              <button
                className="filter-chip"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                {t('next')}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
