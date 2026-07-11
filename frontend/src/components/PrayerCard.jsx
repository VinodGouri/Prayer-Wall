import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function PrayerCard({ prayer, onPray }) {
  const { isGuest } = useAuth();
  const { t } = useLang();
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

  const [translatedText, setTranslatedText] = useState(null);
  const [showTranslated, setShowTranslated] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(false);

  const isTeluguText = /[\u0c00-\u0c7f]/.test(prayer.prayerText);
  const transPairLabel = isTeluguText ? 'TE-EN' : 'EN-TE';
  const targetLang = isTeluguText ? 'en' : 'te';

  const handleTranslate = async () => {
    if (showTranslated) {
      setShowTranslated(false);
      return;
    }

    if (translatedText) {
      setShowTranslated(true);
      return;
    }

    setTranslating(true);
    setTranslationError(false);
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
          prayer.prayerText
        )}`
      );
      if (!res.ok) throw new Error('Translation failed');
      const data = await res.json();
      if (data && data[0]) {
        const translation = data[0].map(item => item[0]).filter(Boolean).join('');
        setTranslatedText(translation);
        setShowTranslated(true);
      } else {
        throw new Error('Invalid translation response');
      }
    } catch (err) {
      console.error(err);
      setTranslationError(true);
    } finally {
      setTranslating(false);
    }
  };

  const initial = prayer.name?.[0]?.toUpperCase() || '?';
  const displayName = prayer.anonymous ? t('anonymous') : prayer.name;

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

      <p className="prayer-card-text">
        {showTranslated && translatedText ? (
          <>
            <span style={{
              fontSize: '0.7rem',
              background: '#eff6ff',
              color: '#2563eb',
              padding: '2px 6px',
              borderRadius: '4px',
              marginRight: '6px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              🌐 {transPairLabel}
            </span>
            {translatedText}
          </>
        ) : (
          prayer.prayerText
        )}
      </p>

      {/* Translation action button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '-8px', marginBottom: '8px', padding: '0 2px' }}>
        <button
          onClick={handleTranslate}
          className="translate-toggle-btn"
          disabled={translating}
          style={{
            fontSize: '0.72rem',
            color: '#2563eb',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: '4px',
          }}
        >
          {translating ? '⏳' : showTranslated ? '↩️ Original' : `🌐 ${transPairLabel}`}
        </button>
        {translationError && (
          <span style={{ fontSize: '0.68rem', color: '#dc2626', marginLeft: '6px' }}>Error translating</span>
        )}
      </div>

      <div className="prayer-card-divider" />

      <div className="prayer-card-footer" style={{ marginBottom: '12px' }}>
        <span className="prayer-card-count">
          <span className={`heart-icon ${animating ? 'heart-pop' : ''}`}>❤️</span>{' '}
          {count} {t('believersPraying')}
        </span>
      </div>

      <button
        className={`pray-btn ${prayed ? 'prayed' : ''}`}
        onClick={handlePray}
        disabled={prayed || isGuest}
        id={`pray-btn-${prayer._id}`}
      >
        {prayed ? t('yourePraying') : t('imPraying')}
      </button>
    </div>
  );
}
