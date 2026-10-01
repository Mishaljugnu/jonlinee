import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  Share2,
  Package,
  Layers,
  MapPin,
  Building2,
  Check
} from 'lucide-react';
import { Product } from '../types.ts';

export const ProductDetailPage: React.FC = () => {
  const { lang, t, formatPrice } = useTranslation();
  const { pageParams, setCurrentPage, openWhatsApp, showToast, addToCart, setIsCartOpen } = useApp();

  const isFr = lang === 'fr';

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const productId = pageParams.id;

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setProduct(data);
          setSelectedImg(data.images[0] || '');
          if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
          if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);

          // Fetch related in same category
          fetch(`/api/products?category=${data.categoryId}&limit=4`)
            .then(r => r.json())
            .then(rel => {
              if (Array.isArray(rel)) {
                setRelated(rel.filter((p: Product) => p.id !== data.id));
              }
            });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">
          {isFr ? 'Chargement des détails produit...' : 'Loading factory product details...'}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <Package className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">
          {isFr ? 'Produit Introuvable' : 'Product Not Found'}
        </h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs"
        >
          {t.product.backToCatalog}
        </button>
      </div>
    );
  }

  const title = isFr && product.titleFr ? product.titleFr : product.title;
  const description = isFr && product.descriptionFr ? product.descriptionFr : product.description;

  const handleWhatsAppInquire = () => {
    const queryText = isFr
      ? `Bonjour J Online Shopping ! Je souhaite obtenir un devis pour cet article :
Produit : ${title}
Réf : ${product.id}
Quantité : ${quantity}
Couleur : ${selectedColor || 'Standard'}
Taille/Variante : ${selectedSize || 'Standard'}
Lien : ${window.location.origin}/#product?id=${product.id}

Pouvez-vous me confirmer le tarif d’usine actuel et les options de transport (fret aérien/maritime) ?`
      : `Hello J Online Shopping! I am inquiring about:
Product: ${title}
Code: ${product.id}
Quantity: ${quantity}
Color: ${selectedColor || 'N/A'}
Size/Variant: ${selectedSize || 'N/A'}
Link: ${window.location.origin}/#product?id=${product.id}

Could you provide current factory pricing and international shipping cost?`;
    openWhatsApp(queryText);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(isFr ? 'Lien du produit copié dans le presse-papiers !' : 'Product link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-8 sm:space-y-12 w-full max-w-full overflow-hidden">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('shop')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.product.backToCatalog}</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{t.product.shareProduct}</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
            <img
              src={selectedImg || product.images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isQuoteOnly ? (
                <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md">
                  {t.shop.quoteBadge}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md">
                  {t.shop.retailBadge}
                </span>
              )}
              {product.wholesaleAvailable && (
                <span className="px-3 py-1 rounded-xl bg-slate-900/80 text-white text-xs font-medium backdrop-blur-xs">
                  {product.moq}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`w-16 sm:w-20 h-16 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImg === img ? 'border-orange-600 scale-105 shadow-md' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`${title} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust info below image */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">
                  {isFr ? 'Centres Guangzhou & Yiwu' : 'Guangzhou & Yiwu Hubs'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isFr ? `Origine : ${product.stockLocation}` : `Origin: ${product.stockLocation}`}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">
                  {isFr ? 'Contrôle Usine Vérifié' : 'Factory Verified'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isFr ? 'Inspection qualité avant expédition' : 'Full quality control before freight'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info & Purchase/Quote Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>{product.stockLocation}</span>
              <span>•</span>
              <span>{product.moq}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {title}
            </h1>
          </div>

          {/* Price Display */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {product.isQuoteOnly ? t.product.requestPriceTitle : (isFr ? 'Prix Unitaire' : 'Selling Price')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-orange-600">
              {formatPrice(product.price)}
            </div>
            {product.isQuoteOnly && (
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.product.requestPriceNotice}
              </p>
            )}
          </div>

          {/* Options: Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                {t.product.optionsColor}: <span className="text-orange-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      selectedColor === color
                        ? 'border-orange-600 bg-orange-50 text-orange-700 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Options: Sizes / Variants */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                {t.product.optionsSize}: <span className="text-orange-600">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      selectedSize === size
                        ? 'border-orange-600 bg-orange-50 text-orange-700 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              {t.product.quantity}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center text-xs font-bold text-slate-800 focus:outline-hidden"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-500">
                MOQ: {product.moq}
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
                setIsCartOpen(true);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm transition shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{t.product.addToCart}</span>
            </button>

            <button
              onClick={handleWhatsAppInquire}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.product.inquireBtn}</span>
            </button>

            <button
              onClick={() => {
                setCurrentPage('request', {
                  prefill: isFr
                    ? `Je souhaite sourcer : ${title} (Réf : ${product.id}), Quantité : ${quantity}`
                    : `I want to source: ${title} (${product.id}), Qty: ${quantity}`
                });
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              <span>{t.product.requestQuoteBtn}</span>
            </button>
          </div>

          {/* Wholesale Perks */}
          {product.wholesaleAvailable && (
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                {t.product.wholesaleDetails}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {t.product.wholesalePerks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">
              {isFr ? 'Description & Caractéristiques' : 'Product Overview'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pt-8 sm:pt-12 border-t border-slate-200 space-y-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            {t.product.relatedTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map(rel => (
              <div
                key={rel.id}
                onClick={() => setCurrentPage('product', { id: rel.id })}
                className="group cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-lg transition p-3 space-y-2"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <img src={rel.images[0]} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition">
                  {isFr && rel.titleFr ? rel.titleFr : rel.title}
                </h4>
                <div className="flex items-center justify-between text-xs font-extrabold text-orange-600">
                  <span>{formatPrice(rel.price)}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{rel.moq}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
