import React from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { ShieldCheck, ArrowLeft, Mail, Building2, Globe2, Lock } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { lang } = useTranslation();
  const { setCurrentPage, settings } = useApp();

  const isFr = lang === 'fr';

  return (
    <div className="bg-[#F8F8FA] text-[#171827] min-h-screen py-10 sm:py-16 w-full max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Navigation Breadcrumb */}
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
              <ShieldCheck className="w-4 h-4" />
              <span>{isFr ? 'Protection des Données & Conformité Internationale' : 'International Trade Compliance'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#171827] tracking-tight">
              {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              {isFr
                ? 'Date d’effet : 1er janvier 2026 · Mise à jour : Mars 2026 · Version 2.4'
                : 'Effective Date: January 1, 2026 · Last Updated: March 2026 · Version 2.4'}
            </p>
          </div>
        </div>

        {/* Legal Document Content */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
          
          {/* Section 1: Overview & Data Controller */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">01.</span>
              <span>{isFr ? 'Responsable du Traitement & Cadre d’Application' : 'Data Controller & Scope of Service'}</span>
            </h2>
            <p>
              {isFr
                ? `La présente Politique de Confidentialité explicite la façon dont ${settings.brandName} (« nous », « notre » ou « l’Entreprise »), depuis son Bureau des Achats de Guangzhou (${settings.chinaOffice}) et son Centre de Consolidation Logistique de Yiwu (${settings.chinaWarehouse}), collecte, conserve, traite et sécurise vos données personnelles et commerciales lorsque vous accédez à notre plateforme, sollicitez un devis de sourcing ou mandatez nos services d’acheminement transfrontalier.`
                : `This Privacy Policy explains how ${settings.brandName} ("we", "us", or "our"), operating out of our Guangzhou Procurement Office (${settings.chinaOffice}) and Yiwu Consolidation Center (${settings.chinaWarehouse}), collects, stores, processes, and protects your personal and commercial data when you access our platform, request product quotations, or engage our cross-border sourcing and freight services.`}
            </p>
            <p>
              {isFr
                ? 'Nous intervenons en qualité de responsable de traitement pour l’ensemble des données recueillies auprès de clients situés dans l’Union Européenne, en Afrique, en Amérique du Nord et dans le reste du monde, en pleine conformité avec le Règlement Général sur la Protection des Données (RGPD).'
                : 'We act as the data controller for personal and corporate procurement data gathered directly from clients located in the European Union, the United Kingdom, North America, Africa, and other international jurisdictions.'}
            </p>
          </section>

          {/* Section 2: Data Collected */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">02.</span>
              <span>{isFr ? 'Informations Collectées' : 'Information We Collect'}</span>
            </h2>
            <p>
              {isFr
                ? 'Pour mener à bien les démarches de fabrication industrielle, d’achat en gros et de livraison porte-à-porte, nous recueillons les catégories d’informations suivantes :'
                : 'To fulfill custom manufacturing, wholesale procurement, and international door-to-door delivery, we collect specific categories of business and personal data:'}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li>
                <strong>{isFr ? 'Données d’identification et de contact :' : 'Identification & Contact Data:'}</strong>{' '}
                {isFr
                  ? 'Nom, prénom, raison sociale de l’entreprise, numéro d’enregistrement commercial, numéro de TVA / EORI, adresse email, coordonnées téléphoniques directes et numéro WhatsApp.'
                  : 'Full name, company trade name, business registration number, tax identification/VAT/EORI numbers, email address, direct telephone and WhatsApp contact numbers.'}
              </li>
              <li>
                <strong>{isFr ? 'Spécifications techniques et visuels de sourcing :' : 'Sourcing Specifications & Visual Assets:'}</strong>{' '}
                {isFr
                  ? 'Cahiers des charges, photographies de référence, échantillons visuels, fiches de nomenclature, logos personnalisés OEM et volumes demandés.'
                  : 'Technical drawings, reference product photographs, OEM trademark graphics, bill of materials, packaging artwork, and quantity requests.'}
              </li>
              <li>
                <strong>{isFr ? 'Données de livraison et douanes internationales :' : 'Consignee & Customs Information:'}</strong>{' '}
                {isFr
                  ? 'Adresse physique de livraison du destinataire, contact du réceptionnaire, port ou aéroport de débarquement, formalités déclaratives douanières à l’importation (DDP, FOB, CIF).'
                  : 'Physical delivery addresses, consignee contact names, port of destination, customs broker details, and import documentation required for customs clearance under Incoterms (DDP, CIF, FOB).'}
              </li>
              <li>
                <strong>{isFr ? 'Règlements et transactions commerciales :' : 'Transaction & Payment Records:'}</strong>{' '}
                {isFr
                  ? 'Références des virements bancaires, factures proforma acquittées, bordereaux de caution de production. Nous ne conservons aucune coordonnée bancaire complète sur nos serveurs.'
                  : 'Payment transaction references, wire transfer confirmations, proforma invoices, and balance release records. We do not store full credit card numbers on our servers.'}
              </li>
            </ul>
          </section>

          {/* Section 3: Purpose of Processing */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">03.</span>
              <span>{isFr ? 'Bases Légales et Finalités des Traitements' : 'Lawful Purpose & Legal Basis for Processing'}</span>
            </h2>
            <p>
              {isFr
                ? 'Les traitements de vos données reposent sur des fondements légaux stricts :'
                : 'Under applicable data protection laws including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), we process your data on the following legal bases:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-xs text-[#171827] mb-1">
                  {isFr ? 'Exécution Contractuelle' : 'Contract Performance'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isFr
                    ? 'Négociation des tarifs direct usine, commande d’échantillons, contrôle qualité en usine, reconditionnement en entrepôt et affrètement aérien/maritime.'
                    : 'Negotiating factory pricing, auditing manufacturing partners, purchasing sample batches, quality inspection, and freight forwarding.'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-xs text-[#171827] mb-1">
                  {isFr ? 'Conformité Douanière & Légale' : 'Legal & Customs Compliance'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isFr
                    ? 'Déclaration d’exportation auprès des douanes chinoises, émission des manifestes de fret et respect des nomenclatures douanières du Système Harmonisé (codes SH).'
                    : 'Filing export declarations with China Customs and destination import clearance under international Harmonized System (HS) codes.'}
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Data Retention & Security */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">04.</span>
              <span>{isFr ? 'Conservation et Sécurité des Données' : 'Data Retention & Security Safeguards'}</span>
            </h2>
            <p>
              {isFr
                ? 'Vos données commerciales sont protégées par un chiffrement TLS de niveau bancaire lors des transmissions réseau. Les dossiers douaniers et pièces comptables sont archivés pour la durée légale obligatoire (5 à 10 ans selon les législations fiscales et douanières applicables).'
                : 'We implement TLS encryption across all network transfers. Customs declarations and commercial invoices are retained for the statutory retention periods mandated by international trade and taxation authorities (typically 5 to 10 years).'}
            </p>
          </section>

          {/* Section 5: Your Rights */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#171827] flex items-center gap-2">
              <span className="text-[#5121A8]">05.</span>
              <span>{isFr ? 'Vos Droits d’Accès et de Rectification' : 'Your Legal Data Rights'}</span>
            </h2>
            <p>
              {isFr
                ? 'Conformément aux réglementations relatives aux données personnelles, vous disposez d’un droit d’accès, de rectification, de portabilité et d’effacement de vos données personnelles.'
                : 'You maintain the right to access, rectify, restrict processing, or request erasure of your personal data held within our systems.'}
            </p>
            <p className="text-xs text-slate-500">
              {isFr
                ? `Pour exercer ces droits, vous pouvez contacter directement notre délégué à la protection des données par email à : ${settings.supportEmail}.`
                : `To exercise your rights, contact our data protection coordinator via email at: ${settings.supportEmail}.`}
            </p>
          </section>

          {/* Contact Box */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-xs text-[#171827] block">
                {isFr ? 'Questions relatives à la confidentialité ?' : 'Questions regarding privacy?'}
              </span>
              <span className="text-xs text-slate-500">
                {settings.brandName} · Guangzhou Procurement Desk
              </span>
            </div>
            <a
              href={`mailto:${settings.supportEmail}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isFr ? 'Contacter le DPO' : 'Contact DPO'}</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
