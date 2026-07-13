import { ReactNode } from 'react';
import { cn } from './Button';

export function Card({ className, children }: { className?: string, children: ReactNode }) {
  return (
    <div className={cn('bg-gray-800 border border-gray-700 rounded-lg shadow-sm', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="p-4 border-b border-gray-700">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}

export function CardContent({ className, children }: { className?: string, children: ReactNode }) {
  return <div className={cn('p-4', className)}>{children}</div>;
}
