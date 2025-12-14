import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value?: number; // 0-100
  progress?: number; // Alias for value
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value: valueProp,
  progress,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
}) => {
  const value = valueProp ?? progress ?? 0;
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const backgroundColors = {
    primary: 'bg-primary-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          <span className="text-sm font-semibold text-gray-900">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={`w-full ${backgroundColors[color]} rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`${colors[color]} ${sizes[size]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
