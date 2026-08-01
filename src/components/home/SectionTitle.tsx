'use client';

import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({
  title,
  subtitle,
  description,
  align = 'center',
}: SectionTitleProps) {
  const isCenter = align === 'center';

  return (
    <div className={`mb-10 md:mb-14 ${isCenter ? 'mx-auto text-center' : 'text-left'} max-w-3xl`}>
      {subtitle && (
        <span className="text-xs font-bold tracking-[0.2em] text-accent uppercase block mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-[3.25rem] tracking-tight text-text-primary leading-[1.05]">
        {title}
      </h2>
      {description && (
        <p className="text-base text-text-secondary leading-relaxed mt-4 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
