import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PrayerCard({ prayer, onPray }) {
  const { isGuest } = useAuth();
  const [prayed, setPrayed] = useState(prayer.hasPrayed || false);
  const [count, setCount] = useState(prayer.prayerCount || 0);
  const [animating, setAnimating] = useState(false);

  const handlePray = async () => {
    if (prayed || isGuest) return;
    setAnimating(true);
    setPrayed(true);
    setCount(c => c + 1);

    try {
      if (onPray) await onPray(prayer._id);
    } catch {
      setPrayed(false);
      setCount(c => c - 1);
    }

    setTimeout(() => setAnimating(false), 400);
  };

  const initial = prayer.name?.[0]?.toUpperCase() || '?';
  const displayName = prayer.anonymous ? 'Anonymous' : prayer.name;

  return (
    <div className="prayer-card" id={`prayer-card-${prayer._id}`}>
      <div className="prayer-card-header">
        <div className="prayer-card-user">
          <div className="prayer-card-avatar">
            {prayer.anonymous ? '👤' : initial}
          </div>
          <div>
            <div className="prayer-card-name">{displayName}</div>
            <div className="prayer-card-assembly">{prayer.assemblyName}</div>
          </div>
        </div>
        <span className="prayer-card-category">{prayer.category}</span>
      </div>

      <p className="prayer-card-text">{prayer.prayerText}</p>

      <div className="prayer-card-divider" />

      <div className="prayer-card-footer" style={{ marginBottom: '12px' }}>
        <span className="prayer-card-count">
          <span className={`heart-icon ${animating ? 'heart-pop' : ''}`}>❤️</span>{' '}
          {count} believers praying
        </span>
      </div>

      <button
        className={`pray-btn ${prayed ? 'prayed' : ''}`}
        onClick={handlePray}
        disabled={prayed || isGuest}
        id={`pray-btn-${prayer._id}`}
      >
        {prayed ? '🙏 You\'re Praying' : '🤍 I\'m Praying'}
      </button>
    </div>
  );
}
