import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { isAdmin } = useAuth();

  return (
    <nav className="bottom-nav" id="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
        <span className="nav-icon">🏠</span>
        <span>Wall</span>
      </NavLink>
      <NavLink to="/post" className={({ isActive }) => `bottom-nav-item post-btn ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">＋</span>
        <span>Post</span>
      </NavLink>
      <NavLink to="/celebrate" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">✨</span>
        <span>Celebrate</span>
      </NavLink>
      <NavLink to="/my-prayers" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">👤</span>
        <span>My Prayers</span>
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span>Admin</span>
        </NavLink>
      )}
    </nav>
  );
}
