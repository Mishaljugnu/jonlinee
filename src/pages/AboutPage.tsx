import React from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const { settings } = useApp();

  const isFr = lang === 'fr';

  return (
    <div className="space-y-12 sm:space-y-20 pb-16 w-full max-w-full overflow-hidden">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-12 sm:py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.aboutPage.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight">
            {t.aboutPage.title}
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.aboutPage.subtitle}
          </p>
        </div>
      </section>

      {/* Story & Background */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block">
              {isFr ? 'Notre Mission' : 'Our Genesis'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {isFr ? 'Vous relier directement aux usines manufacturières du monde' : 'Bridging You to the World’s Factory Floor'}
            </h2>
            <p>{t.aboutPage.p1}</p>
            <p>{t.aboutPage.p2}</p>
          </div>

          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80"
              alt={isFr ? 'Opérations et logistique en Chine' : 'Guangzhou Trade and Port'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5 sm:p-6">
              <div className="text-white text-xs space-y-1">
                <span className="font-bold block text-sm">
                  {isFr ? 'Opérations Guangzhou & Yiwu' : 'Guangzhou & Yiwu Operations'}
                </span>
                <span className="text-slate-300">
                  {isFr ? 'Présence physique quotidienne au cœur des marchés de gros chinois' : 'Daily physical presence across Chinese wholesale markets'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            {isFr ? 'Nos Engagements' : 'Integrity First'}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t.aboutPage.valuesTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="border-t-2 border-slate-200 hover:border-orange-500 transition pt-4 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">{t.aboutPage.v1}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.aboutPage.v1d}</p>
          </div>

          <div className="border-t-2 border-slate-200 hover:border-indigo-500 transition pt-4 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">{t.aboutPage.v2}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.aboutPage.v2d}</p>
          </div>

          <div className="border-t-2 border-slate-200 hover:border-emerald-500 transition pt-4 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">{t.aboutPage.v3}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.aboutPage.v3d}</p>
          </div>
        </div>
      </section>

      {/* Offices and Facilities */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 text-center sm:text-left">
          {isFr ? 'Nos Centres Opérationnels en Chine' : 'Physical Hubs in China'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-xs">
          <div className="border-t-2 border-orange-500 pt-4 space-y-2">
            <span className="font-bold text-orange-600 block text-sm">
              {isFr ? 'Bureau Central & Sourcing de Guangzhou' : 'Guangzhou Sourcing HQ'}
            </span>
            <p className="text-slate-600 leading-relaxed">
              {settings.chinaOffice}
            </p>
            <div className="pt-2 text-slate-400">
              {isFr ? 'Pôles principaux : Mode, prêt-à-porter, maroquinerie, électronique, contrats usines et conteneurs B2B.' : 'Primary focus: Fashion, electronics, cosmetics, factory contracts and B2B orders.'}
            </div>
          </div>

          <div className="border-t-2 border-indigo-500 pt-4 space-y-2">
            <span className="font-bold text-indigo-600 block text-sm">
              {isFr ? 'Centre Logistique & Regroupement de Yiwu' : 'Yiwu Consolidation Hub'}
            </span>
            <p className="text-slate-600 leading-relaxed">
              {settings.chinaWarehouse}
            </p>
            <div className="pt-2 text-slate-400">
              {isFr ? 'Pôles principaux : Bijoux, articles de consommation, quincaillerie, entreposage, consolidation et empotage.' : 'Primary focus: Small commodities, jewelry, cargo storage, order consolidation and container stuffing.'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
