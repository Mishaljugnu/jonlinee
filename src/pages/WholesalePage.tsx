import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  Building2,
  Boxes,
  Ship,
  MessageCircle,
  Layers,
  CheckCircle2,
  Send
} from 'lucide-react';

export const WholesalePage: React.FC = () => {
  const { lang, t } = useTranslation();
  const { openWhatsApp, showToast } = useApp();

  const isFr = lang === 'fr';

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [destination, setDestination] = useState('');
  const [productsRequired, setProductsRequired] = useState('');
  const [budget, setBudget] = useState('');
  const [shippingPref, setShippingPref] = useState('Air Cargo DDP');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp.trim() || !productsRequired.trim()) {
      showToast(isFr ? 'Veuillez renseigner votre WhatsApp et les produits souhaités' : 'Please provide your WhatsApp number and products needed', 'error');
      return;
    }

    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: `[B2B Wholesale] ${productsRequired.slice(0, 80)}`,
          orderType: 'wholesale',
          quantity: 100,
          destinationCountry: destination || (isFr ? 'International' : 'International'),
          customerName: `${contactName} (${companyName || 'Business'})`,
          customerWhatsapp: whatsapp,
          customerEmail: email,
          specifications: `Budget: ${budget} | Shipping: ${shippingPref}`,
          notes: productsRequired
        })
      });
      setSubmitted(true);
      showToast(isFr ? 'Demande de gros bien enregistrée ! Notre responsable B2B vous contacte.' : 'Wholesale inquiry submitted! Our B2B manager will contact you.', 'success');
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-20 pb-16 w-full max-w-full overflow-hidden">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-12 sm:py-20 border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 text-center space-y-5">
          <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.wholesalePage.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            {t.wholesalePage.title}
          </h1>
          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t.wholesalePage.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <a
              href="#quote-form"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-orange-600/30 text-center"
            >
              {t.home.wholesaleBannerBtn}
            </a>
            <button
              onClick={() => openWhatsApp(isFr ? 'Bonjour ! Je souhaite échanger avec votre cellule Grands Comptes / Sourcing de Gros en Chine.' : 'Hello! I would like to speak directly with your China B2B Wholesale team.')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isFr ? 'Bureau WhatsApp B2B' : 'B2B WhatsApp Desk'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 B2B Pillars */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            {isFr ? 'Sourcing B2B Industriel' : 'Industrial Scale Sourcing'}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t.wholesalePage.pillarsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { title: t.wholesalePage.p1Title, desc: t.wholesalePage.p1Desc, icon: Building2, color: 'text-indigo-600', border: 'hover:border-indigo-600' },
            { title: t.wholesalePage.p2Title, desc: t.wholesalePage.p2Desc, icon: Layers, color: 'text-orange-600', border: 'hover:border-orange-500' },
            { title: t.wholesalePage.p3Title, desc: t.wholesalePage.p3Desc, icon: Boxes, color: 'text-emerald-600', border: 'hover:border-emerald-500' },
            { title: t.wholesalePage.p4Title, desc: t.wholesalePage.p4Desc, icon: Ship, color: 'text-sky-600', border: 'hover:border-sky-500' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`border-t-2 border-slate-200 ${item.border} transition pt-4 space-y-2.5`}
              >
                <div className={`w-10 h-10 rounded-xl bg-slate-50 ${item.color} flex items-center justify-center font-bold`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Industrial Hubs & Geography */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-12 border border-slate-800 space-y-6 sm:space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {isFr ? 'Présence Physique sur le Terrain' : 'On-The-Ground Presence'}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              {isFr ? 'Accès Direct aux Principaux Pôles Industriels Chinois' : 'Direct Access to China’s Leading Production Hubs'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {isFr
                ? 'Nos équipes et inspecteurs interviennent directement dans les principaux bassins manufacturiers de Chine :'
                : "We physically deploy inspectors and agents across China's major specialized manufacturing zones:"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="space-y-1 sm:pr-4 pt-3 sm:pt-0">
              <span className="text-orange-400 font-bold block text-sm">Guangzhou & Foshan</span>
              <p className="text-slate-300 leading-relaxed">
                {isFr ? 'Confection textile, tissus, sacs à main en cuir, cosmétiques, mobilier et céramique.' : 'Garments, fabrics, leather handbags, cosmetics, furniture, tile and ceramics.'}
              </p>
            </div>
            <div className="space-y-1 pt-3 sm:pt-0 sm:px-4">
              <span className="text-orange-400 font-bold block text-sm">Yiwu Trade City</span>
              <p className="text-slate-300 leading-relaxed">
                {isFr ? 'Plus grand marché mondial de biens d’équipement : bijoux, jouets, papeterie, quincaillerie, ustensiles.' : "World's largest commodities market: jewelry, toys, stationery, hardware, kitchenware."}
              </p>
            </div>
            <div className="space-y-1 pt-3 sm:pt-0 sm:px-4">
              <span className="text-orange-400 font-bold block text-sm">Shenzhen & Dongguan</span>
              <p className="text-slate-300 leading-relaxed">
                {isFr ? 'Électronique grand public, accessoires connectés, éclairages LED, moules de haute précision.' : 'Consumer electronics, mobile accessories, LED displays, high-tech molds.'}
              </p>
            </div>
            <div className="space-y-1 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-orange-400 font-bold block text-sm">Jinjiang & Wenzhou</span>
              <p className="text-slate-300 leading-relaxed">
                {isFr ? 'Chaussures de sport, baskets de mode, montures optiques et maroquinerie.' : 'Sneakers, sports footwear, casual shoes, optical frames and leather apparel.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Quote Form */}
      <section id="quote-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {t.wholesalePage.formTitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {t.wholesalePage.formSubtitle}
            </p>
          </div>

          {submitted ? (
            <div className="p-8 sm:p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {isFr ? 'Demande de Gros Bien Reçue !' : 'Inquiry Received!'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {isFr
                  ? 'Merci. Notre responsable B2B analyse votre cahier des charges et prendra contact sous 12 heures via WhatsApp et email.'
                  : 'Thank you. Our B2B sourcing director will review your project and contact you via WhatsApp and email within 12 hours.'}
              </p>
              <button
                onClick={() => openWhatsApp(isFr ? `Bonjour ! J'ai déposé une demande de gros pour ${companyName || 'mon entreprise'}.` : `Hello! I just submitted the wholesale sourcing form for ${companyName || 'my company'}.`)}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                {isFr ? 'Échanger sur WhatsApp dès maintenant' : 'Chat on WhatsApp Now'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.wholesalePage.companyName}
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Global Trading SARL"
                    className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.wholesalePage.contactName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.wholesalePage.whatsapp} *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+33 6... / +225 07..."
                    className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.wholesalePage.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="purchasing@company.com"
                    className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.wholesalePage.country}
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={isFr ? 'Ex : Port d’Abidjan, Le Havre, Dakar...' : 'e.g. Abidjan Port / Le Havre / Dakar'}
                    className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {t.wholesalePage.productsRequired} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={productsRequired}
                  onChange={(e) => setProductsRequired(e.target.value)}
                  placeholder={isFr ? 'Décrivez les produits, quantités, spécifications et volumes recherchés...' : 'Describe your desired products, quantities, specifications, target volumes...'}
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.wholesalePage.estimatedBudget}
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder={isFr ? 'Ex : 5 000 $ - 15 000 $ ou conteneur 40HQ' : 'e.g. $5,000 - $15,000 or 1 x 40HQ container'}
                    className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.wholesalePage.additionalInfo}
                  </label>
                  <select
                    value={shippingPref}
                    onChange={(e) => setShippingPref(e.target.value)}
                    className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden bg-white"
                  >
                    <option value="Air Cargo DDP">{isFr ? 'Fret Aérien DDP Porte-à-Porte' : 'Air Cargo Door-to-Door (DDP)'}</option>
                    <option value="Sea LCL DDP">{isFr ? 'Groupage Maritime LCL DDP' : 'Sea Cargo LCL Groupage (DDP)'}</option>
                    <option value="Sea FCL (20GP / 40HQ)">{isFr ? 'Conteneur Complet FCL (20GP / 40HQ)' : 'Full Container Load FCL (20GP / 40HQ)'}</option>
                    <option value="Express DHL/FedEx">{isFr ? 'Courrier Express (DHL / FedEx)' : 'International Express (DHL / FedEx)'}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-indigo-700 hover:bg-indigo-600 text-white font-black text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t.wholesalePage.submitQuote}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
