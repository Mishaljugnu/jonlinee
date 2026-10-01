import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  UploadCloud,
  X,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Plane,
  Building2,
  Copy,
  Check,
  ArrowRight,
  Info,
  Clock,
  Send
} from 'lucide-react';
import { SourcingRequest } from '../types.ts';

export const RequestProductPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const { pageParams, openWhatsApp, showToast, setCurrentPage } = useApp();

  // Form State
  const [productName, setProductName] = useState(pageParams.prefill || '');
  const [images, setImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<'retail' | 'wholesale'>('retail');
  const [targetBudget, setTargetBudget] = useState('');
  const [targetSize, setTargetSize] = useState('');
  const [targetColor, setTargetColor] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('France');
  const [destinationCity, setDestinationCity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');

  // UI state
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<SourcingRequest | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pageParams.prefill) {
      setProductName(pageParams.prefill);
    }
  }, [pageParams.prefill]);

  // Customer uploads are anonymous, so send the image as JSON to the public upload endpoint.
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newUrls: string[] = [];
    let rejected = 0;

    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        rejected++;
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        rejected++;
        continue;
      }

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
          body: JSON.stringify({
            data: dataUrl,
            filename: file.name,
            mimeType: file.type,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed');
        newUrls.push(data.url);
      } catch (err) {
        console.warn('Image upload failed:', err);
        rejected++;
      }
    }

    setImages(prev => [...prev, ...newUrls].slice(0, 5));
    setUploading(false);
    if (newUrls.length) showToast(`${newUrls.length} image(s) attached`, 'success');
    if (rejected) showToast(`${rejected} image(s) could not be uploaded. Use JPG, PNG, or WebP under 5MB.`, 'error');
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) {
      showToast('Please enter the product name or description', 'error');
      return;
    }
    if (images.length === 0) {
      showToast('Please attach at least one photo or reference image', 'error');
      return;
    }
    if (!customerWhatsapp.trim()) {
      showToast('Please enter your WhatsApp phone number', 'error');
      return;
    }
    if (!customerName.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }

    setSubmitting(true);

    const payload = {
      productName: productName.trim(),
      images,
      quantity,
      orderType,
      targetBudget: targetBudget.trim() || undefined,
      targetSize: targetSize.trim() || undefined,
      targetColor: targetColor.trim() || undefined,
      specifications: specifications.trim() || undefined,
      destinationCountry: destinationCountry.trim(),
      destinationCity: destinationCity.trim() || undefined,
      customerName: customerName.trim(),
      customerWhatsapp: customerWhatsapp.trim(),
      customerEmail: customerEmail.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();
      setSubmittedRequest(data);
      showToast('Sourcing request submitted successfully!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      showToast('Error submitting request. Please try again or chat via WhatsApp directly.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueOnWhatsApp = () => {
    if (!submittedRequest) return;
    const isFr = lang === 'fr';
    const msg = isFr
      ? `Bonjour J Online Shopping ! Je viens de déposer une demande de sourcing direct en Chine :
• Produit : ${submittedRequest.productName}
• Quantité : ${submittedRequest.quantity} (${submittedRequest.orderType === 'wholesale' ? 'Gros' : 'Détail'})
• Destination : ${submittedRequest.destinationCountry}${submittedRequest.destinationCity ? `, ${submittedRequest.destinationCity}` : ''}
${submittedRequest.targetBudget ? `• Budget cible : ${submittedRequest.targetBudget}\n` : ''}${submittedRequest.notes ? `• Remarques : ${submittedRequest.notes}\n` : ''}
Votre équipe à Guangzhou peut-elle vérifier la disponibilité en usine et me transmettre le devis ? Merci !`
      : `Hello J Online Shopping! I have just submitted a China sourcing request:
• Product: ${submittedRequest.productName}
• Quantity: ${submittedRequest.quantity} (${submittedRequest.orderType})
• Destination: ${submittedRequest.destinationCountry}${submittedRequest.destinationCity ? `, ${submittedRequest.destinationCity}` : ''}
${submittedRequest.targetBudget ? `• Target Budget: ${submittedRequest.targetBudget}\n` : ''}${submittedRequest.notes ? `• Notes: ${submittedRequest.notes}\n` : ''}
Could your sourcing team in Guangzhou check supplier availability and pricing for me? Thank you!`;
    openWhatsApp(msg);
  };

  const isFr = lang === 'fr';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 w-full max-w-full overflow-hidden">
      {/* Header Badge & Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider">
          <span>{t.requestPage.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.requestPage.title}
        </h1>
        <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
          {t.requestPage.subtitle}
        </p>
      </div>

      {/* Success View */}
      {submittedRequest ? (
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl p-6 sm:p-10 space-y-6 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              {t.requestPage.successTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              {t.requestPage.successMsg}
            </p>
          </div>

          {/* Sourcing Summary Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs text-slate-700">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
              {isFr ? 'Récapitulatif de votre demande :' : 'Request Details:'}
            </div>
            <div><strong>{isFr ? 'Produit :' : 'Product:'}</strong> {submittedRequest.productName}</div>
            <div><strong>{isFr ? 'Quantité :' : 'Quantity:'}</strong> {submittedRequest.quantity} ({submittedRequest.orderType === 'wholesale' ? (isFr ? 'Gros' : 'Wholesale') : (isFr ? 'Détail' : 'Retail')})</div>
            <div><strong>{isFr ? 'Destination :' : 'Destination:'}</strong> {submittedRequest.destinationCountry}</div>
            <div><strong>{isFr ? 'Contact :' : 'Contact:'}</strong> {submittedRequest.customerName} ({submittedRequest.whatsapp})</div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleContinueOnWhatsApp}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.requestPage.continueWhatsapp}</span>
            </button>
            <button
              onClick={() => {
                setSubmittedRequest(null);
                setProductName('');
                setImages([]);
                setNotes('');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition"
            >
              <span>+ {t.requestPage.submitAnother}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {t.requestPage.cardTitle}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {t.requestPage.cardSubtitle}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-orange-400 font-semibold bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-4 h-4" />
              <span>{isFr ? 'Réponse Sourcing sous 24h' : '24h Sourcing Turnaround'}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Step 1: Product Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-orange-600 flex items-center gap-2 pb-2 border-b border-slate-100">
                <span>{t.requestPage.step1Title}</span>
              </h3>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {t.requestPage.productNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={t.requestPage.productNamePlaceholder}
                  className="w-full text-xs sm:text-sm text-slate-900 p-3.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-hidden"
                />
              </div>

              {/* Photos Upload Zone */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    {t.requestPage.imagesLabel}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {images.length} photo(s) selected
                  </span>
                </div>

                {/* Drop Area */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition bg-slate-50 hover:bg-orange-50/20 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-orange-600 mx-auto transition mb-2" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600 block">
                    {uploading ? 'Processing & Uploading...' : t.requestPage.uploadButton}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                    {t.requestPage.imagesHint}
                  </p>
                </div>

                {/* Thumbnails of attached images */}
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Quantities & Specifications */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-orange-600 flex items-center gap-2 pb-2 border-b border-slate-100">
                <span>{t.requestPage.step2Title}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.requestPage.quantityLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* Order Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.requestPage.orderTypeLabel}
                  </label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="w-full text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden bg-white"
                  >
                    <option value="retail">{t.requestPage.retailOption}</option>
                    <option value="wholesale">{t.requestPage.wholesaleOption}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Target Budget */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.requestPage.targetBudgetLabel}
                  </label>
                  <input
                    type="text"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(e.target.value)}
                    placeholder={t.requestPage.targetBudgetPlaceholder}
                    className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* Size / Dimensions */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.requestPage.sizeLabel}
                  </label>
                  <input
                    type="text"
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    placeholder={t.requestPage.sizePlaceholder}
                    className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.requestPage.colorLabel}
                  </label>
                  <input
                    type="text"
                    value={targetColor}
                    onChange={(e) => setTargetColor(e.target.value)}
                    placeholder={t.requestPage.colorPlaceholder}
                    className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Specs & Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {t.requestPage.specsLabel}
                </label>
                <textarea
                  rows={3}
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder={t.requestPage.specsPlaceholder}
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Step 3: Destination & Contact */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-orange-600 flex items-center gap-2 pb-2 border-b border-slate-100">
                <span>{t.requestPage.step3Title}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Destination Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.requestPage.countryLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    placeholder="e.g. France, Côte d'Ivoire, USA, Senegal, Canada..."
                    className="w-full text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.requestPage.cityLabel}
                  </label>
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder="e.g. Paris, Abidjan, New York, Dakar..."
                    className="w-full text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.requestPage.customerNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.requestPage.whatsappLabel}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                    placeholder={t.requestPage.whatsappPlaceholder}
                    className="w-full text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.requestPage.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Extra Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {t.requestPage.notesLabel}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.requestPage.notesPlaceholder}
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black text-sm transition shadow-xl shadow-orange-600/25 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>{t.requestPage.submitting}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.requestPage.submitBtn}</span>
                  </>
                )}
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {isFr ? 'Aucun frais de sourcing préalable. Vous validez le devis avant tout paiement.' : 'No upfront sourcing fee. We quote before you pay.'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  {isFr ? 'Inspection vidéo dans nos entrepôts de Guangzhou et Yiwu.' : 'Inspected in our Guangzhou & Yiwu facilities.'}
                </span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
