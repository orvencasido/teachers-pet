import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'zinc' | 'purple';
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, string> = {
  indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  sky: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  zinc: 'bg-zinc-800 text-zinc-300 border-zinc-700/60',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'zinc',
  size = 'sm',
}) => {
  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const colorStyle = variantStyles[variant] || variantStyles.zinc;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeStyle} ${colorStyle}`}
    >
      {children}
    </span>
  );
};
