import React, { useState } from 'react';
import { X, Sparkles, Globe, MapPin } from 'lucide-react';

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setCompleted(true);
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (completed) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Skip button */}
        <div className="flex justify-end p-4">
          <button 
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Skip onboarding"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center mb-6 px-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${step >= num ? 'bg-sky-500' : 'bg-gray-300'}`}></div>
              {num < 3 && <div className={`w-12 h-1 ${step > num ? 'bg-sky-500' : 'bg-gray-300'}`}></div>}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="px-8 pb-8">
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Discovery</h2>
              <p className="text-gray-600 mb-6">
                Our AI assistant helps you discover perfect travel destinations based on your unique preferences and interests.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Destinations</h2>
              <p className="text-gray-600 mb-6">
                Spin the travel roulette or search for specific destinations to uncover hidden gems and popular spots around the world.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan Your Trip</h2>
              <p className="text-gray-600 mb-6">
                Save your favorite destinations, create detailed itineraries, and get personalized travel recommendations.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-sky-500 to-orange-400 text-white px-6 py-3 rounded-full font-bold hover:from-sky-600 hover:to-orange-500 transition-all"
            >
              {step === 3 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;