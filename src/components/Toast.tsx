import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
      case 'error': return 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
      case 'warning': return 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
      case 'info': return 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)';
      default: return '#fff';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success': return '#15803d';
      case 'error': return '#dc2626';
      case 'warning': return '#d97706';
      case 'info': return '#2563eb';
      default: return '#000';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return '#bbf7d0';
      case 'error': return '#fecaca';
      case 'warning': return '#fcd34d';
      case 'info': return '#93c5fd';
      default: return '#e5e7eb';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        background: getBackgroundColor(),
        color: getTextColor(),
        border: `1px solid ${getBorderColor()}`,
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '400px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>{getIcon()}</span>
      <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: getTextColor(),
          cursor: 'pointer',
          marginLeft: 'auto',
          opacity: 0.7,
          fontSize: '1.2rem',
          padding: '0',
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7';
        }}
      >
        ✕
      </button>
    </div>
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return {
    addToast,
    ToastContainer
  };
};