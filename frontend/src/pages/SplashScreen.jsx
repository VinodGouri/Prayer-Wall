import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="splash-screen" id="splash-screen">
      <div className="splash-bg" />
      <div className="splash-overlay" />

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: [0.7, 1.2, 1], opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="splash-icon"
        style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.6))' }}
      >
        🕊️
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="splash-title"
      >
        {t('splashTitle')}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="splash-subtitle"
      >
        {t('splashSubtitle')}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="splash-verse"
      >
        {t('splashVerse')}
      </motion.p>
      <p className="splash-ref">{t('splashRef')}</p>

      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
      <p className="splash-loading-text">{t('splashLoading')}</p>
    </div>
  );
}

