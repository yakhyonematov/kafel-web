'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroBanner from '../../components/home/HeroBanner';
import Link from 'next/link';
import SectionTitle from '../../components/home/SectionTitle';
import ProductGrid from '../../components/products/ProductGrid';
import ProductCard from '../../components/products/ProductCard';
import FAQAccordion from '../../components/home/FAQAccordion';
import ContactForm from '../../components/home/ContactForm';
import { productService } from '../../services/product.service';
import { Product } from '../../types';
import Reveal from '../../components/ui/Reveal';
import { ShieldCheck, Truck, Award, Sparkles, MapPin, Phone, Clock, ArrowRight, View, Map as MapIcon } from 'lucide-react';

const PanoramaViewer = dynamic(() => import('../../components/home/PanoramaViewer'), { ssr: false });

export default function HomePage() {
  const [floorProducts, setFloorProducts] = useState<Product[]>([]);
  const [wallProducts, setWallProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationView, setLocationView] = useState<'360' | 'map'>('360');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Try fetching floor products from backend
        const floorRes = await productService.getProducts({ page: 1, limit: 8, usage: 'Pol uchun' });
        const wallRes = await productService.getProducts({ page: 1, limit: 8, usage: 'Sanuzel' });

        setFloorProducts(floorRes.data);
        setWallProducts(wallRes.data);
      } catch (error) {
        console.error('Failed to load home page products', error);
        setFloorProducts([]);
        setWallProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero banner */}
      <HeroBanner />

      {/* 2. Core features / Stats Section (Atlas Concorde Luxury Style) */}
      <section className="w-full bg-white py-16 md:py-24 border-b border-border-light relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <div className="max-w-[1240px] mx-auto h-full px-6 grid grid-cols-4 divide-x divide-border-light/60">
            <div className="h-full"></div>
            <div className="h-full"></div>
            <div className="h-full"></div>
            <div className="h-full"></div>
          </div>
        </div>

        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            
            {/* Feature 1 */}
            <Reveal delay={0}>
              <div className="group bg-bg-secondary/40 border border-border/60 hover:border-accent p-8 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px] hover:-translate-y-1">
                <div className="absolute top-4 right-6 text-7xl font-sans font-light text-border-light/80 group-hover:text-accent-light/50 transition-colors select-none">
                  01
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/5 text-accent flex items-center justify-center transition-colors group-hover:bg-accent group-hover:text-white shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="mt-8">
                  <h4 className="font-bold text-text-primary text-sm sm:text-base mb-1.5 uppercase tracking-wide">
                    20+ Yillik tajriba
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    O'z sohamizda ko'p yillik sinalgan ishonch va tajriba
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Feature 2 */}
            <Reveal delay={100}>
              <div className="group bg-bg-secondary/40 border border-border/60 hover:border-accent p-8 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px] hover:-translate-y-1">
                <div className="absolute top-4 right-6 text-7xl font-sans font-light text-border-light/80 group-hover:text-accent-light/50 transition-colors select-none">
                  02
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/5 text-accent flex items-center justify-center transition-colors group-hover:bg-accent group-hover:text-white shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="mt-8">
                  <h4 className="font-bold text-text-primary text-sm sm:text-base mb-1.5 uppercase tracking-wide">
                    Birinchi sort kafel
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Faqat yuqori sifatli va sertifikatlangan kafellar to'plami
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Feature 3 */}
            <Reveal delay={200}>
              <div className="group bg-bg-secondary/40 border border-border/60 hover:border-accent p-8 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px] hover:-translate-y-1">
                <div className="absolute top-4 right-6 text-7xl font-sans font-light text-border-light/80 group-hover:text-accent-light/50 transition-colors select-none">
                  03
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/5 text-accent flex items-center justify-center transition-colors group-hover:bg-accent group-hover:text-white shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="mt-8">
                  <h4 className="font-bold text-text-primary text-sm sm:text-base mb-1.5 uppercase tracking-wide">
                    Sifat kafolati
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Yetkazib berishda har qanday siniq chiqsa bepul almashtiramiz
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Feature 4 */}
            <Reveal delay={300}>
              <div className="group bg-bg-secondary/40 border border-border/60 hover:border-accent p-8 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px] hover:-translate-y-1">
                <div className="absolute top-4 right-6 text-7xl font-sans font-light text-border-light/80 group-hover:text-accent-light/50 transition-colors select-none">
                  04
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/5 text-accent flex items-center justify-center transition-colors group-hover:bg-accent group-hover:text-white shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="mt-8">
                  <h4 className="font-bold text-text-primary text-sm sm:text-base mb-1.5 uppercase tracking-wide">
                    O'zbekiston bo'ylab
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Vodiy va boshqa barcha hududlarga xavfsiz yetkazib berish
                  </p>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* About Us Section (#about - Atlas Concorde Inspired preview) */}
      <section id="about" className="py-16 md:py-24 max-w-[1240px] mx-auto px-6 w-full scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Narrative - 7 cols) */}
          <Reveal className="lg:col-span-7 flex flex-col gap-6 items-start">
            <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase block">
              Biz haqimizda
            </span>
            <h2 className="font-sans font-medium text-3xl sm:text-4xl tracking-tight text-text-primary uppercase leading-tight">
              Farg'ona vodiysida yetakchi kafel savdosi uyi
            </h2>
            
            <p className="text-sm text-text-secondary leading-relaxed">
              Biz mijozlarimizni sifatli va chiroyli kafel mahsulotlari bilan taminlaymiz va ularga o’zgacha kayfiyat ulashamiz. 20 yildan ortiq vaqt davomida Xitoy va Hindiston davlatlaridan eng zamonaviy keramika mahsulotlarini import qilib kelmoqdamiz.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Shuningdek, mahalliy ishlab chiqarilgan sifatli kafel mahsulotlarini qo'shni Qirg'iziston, Qozog'iston va Tojikiston davlatlariga eksport qilamiz hamda respublikamiz bo‘ylab ulgurji dilerlarga yetkazib beramiz.
            </p>

            <div className="border-l-2 border-accent pl-4 my-2 italic text-text-primary text-sm font-medium">
              "Biz mijozlarimizni sifatli kafellar bilan taminlaymiz va ularga o’zgacha kayfiyat ulashamiz"
            </div>

            <Link
              href="/about"
              className="mt-4 px-8 h-12 rounded-full border border-primary hover:bg-primary hover:text-white text-text-primary text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all"
            >
              <span>Batafsil ma'lumot</span>
              <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </Reveal>

          {/* Right Column (Metrics - 5 cols) */}
          <Reveal delay={150} className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6 w-full">
            {/* Metric 1 */}
            <div className="bg-bg-secondary border border-border p-6 rounded-2xl flex flex-col gap-1 hover:border-accent hover:-translate-y-0.5 transition-all">
              <span className="text-3xl font-sans font-light text-text-primary">50000+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Mijozlarimiz</span>
            </div>
            {/* Metric 2 */}
            <div className="bg-bg-secondary border border-border p-6 rounded-2xl flex flex-col gap-1 hover:border-accent hover:-translate-y-0.5 transition-all">
              <span className="text-3xl font-sans font-light text-text-primary">40+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Xodimlarimiz</span>
            </div>
            {/* Metric 3 */}
            <div className="bg-bg-secondary border border-border p-6 rounded-2xl flex flex-col gap-1 hover:border-accent hover:-translate-y-0.5 transition-all">
              <span className="text-3xl font-sans font-light text-text-primary">120+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Hamkorlar</span>
            </div>
            {/* Metric 4 */}
            <div className="bg-bg-secondary border border-border p-6 rounded-2xl flex flex-col gap-1 hover:border-accent hover:-translate-y-0.5 transition-all">
              <span className="text-3xl font-sans font-light text-text-primary">20 yil+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Tajribamiz</span>
            </div>
          </Reveal>

        </div>
      </section>

      {/* 3. Section: Floor Tiles (Pol uchun) */}
      <section className="py-16 md:py-24 w-full bg-bg-secondary/45 border-t border-border-light">
        <div className="max-w-[1240px] mx-auto px-6 w-full">
          {/* Asymmetrical Offset Section Header */}
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-border-light">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase block">
                Mahsulotlarimiz
              </span>
              <h2 className="font-sans font-medium text-2xl sm:text-3xl tracking-tight text-text-primary uppercase">
                Pol uchun kafel va keramogranitlar
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Uyingiz yoki ofisingiz pol qismlari uchun mo'ljallangan mustahkam va chiroyli 60x60 cm o'lchamli kafellar.
              </p>
            </div>
            <Link
              href="/products?usage=Pol uchun"
              className="px-6 h-10 rounded-full border border-primary hover:bg-primary hover:text-white text-text-primary text-[10px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all self-start md:self-auto shrink-0"
            >
              <span>Barcha turlari</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Hero Showcase Card (Left) */}
            <div className="lg:col-span-4 relative rounded-xl overflow-hidden group min-h-[350px] lg:min-h-full flex flex-col justify-end p-8 border border-border/40 shadow-xs">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              <div className="relative z-20 space-y-3">
                <span className="text-[9px] font-bold tracking-[0.2em] text-accent uppercase block">
                  Keramogranit
                </span>
                <h3 className="font-sans font-medium text-xl sm:text-2xl text-white uppercase leading-tight">
                  Mustahkamlik & Estetika
                </h3>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Uyingiz va ofisingiz pol qismlari uchun mo'ljallangan, yuqori yuklamalarga chidamli hamda oson tozalanuvchi premium plitkalar.
                </p>
                <Link
                  href="/products?usage=Pol uchun"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white hover:text-accent transition-colors pt-2"
                >
                  <span>Kolleksiyani ko'rish</span>
                  <ArrowRight className="w-3 h-3 animate-pulse" />
                </Link>
              </div>
            </div>

            {/* Product Cards (Right) */}
            <div className="lg:col-span-8 flex items-center">
              {loading ? (
                <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-border overflow-hidden flex flex-col animate-pulse h-full">
                      <div className="aspect-square bg-bg-secondary w-full" />
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="h-2.5 bg-bg-secondary rounded w-1/3" />
                          <div className="h-4 bg-bg-secondary rounded w-3/4" />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="h-5 bg-bg-secondary rounded w-1/2" />
                          <div className="h-8 bg-bg-secondary rounded-full w-8" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                  {floorProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Wall Tiles (Sanuzel va Oshxona) */}
      <section className="py-16 md:py-24 w-full">
        <div className="max-w-[1240px] mx-auto px-6 w-full">
          {/* Asymmetrical Offset Section Header */}
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-border-light">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase block">
                Sizda ajoyib tanlov bor
              </span>
              <h2 className="font-sans font-medium text-2xl sm:text-3xl tracking-tight text-text-primary uppercase">
                Sanuzel va oshxona devorlari uchun
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Devor bezaklari uchun maxsus 30x60 cm o'lchamli yaltiroq (Glossy) dizaynlar. Bizda faqat birinchi sort kafellar.
              </p>
            </div>
            <Link
              href="/products?usage=Sanuzel"
              className="px-6 h-10 rounded-full border border-primary hover:bg-primary hover:text-white text-text-primary text-[10px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all self-start md:self-auto shrink-0"
            >
              <span>Barcha turlari</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Product Cards (Left on desktop, bottom on mobile) */}
            <div className="lg:col-span-8 order-2 lg:order-1 flex items-center">
              {loading ? (
                <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-border overflow-hidden flex flex-col animate-pulse h-full">
                      <div className="aspect-square bg-bg-secondary w-full" />
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="h-2.5 bg-bg-secondary rounded w-1/3" />
                          <div className="h-4 bg-bg-secondary rounded w-3/4" />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="h-5 bg-bg-secondary rounded w-1/2" />
                          <div className="h-8 bg-bg-secondary rounded-full w-8" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                  {wallProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
 
            {/* Hero Showcase Card (Right on desktop, top on mobile) */}
            <div className="lg:col-span-4 order-1 lg:order-2 relative rounded-xl overflow-hidden group min-h-[320px] sm:min-h-[350px] lg:min-h-full flex flex-col justify-end p-6 sm:p-8 border border-border/40 shadow-xs">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              <div className="relative z-20 space-y-3">
                <span className="text-[9px] font-bold tracking-[0.2em] text-accent uppercase block">
                  Keramika
                </span>
                <h3 className="font-sans font-medium text-xl sm:text-2xl text-white uppercase leading-tight">
                  Nafislik & Yaltiroqlik
                </h3>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Oshxona va hammom devorlari uchun mo'ljallangan yaltiroq (Glossy) hamda namlikka chidamli maxsus birinchi sort kafel dizaynlari.
                </p>
                <Link
                  href="/products?usage=Sanuzel"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white hover:text-accent transition-colors pt-2"
                >
                  <span>Kolleksiyani ko'rish</span>
                  <ArrowRight className="w-3 h-3 animate-pulse" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branches Section (#branches - Atlas Concorde Asymmetrical Design) */}
      <section id="branches" className="py-16 md:py-24 bg-white border-t border-b border-border-light w-full scroll-mt-24 relative overflow-hidden">
        {/* Decorative background grid line */}
        <div className="absolute inset-y-0 left-1/3 w-[1px] bg-border-light/40 pointer-events-none hidden lg:block" />

        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          {/* Section Header */}
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-border-light">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase block">
                Showroom va do'konimiz
              </span>
              <h2 className="font-sans font-medium text-2xl sm:text-3xl tracking-tight text-text-primary uppercase">
                Bizning filiallarimiz
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Farg'ona shahridagi bosh do'konimizga tashrif buyuring va mahsulotlarimizning rang-barang namunalarini bevosita showroomda tomosha qiling.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
              {/* Map / 360° toggle */}
              <div className="flex items-center bg-bg-secondary border border-border rounded-full p-1">
                <button
                  onClick={() => setLocationView('360')}
                  className={`flex items-center gap-1.5 px-4 h-8 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                    locationView === '360' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <View className="w-3.5 h-3.5" />
                  <span>360°</span>
                </button>
                <button
                  onClick={() => setLocationView('map')}
                  className={`flex items-center gap-1.5 px-4 h-8 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                    locationView === 'map' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Xarita</span>
                </button>
              </div>
              <a
                href="https://yandex.com/maps/-/CDT4Z-pL"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 h-10 rounded-full border border-primary hover:bg-primary hover:text-white text-text-primary text-[10px] font-bold uppercase tracking-[0.15em] hidden sm:flex items-center justify-center gap-2 transition-all"
              >
                <span>Xaritada ochish</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Showroom card details (5 cols - High Contrast Dark Slate Card) */}
            <Reveal className="lg:col-span-5 bg-[#1E1E1E] text-white/90 p-8 rounded-xl flex flex-col justify-between gap-8 border border-white/5 shadow-lg relative overflow-hidden group">
              {/* Background graphic flare */}
              <div className="absolute -right-24 -bottom-24 w-48 h-48 rounded-full bg-accent/10 blur-3xl group-hover:bg-accent/15 transition-all duration-500" />
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold tracking-[0.25em] text-accent uppercase block">
                    Bosh do'kon
                  </span>
                  <h3 className="font-sans font-medium text-xl sm:text-2xl text-white uppercase tracking-wide">
                    Vodiy Kafel Savdo Uyi
                  </h3>
                </div>
                
                <div className="space-y-4 pt-2 text-xs sm:text-sm text-white/70">
                  <p className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Farg'ona viloyati, Farg'ona shahar, Vatan ravnaqi ko'chasi 47-uy</span>
                  </p>
                  <a href="tel:+998911296666" className="flex items-start gap-3 hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="font-medium text-white">+998 91 129 6666</span>
                  </a>
                  <p className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>Ish vaqti: 08:00 dan 17:00 gacha<br/>(Dushanbadan - Shanbagacha)</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-xs leading-relaxed text-white/80">
                  <strong className="text-white block mb-1">Mo'ljal:</strong>
                  Urjuza klinikasi, Farg'ona bolalar shifoxonasi.
                </div>
                <a
                  href="https://yandex.com/maps/-/CDT4Z-pL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 rounded-full bg-accent hover:bg-accent-hover text-white text-[10px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all shadow-md shadow-accent/15"
                >
                  <span>Yandex Navigator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </Reveal>

            {/* Map / 360° viewer (7 cols) */}
            <Reveal delay={150} className="lg:col-span-7 h-[350px] lg:h-auto min-h-[350px] rounded-xl overflow-hidden border border-border bg-bg-secondary relative shadow-xs">
              {locationView === '360' ? (
                <PanoramaViewer src="/panorama/showroom-360-demo.jpg" className="h-full" />
              ) : (
                <iframe
                  title="Yandex Map"
                  src="https://yandex.com/map-widget/v1/?org=112678881268&ll=71.785000%2C40.385000&z=15"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen={true}
                  className="filter grayscale-[10%] contrast-[105%]"
                />
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Section: FAQ Accordion */}
      <FAQAccordion />

      {/* 6. Section: Contacts & Callback Form */}
      <ContactForm />
    </div>
  );
}
