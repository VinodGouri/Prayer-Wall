import { useState, useEffect } from 'react';

export default function UndoToast({ message, onUndo, duration = 5000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="toast" id="undo-toast">
      <span>{message}</span>
      <button className="toast-undo" onClick={onUndo} id="undo-btn">
        Undo
      </button>
    </div>
  );
}
