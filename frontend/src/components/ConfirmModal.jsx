export default function ConfirmModal({ title, text, confirmText, cancelText, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" id="confirm-modal" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-text">{text}</p>
        <button className="modal-btn-primary" onClick={onConfirm} id="modal-confirm-btn">
          {confirmText || "Yes, it's Answered"}
        </button>
        <button className="modal-btn-secondary" onClick={onCancel} id="modal-cancel-btn">
          {cancelText || 'Not yet'}
        </button>
      </div>
    </div>
  );
}
