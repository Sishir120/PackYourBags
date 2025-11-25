import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger' // 'danger', 'warning', 'info'
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const variantStyles = {
    danger: {
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      border: 'border-red-200'
    },
    warning: {
      icon: 'text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
      border: 'border-amber-200'
    },
    info: {
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      border: 'border-blue-200'
    }
  }

  const styles = variantStyles[variant] || variantStyles.danger

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 ${styles.icon}`}>
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 id="confirm-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            
            <p id="confirm-message" className="text-gray-600 mb-6">
              {message}
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                aria-label="Cancel action"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className={`px-4 py-2 ${styles.button} rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${variant === 'danger' ? 'red' : variant === 'warning' ? 'amber' : 'blue'}-500`}
                aria-label={confirmText}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

