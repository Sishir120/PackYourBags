import React from 'react';

const ProfessionalTheme = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};

export default ProfessionalTheme;