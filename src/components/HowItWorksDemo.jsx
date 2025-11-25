import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Globe, MapPin } from 'lucide-react';

const HowItWorksDemo = () => {
  const [currentFrame, setCurrentFrame] = useState(0);

  const frames = [
    {
      icon: Sparkles,
      title: "Ask Anything",
      description: "Describe your dream trip or ask specific questions about destinations"
    },
    {
      icon: Globe,
      title: "AI Explores",
      description: "Our AI searches thousands of destinations to find your perfect match"
    },
    {
      icon: MapPin,
      title: "Get Recommendations",
      description: "Receive personalized suggestions with detailed travel information"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [frames.length]);

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 shadow-xl border border-primary-500/30">
      <h3 className="text-xl font-bold text-white mb-4 text-center">How Our AI Works</h3>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {frames.map((frame, index) => {
          const Icon = frame.icon;
          const isActive = index === currentFrame;

          return (
            <div
              key={index}
              className={`flex-1 text-center transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : 'opacity-70 scale-100'
                }`}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-white mb-2">{frame.title}</h4>
              <p className="text-white/90 text-sm">{frame.description}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {frames.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFrame(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentFrame ? 'bg-white' : 'bg-white/40'
              }`}
            aria-label={`Go to frame ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HowItWorksDemo;