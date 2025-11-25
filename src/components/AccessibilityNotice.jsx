import React from 'react';
import { Accessibility, Info } from 'lucide-react';

const AccessibilityNotice = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Accessibility className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">Accessibility Commitment</h3>
          <p className="text-sm text-blue-800">
            We're committed to making our website accessible to everyone. All interactive elements 
            are at least 44×44 pixels, and we maintain a 4.5:1 color contrast ratio for readability. 
            If you need assistance, please contact our support team.
          </p>
        </div>
        <Info className="w-4 h-4 text-blue-400 ml-auto flex-shrink-0" />
      </div>
    </div>
  );
};

export default AccessibilityNotice;