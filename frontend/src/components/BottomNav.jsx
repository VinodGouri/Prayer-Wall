import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function BottomNav() {
  const { isAdmin } = useAuth();
  const { t } = useLang();

  return (
    <nav className="bottom-nav" id="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
        <span className="nav-icon">🏠</span>
        <span>{t('navWall')}</span>
      </NavLink>
      <NavLink to="/post" className={({ isActive }) => `bottom-nav-item post-btn ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">＋</span>
        <span>{t('navPost')}</span>
      </NavLink>
      <NavLink to="/celebrate" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">✨</span>
        <span>{t('navCelebrate')}</span>
      </NavLink>
      <NavLink to="/my-prayers" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">👤</span>
        <span>{t('navMyPrayers')}</span>
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span>{t('navAdmin')}</span>
        </NavLink>
      )}
    </nav>
  );
}
