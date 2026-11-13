'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_SCHEDULE, scheduleService, WEEKDAYS } from '@/services/schedule.service';

const ScheduleContext = createContext(DEFAULT_SCHEDULE);
export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  useEffect(() => { let active = true; scheduleService.get().then(data => { if (active) setSchedule(data); }).catch(() => {}); return () => { active = false; }; }, []);
  return <ScheduleContext.Provider value={schedule}>{children}</ScheduleContext.Provider>;
}
export default function WorkHours({ compact = false }: { compact?: boolean }) {
  const schedule = useContext(ScheduleContext);
  if (compact) {
    const openDays = schedule.weekly.filter(d => !d.closed);
    const hours = [...new Set(openDays.map(d => `${d.opensAt}–${d.closesAt}`))];
    const summary = openDays.length === 0 ? 'Dam olish' : hours.length === 1 ? hours[0] : 'Kunlarga qarab';
    return <span>Ish vaqti: {summary} · <a href="/#contact" className="hover:underline">To‘liq jadval</a></span>;
  }
  return <div className="space-y-1 text-xs normal-case tracking-normal font-normal">
    {schedule.weekly.map(d => <div key={d.day} className="flex justify-between gap-4"><span>{WEEKDAYS[d.day]}</span><span>{d.closed ? 'Dam olish' : `${d.opensAt} – ${d.closesAt}`}</span></div>)}
    {schedule.exceptions.length > 0 && <p className="pt-2 font-semibold">Maxsus kunlar</p>}
    {schedule.exceptions.map(d => <div key={d.date}><span>{d.date.split('-').reverse().join('.')} — {d.closed ? 'Dam olish' : `${d.opensAt} – ${d.closesAt}`}</span>{d.note && <span> ({d.note})</span>}</div>)}
  </div>;
}
