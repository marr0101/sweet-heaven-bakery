/**
 * StoreToast.jsx
 * Non-blocking notification for the public store.
 */
import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const colors = {
  success: '#81C784',
  error: '#E57373',
  warning: '#FFB74D',
  info: '#64B5F6',
};

const StoreToast = () => {
  const { toast } = useStore();
  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      border: `2px solid ${colors[toast.type] || colors.info}`,
      borderLeft: `6px solid ${colors[toast.type] || colors.info}`,
      borderRadius: '12px',
      padding: '0.875rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      zIndex: 9999,
      maxWidth: '380px',
      width: '90vw',
      animation: 'fadeIn 0.3s ease',
      color: 'var(--dark-chocolate)',
      fontFamily: 'var(--font-main)',
    }}>
      <span style={{ color: colors[toast.type], flexShrink: 0 }}>{icons[toast.type]}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
    </div>
  );
};

export default StoreToast;
