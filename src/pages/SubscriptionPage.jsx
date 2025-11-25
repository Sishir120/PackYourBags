import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Globe, Gift } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

const SubscriptionPage = () => {
  const { upgradeToPremium, isPremium } = useSubscription();

  const features = [
    "Unlimited Roulette Spins",
    "Access to All Premium Games (Flag Dash, etc.)",
    "AI Smart Itinerary Generator",
    "Offline Mode for Itineraries",
    "Exclusive Game Skins & Badges",
    "Priority Support",
    "Ad-Free Experience"
  ];

  return (
    <>
      <Helmet>
        <title>Premium Access – PackYourBags</title>
        <meta name="description" content="Upgrade to PackYourBags Premium for unlimited travel tools, games, and AI features." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              Travel Smarter. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                Play Harder.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Unlock the full potential of your journey with PackYourBags Premium.
              More games, more tools, zero limits.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">

            {/* Free Tier */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-200" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Explorer</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">$0</span>
                <span className="text-slate-500">/forever</span>
              </div>
              <p className="text-slate-500 mb-8">Perfect for casual dreamers and weekend planners.</p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="w-5 h-5 text-teal-500" />
                  <span>3 Roulette Spins / Day</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="w-5 h-5 text-teal-500" />
                  <span>Basic Destination Guides</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="w-5 h-5 text-teal-500" />
                  <span>Limited Game Access</span>
                </li>
              </ul>

              <button className="w-full py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Current Plan
              </button>
            </motion.div>

            {/* Premium Tier */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-l from-teal-500 to-transparent px-4 py-1 text-white text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-blue-500" />

              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                Globetrotter <Zap className="w-5 h-5 text-yellow-400 fill-current" />
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">$9.99</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-400 mb-8">For serious travelers who want it all.</p>

              <ul className="space-y-4 mb-8">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-200">
                    <div className="bg-teal-500/20 p-1 rounded-full">
                      <Check className="w-4 h-4 text-teal-400" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={upgradeToPremium}
                disabled={isPremium}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${isPremium
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:shadow-teal-500/25 hover:scale-[1.02]'
                  }`}
              >
                {isPremium ? (
                  <>
                    <Check className="w-5 h-5" /> Active Plan
                  </>
                ) : (
                  <>
                    Start 7-Day Free Trial
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-500 mt-4">Cancel anytime. No questions asked.</p>
            </motion.div>

          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-teal-600">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Secure Payment</h4>
              <p className="text-sm text-slate-500">Encrypted transactions via Stripe. Your data is safe.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Global Access</h4>
              <p className="text-sm text-slate-500">Works in 190+ countries. Offline mode included.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                <Gift className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Member Perks</h4>
              <p className="text-sm text-slate-500">Exclusive discounts on flights and hotels.</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;