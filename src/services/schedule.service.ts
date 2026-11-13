import api from './api';

export const WEEKDAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];
export interface WorkDay { day: number; closed: boolean; opensAt: string; closesAt: string }
export interface SpecialDay { date: string; closed: boolean; opensAt: string; closesAt: string; note: string }
export interface WorkSchedule { weekly: WorkDay[]; exceptions: SpecialDay[] }
export const DEFAULT_SCHEDULE: WorkSchedule = {
  weekly: WEEKDAYS.map((_, day) => ({ day, closed: day === 6, opensAt: '08:00', closesAt: '17:00' })),
  exceptions: [],
};
export function validateSchedule(value: WorkSchedule): string | null {
  if (!value || !Array.isArray(value.weekly) || value.weekly.length !== 7 || !Array.isArray(value.exceptions)) return 'Jadval formati noto‘g‘ri.';
  const validTime = (s: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
  const validHours = (d: WorkDay | SpecialDay) => typeof d.closed === 'boolean' && (d.closed || (validTime(d.opensAt) && validTime(d.closesAt) && d.opensAt < d.closesAt));
  if (value.weekly.some((d, i) => d.day !== i || !validHours(d))) return 'Har bir ish kunida tugash vaqti boshlanish vaqtidan keyin bo‘lishi kerak.';
  if (value.exceptions.some(d => !/^\d{4}-\d{2}-\d{2}$/.test(d.date) || !Number.isFinite(Date.parse(d.date)) || new Date(d.date).toISOString().slice(0, 10) !== d.date || typeof d.note !== 'string' || !validHours(d))) return 'Maxsus sanalar va ish vaqtlarini to‘g‘ri kiriting.';
  if (new Set(value.exceptions.map(d => d.date)).size !== value.exceptions.length) return 'Bir sana faqat bir marta kiritilishi mumkin.';
  return null;
}
export const scheduleService = {
  async get(): Promise<WorkSchedule> {
    const { data } = await api.get<WorkSchedule>('/settings/work-schedule');
    if (validateSchedule(data)) throw new Error('Invalid work schedule');
    return data;
  },
  async save(schedule: WorkSchedule): Promise<void> {
    await api.put('/settings/work-schedule', schedule);
  },
};
