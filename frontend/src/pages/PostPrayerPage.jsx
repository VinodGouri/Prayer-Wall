import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopHeader from '../components/TopHeader';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import api from '../api';

export default function PostPrayerPage() {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();
  
  const [postAsGuest, setPostAsGuest] = useState(false);
  const [name, setName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [category, setCategory] = useState('');
  const [prayerText, setPrayerText] = useState('');
  const [phone, setPhone] = useState('');
  const [assemblyName, setAssemblyName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [successVerse, setSuccessVerse] = useState(null);

  const CATEGORIES = [
    { value: 'Health', label: t('catHealth'), emoji: '💖', colorClass: 'cat-health' },
    { value: 'Marriage', label: t('catMarriage'), emoji: '💍', colorClass: 'cat-marriage' },
    { value: 'Family', label: t('catFamily'), emoji: '👨‍👩‍👧‍👦', colorClass: 'cat-family' },
    { value: 'Financial', label: t('catFinancial'), emoji: '🟢', colorClass: 'cat-financial' },
    { value: 'Education', label: t('catEducation'), emoji: '📘', colorClass: 'cat-education' },
    { value: 'Job', label: t('catJob'), emoji: '💼', colorClass: 'cat-job' },
    { value: 'Travel', label: t('catTravel'), emoji: '✈️', colorClass: 'cat-travel' },
    { value: 'Ministry', label: t('catMinistry'), emoji: '🕊️', colorClass: 'cat-ministry' },
    { value: 'General', label: t('catGeneral'), emoji: '✨', colorClass: 'cat-general' },
    { value: 'Other', label: t('catOther'), emoji: '🌟', colorClass: 'cat-other' },
  ];

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      if (!user.assemblyName) {
        navigate('/onboarding');
      }
    }
  }, [user, navigate]);

  if (isGuest && !postAsGuest) {
    return (
      <>
        <TopHeader title={t('shareYourRequest')} />
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <p className="empty-state-title">{t('signInToPost')}</p>
          <p className="empty-state-text">{t('signInToPostDesc')}</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="submit-btn"
            style={{ maxWidth: '200px', margin: '20px auto 0' }}
            onClick={() => navigate('/login')}
          >
            {t('signIn')}
          </motion.button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px auto', width: '80%', maxWidth: '200px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            <span style={{ padding: '0 10px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t('or')}</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="guest-btn"
            style={{ margin: '0 auto', display: 'block', textDecoration: 'underline' }}
            onClick={() => setPostAsGuest(true)}
            id="post-as-guest-btn"
          >
            {t('shareAsGuest')}
          </motion.button>
        </div>
      </>
    );
  }

  if (success) {
    const displayVerseText = successVerse ? (lang === 'te' ? (successVerse.textTe || successVerse.text) : successVerse.text) : '';
    const displayVerseRef = successVerse ? (lang === 'te' ? (successVerse.referenceTe || successVerse.reference) : successVerse.reference) : '';

    return (
      <>
        <TopHeader title={t('shareYourRequest')} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="success-msg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.5 }}
            className="success-msg-icon"
          >
            🙏✨
          </motion.div>
          <h2 className="success-msg-title">{t('prayerShared')}</h2>
          <p className="success-msg-text">
            {t('prayerSharedDesc')}
          </p>

          {/* Show the comforting Bible verse */}
          {successVerse && displayVerseText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              style={{
                margin: '20px auto',
                maxWidth: '360px',
                padding: '16px 18px',
                borderLeft: '3px solid var(--color-gold-400)',
                background: 'var(--color-gold-100)',
                borderRadius: '0 12px 12px 0',
                textAlign: 'left',
              }}
            >
              <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.88rem', lineHeight: '1.6' }}>
                📖 "{displayVerseText}"
              </p>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gold-500)', marginTop: '6px', display: 'inline-block' }}>
                — {displayVerseRef}
              </span>
            </motion.div>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="submit-btn"
            style={{ maxWidth: '240px', margin: '24px auto 0' }}
            onClick={() => {
              setSuccess(false);
              setPrayerText('');
              setCategory('');
              setPhone('');
              setAssemblyName('');
              setAnonymous(false);
              setSuccessVerse(null);
            }}
          >
            {t('shareAnother')}
          </motion.button>
        </motion.div>
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!category) return setError(t('selectCategoryError'));
    if (!prayerText.trim()) return setError(t('enterPrayerError'));
    if (prayerText.length > 500) return setError(t('prayerLengthError'));

    const finalAssembly = isGuest ? assemblyName.trim() : (user?.assemblyName || '');
    if (isGuest && !finalAssembly) {
      return setError('Please enter your assembly location or village name.');
    }

    setSubmitting(true);
    try {
      const data = await api.createPrayer({
        name: anonymous ? 'Anonymous' : (name.trim() || 'Guest'),
        anonymous,
        category,
        prayerText: prayerText.trim(),
        phone: phone.trim(),
        assemblyName: finalAssembly,
      });

      // Save request ID locally for guests so they can see history under My Prayers
      if (isGuest && data.prayer?._id) {
        const guestIds = JSON.parse(localStorage.getItem('guest_prayer_ids') || '[]');
        guestIds.push(data.prayer._id);
        localStorage.setItem('guest_prayer_ids', JSON.stringify(guestIds));
      }

      // Capture the Bible verse returned from backend
      if (data.prayer?.bibleVerse) {
        setSuccessVerse(data.prayer.bibleVerse);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  return (
    <>
      <TopHeader title={t('shareYourRequest')} />

      <p className="post-verse">
        {t('postVerse')}
      </p>

      <div className="post-page">
        {isGuest && (
          <div style={{
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '20px',
            fontSize: '0.82rem',
            color: 'var(--color-primary-600)',
            lineHeight: '1.4'
          }}>
            ℹ️ {t('guestWarning')}
          </div>
        )}

        <form className="post-form glass-card" onSubmit={handleSubmit} id="post-prayer-form">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">{t('yourName')}</label>
            <input
              type="text"
              className="form-input"
              placeholder={t('enterYourName')}
              value={anonymous ? '' : name}
              onChange={e => setName(e.target.value)}
              disabled={anonymous}
              id="input-name"
            />
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={e => setAnonymous(e.target.checked)}
                id="checkbox-anonymous"
              />
              <label htmlFor="checkbox-anonymous">{t('shareAsAnonymous')}</label>
            </div>
          </div>

          {/* Assembly Name (For Guests only) */}
          {isGuest && (
            <div className="form-group">
              <label className="form-label">{t('assemblyLabel')}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t('assemblyPlaceholder')}
                value={assemblyName}
                onChange={e => setAssemblyName(e.target.value)}
                id="input-assembly-guest"
                required
              />
            </div>
          )}

          {/* Category */}
          <div className="form-group">
            <label className="form-label">{t('category')}</label>

            {/* Visual category chips picker */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat.value}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setCategory(cat.value)}
                  className={`filter-chip ${cat.colorClass}`}
                  style={{
                    opacity: category === cat.value ? 1 : 0.65,
                    transform: category === cat.value ? 'scale(1.04)' : 'scale(1)',
                    boxShadow: category === cat.value ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    fontWeight: category === cat.value ? 700 : 500,
                  }}
                >
                  <span style={{ marginRight: '4px' }}>{cat.emoji}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>

            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
              id="select-category"
            >
              <option value="">{t('selectCategory')}</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</option>
              ))}
            </select>
          </div>

          {/* Prayer Text */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">{t('prayerRequest')}</label>
              <span className={`char-count ${prayerText.length > 500 ? 'limit' : ''}`}>
                {prayerText.length} / 500
              </span>
            </div>
            <textarea
              className="form-textarea"
              placeholder={t('whatCanWePray')}
              value={prayerText}
              onChange={e => setPrayerText(e.target.value)}
              maxLength={500}
              id="textarea-prayer"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">{t('phoneOptional')}</label>
            <input
              type="tel"
              className="form-input"
              placeholder={t('phoneDesc')}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              id="input-phone"
            />
          </div>

          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', margin: '0 0 12px 0' }}>{error}</p>
          )}

          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            {t('sharingWith')} {isGuest ? (assemblyName || 'your community') : (user?.assemblyName || t('yourCommunity'))}
          </p>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="submit-btn"
            disabled={submitting}
            id="submit-prayer-btn"
          >
            {submitting ? t('sharing') : t('sharePrayerRequest')}
          </motion.button>
        </form>
      </div>
    </>
  );
}

