import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  style,
  hover = false,
  onClick 
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-soft border border-gray-100 
        transition-all duration-300
        ${hover ? 'hover:shadow-medium hover:-translate-y-1 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
