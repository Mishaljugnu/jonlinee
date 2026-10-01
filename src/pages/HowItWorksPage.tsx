import React from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  UploadCloud,
  Search,
  FileCheck,
  CreditCard,
  Plane,
  ShieldCheck,
  CheckCircle2,
  Video,
  Boxes,
  MessageCircle
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const { setCurrentPage, openWhatsApp } = useApp();

  const isFr = lang === 'fr';

  const steps = [
    {
      num: '01',
      title: t.steps.step1.title,
      desc: t.steps.step1.desc,
      icon: UploadCloud,
      detailPoints: isFr ? [
        'Téléversez des photos nettes de vos produits, captures TikTok/Instagram ou liens web',
        'Indiquez les quantités souhaitées, coloris, tailles ou besoins de personnalisation / logo',
        'Précisez votre pays et ville de destination pour le calcul exact du fret'
      ] : [
        'Upload clear product photos, TikTok/Instagram screenshots, or product links',
        'Specify desired quantities, colors, size variations, or custom branding',
        'Tell us your destination market and delivery deadline'
      ]
    },
    {
      num: '02',
      title: t.steps.step2.title,
      desc: t.steps.step2.desc,
      icon: Search,
      detailPoints: isFr ? [
        'Notre équipe locale contacte directement les fabricants d’origine à Guangzhou, Yiwu et Shenzhen',
        'Nous mettons plusieurs usines en concurrence pour éliminer les marges d’intermédiaires',
        'Nous contrôlons le registre de commerce officiel et la capacité réelle de production'
      ] : [
        'Our native Chinese team contacts primary manufacturers directly in Guangzhou, Yiwu, and Shenzhen',
        'We compare multiple factories to eliminate trading middleman markups',
        'We verify supplier business licenses, factory audits, and real manufacturing capacity'
      ]
    },
    {
      num: '03',
      title: t.steps.step3.title,
      desc: t.steps.step3.desc,
      icon: FileCheck,
      detailPoints: isFr ? [
        'Vous recevez un devis détaillé et transparent sous 24 heures ouvrées',
        'Détail clair : tarif unitaire d’usine, délai de fabrication et options d’acheminement',
        'Aucun frais masqué : droits de douane, consolidation et manutention sont précisés'
      ] : [
        'You receive an itemized official quotation within 24 hours',
        'Clear breakdown: factory unit price, production timeline, and shipping freight options',
        'No hidden surprise fees: customs duties, consolidation, and handling are clarified'
      ]
    },
    {
      num: '04',
      title: t.steps.step4.title,
      desc: t.steps.step4.desc,
      icon: CreditCard,
      detailPoints: isFr ? [
        'Vous validez le devis et confirmez votre commande',
        'Règlement sécurisé par Carte Internationale (Visa) ou PayPal',
        'Lancement immédiat de la fabrication ou des achats en usine dès confirmation'
      ] : [
        'Approve the quote and confirm your order',
        'Secure payment accepted via International Cards (Visa) or PayPal',
        'Production or factory procurement is initiated immediately upon confirmation'
      ]
    },
    {
      num: '05',
      title: t.steps.step5.title,
      desc: t.steps.step5.desc,
      icon: Plane,
      detailPoints: isFr ? [
        'Arrivée de vos articles dans notre centre de regroupement à Guangzhou ou Yiwu',
        'Vérification physique détaillée et envoi de photos / vidéos HD sur votre WhatsApp',
        'Conditionnement renforcé, déclaration douanière export, expédition sécurisée et suivi en direct'
      ] : [
        'Products arrive at our Guangzhou/Yiwu consolidation warehouse',
        'Our team records high-definition inspection photos and videos before packing',
        'Consolidated export packaging, export clearance, international freight, and tracking updates'
      ]
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-16 w-full max-w-full overflow-hidden">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-12 sm:py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            {isFr ? 'Sourcing en Chine Simplifié' : 'China Sourcing Simplified'}
          </span>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight">
            {t.home.howItWorksTitle}
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.home.howItWorksSubtitle}
          </p>
        </div>
      </section>

      {/* Detailed Steps Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative pl-6 sm:pl-10 space-y-10 sm:space-y-12 border-l-2 border-slate-200">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-0 w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-white border-2 border-orange-500 text-orange-600 font-black text-xs sm:text-sm flex items-center justify-center shadow-xs">
                  {step.num}
                </div>

                {/* Content */}
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base sm:text-xl">
                    <Icon className="w-5 h-5 text-orange-600 shrink-0" />
                    <h2>{step.title}</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                    {step.desc}
                  </p>

                  {/* Bullet points */}
                  <div className="pt-2 space-y-1.5">
                    {step.detailPoints.map((pt, pidx) => (
                      <div key={pidx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quality Control & Warehouse Protocol */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-12 border border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {isFr ? 'Contrôle Qualité Rigoureux' : 'Rigorous Quality Control'}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              {isFr ? 'Vos Yeux et Vos Oreilles sur le Terrain en Chine' : 'We Are Your Eyes & Ears on the Ground in China'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isFr
                ? 'Acheter à des milliers de kilomètres exige une confiance fondée sur la vérification. Dans nos entrepôts de Guangzhou et Yiwu, chaque commande est inspectée :'
                : 'When buying from thousands of miles away, trust requires verification. In our Guangzhou and Yiwu logistics centers, every order undergoes:'}
            </p>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFr ? 'Dossier photo et vidéo HD transmis sur votre WhatsApp avant envoi' : 'HD photo and live video documentation sent to your WhatsApp'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFr ? 'Contrôle matière, coutures, dimensions, finitions et fonctionnement électrique' : 'Fabric, stitching, dimensions, and electrical function checks'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFr ? 'Emballage renforcé étanche avec cornières de protection antichoc' : 'Reinforced waterproof packaging and corner protectors for international transit'}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 text-xs lg:pl-10 lg:border-l lg:border-slate-800">
            <h3 className="font-bold text-base text-white">
              {isFr ? 'L’Avantage Majeur du Regroupement en Entrepôt' : 'Why Warehouse Consolidation Matters'}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {isFr
                ? 'Si vous achetez auprès de 5 usines distinctes en Chine de manière isolée, vous payez 5 fois les frais de dossier et les coûts fixes de fret aérien international.'
                : 'If you purchase from 5 different suppliers in China individually, you pay 5 separate international shipping base rates and custom fees.'}
            </p>
            <div className="pt-3 border-t border-slate-800 text-orange-300 leading-relaxed space-y-1">
              <strong className="text-orange-400 block font-bold">
                {isFr ? 'La Consolidation J Online Shopping :' : 'J Online Shopping Consolidation:'}
              </strong>
              <p>
                {isFr
                  ? 'Tous vos colis sont centralisés dans notre entrepôt de Guangzhou, inspectés, reconditionnés dans un carton unique renforcé et expédiés ensemble. Vous économisez jusqu’à 60% sur le fret.'
                  : 'All your packages arrive at our warehouse, are inspected, re-boxed into a single master cargo, and shipped together, saving you up to 60% on international shipping.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          {isFr ? 'Prêt à Sourcer Votre Premier Produit ?' : 'Ready to Source Your First Product?'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          {isFr
            ? 'Envoyez-nous une photo ou vos spécifications, et obtenez votre devis complet sous 24 heures.'
            : 'Send us a photo or specification, and receive your quotation within 24 hours.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage('request')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
          >
            <span>{t.hero.requestBtn}</span>
          </button>
          <button
            onClick={() => openWhatsApp(isFr ? 'Bonjour ! Je souhaite poser une question sur le fonctionnement du sourcing en Chine.' : 'Hello! I have a question about how your China sourcing works.')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isFr ? 'Poser une question sur WhatsApp' : 'Ask a Question on WhatsApp'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
