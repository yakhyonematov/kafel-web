'use client';

import React, { useState, useEffect } from 'react';
import { MdOutlineClose as X, MdOutlineDelete as Trash2, MdOutlineAdd as Plus, MdOutlineRemove as Minus, MdOutlineShoppingBag as ShoppingBag, MdOutlineArrowForward as ArrowRight } from 'react-icons/md';
import { useCartStore } from '../../store/useCartStore';
import { orderService } from '../../services/order.service';
import { formatPrice } from '../../lib/formatters';
import Link from 'next/link';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { getImageUrl } from '../../utils/image';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  useScrollLock(isOpen);
  useEscapeKey(isOpen, () => setIsOpen(false));

  // Listen to open event from other components
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-cart-drawer', handleOpen);
    return () => window.removeEventListener('open-cart-drawer', handleOpen);
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !name || !phone || !agreed) return;

    setIsOrdering(true);
    setOrderError('');

    try {
      await orderService.createOrder({
        customerName: name,
        phone: `+998${phone.replace(/\s+/g, '')}`,
        comment: comment || undefined,
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      });
      setOrderSuccess(true);
      clearCart();
      setName('');
      setPhone('');
      setComment('');
      setAgreed(false);
    } catch (err: any) {
      console.error('Order submission failed', err);
      const backendMsg = err?.response?.data?.message;
      setOrderError(
        (Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg) ||
          'Buyurtma yuborishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.'
      );
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="p-5 border-b border-border flex justify-between items-center bg-bg-secondary shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-text-primary uppercase tracking-tight text-sm sm:text-base">Savat</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-border text-text-secondary hover:text-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Single Scroll Container for items and checkout form */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {orderSuccess ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center gap-4 animate-fade-in my-auto">
              <div className="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-text-primary">Buyurtmangiz qabul qilindi!</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                Muvaffaqiyatli ro'yxatdan o'tdingiz. Mutaxassislarimiz buyurtmani tasdiqlash uchun tez orada siz bilan bog'lanishadi.
              </p>
              <button
                onClick={() => {
                  setOrderSuccess(false);
                  setIsOpen(false);
                }}
                className="mt-4 px-6 h-11 bg-accent text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-accent-hover transition-colors"
              >
                Xarid qilishda davom etish
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center gap-4 my-auto">
              <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted mb-2">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-text-primary">Savatda hech narsa yo'q...</h3>
              <p className="text-sm text-text-secondary">Ooops... Xarid qilishda davom etamizmi?</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/products';
                }}
                className="mt-2 px-6 h-11 bg-primary text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-primary-dark transition-colors"
              >
                Katalogga qaytish
              </button>
            </div>
          ) : (
            <div className="p-5 flex flex-col gap-6">
              {/* List of items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 border-b border-border-light pb-4 last:border-0 last:pb-0"
                  >
                    <img
                      src={getImageUrl(item.product.mainImage)}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-border shrink-0 bg-bg-secondary"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-text-primary text-xs sm:text-sm truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-text-muted hover:text-error transition-colors p-1"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] sm:text-xs text-text-secondary">Kod: {item.product.code}</p>
                        <p className="text-[10px] sm:text-xs text-text-muted">O'lcham: {item.product.size}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity control */}
                        <div className="flex items-center border border-border rounded-lg overflow-hidden h-7 sm:h-8">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 hover:bg-bg-secondary h-full flex items-center transition-colors text-text-secondary"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 sm:w-8 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 hover:bg-bg-secondary h-full flex items-center transition-colors text-text-secondary"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {/* Price */}
                        <span className="font-bold text-xs sm:text-sm text-accent">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Checkout Form inside the same scrollable container */}
              <div className="border-t border-border pt-6 mt-2 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-semibold text-text-secondary">Umumiy summa:</span>
                  <span className="font-bold text-base sm:text-lg text-primary">{formatPrice(getTotalPrice())}</span>
                </div>

                {/* Order form */}
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Ismingiz"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full h-11 px-3 border border-border bg-white rounded-lg text-sm placeholder-text-muted focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="flex items-center border border-border bg-white rounded-lg overflow-hidden h-11">
                    <span className="px-3 text-sm text-text-secondary font-medium border-r border-border bg-bg-secondary h-full flex items-center shrink-0">
                      +998
                    </span>
                    <input
                      type="tel"
                      placeholder="Telefon raqamingiz"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="flex-1 h-full px-3 text-sm placeholder-text-muted focus:outline-none w-full"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Izohlar..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                      className="w-full p-3 border border-border bg-white rounded-lg text-sm placeholder-text-muted focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer py-1 select-none">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      required
                      className="mt-1 w-4 h-4 accent-accent rounded"
                    />
                    <span className="text-xs text-text-secondary leading-relaxed">
                      Men Maxfiylik siyosati shartlarini qabul qilaman va shaxsiy ma'lumotlarni qayta ishlashga roziman
                    </span>
                  </label>

                  {orderError && (
                    <div className="p-3 bg-error-light border border-error/20 rounded-lg text-error text-xs">
                      {orderError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isOrdering || items.length === 0 || !agreed}
                    className="w-full h-12 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOrdering ? 'Yuborilmoqda...' : 'Ro\'yxatdan o\'tish'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
