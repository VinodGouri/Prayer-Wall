import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function TopHeader({ title, onSearchOpen }) {
  const [showMenu, setShowMenu] = useState(false);
  const { user, isGuest, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang();

  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Dark mode state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // When menu opens, populate edit fields from user data
  useEffect(() => {
    if (showMenu && user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditPhoto(user.profilePhoto || '');
      setEditingProfile(false);
      setProfileMsg('');
    }
  }, [showMenu, user]);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileMsg('');
    try {
      await updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        profilePhoto: editPhoto.trim(),
      });
      setProfileMsg('✅ Saved');
      setEditingProfile(false);
      setTimeout(() => setProfileMsg(''), 2000);
    } catch (err) {
      setProfileMsg('❌ Error saving');
    }
    setProfileSaving(false);
  };

  const avatarUrl = user?.profilePhoto || user?.avatar || '';
  const userInitial = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <header className="top-header" id="top-header">
      <div style={{ position: 'relative' }}>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="top-header-btn" 
          onClick={() => setShowMenu(!showMenu)}
          aria-label={t('menu')} 
          id="menu-btn"
        >
          ☰
        </motion.button>
        
        <AnimatePresence>
          {showMenu && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, zIndex: 110 }} 
                onClick={() => setShowMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'var(--color-surface-card)',
                  boxShadow: 'var(--shadow-modal)',
                  borderRadius: '16px',
                  padding: '16px',
                  zIndex: 120,
                  minWidth: '260px',
                  maxWidth: '300px',
                  border: '1px solid var(--color-border)',
                }}
              >
                {!isGuest && user ? (
                  <div>
                    {/* Profile Card Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={user.name}
                          style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary-300)' }}
                        />
                      ) : (
                        <div style={{
                          width: 48, height: 48, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #fbcfe8 0%, #fed7aa 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '1.2rem', color: '#9d174d',
                        }}>
                          {userInitial}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </div>
                        {user.assemblyName && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-primary-600)', fontWeight: 500, marginTop: '2px' }}>
                            ⛪ {user.assemblyName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '0 0 12px' }} />

                    {/* Edit Profile Toggle */}
                    {!editingProfile ? (
                      <button
                        onClick={() => setEditingProfile(true)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '8px 0', fontSize: '0.85rem',
                          color: 'var(--color-primary-600)', fontWeight: 500,
                          background: 'none', border: 'none', cursor: 'pointer',
                        }}
                      >
                        ✏️ Edit Profile
                      </button>
                    ) : (
                      <div style={{ marginBottom: '10px' }}>
                        {/* Editable Name */}
                        <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          style={{
                            width: '100%', padding: '7px 10px', fontSize: '0.82rem',
                            borderRadius: '8px', border: '1px solid var(--color-border)',
                            background: 'var(--color-surface)', color: 'var(--color-text-primary)',
                            marginBottom: '8px', boxSizing: 'border-box',
                          }}
                        />

                        {/* Phone */}
                        <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Phone Number</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={e => setEditPhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          style={{
                            width: '100%', padding: '7px 10px', fontSize: '0.82rem',
                            borderRadius: '8px', border: '1px solid var(--color-border)',
                            background: 'var(--color-surface)', color: 'var(--color-text-primary)',
                            marginBottom: '8px', boxSizing: 'border-box',
                          }}
                        />

                        {/* Profile Photo URL */}
                        <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Profile Photo URL</label>
                        <input
                          type="url"
                          value={editPhoto}
                          onChange={e => setEditPhoto(e.target.value)}
                          placeholder="https://..."
                          style={{
                            width: '100%', padding: '7px 10px', fontSize: '0.82rem',
                            borderRadius: '8px', border: '1px solid var(--color-border)',
                            background: 'var(--color-surface)', color: 'var(--color-text-primary)',
                            marginBottom: '10px', boxSizing: 'border-box',
                          }}
                        />

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveProfile}
                            disabled={profileSaving}
                            style={{
                              flex: 1, padding: '7px 0', fontSize: '0.8rem', fontWeight: 600,
                              borderRadius: '8px', border: 'none', cursor: 'pointer',
                              background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
                              color: '#fff',
                            }}
                          >
                            {profileSaving ? '⏳' : '💾 Save'}
                          </motion.button>
                          <button
                            onClick={() => setEditingProfile(false)}
                            style={{
                              padding: '7px 12px', fontSize: '0.8rem', fontWeight: 500,
                              borderRadius: '8px', border: '1px solid var(--color-border)',
                              background: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)',
                            }}
                          >
                            Cancel
                          </button>
                        </div>

                        {profileMsg && (
                          <div style={{ fontSize: '0.75rem', marginTop: '6px', color: profileMsg.startsWith('✅') ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {profileMsg}
                          </div>
                        )}
                      </div>
                    )}

                    {user.phone && !editingProfile && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', padding: '4px 0' }}>
                        📱 {user.phone}
                      </div>
                    )}

                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '8px 0' }} />

                    {/* Logout */}
                    <button 
                      onClick={handleLogout}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '8px 0', fontSize: '0.85rem',
                        color: 'var(--color-danger)', fontWeight: 500,
                        background: 'none', border: 'none', cursor: 'pointer',
                      }}
                    >
                      🚪 {t('logout')}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => navigate('/login')}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 0',
                      fontSize: '0.9rem',
                      color: 'var(--color-primary-500)',
                      fontWeight: 500,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    🔑 {t('signIn')}
                  </button>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <span className="top-header-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '1.2rem' }}>🕊️</span>
        <span style={{
          background: 'linear-gradient(135deg, var(--color-primary-600) 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
        }}>
          {title || t('prayerWall')}
        </span>
      </span>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Dark Mode Toggle */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          className="top-header-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          id="theme-toggle-btn"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </motion.button>

        {/* Language Toggle with Framer Motion crossfade */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="lang-toggle-btn"
          onClick={toggleLang}
          aria-label="Toggle language"
          id="lang-toggle-btn"
          title={lang === 'en' ? 'తెలుగులో చూడండి' : 'View in English'}
        >
          <motion.span
            key={lang}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            {lang === 'en' ? 'తె' : 'EN'}
          </motion.span>
        </motion.button>

        {onSearchOpen ? (
          <motion.button whileTap={{ scale: 0.88 }} className="top-header-btn" onClick={onSearchOpen} aria-label={t('search')} id="search-btn">
            🔍
          </motion.button>
        ) : (
          <div style={{ width: 36 }} />
        )}
      </div>
    </header>
  );
}
