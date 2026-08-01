'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Factory, Image, MapPin, Plus, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { productService } from '../../../services/product.service';
import { factoryService } from '../../../services/factory.service';
import { galleryService } from '../../../services/gallery.service';
import { Product, Factory as FactoryType } from '../../../types';
import { formatPrice } from '../../../lib/formatters';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    factories: 0,
    galleryImages: 0,
    branches: 1, // Static main showroom
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [prodRes, factories, recentRes] = await Promise.all([
          productService.getAdminProducts({ page: 1, limit: 1 }),
          factoryService.getFactories(),
          productService.getAdminProducts({ page: 1, limit: 5 }),
        ]);

        // Simple count from total metadata
        setStats({
          products: prodRes.meta.total,
          factories: factories.length,
          galleryImages: 0, // Fallback placeholder or load gallery
          branches: 1,
        });
        setRecentProducts(recentRes.data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
        setStats({
          products: 0,
          factories: 0,
          galleryImages: 0,
          branches: 1,
        });
        setRecentProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="flex flex-col gap-1">
        <h2 className="font-sans font-bold text-xl sm:text-2xl text-text-primary">
          Boshqaruv Paneli (Dashboard)
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary">
          Saytning umumiy faollik ko'rsatkichlari va boshqaruv qismlari.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-xs flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-accent-light/10 text-accent flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-success bg-success-light px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Aktiv</span>
            </span>
          </div>
          <div>
            <span className="text-xs text-text-secondary">Jami mahsulotlar</span>
            <p className="font-sans font-bold text-2xl text-text-primary mt-1">
              {loading ? '...' : stats.products} ta
            </p>
          </div>
        </div>

        {/* Total Factories */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-xs flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-accent-light/10 text-accent flex items-center justify-center shrink-0">
              <Factory className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs text-text-secondary">Hamkor zavodlar</span>
            <p className="font-sans font-bold text-2xl text-text-primary mt-1">
              {loading ? '...' : stats.factories} ta
            </p>
          </div>
        </div>

        {/* Gallery Images */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-xs flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-accent-light/10 text-accent flex items-center justify-center shrink-0">
              <Image className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs text-text-secondary">Galereya rasmlari</span>
            <p className="font-sans font-bold text-2xl text-text-primary mt-1">
              {loading ? '...' : stats.galleryImages} ta
            </p>
          </div>
        </div>

        {/* Showrooms */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-xs flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-accent-light/10 text-accent flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs text-text-secondary">Showroom filiallar</span>
            <p className="font-sans font-bold text-2xl text-text-primary mt-1">
              {stats.branches} ta
            </p>
          </div>
        </div>
      </div>

      {/* Action Shortcut Shortcuts */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          <span>Tezkor amallar</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/products?action=new"
            className="h-12 border border-border hover:border-accent bg-bg-secondary hover:bg-white rounded-xl flex items-center justify-between px-4 text-xs font-bold text-text-primary hover:text-accent transition-all"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" />
              <span>Yangi mahsulot</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin/factories?action=new"
            className="h-12 border border-border hover:border-accent bg-bg-secondary hover:bg-white rounded-xl flex items-center justify-between px-4 text-xs font-bold text-text-primary hover:text-accent transition-all"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" />
              <span>Yangi zavod</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin/gallery"
            className="h-12 border border-border hover:border-accent bg-bg-secondary hover:bg-white rounded-xl flex items-center justify-between px-4 text-xs font-bold text-text-primary hover:text-accent transition-all"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" />
              <span>Galereyaga rasm</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h3 className="font-bold text-sm text-text-primary">
            Yaqinda qo'shilgan mahsulotlar
          </h3>
          <Link
            href="/admin/products"
            className="text-xs text-accent hover:text-accent-hover font-semibold flex items-center gap-1"
          >
            <span>Barchasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-border-light">
                <th className="pb-3 font-semibold">Rasm</th>
                <th className="pb-3 font-semibold">Nom / Kod</th>
                <th className="pb-3 font-semibold">Zavod</th>
                <th className="pb-3 font-semibold text-right">Narxi</th>
                <th className="pb-3 font-semibold text-right">Zaxira</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-text-muted">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-text-muted">
                    Mahsulotlar mavjud emas
                  </td>
                </tr>
              ) : (
                recentProducts.map((p) => (
                  <tr key={p.id} className="text-text-primary hover:bg-bg-secondary/20">
                    <td className="py-3">
                      <img
                        src={p.mainImage}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-lg border border-border bg-bg-secondary"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-[10px] text-text-muted">Kod: {p.code} | {p.size}</p>
                    </td>
                    <td className="py-3 text-text-secondary">{p.factory?.name}</td>
                    <td className="py-3 text-right font-bold text-accent">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3 text-right font-semibold text-text-primary">
                      {p.stock} m²
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
