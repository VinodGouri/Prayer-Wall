import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
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
    if (!user.assemblyName) {
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
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="lang-toggle-btn"
        onClick={toggleLang}
        aria-label="Toggle language"
        style={{ position: 'absolute', top: '20px', right: '20px' }}
        title={lang === 'en' ? 'తెలుగులో చూడండి' : 'View in English'}
      >
        {lang === 'en' ? 'తె' : 'EN'}
      </motion.button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="login-icon"
        style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 12px rgba(249, 115, 22, 0.3))' }}
      >
        🕊️
      </motion.div>
      <h1 className="login-title">{t('loginTitle')}</h1>
      <p className="login-subtitle">
        {t('loginSubtitle')}
      </p>

      <div style={{ width: '100%', maxWidth: '320px', marginBottom: '24px' }}>
        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="google-btn" 
          onClick={() => handleGoogle()}
          type="button"
          disabled={loading}
          style={{ width: '100%', maxWidth: 'none' }}
        >
          <span style={{ fontSize: '1.2rem' }}>G</span> {t('continueWithGoogle')}
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          <span style={{ padding: '0 10px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t('or')}</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
        </div>

        <div className="tabs" style={{ margin: '0 0 20px 0', position: 'relative' }}>
          <button
            type="button"
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            {t('signIn')}
            {mode === 'login' && (
              <motion.div
                layoutId="loginTab"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--color-primary-600)',
                  borderRadius: '1px',
                }}
              />
            )}
          </button>
          <button
            type="button"
            className={`tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            {t('register')}
            {mode === 'register' && (
              <motion.div
                layoutId="loginTab"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--color-primary-600)',
                  borderRadius: '1px',
                }}
              />
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="form-group"
            >
              <input
                type="text"
                className="form-input"
                placeholder={t('fullName')}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </motion.div>
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
            <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <motion.button whileTap={{ scale: 0.97 }} type="submit" className="submit-btn" disabled={loading}>
            {loading ? t('processing') : (mode === 'login' ? t('signIn') : t('createAccount'))}
          </motion.button>
        </form>
      </div>

      <motion.button whileTap={{ scale: 0.95 }} className="guest-btn" onClick={handleGuest} id="guest-btn">
        {t('continueAsGuest')}
      </motion.button>
    </div>
  );
}

