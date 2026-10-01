import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { MessageCircle, X, Send } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { lang, t } = useTranslation();
  const { openWhatsApp } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const isFr = lang === 'fr';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMsg = userQuery.trim()
      ? (isFr ? `Bonjour J Online Shopping ! ${userQuery.trim()}` : `Hello J Online Shopping! ${userQuery.trim()}`)
      : undefined;
    openWhatsApp(cleanMsg);
    setIsOpen(false);
    setUserQuery('');
  };

  return (
    <aside aria-label="WhatsApp Support Desk" className="fixed bottom-3 sm:bottom-5 right-3 sm:right-5 z-40 flex flex-col items-end">
      {/* Pop-up Dialog */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-88 max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold border border-white/40">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">
                  {t.floatingWhatsapp.agentName}
                </h3>
                <span className="text-[11px] text-emerald-100 block">
                  {t.floatingWhatsapp.agentStatus}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-emerald-100 hover:text-white hover:bg-white/10 transition"
              aria-label={t.nav.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            {/* Auto Message Bubble */}
            <div className="rounded-xl rounded-tl-none bg-white p-3.5 shadow-xs border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <p className="font-medium text-slate-800">
                {t.floatingWhatsapp.greeting}
              </p>
              <div className="text-[11px] text-slate-500 font-semibold pt-1 border-t border-slate-100">
                {isFr ? 'Équipe Sourcing Chine → International' : 'China → Global Sourcing Team'}
              </div>
            </div>

            {/* Quick Sourcing Prompts */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isFr ? 'Suggestions rapides :' : 'Quick Prompts:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setUserQuery(isFr ? "J'ai la photo d'un produit que je souhaite sourcer en Chine." : "I have a product photo I want to source from China.")}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 transition"
                >
                  {isFr ? 'Envoyer une photo' : 'Send photo for quote'}
                </button>
                <button
                  type="button"
                  onClick={() => setUserQuery(isFr ? "Je souhaite obtenir une cotation pour une commande de gros / conteneur." : "I need a wholesale container quotation.")}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 transition"
                >
                  {isFr ? 'Devis conteneur de gros' : 'Wholesale container inquiry'}
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="pt-1">
              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder={isFr ? "Posez votre question sur le sourcing..." : "Type your sourcing question..."}
                  className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shrink-0"
                  title="WhatsApp"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <button
              onClick={() => openWhatsApp(userQuery ? (isFr ? `Bonjour J Online Shopping ! ${userQuery}` : `Hello J Online Shopping! ${userQuery}`) : undefined)}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.floatingWhatsapp.chatBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-950/20 transition-colors duration-150 focus:outline-hidden"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline text-xs tracking-wide">
          {isFr ? 'Bureau Sourcing WhatsApp' : 'WhatsApp Sourcing Desk'}
        </span>
      </button>
    </aside>
  );
};
