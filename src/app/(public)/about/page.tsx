'use client';

import React from 'react';
import SectionTitle from '../../../components/home/SectionTitle';
import { Award, Users, Globe, Building2, Calendar, ShieldCheck, ArrowRight, Send } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full bg-white py-12 md:py-20">
      
      {/* 1. Header Section */}
      <div className="max-w-[1240px] mx-auto px-6 mb-12 md:mb-16">
        <SectionTitle
          title="Biz Haqimizda"
          subtitle="Tarix va Ishonch"
          description="Biz mijozlarimizni eng sifatli kafel va keramogranitlar bilan ta'minlaymiz hamda ularning uylariga o'zgacha shinamlik va kayfiyat ulashamiz."
          align="left"
        />
      </div>

      {/* 2. Main Story Grid */}
      <section className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 md:mb-28">
        {/* Left Column: Narrative */}
        <div className="space-y-6 text-sm sm:text-base text-text-secondary leading-relaxed">
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary uppercase tracking-wide">
            20 Yillik Muvaffaqiyatli Yo'l
          </h3>
          <p>
            <strong>Vodiy Kafel Savdo</strong> 20 yildan buyon O'zbekiston kafel va keramogranit bozorida o'zining mustahkam o'rniga ega etakchi kompaniyalardan biri hisoblanadi. Biz mijozlarimizga faqatgina kafel sotmaymiz, balki ularning orzularidagi xonalarni qurishda ishonchli hamkor bo'lib xizmat qilamiz.
          </p>
          <p>
            Biz faoliyatimiz davomida eng nufuzli ishlab chiqaruvchilar bilan to'g'ridan-to'g'ri dilerlik shartnomalarini tuzib, respublikamiz aholisiga birinchi sort, sertifikatlangan va yuqori sifatli mahsulotlarni yetkazib berib kelmoqdamiz.
          </p>
          
          <div className="border-l-2 border-accent pl-4 my-6 italic text-text-primary font-medium">
            "Biz mijozlarimizni sifatli kafellar bilan ta'minlaymiz va ularga o’zgacha kayfiyat ulashamiz"
          </div>
        </div>

        {/* Right Column: Hero Image container */}
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border bg-bg-secondary group shadow-sm">
          <img
            src="/images/about/corporate_headquarters.png"
            alt="Vodiy Kafel Flagman Showroom"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </section>

      {/* 3. Luxury Stats Block (Atlas Concorde style) */}
      <section className="w-full bg-primary-dark text-white py-16 md:py-24 mb-20 md:mb-28 relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <div className="max-w-[1240px] mx-auto h-full px-6 grid grid-cols-5 divide-x divide-white/5">
            <div></div><div></div><div></div><div></div><div></div>
          </div>
        </div>

        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 text-center">
            {/* Stat 1 */}
            <div className="space-y-2">
              <span className="block font-sans font-light text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                20 yil+
              </span>
              <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/60">
                Tajriba
              </span>
            </div>

            {/* Stat 2 */}
            <div className="space-y-2">
              <span className="block font-sans font-light text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                50k+
              </span>
              <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/60">
                Mamnun Mijozlar
              </span>
            </div>

            {/* Stat 3 */}
            <div className="space-y-2">
              <span className="block font-sans font-light text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                40+
              </span>
              <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/60">
                Xodimlarimiz
              </span>
            </div>

            {/* Stat 4 */}
            <div className="space-y-2">
              <span className="block font-sans font-light text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                120+
              </span>
              <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/60">
                Hamkor Zavodlar
              </span>
            </div>

            {/* Stat 5 */}
            <div className="space-y-2 col-span-2 lg:col-span-1">
              <span className="block font-sans font-light text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                3 ta
              </span>
              <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/60">
                Eksport Davlatlari
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Import & Export Channels Section */}
      <section className="max-w-[1240px] mx-auto px-6 mb-16 md:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Channel 1 */}
          <div className="border border-border rounded-2xl p-8 hover:border-accent hover:-translate-y-1 transition-all duration-300 bg-bg-secondary/20">
            <div className="w-11 h-11 rounded-full bg-accent/5 text-accent flex items-center justify-center mb-6">
              <Globe className="w-5.5 h-5.5" />
            </div>
            <h4 className="font-bold text-text-primary text-base uppercase tracking-wide mb-3">
              Xalqaro Import
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Biz dunyo bo'yicha eng ilg'or texnologiyalarga ega bo'lgan **Xitoy va Hindiston** davlatlarining yirik zavodlaridan kafel mahsulotlarini to'g'ridan-to'g'ri import qilamiz.
            </p>
          </div>

          {/* Channel 2 */}
          <div className="border border-border rounded-2xl p-8 hover:border-accent hover:-translate-y-1 transition-all duration-300 bg-bg-secondary/20">
            <div className="w-11 h-11 rounded-full bg-accent/5 text-accent flex items-center justify-center mb-6">
              <Send className="w-5.5 h-5.5 rotate-[-30deg]" />
            </div>
            <h4 className="font-bold text-text-primary text-base uppercase tracking-wide mb-3">
              Mintaqaviy Eksport
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              O‘zbekistonda ishlab chiqarilgan yuqori sifatli va raqobatbardosh kafel mahsulotlarini qo'shni **Qirg‘iziston, Qozog‘iston va Tojikiston** davlatlariga dilerlik shoxobchalari orqali eksport qilamiz.
            </p>
          </div>

          {/* Channel 3 */}
          <div className="border border-border rounded-2xl p-8 hover:border-accent hover:-translate-y-1 transition-all duration-300 bg-bg-secondary/20">
            <div className="w-11 h-11 rounded-full bg-accent/5 text-accent flex items-center justify-center mb-6">
              <Building2 className="w-5.5 h-5.5" />
            </div>
            <h4 className="font-bold text-text-primary text-base uppercase tracking-wide mb-3">
              Ulgurji Tarqatish
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Mahalliy kafel mahsulotlarini butun respublikamiz bo‘ylab ulgurji (wholesale) dilerlar va savdo hamkorlarimizga xavfsiz transport orqali yetkazib berish xizmatlarini taqdim etamiz.
            </p>
          </div>
        </div>
      </section>

      {/* 4.5. 3D Conceptual Assets Grid (Logistics Globe & Quality Sculpture) */}
      <section className="max-w-[1240px] mx-auto px-6 mb-20 md:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          
          {/* Concept Card 1: Logistics Globe */}
          <div className="bg-bg-secondary/20 border border-border rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center hover:border-accent transition-colors duration-300">
            <div className="w-full md:w-2/5 aspect-square rounded-2xl overflow-hidden border border-border shrink-0">
              <img
                src="/images/about/global_logistics.png"
                alt="Global Import-Export Network"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <span className="text-[9px] font-bold tracking-[0.2em] text-accent uppercase block">
                Kompaniya Tarmog'i
              </span>
              <h4 className="font-bold text-text-primary text-base sm:text-lg uppercase tracking-wide">
                Global Import va Eksport
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Hindiston va Xitoyning eng ilg'or kafel ishlab chiqaruvchilaridan import kanallari hamda Markaziy Osiyo (Qirg'iziston, Qozog'iston, Tojikiston) bo'ylab mustahkam eksport logistika tarmoqlarimiz xaritasi.
              </p>
            </div>
          </div>

          {/* Concept Card 2: Quality Sculpture */}
          <div className="bg-bg-secondary/20 border border-border rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center hover:border-accent transition-colors duration-300">
            <div className="w-full md:w-2/5 aspect-square rounded-2xl overflow-hidden border border-border shrink-0">
              <img
                src="/images/about/quality_sculpture.png"
                alt="Quality & Precision Standard"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <span className="text-[9px] font-bold tracking-[0.2em] text-accent uppercase block">
                Ishonch va Sifat
              </span>
              <h4 className="font-bold text-text-primary text-base sm:text-lg uppercase tracking-wide">
                Birinchi Sort Standarti
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Bizda faqatgina sertifikatlangan, eng qattiq sifat nazoratidan o'tgan birinchi sort materiallar taqdim etiladi. Yetkazib berishdagi xavfsizlik va sinmaslik kafolati bizning ustuvor vazifamizdir.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Direct CTA Banner */}
      <section className="max-w-[1240px] mx-auto px-6">
        <div className="bg-bg-secondary rounded-3xl p-8 md:p-12 border border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="font-sans font-medium text-lg sm:text-xl text-text-primary uppercase tracking-wider">
              Savollaringiz bormi?
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md">
              Mutaxassislarimizdan bepul maslahat oling va eng mos kafellarni tanlang.
            </p>
          </div>

          <Link
            href="/#contact"
            className="px-8 h-12 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/15"
          >
            <span>Maslahat olish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
