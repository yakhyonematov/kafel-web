'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface StyledSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Sizing/typography classes only — horizontal padding and appearance are handled internally. */
  className?: string;
}

export default function StyledSelect({ className = '', children, ...props }: StyledSelectProps) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full appearance-none cursor-pointer bg-white border border-border rounded-lg pl-3.5 pr-9 text-text-primary focus:outline-none focus:border-accent hover:border-text-secondary/40 transition-colors ${className}`}
      >
        {children}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
