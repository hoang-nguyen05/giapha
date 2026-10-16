import { useUIStore } from '../../store/uiStore';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import './Toast.css';

export default function Toast() {
  const { toast, hideToast } = useUIStore();

  if (!toast) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="toast-icon success" size={18} />;
      case 'warning':
        return <AlertTriangle className="toast-icon warning" size={18} />;
      case 'error':
        return <XCircle className="toast-icon error" size={18} />;
      default:
        return <Info className="toast-icon info" size={18} />;
    }
  };

  return (
    <div className={`toast-notification toast-${toast.type || 'info'}`}>
      <div className="toast-content">
        {renderIcon()}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button className="toast-close" onClick={hideToast} aria-label="Đóng thông báo">
        <X size={14} />
      </button>
    </div>
  );
}
