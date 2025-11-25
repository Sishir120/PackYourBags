import React, { useState, useEffect } from 'react';
import { X, Sparkles, Gift } from 'lucide-react';

const EmailCapturePopup = ({ onClose, variant = 'A' }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle exit intent
  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Only trigger if mouse is near the top of the window (exit intent)
      if (e.clientY <= 0) {
        // Show popup
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    // Add exit intent listener after 3 seconds
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      // Close popup after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

  const handleSkip = () => {
    onClose();
  };

  if (isSubscribed) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-scale-in">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Check your email for your free AI Travel Cheat Sheet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-sky-500 to-orange-500 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-scale-in">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button 
            onClick={handleSkip}
            className="text-white/70 hover:text-white"
            aria-label="Close popup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            {variant === 'A' ? (
              <h2 className="text-2xl font-bold text-white mb-2">
                Grab the AI Travel Cheat Sheet (takes 10s)
              </h2>
            ) : (
              <h2 className="text-2xl font-bold text-white mb-2">
                Get a free custom itinerary in your inbox
              </h2>
            )}
            
            <p className="text-white/90">
              Join 50K+ travelers who get exclusive deals and travel tips
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-sky-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all disabled:opacity-75"
            >
              {isLoading ? 'Sending...' : 'Get My Free Guide'}
            </button>
            
            <p className="text-white/70 text-xs text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailCapturePopup;