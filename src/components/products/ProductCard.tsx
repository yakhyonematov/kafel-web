'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, formatSurface } from '../../lib/formatters';
import { useCartStore } from '../../store/useCartStore';
import { getImageUrl } from '../../utils/image';

interface ProductCardProps {
  product: Product;
}

const NEW_THRESHOLD_DAYS = 21;

function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  const ageInDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
  return ageInDays <= NEW_THRESHOLD_DAYS;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);

    const event = new CustomEvent('open-cart-drawer');
    window.dispatchEvent(event);
  };

  const surfaceLabel = formatSurface(product.surface);
  const showNewBadge = isNewProduct(product.createdAt);
  // Determine promo badge based on product code hash to dynamically flag some items
  const showPromoBadge = !showNewBadge && (product.code.charCodeAt(product.code.length - 1) % 3 === 0);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col h-full bg-white border border-border-light/60 p-3 rounded-2xl hover:border-accent/25 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image Wrapper */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-bg-secondary border border-border-light/30">
        <img
          src={getImageUrl(product.mainImage)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {showNewBadge && (
          <span className="absolute top-3 left-3 bg-accent text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
            Yangi
          </span>
        )}

        {showPromoBadge && (
          <span className="absolute top-3 left-3 bg-[#E31C3D] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
            Aksiya
          </span>
        )}

        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white hover:bg-accent text-text-primary hover:text-white shadow-md flex items-center justify-center transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:scale-105 active:scale-95"
          title="Savatga qo'shish"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>

      {/* Info Container */}
      <div className="pt-4 flex-1 flex flex-col justify-between gap-2.5">
        <div className="space-y-1">
          <h3 className="font-bold text-text-primary text-xs sm:text-sm leading-snug group-hover:text-accent transition-colors line-clamp-2 min-h-[2.2rem]">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-text-secondary">
            {product.factory?.name ? `${product.factory.name} · ` : ''}
            {surfaceLabel} · {product.size}
          </p>
        </div>

        <div className="flex items-baseline gap-1 pt-0.5">
          <span className="font-extrabold text-sm sm:text-base text-text-primary tracking-tight">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] text-text-muted">/ m²</span>
        </div>
      </div>
    </Link>
  );
}
