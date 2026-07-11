import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function TopHeader({ title, onSearchOpen }) {
  const [showMenu, setShowMenu] = useState(false);
  const { isGuest, logout } = useAuth();
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-header" id="top-header">
      <div style={{ position: 'relative' }}>
        <button 
          className="top-header-btn" 
          onClick={() => setShowMenu(!showMenu)}
          aria-label={t('menu')} 
          id="menu-btn"
        >
          ☰
        </button>
        
        {showMenu && (
          <>
            <div 
              style={{ position: 'fixed', inset: 0, zIndex: 110 }} 
              onClick={() => setShowMenu(false)}
            />
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              padding: '8px 0',
              zIndex: 120,
              minWidth: '150px'
            }}>
              {!isGuest ? (
                <button 
                  onClick={handleLogout}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    fontSize: '0.9rem',
                    color: '#dc2626'
                  }}
                >
                  {t('logout')}
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    fontSize: '0.9rem',
                    color: '#2563eb'
                  }}
                >
                  {t('signIn')}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <span className="top-header-title">{title || t('prayerWall')}</span>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Language Toggle */}
        <button
          className="lang-toggle-btn"
          onClick={toggleLang}
          aria-label="Toggle language"
          id="lang-toggle-btn"
          title={lang === 'en' ? 'తెలుగులో చూడండి' : 'View in English'}
        >
          {lang === 'en' ? 'తె' : 'EN'}
        </button>

        {onSearchOpen ? (
          <button className="top-header-btn" onClick={onSearchOpen} aria-label={t('search')} id="search-btn">
            🔍
          </button>
        ) : (
          <div style={{ width: 36 }} /> /* Placeholder for alignment */
        )}
      </div>
    </header>
  );
}
