import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopHeader from '../components/TopHeader';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const CATEGORIES = [
  'Health', 'Marriage', 'Family', 'Financial', 'Education',
  'Job', 'Travel', 'Ministry', 'General', 'Other',
];

export default function PostPrayerPage() {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [category, setCategory] = useState('');
  const [prayerText, setPrayerText] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
        <TopHeader title="Share your Request" />
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <p className="empty-state-title">Sign in to post</p>
          <p className="empty-state-text">You need to sign in to share a prayer request.</p>
          <button
            className="submit-btn"
            style={{ maxWidth: '200px', margin: '20px auto 0' }}
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <TopHeader title="Share your Request" />
        <div className="success-msg">
          <div className="success-msg-icon">🙏</div>
          <h2 className="success-msg-title">Prayer Shared</h2>
          <p className="success-msg-text">
            Your prayer has been shared with believers. The community is praying with you.
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
            Share Another Prayer
          </button>
        </div>
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!category) return setError('Please select a category.');
    if (!prayerText.trim()) return setError('Please enter your prayer request.');
    if (prayerText.length > 500) return setError('Prayer text must be 500 characters or less.');

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
      <TopHeader title="Share your Request" />

      <p className="post-verse">
        "For where two or three gather in my name, there am I with them."
      </p>

      <div className="post-page">
        <form className="post-form" onSubmit={handleSubmit} id="post-prayer-form">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
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
              <label htmlFor="checkbox-anonymous">Share as Anonymous</label>
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
              id="select-category"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Prayer Text */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Prayer Request</label>
              <span className={`char-count ${prayerText.length > 500 ? 'limit' : ''}`}>
                {prayerText.length} / 500
              </span>
            </div>
            <textarea
              className="form-textarea"
              placeholder="What can we pray for today?"
              value={prayerText}
              onChange={e => setPrayerText(e.target.value)}
              maxLength={500}
              id="textarea-prayer"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="tel"
              className="form-input"
              placeholder="For admin follow-up only"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              id="input-phone"
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0 0 12px 0' }}>{error}</p>
          )}

          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '16px' }}>
            Sharing with {user?.assemblyName || 'your community'}
          </p>

          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
            id="submit-prayer-btn"
          >
            {submitting ? 'Sharing...' : 'Share Prayer Request'}
          </button>
        </form>
      </div>
    </>
  );
}
