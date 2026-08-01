'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, X, CheckCircle, Image as ImageIcon, Upload, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { productService } from '../../../services/product.service';
import { factoryService } from '../../../services/factory.service';
import { uploadService } from '../../../services/upload.service';
import { Product, Factory, SurfaceType } from '../../../types';
import { formatPrice, formatSurface } from '../../../lib/formatters';

function AdminProductsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [factoryId, setFactoryId] = useState('');
  const [size, setSize] = useState('60x60 cm');
  const [thickness, setThickness] = useState('9 mm');
  const [color, setColor] = useState('');
  const [surface, setSurface] = useState<SurfaceType>('MATTE');
  const [usage, setUsage] = useState('Pol uchun');
  const [boxSize, setBoxSize] = useState<number>(1.44);
  const [price, setPrice] = useState<number>(49900);
  const [stock, setStock] = useState<number>(100);
  const [isActive, setIsActive] = useState(true);
  const [mainImage, setMainImage] = useState('');

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Lock background scroll while the modal is open, and reset the modal's own
  // scroll position so a long previous form doesn't leave you scrolled down.
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      modalContentRef.current?.scrollTo({ top: 0 });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  // Load data
  async function loadData() {
    try {
      setLoading(true);
      const [prodRes, factoryData] = await Promise.all([
        productService.getAdminProducts({ page, limit, search }),
        factoryService.getFactories(),
      ]);

      setProducts(prodRes.data);
      setTotalProducts(prodRes.meta.total);
      setTotalPages(prodRes.meta.totalPages);
      setFactories(factoryData);
      
      if (factoryData.length > 0 && !factoryId) {
        setFactoryId(factoryData[0].id);
      }
    } catch (err) {
      console.error('Failed to load products/factories', err);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [page, search]);

  // Open modal if action=new in URL
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal();
      // Clear query params
      router.replace('/admin/products');
    }
  }, [searchParams]);

  const openAddModal = () => {
    setEditingId(null);
    setCode('');
    setName('');
    if (factories.length > 0) setFactoryId(factories[0].id);
    setSize('60x60 cm');
    setThickness('9 mm');
    setColor('');
    setSurface('MATTE');
    setUsage('Pol uchun');
    setBoxSize(1.44);
    setPrice(49900);
    setStock(100);
    setIsActive(true);
    setMainImage('https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop');
    setError('');
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setCode(p.code);
    setName(p.name);
    setFactoryId(p.factoryId);
    setSize(p.size);
    setThickness(p.thickness);
    setColor(p.color);
    setSurface(p.surface);
    setUsage(p.usage);
    setBoxSize(p.boxSize);
    setPrice(p.price);
    setStock(p.stock);
    setIsActive(p.isActive);
    setMainImage(p.mainImage);
    setError('');
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const res = await uploadService.uploadImage(file);
      setMainImage(res.url);
    } catch (err: any) {
      console.error('Image upload failed', err);
      setError('Rasm yuklashda xatolik yuz berdi! Standart url saqlab qolindi.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !factoryId) {
      setError('Iltimos, barcha majburiy maydonlarni to\'ldiring.');
      return;
    }

    const payload = {
      code,
      name,
      factoryId,
      size,
      thickness,
      color,
      surface,
      usage,
      boxSize: Number(boxSize),
      price: Number(price),
      stock: Number(stock),
      isActive,
      mainImage,
    };

    try {
      setSubmitting(true);
      setError('');
      if (editingId) {
        await productService.updateProduct(editingId, payload);
        setSuccessMsg('Mahsulot muvaffaqiyatli yangilandi!');
      } else {
        await productService.createProduct(payload);
        setSuccessMsg('Yangi mahsulot muvaffaqiyatli qo\'shildi!');
      }
      setShowModal(false);
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Save failed', err);
      const backendMsg = err?.response?.data?.message;
      setError(
        (Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg) ||
          'Saqlashda xatolik yuz berdi. Maydonlarni tekshirib, qaytadan urinib ko\'ring.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Haqiqatdan ham ushbu mahsulotni o\'chirib tashlamoqchimisiz?')) return;
    try {
      setError('');
      await productService.deleteProduct(id);
      setSuccessMsg('Mahsulot o\'chirib tashlandi.');
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Delete failed', err);
      const backendMsg = err?.response?.data?.message;
      setError(
        (Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg) ||
          "Mahsulotni o'chirishda xatolik yuz berdi."
      );
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleToggleStatus = async (p: Product) => {
    try {
      setError('');
      await productService.updateProduct(p.id, { isActive: !p.isActive });
      setProducts(products.map(item => item.id === p.id ? { ...item, isActive: !p.isActive } : item));
    } catch (err: any) {
      console.error('Toggle status failed', err);
      const backendMsg = err?.response?.data?.message;
      setError(
        (Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg) ||
          "Holatni yangilashda xatolik yuz berdi."
      );
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-sans font-bold text-xl sm:text-2xl text-text-primary">
            Mahsulotlar Ombori
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Kafellar va keramogranitlarni boshqarish, tahrirlash va yangisini qo'shish.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-11 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg px-5 shadow-lg shadow-accent/15 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi mahsulot</span>
        </button>
      </div>

      {/* Success alert */}
      {successMsg && (
        <div className="p-3.5 bg-success-light border border-success/20 rounded-xl text-success text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Page-level error alert (delete / status toggle failures — form errors show inside the modal) */}
      {error && !showModal && (
        <div className="p-3.5 bg-error-light border border-error/20 rounded-xl text-error text-xs flex items-center gap-2 animate-fade-in">
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Search and Table */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Nom yoki kod bo'yicha qidirish..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-11 pl-4 pr-10 border border-border rounded-lg text-sm placeholder-text-muted focus:outline-none focus:border-accent bg-bg-secondary/40"
          />
          <Search className="w-4 h-4 text-text-muted absolute right-3.5 top-3.5" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-border-light">
                <th className="pb-3 font-semibold">Rasm</th>
                <th className="pb-3 font-semibold">Nom / Kod</th>
                <th className="pb-3 font-semibold">Zavod</th>
                <th className="pb-3 font-semibold">Yuzasi / O'lcham</th>
                <th className="pb-3 font-semibold text-right">Narxi</th>
                <th className="pb-3 font-semibold text-right">Zaxira</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-text-muted">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-text-muted">
                    Mahsulotlar topilmadi
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="text-text-primary hover:bg-bg-secondary/10">
                    <td className="py-3">
                      <img
                        src={p.mainImage}
                        alt={p.name}
                        className="w-11 h-11 object-cover rounded-lg border border-border bg-bg-secondary"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-[10px] text-text-muted">Kod: {p.code}</p>
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">{p.factory?.name || 'Kiritilmagan'}</td>
                    <td className="py-3 pr-4">
                      <p className="text-text-primary font-medium">{formatSurface(p.surface)}</p>
                      <p className="text-[10px] text-text-secondary">O'lcham: {p.size}</p>
                    </td>
                    <td className="py-3 text-right font-bold text-accent">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3 text-right font-semibold">
                      {p.stock} m²
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`p-1.5 transition-colors ${
                          p.isActive ? 'text-success' : 'text-text-muted'
                        }`}
                        title={p.isActive ? 'Faollikni o\'chirish' : 'Faollashtirish'}
                      >
                        {p.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/products/${p.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-accent transition-colors"
                          title="Ko'rish"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-accent transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-error transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 pt-4 border-t border-border-light">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 h-9 rounded-lg border border-border text-xs text-text-secondary disabled:opacity-40"
            >
              Oldingi
            </button>
            <span className="px-3 h-9 flex items-center justify-center text-xs font-semibold text-text-secondary">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 h-9 rounded-lg border border-border text-xs text-text-secondary disabled:opacity-40"
            >
              Keyingi
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <div
            ref={modalContentRef}
            className="relative w-full max-w-[640px] bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-2xl flex flex-col gap-5 my-8 animate-scale-up z-10 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-border pb-3 shrink-0">
              <h3 className="font-sans font-bold text-lg text-text-primary">
                {editingId ? 'Mahsulot ma\'lumotlarini tahrirlash' : 'Yangi mahsulot qo\'shish'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-bg-secondary text-text-secondary hover:text-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-error-light border border-error/20 rounded-xl text-error text-xs shrink-0">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    Mahsulot nomi *
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: H 01015 Matoviy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 border border-border rounded-lg text-sm"
                  />
                </div>

                {/* Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    Mahsulot kodi (Artikul) *
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: H01015"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 border border-border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Factory */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    Zavod *
                  </label>
                  <select
                    value={factoryId}
                    onChange={(e) => setFactoryId(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 border border-border bg-white rounded-lg text-sm focus:outline-none"
                  >
                    <option value="" disabled>Zavodni tanlang</option>
                    {factories.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    Rangi (Color) *
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Marmar oq, Och ko'k"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 border border-border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Size */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    O'lchami *
                  </label>
                  <input
                    type="text"
                    placeholder="60x60 cm"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 border border-border rounded-lg text-sm"
                  />
                </div>

                {/* Thickness */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    Qalinligi *
                  </label>
                  <input
                    type="text"
                    placeholder="9 mm"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 border border-border rounded-lg text-sm"
                  />
                </div>

                {/* Surface */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    Yuzasi (Sirt turi)
                  </label>
                  <select
                    value={surface}
                    onChange={(e) => setSurface(e.target.value as SurfaceType)}
                    className="w-full h-11 px-3.5 border border-border bg-white rounded-lg text-sm focus:outline-none"
                  >
                    <option value="MATTE">Matoviy (Matte)</option>
                    <option value="GLOSSY">Glyanseviy (Glossy)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Usage */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    Qo'llanilishi (Xona) *
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Pol uchun, Hammom devori"
                    value={usage}
                    onChange={(e) => setUsage(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 border border-border rounded-lg text-sm"
                  />
                </div>

                {/* Box Size */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    Quti hajmi (m² per box) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="1.44"
                    value={boxSize}
                    onChange={(e) => setBoxSize(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3.5 border border-border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    Narxi (1 m² uchun UZS) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="49900"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3.5 border border-border rounded-lg text-sm"
                  />
                </div>

                {/* Stock */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    Zaxira miqdori (m² omborda) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="500"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3.5 border border-border rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Mahsulot rasmi (Rasm URL yoki fayl yuklash) *
                </label>
                <div className="flex items-center gap-3">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt="Yuklangan rasm"
                      className="w-16 h-16 object-cover rounded-xl border border-border bg-bg-secondary shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-border flex items-center justify-center text-text-secondary bg-bg-secondary shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Rasm URL manzili..."
                      value={mainImage}
                      onChange={(e) => setMainImage(e.target.value)}
                      required
                      className="w-full h-10 px-3 border border-border rounded-lg text-xs"
                    />

                    <label className="inline-flex items-center gap-2 px-4 h-9 bg-bg-secondary hover:bg-border rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-border text-text-primary">
                      <Upload className="w-3.5 h-3.5 text-accent" />
                      <span>{uploading ? 'Yuklanmoqda...' : 'Kompyuterdan yuklash'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="h-11 border border-border rounded-lg text-xs font-bold text-text-secondary uppercase disabled:opacity-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-11 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold uppercase disabled:opacity-60"
                >
                  {submitting ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-text-secondary">Yuklanmoqda...</div>}>
      <AdminProductsCatalogContent />
    </Suspense>
  );
}
