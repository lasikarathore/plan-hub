import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  name = '', 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div 
      className={`
        ${sizes[size]} rounded-full overflow-hidden 
        flex items-center justify-center font-semibold
        ${src ? '' : 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'}
        ${className}
      `}
    >
      {src ? (
        <img src={src} alt={alt || name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name || 'U')}</span>
      )}
    </div>
  );
};

export default Avatar;
