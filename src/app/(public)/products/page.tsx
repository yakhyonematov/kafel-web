'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MdOutlineFilterList as Filter, MdOutlineRestartAlt as RotateCcw, MdOutlineTune as SlidersHorizontal, MdOutlineSearch as Search, MdOutlineInventory2 as Package, MdOutlineAutorenew as Loader2, MdOutlineClose as X } from 'react-icons/md';
import { useFilterStore } from '../../../store/useFilterStore';
import { productService } from '../../../services/product.service';
import { factoryService } from '../../../services/factory.service';
import { Product, Factory, SurfaceType } from '../../../types';
import ProductGrid from '../../../components/products/ProductGrid';
import SectionTitle from '../../../components/home/SectionTitle';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useEscapeKey } from '../../../hooks/useEscapeKey';
import StyledSelect from '../../../components/ui/StyledSelect';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [factories, setFactories] = useState<Factory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Zustand Filters
  const {
    factoryId,
    surface,
    usage,
    search,
    page,
    limit,
    setFactoryId,
    setSurface,
    setUsage,
    setSearch,
    setPage,
    resetFilters,
  } = useFilterStore();

  // Local state for debounced search typing
  const [localSearch, setLocalSearch] = useState(search);

  const activeFilterCount = [factoryId, surface, usage, search].filter(Boolean).length;

  useScrollLock(mobileFilterOpen);
  useEscapeKey(mobileFilterOpen, () => setMobileFilterOpen(false));

  // Load factories once
  useEffect(() => {
    async function loadFactories() {
      try {
        const data = await factoryService.getFactories();
        setFactories(data);
      } catch (err) {
        console.error('Failed to load factories', err);
        // Fallback mock factories
        setFactories([
          { id: 'yongxin', name: 'YONG XIN', createdAt: '', updatedAt: '' },
          { id: 'crown', name: 'CROWN CERAMIC', createdAt: '', updatedAt: '' },
          { id: 'luxgranit', name: 'LUX GRANIT', createdAt: '', updatedAt: '' },
        ]);
      }
    }
    loadFactories();
  }, []);

  // Sync query params to Zustand store on initial mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlUsage = searchParams.get('usage');
    const urlSurface = searchParams.get('surface');
    const urlFactoryId = searchParams.get('factoryId');

    if (urlSearch !== null) setSearch(urlSearch);
    if (urlUsage !== null) setUsage(urlUsage);
    if (urlSurface !== null) setSurface(urlSurface as SurfaceType);
    if (urlFactoryId !== null) setFactoryId(urlFactoryId);
  }, [searchParams, setSearch, setUsage, setSurface, setFactoryId]);

  // Debounce search effect to limit API requests
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== localSearch) {
        setSearch(localSearch);
        setPage(1);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch, setPage]);

  // Update localSearch if search store is modified outside (e.g., on reset)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Custom filter reset handler that also cleans browser query parameters
  const handleResetFilters = () => {
    resetFilters();
    setLocalSearch('');
    router.replace('/products', { scroll: false });
  };

  // Load products when filters/page change
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const params = {
          page,
          limit,
          ...(factoryId && { factoryId }),
          ...(surface && { surface }),
          ...(usage && { usage }),
          ...(search && { search }),
        };

        const res = await productService.getProducts(params);
        setProducts(res.data);
        setTotalProducts(res.meta?.total || 0);
        setTotalPages(res.meta?.totalPages || 1);
      } catch (err) {
        console.error('Failed to load products', err);
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [factoryId, surface, usage, search, page, limit]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title="Kafellar katalogi"
        subtitle="Mahsulotlarimiz"
        description="Farg'ona vodiysidagi eng sifatli kafellar, plitkalar va chiroyli keramogranitlar jamlanmasi."
        align="left"
      />

      <div className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-border bg-bg-secondary text-sm font-medium text-text-secondary mb-8 -mt-4">
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
        ) : (
          <Package className="w-3.5 h-3.5 text-accent" />
        )}
        <span>{totalProducts} ta mahsulot topildi</span>
      </div>

      {/* Horizontal Pill Filters Shortcut Bar (scrollable chips — same on mobile & desktop) */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-4 pt-3 -mx-4 px-4 scrollbar-none shrink-0 mb-6"
      >
        <button
          onClick={() => {
            setSurface('');
            setUsage('');
            setFactoryId('');
          }}
          className={`h-9 px-5 rounded-full text-sm font-semibold shrink-0 transition-all border ${
            (!surface && !usage && !factoryId)
              ? 'bg-primary border-primary text-white shadow-xs'
              : 'border-border bg-bg-secondary hover:border-text-primary text-text-primary'
          }`}
        >
          Barchasi
        </button>
        <button
          onClick={() => setSurface('MATTE')}
          className={`h-9 px-5 rounded-full text-sm font-semibold shrink-0 transition-all border ${
            surface === 'MATTE'
              ? 'bg-primary border-primary text-white shadow-xs'
              : 'border-border bg-bg-secondary hover:border-text-primary text-text-primary'
          }`}
        >
          Matoviy (Matte)
        </button>
        <button
          onClick={() => setSurface('GLOSSY')}
          className={`h-9 px-5 rounded-full text-sm font-semibold shrink-0 transition-all border ${
            surface === 'GLOSSY'
              ? 'bg-primary border-primary text-white shadow-xs'
              : 'border-border bg-bg-secondary hover:border-text-primary text-text-primary'
          }`}
        >
          Glyanseviy (Glossy)
        </button>
        <button
          onClick={() => setUsage('Pol')}
          className={`h-9 px-5 rounded-full text-sm font-semibold shrink-0 transition-all border ${
            usage === 'Pol'
              ? 'bg-primary border-primary text-white shadow-xs'
              : 'border-border bg-bg-secondary hover:border-text-primary text-text-primary'
          }`}
        >
          Pol uchun
        </button>
        <button
          onClick={() => setUsage('Devor')}
          className={`h-9 px-5 rounded-full text-sm font-semibold shrink-0 transition-all border ${
            usage === 'Devor'
              ? 'bg-primary border-primary text-white shadow-xs'
              : 'border-border bg-bg-secondary hover:border-text-primary text-text-primary'
          }`}
        >
          Devor uchun
        </button>
        {factories.map((f) => (
          <button
            key={f.id}
            onClick={() => setFactoryId(f.id)}
            className={`h-9 px-5 rounded-full text-sm font-semibold shrink-0 transition-all border relative ${
              factoryId === f.id
                ? 'bg-primary border-primary text-white shadow-xs'
                : 'border-border bg-bg-secondary hover:border-text-primary text-text-primary'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Filter Panel (Left - Sticky on scroll) */}
        <aside className="w-full lg:w-[260px] shrink-0 bg-bg-secondary p-5 rounded-xl border border-border space-y-6 hidden lg:block lg:sticky lg:top-28">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-bold text-text-primary text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent" />
              <span>Filtrlar</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-text-muted hover:text-accent transition-colors flex items-center gap-1 text-[11px]"
              title="Qayta tiklash"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Tozalash</span>
            </button>
          </div>

          {/* Search Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Qidirish
            </label>
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Kod yoki nom kiriting..."
                className="w-full h-10 pl-3 pr-9 border border-border bg-white rounded-lg text-xs placeholder-text-muted focus:outline-none focus:border-accent"
              />
              <Search className="w-3.5 h-3.5 text-text-muted absolute right-3 top-3" />
            </div>
          </div>

          {/* Factory Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Ishlab chiqaruvchi (Zavod)
            </label>
            <StyledSelect
              value={factoryId}
              onChange={(e) => setFactoryId(e.target.value)}
              className="h-10 text-sm font-medium"
            >
              <option value="">Barcha zavodlar</option>
              {factories.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </StyledSelect>
          </div>

          {/* Surface Type Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Sirt turi (Yuzasi)
            </label>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSurface('')}
                className={`w-full h-9 px-3 rounded-lg text-left text-sm font-semibold border transition-all ${
                  surface === ''
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-text-primary border-border hover:bg-bg-secondary'
                }`}
              >
                Barchasi
              </button>
              <button
                onClick={() => setSurface('GLOSSY')}
                className={`w-full h-9 px-3 rounded-lg text-left text-sm font-semibold border transition-all ${
                  surface === 'GLOSSY'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-text-primary border-border hover:bg-bg-secondary'
                }`}
              >
                Glyanseviy (Glossy)
              </button>
              <button
                onClick={() => setSurface('MATTE')}
                className={`w-full h-9 px-3 rounded-lg text-left text-sm font-semibold border transition-all ${
                  surface === 'MATTE'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-text-primary border-border hover:bg-bg-secondary'
                }`}
              >
                Matoviy (Matte)
              </button>
            </div>
          </div>

          {/* Usage Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Xona / Qo'llanilishi
            </label>
            <StyledSelect
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              className="h-10 text-sm font-medium"
            >
              <option value="">Barchasi</option>
              <option value="Pol">Pol uchun</option>
              <option value="Sanuzel">Sanuzel va oshxona devorlari uchun</option>
            </StyledSelect>
          </div>
        </aside>

        {/* Sticky Floating Bottom Mobile Filter Toggle & Controls */}
        <div
          className="fixed left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] z-30 lg:hidden flex gap-2"
          style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="relative flex-1 h-12 bg-accent hover:bg-accent-hover text-white rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-lg shadow-accent/20 active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtrlar</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-accent text-[10px] font-extrabold flex items-center justify-center shadow-sm border border-accent/10">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="w-12 h-12 bg-white border border-border text-text-primary rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
              title="Qayta tiklash"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Product Grid and Pagination (Right) */}
        <div className="flex-1 w-full space-y-8 pb-28 lg:pb-0">
          <ProductGrid products={products} isLoading={loading} onReset={handleResetFilters} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-start sm:justify-center gap-1.5 pt-4 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-10 h-10 shrink-0 rounded-lg border border-border flex items-center justify-center hover:bg-bg-secondary transition-colors text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &larr;
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`w-10 h-10 shrink-0 rounded-lg border text-xs font-bold transition-all ${
                    page === index + 1
                      ? 'bg-accent text-white border-accent shadow-sm'
                      : 'border-border bg-white text-text-secondary hover:bg-bg-secondary'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 shrink-0 rounded-lg border border-border flex items-center justify-center hover:bg-bg-secondary transition-colors text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer (BottomSheet sliding from bottom) */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${mobileFilterOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${mobileFilterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileFilterOpen(false)}
        />
        {/* BottomSheet container */}
        <div className={`fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-[2rem] shadow-2xl flex flex-col max-h-[85vh] transition-transform duration-300 ease-in-out z-10 ${mobileFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          {/* Touch indicator bar */}
          <div className="w-12 h-1 bg-border/80 rounded-full mx-auto my-3.5 shrink-0" />

          <div className="flex justify-between items-center border-b border-border pb-4 px-6">
            <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
              <Filter className="w-5 h-5 text-accent" />
              <span>Filtrlar</span>
            </h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="p-1.5 rounded-full hover:bg-bg-secondary text-text-secondary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Filters Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-5">
            {/* Search */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wide">
                Qidirish
              </label>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Kod yoki nom..."
                className="w-full h-11 px-4 border border-border rounded-xl text-sm"
              />
            </div>

            {/* Factory */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wide">
                Zavod
              </label>
              <StyledSelect
                value={factoryId}
                onChange={(e) => setFactoryId(e.target.value)}
                className="h-11 rounded-xl text-sm"
              >
                <option value="">Barcha zavodlar</option>
                {factories.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </StyledSelect>
            </div>

            {/* Surface */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wide">
                Sirt turi
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSurface('')}
                  className={`h-10 px-2 rounded-xl text-sm font-semibold border transition-all ${
                    surface === ''
                      ? 'bg-accent text-white border-accent'
                      : 'bg-bg-secondary text-text-primary border-border'
                  }`}
                >
                  Barchasi
                </button>
                <button
                  onClick={() => setSurface('GLOSSY')}
                  className={`h-10 px-2 rounded-xl text-sm font-semibold border transition-all ${
                    surface === 'GLOSSY'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-bg-secondary text-text-primary border-border'
                  }`}
                >
                  Glossy
                </button>
                <button
                  onClick={() => setSurface('MATTE')}
                  className={`h-10 px-2 rounded-xl text-sm font-semibold border transition-all ${
                    surface === 'MATTE'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-bg-secondary text-text-primary border-border'
                  }`}
                >
                  Matte
                </button>
              </div>
            </div>

            {/* Usage */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wide">
                Qo'llanilishi
              </label>
              <StyledSelect
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                className="h-11 rounded-xl text-sm"
              >
                <option value="">Barchasi</option>
                <option value="Pol">Pol uchun</option>
                <option value="Sanuzel">Sanuzel va oshxona devorlari uchun</option>
              </StyledSelect>
            </div>
          </div>

          {/* Apply / Clear Buttons */}
          <div
            className="p-6 bg-bg-secondary border-t border-border grid grid-cols-2 gap-3"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            <button
              onClick={handleResetFilters}
              className="h-12 border border-border bg-white rounded-xl text-xs font-bold text-text-secondary hover:bg-bg-secondary transition-all"
            >
              Tozalash
            </button>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="h-12 bg-accent text-white rounded-xl text-xs font-bold hover:bg-accent-hover transition-all"
            >
              Tasdiqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-text-secondary">Katalog yuklanmoqda...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
