import { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

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
      <h1 className="splash-title">Prayer Wall</h1>
      <p className="splash-subtitle">SACRED STILLNESS</p>

      <p className="splash-verse">
        "Therefore I tell you, whatever you ask in prayer, believe that you have received it, and it will be yours."
      </p>
      <p className="splash-ref">— MARK 11:24</p>

      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
      <p className="splash-loading-text">Preparing your sanctuary...</p>
    </div>
  );
}
