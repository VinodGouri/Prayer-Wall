import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopHeader({ title, onSearchOpen }) {
  const [showMenu, setShowMenu] = useState(false);
  const { isGuest, logout } = useAuth();
  const navigate = useNavigate();

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
          aria-label="Menu" 
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
                  Logout
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
                  Sign In
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <span className="top-header-title">{title || 'Prayer Wall'}</span>
      
      {onSearchOpen ? (
        <button className="top-header-btn" onClick={onSearchOpen} aria-label="Search" id="search-btn">
          🔍
        </button>
      ) : (
        <div style={{ width: 36 }} /> /* Placeholder for alignment */
      )}
    </header>
  );
}
