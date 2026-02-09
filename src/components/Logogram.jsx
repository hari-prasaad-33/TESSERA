import React from 'react';

const Logogram = ({ progress = 75, size = 100, color = 'text-tessera-orange', className = '' }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Ring */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          className="text-tessera-void opacity-50"
        />
        {/* Progress Ring - The 'Ink' */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round" // Ink style rounded ends
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${color} transition-all duration-1000 ease-out`}
          style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} // Glow effect
        />
      </svg>
      {/* Inner Mist/Glass */}
      <div className="absolute inset-4 rounded-full bg-tessera-ink/30 backdrop-blur-sm"></div>
    </div>
  );
};

export default Logogram;
