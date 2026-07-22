import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function BottomNav() {
  const { isAdmin } = useAuth();
  const { t } = useLang();

  const navItems = [
    { to: '/', label: t('navWall'), icon: '🌅', end: true },
    { to: '/post', label: t('navPost'), icon: '✍️', isPost: true },
    { to: '/celebrate', label: t('navCelebrate'), icon: '🎊' },
    { to: '/my-prayers', label: t('navMyPrayers'), icon: '🕊️' },
    ...(isAdmin ? [{ to: '/admin', label: t('navAdmin'), icon: '👑' }] : []),
  ];

  return (
    <nav className="bottom-nav" id="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `bottom-nav-item ${item.isPost ? 'post-btn' : ''} ${isActive ? 'active' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && !item.isPost && (
                <motion.div
                  layoutId="activeTabIndicator"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    background: 'var(--color-primary-50)',
                    zIndex: 0,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <motion.span
                whileTap={{ scale: 0.85 }}
                className="nav-icon"
                style={{ zIndex: 1 }}
              >
                {item.icon}
              </motion.span>
              <span style={{ zIndex: 1 }}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

