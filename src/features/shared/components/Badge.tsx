import React from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'free' | 'paid' | 'hybrid' | 'beginner' | 'essential' | 'advanced' | 'done' | 'neutral';
}

export function Badge({ className, variant = 'neutral', children, ...props }: BadgeProps) {
  const variants = {
    free: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    paid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hybrid: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    beginner: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    essential: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    done: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
