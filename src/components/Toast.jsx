import { useContext } from 'react';
import { CheckCircle, Heart, Info, X } from 'lucide-react';
import { ToastContext } from '../context/ToastContext.jsx';
import './Toast.css';

const iconMap = {
  success: <CheckCircle size={16} strokeWidth={2} />,
  wishlist: <Heart size={16} strokeWidth={2} />,
  info:    <Info size={16} strokeWidth={2} />,
};

const Toast = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="toast-icon">{iconMap[toast.type]}</span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
            aria-label="Dismiss"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
