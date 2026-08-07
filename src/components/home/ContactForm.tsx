'use client';

import React, { useState } from 'react';
import { MdOutlineSend as Send, MdOutlineCall as Phone, MdOutlineLocationOn as MapPin, MdOutlineEmail as Mail, MdOutlineAccessTime as Clock, MdOutlineVerifiedUser as ShieldCheck, MdOutlineCheckCircle as CheckCircle2 } from 'react-icons/md';
import { SITE_CONFIG } from '../../constants/site';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !agreed) return;

    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setName('');
      setPhone('');
      setComment('');
      setAgreed(false);
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white w-full scroll-mt-24 relative overflow-hidden">
      {/* Abstract background grids */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="max-w-[1240px] mx-auto h-full px-6 grid grid-cols-12 divide-x divide-border-light/40">
          <div className="col-span-5 h-full"></div>
          <div className="col-span-7 h-full"></div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Info Column (Left 5 cols - High Contrast Luxury Dark Panel) */}
          <div className="lg:col-span-5 bg-[#1E1E1E] text-white/90 p-8 sm:p-10 rounded-xl flex flex-col justify-between gap-10 border border-white/5 shadow-xl relative overflow-hidden group">
            {/* Soft decorative background flare */}
            <div className="absolute -left-24 -top-24 w-48 h-48 rounded-full bg-accent/10 blur-3xl group-hover:bg-accent/15 transition-all duration-500" />
            
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <span className="text-[9px] font-bold tracking-[0.25em] text-accent uppercase block">
                  Bizning kontaktlarimiz
                </span>
                <h2 className="font-sans font-medium text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  Har doim aloqadamiz!
                </h2>
              </div>

              <div className="space-y-6 pt-4 text-xs sm:text-sm text-white/70 divide-y divide-white/5">
                {/* Address */}
                <div className="flex items-start gap-4 pt-0">
                  <div className="w-9 h-9 rounded-full bg-white/5 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase block">Manzil</span>
                    <a
                      href={SITE_CONFIG.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-accent transition-colors leading-relaxed block"
                    >
                      {SITE_CONFIG.address}
                    </a>
                    <p className="text-[10px] text-white/40">Mo'ljal: {SITE_CONFIG.landmarks}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 pt-6">
                  <div className="w-9 h-9 rounded-full bg-white/5 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase block">Telefon raqamlar</span>
                    <a
                      href={`tel:${SITE_CONFIG.phonePrimary.replace(/\s+/g, '')}`}
                      className="text-white hover:text-accent transition-colors block font-medium"
                    >
                      {SITE_CONFIG.phonePrimary}
                    </a>
                    <a
                      href={`tel:${SITE_CONFIG.phoneSecondary.replace(/\s+/g, '')}`}
                      className="text-white/70 hover:text-white transition-colors block font-medium"
                    >
                      {SITE_CONFIG.phoneSecondary}
                    </a>
                  </div>
                </div>

                {/* Email & WorkHours */}
                <div className="flex items-start gap-4 pt-6">
                  <div className="w-9 h-9 rounded-full bg-white/5 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase block">Ish vaqti</span>
                    <p className="text-white leading-relaxed font-medium">
                      {SITE_CONFIG.workHours}
                    </p>
                    <p className="text-[10px] text-white/40">{SITE_CONFIG.workDays}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom brand token */}
            <div className="pt-6 border-t border-white/5 relative z-10 flex items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Vodiy Kafel Savdo Uyi</span>
            </div>
          </div>

          {/* Form Column (Right 7 cols - Minimal White panel with Underlined inputs) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-8 space-y-2">
              <span className="text-[9px] font-bold tracking-[0.25em] text-accent uppercase block">
                Bepul konsultatsiya
              </span>
              <h3 className="font-sans font-medium text-xl sm:text-2xl text-text-primary uppercase">
                Murojaat qoldirish
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary max-w-lg leading-relaxed">
                Ma’lumotlaringizni qoldiring va tez orada operatorlarimiz aloqaga chiqib, sizga bepul konsultatsiya beradi.
              </p>
            </div>

            {success ? (
              <div className="p-8 bg-bg-secondary border border-border rounded-xl text-center py-12 transition-all">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-text-primary text-base mb-1.5 uppercase tracking-wide">Muvaffaqiyatli yuborildi!</h4>
                <p className="max-w-xs mx-auto text-text-secondary text-xs leading-relaxed">
                  Bizga murojaat qilganingiz uchun rahmat. Operatorlarimiz tez fursatda siz bilan bog'lanishadi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="flex flex-col border-b border-border/70 focus-within:border-accent transition-colors pb-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                      Ismingiz
                    </label>
                    <input
                      type="text"
                      placeholder="Masalan: Umar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-10 bg-transparent text-sm text-text-primary placeholder-text-muted/60 focus:outline-none w-full"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="flex flex-col border-b border-border/70 focus-within:border-accent transition-colors pb-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                      Telefon raqam
                    </label>
                    <div className="flex items-center w-full">
                      <span className="text-sm text-text-primary font-medium pr-1.5 shrink-0">
                        +998
                      </span>
                      <input
                        type="tel"
                        placeholder="90 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="flex-1 h-10 bg-transparent text-sm text-text-primary placeholder-text-muted/60 focus:outline-none w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="flex flex-col border-b border-border/70 focus-within:border-accent transition-colors pb-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                    Izohlar
                  </label>
                  <textarea
                    placeholder="Sizni qaysi turdagi kafel yoki keramogranit qiziqtirmoqda?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="p-0 bg-transparent text-sm text-text-primary placeholder-text-muted/60 focus:outline-none resize-none w-full pt-1"
                  />
                </div>

                {/* Agreement checkbox */}
                <label className="flex items-start gap-3 cursor-pointer py-1 select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 accent-accent rounded border-border"
                  />
                  <span className="text-[11px] text-text-secondary leading-relaxed">
                    Men maxfiylik siyosati shartlarini qabul qilaman va shaxsiy ma'lumotlarni qayta ishlashga roziman.
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !agreed}
                  className="w-full sm:w-auto px-10 h-12 bg-accent hover:bg-accent-hover disabled:bg-accent/40 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all shadow-md shadow-accent/15 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Yuborilmoqda...' : 'Murojaat yuborish'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
