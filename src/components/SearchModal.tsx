import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Search, X, ArrowRight, Package } from 'lucide-react';
import { Product } from '../types.ts';

export const SearchModal: React.FC = () => {
  const { lang, t, formatPrice } = useTranslation();
  const { isSearchOpen, setIsSearchOpen, setCurrentPage } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const isFr = lang === 'fr';

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=6`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setResults(data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const quickCategories = [
    { name: isFr ? 'Mode & Vêtements' : 'Fashion & Apparel', slug: 'cat-fashion' },
    { name: isFr ? 'Chaussures & Baskets' : 'Shoes & Footwear', slug: 'cat-shoes' },
    { name: isFr ? 'Bijoux & Accessoires' : 'Jewelry & Accessories', slug: 'cat-jewelry' },
    { name: isFr ? 'Mèches & Perruques' : 'Wigs & Hair', slug: 'cat-wigs' },
    { name: isFr ? 'Électronique & High-Tech' : 'Electronics & Gadgets', slug: 'cat-electronics' },
    { name: isFr ? 'Sacs & Maroquinerie' : 'Bags & Luggage', slug: 'cat-bags' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 md:p-20 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center gap-2.5 sm:gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="w-full text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md bg-slate-100 shrink-0"
          >
            {isFr ? 'Fermer' : 'ESC'}
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="p-3.5 sm:p-4 max-h-96 overflow-y-auto">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-400">
              {isFr ? 'Recherche dans les usines chinoises...' : 'Searching Chinese factory catalog...'}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isFr
                  ? `Aucun article trouvé pour "${query}". Vous pouvez nous soumettre une demande de sourcing direct !`
                  : `No listed products matching "${query}". You can ask us to source it directly!`}
              </p>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setCurrentPage('request', { prefill: query });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                <span>{t.hero.requestBtn}</span>
              </button>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                {isFr ? `Articles trouvés (${results.length})` : `Products (${results.length})`}
              </span>
              <div className="divide-y divide-slate-100">
                {results.map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setCurrentPage('product', { id: prod.id });
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 transition group"
                  >
                    <img
                      src={prod.images[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&q=80'}
                      alt={prod.title}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition">
                        {isFr && prod.titleFr ? prod.titleFr : prod.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {prod.stockLocation} • {prod.moq}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-orange-600 block">
                        {formatPrice(prod.price)}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5 justify-end">
                        {isFr ? 'Voir' : 'View'} <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query && (
            <div className="py-2 sm:py-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                {isFr ? 'Accès direct par catégorie :' : 'Quick Category Shortcuts:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickCategories.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setCurrentPage('shop', { category: cat.slug });
                    }}
                    className="p-2.5 text-left text-xs font-medium rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 text-slate-700 transition truncate"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
