import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  Search,
  Filter,
  ArrowRight,
  Package,
  MessageCircle,
  Check,
  RotateCcw,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Category, Product } from '../types.ts';

export const ShopPage: React.FC = () => {
  const { lang, t, formatPrice } = useTranslation();
  const { setCurrentPage, pageParams, openWhatsApp } = useApp();

  const isFr = lang === 'fr';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(pageParams.category || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(pageParams.search || '');
  const [orderType, setOrderType] = useState<'all' | 'retail' | 'wholesale'>('all');
  const [pricingType, setPricingType] = useState<'all' | 'fixed' | 'quote'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'name_asc'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories on load
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(console.error);
  }, []);

  // Update selected category if route param changes
  useEffect(() => {
    if (pageParams.category) {
      setSelectedCategory(pageParams.category);
    }
  }, [pageParams.category]);

  // Fetch products with active filters
  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (orderType !== 'all') {
      params.set('type', orderType);
    }
    if (pricingType === 'quote') {
      params.set('quoteOnly', 'true');
    } else if (pricingType === 'fixed') {
      params.set('quoteOnly', 'false');
    }
    if (sortBy) {
      params.set('sort', sortBy);
    }

    fetch(`/api/products?${params.toString()}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Invalid product response');
        setProducts(data);
      })
      .catch(() => {
        setProducts([]);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, orderType, pricingType, sortBy, reloadKey]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setOrderType('all');
    setPricingType('all');
    setSortBy('newest');
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-12 space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-black uppercase tracking-widest text-[#F47721] block">
            {isFr ? 'Catalogue Sourcing Chine' : 'China Sourcing Catalog'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.shop.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.shop.subtitle}
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('request')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2 shrink-0"
        >
          <span>{t.hero.requestBtn}</span>
        </button>
      </div>

      {/* Search & Top Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between md:justify-start">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              {t.shop.sortBy}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:border-orange-500 focus:outline-hidden cursor-pointer"
            >
              <option value="newest">{t.shop.sortNewest}</option>
              <option value="price_asc">{t.shop.sortPriceAsc}</option>
              <option value="price_desc">{t.shop.sortPriceDesc}</option>
              <option value="name_asc">{t.shop.sortNameAsc}</option>
            </select>

            {/* Mobile Filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0"
              title="Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Segmented Tabs Horizontal Scroll */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t.shop.allCategories}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedCategory === cat.id || selectedCategory === cat.slug
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lang === 'fr' && cat.nameFr ? cat.nameFr : cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Filter if opened */}
      {mobileFilterOpen && (
        <div className="lg:hidden bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-600" />
              {t.shop.filterBy}
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-orange-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.shop.clearFilters}</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'all', label: t.shop.allTypes },
              { id: 'retail', label: t.shop.retailOnly },
              { id: 'wholesale', label: t.shop.wholesaleOnly },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  setOrderType(opt.id as any);
                  setMobileFilterOpen(false);
                }}
                className={`p-2 rounded-xl text-xs text-center border ${
                  orderType === opt.id
                    ? 'border-orange-600 bg-orange-50 text-orange-700 font-bold'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-orange-600" />
                {t.shop.filterBy}
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-orange-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.shop.clearFilters}</span>
              </button>
            </div>

            {/* Retail vs Wholesale Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {t.shop.type}
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: t.shop.allTypes },
                  { id: 'retail', label: t.shop.retailOnly },
                  { id: 'wholesale', label: t.shop.wholesaleOnly },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setOrderType(opt.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      orderType === opt.id
                        ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {orderType === opt.id && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fixed vs Quote Pricing Filter */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {t.shop.pricingType}
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: t.shop.allPricing },
                  { id: 'fixed', label: t.shop.fixedOnly },
                  { id: 'quote', label: t.shop.quoteOnly },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setPricingType(opt.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      pricingType === opt.id
                        ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {pricingType === opt.id && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Sourcing Callout */}
            <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/80 text-xs space-y-2">
              <span className="font-bold text-orange-900 block">
                {isFr ? 'Produit introuvable dans la liste ?' : 'Product Not in List?'}
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {t.hero.differentiator}
              </p>
              <button
                onClick={() => setCurrentPage('request')}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition"
              >
                {t.hero.requestBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Right Products Catalog Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Tags & Count */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t.shop.resultsCount.replace('{count}', String(products.length))}</span>
            {(selectedCategory !== 'all' || searchQuery || orderType !== 'all' || pricingType !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-orange-600 font-semibold hover:underline"
              >
                {t.shop.clearFilters}
              </button>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && loadError && (
            <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{isFr ? 'Catalogue indisponible' : 'Catalog unavailable'}</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">{isFr ? 'Le catalogue n’a pas pu être chargé. Réessayez dans un instant.' : 'The catalog could not be loaded. Please try again in a moment.'}</p>
              <button onClick={() => setReloadKey(value => value + 1)} className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition">
                {isFr ? 'Réessayer' : 'Retry'}
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !loadError && products.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">
                {t.shop.noResults}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isFr
                  ? "Vous ne trouvez pas ce que vous cherchez ? Envoyez-nous simplement une photo ou une description, nous le trouverons directement auprès d'une usine en Chine."
                  : "Can't find what you need? Simply send us a photo or description, and our team will locate it directly from a Chinese factory."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetFilters}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 text-slate-700"
                >
                  {t.shop.clearFilters}
                </button>
                <button
                  onClick={() => setCurrentPage('request', { prefill: searchQuery })}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition flex items-center justify-center gap-1.5"
                >
                  <span>{t.hero.requestBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {products.map(product => (
                <div
                  key={product.id}
                  onClick={() => setCurrentPage('product', { id: product.id })}
                  className="group cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-xl transition flex flex-col overflow-hidden"
                >
                  {/* Image container */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80'}
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Status Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {product.isQuoteOnly ? (
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold shadow-xs">
                          {t.shop.quoteBadge}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                          {t.shop.retailBadge}
                        </span>
                      )}
                      {product.wholesaleAvailable && (
                        <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
                          {product.moq}
                        </span>
                      )}
                    </div>

                    {/* Quick WhatsApp Share Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const msg = isFr
                          ? `Bonjour J Online Shopping ! Cet article m'intéresse : "${product.titleFr || product.title}" (Code: ${product.id}). Pouvez-vous me donner le tarif usine et les frais d'expédition ?`
                          : `Hello J Online Shopping! I am interested in this product: "${product.title}" (${window.location.origin}/#product?id=${product.id}). Can you provide current pricing and shipping options?`;
                        openWhatsApp(msg);
                      }}
                      className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition opacity-90 hover:opacity-100"
                      title={isFr ? "Demander sur WhatsApp" : "Inquire via WhatsApp"}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {product.stockLocation}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mt-1 group-hover:text-orange-600 transition">
                        {lang === 'fr' && product.titleFr ? product.titleFr : product.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {lang === 'fr' && product.descriptionFr ? product.descriptionFr : product.description}
                      </p>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block leading-tight">
                          {isFr ? (product.isQuoteOnly ? 'Sur Cotation' : 'Prix Unitaire') : (product.isQuoteOnly ? 'Sourcing Pricing' : 'Selling Price')}
                        </span>
                        <span className={`text-base font-extrabold ${product.isQuoteOnly ? 'text-indigo-600' : 'text-orange-600'}`}>
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPage('product', { id: product.id });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          product.isQuoteOnly
                            ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                        }`}
                      >
                        <span>{product.isQuoteOnly ? t.shop.requestQuote : t.shop.viewDetails}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
