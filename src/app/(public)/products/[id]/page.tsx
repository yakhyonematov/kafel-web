'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Calculator,
  Heart,
  Share2,
  Sparkles,
  Check,
  ChevronRight,
} from 'lucide-react';
import { productService } from '../../../../services/product.service';
import { galleryService } from '../../../../services/gallery.service';
import { Product, GalleryImage } from '../../../../types';
import { formatPrice, formatSurface } from '../../../../lib/formatters';
import { useCartStore } from '../../../../store/useCartStore';
import { useWishlistStore } from '../../../../store/useWishlistStore';
import ProductCard from '../../../../components/products/ProductCard';
import SectionTitle from '../../../../components/home/SectionTitle';
import { getImageUrl } from '../../../../utils/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const addItem = useCartStore((state) => state.addItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(productId));
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const [shareCopied, setShareCopied] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Gallery active image
  const [activeImage, setActiveImage] = useState('');

  // Magnifier states
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [canZoom, setCanZoom] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanZoom(!window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  // Calculator states
  const [area, setArea] = useState<number>(10);
  const [boxes, setBoxes] = useState<number>(1);
  const [calculatedArea, setCalculatedArea] = useState<number>(1);
  const [totalCost, setTotalCost] = useState<number>(0);

  // Load product and gallery details
  useEffect(() => {
    if (!productId) return;

    async function loadProductData() {
      try {
        setLoading(true);
        const prodData = await productService.getProductById(productId);
        if (!prodData) {
          router.push('/products');
          return;
        }

        setProduct(prodData);
        setActiveImage(getImageUrl(prodData.mainImage));

        const initialBoxes = Math.ceil(10 / prodData.boxSize);
        setBoxes(initialBoxes);
        setCalculatedArea(Number((initialBoxes * prodData.boxSize).toFixed(2)));
        setTotalCost(initialBoxes * prodData.boxSize * prodData.price);

        try {
          const gallData = await galleryService.getGalleryByProduct(productId);
          setGallery(gallData);
        } catch (e) {
          setGallery([]);
        }

        try {
          const relData = await productService.getProducts({
            limit: 4,
            factoryId: prodData.factoryId,
          });
          setRelated(relData.data.filter((p) => p.id !== productId));
        } catch (e) {
          setRelated([]);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
        router.push('/products');
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [productId, router]);

  // Recalculate area/boxes on input change
  const handleAreaChange = (val: number) => {
    if (!product || val < 0) return;
    setArea(val);
    const calculatedBoxes = Math.ceil(val / product.boxSize);
    setBoxes(calculatedBoxes);
    setCalculatedArea(Number((calculatedBoxes * product.boxSize).toFixed(2)));
    setTotalCost(calculatedBoxes * product.boxSize * product.price);
  };

  const handleBoxesChange = (val: number) => {
    if (!product || val < 0) return;
    setBoxes(val);
    setArea(Number((val * product.boxSize).toFixed(2)));
    setCalculatedArea(Number((val * product.boxSize).toFixed(2)));
    setTotalCost(val * product.boxSize * product.price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, boxes);

    const event = new CustomEvent('open-cart-drawer');
    window.dispatchEvent(event);
  };

  const handleShare = async () => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: `${product.name} — Vodiy Kafel Savdo`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // User cancelled the share sheet — no action needed
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy link', e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canZoom) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) {
    return (
      <div className="max-w-[1240px] mx-auto px-6 py-12 animate-pulse space-y-8">
        <div className="h-6 bg-bg-secondary w-20 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 aspect-square bg-bg-secondary rounded-xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="h-4 bg-bg-secondary rounded w-1/4" />
              <div className="h-8 bg-bg-secondary rounded w-3/4" />
              <div className="h-6 bg-bg-secondary rounded w-1/3" />
            </div>
            <div className="h-32 bg-bg-secondary rounded-xl" />
            <div className="h-12 bg-bg-secondary rounded-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-8 md:py-16 pb-28 lg:pb-16">

      {/* Breadcrumb Navigation */}
      <nav className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-text-muted mb-4 overflow-x-auto scrollbar-none">
        <Link href="/" className="hover:text-accent transition-colors shrink-0">Bosh sahifa</Link>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <Link href="/products" className="hover:text-accent transition-colors shrink-0">Mahsulotlar</Link>
        {product.factory?.name && (
          <>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="shrink-0">{product.factory.name}</span>
          </>
        )}
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="text-text-secondary truncate">{product.name}</span>
      </nav>

      {/* Editorial Navigation Header */}
      <div className="flex justify-between items-center mb-8 border-b border-border-light pb-4">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-text-secondary hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Katalogga qaytish</span>
        </button>
        <div className="flex gap-2 text-text-secondary">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2 rounded-full transition-colors ${isWishlisted ? 'text-accent' : 'hover:text-accent'}`}
            title={isWishlisted ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-accent' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="relative p-2 rounded-full hover:text-accent transition-colors"
            title="Ulashish"
          >
            {shareCopied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
            {shareCopied && (
              <span className="absolute top-full right-0 mt-1 whitespace-nowrap text-[10px] font-semibold bg-bg-dark text-white px-2 py-1 rounded-md shadow-md">
                Havola nusxalandi
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Asymmetrical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Side: Images & Gallery Showcase (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Visual Display */}
          <div 
            className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-border/60 bg-bg-secondary shadow-xs ${canZoom ? 'cursor-zoom-in' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => canZoom && setIsZoomed(true)}
            onMouseLeave={() => canZoom && setIsZoomed(false)}
          >
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-150 ease-out"
              style={{
                transformOrigin: isZoomed && canZoom ? `${zoomPos.x}% ${zoomPos.y}%` : 'center center',
                transform: isZoomed && canZoom ? 'scale(2.2)' : 'scale(1)'
              }}
            />
            {/* Elegant Floating Badge */}
            <span className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded bg-bg-dark/85 text-white border border-white/10 shadow-md backdrop-blur-xs select-none pointer-events-none">
              {formatSurface(product.surface)}
            </span>
          </div>

          {/* Thumbnail Strip */}
          {(gallery.length > 0 || product.mainImage) && (
            <div data-lenis-prevent className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => setActiveImage(getImageUrl(product.mainImage))}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 bg-bg-secondary transition-all ${
                  activeImage === getImageUrl(product.mainImage) ? 'border-accent scale-95 shadow-sm' : 'border-border/60 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(product.mainImage)} alt={product.name} className="w-full h-full object-cover" />
              </button>
              {gallery.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(getImageUrl(img.imageUrl))}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 bg-bg-secondary transition-all ${
                    activeImage === getImageUrl(img.imageUrl) ? 'border-accent scale-95 shadow-sm' : 'border-border/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(img.imageUrl)} alt={img.roomType || 'Galereya'} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Inline Gallery: Bitgan ishlar (Real views inside show room) */}
          {gallery.length > 0 && (
            <div className="border-t border-border-light pt-8 mt-4">
              <h3 className="font-sans font-medium text-sm text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Interyerdagi real ko'rinishi</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square rounded-xl overflow-hidden border border-border/60 bg-bg-secondary group cursor-pointer"
                    onClick={() => setActiveImage(getImageUrl(img.imageUrl))}
                  >
                    <img
                      src={getImageUrl(img.imageUrl)}
                      alt={img.roomType || 'Galereya'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {img.roomType && (
                      <span className="absolute bottom-3 left-3 bg-bg-dark/80 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {img.roomType}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Description and specs (5 columns - Sticky on Scroll) */}
        <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-28">
          
          {/* Main Title & Factory */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.25em] block">
              {product.factory?.name || 'Kafel zavodi'}
            </span>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text-primary tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-xs text-text-secondary pt-1 border-t border-border-light/60 mt-2">
              <span>Kod: <strong className="text-text-primary font-medium">{product.code}</strong></span>
              <span className="text-border-light">•</span>
              <span>O'lcham: <strong className="text-text-primary font-medium">{product.size}</strong></span>
            </div>
          </div>

          {/* Technical Specs: Minimalist rows instead of a block */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
              Texnik Standartlar
            </h4>
            <div className="divide-y divide-border-light text-xs sm:text-sm">
              <div className="flex justify-between py-2.5">
                <span className="text-text-secondary">Rangi</span>
                <span className="font-medium text-text-primary">{product.color}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-text-secondary">Qalinligi</span>
                <span className="font-medium text-text-primary">{product.thickness}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-text-secondary">Yuzasi</span>
                <span className="font-medium text-text-primary">{formatSurface(product.surface)}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-text-secondary">1 Quti hajmi</span>
                <span className="font-medium text-text-primary">{product.boxSize} m²</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-text-secondary">Qo'llanilishi</span>
                <span className="font-medium text-text-primary truncate max-w-[180px]">{product.usage}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-text-secondary">Ombor holati</span>
                <span className="font-medium text-success flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Mavjud ({product.stock} m²)
                </span>
              </div>
            </div>
          </div>

          {/* Trust Badges Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1.5 text-center px-2 py-3 rounded-xl bg-bg-secondary/60 border border-border-light">
              <ShieldCheck className="w-4.5 h-4.5 text-accent" />
              <span className="text-[9px] font-semibold text-text-secondary leading-tight">Sifat kafolati</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center px-2 py-3 rounded-xl bg-bg-secondary/60 border border-border-light">
              <Truck className="w-4.5 h-4.5 text-accent" />
              <span className="text-[9px] font-semibold text-text-secondary leading-tight">Tez yetkazib berish</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center px-2 py-3 rounded-xl bg-bg-secondary/60 border border-border-light">
              <BadgeCheck className="w-4.5 h-4.5 text-accent" />
              <span className="text-[9px] font-semibold text-text-secondary leading-tight">Rasmiy hujjatlar</span>
            </div>
          </div>

          {/* Architectural Style Calculator */}
          <div className="border border-border/80 bg-bg-secondary/40 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border-light pb-2">
              <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-text-primary flex items-center gap-2">
                <Calculator className="w-4 h-4 text-accent" />
                <span>Kalkulyator</span>
              </h3>
              <span className="text-[10px] text-text-muted">Faqat butun quti bilan sotiladi</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block">
                  Kerakli maydon (m²)
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => handleAreaChange(Number(e.target.value))}
                  min={1}
                  className="h-10 px-3.5 border border-border bg-white rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent w-full font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block">
                  Quti soni (Boxes)
                </label>
                <input
                  type="number"
                  value={boxes}
                  onChange={(e) => handleBoxesChange(Number(e.target.value))}
                  min={1}
                  className="h-10 px-3.5 border border-border bg-white rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent w-full font-medium"
                />
              </div>
            </div>

            <div className="text-[11px] text-text-secondary pt-1 space-y-0.5 leading-relaxed">
              <p>• Buyurtma hajmi: <strong className="text-text-primary font-semibold">{calculatedArea} m²</strong> ({boxes} quti).</p>
            </div>
          </div>

          {/* Action Checkout Box */}
          <div className="border-t border-border pt-6 space-y-5">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">m² uchun narxi</span>
                <span className="text-base font-medium text-text-primary">{formatPrice(product.price)}</span>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Jami summa</span>
                <span className="text-2xl sm:text-3xl font-bold text-accent">{formatPrice(totalCost)}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full h-12 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-2.5 transition-all shadow-md shadow-accent/15 hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Savatga qo'shish</span>
            </button>
          </div>

        </div>
      </div>

      {/* Recommended Related Products section */}
      {related.length > 0 && (
        <section className="mt-20 md:mt-28 border-t border-border-light pt-12">
          <SectionTitle
            title="Sizga yoqishi mumkin bo'lgan mahsulotlar"
            subtitle="Tavsiya etamiz"
            align="left"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add-to-Cart Bar — keeps checkout reachable while scrolling long specs/gallery */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center gap-3 px-4 py-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="min-w-0">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Jami</span>
          <span className="text-lg font-bold text-accent truncate block">{formatPrice(totalCost)}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 h-12 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-accent/15 active:scale-[0.98]"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Savatga qo'shish</span>
        </button>
      </div>
    </div>
  );
}
