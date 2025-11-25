import React from 'react';
import { Shield, Lock, Award, Users } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    { 
      icon: Shield, 
      text: 'SSL Protection',
      color: 'text-green-500'
    },
    { 
      icon: Lock, 
      text: 'GDPR Compliant',
      color: 'text-green-500'
    },
    { 
      icon: Award, 
      text: 'Award Winning',
      color: 'text-amber-500'
    },
    { 
      icon: Users, 
      text: '15K+ Travelers',
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 py-6">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div key={index} className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${badge.color}`} />
            <span className="text-sm font-medium text-gray-700">{badge.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TrustBadges;