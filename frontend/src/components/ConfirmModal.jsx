import { motion } from 'framer-motion';

export default function ConfirmModal({ title, text, confirmText, cancelText, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      id="confirm-modal"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="modal-content glass-card"
        onClick={e => e.stopPropagation()}
        style={{
          border: '1px solid var(--color-gold-200)',
          boxShadow: '0 20px 50px rgba(202, 138, 4, 0.15), var(--shadow-modal)',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '8px' }}>🙌🎊✨</div>
        <h3 className="modal-title" style={{ textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>{title}</h3>
        <p className="modal-text" style={{ textAlign: 'center' }}>{text}</p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="modal-btn-primary"
          onClick={onConfirm}
          id="modal-confirm-btn"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
            fontSize: '1rem',
          }}
        >
          🎉 {confirmText || "Yes, it's Answered"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="modal-btn-secondary"
          onClick={onCancel}
          id="modal-cancel-btn"
        >
          {cancelText || 'Not yet'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

