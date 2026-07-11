import { useEffect, useState } from 'react';
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

      <div className="splash-icon">⛪</div>
      <h1 className="splash-title">{t('splashTitle')}</h1>
      <p className="splash-subtitle">{t('splashSubtitle')}</p>

      <p className="splash-verse">
        {t('splashVerse')}
      </p>
      <p className="splash-ref">{t('splashRef')}</p>

      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
      <p className="splash-loading-text">{t('splashLoading')}</p>
    </div>
  );
}
