import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import api from '../api';

export default function ChangePasswordPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError('Please fill in all fields.');
    }

    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters.');
    }

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.');
    }

    if (currentPassword === newPassword) {
      return setError('New password must be different from current password.');
    }

    setLoading(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      // Password changed — redirect to onboarding or home
      if (!user?.assemblyName) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
      // Force a page reload to refresh user state
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-page" id="change-password-page">
      <div className="login-icon">🔐</div>
      <h1 className="login-title">Change Password</h1>
      <p className="login-subtitle">
        For security, please change your password before continuing.
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '300px' }}>
        {/* Current Password */}
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <div className="password-input-wrapper">
            <input
              type={showCurrent ? 'text' : 'password'}
              className="form-input"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowCurrent(!showCurrent)}
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showCurrent ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="form-group">
          <label className="form-label">New Password</label>
          <div className="password-input-wrapper">
            <input
              type={showNew ? 'text' : 'password'}
              className="form-input"
              placeholder="Enter new password (min 6 chars)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowNew(!showNew)}
              aria-label={showNew ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showNew ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirm ? 'text' : 'password'}
              className="form-input"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>
            {error}
          </p>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Changing...' : 'Change Password & Continue'}
        </button>
      </form>
    </div>
  );
}
