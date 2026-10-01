import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  Plane,
  Ship,
  Calculator,
  Clock,
  MessageCircle
} from 'lucide-react';

export const ShippingPage: React.FC = () => {
  const { lang, t, formatPrice } = useTranslation();
  const { settings, openWhatsApp, setCurrentPage } = useApp();

  const isFr = lang === 'fr';

  // Calculator State
  const [region, setRegion] = useState('Europe');
  const [mode, setMode] = useState<'air' | 'sea' | 'express'>('air');
  const [weightKg, setWeightKg] = useState<number>(5);
  const [volumeCbm, setVolumeCbm] = useState<number>(0.1);

  // Region freight multipliers
  const REGION_OPTIONS = [
    { id: 'Europe', label: isFr ? 'Europe (France, Belgique, Suisse...)' : 'Europe (France, Belgium, Switzerland...)' },
    { id: 'West Africa (Abidjan, Dakar, Lome, Cotonou, Douala)', label: isFr ? 'Afrique de l’Ouest (Abidjan, Dakar, Lomé, Cotonou, Douala)' : 'West Africa (Abidjan, Dakar, Lome, Cotonou, Douala)' },
    { id: 'North America (USA / Canada)', label: isFr ? 'Amérique du Nord (USA / Canada)' : 'North America (USA / Canada)' },
    { id: 'Central / East Africa (Kinshasa, Nairobi, Kigali)', label: isFr ? 'Afrique Centrale / Est (Kinshasa, Nairobi, Kigali)' : 'Central / East Africa (Kinshasa, Nairobi, Kigali)' },
    { id: 'Middle East (Dubai, Riyadh)', label: isFr ? 'Moyen-Orient (Dubaï, Riyad)' : 'Middle East (Dubai, Riyadh)' },
  ];

  const REGION_MULTIPLIERS: Record<string, number> = {
    'Europe': 1.0,
    'West Africa (Abidjan, Dakar, Lome, Cotonou, Douala)': 1.15,
    'North America (USA / Canada)': 1.05,
    'Central / East Africa (Kinshasa, Nairobi, Kigali)': 1.25,
    'Middle East (Dubai, Riyadh)': 0.95,
  };

  const calculateEstimate = () => {
    const mult = REGION_MULTIPLIERS[region] || 1.0;
    const rates = settings.shippingRates;

    if (mode === 'air') {
      const effectiveKg = Math.max(rates.minAirKg, weightKg);
      return effectiveKg * rates.airFreightPerKg * mult;
    } else if (mode === 'sea') {
      const effectiveCbm = Math.max(rates.minSeaCbm, volumeCbm);
      return effectiveCbm * rates.seaFreightPerCbm * mult;
    } else {
      const effectiveKg = Math.max(1, weightKg);
      return effectiveKg * rates.expressPerKg * mult;
    }
  };

  const estimatedCost = calculateEstimate();

  return (
    <div className="space-y-12 sm:space-y-20 pb-16 w-full max-w-full overflow-hidden">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-12 sm:py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Plane className="w-3.5 h-3.5" />
            <span>{t.shippingPage.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight">
            {t.shippingPage.title}
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.shippingPage.subtitle}
          </p>
        </div>
      </section>

      {/* Shipping Modes Cards */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Air Cargo */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Plane className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {t.shippingPage.airTitle}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.shippingPage.airDesc}
            </p>
            <div className="pt-2 space-y-2 text-xs border-t border-slate-100">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold">{isFr ? 'Délai d’acheminement :' : 'Estimated Transit:'}</span>
                <span className="text-orange-600 font-extrabold">{t.shippingPage.airTime}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold">{isFr ? 'Poids minimum :' : 'Minimum Cargo:'}</span>
                <span>{t.shippingPage.airMin}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold">{isFr ? 'Dédouanement :' : 'Customs:'}</span>
                <span className="text-emerald-700 font-semibold">{t.shippingPage.airDDP}</span>
              </div>
            </div>
          </div>

          {/* Sea Freight */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Ship className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {t.shippingPage.seaTitle}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.shippingPage.seaDesc}
            </p>
            <div className="pt-2 space-y-2 text-xs border-t border-slate-100">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold">{isFr ? 'Délai d’acheminement :' : 'Estimated Transit:'}</span>
                <span className="text-indigo-600 font-extrabold">{t.shippingPage.seaTime}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold">{isFr ? 'Volume minimum :' : 'Minimum Cargo:'}</span>
                <span>{t.shippingPage.seaMin}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold">{isFr ? 'Dédouanement :' : 'Customs:'}</span>
                <span className="text-emerald-700 font-semibold">{t.shippingPage.seaPort}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Shipping Cost Calculator */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-8 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block">
                {isFr ? 'Calculateur Instantané' : 'Instant Estimator'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold">
                {t.shippingPage.calcTitle}
              </h2>
              <p className="text-xs text-slate-300">
                {t.shippingPage.calcSubtitle}
              </p>
            </div>
            <Calculator className="w-8 h-8 text-orange-400 hidden sm:block" />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Destination Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {t.shippingPage.destLabel}
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden bg-white"
              >
                {REGION_OPTIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Transport Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {t.shippingPage.methodLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'air', label: t.shippingPage.modeAir, icon: Plane },
                  { id: 'sea', label: t.shippingPage.modeSea, icon: Ship },
                  { id: 'express', label: t.shippingPage.modeExpress, icon: Clock },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id as any)}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                        mode === m.id
                          ? 'border-orange-600 bg-orange-50/70 text-orange-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-orange-600 shrink-0" />
                      <span className="text-xs">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weight / Volume Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode !== 'sea' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.shippingPage.weightLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                    className="w-full text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isFr
                      ? `Tarif indicatif : ~${settings.shippingRates.airFreightPerKg} $/kg (Aérien DDP dédouané)`
                      : `Base rate: ~${settings.shippingRates.airFreightPerKg}/kg (Air DDP)`}
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.shippingPage.volumeLabel}
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={volumeCbm}
                    onChange={(e) => setVolumeCbm(parseFloat(e.target.value) || 0.1)}
                    className="w-full text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isFr
                      ? `Tarif indicatif : ~${settings.shippingRates.seaFreightPerCbm} $/m³ (Groupage Maritime LCL)`
                      : `Base rate: ~${settings.shippingRates.seaFreightPerCbm}/CBM (Sea LCL)`}
                  </span>
                </div>
              )}

              {/* Estimate Result Box */}
              <div className="p-4 rounded-xl bg-slate-50 flex flex-col justify-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {t.shippingPage.estCost}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-orange-600">
                  {formatPrice(estimatedCost)}
                </div>
                <span className="text-[10px] text-slate-500 mt-1">
                  {isFr ? 'Comprend consolidation & dédouanement export' : 'Includes consolidation & export clearance'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              {t.shippingPage.estNotice}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  const msg = isFr
                    ? `Bonjour J Online Shopping ! J'ai utilisé votre calculateur de fret :
Destination : ${region}
Mode : ${mode.toUpperCase()}
Poids/Volume : ${mode === 'sea' ? `${volumeCbm} m³` : `${weightKg} kg`}
Estimation : ${estimatedCost.toFixed(2)} $

Pouvez-vous me confirmer les prochains départs de vol ou navire depuis Guangzhou ?`
                    : `Hello J Online Shopping! I used your freight calculator:
Destination: ${region}
Mode: ${mode.toUpperCase()}
Weight/Volume: ${mode === 'sea' ? `${volumeCbm} CBM` : `${weightKg} kg`}
Estimated: $${estimatedCost.toFixed(2)} USD

Could you confirm current flight/ship departure dates from Guangzhou?`;
                  openWhatsApp(msg);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isFr ? 'Confirmer le Tarif sur WhatsApp' : 'Confirm Rate on WhatsApp'}</span>
              </button>
              <button
                onClick={() => setCurrentPage('request')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <span>{isFr ? 'D’abord Sourcer un Produit' : 'Source Products First'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
