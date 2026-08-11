import { ReactNode } from 'react';
import { Skeleton } from './Skeleton';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      {icon && <div className="mx-auto mb-4 text-text-lighter">{icon}</div>}
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      {description && <p className="text-text-light mb-6 max-w-md mx-auto">{description}</p>}
      {action}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      {message && <p className="text-text-light mb-6">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
}
