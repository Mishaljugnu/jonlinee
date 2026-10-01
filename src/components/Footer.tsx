import React from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Logo } from './Logo.tsx';
import {
  MessageCircle,
  MapPin,
  ShieldCheck,
  Lock,
  Edit2
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, setLang, t } = useTranslation();
  const { setCurrentPage, settings, openWhatsApp } = useApp();

  const isFr = lang === 'fr';

  const handleLink = (page: string, params: Record<string, any> = {}) => {
    setCurrentPage(page, params);
  };

  return (
    <footer className="bg-[#171827] text-slate-300 border-t border-slate-800/80 pt-12 sm:pt-16 pb-12 w-full overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Brand & Slogan */}
        <div className="pb-10 border-b border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div>
              <Logo size="md" variant="horizontal" theme="dark" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#F47721]">
                {t.hero.positioning}
              </p>
              <p className="text-sm text-slate-400 mt-0.5">
                {t.hero.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => openWhatsApp()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isFr ? 'Bureau WhatsApp' : 'WhatsApp Desk'}</span>
          </button>
        </div>

        {/* Links: SHOP | BUSINESS | COMPANY | SUPPORT */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 sm:py-12 border-b border-slate-800/80 text-xs">
          {/* SHOP */}
          <div>
            <h4 className="font-black uppercase tracking-wider text-white mb-4 text-xs">
              {isFr ? 'Boutique' : 'Shop'}
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button onClick={() => handleLink('shop')} className="hover:text-white transition">
                  {isFr ? 'Tous les Produits' : 'Products'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shop')} className="hover:text-white transition">
                  {isFr ? 'Catégories d’Usines' : 'Categories'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shop', { featured: 'true' })} className="hover:text-white transition">
                  {isFr ? 'Produits Vedettes' : 'Featured Sourcing'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shop', { category: 'cat-fashion' })} className="hover:text-white transition">
                  {isFr ? 'Mode & Confection' : 'Fashion & Shoes'}
                </button>
              </li>
            </ul>
          </div>

          {/* BUSINESS */}
          <div>
            <h4 className="font-black uppercase tracking-wider text-white mb-4 text-xs">
              {isFr ? 'Entreprise & Gros' : 'Business'}
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button onClick={() => handleLink('wholesale')} className="hover:text-white transition">
                  {isFr ? 'Achat en Gros (B2B)' : 'Wholesale'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('wholesale')} className="hover:text-white transition">
                  {isFr ? 'Devis Conteneur Usine' : 'Request Quote'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('request')} className="text-[#F47721] font-semibold hover:text-[#ff9248] transition">
                  {isFr ? 'Demander un Produit' : 'Request Product'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shipping')} className="hover:text-white transition">
                  {isFr ? 'Logistique & Transit' : 'Factory Logistics'}
                </button>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-black uppercase tracking-wider text-white mb-4 text-xs">
              {isFr ? 'La Société' : 'Company'}
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button onClick={() => handleLink('about')} className="hover:text-white transition">
                  {isFr ? 'À Propos de Nous' : 'About'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('how-it-works')} className="hover:text-white transition">
                  {isFr ? 'Comment ça Marche' : 'How it works'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('request')} className="hover:text-white transition">
                  {isFr ? 'Sourcing Personnalisé' : 'Custom Sourcing'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shipping')} className="hover:text-white transition">
                  {isFr ? 'Entrepôts Guangzhou & Yiwu' : 'Guangzhou Warehouse'}
                </button>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-black uppercase tracking-wider text-white mb-4 text-xs">
              {isFr ? 'Assistance' : 'Support'}
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button onClick={() => handleLink('contact')} className="hover:text-white transition">
                  {isFr ? 'Nous Contacter' : 'Contact'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shipping')} className="hover:text-white transition">
                  {isFr ? 'Fret Aérien & Maritime DDP' : 'Shipping Rates & DDP'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('privacy')} className="hover:text-white transition">
                  {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('terms')} className="hover:text-white transition">
                  {isFr ? 'Conditions Générales' : 'Terms & Conditions'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('admin')} className="text-slate-500 hover:text-slate-300 transition flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>{isFr ? 'Accès Admin' : 'Admin'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Icons Bar */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isFr ? 'Réseaux :' : 'Social:'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={settings.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-emerald-600 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                WhatsApp
              </a>
              <a
                href={settings.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                TikTok
              </a>
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                Instagram
              </a>
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                Facebook
              </a>
              <button
                onClick={() => handleLink('admin', { tab: 'settings' })}
                className="ml-1 sm:ml-2 px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-[#F47721] text-slate-400 hover:text-[#F47721] text-xs font-medium transition flex items-center gap-1.5"
                title={isFr ? 'Modifier les liens sur le panneau Admin' : 'Edit Social Media Links in Admin Dashboard'}
              >
                <Edit2 className="w-3 h-3 text-[#F47721]" />
                <span className="hidden sm:inline">{isFr ? 'Modifier Liens' : 'Edit Links'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-[#F47721]" />
            <span>{isFr ? 'Siège Opérationnel : Guangzhou • Pôle Partenaire : Yiwu' : 'Operations HQ: Guangzhou • Partner Hub: Yiwu'}</span>
          </div>
        </div>

        {/* Payment Methods Trust Bar */}
        <div className="py-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">
              {isFr ? 'Moyens de paiement acceptés :' : 'Accepted payment methods:'}
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 text-white font-black text-[11px] tracking-wider border border-slate-700">
                VISA
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 text-[#0079C1] font-black text-[11px] tracking-wider border border-slate-700">
                PayPal
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500">
            {isFr ? 'Cartes Internationales (Visa) & PayPal' : 'International Cards (Visa) & PayPal'}
          </span>
        </div>

        {/* Bottom Copyright & Legal Links & EN | FR */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <p>© 2026 J Online Shopping</p>
            <span>•</span>
            <button
              onClick={() => handleLink('privacy')}
              className="hover:text-slate-300 transition underline underline-offset-2"
            >
              {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button
              onClick={() => handleLink('terms')}
              className="hover:text-slate-300 transition underline underline-offset-2"
            >
              {isFr ? 'Conditions Générales' : 'Terms & Conditions'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-bold">
              <button
                onClick={() => setLang('en')}
                className={`transition ${lang === 'en' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                EN
              </button>
              <span>|</span>
              <button
                onClick={() => setLang('fr')}
                className={`transition ${lang === 'fr' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                FR
              </button>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {isFr ? 'Partenaire Sourcing Chine Certifié' : 'Verified China Sourcing Partner'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
