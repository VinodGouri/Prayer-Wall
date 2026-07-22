import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../api';

function AnimatedNumber({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {value}
    </motion.span>
  );
}

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [dashboard, setDashboard] = useState(null);
  const [pendingTestimonies, setPendingTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    const fetchData = async () => {
      try {
        const [dashData, pendingData] = await Promise.all([
          api.getDashboard(),
          api.getPendingTestimonies(),
        ]);
        setDashboard(dashData);
        setPendingTestimonies(pendingData.testimonies);
      } catch (error) {
        console.error('Admin dashboard error:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [isAdmin, navigate]);

  const handleApprove = async (id) => {
    try {
      await api.approveTestimony(id);
      setPendingTestimonies(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error approving:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectTestimony(id);
      setPendingTestimonies(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error rejecting:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await api.deletePrayer(id);
      setDashboard(prev => ({
        ...prev,
        recentPrayers: prev.recentPrayers.filter(p => p._id !== id),
      }));
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleMarkReached = async (id) => {
    try {
      await api.updatePrayer(id, { hidden: true });
      setDashboard(prev => ({
        ...prev,
        oldestActive: prev.oldestActive.filter(p => p._id !== id),
      }));
    } catch (err) {
      console.error('Error updating:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div style={{ paddingTop: '24px' }}>
          <SkeletonLoader type="stats" count={2} />
          <div style={{ marginTop: '20px' }}>
            <SkeletonLoader count={3} />
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <div className="admin-page" id="admin-dashboard">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{t('adminDashboard')}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
          style={{
            fontSize: '0.8rem', padding: '6px 14px', borderRadius: '999px',
            border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)',
            background: 'var(--color-surface-card)',
          }}
        >
          {t('logout')}
        </motion.button>
      </div>

      {/* Greeting */}
      <div className="admin-greeting">
        <h2>{t('peaceBeWithYou')} {user?.name || 'Admin'}.</h2>
        <p>{t('adminDesc')}</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats">
        <div className="admin-stat-card glass-card" style={{ background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.9) 0%, rgba(224, 231, 255, 0.9) 100%)', border: '1px solid #c7d2fe' }}>
          <div className="admin-stat-icon">✨</div>
          <div style={{ fontSize: '0.65rem', color: '#4f46e5', fontWeight: 600 }}>+{stats.todayPrayers || 0} {t('today')}</div>
          <div className="admin-stat-value" style={{ color: '#4338ca' }}>
            <AnimatedNumber value={stats.activePrayers || 0} />
          </div>
          <div className="admin-stat-label" style={{ color: '#4338ca' }}>{t('activePrayers')}</div>
        </div>
        <div className="admin-stat-card glass-card" style={{ background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.9) 0%, rgba(254, 240, 138, 0.9) 100%)', border: '1px solid #fde047' }}>
          <div className="admin-stat-icon">🎉</div>
          <div style={{ fontSize: '0.65rem', color: '#b45309', fontWeight: 600 }}>{t('total')}</div>
          <div className="admin-stat-value" style={{ color: '#854d0e' }}>
            <AnimatedNumber value={stats.answeredPrayers || 0} />
          </div>
          <div className="admin-stat-label" style={{ color: '#854d0e' }}>{t('answeredPrayers')}</div>
        </div>
      </div>

      {/* Oldest Active Requests */}
      {dashboard?.oldestActive?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 className="admin-section-title">{t('oldestActiveRequests')}</h3>
          <AnimatePresence>
            {dashboard.oldestActive.slice(0, 5).map(prayer => (
              <motion.div
                key={prayer._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.25 }}
                className="admin-prayer-item glass-card"
              >
                <div className="admin-prayer-item-header">
                  <div className="admin-prayer-item-avatar">
                    {prayer.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{prayer.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {t('posted')} {formatDate(prayer.createdAt)} · {prayer.assemblyName}
                    </div>
                  </div>
                  <span className="prayer-card-category" style={{ fontSize: '0.6rem' }}>
                    {prayer.status?.toUpperCase()}
                  </span>
                </div>
                <p className="admin-prayer-item-text">"{prayer.prayerText}"</p>
                <div className="admin-actions">
                  <button className="admin-action-btn contact" onClick={() => {}}>
                    {t('viewDetails')}
                  </button>
                  <button className="admin-action-btn approve" onClick={() => handleMarkReached(prayer._id)}>
                    {t('markAsReachedOut')}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pending Testimonies */}
      {pendingTestimonies.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 className="admin-section-title">{t('pendingTestimonies')} ({pendingTestimonies.length})</h3>
          <AnimatePresence>
            {pendingTestimonies.map(testimony => (
              <motion.div
                key={testimony._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.25 }}
                className="admin-prayer-item glass-card"
              >
                <div className="admin-prayer-item-header">
                  <div className="admin-prayer-item-avatar">
                    {testimony.userId?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{testimony.userId?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {testimony.prayerId?.category} · {formatDate(testimony.createdAt)}
                    </div>
                  </div>
                </div>
                <p className="admin-prayer-item-text">"{testimony.testimonyText}"</p>
                <div className="admin-actions">
                  <button className="admin-action-btn approve" onClick={() => handleApprove(testimony._id)}>
                    {t('approve')}
                  </button>
                  <button className="admin-action-btn reject" onClick={() => handleReject(testimony._id)}>
                    {t('reject')}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Prayer Management Feed */}
      <div>
        <h3 className="admin-section-title">{t('prayerManagement')}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
          {t('prayerManagementDesc')}
        </p>
        <AnimatePresence>
          {dashboard?.recentPrayers?.map(prayer => (
            <motion.div
              key={prayer._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
              className="admin-prayer-item glass-card"
            >
              <div className="admin-prayer-item-header">
                <div className="admin-prayer-item-avatar">
                  {prayer.anonymous ? '👤' : (prayer.name?.[0]?.toUpperCase() || '?')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    {prayer.anonymous ? t('anonymous') : prayer.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {prayer.category} · {prayer.assemblyName}
                  </div>
                </div>
              </div>
              <p className="admin-prayer-item-text">"{prayer.prayerText}"</p>
              {prayer.phone && (
                <div style={{
                  background: 'var(--color-primary-50)', padding: '8px 12px', borderRadius: '8px',
                  marginBottom: '8px', fontSize: '0.8rem', color: 'var(--color-primary-600)',
                }}>
                  {t('contactPersonally')}<br />
                  <span style={{ fontWeight: 600 }}>{prayer.phone}</span>
                </div>
              )}
              <div className="admin-actions">
                <button className="admin-action-btn contact">
                  {prayer.prayerCount} {t('peoplePrayed')}
                </button>
                <button className="admin-action-btn reject" onClick={() => handleDelete(prayer._id)}>
                  {t('deletePrayer')}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

