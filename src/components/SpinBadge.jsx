import React, { useState, useEffect } from 'react';
import { RotateCw, Star, Zap } from 'lucide-react';

const SpinBadge = ({ onSpinComplete }) => {
  const [showBadge, setShowBadge] = useState(false);
  const [spins, setSpins] = useState(0);

  useEffect(() => {
    // Check if user has spun before
    const spinCount = localStorage.getItem('rouletteSpins') || '0';
    setSpins(parseInt(spinCount));
    
    // Show badge for first-time users
    if (spinCount === '0') {
      setShowBadge(true);
    }
  }, []);

  const handleSpin = () => {
    // Update spin count
    const newSpins = spins + 1;
    setSpins(newSpins);
    localStorage.setItem('rouletteSpins', newSpins.toString());
    
    // Hide badge after first spin
    if (newSpins === 1) {
      setTimeout(() => {
        setShowBadge(false);
      }, 3000);
    }
    
    // Notify parent component
    onSpinComplete();
  };

  if (!showBadge) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce-subtle">
      <div className="bg-gradient-to-r from-sky-500 to-orange-500 rounded-full p-4 shadow-2xl animate-pulse-glow">
        <div className="flex items-center gap-2 text-white font-bold">
          <Star className="w-5 h-5" />
          <span className="text-sm">First Spin!</span>
          <Zap className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default SpinBadge;