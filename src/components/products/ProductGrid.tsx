'use client';

import React from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import Reveal from '../ui/Reveal';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onReset?: () => void;
}

export default function ProductGrid({ products, isLoading, onReset }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7 w-full">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col animate-pulse h-full">
            {/* Image placeholder */}
            <div className="aspect-square bg-bg-secondary w-full rounded-2xl" />
            {/* Content placeholder */}
            <div className="pt-4 space-y-2.5">
              <div className="h-4 bg-bg-secondary rounded w-3/4" />
              <div className="h-3.5 bg-bg-secondary rounded w-1/2" />
              <div className="h-5 bg-bg-secondary rounded w-2/5 mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full text-center py-16 px-4 bg-bg-secondary rounded-xl border border-border flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white text-text-muted flex items-center justify-center shadow-xs">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-text-primary text-base">Mahsulotlar topilmadi</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
            Qidiruv mezonlariga yoki tanlangan filtrlarga mos keladigan mahsulot topilmadi. Filtrni o'zgartirib ko'ring yoki quyidagi tugmani bosing.
          </p>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="mt-2 px-6 h-10 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md shadow-accent/15 active:scale-95"
          >
            Filtrlarni tozalash
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
      {products.map((product, index) => (
        <Reveal key={product.id} delay={(index % 8) * 60} y={16}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
