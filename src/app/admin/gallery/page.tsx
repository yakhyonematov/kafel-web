'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, CheckCircle, Image as ImageIcon, Upload, Eye } from 'lucide-react';
import { productService } from '../../../services/product.service';
import { galleryService } from '../../../services/gallery.service';
import { uploadService } from '../../../services/upload.service';
import { Product, GalleryImage } from '../../../types';

export default function AdminGalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [roomType, setRoomType] = useState('Hammom');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load all products and gallery images
  async function loadData() {
    try {
      setLoading(true);
      const prodRes = await productService.getAdminProducts({ page: 1, limit: 100 });
      setProducts(prodRes.data);
      if (prodRes.data.length > 0 && !productId) {
        setProductId(prodRes.data[0].id);
      }

      // Collect all gallery images from loaded products
      const allImages: any[] = [];
      prodRes.data.forEach((p) => {
        if (p.galleryImages && p.galleryImages.length > 0) {
          p.galleryImages.forEach((img) => {
            allImages.push({
              ...img,
              productName: p.name,
              productCode: p.code,
            });
          });
        }
      });
      setGalleryImages(allImages);
    } catch (err) {
      console.error('Failed to load gallery data', err);
      setProducts([]);
      setGalleryImages([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setImageUrl('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop');
    setRoomType('Hammom');
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
      setImageUrl(res.url);
    } catch (err) {
      console.error('Image upload failed', err);
      setError('Rasm yuklashda xatolik yuz berdi! Standart rasm havolasi saqlandi.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !imageUrl) return;

    try {
      setError('');
      await galleryService.addGalleryImage(productId, imageUrl, roomType);
      setSuccessMsg('Galereyaga yangi rasm muvaffaqiyatli qo\'shildi!');
      setShowModal(false);
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to add gallery image', err);
      // Fallback mock addition
      const selectedProduct = products.find(p => p.id === productId);
      setGalleryImages([
        ...galleryImages,
        {
          id: Math.random().toString(),
          productId,
          productName: selectedProduct?.name || 'Mahsulot',
          productCode: selectedProduct?.code || 'Kod',
          imageUrl,
          roomType,
        }
      ]);
      setSuccessMsg('Rasm qo\'shildi (Lokal simulyatsiya).');
      setShowModal(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Haqiqatdan ham ushbu galereya rasmini o\'chirib tashlamoqchimisiz?')) return;
    try {
      await galleryService.deleteGalleryImage(id);
      setSuccessMsg('Rasm o\'chirildi.');
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Delete failed, local fallback deletion', err);
      setGalleryImages(galleryImages.filter((img) => img.id !== id));
      setSuccessMsg('Rasm o\'chirildi (lokal).');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-sans font-bold text-xl sm:text-2xl text-text-primary">
            Galereya Boshqaruvi
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Kafellar va keramogranitlarning xonalarda (hammom, oshxona, pol) qanday turishi haqidagi bitgan ishlar rasmlarini yuklash.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-11 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg px-5 shadow-lg shadow-accent/15 flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi rasm qo'shish</span>
        </button>
      </div>

      {/* Success alert */}
      {successMsg && (
        <div className="p-3.5 bg-success-light border border-success/20 rounded-xl text-success text-xs flex items-center gap-2 animate-fade-in shrink-0">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-12 text-text-secondary">Yuklanmoqda...</div>
      ) : galleryImages.length === 0 ? (
        <div className="text-center py-12 text-text-secondary bg-white rounded-2xl border border-border">
          Hozircha galereyada bitgan ishlar rasmlari mavjud emas. Yuqoridagi tugma orqali yangi rasm yuklang.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-bg-secondary overflow-hidden">
                <img
                  src={img.imageUrl}
                  alt={img.roomType || 'Galereya'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {img.roomType && (
                  <span className="absolute top-3 left-3 bg-bg-dark/80 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {img.roomType}
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                    Kodi: {img.productCode}
                  </span>
                  <h4 className="font-bold text-text-primary text-xs sm:text-sm leading-tight truncate">
                    {img.productName}
                  </h4>
                </div>
                <div className="flex justify-between items-center border-t border-border-light pt-3">
                  <a
                    href={img.imageUrl}
                    target="_blank"
                    className="text-xs text-accent hover:text-accent-hover font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ko'rish</span>
                  </a>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1 rounded-lg text-text-secondary hover:text-error transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Gallery Image Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-[460px] bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-2xl flex flex-col gap-5 animate-scale-up z-10">
            <div className="flex justify-between items-center border-b border-border pb-3 shrink-0">
              <h3 className="font-sans font-bold text-lg text-text-primary">
                Galereyaga rasm qo'shish
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-bg-secondary text-text-secondary hover:text-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-error-light border border-error/20 rounded-xl text-error text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Tegishli Mahsulot *
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 border border-border bg-white rounded-lg text-sm focus:outline-none"
                >
                  <option value="" disabled>Mahsulotni tanlang</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room type / Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Xona turi (Joylashuv)
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full h-11 px-3.5 border border-border bg-white rounded-lg text-sm focus:outline-none"
                >
                  <option value="Hammom">Hammom</option>
                  <option value="Oshxona">Oshxona</option>
                  <option value="Pol">Pol (Mehmonxona/Koridor)</option>
                  <option value="Tashqi fasad">Tashqi fasad / Devor</option>
                  <option value="Hovli / Tashqi">Hovli / Tashqi qismlar</option>
                </select>
              </div>

              {/* Image upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Rasm fayli (Rasm URL yoki kompyuterdan yuklash)
                </label>
                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Galereya"
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
                      placeholder="Rasm URL havolasi..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
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

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-11 border border-border rounded-lg text-xs font-bold text-text-secondary uppercase"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-11 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold uppercase"
                >
                  Yuklash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
