import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export default function UndoToast({ message, onUndo, duration = 5000 }) {
  const [visible, setVisible] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="toast"
          id="undo-toast"
          style={{
            overflow: 'hidden',
            paddingBottom: '16px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #facc15',
            boxShadow: '0 10px 30px rgba(250, 204, 21, 0.25)',
          }}
        >
          <span>🎉 {message}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="toast-undo"
            onClick={onUndo}
            id="undo-btn"
          >
            {t('undo')}
          </motion.button>

          {/* Animated 5-second countdown progress bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              background: 'var(--color-gold-400)',
              borderRadius: '0 0 999px 999px',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

