import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { lang, t, formatPrice } = useTranslation();
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    openWhatsApp,
    showToast,
    setCurrentPage
  } = useApp();

  const [destinationCountry, setDestinationCountry] = useState('');
  const [inquiryNotes, setInquiryNotes] = useState('');

  if (!isCartOpen) return null;

  const isFr = lang === 'fr';
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);

  const handleInquireWhatsApp = () => {
    if (cart.length === 0) return;

    // Build WhatsApp message
    const itemsList = cart.map(item =>
      `• ${isFr && item.product.titleFr ? item.product.titleFr : item.product.title} (Qty: ${item.quantity}${item.selectedColor ? `, Color: ${item.selectedColor}` : ''}${item.selectedSize ? `, Size: ${item.selectedSize}` : ''})${item.product.price ? ` - $${((item.product.price) * item.quantity).toFixed(2)}` : (isFr ? ' - [Sur devis]' : ' - [Quote needed]')}`
    ).join('\n');

    const msg = isFr
      ? `Bonjour J Online Shopping ! Je souhaite commander / demander une cotation pour ces articles :

${itemsList}

*Total estimé des articles :* $${subtotal.toFixed(2)} USD
${destinationCountry.trim() ? `*Destination :* ${destinationCountry.trim()}\n` : ''}${inquiryNotes.trim() ? `*Instructions particulières :* ${inquiryNotes.trim()}\n` : ''}
Pouvez-vous confirmer la disponibilité auprès des usines et me proposer les options d'expédition ?`
      : `Hello J Online Shopping! I would like to inquire about these products:

${itemsList}

*Estimated Products Total:* $${subtotal.toFixed(2)} USD
${destinationCountry.trim() ? `*Destination Market:* ${destinationCountry.trim()}\n` : ''}${inquiryNotes.trim() ? `*Special Request:* ${inquiryNotes.trim()}\n` : ''}
Could you verify stock with Chinese suppliers and provide current shipping options?`;

    openWhatsApp(msg);
    showToast(isFr ? 'Ouverture de la discussion WhatsApp...' : 'Opening WhatsApp inquiry...', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-out Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col h-full">
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                {t.cart.title} ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label={t.nav.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {t.cart.empty}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentPage('shop');
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-4 first:pt-0 flex gap-3 items-start">
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&q=80'}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                    />
                    <div className="flex-1 space-y-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                        {isFr && item.product.titleFr ? item.product.titleFr : item.product.title}
                      </h4>
                      <div className="text-[11px] text-slate-500">
                        {item.selectedColor && <span>{isFr ? 'Couleur : ' : 'Color: '}{item.selectedColor} </span>}
                        {item.selectedSize && <span>{isFr ? 'Taille : ' : 'Size: '}{item.selectedSize}</span>}
                      </div>
                      <div className="text-xs font-black text-orange-600">
                        {item.product.price ? formatPrice(item.product.price) : (isFr ? 'Sur devis' : 'Quote only')}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center border border-slate-200 rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-slate-900"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-slate-900"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Optional Inquiry Details */}
                <div className="pt-5 space-y-3">
                  <span className="text-xs font-bold text-slate-900 block">
                    {isFr ? 'Détails de la demande (Facultatif)' : 'Inquiry Details (Optional)'}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={destinationCountry}
                      onChange={(e) => setDestinationCountry(e.target.value)}
                      placeholder={isFr ? 'Pays / Ville de destination' : 'Destination Country / City'}
                      className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={inquiryNotes}
                      onChange={(e) => setInquiryNotes(e.target.value)}
                      placeholder={isFr ? 'Notes spécifiques, emballage, questions...' : 'Custom notes, packaging requests, or questions...'}
                      className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-hidden resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{t.cart.subtotal}</span>
                <span className="text-base font-black text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="line-clamp-1">{t.cart.shippingNotice}</span>
                <span className="text-emerald-600 font-semibold shrink-0 ml-1">
                  {isFr ? 'Tarifs Usine Directs' : 'Direct Factory Rates'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700">
                  {isFr ? 'Paiement :' : 'Payment:'}
                </span>{' '}
                {isFr ? 'Les modalités de paiement sont confirmées après le devis et la validation de la commande.' : 'Payment terms are confirmed after quotation and order approval.'}
              </div>

              <button
                onClick={handleInquireWhatsApp}
                className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.cart.checkoutWhatsApp}</span>
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 py-1"
              >
                {t.cart.clearCart}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
