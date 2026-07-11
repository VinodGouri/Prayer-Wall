import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopHeader from '../components/TopHeader';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import api from '../api';

export default function PostPrayerPage() {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();
  const [name, setName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [category, setCategory] = useState('');
  const [prayerText, setPrayerText] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const CATEGORIES = [
    { value: 'Health', label: t('catHealth') },
    { value: 'Marriage', label: t('catMarriage') },
    { value: 'Family', label: t('catFamily') },
    { value: 'Financial', label: t('catFinancial') },
    { value: 'Education', label: t('catEducation') },
    { value: 'Job', label: t('catJob') },
    { value: 'Travel', label: t('catTravel') },
    { value: 'Ministry', label: t('catMinistry') },
    { value: 'General', label: t('catGeneral') },
    { value: 'Other', label: t('catOther') },
  ];

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      if (!user.assemblyName) {
        navigate('/onboarding');
      }
    }
  }, [user, navigate]);

  if (isGuest) {
    return (
      <>
        <TopHeader title={t('shareYourRequest')} />
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <p className="empty-state-title">{t('signInToPost')}</p>
          <p className="empty-state-text">{t('signInToPostDesc')}</p>
          <button
            className="submit-btn"
            style={{ maxWidth: '200px', margin: '20px auto 0' }}
            onClick={() => navigate('/login')}
          >
            {t('signIn')}
          </button>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <TopHeader title={t('shareYourRequest')} />
        <div className="success-msg">
          <div className="success-msg-icon">🙏</div>
          <h2 className="success-msg-title">{t('prayerShared')}</h2>
          <p className="success-msg-text">
            {t('prayerSharedDesc')}
          </p>
          <button
            className="submit-btn"
            style={{ maxWidth: '240px', margin: '24px auto 0' }}
            onClick={() => {
              setSuccess(false);
              setPrayerText('');
              setCategory('');
              setPhone('');
              setAnonymous(false);
            }}
          >
            {t('shareAnother')}
          </button>
        </div>
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!category) return setError(t('selectCategoryError'));
    if (!prayerText.trim()) return setError(t('enterPrayerError'));
    if (prayerText.length > 500) return setError(t('prayerLengthError'));

    setSubmitting(true);
    try {
      await api.createPrayer({
        name: anonymous ? 'Anonymous' : name,
        anonymous,
        category,
        prayerText: prayerText.trim(),
        phone: phone.trim(),
      });
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
        <form className="post-form" onSubmit={handleSubmit} id="post-prayer-form">
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

          {/* Category */}
          <div className="form-group">
            <label className="form-label">{t('category')}</label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
              id="select-category"
            >
              <option value="">{t('selectCategory')}</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
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
            <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0 0 12px 0' }}>{error}</p>
          )}

          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '16px' }}>
            {t('sharingWith')} {user?.assemblyName || t('yourCommunity')}
          </p>

          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
            id="submit-prayer-btn"
          >
            {submitting ? t('sharing') : t('sharePrayerRequest')}
          </button>
        </form>
      </div>
    </>
  );
}
