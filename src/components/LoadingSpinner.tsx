import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

export const LoadingSpinner = ({ text = 'Loading...', size = 'md' }: LoadingSpinnerProps) => (
  <div className="flex flex-col items-center justify-center gap-3">
    <Loader2 className={`${sizeClasses[size]} text-islamic-green animate-spin`} />
    {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
  </div>
);
