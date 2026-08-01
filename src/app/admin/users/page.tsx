'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, X, CheckCircle, ShieldCheck, UserCog, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/useAuthStore';
import { User, Role } from '../../../types';
import { formatDate } from '../../../lib/formatters';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useEscapeKey } from '../../../hooks/useEscapeKey';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();

  // Only ADMIN may reach this page — MANAGER gets redirected, backend enforces the real guard
  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') {
      router.replace('/admin/dashboard');
    }
  }, [currentUser, router]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal / form state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('MANAGER');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useScrollLock(showModal);
  useEscapeKey(showModal, () => setShowModal(false));

  async function loadUsers() {
    try {
      setLoading(true);
      setError('');
      const data = await authService.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users', err);
      setError(
        err.response?.data?.message ||
          "Xodimlar ro'yxatini yuklab bo'lmadi. Iltimos sahifani yangilang."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const openAddModal = () => {
    setName('');
    setUsername('');
    setPassword('');
    setRole('MANAGER');
    setFormError('');
    setShowPassword(false);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !password) {
      setFormError("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      await authService.register(username, password, name, role);
      setSuccessMsg(
        role === 'MANAGER'
          ? "Yangi menejer muvaffaqiyatli qo'shildi!"
          : "Yangi admin muvaffaqiyatli qo'shildi!"
      );
      setShowModal(false);
      loadUsers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Failed to create user', err);
      setFormError(
        err.response?.data?.message ||
          'Xatolik yuz berdi. Login band bo\'lishi mumkin, boshqa login bilan urinib ko\'ring.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (u: User) => {
    if (u.id === currentUser?.id) return;
    if (!window.confirm(`Haqiqatdan ham "${u.name}" (${u.username}) hisobini o'chirib tashlamoqchimisiz?`)) return;

    try {
      await authService.deleteUser(u.id);
      setSuccessMsg("Xodim tizimdan o'chirildi.");
      loadUsers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Failed to delete user', err);
      setError(
        err.response?.data?.message || "Xodimni o'chirib bo'lmadi. Qaytadan urinib ko'ring."
      );
      setTimeout(() => setError(''), 4000);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-sans font-bold text-xl sm:text-2xl text-text-primary">
            Xodimlar (Admin / Menejerlar)
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Boshqaruv paneliga kirish huquqiga ega xodimlarni qo'shish va boshqarish.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-11 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg px-5 shadow-lg shadow-accent/15 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi xodim</span>
        </button>
      </div>

      {/* Success alert */}
      {successMsg && (
        <div className="p-3.5 bg-success-light border border-success/20 rounded-xl text-success text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-3.5 bg-error-light border border-error/20 rounded-xl text-error text-xs flex items-center gap-2 animate-fade-in">
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Search and Table */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Ism yoki login bo'yicha qidirish..."
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
                <th className="pb-3 font-semibold">Ism</th>
                <th className="pb-3 font-semibold">Login (Username)</th>
                <th className="pb-3 font-semibold">Rol</th>
                <th className="pb-3 font-semibold">Qo'shilgan sana</th>
                <th className="pb-3 font-semibold text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-text-muted">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-text-muted">
                    Xodimlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="text-text-primary hover:bg-bg-secondary/10">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-accent-light/10 text-accent flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold">
                          {u.name}
                          {u.id === currentUser?.id && (
                            <span className="ml-2 text-[10px] text-text-muted font-normal">(Siz)</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">{u.username}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          u.role === 'ADMIN'
                            ? 'bg-accent-light/15 text-accent'
                            : 'bg-bg-secondary text-text-secondary border border-border'
                        }`}
                      >
                        {u.role === 'ADMIN' ? <ShieldCheck className="w-3 h-3" /> : <UserCog className="w-3 h-3" />}
                        <span>{u.role === 'ADMIN' ? 'Admin' : 'Menejer'}</span>
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">
                      {u.createdAt ? formatDate(u.createdAt) : '-'}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={u.id === currentUser?.id}
                        title={u.id === currentUser?.id ? "O'zingizni o'chira olmaysiz" : "O'chirish"}
                        className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-error transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-[460px] bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-2xl flex flex-col gap-5 animate-scale-up">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-sans font-bold text-lg text-text-primary">
                Yangi xodim qo'shish
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-bg-secondary text-text-secondary hover:text-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-error-light border border-error/20 rounded-xl text-error text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  To'liq ismi *
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Aziz Karimov"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Login (Username) *
                </label>
                <input
                  type="text"
                  placeholder="Masalan: aziz.manager"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full h-11 px-3.5 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Parol * (kamida 6 belgi)
                </label>
                <div className="relative flex items-center border border-border rounded-lg focus-within:border-accent">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Vaqtinchalik parol"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full h-11 pl-3.5 pr-10 text-sm focus:outline-none rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-text-muted hover:text-accent transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Roli *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('MANAGER')}
                    className={`h-11 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all flex items-center justify-center gap-1.5 ${
                      role === 'MANAGER'
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-text-primary border-border hover:bg-bg-secondary'
                    }`}
                  >
                    <UserCog className="w-4 h-4" />
                    <span>Menejer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ADMIN')}
                    className={`h-11 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all flex items-center justify-center gap-1.5 ${
                      role === 'ADMIN'
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-text-primary border-border hover:bg-bg-secondary'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin</span>
                  </button>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed pt-1">
                  Menejer mahsulot, zavod va galereyani boshqara oladi. Admin qo'shimcha ravishda
                  xodimlarni ham boshqara oladi.
                </p>
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
