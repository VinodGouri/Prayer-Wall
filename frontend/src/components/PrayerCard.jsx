import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const CATEGORY_EMOJI_MAP = {
  Health: '💖',
  Marriage: '💍',
  Family: '👨‍👩‍👧‍👦',
  Financial: '🟢',
  Education: '📘',
  Job: '💼',
  Travel: '✈️',
  Ministry: '🕊️',
  General: '✨',
  Other: '🌟',
};

const CATEGORY_CLASS_MAP = {
  Health: 'cat-health',
  Marriage: 'cat-marriage',
  Family: 'cat-family',
  Financial: 'cat-financial',
  Education: 'cat-education',
  Job: 'cat-job',
  Travel: 'cat-travel',
  Ministry: 'cat-ministry',
  General: 'cat-general',
  Other: 'cat-other',
};

export default function PrayerCard({ prayer, onPray }) {
  const { isGuest } = useAuth();
  const { t, lang } = useLang();
  const [prayed, setPrayed] = useState(prayer.hasPrayed || false);
  const [count, setCount] = useState(prayer.prayerCount || 0);
  const [animating, setAnimating] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const handlePray = async () => {
    if (prayed || isGuest) return;
    setAnimating(true);
    setShowHeartBurst(true);
    setPrayed(true);
    setCount(c => c + 1);

    try {
      if (onPray) await onPray(prayer._id);
    } catch {
      setPrayed(false);
      setCount(c => c - 1);
    }

    setTimeout(() => {
      setAnimating(false);
      setShowHeartBurst(false);
    }, 1000);
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
  const categoryEmoji = CATEGORY_EMOJI_MAP[prayer.category] || '✨';
  const categoryClass = CATEGORY_CLASS_MAP[prayer.category] || 'cat-general';

  const isTeluguVerse = (lang === 'te' && !showTranslated) || (lang === 'en' && showTranslated);
  const displayVerseText = prayer.bibleVerse ? (isTeluguVerse ? (prayer.bibleVerse.textTe || prayer.bibleVerse.text) : prayer.bibleVerse.text) : '';
  const displayVerseRef = prayer.bibleVerse ? (isTeluguVerse ? (prayer.bibleVerse.referenceTe || prayer.bibleVerse.reference) : prayer.bibleVerse.reference) : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="prayer-card glass-card"
      id={`prayer-card-${prayer._id}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div className="prayer-card-header">
        <div className="prayer-card-user">
          <div className="prayer-card-avatar" style={{ background: 'linear-gradient(135deg, #fbcfe8 0%, #fed7aa 100%)', color: '#9d174d' }}>
            {prayer.anonymous ? '🕊️' : initial}
          </div>
          <div>
            <div className="prayer-card-name">{displayName}</div>
            <div className="prayer-card-assembly">{prayer.assemblyName}</div>
          </div>
        </div>
        <span className={`prayer-card-category ${categoryClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span>{categoryEmoji}</span>
          <span>{prayer.category}</span>
        </span>
      </div>

      <p className="prayer-card-text">
        {showTranslated && translatedText ? (
          <>
            <span style={{
              fontSize: '0.7rem',
              background: 'var(--color-primary-50)',
              color: 'var(--color-primary-600)',
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
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleTranslate}
          className="translate-toggle-btn"
          disabled={translating}
          style={{
            fontSize: '0.72rem',
            color: 'var(--color-primary-600)',
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
        </motion.button>
        {translationError && (
          <span style={{ fontSize: '0.68rem', color: 'var(--color-danger)', marginLeft: '6px' }}>Error translating</span>
        )}
      </div>

      {/* Bible Verse — comforting verse matched to category */}
      {prayer.bibleVerse && displayVerseText && (
        <div style={{
          margin: '4px 0 12px',
          padding: '10px 14px',
          borderLeft: '3px solid',
          borderLeftColor: 'var(--color-primary-400)',
          background: 'var(--color-primary-50)',
          borderRadius: '0 8px 8px 0',
          fontSize: '0.78rem',
          lineHeight: '1.5',
        }}>
          <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', margin: 0 }}>
            📖 "{displayVerseText}"
          </p>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary-600)', marginTop: '4px', display: 'inline-block' }}>
            — {displayVerseRef}
          </span>
        </div>
      )}

      <div className="prayer-card-divider" />

      <div className="prayer-card-footer" style={{ marginBottom: '12px', position: 'relative' }}>
        <span className="prayer-card-count">
          <motion.span
            animate={animating ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`heart-icon ${animating ? 'heart-pop' : ''}`}
            style={{ display: 'inline-block' }}
          >
            ❤️
          </motion.span>{' '}
          {count} {t('believersPraying')}
        </span>

        {/* Heart particles effect on pray */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ opacity: 0, scale: 2, y: -50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: '20px',
                bottom: '10px',
                pointerEvents: 'none',
                fontSize: '1.5rem',
                zIndex: 10,
              }}
            >
              💖✨🎊
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        whileTap={prayed || isGuest ? {} : { scale: 0.96 }}
        whileHover={prayed || isGuest ? {} : { translateY: -1 }}
        className={`pray-btn ${prayed ? 'prayed' : ''}`}
        onClick={handlePray}
        disabled={prayed || isGuest}
        id={`pray-btn-${prayer._id}`}
        style={prayed ? {} : {
          background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
          boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
        }}
      >
        {prayed ? `🙏 ${t('yourePraying')}` : `❤️ ${t('imPraying')}`}
      </motion.button>
    </motion.div>
  );
}


