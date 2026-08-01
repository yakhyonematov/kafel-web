import { create } from 'zustand';
import { SurfaceType } from '../types';

interface FilterState {
  factoryId: string;
  surface: SurfaceType | '';
  usage: string;
  search: string;
  page: number;
  limit: number;
  setFactoryId: (id: string) => void;
  setSurface: (surface: SurfaceType | '') => void;
  setUsage: (usage: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  factoryId: '',
  surface: '',
  usage: '',
  search: '',
  page: 1,
  limit: 12,
  setFactoryId: (factoryId) => set({ factoryId, page: 1 }),
  setSurface: (surface) => set({ surface, page: 1 }),
  setUsage: (usage) => set({ usage, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ factoryId: '', surface: '', usage: '', search: '', page: 1 }),
}));
