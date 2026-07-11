import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopHeader from '../components/TopHeader';
import ConfirmModal from '../components/ConfirmModal';
import UndoToast from '../components/UndoToast';
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

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      if (tab === 'active') {
        const data = await api.getMyActive();
        setActivePrayers(data.prayers);
      } else {
        const data = await api.getMyAnswered();
        setAnsweredPrayers(data.prayers);
      }
    } catch (error) {
      console.error('Error fetching my prayers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isGuest) fetchPrayers();
  }, [tab, isGuest]);

  if (isGuest) {
    return (
      <>
        <TopHeader title={t('myPrayers')} />
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <p className="empty-state-title">{t('signInToView')}</p>
          <p className="empty-state-text">{t('signInToViewDesc')}</p>
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

  return (
    <>
      <TopHeader title={t('prayerWall')} />

      <div className="my-prayers-page">
        <h1 className="my-prayers-title">{t('myPrayers')}</h1>

        <div className="tabs">
          <button
            className={`tab ${tab === 'active' ? 'active' : ''}`}
            onClick={() => setTab('active')}
            id="tab-active"
          >
            {t('active')}
          </button>
          <button
            className={`tab ${tab === 'answered' ? 'active' : ''}`}
            onClick={() => setTab('answered')}
            id="tab-answered"
          >
            {t('answered')}
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <p className="empty-state-text">{t('loading')}</p>
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
              <div className="my-prayer-card" key={prayer._id} id={`my-prayer-${prayer._id}`}>
                <div className="my-prayer-card-top">
                  <span className="prayer-card-category">{prayer.category}</span>
                  <span className="my-prayer-card-date">{t('added')} {formatDate(prayer.createdAt)}</span>
                </div>
                <p className="my-prayer-card-text">{prayer.prayerText}</p>
                <div className="my-prayer-card-footer">
                  <span className="my-prayer-count">{prayer.prayerCount} {t('peoplePrayed')}</span>
                  <button
                    className="mark-answered-btn"
                    onClick={() => setConfirmPrayer(prayer)}
                    id={`mark-answered-${prayer._id}`}
                  >
                    {t('markAnswered')}
                  </button>
                </div>
              </div>
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
              <div className="my-prayer-card" key={prayer._id} id={`answered-prayer-${prayer._id}`}>
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
                  <button
                    className="submit-btn"
                    style={{ marginTop: '12px', fontSize: '0.85rem', padding: '10px' }}
                    onClick={() => setTestimonyModal(prayer)}
                  >
                    {t('shareTestimony')}
                  </button>
                )}
                {prayer.testimony && (
                  <div style={{
                    marginTop: '12px', padding: '12px', background: '#fef9c3',
                    borderRadius: '8px', fontSize: '0.85rem', color: '#713f12',
                  }}>
                    <strong>{t('yourTestimony')}</strong> {prayer.testimony.testimonyText}
                    <br />
                    <span style={{ fontSize: '0.75rem', color: '#a16207' }}>
                      {t('status')}: {prayer.testimony.status}
                    </span>
                  </div>
                )}
              </div>
            ))
          )
        )}
      </div>

      {/* Mark Answered Confirmation Modal */}
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

      {/* Undo Toast */}
      {undoPrayer && (
        <UndoToast
          message={t('markedAsAnswered')}
          onUndo={handleUndo}
          duration={5000}
        />
      )}

      {/* Testimony Submission Modal */}
      {testimonyModal && (
        <div className="modal-overlay" onClick={() => setTestimonyModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
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
          </div>
        </div>
      )}
    </>
  );
}
