'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Phone, MessageSquare, Trash2 } from 'lucide-react';
import { orderService } from '../../../services/order.service';
import { Order, OrderStatus } from '../../../types';
import { formatPrice, formatDate } from '../../../lib/formatters';
import { getImageUrl } from '../../../utils/image';

const TABS: { label: string; value: OrderStatus }[] = [
  { label: 'Yangi', value: 'NEW' },
  { label: 'Qabul qilingan', value: 'ACCEPTED' },
];

interface CommentPopover {
  orderId: string;
  text: string;
  top: number;
  left: number;
}

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('NEW');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actingId, setActingId] = useState<string | null>(null);
  const [commentPopover, setCommentPopover] = useState<CommentPopover | null>(null);

  const loadOrders = useCallback(async (status: OrderStatus) => {
    try {
      setLoading(true);
      setError('');
      const data = await orderService.getOrders(status);
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to load orders', err);
      setError(
        err?.response?.data?.message || "Buyurtmalarni yuklab bo'lmadi. Sahifani yangilab ko'ring."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(activeTab);
    setCommentPopover(null);
  }, [activeTab, loadOrders]);

  const handleAccept = async (order: Order) => {
    try {
      setActingId(order.id);
      setError('');
      await orderService.acceptOrder(order.id);
      setSuccessMsg(`"${order.customerName}" buyurtmasi qabul qilindi.`);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Failed to accept order', err);
      if (err?.response?.status === 404) {
        setError(
          `"${order.customerName}" buyurtmasi allaqachon boshqa joyda ko'rib chiqilgan. Ro'yxat yangilandi.`
        );
        loadOrders(activeTab);
      } else {
        setError(err?.response?.data?.message || "Buyurtmani qabul qilishda xatolik yuz berdi.");
      }
      setTimeout(() => setError(''), 4000);
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (order: Order) => {
    if (!window.confirm(`"${order.customerName}" buyurtmasini o'chirib tashlamoqchimisiz?`)) return;
    try {
      setActingId(order.id);
      setError('');
      await orderService.deleteOrder(order.id);
      setSuccessMsg("Buyurtma o'chirildi.");
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setCommentPopover(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Failed to delete order', err);
      if (err?.response?.status === 404) {
        setError(`"${order.customerName}" buyurtmasi allaqachon o'chirilgan. Ro'yxat yangilandi.`);
        loadOrders(activeTab);
      } else {
        setError(err?.response?.data?.message || "Buyurtmani o'chirishda xatolik yuz berdi.");
      }
      setTimeout(() => setError(''), 4000);
    } finally {
      setActingId(null);
    }
  };

  const toggleComment = (order: Order, e: React.MouseEvent<HTMLButtonElement>) => {
    if (commentPopover?.orderId === order.id) {
      setCommentPopover(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const popoverWidth = 288;
    setCommentPopover({
      orderId: order.id,
      text: order.comment || '',
      top: rect.bottom + 8,
      left: Math.min(rect.left, window.innerWidth - popoverWidth - 16),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-sans font-bold text-xl sm:text-2xl text-text-primary">Buyurtmalar</h2>
        <p className="text-xs sm:text-sm text-text-secondary">
          Mijozlar savatdan bergan buyurtmalarni ko'rish va qabul qilish.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-success-light border border-success/20 rounded-xl text-success text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-error-light border border-error/20 rounded-xl text-error text-xs flex items-center gap-2 animate-fade-in">
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`h-10 px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === tab.value
                ? 'bg-accent border-accent text-white shadow-xs'
                : 'border-border bg-white hover:border-text-primary text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-border-light">
                <th className="pb-3 font-semibold">Mijoz</th>
                <th className="pb-3 font-semibold">Mahsulotlar</th>
                <th className="pb-3 font-semibold">Izoh</th>
                <th className="pb-3 font-semibold text-right">Summa</th>
                <th className="pb-3 font-semibold">Sana</th>
                <th className="pb-3 font-semibold text-center">Holat</th>
                <th className="pb-3 font-semibold text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-text-muted">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-text-muted">
                    {activeTab === 'NEW' ? "Hozircha yangi buyurtmalar yo'q" : "Qabul qilingan buyurtmalar yo'q"}
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const firstItem = order.items[0];
                  const extraCount = order.items.length - 1;
                  return (
                    <tr key={order.id} className="text-text-primary hover:bg-bg-secondary/10 align-top">
                      {/* Customer */}
                      <td className="py-3 pr-4">
                        <p className="font-semibold">{order.customerName}</p>
                        <a
                          href={`tel:${order.phone}`}
                          className="text-[10px] text-text-secondary hover:text-accent flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{order.phone}</span>
                        </a>
                      </td>

                      {/* Products */}
                      <td className="py-3 pr-4 max-w-[200px]">
                        {firstItem && (
                          <div className="flex items-center gap-2">
                            <img
                              src={getImageUrl(firstItem.product.mainImage)}
                              alt={firstItem.product.name}
                              className="w-9 h-9 object-cover rounded-lg border border-border bg-bg-secondary shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-text-primary">{firstItem.product.name}</p>
                              <p className="text-[10px] text-text-muted">
                                {firstItem.quantity} dona
                                {extraCount > 0 ? ` · +${extraCount} ta yana` : ''}
                              </p>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Comment (one line + icon to view full) */}
                      <td className="py-3 pr-4 max-w-[160px]">
                        {order.comment ? (
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-text-secondary">{order.comment}</span>
                            <button
                              onClick={(e) => toggleComment(order, e)}
                              title="To'liq izohni ko'rish"
                              className={`shrink-0 p-1 rounded-md transition-colors ${
                                commentPopover?.orderId === order.id
                                  ? 'text-accent bg-accent-light/20'
                                  : 'text-text-muted hover:text-accent hover:bg-bg-secondary'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-3 pr-4 text-right font-bold text-accent whitespace-nowrap">
                        {formatPrice(order.totalPrice)}
                      </td>

                      {/* Date */}
                      <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="py-3 pr-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${
                            order.status === 'NEW'
                              ? 'bg-warning-light text-warning'
                              : 'bg-success-light text-success'
                          }`}
                        >
                          {order.status === 'NEW' ? 'Yangi' : 'Qabul qilingan'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          {order.status === 'NEW' && (
                            <button
                              onClick={() => handleAccept(order)}
                              disabled={actingId === order.id}
                              className="h-8 px-3 bg-accent hover:bg-accent-hover text-white text-[10px] font-bold uppercase tracking-wider rounded-lg disabled:opacity-50 flex items-center gap-1 whitespace-nowrap"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Qabul qilish</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(order)}
                            disabled={actingId === order.id}
                            title="O'chirish"
                            className="h-8 w-8 rounded-lg border border-border hover:bg-bg-secondary text-text-secondary hover:text-error transition-colors flex items-center justify-center disabled:opacity-50 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full-comment popover, positioned at the clicked icon's location */}
      {commentPopover && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setCommentPopover(null)} />
          <div
            className="fixed z-50 w-72 bg-white border border-border rounded-xl shadow-2xl p-4 text-xs text-text-primary leading-relaxed animate-fade-in"
            style={{ top: commentPopover.top, left: commentPopover.left }}
          >
            <p className="font-bold text-[10px] uppercase tracking-wider text-text-muted mb-2">Mijoz izohi</p>
            <p>{commentPopover.text}</p>
          </div>
        </>
      )}
    </div>
  );
}
