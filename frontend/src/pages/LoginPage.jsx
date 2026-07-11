import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function LoginPage() {
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useLang();
  
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = (user) => {
    if (user.mustChangePassword) {
      navigate('/change-password');
    } else if (!user.assemblyName) {
      navigate('/onboarding');
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) {
      setError(t('fillAllFields'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (mode === 'login') {
        const data = await login({ email, password });
        handleSuccess(data.user);
      } else {
        const data = await register({ name, email, password });
        handleSuccess(data.user);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');

        // Step 1: Fetch Google profile
        let profile;
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          
          if (!res.ok) {
            throw new Error('Failed to fetch Google profile');
          }
          
          profile = await res.json();
        } catch (fetchErr) {
          throw new Error(
            fetchErr.message.includes('fetch')
              ? 'Network error: Unable to reach Google. Please check your internet connection.'
              : fetchErr.message
          );
        }

        // Step 2: Send profile to our backend
        const data = await googleLogin({
          email: profile.email,
          name: profile.name,
          googleId: profile.sub,
          avatar: profile.picture
        });
        
        handleSuccess(data.user);
      } catch (err) {
        console.error('Google auth error:', err);
        setError(err.message || 'Google Login failed. Please try again.');
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google popup error:', errorResponse);
      setError('Google Login popup failed. Make sure popups are allowed and try again.');
      setLoading(false);
    }
  });

  const handleGuest = () => {
    navigate('/');
  };

  return (
    <div className="login-page" id="login-page">
      {/* Language toggle on login page */}
      <button
        className="lang-toggle-btn"
        onClick={toggleLang}
        aria-label="Toggle language"
        style={{ position: 'absolute', top: '16px', right: '16px' }}
        title={lang === 'en' ? 'తెలుగులో చూడండి' : 'View in English'}
      >
        {lang === 'en' ? 'తె' : 'EN'}
      </button>

      <div className="login-icon">⛪</div>
      <h1 className="login-title">{t('loginTitle')}</h1>
      <p className="login-subtitle">
        {t('loginSubtitle')}
      </p>

      <div style={{ width: '100%', maxWidth: '300px', marginBottom: '24px' }}>
        <button 
          className="google-btn" 
          onClick={() => handleGoogle()}
          type="button"
          disabled={loading}
        >
          <span style={{ fontSize: '1.2rem' }}>G</span> {t('continueWithGoogle')}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ padding: '0 10px', fontSize: '0.8rem', color: '#64748b' }}>{t('or')}</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        <div className="tabs" style={{ margin: '0 0 20px 0' }}>
          <button
            type="button"
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            {t('signIn')}
          </button>
          <button
            type="button"
            className={`tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            {t('register')}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder={t('fullName')}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder={t('emailAddress')}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder={t('password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? t('processing') : (mode === 'login' ? t('signIn') : t('createAccount'))}
          </button>
        </form>
      </div>

      <button className="guest-btn" onClick={handleGuest} id="guest-btn">
        {t('continueAsGuest')}
      </button>
    </div>
  );
}
