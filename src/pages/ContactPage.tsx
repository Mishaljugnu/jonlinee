import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Building2,
  Share2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const { settings, openWhatsApp, showToast } = useApp();

  const isFr = lang === 'fr';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showToast(isFr ? 'Veuillez remplir les champs obligatoires' : 'Please fill in required fields', 'error');
      return;
    }
    setSent(true);
    showToast(isFr ? 'Message bien reçu ! Notre équipe va vous répondre.' : 'Message sent! Our sourcing team will contact you.', 'success');
  };

  return (
    <div className="space-y-12 sm:space-y-20 pb-16 w-full max-w-full overflow-hidden">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-12 sm:py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>{t.contactPage.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight">
            {t.contactPage.title}
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.contactPage.subtitle}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Contact Info & Offices (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:pr-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {t.contactPage.offices}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isFr ? 'Contactez nos équipes à Guangzhou, Yiwu ou directement en ligne.' : 'Reach out to our teams in Guangzhou, Yiwu, or online.'}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold text-sm">
                    {t.contactPage.chinaOfficeTitle}
                  </strong>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {settings.chinaOffice}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold text-sm">
                    {t.contactPage.chinaWarehouseTitle}
                  </strong>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {settings.chinaWarehouse}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold text-sm">
                    {t.contactPage.hoursTitle}
                  </strong>
                  <p className="text-slate-600 mt-0.5">
                    {t.contactPage.hoursText}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold text-sm">
                    {isFr ? 'Email Direct d’Assistance' : 'Direct Support Email'}
                  </strong>
                  <a href={`mailto:${settings.supportEmail}`} className="text-orange-600 hover:underline">
                    {settings.supportEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-4 border-t border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                {isFr ? 'Réponse Express sur WhatsApp' : 'Fastest Response via WhatsApp'}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {isFr ? 'Nos coordinateurs en Chine vous répondent en moins de 15 minutes durant les heures d’ouverture.' : 'Our sourcing managers in China reply within 15 minutes during CST business hours.'}
              </p>
              <button
                onClick={() => openWhatsApp(isFr ? 'Bonjour ! Je vous contacte via la page contact de votre site web.' : 'Hello! I am contacting you through your website contact page.')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isFr ? 'Ouvrir WhatsApp en Direct' : 'Start Live WhatsApp Chat'}</span>
              </button>
            </div>

            {/* Social Media Sourcing Channels */}
            <div className="pt-4 border-t border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#5121A8]" />
                {isFr ? 'Canaux & Réseaux Officiels' : 'Official Social Media Channels'}
              </span>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                {isFr ? 'Suivez nos visites d’usines quotidiennes en Chine, arrivages et unboxings :' : 'Follow our daily China factory tours, wholesale drops, and product unboxings:'}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={settings.socialLinks?.tiktok || 'https://tiktok.com/@jonlineshopping'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
                >
                  <span>TikTok</span>
                </a>
                <a
                  href={settings.socialLinks?.instagram || 'https://instagram.com/jonlineshopping'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-semibold text-xs transition"
                >
                  <span>Instagram</span>
                </a>
                <a
                  href={settings.socialLinks?.facebook || 'https://facebook.com/jonlineshopping'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                >
                  <span>Facebook</span>
                </a>
                <a
                  href={settings.socialLinks?.whatsapp || 'https://wa.me/8615018786047'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-6">
                {t.contactPage.formTitle}
              </h2>

              {sent ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {isFr ? 'Message Bien Envoyé !' : 'Message Received!'}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    {isFr
                      ? `Merci, ${name}. Notre cellule d’assistance internationale a bien reçu votre demande et vous contactera dans les meilleurs délais.`
                      : `Thank you, ${name}. Our international support desk has received your note and will be in touch shortly.`}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.contactPage.name} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isFr ? 'Votre nom complet' : 'Your full name'}
                        className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.contactPage.email} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom@domaine.com"
                        className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.contactPage.whatsapp}
                      </label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+33 6... / +225 07..."
                        className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.contactPage.subject}
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={isFr ? 'Ex : Question sourcing, partenariat de gros...' : 'e.g. Sourcing question, wholesale partnership...'}
                        className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {t.contactPage.message} *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={isFr ? 'Comment notre équipe de sourcing en Chine peut-elle vous aider ?' : 'How can our China sourcing team assist you today?'}
                      className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contactPage.send}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
