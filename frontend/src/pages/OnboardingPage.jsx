import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OnboardingPage() {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [assemblyName, setAssemblyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assemblyName.trim()) return;

    setLoading(true);
    try {
      await updateProfile({ assemblyName: assemblyName.trim() });
      navigate('/');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-icon">⛪</div>
      <h1 className="login-title">Welcome</h1>
      <p className="login-subtitle">
        Before you join the prayer wall, please tell us where you are joining from.
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '300px' }}>
        <div className="form-group">
          <label className="form-label">Assembly location or Village name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Grace Fellowship, Springfield"
            value={assemblyName}
            onChange={e => setAssemblyName(e.target.value)}
            autoFocus
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading || !assemblyName.trim()}>
          {loading ? 'Saving...' : 'Continue to Wall'}
        </button>
      </form>
    </div>
  );
}
