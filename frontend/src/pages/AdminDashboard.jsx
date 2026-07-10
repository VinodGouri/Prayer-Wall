import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
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
    if (!confirm('Delete this prayer permanently?')) return;
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
        <div className="empty-state">
          <p className="empty-state-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <div className="admin-page" id="admin-dashboard">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>⛪ Admin Dashboard</span>
        </div>
        <button
          onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
          style={{
            fontSize: '0.8rem', padding: '6px 14px', borderRadius: '999px',
            border: '1px solid #e2e8f0', color: '#64748b',
          }}
        >
          Logout
        </button>
      </div>

      {/* Greeting */}
      <div className="admin-greeting">
        <h2>Peace be with you, {user?.name || 'Admin'}.</h2>
        <p>Here is the current state of the Prayer Wall ecosystem.</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🤍</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>+{stats.todayPrayers || 0} today</div>
          <div className="admin-stat-value">{stats.activePrayers || 0}</div>
          <div className="admin-stat-label">Active Prayers</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">✅</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Total</div>
          <div className="admin-stat-value">{stats.answeredPrayers || 0}</div>
          <div className="admin-stat-label">Answered Prayers</div>
        </div>
      </div>

      {/* Oldest Active Requests */}
      {dashboard?.oldestActive?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 className="admin-section-title">❗ Oldest Active Requests</h3>
          {dashboard.oldestActive.slice(0, 5).map(prayer => (
            <div className="admin-prayer-item" key={prayer._id}>
              <div className="admin-prayer-item-header">
                <div className="admin-prayer-item-avatar">
                  {prayer.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{prayer.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Posted {formatDate(prayer.createdAt)} · {prayer.assemblyName}
                  </div>
                </div>
                <span className="prayer-card-category" style={{ fontSize: '0.6rem' }}>
                  {prayer.status?.toUpperCase()}
                </span>
              </div>
              <p className="admin-prayer-item-text">"{prayer.prayerText}"</p>
              <div className="admin-actions">
                <button className="admin-action-btn contact" onClick={() => {}}>
                  View Details
                </button>
                <button className="admin-action-btn approve" onClick={() => handleMarkReached(prayer._id)}>
                  Mark as Reached Out
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Testimonies */}
      {pendingTestimonies.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 className="admin-section-title">🕐 Pending Testimonies ({pendingTestimonies.length})</h3>
          {pendingTestimonies.map(t => (
            <div className="admin-prayer-item" key={t._id}>
              <div className="admin-prayer-item-header">
                <div className="admin-prayer-item-avatar">
                  {t.userId?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.userId?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {t.prayerId?.category} · {formatDate(t.createdAt)}
                  </div>
                </div>
              </div>
              <p className="admin-prayer-item-text">"{t.testimonyText}"</p>
              <div className="admin-actions">
                <button className="admin-action-btn approve" onClick={() => handleApprove(t._id)}>
                  ✓ Approve
                </button>
                <button className="admin-action-btn reject" onClick={() => handleReject(t._id)}>
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prayer Management Feed */}
      <div>
        <h3 className="admin-section-title">📋 Prayer Management Feed</h3>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
          Review and manage recent community submissions.
        </p>
        {dashboard?.recentPrayers?.map(prayer => (
          <div className="admin-prayer-item" key={prayer._id}>
            <div className="admin-prayer-item-header">
              <div className="admin-prayer-item-avatar">
                {prayer.anonymous ? '👤' : (prayer.name?.[0]?.toUpperCase() || '?')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                  {prayer.anonymous ? 'Anonymous' : prayer.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {prayer.category} · {prayer.assemblyName}
                </div>
              </div>
            </div>
            <p className="admin-prayer-item-text">"{prayer.prayerText}"</p>
            {prayer.phone && (
              <div style={{
                background: '#eff6ff', padding: '8px 12px', borderRadius: '8px',
                marginBottom: '8px', fontSize: '0.8rem',
              }}>
                📞 Contact Personally<br />
                <span style={{ fontWeight: 600 }}>{prayer.phone}</span>
              </div>
            )}
            <div className="admin-actions">
              <button className="admin-action-btn contact">
                {prayer.prayerCount} People Prayed
              </button>
              <button className="admin-action-btn reject" onClick={() => handleDelete(prayer._id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
