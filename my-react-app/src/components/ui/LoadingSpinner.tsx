import React from 'react';

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="spinner w-full h-full"></div>
    </div>
  );
};

export default LoadingSpinner;
