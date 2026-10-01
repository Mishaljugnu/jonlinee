import React from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Scale, ArrowLeft, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { lang } = useTranslation();
  const { setCurrentPage, settings } = useApp();

  const isFr = lang === 'fr';

  return (
    <div className="bg-[#F8F8FA] text-[#171827] min-h-screen py-10 sm:py-16 w-full max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        {/* Header Breadcrumb */}
        <div>
          <button
            onClick={() => setCurrentPage('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isFr ? 'Retour à l’accueil' : 'Back to Store'}</span>
          </button>

          <div className="border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 text-[#5121A8] text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-4 h-4" />
              <span>{isFr ? 'Cadre Contractuel Commercial & Logistique' : 'Commercial Procurement Terms'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#171827] tracking-tight">
              {isFr ? 'Conditions Générales de Vente et de Sourcing' : 'Terms and Conditions'}
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              {isFr
                ? 'Date d’application : 1er janvier 2026 · Mise à jour : Mars 2026 · Applicable à l’international'
                : 'Effective Date: January 1, 2026 · Last Updated: March 2026 · Applicable Worldwide'}
            </p>
          </div>
        </div>

        {/* Terms Container */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
          
          {/* Section 1: Scope of Service */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">01.</span>
              <span>{isFr ? 'Objet du Mandat & Services de Sourcing' : 'Agency Scope & Procurement Services'}</span>
            </h2>
            <p>
              {isFr
                ? `Les présentes Conditions Générales régissent l’ensemble des prestations d’achat direct usine, d’audit fournisseurs, de contrôle qualité, de reconditionnement en entrepôt et de transit maritime et aérien fournies par ${settings.brandName}. En validant une commande, un devis de sourcing ou un ordre de fabrication, vous acceptez sans réserve ces conditions.`
                : `These Terms and Conditions govern the procurement, inspection, warehousing, and international freight forwarding services provided by ${settings.brandName}. By placing an order, approving a sourcing quotation, or commissioning a factory production run through our website or our official communication channels, you enter into a legally binding commercial agreement.`}
            </p>
            <p>
              {isFr
                ? `${settings.brandName} intervient en tant que mandataire d’achat et coordinateur logistique en République Populaire de Chine. Nos obligations englobent le sourcing auprès des fabricants de premier rang, la négociation des prix de gros, le contrôle physique des marchandises dans nos entrepôts de Guangzhou et Yiwu, les démarches douanières d’exportation et la réservation du fret international.`
                : `${settings.brandName} acts as your designated procurement agent in the People's Republic of China. Our obligations include supplier identification, commercial negotiations, on-site quality inspection according to agreed standards, warehouse cargo consolidation in Guangzhou and Yiwu, export customs handling, and booking international carriage.`}
            </p>
          </section>

          {/* Section 2: Quotations & Price Validity */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">02.</span>
              <span>{isFr ? 'Devis, Tarification et Périodes de Validité' : 'Quotations, Currency & Validity Periods'}</span>
            </h2>
            <p>
              {isFr
                ? 'Les cotations officielles émises par notre équipe sont libellées en Dollars US (USD), Euros (EUR) ou Francs CFA (XOF) selon votre zone géographique. Compte tenu des fluctuations des cours des matières premières et des taux de change :'
                : 'Formal quotations issued by our sourcing coordinators are denominated in United States Dollars (USD) unless explicitly stated otherwise. Due to fluctuations in raw material costs, Chinese Yuan (CNY) foreign exchange rates, and international bunker/fuel surcharges:'}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li>
                {isFr
                  ? 'Les prix unitaires départ usine sont garantis pendant quatorze (14) jours calendaires à compter de la date d’émission du devis.'
                  : 'Factory unit quotations remain valid for a period of fourteen (14) calendar days from the date of quotation issuance.'}
              </li>
              <li>
                {isFr
                  ? 'Les taux de fret aérien et maritime sont sujets aux ajustements d’indices des transporteurs et sont valides pour une durée de sept (7) jours calendaires.'
                  : 'Air freight and sea container freight rates are subject to carrier spot index adjustments and remain valid for seven (7) calendar days.'}
              </li>
              <li>
                {isFr
                  ? 'Une cotation ne devient définitive et engageante qu’après validation écrite mutuelle et réception de l’acompte de production convenu.'
                  : 'Quotations become binding only once formal written approval is confirmed and the required initial deposit has been cleared in our accounts.'}
              </li>
            </ul>
          </section>

          {/* Section 3: Orders, Deposits & Production */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">03.</span>
              <span>{isFr ? 'Commandes, Acomptes et Délais de Fabrication' : 'Orders, Minimum Quantities & Production Lead Times'}</span>
            </h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs leading-relaxed">
              <p>
                <strong>{isFr ? 'Validation des Échantillons :' : 'Pre-Production Sample Sign-Off:'}</strong>{' '}
                {isFr
                  ? 'Avant tout lancement de production industrielle en série ou personnalisation OEM/logo, un échantillon physique ou une validation photo/vidéo haute définition est soumise au client pour approbation formelle.'
                  : 'Before initiating mass production of custom merchandise, a physical or high-definition photographic sample is prepared for client approval. Approval constitutes acceptance of materials, color codes (Pantone), dimensions, and workmanship.'}
              </p>
              <p>
                <strong>{isFr ? 'Modalités & Moyens de Règlement :' : 'Payment Terms & Accepted Methods:'}</strong>{' '}
                {isFr
                  ? 'Nous acceptons actuellement les règlements par Cartes Bancaires Internationales (Visa) ainsi que par PayPal. Les commandes de gros et de production exigent un acompte initial (habituellement de 30% à 50% selon les clauses usines), le solde étant exigible après inspection de conformité pré-embarquement (PSI) et avant remise aux transporteurs.'
                  : 'We currently accept payments via International Cards (Visa) and PayPal. Mass production orders require an initial production deposit (typically 30% to 50% depending on factory contractual terms), with the remaining balance due following successful Pre-Shipment Inspection (PSI) and prior to cargo handover to international shipping lines.'}
              </p>
              <p>
                <strong>{isFr ? 'Délais d’Exécution :' : 'Lead Times:'}</strong>{' '}
                {isFr
                  ? 'Les délais de production s’entendent en jours ouvrés à compter de la réception de l’acompte et de la validation de l’échantillon. Les fermetures annuelles exceptionnelles (notamment la période du Nouvel An Lunaire chinois) sont communiquées au préalable.'
                  : 'Production lead times quoted represent working calendar days from the receipt of deposit and sample confirmation. Unforeseen national holidays (such as the Chinese Spring Festival holiday shutdown) are excluded from standard lead-time estimates.'}
              </p>
            </div>
          </section>

          {/* Section 4: Quality Inspection Standards */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">04.</span>
              <span>{isFr ? 'Normes de Contrôle Qualité et Inspection en Entrepôt' : 'Pre-Shipment Quality Control & Inspection Protocols'}</span>
            </h2>
            <p>
              {isFr
                ? 'Toutes les commandes acheminées dans nos entrepôts de transit font l’objet d’un contrôle rigoureux selon les normes d’échantillonnage internationales ISO 2859-1 (AQL 2.5) :'
                : 'We conduct Pre-Shipment Quality Inspections based on the international ISO 2859-1 (ANSI/ASQ Z1.4 / AQL 2.5) sampling standard for general consumer goods:'}
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>{isFr ? 'Vérification de la conformité dimensionnelle, des coloris, des matières et des étiquetages' : 'Verification of dimensions, materials, color shades, and packaging labels'}</li>
              <li>{isFr ? 'Tests fonctionnels de mise sous tension pour les appareils électroniques' : 'Power-on operational and function tests for electronic devices'}</li>
              <li>{isFr ? 'Transmission de photographies et vidéos haute résolution sur le WhatsApp du client avant emballage définitif' : 'HD photo and live video documentation provided to client via WhatsApp before export packing'}</li>
              <li>{isFr ? 'Reconditionnement antichoc et cerclage renforcé étanche adapté au transport maritime ou aérien' : 'Reinforced weatherproof packaging and edge protectors for international transit'}</li>
            </ul>
          </section>

          {/* Section 5: Shipping, Transit & Customs Clearance */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">05.</span>
              <span>{isFr ? 'Transport International, Délais Indicatifs et Dédouanement' : 'International Freight, Estimated Transit Times & Customs Clearance'}</span>
            </h2>
            <p>
              {isFr
                ? 'Les délais de livraison communiqués sur le site et dans nos cotations sont des estimations indicatives et ne constituent pas une garantie de date fixe. Le délai effectif d’acheminement peut varier selon le pays de destination, le mode d’expédition sélectionné (aérien ou maritime), les contrôles douaniers, les conditions météorologiques et les aléas logistiques des transporteurs.'
                : 'All delivery timeframes communicated on the platform and within official quotations are estimated timeframes and do not constitute fixed delivery date guarantees. Actual transit times may vary depending on destination country, selected carriage method (air or sea), statutory customs inspection procedures, weather events, and carrier operational schedules.'}
            </p>
            <p>
              {isFr
                ? 'Pour nos formules de fret aérien et maritime DDP (Rendu Droits Acquittés), nous prenons en charge la totalité des formalités douanières d’exportation depuis la Chine ainsi que le dédouanement et les taxes à l’importation dans le pays de destination convenu. Pour les expéditions FOB ou CIF, le dédouanement à destination incombe au destinataire désigné.'
                : 'For DDP (Delivered Duty Paid) cargo, our freight forwarding partners handle export clearance in China as well as import clearance and statutory customs duties in the destination territory. For FOB or CIF shipments, destination clearance remains the sole responsibility of the named consignee.'}
            </p>
          </section>

          {/* Section 6: Jurisdiction */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">06.</span>
              <span>{isFr ? 'Droit Applicable et Résolution des Litiges' : 'Governing Law & Dispute Resolution'}</span>
            </h2>
            <p>
              {isFr
                ? 'Tout différend relatif à l’exécution des présentes sera en premier lieu soumis à une conciliation amiable avec notre direction commerciale. À défaut d’accord amiable, les litiges commerciaux internationaux seront régis conformément aux usages de la Chambre de Commerce Internationale (CCI).'
                : 'Any controversy or claim arising out of commercial sourcing or freight agreements shall first be submitted to mutual amicable consultation. If unresolved, disputes shall be settled in accordance with the rules of the International Chamber of Commerce (ICC).'}
            </p>
          </section>

          {/* Footer Assistance */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-xs text-[#171827] block">
                {isFr ? 'Assistance Commerciale & Juridique' : 'Commercial & Legal Inquiries'}
              </span>
              <span className="text-xs text-slate-500">
                {settings.brandName} · Guangzhou Headquarters
              </span>
            </div>
            <a
              href={`mailto:${settings.supportEmail}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isFr ? 'Contacter le Service Juridique' : 'Contact Legal Desk'}</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
