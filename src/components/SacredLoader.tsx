import React from 'react';

const SacredLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full sacred-gradient opacity-30 animate-sacred-pulse"></div>
      </div>
    </div>
  );
};

export default SacredLoader;
