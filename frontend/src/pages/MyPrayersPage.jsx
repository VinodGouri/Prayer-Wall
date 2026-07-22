import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopHeader from '../components/TopHeader';
import ConfirmModal from '../components/ConfirmModal';
import UndoToast from '../components/UndoToast';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import api from '../api';

export default function MyPrayersPage() {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [tab, setTab] = useState('active');
  const [activePrayers, setActivePrayers] = useState([]);
  const [answeredPrayers, setAnsweredPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmPrayer, setConfirmPrayer] = useState(null);
  const [undoPrayer, setUndoPrayer] = useState(null);
  const [testimonyModal, setTestimonyModal] = useState(null);
  const [testimonyText, setTestimonyText] = useState('');

  // Get guest prayer IDs from local storage
  const getGuestPrayerIds = () => {
    try {
      return JSON.parse(localStorage.getItem('guest_prayer_ids') || '[]');
    } catch {
      return [];
    }
  };

  const guestIds = getGuestPrayerIds();

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      if (isGuest) {
        if (guestIds.length === 0) {
          setActivePrayers([]);
          setAnsweredPrayers([]);
        } else {
          if (tab === 'active') {
            const data = await api.getMyActive(guestIds);
            setActivePrayers(data.prayers);
          } else {
            const data = await api.getMyAnswered(guestIds);
            setAnsweredPrayers(data.prayers);
          }
        }
      } else {
        if (tab === 'active') {
          const data = await api.getMyActive();
          setActivePrayers(data.prayers);
        } else {
          const data = await api.getMyAnswered();
          setAnsweredPrayers(data.prayers);
        }
      }
    } catch (error) {
      console.error('Error fetching my prayers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrayers();
  }, [tab, isGuest]);

  const handleMarkAnswered = async () => {
    if (!confirmPrayer) return;
    try {
      await api.markAnswered(confirmPrayer._id);
      setActivePrayers(prev => prev.filter(p => p._id !== confirmPrayer._id));
      setUndoPrayer(confirmPrayer);
      setConfirmPrayer(null);
    } catch (err) {
      console.error('Error marking answered:', err);
      setConfirmPrayer(null);
    }
  };

  const handleUndo = async () => {
    if (!undoPrayer) return;
    try {
      await api.undoAnswered(undoPrayer._id);
      setActivePrayers(prev => [undoPrayer, ...prev]);
      setUndoPrayer(null);
    } catch (err) {
      console.error('Error undoing:', err);
    }
  };

  const handleSubmitTestimony = async () => {
    if (!testimonyModal || !testimonyText.trim()) return;
    try {
      await api.submitTestimony({
        prayerId: testimonyModal._id,
        testimonyText: testimonyText.trim(),
      });
      setTestimonyModal(null);
      setTestimonyText('');
      fetchPrayers();
    } catch (err) {
      console.error('Error submitting testimony:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const showSignInScreen = isGuest && guestIds.length === 0;

  if (showSignInScreen) {
    return (
      <>
        <TopHeader title={t('myPrayers')} />
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <p className="empty-state-title">{t('signInToView')}</p>
          <p className="empty-state-text">{t('signInToViewDesc')}</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="submit-btn"
            style={{ maxWidth: '200px', margin: '20px auto 0' }}
            onClick={() => navigate('/login')}
          >
            {t('signIn')}
          </motion.button>
        </div>
      </>
    );
  }

  return (
    <>
      <TopHeader title={t('prayerWall')} />

      <div className="my-prayers-page">
        <h1 className="my-prayers-title">{t('myPrayers')}</h1>

        {isGuest && guestIds.length > 0 && (
          <div style={{
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            borderRadius: '12px',
            padding: '14px',
            margin: '16px 20px 0',
            fontSize: '0.82rem',
            color: 'var(--color-primary-600)',
            lineHeight: '1.4'
          }}>
            ℹ️ {t('guestWarning')}
          </div>
        )}

        <div className="tabs" style={{ position: 'relative' }}>
          <button
            className={`tab ${tab === 'active' ? 'active' : ''}`}
            onClick={() => setTab('active')}
            id="tab-active"
          >
            {t('active')}
            {tab === 'active' && (
              <motion.div
                layoutId="myPrayersTab"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  right: 0,
                  height: '2.5px',
                  background: 'var(--color-primary-600)',
                  borderRadius: '2px',
                }}
              />
            )}
          </button>
          <button
            className={`tab ${tab === 'answered' ? 'active' : ''}`}
            onClick={() => setTab('answered')}
            id="tab-answered"
          >
            {t('answered')}
            {tab === 'answered' && (
              <motion.div
                layoutId="myPrayersTab"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  right: 0,
                  height: '2.5px',
                  background: 'var(--color-primary-600)',
                  borderRadius: '2px',
                }}
              />
            )}
          </button>
        </div>

        {loading ? (
          <div style={{ paddingTop: '16px' }}>
            <SkeletonLoader count={3} />
          </div>
        ) : tab === 'active' ? (
          activePrayers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🙏</div>
              <p className="empty-state-title">{t('noActivePrayers')}</p>
              <p className="empty-state-text">{t('noActivePrayersDesc')}</p>
            </div>
          ) : (
            activePrayers.map(prayer => (
              <motion.div
                key={prayer._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="my-prayer-card glass-card"
                id={`my-prayer-${prayer._id}`}
              >
                <div className="my-prayer-card-top">
                  <span className="prayer-card-category">{prayer.category}</span>
                  <span className="my-prayer-card-date">{t('added')} {formatDate(prayer.createdAt)}</span>
                </div>
                <p className="my-prayer-card-text">{prayer.prayerText}</p>
                <div className="my-prayer-card-footer">
                  <span className="my-prayer-count">{prayer.prayerCount} {t('peoplePrayed')}</span>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    className="mark-answered-btn"
                    onClick={() => setConfirmPrayer(prayer)}
                    id={`mark-answered-${prayer._id}`}
                  >
                    {t('markAnswered')}
                  </motion.button>
                </div>
              </motion.div>
            ))
          )
        ) : (
          answeredPrayers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎉</div>
              <p className="empty-state-title">{t('noAnsweredPrayers')}</p>
              <p className="empty-state-text">{t('noAnsweredPrayersDesc')}</p>
            </div>
          ) : (
            answeredPrayers.map(prayer => (
              <motion.div
                key={prayer._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-prayer-card glass-card"
                id={`answered-prayer-${prayer._id}`}
              >
                <div className="my-prayer-card-top">
                  <span className="prayer-card-category">{prayer.category}</span>
                  <span className="answered-badge">{t('godAnswered')}</span>
                </div>
                <p className="my-prayer-card-text">{prayer.prayerText}</p>
                <div className="my-prayer-card-footer">
                  <span className="my-prayer-count">{prayer.prayerCount} {t('peoplePrayed')}</span>
                  <span className="my-prayer-card-date">{t('answered')} {formatDate(prayer.answeredAt)}</span>
                </div>
                {!prayer.testimony && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="submit-btn"
                    style={{ marginTop: '12px', fontSize: '0.85rem', padding: '10px' }}
                    onClick={() => setTestimonyModal(prayer)}
                  >
                    {t('shareTestimony')}
                  </motion.button>
                )}
                {prayer.testimony && (
                  <div style={{
                    marginTop: '12px', padding: '12px', background: 'var(--color-gold-100)',
                    borderRadius: '8px', fontSize: '0.85rem', color: 'var(--color-gold-500)',
                    border: '1px solid var(--color-gold-200)',
                  }}>
                    <strong>{t('yourTestimony')}</strong> {prayer.testimony.testimonyText}
                    <br />
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                      {t('status')}: {prayer.testimony.status}
                    </span>
                  </div>
                )}
              </motion.div>
            ))
          )
        )}
      </div>

      {/* Mark Answered Confirmation Modal */}
      <AnimatePresence>
        {confirmPrayer && (
          <ConfirmModal
            title={t('hasGodAnswered')}
            text={t('confirmModalText')}
            confirmText={t('yesAnswered')}
            cancelText={t('notYet')}
            onConfirm={handleMarkAnswered}
            onCancel={() => setConfirmPrayer(null)}
          />
        )}
      </AnimatePresence>

      {/* Undo Toast */}
      <AnimatePresence>
        {undoPrayer && (
          <UndoToast
            message={t('markedAsAnswered')}
            onUndo={handleUndo}
            duration={5000}
          />
        )}
      </AnimatePresence>

      {/* Testimony Submission Modal */}
      <AnimatePresence>
        {testimonyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setTestimonyModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="modal-content glass-card"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="modal-title">{t('shareYourTestimony')}</h3>
              <p className="modal-text">
                {t('testimonyModalDesc')}
              </p>
              <textarea
                className="form-textarea"
                placeholder={t('testimonyPlaceholder')}
                value={testimonyText}
                onChange={e => setTestimonyText(e.target.value)}
                style={{ marginBottom: '16px' }}
              />
              <button className="modal-btn-primary" onClick={handleSubmitTestimony}>
                {t('submitTestimony')}
              </button>
              <button className="modal-btn-secondary" onClick={() => setTestimonyModal(null)}>
                {t('skipForNow')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

