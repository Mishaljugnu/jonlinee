import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Logo } from './Logo.tsx';
import {
  Search,
  ShoppingBag,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  User,
  Globe2
} from 'lucide-react';
import { Currency } from '../types.ts';

export const Header: React.FC = () => {
  const { lang, setLang, t, currency, setCurrency } = useTranslation();
  const { currentPage, setCurrentPage, setIsSearchOpen, setIsCartOpen, cart, openWhatsApp } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home || 'Home' },
    { id: 'shop', label: t.nav.shop },
    { id: 'wholesale', label: t.nav.wholesale },
    { id: 'how-it-works', label: t.nav.howItWorks },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(23,24,39,0.04)]">
      {/* Announcement Bar */}
      <div className="bg-[#171827] text-slate-200 text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 border-b border-slate-800/80 w-full relative z-50">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-1.5 sm:gap-4 lg:px-6">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
            <span className="text-slate-400 font-bold text-[10px] sm:text-xs tracking-wider uppercase shrink-0">
              {lang === 'fr' ? 'Sourcing Direct' : 'Global Sourcing Desk'}
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300 font-medium text-[11px] sm:text-[13px] tracking-tight truncate hidden xs:inline sm:inline">
              {lang === 'fr' 
                ? 'Sourcing de produits en Chine pour clients internationaux'
                : 'Sourcing products from China for customers worldwide'}
            </span>
          </div>

          {/* Quick Selectors */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 text-xs">
            {/* Currency Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 text-slate-200 hover:text-white font-bold py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-[11px] sm:text-xs border border-slate-700/80 shadow-xs"
                aria-expanded={currencyDropdownOpen}
                aria-label="Select Currency"
              >
                <span>{currency}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${currencyDropdownOpen ? 'rotate-180 text-orange-400' : ''}`} />
              </button>

              {currencyDropdownOpen && (
                <>
                  {/* Backdrop for click-outside dismissal */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCurrencyDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-32 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {lang === 'fr' ? 'Choisir la Devise' : 'Select Currency'}
                    </div>
                    {(['USD', 'EUR', 'XOF', 'GBP'] as Currency[]).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCurrency(c);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                          currency === c ? 'font-black text-[#5121A8] bg-purple-50/80' : 'text-slate-700'
                        }`}
                      >
                        <span className="font-bold">{c}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {c === 'USD' ? '$ USD' : c === 'EUR' ? '€ EUR' : c === 'XOF' ? 'FCFA' : '£ GBP'}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Language Toggle EN | FR */}
            <div className="flex items-center rounded-lg bg-slate-800 p-0.5 text-[10px] sm:text-[11px] font-bold border border-slate-700/80">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-1.5 sm:px-2 py-0.5 rounded transition ${
                  lang === 'en'
                    ? 'bg-[#5121A8] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="text-slate-600 px-0.5">|</span>
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-1.5 sm:px-2 py-0.5 rounded transition ${
                  lang === 'fr'
                    ? 'bg-[#5121A8] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-left focus:outline-hidden hover:opacity-95 transition"
            >
              <Logo />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-2 shrink-0">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition tracking-tight whitespace-nowrap shrink-0 ${
                  currentPage === item.id
                    ? 'text-[#5121A8] bg-purple-50/80 font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 text-xs shrink-0"
              title={t.nav.searchPlaceholder}
            >
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="hidden xl:inline text-slate-400 whitespace-nowrap">
                {lang === 'fr' ? 'Rechercher...' : 'Search...'}
              </span>
            </button>

            {/* Request Product CTA (Direct to Sourcing Form) */}
            <button
              onClick={() => handleNavClick('request')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 xl:px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition shadow-sm whitespace-nowrap shrink-0"
            >
              <span>{t.hero.requestBtn}</span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              title={lang === 'fr' ? 'Panier' : 'Cart'}
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              {totalCartCount > 0 && (
                <span className="absolute 1.5 -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#F47721] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Admin Quick Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition hidden md:block"
              title={t.nav.admin}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {/* Currency and Language selector directly in mobile drawer */}
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'fr' ? 'Devise' : 'Currency'}:
              </span>
              <div className="flex items-center gap-1">
                {(['USD', 'EUR', 'XOF', 'GBP'] as Currency[]).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                      currency === c
                        ? 'bg-[#5121A8] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                  lang === 'en'
                    ? 'bg-[#5121A8] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                  lang === 'fr'
                    ? 'bg-[#5121A8] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                FR
              </button>
            </div>
          </div>

          {/* Quick CTAs for Mobile */}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => handleNavClick('request')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#5121A8] text-white font-bold text-xs shadow-xs"
            >
              <span>{t.hero.requestBtn}</span>
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F47721] text-white font-bold text-xs shadow-xs"
            >
              <span>{t.hero.shopBtn}</span>
            </button>
          </div>

          {/* Links list */}
          <div className="flex flex-col space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-left transition ${
                  currentPage === item.id
                    ? 'bg-purple-50 text-[#5121A8] font-bold'
                    : 'text-[#171827] hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-left text-slate-600 hover:bg-slate-50 border-t border-slate-100 mt-2 pt-3"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                {t.nav.admin}
              </span>
              <span className="text-xs text-slate-400">{lang === 'fr' ? 'Gestion' : 'Back-Office'}</span>
            </button>
          </div>

          {/* Mobile WhatsApp Action */}
          <div className="pt-2">
            <button
              onClick={() => {
                openWhatsApp();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.home.whatsappChatBtn}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
