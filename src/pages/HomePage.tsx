import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  ArrowRight,
  ShieldCheck,
  Plane,
  MessageCircle,
  UploadCloud,
  ChevronRight,
  Camera,
  Check,
  PackageCheck,
  Factory,
  Truck,
  Building2,
  CheckCheck
} from 'lucide-react';
import { Category, Product } from '../types.ts';

export const HomePage: React.FC = () => {
  const { lang, formatPrice } = useTranslation();
  const { setCurrentPage, openWhatsApp, showToast } = useApp();

  const isFr = lang === 'fr';

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Interactive Photo Sourcing Desk State
  const [sourcePhoto, setSourcePhoto] = useState<string | null>(null);
  const [sourceQuantity, setSourceQuantity] = useState<number>(10);
  const [sourceType, setSourceType] = useState<'retail' | 'wholesale'>('retail');
  const [sourceNotes, setSourceNotes] = useState('');
  const [sourceContact, setSourceContact] = useState('');
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);
  const [isUploadingQuick, setIsUploadingQuick] = useState(false);
  const [quickSubmitSuccess, setQuickSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(console.error);

    // Fetch featured
    fetch('/api/products?featured=true&limit=8')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setFeaturedProducts(data); })
      .catch(console.error);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      showToast(isFr ? 'Utilisez JPG, PNG ou WebP.' : 'Please use JPG, PNG, or WebP.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast(isFr ? 'La photo doit faire moins de 5 Mo.' : 'The image must be under 5MB.', 'error');
      return;
    }

    setIsUploadingQuick(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Could not read image'));
        reader.readAsDataURL(file);
      });
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataUrl, filename: file.name, mimeType: file.type })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed');
      setSourcePhoto(data.url);
    } catch (err) {
      console.warn('Quick sourcing image upload failed:', err);
      showToast(isFr ? 'Impossible de téléverser cette image.' : 'Could not upload this image.', 'error');
    } finally {
      setIsUploadingQuick(false);
    }
  };

  const handleQuickSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingQuick) return;
    if (!sourceNotes && !sourcePhoto) {
      showToast(isFr ? 'Veuillez décrire le produit ou joindre une photo.' : 'Please describe the product or upload a photo.', 'info');
      return;
    }
    if (!sourceContact.trim()) {
      showToast(isFr ? 'Ajoutez votre WhatsApp ou votre e-mail pour recevoir une réponse.' : 'Add your WhatsApp or email so we can reply.', 'error');
      return;
    }

    setIsSubmittingQuick(true);
    try {
      const res = await fetch('/api/sourcing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: sourceNotes.slice(0, 60) || (isFr ? 'Produit Sourcé sur Photo' : 'Photo Sourced Product'),
          quantity: sourceQuantity,
          orderType: sourceType,
          images: sourcePhoto ? [sourcePhoto] : [],
          notes: sourceNotes,
          customerWhatsapp: sourceContact,
          customerEmail: sourceContact.includes('@') ? sourceContact : '',
          destinationCountry: isFr ? 'France' : 'USA'
        })
      });

      if (res.ok) {
        setQuickSubmitSuccess(true);
        showToast(isFr ? 'Demande bien reçue ! Notre équipe en Chine recherche les usines.' : 'Sourcing request received! Our China team is reviewing suppliers.', 'success');
        setTimeout(() => {
          setQuickSubmitSuccess(false);
          setSourceNotes('');
          setSourcePhoto(null);
          setSourceContact('');
        }, 4000);
      } else {
        setCurrentPage('request', { prefill: sourceNotes });
      }
    } catch {
      setCurrentPage('request', { prefill: sourceNotes });
    } finally {
      setIsSubmittingQuick(false);
    }
  };

  return (
    <div className="bg-[#F8F8FA] text-[#171827] space-y-16 sm:space-y-24 pb-16 w-full max-w-full overflow-hidden">
      {/* =========================================================================
          SECTION 1: HERO: CHINA -> GLOBAL
          ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-6 pb-12 sm:pt-14 sm:pb-20">
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#5121A8]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-[#F47721]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              {/* Overline Label */}
              <div className="inline-flex items-center gap-2 text-[#5121A8] text-xs font-black tracking-widest uppercase">
                <span>{isFr ? 'Chine → International' : 'China → Global'}</span>
              </div>

              {/* Authority Headline */}
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-[#171827] tracking-tight leading-[1.1]">
                {isFr ? (
                  <>
                    SOURCEZ PLUS INTELLIGEMMENT.<br />
                    <span className="text-[#5121A8]">ACHETEZ SANS</span><br />
                    <span className="text-[#F47721]">LIMITES.</span>
                  </>
                ) : (
                  <>
                    SOURCE SMARTER.<br />
                    <span className="text-[#5121A8]">SHOP WITHOUT</span><br />
                    <span className="text-[#F47721]">LIMITS.</span>
                  </>
                )}
              </h1>

              {/* Clean Descriptive Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                {isFr
                  ? 'Votre partenaire de confiance pour sourcer vos produits en Chine : des approvisionnements personnalisés aux conteneurs complets avec inspection vidéo et dédouanement garanti.'
                  : 'Your direct sourcing partner in China: from custom retail procurement to full container shipments with on-site inspection and door-to-door logistics.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="px-6 py-3.5 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white font-bold text-xs sm:text-sm transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <span>{isFr ? 'Voir les Produits' : 'Browse Products'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage('request')}
                  className="px-6 py-3.5 rounded-xl bg-[#5121A8] hover:bg-[#431b8c] text-white font-bold text-xs sm:text-sm transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isFr ? 'Demander un Devis Sourcing' : 'Request Sourcing Quote'}</span>
                </button>

                <button
                  onClick={() => openWhatsApp(isFr ? 'Bonjour ! Je souhaite me renseigner pour sourcer des produits en Chine.' : 'Hello! I would like to ask about sourcing products from China.')}
                  className="px-4 py-3.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-emerald-200"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* Operational Verification Specs */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 sm:gap-4 text-left">
                <div>
                  <div className="text-xs sm:text-base font-black text-[#171827]">Guangzhou & Yiwu</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                    {isFr ? 'Entrepôts de Regroupement' : 'Consolidation Warehouses'}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-base font-black text-[#5121A8]">Norme AQL 2.5</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                    {isFr ? 'Contrôle Qualité Avant Envoi' : 'Pre-Shipment Inspection'}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-base font-black text-[#F47721]">Air & Mer DDP</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                    {isFr ? 'Douanes & Taxes Incluses' : 'Customs & Duties Handled'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Visual Product Collage */}
            <div className="lg:col-span-6 relative mt-4 lg:mt-0">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {/* Item 1: Designer Sneakers */}
                  <div className="col-span-2 relative aspect-4/3 rounded-2xl overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80"
                      alt={isFr ? 'Chaussures & Baskets' : 'Footwear Sourcing'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171827]/85 via-transparent to-transparent opacity-85" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 text-white">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#F47721] block">
                        {isFr ? 'Pôle Chaussures • Jinjiang' : 'Footwear Hub • Jinjiang'}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold leading-tight truncate">
                        {isFr ? 'Baskets Mode & Sport' : 'Platform & Athletic Sneakers'}
                      </h4>
                    </div>
                  </div>

                  {/* Item 2: Luxury Bag */}
                  <div className="relative aspect-4/3 sm:aspect-auto rounded-2xl overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"
                      alt={isFr ? 'Maroquinerie' : 'Leather Bags'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171827]/85 via-transparent to-transparent opacity-85" />
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-[#F47721] block">Guangzhou</span>
                      <h4 className="text-[11px] sm:text-xs font-bold leading-tight truncate">
                        {isFr ? 'Sacs & Maroquinerie' : 'Leather Bags'}
                      </h4>
                    </div>
                  </div>

                  {/* Item 3: Electronics / Audio */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                      alt={isFr ? 'Électronique' : 'Electronics'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171827]/85 via-transparent to-transparent opacity-85" />
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-sky-400 block">Shenzhen</span>
                      <h4 className="text-[11px] sm:text-xs font-bold leading-tight truncate">
                        {isFr ? 'Audio & Casques' : 'Smart Audio'}
                      </h4>
                    </div>
                  </div>

                  {/* Item 4: Virgin Hair & Wigs */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80"
                      alt={isFr ? 'Perruques & Mèches' : 'Virgin Hair & Wigs'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171827]/85 via-transparent to-transparent opacity-85" />
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-purple-300 block">Xuchang</span>
                      <h4 className="text-[11px] sm:text-xs font-bold leading-tight truncate">
                        {isFr ? 'Perruques Lace HD' : 'HD Lace Hair'}
                      </h4>
                    </div>
                  </div>

                  {/* Item 5: 18K Stainless Jewelry */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"
                      alt={isFr ? 'Bijoux Acier 18K' : 'Stainless Steel Jewelry'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171827]/85 via-transparent to-transparent opacity-85" />
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-amber-300 block">
                        {isFr ? 'Marché de Yiwu' : 'Yiwu Market'}
                      </span>
                      <h4 className="text-[11px] sm:text-xs font-bold leading-tight truncate">
                        {isFr ? 'Bijoux Inoxydables' : '18K Jewelry'}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 2: POPULAR CATEGORIES
          ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#F47721]">
              {isFr ? 'Explorer Nos Catégories' : 'Explore Our Categories'}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#171827] mt-1">
              {isFr ? 'Sourcing par Catégorie' : 'Sourcing by Category'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isFr
                ? 'Accès direct aux principaux bassins industriels et marchés de gros en Chine.'
                : "Direct connection to China's leading wholesale industrial manufacturing clusters."}
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5121A8] hover:text-[#F47721] transition self-start sm:self-auto"
          >
            <span>{isFr ? 'Toutes les Catégories' : 'View All Categories'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setCurrentPage('shop', { category: cat.id })}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:border-[#5121A8] hover:shadow-md transition duration-200 flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171827]/85 via-transparent to-transparent opacity-75 group-hover:opacity-90 transition" />
                <span className="absolute bottom-2 left-2 right-2 text-white font-bold text-[11px] sm:text-xs line-clamp-1">
                  {isFr && cat.nameFr ? cat.nameFr : cat.name}
                </span>
              </div>
              <div className="p-2 sm:p-2.5 text-[10px] sm:text-[11px] text-slate-500 bg-white flex items-center justify-between border-t border-slate-100">
                <span className="font-medium text-[#5121A8]">{isFr ? 'Direct Usine' : 'Factory Direct'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F47721] group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================================
          SECTION 3: FEATURED PRODUCTS
          ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#F47721]">
              {isFr ? 'Sélection Vérifiée' : 'Verified Products'}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#171827] mt-1">
              {isFr ? 'Produits en Vedette' : 'Featured Products'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isFr
                ? 'Disponibles immédiatement à l’unité ou sur cotation pour commandes de gros en usine.'
                : 'Available for immediate retail purchase or factory-direct bulk quotation.'}
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('shop', { featured: 'true' })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5121A8] hover:text-[#F47721] transition self-start sm:self-auto"
          >
            <span>{isFr ? 'Voir tous les produits →' : 'View All Products →'}</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <div
              key={product.id}
              onClick={() => setCurrentPage('product', { id: product.id })}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200/80 hover:border-[#5121A8] hover:shadow-md transition flex flex-col overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80'}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  {product.isQuoteOnly ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#5121A8] text-white text-[10px] font-bold shadow-xs">
                      {isFr ? 'Sur Devis' : 'Quote on Request'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                      {isFr ? 'En Stock' : 'In Stock / Retail'}
                    </span>
                  )}
                  {product.wholesaleAvailable && (
                    <span className="px-2 py-0.5 rounded-md bg-[#171827]/85 text-white text-[10px] font-semibold backdrop-blur-xs">
                      {isFr ? `MOQ : ${product.moq || 10}` : `MOQ: ${product.moq || 10}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {product.stockLocation || (isFr ? 'Pôle de Guangzhou' : 'Guangzhou Hub')}
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-[#171827] line-clamp-2 mt-0.5 group-hover:text-[#5121A8] transition">
                    {isFr && product.titleFr ? product.titleFr : product.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block leading-tight">
                      {isFr ? 'Prix' : 'Price'}
                    </span>
                    {product.isQuoteOnly ? (
                      <span className="text-xs sm:text-sm font-black text-[#5121A8]">
                        {isFr ? 'Sur Devis' : 'Quote on Request'}
                      </span>
                    ) : (
                      <span className="text-sm sm:text-base font-black text-[#F47721]">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPage('product', { id: product.id });
                    }}
                    className="p-2 rounded-xl bg-slate-100 group-hover:bg-[#F47721] group-hover:text-white text-slate-700 transition"
                    title={isFr ? 'Consulter' : 'View Details'}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================================
          SECTION 4: REQUEST A PRODUCT: UPLOAD A PHOTO
          ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left explanation */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-[#5121A8] text-xs font-black uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-[#F47721]" />
              <span>{isFr ? 'Service Sourcing sur Photo' : 'Photo Sourcing Service'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-[#171827] leading-tight">
              {isFr ? (
                <>
                  Vous ne trouvez pas votre article ?<br />
                  <span className="text-[#5121A8]">Envoyez-nous une photo.</span> Nous le sourçons pour vous.
                </>
              ) : (
                <>
                  Can't find what you're looking for?<br />
                  <span className="text-[#5121A8]">Send us a picture.</span> We'll source it for you.
                </>
              )}
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed">
              {isFr
                ? 'Vous avez repéré un article sur Instagram, TikTok, 1688 ou dans une boutique ? Transmettez-nous simplement sa photo ou son lien. Notre équipe sur place consulte les manufactures chinoises et vous transmet les tarifs d’usine et le coût de livraison garanti.'
                : 'See something you want on Instagram, TikTok, or another shop but can’t find on our website? Simply send us a photo. Our team will look for suitable suppliers in China and provide you with available options, factory pricing, and shipping rates.'}
            </p>

            {/* 3 Core Pillars */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <CheckCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171827]">
                    {isFr ? 'Recherche Directe Usines à Guangzhou & Yiwu' : 'Direct Factory Search in Guangzhou & Yiwu'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isFr
                      ? 'Nous consultons les manufactures et marchés spécialisés plutôt que des revendeurs intermédiaires.'
                      : 'We search local wholesale manufacturing clusters rather than high-margin resellers.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#5121A8] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171827]">
                    {isFr ? 'Contrôle Qualité Vidéo Avant Expédition' : 'Pre-Shipment Video Quality Inspection'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isFr
                      ? 'Vous recevez photos et vidéos haute résolution de vos articles avant tout départ international.'
                      : 'You inspect photos and high-resolution videos of your goods before international dispatch.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#F47721] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171827]">
                    {isFr ? 'Livraison DDP Clé en Main avec Douanes Réglées' : 'DDP Doorstep Delivery with Customs Cleared'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isFr
                      ? 'Aucune mauvaise surprise de droits de douane : livraison directe à votre adresse ou boutique.'
                      : 'No surprise customs tariffs; we deliver straight to your address or local market depot.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Photo Sourcing Dropzone Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm">
            {quickSubmitSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#171827]">
                  {isFr ? 'Demande de Sourcing Transmise !' : 'Sourcing Request Submitted!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {isFr
                    ? 'Notre équipe de sourcing en Chine vérifie la disponibilité auprès des usines et vous contacte sous 24h.'
                    : 'Our China sourcing team will inspect factory availability and message you with options within 24 hours.'}
                </p>
                <button
                  onClick={() => setQuickSubmitSuccess(false)}
                  className="px-4 py-2 bg-[#5121A8] text-white text-xs font-bold rounded-xl"
                >
                  {isFr ? 'Soumettre un autre produit' : 'Submit Another Product'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickSourceSubmit} className="space-y-3.5">
                {/* Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-[#171827] mb-1.5">
                    {isFr ? 'Téléversez la photo du produit ou une capture' : 'Upload Product Photo or Screenshot'}
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition ${
                      sourcePhoto || isUploadingQuick
                        ? 'border-[#5121A8] bg-purple-50/30'
                        : 'border-slate-300 hover:border-[#5121A8] bg-slate-50/50'
                    }`}
                  >
                    {isUploadingQuick ? (
                      <div className="space-y-1">
                        <UploadCloud className="w-7 h-7 text-[#5121A8] mx-auto animate-pulse" />
                        <span className="text-xs font-bold text-[#5121A8] block">
                          {isFr ? 'Téléversement…' : 'Uploading…'}
                        </span>
                      </div>
                    ) : sourcePhoto ? (
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={sourcePhoto}
                          alt="Uploaded preview"
                          className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-slate-200"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>{isFr ? 'Photo Jointe' : 'Photo Attached'}</span>
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-slate-500">
                            {isFr ? 'Cliquer pour changer l’image' : 'Click to replace image'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 mx-auto" />
                        <span className="text-xs font-bold text-[#171827] block">
                          {isFr ? 'Glissez votre photo ici ou cliquez pour choisir' : 'Drop your product here or click to browse'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          JPG, PNG, WebP • {isFr ? 'Captures d’écran acceptées' : 'Screenshots accepted'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity & Retail vs Wholesale */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#171827] mb-1">
                      {isFr ? 'Quantité souhaitée' : 'Quantity Needed'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={sourceQuantity}
                      onChange={(e) => setSourceQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#5121A8] focus:outline-hidden font-bold text-[#171827]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171827] mb-1">
                      {isFr ? 'Type de commande' : 'Order Type'}
                    </label>
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-50 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setSourceType('retail')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                          sourceType === 'retail'
                            ? 'bg-[#5121A8] text-white shadow-xs'
                            : 'text-slate-600 hover:text-[#171827]'
                        }`}
                      >
                        {isFr ? 'Détail' : 'Retail'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceType('wholesale')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                          sourceType === 'wholesale'
                            ? 'bg-[#5121A8] text-white shadow-xs'
                            : 'text-slate-600 hover:text-[#171827]'
                        }`}
                      >
                        {isFr ? 'Gros' : 'Wholesale'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description / Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#171827] mb-1">
                    {isFr ? 'Description ou spécifications du produit' : 'Product Description / Specifications'}
                  </label>
                  <textarea
                    rows={2}
                    value={sourceNotes}
                    onChange={(e) => setSourceNotes(e.target.value)}
                    placeholder={isFr ? 'Ex : Sac bandoulière en cuir beige, finitions dorées, taille 25cm...' : 'e.g. Leather crossbody bag in beige, gold hardware, size 25cm...'}
                    className="w-full text-xs p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#5121A8] focus:outline-hidden text-slate-800 resize-none"
                  />
                </div>

                {/* Contact WhatsApp or Email */}
                <div>
                  <label className="block text-xs font-bold text-[#171827] mb-1">
                    {isFr ? 'Votre WhatsApp ou Email' : 'Your WhatsApp or Email'}
                  </label>
                  <input
                    type="text"
                    value={sourceContact}
                    onChange={(e) => setSourceContact(e.target.value)}
                    placeholder={isFr ? '+33 6 12 34 56 78 ou contact@exemple.com' : '+33 6 12 34 56 78 or yourname@gmail.com'}
                    className="w-full text-xs p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#5121A8] focus:outline-hidden text-slate-800"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmittingQuick || isUploadingQuick}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#5121A8] hover:bg-[#431b8c] text-white font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>
                    {isSubmittingQuick
                      ? (isFr ? 'Transmission en cours...' : 'Sending to China Desk...')
                      : (isFr ? 'Demander une Cotation Produit' : 'Request Product Quotation')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isFr ? 'Devis Gratuit' : 'Free Quotation'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isFr ? 'Contrôle Qualité Inclus' : 'Pre-Shipment Inspection'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isFr ? 'Dédouanement DDP' : 'DDP Delivery'}</span>
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 5: "FROM CHINA. TO YOU."
          ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#F47721]">
            {isFr ? 'Chine → International' : 'China → Global'}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-[#171827] mt-1">
            {isFr ? 'De la Chine. Jusqu’à Vous.' : 'From China. To You.'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            {isFr
              ? 'Des usines chinoises directement aux commerçants et particuliers du monde entier. Nous vous accompagnons dans la recherche, la négociation, le contrôle et l’acheminement sécurisé.'
              : 'From Chinese suppliers to customers around the world. We help you find products, communicate sourcing requirements, arrange purchasing and coordinate the next steps toward delivery.'}
          </p>
        </div>

        {/* 4 Connected Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Stage 1 */}
          <div className="border-t-2 border-orange-500 pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F47721] flex items-center justify-center font-bold">
                <Factory className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                {isFr ? 'Étape 01' : 'Stage 01'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#171827]">
              {isFr ? 'Fournisseurs & Manufactures' : 'Chinese Suppliers & Factories'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isFr
                ? 'Approvisionnement direct à Guangzhou, Yiwu, Shenzhen et Dongguan sans marges excessives de revendeurs.'
                : 'Direct procurement in Guangzhou, Yiwu, Shenzhen, and Dongguan without excessive reseller markups.'}
            </p>
          </div>

          {/* Stage 2 */}
          <div className="border-t-2 border-[#5121A8] pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5121A8] flex items-center justify-center font-bold">
                <PackageCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5121A8]">
                {isFr ? 'Étape 02' : 'Stage 02'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#171827]">
              {isFr ? 'Contrôle Qualité à Guangzhou' : 'Guangzhou QC Hub'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isFr
                ? 'Réception des colis dans notre entrepôt pour inspection vidéo, vérification de conformité et remballage protecteur.'
                : 'Items arrive at our consolidation warehouse for photo/video quality inspection and secure repacking.'}
            </p>
          </div>

          {/* Stage 3 */}
          <div className="border-t-2 border-sky-500 pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Plane className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-600">
                {isFr ? 'Étape 03' : 'Stage 03'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#171827]">
              {isFr ? 'Logistique Aérienne & Maritime' : 'Air & Sea Logistics'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isFr
                ? 'Fret aérien ou groupage maritime économique avec gestion douanière (délais indicatifs variables selon pays et douanes).'
                : 'Air cargo or economical sea freight with customs handling (estimated transit times vary by destination and customs).'}
            </p>
          </div>

          {/* Stage 4 */}
          <div className="border-t-2 border-emerald-500 pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                {isFr ? 'Étape 04' : 'Stage 04'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#171827]">
              {isFr ? 'Livraison à Votre Porte' : 'Your Market / Doorstep'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isFr
                ? 'Acheminement garanti à votre domicile, boutique ou entrepôt en Europe, Afrique, Amériques et reste du monde.'
                : 'Safe delivery to your home, retail boutique, or distribution center in Europe, Africa, North America, and beyond.'}
            </p>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 6: WHOLESALE
          ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="rounded-3xl bg-[#171827] text-white p-6 sm:p-12 lg:p-14 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#5121A8]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 text-[#F47721] text-xs font-black uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>{isFr ? 'Sourcing B2B Direct Usines' : 'B2B Factory Direct'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {isFr ? (
                  <>
                    Achetez en gros.<br />
                    <span className="text-[#F47721]">Développez votre activité.</span>
                  </>
                ) : (
                  <>
                    Source in bulk.<br />
                    <span className="text-[#F47721]">Grow your business.</span>
                  </>
                )}
              </h2>

              <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl">
                {isFr
                  ? 'Besoin de volumes importants ? Nous négocions directement auprès des usines en Chine. De la validation d’échantillons au conteneur maritime complet, nous gérons la fabrication OEM, le marquage et la logistique.'
                  : 'Need larger quantities? We can help source products from suppliers and factories in China. From sample verification to full sea freight containers, we handle negotiation, OEM branding, and customs.'}
              </p>

              {/* 5 Wholesale Capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-[#F47721] shrink-0" />
                  <span>{isFr ? 'Sourcing Direct & Audits d’Usines' : 'Factory Sourcing & Audits'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-[#F47721] shrink-0" />
                  <span>{isFr ? 'Achats en Gros & Négociation Tarifaire' : 'Bulk Purchasing & Price Negotiation'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-[#F47721] shrink-0" />
                  <span>{isFr ? 'Accompagnement Commerçants (MOQ adapté)' : 'Low MOQ Support for Retailers'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-[#F47721] shrink-0" />
                  <span>{isFr ? 'Marque Blanche & Personnalisation OEM' : 'Customization (OEM / Private Label)'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200 sm:col-span-2">
                  <Check className="w-4 h-4 text-[#F47721] shrink-0" />
                  <span>{isFr ? 'Expédition Fret Aérien & Maritime DDP' : 'Doorstep Air & Sea Shipping Assistance'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <button
                  onClick={() => setCurrentPage('wholesale')}
                  className="px-6 py-3.5 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white font-bold text-xs sm:text-sm transition shadow-sm text-center"
                >
                  {isFr ? 'Demander un Devis de Gros' : 'Request Wholesale Quote'}
                </button>
                <button
                  onClick={() => openWhatsApp(isFr ? 'Bonjour ! Je souhaite obtenir des informations pour une commande en gros ou un conteneur d’usine.' : 'Hello! I would like to inquire about wholesale container and factory sourcing.')}
                  className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-slate-700"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isFr ? 'Bureau WhatsApp B2B' : 'Wholesale WhatsApp Desk'}</span>
                </button>
              </div>
            </div>

            {/* Right Wholesale Details */}
            <div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-slate-800 space-y-3 sm:space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                {isFr ? 'Catégories Populaires de Gros' : 'Popular Wholesale Categories'}
              </h3>
              <div className="divide-y divide-slate-800 text-xs">
                <div className="py-2.5 sm:py-3 flex items-center justify-between">
                  <span>{isFr ? 'Baskets & Chaussures Sur Mesure' : 'Custom Footwear & Sneaker Lines'}</span>
                  <span className="text-[#F47721] font-bold">MOQ 50</span>
                </div>
                <div className="py-2.5 sm:py-3 flex items-center justify-between">
                  <span>{isFr ? 'Mèches Vierges & Perruques HD' : 'Raw Virgin Hair & HD Lace Bundles'}</span>
                  <span className="text-purple-300 font-bold">MOQ 10</span>
                </div>
                <div className="py-2.5 sm:py-3 flex items-center justify-between">
                  <span>{isFr ? 'Présentoirs Bijoux Acier 18K' : 'Stainless Steel 18K Jewelry Displays'}</span>
                  <span className="text-amber-400 font-bold">MOQ 30</span>
                </div>
                <div className="py-2.5 sm:py-3 flex items-center justify-between">
                  <span>{isFr ? 'Machines & Équipements Professionnels' : 'Commercial Equipment & Machinery'}</span>
                  <span className="text-emerald-400 font-bold">MOQ 1 unit</span>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{isFr ? 'Tarifs directs Guangzhou & Yiwu' : 'Direct Guangzhou & Yiwu rates'}</span>
                <span className="text-white font-bold">{isFr ? 'Inspection incluse' : 'Inspection included'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 7: HOW IT WORKS
          ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#F47721]">
            {isFr ? 'Un Processus Simple & Transparent' : 'Clear & Simple Sourcing'}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-[#171827] mt-1">
            {isFr ? 'Comment ça Marche' : 'How It Works'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {isFr
              ? 'Un déroulement clair en 5 étapes, de votre premier message jusqu’à la livraison finale.'
              : 'A seamless 5-step process from your first message to doorstep delivery.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 pt-2">
          {[
            {
              step: '01',
              title: isFr ? 'Envoyez Votre Produit' : 'Send Your Product',
              desc: isFr
                ? 'Transmettez photos, liens ou spécifications précises de ce que vous souhaitez commander en Chine.'
                : 'Provide photos, links, or specifications of what you want to source in China.'
            },
            {
              step: '02',
              title: isFr ? 'Sourcing en Chine' : 'Source in China',
              desc: isFr
                ? 'Nos agents sur place contactent les fabricants certifiés pour dénicher la meilleure qualité au tarif usine.'
                : 'Our local sourcing team searches verified suppliers and factories for the best quality and price.'
            },
            {
              step: '03',
              title: isFr ? 'Réception du Devis' : 'Quote Received',
              desc: isFr
                ? 'Vous recevez un devis transparent détaillant le coût produit, le contrôle qualité et l’estimation de transport.'
                : 'Receive a transparent quote including product cost, inspection, and estimated shipping.'
            },
            {
              step: '04',
              title: isFr ? 'Validation & Paiement' : 'Confirm & Pay',
              desc: isFr
                ? 'Validez votre commande et réglez en toute sécurité par Carte Internationale (Visa) ou PayPal.'
                : 'Confirm your order and pay securely via International Cards (Visa) or PayPal.'
            },
            {
              step: '05',
              title: isFr ? 'Expédition & Livraison' : 'Shipping & Delivery',
              desc: isFr
                ? 'Nous inspectons chaque article, soignons l’emballage et organisons la livraison suivie à votre adresse.'
                : 'We inspect the goods, pack securely, and arrange tracked delivery straight to your market.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t-2 border-slate-200 hover:border-[#5121A8] transition group"
            >
              <span className="text-xs font-black text-[#F47721] block tracking-wider">
                {isFr ? `ÉTAPE ${item.step}` : `STEP ${item.step}`}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-[#171827] leading-snug group-hover:text-[#5121A8] transition">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================================
          SECTION 8: PROMOTIONS & WHAT'S NEW
          ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#F47721]">
              {isFr ? 'Actualités' : "What's New"}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#171827] mt-1">
              {isFr ? 'Promotions & Nouveautés' : 'Promotions & Latest Drops'}
            </h2>
          </div>
          <a
            href="https://tiktok.com/@jonlineshopping"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5121A8] hover:text-[#F47721] transition self-start sm:self-auto"
          >
            <span>{isFr ? 'Suivez-nous sur TikTok →' : 'Follow us on TikTok →'}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200 pt-2">
          {/* Item 1: Freight Promotion */}
          <div className="space-y-2.5 pt-4 md:pt-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#F47721] block">
              Promotion
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#171827]">
              {isFr ? 'Regroupement Gratuit en Entrepôt à Guangzhou' : 'Free Guangzhou Warehouse Consolidation'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isFr
                ? 'Regroupez les achats de plusieurs usines chinoises dans un colis unique pour économiser jusqu’à 60% sur le fret aérien.'
                : 'Combine orders from multiple Chinese factories into a single parcel to save up to 60% on international air freight.'}
            </p>
            <div className="pt-1">
              <button
                onClick={() => setCurrentPage('shipping')}
                className="text-xs font-bold text-[#5121A8] hover:text-[#F47721] transition inline-flex items-center gap-1"
              >
                <span>{isFr ? 'Découvrir la consolidation' : 'Learn about consolidation'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Item 2: New Arrivals */}
          <div className="space-y-2.5 pt-4 md:pt-0 md:pl-8">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#5121A8] block">
              {isFr ? 'Nouveautés' : 'New Arrivals'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#171827]">
              {isFr ? 'Tendances Usines 2026 & Produits Populaires' : '2026 Factory Trends & Trending Catalog'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isFr
                ? 'Découvrez les dernières références tendances sourcées directement au marché de Yiwu et dans les marchés de mode de Guangzhou.'
                : 'Discover the latest viral products sourced directly from Yiwu Trade City and Guangzhou fashion markets.'}
            </p>
            <div className="pt-1">
              <button
                onClick={() => setCurrentPage('shop')}
                className="text-xs font-bold text-[#5121A8] hover:text-[#F47721] transition inline-flex items-center gap-1"
              >
                <span>{isFr ? 'Parcourir les nouveautés' : 'Browse new drops'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Item 3: Community & Hauls */}
          <div className="space-y-2.5 pt-4 md:pt-0 md:pl-8">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 block">
              {isFr ? 'Communauté & Réceptions' : 'Community & Hauls'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#171827]">
              {isFr ? 'Vidéos de Déballage & Colis Clients Réels' : 'Live Unboxing & Customer Sourcing Hauls'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isFr
                ? 'Consultez des vidéos réelles d’unboxing et les avis clients sur nos flux TikTok et Instagram avant de commander.'
                : 'See real unboxing videos and client reviews on our TikTok and Instagram feeds before you place your order.'}
            </p>
            <div className="pt-1 flex items-center gap-3">
              <a
                href="https://tiktok.com/@jonlineshopping"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#171827] hover:text-[#F47721] transition"
              >
                TikTok
              </a>
              <span className="text-slate-300">•</span>
              <a
                href="https://instagram.com/jonlineshopping"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#171827] hover:text-[#F47721] transition"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 9: PRE-SHIPMENT INSPECTION & QUALITY PROTOCOL
          ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#F47721]">
            {isFr ? 'Rigueur & Contrôle' : 'Procurement Integrity'}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-[#171827] mt-1">
            {isFr ? 'Protocoles de Contrôle Qualité' : 'Quality Inspection Standards'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {isFr
              ? 'Chaque envoi fait l’objet d’une vérification physique systématique avant tout départ de Chine.'
              : 'Every shipment undergoes rigorous multi-point physical verification before departure from China.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-[#5121A8] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#171827]">
                {isFr ? '01. Audit & Licences d’Usine' : '01. Factory License & Audit'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isFr
                  ? 'Vérification du registre de commerce chinois, des capacités de production et des autorisations d’exportation.'
                  : 'We verify manufacturer Unified Social Credit codes, on-site production capacity, export authorization, and compliance before committing client capital.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#5121A8]">
              <Check className="w-4 h-4" />
              <span>{isFr ? 'Contrat Direct Fabricant' : 'Direct Factory Contract'}</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#F47721] flex items-center justify-center font-bold">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#171827]">
                {isFr ? '02. Échantillonnage Norme AQL 2.5' : '02. AQL 2.5 Sampling Inspection'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isFr
                  ? 'Ouverture des cartons dans notre centre de Guangzhou : vérification dimensionnelle, finitions, tests des matériaux et vidéo HD.'
                  : 'Batches are unpacked in our Guangzhou facility for dimensional tolerance checks, material finish testing, barcode verification, and carton drop testing.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#F47721]">
              <Check className="w-4 h-4" />
              <span>{isFr ? 'Dossier Photos & Vidéos HD' : 'Photo & Video Dossier'}</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#171827]">
                {isFr ? '03. Consolidation & Dédouanement DDP' : '03. Cargo Consolidation & DDP'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isFr
                  ? 'Regroupement sécurisé sur palettes, établissement des factures conformes, codes douaniers et livraison porte-à-porte sans taxe imprévue.'
                  : 'Consignments from multiple suppliers are merged into single pallets or containers, with commercial invoices, HS codes, and export declarations prepared.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <Check className="w-4 h-4" />
              <span>{isFr ? 'Dédouanement Intégral Assuré' : 'Full Customs Clearance'}</span>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 10: WHATSAPP HIGH-VISIBILITY CTA
          ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="rounded-3xl bg-emerald-700 text-white p-6 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="max-w-xl space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{isFr ? 'Bureau d’Assistance WhatsApp' : 'Direct WhatsApp Support Desk'}</span>
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white">
              {isFr ? 'Vous ne trouvez pas ce que vous cherchez ?' : "Can't find what you're looking for?"}
            </h2>
            <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed">
              {isFr
                ? 'Envoyez-nous une photo ou un lien directement sur WhatsApp. Nos chargés de sourcing bilingues vous répondent rapidement avec prix et disponibilités.'
                : 'Send us a photo or link directly on WhatsApp. Our bilingual sourcing coordinators in Guangzhou reply quickly with availability and quotes.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => openWhatsApp(isFr ? 'Bonjour ! Pouvez-vous m’aider à trouver ce produit en Chine ?' : 'Hello! Can you help me find this product in China?')}
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>{isFr ? 'Échanger sur WhatsApp' : 'Ask on WhatsApp'}</span>
            </button>
            <button
              onClick={() => setCurrentPage('request')}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition border border-emerald-600/40 text-center"
            >
              <span>{isFr ? 'Déposer une Photo en Ligne' : 'Upload Photo Online'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};