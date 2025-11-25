import React, { useState } from 'react';
import { Gift, Sparkles, Lock, Mail } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');

      // Track subscription in localStorage
      localStorage.setItem('subscribedToNewsletter', 'true');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-neutral-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12 text-center shadow-2xl border border-white/10">
            <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Thank You for Subscribing!</h3>
            <p className="text-xl text-neutral-300 mb-6 font-light">
              Check your email for your free AI Travel Cheat Sheet.
            </p>
            <p className="text-neutral-500 text-sm">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="subscribe" className="py-24 bg-neutral-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Gradient Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/10 shadow-2xl text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full mb-8 shadow-lg">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white uppercase tracking-widest">
              Exclusive Travel Tips
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get the AI Travel <span className="text-primary-400">Cheat Sheet</span>
          </h2>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Join 50K+ travelers who get exclusive deals, destination guides, and AI-powered travel tips delivered to their inbox.
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-lg disabled:opacity-75 transition-all duration-300 shadow-lg hover:shadow-primary-600/25 whitespace-nowrap"
              >
                {isLoading ? 'Sending...' : 'Get My Free Guide'}
              </button>
            </div>

            <div className="flex flex-col items-center mt-6 space-y-2">
              <p className="text-neutral-400 text-center flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4 text-primary-400" />
                <span>GDPR-safe. Unsubscribe anytime.</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;