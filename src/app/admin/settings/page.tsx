'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_SCHEDULE, scheduleService, validateSchedule, WEEKDAYS, WorkSchedule } from '@/services/schedule.service';

export default function SettingsPage() {
  const [schedule, setSchedule] = useState<WorkSchedule>(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const load = async () => {
    setLoading(true); setMessage('');
    try { setSchedule(await scheduleService.get()); setFailed(false); }
    catch { setFailed(true); setMessage('Serverdan jadval olinmadi. Quyida boshlang‘ich jadval ko‘rsatilgan. Server ulangach qayta yuklang yoki jadvalni saqlang.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateSchedule(schedule);
    if (error) { setMessage(error); return; }
    setSaving(true); setMessage('');
    try { await scheduleService.save(schedule); setFailed(false); setMessage('Ish jadvali serverda saqlandi.'); }
    catch { setMessage('Saqlanmadi. Server ulanishi va ruxsatlaringizni tekshirib, qayta urinib ko‘ring.'); }
    finally { setSaving(false); }
  };
  const inputClass = 'rounded-lg border border-border bg-white px-3 py-2 text-sm disabled:opacity-40';
  return <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
    <div><h1 className="text-2xl font-bold">Ish va dam olish jadvali</h1><p className="text-sm text-text-secondary mt-2">Haftalik ish vaqtlarini va bayram yoki boshqa maxsus kunlar jadvalini belgilang.</p></div>
    {message && <div role="status" className="rounded-xl border border-border bg-white p-4 text-sm">{message}</div>}
    {failed && <button type="button" onClick={() => void load()} disabled={loading || saving} className="text-accent underline">Qayta yuklash</button>}
    {loading ? <p>Yuklanmoqda...</p> : <form onSubmit={save} className="space-y-6">
      <fieldset disabled={saving} className="space-y-4 disabled:opacity-60">
        <div className="bg-white border border-border rounded-xl p-4 md:p-6 space-y-4">
          <h2 className="font-bold">Haftalik jadval</h2>
          {schedule.weekly.map((day, i) => <div key={day.day} className="flex flex-wrap items-center gap-3 border-b border-border pb-4 last:border-0">
            <span className="w-24 text-sm font-medium">{WEEKDAYS[day.day]}</span>
            <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={day.closed} onChange={e => setSchedule({ ...schedule, weekly: schedule.weekly.map((d, j) => j === i ? { ...d, closed: e.target.checked } : d) })} />Dam olish</label>
            <div className="flex items-center gap-2"><input aria-label={`${WEEKDAYS[day.day]} boshlanish vaqti`} className={inputClass} type="time" required={!day.closed} disabled={day.closed} value={day.opensAt} onChange={e => setSchedule({ ...schedule, weekly: schedule.weekly.map((d, j) => j === i ? { ...d, opensAt: e.target.value } : d) })} /><span>–</span><input aria-label={`${WEEKDAYS[day.day]} tugash vaqti`} className={inputClass} type="time" required={!day.closed} disabled={day.closed} value={day.closesAt} onChange={e => setSchedule({ ...schedule, weekly: schedule.weekly.map((d, j) => j === i ? { ...d, closesAt: e.target.value } : d) })} /></div>
          </div>)}
        </div>
        <div className="bg-white border border-border rounded-xl p-4 md:p-6 space-y-4">
          <h2 className="font-bold">Maxsus sanalar</h2><p className="text-sm text-text-secondary">Ushbu sanalardagi jadval haftalik jadval o‘rniga amal qiladi.</p>
          {schedule.exceptions.map((day, i) => {
            const update = (patch: Partial<typeof day>) => setSchedule({ ...schedule, exceptions: schedule.exceptions.map((d, j) => j === i ? { ...d, ...patch } : d) });
            return <div key={i} className="flex flex-wrap items-center gap-3 border border-border p-3 rounded-lg">
              <input aria-label="Maxsus sana" type="date" required className={inputClass} value={day.date} onChange={e => update({ date: e.target.value })} />
              <label className="flex gap-2 text-sm"><input type="checkbox" checked={day.closed} onChange={e => update({ closed: e.target.checked })} />Dam olish</label>
              <input aria-label="Maxsus kun boshlanish vaqti" type="time" className={inputClass} disabled={day.closed} required={!day.closed} value={day.opensAt} onChange={e => update({ opensAt: e.target.value })} />
              <input aria-label="Maxsus kun tugash vaqti" type="time" className={inputClass} disabled={day.closed} required={!day.closed} value={day.closesAt} onChange={e => update({ closesAt: e.target.value })} />
              <input aria-label="Izoh" placeholder="Izoh (ixtiyoriy)" maxLength={200} className={`${inputClass} min-w-0 flex-1`} value={day.note} onChange={e => update({ note: e.target.value })} />
              <button type="button" className="text-red-600 text-sm" onClick={() => setSchedule({ ...schedule, exceptions: schedule.exceptions.filter((_, j) => i !== j) })}>O‘chirish</button>
            </div>;
          })}
          <button type="button" className="text-accent text-sm font-semibold" onClick={() => setSchedule({ ...schedule, exceptions: [...schedule.exceptions, { date: '', closed: true, opensAt: '08:00', closesAt: '17:00', note: '' }] })}>+ Maxsus sana qo‘shish</button>
        </div>
        <button type="submit" className="rounded-lg bg-accent px-6 py-3 text-white font-semibold">{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
      </fieldset>
    </form>}
  </div>;
}
