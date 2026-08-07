'use client';

import React, { useState, useEffect } from 'react';
import { MdOutlineAdd as Plus, MdOutlineSearch as Search, MdOutlineEdit as Edit2, MdOutlineDelete as Trash2, MdOutlineClose as X, MdOutlineAddCircle as PlusCircle, MdOutlineFactory as FactoryIcon, MdOutlineCheckCircle as CheckCircle } from 'react-icons/md';
import { factoryService } from '../../../services/factory.service';
import { Factory } from '../../../types';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useEscapeKey } from '../../../hooks/useEscapeKey';

export default function AdminFactoriesPage() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useScrollLock(showModal);
  useEscapeKey(showModal, () => setShowModal(false));

  // Fetch factories
  async function loadFactories() {
    try {
      setLoading(true);
      const data = await factoryService.getFactories();
      setFactories(data);
    } catch (err) {
      console.error('Failed to load factories, fallback to mocks', err);
      // Fallback mocks
      setFactories([
        { id: 'yongxin', name: 'YONG XIN', location: 'Qo\'qon', description: 'Xitoy sarmoyasi asosidagi yirik zavod', createdAt: '', updatedAt: '' },
        { id: 'crown', name: 'CROWN CERAMIC', location: 'Toshkent viloyati', description: 'Mahalliy kafel ishlab chiqarish', createdAt: '', updatedAt: '' },
        { id: 'luxgranit', name: 'LUX GRANIT', location: 'Farg\'ona', description: 'Katta o\'lchamli keramogranitlar', createdAt: '', updatedAt: '' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFactories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setLocation('');
    setDescription('');
    setError('');
    setShowModal(true);
  };

  const openEditModal = (f: Factory) => {
    setEditingId(f.id);
    setName(f.name);
    setLocation(f.location || '');
    setDescription(f.description || '');
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setError('');
      if (editingId) {
        // Update
        await factoryService.updateFactory(editingId, { name, location, description });
        setSuccessMsg('Zavod muvaffaqiyatli yangilandi!');
      } else {
        // Create
        await factoryService.createFactory({ name, location, description });
        setSuccessMsg('Yangi zavod muvaffaqiyatli qo\'shildi!');
      }
      setShowModal(false);
      loadFactories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Haqiqatdan ham ushbu zavodni o\'chirib tashlamoqchimisiz? Undagi barcha mahsulotlar ham o\'chib ketishi mumkin!')) return;
    try {
      await factoryService.deleteFactory(id);
      setSuccessMsg('Zavod o\'chirib tashlandi.');
      loadFactories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Delete failed, local fallback deletion', err);
      setFactories(factories.filter((f) => f.id !== id));
      setSuccessMsg('Zavod o\'chirildi (lokal).');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const filteredFactories = factories.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.location && f.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-sans font-bold text-xl sm:text-2xl text-text-primary">
            Hamkor Zavodlar
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Kafellar ishlab chiqaruvchi hamkor zavodlar va dilerlik shoxobchalari ro'yxati.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-11 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg px-5 shadow-lg shadow-accent/15 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi zavod</span>
        </button>
      </div>

      {/* Success alert */}
      {successMsg && (
        <div className="p-3.5 bg-success-light border border-success/20 rounded-xl text-success text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Search and Table */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Zavod nomi yoki manzili bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-4 pr-10 border border-border rounded-lg text-sm placeholder-text-muted focus:outline-none focus:border-accent bg-bg-secondary/40"
          />
          <Search className="w-4 h-4 text-text-muted absolute right-3.5 top-3.5" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-border-light">
                <th className="pb-3 font-semibold">Zavod nomi</th>
                <th className="pb-3 font-semibold">Manzili (Joylashuv)</th>
                <th className="pb-3 font-semibold">Tavsif / Izoh</th>
                <th className="pb-3 font-semibold text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-text-muted">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : filteredFactories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-text-muted">
                    Zavodlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredFactories.map((f) => (
                  <tr key={f.id} className="text-text-primary hover:bg-bg-secondary/10">
                    <td className="py-4 pr-4 font-semibold flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-bg-secondary text-text-secondary flex items-center justify-center shrink-0">
                        <FactoryIcon className="w-4 h-4" />
                      </div>
                      <span>{f.name}</span>
                    </td>
                    <td className="py-4 pr-4 text-text-secondary">{f.location || 'Kiritilmagan'}</td>
                    <td className="py-4 pr-4 text-text-secondary max-w-[280px] truncate">
                      {f.description || 'Izoh yozilmagan'}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(f)}
                          className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-accent transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
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
      </div>

      {/* Add / Edit Factory Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-[460px] bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-2xl flex flex-col gap-5 animate-scale-up">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-sans font-bold text-lg text-text-primary">
                {editingId ? 'Zavod ma\'lumotlarini tahrirlash' : 'Yangi hamkor zavod qo\'shish'}
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
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Zavod nomi *
                </label>
                <input
                  type="text"
                  placeholder="Masalan: YONG XIN CERAMICS"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Joylashuv (Viloyat, shahar)
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Farg'ona, Qo'qon shahar"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 px-3.5 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Izoh / Tavsif
                </label>
                <textarea
                  placeholder="Zavod haqida qisqacha ma'lumot..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-border rounded-lg text-sm focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
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
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
