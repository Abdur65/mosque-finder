import { Loader2 } from 'lucide-react';

/**
 * Loading Spinner Component
 * Shows a spinning animation with optional text
 */
export const LoadingSpinner = ({ text = 'Locating...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 
        className={`${sizeClasses[size]} text-islamic-green animate-spin`}
      />
      {text && (
        <p className="text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );
};