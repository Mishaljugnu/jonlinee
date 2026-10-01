import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, Product } from '../types.ts';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface AppContextProps {
  currentPage: string;
  setCurrentPage: (page: string, params?: Record<string, any>) => void;
  pageParams: Record<string, any>;
  settings: SiteSettings;
  updateSettingsState: (s: SiteSettings) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  openWhatsApp: (customMessage?: string) => void;
}

const defaultSettings: SiteSettings = {
  brandName: 'J Online Shopping',
  taglineEn: 'Your trusted partner for sourcing products from China',
  taglineFr: 'Votre partenaire de confiance pour sourcer vos produits en Chine',
  positioning: 'China → Global',
  whatsappNumber: '+86 188 0016 8314',
  whatsappDisplay: '+86 188 0016 8314',
  supportPhone: '+86 188 0016 8314',
  supportEmail: 'jsonline432@gmail.com',
  sourcingEmail: 'jsonline432@gmail.com',
  chinaOffice: 'Guangzhou Operations & Sourcing Hub, Guangzhou, Guangdong, China',
  chinaWarehouse: 'Yiwu Sourcing & Partner Logistics Hub, Yiwu, Zhejiang, China',
  socialLinks: {
    whatsapp: 'https://wa.me/8618800168314',
    tiktok: 'https://tiktok.com/@jonlineshopping',
    instagram: 'https://instagram.com/j_game_____',
    facebook: 'https://facebook.com/61562639982302'
  },
  shippingRates: {
    airFreightPerKg: 12.50,
    seaFreightPerCbm: 185.00,
    expressPerKg: 18.00,
    minAirKg: 2,
    minSeaCbm: 0.5
  },
  announcementEn: 'China to Global: Air & Sea cargo departures scheduled 3 times weekly. Send product photos on WhatsApp for instant factory quotation.',
  announcementFr: 'Chine vers International : Départs fret aérien et maritime 3 fois par semaine. Envoyez vos photos par WhatsApp pour un devis usine instantané.',
  customDomain: 'shop.jonlineshopping.com',
  customDomainStatus: 'connected',
  dnsRecords: [
    { type: 'CNAME', host: 'shop', target: 'ais-pre-65rbuycwapb3ufyiepcnzc-248923740159.asia-southeast1.run.app', status: 'Active' },
    { type: 'A', host: '@', target: '34.149.87.45', status: 'Active' },
    { type: 'TXT', host: '_acme-challenge.shop', target: 'google-site-verification=JOS-DOM-849102', status: 'Verified' }
  ]
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageState] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('j_online_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Fetch live settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.brandName) {
          setSettings(data);
        }
      })
      .catch(() => {
        // Fallback to defaultSettings
      });
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem('j_online_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [cart]);

  // Handle browser back/forward or hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const parts = hash.split('?');
        const path = parts[0] || 'home';
        const search = new URLSearchParams(parts[1] || '');
        const params: Record<string, any> = {};
        search.forEach((val, key) => { params[key] = val; });
        setCurrentPageState(path);
        setPageParams(params);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const setCurrentPage = (page: string, params: Record<string, any> = {}) => {
    setCurrentPageState(page);
    setPageParams(params);
    let url = `#${page}`;
    const search = new URLSearchParams();
    Object.keys(params).forEach(k => {
      if (params[k]) search.set(k, String(params[k]));
    });
    if (search.toString()) {
      url += `?${search.toString()}`;
    }
    window.location.hash = url;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item =>
        item.product.id === product.id &&
        item.selectedColor === color &&
        item.selectedSize === size
      );
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
    showToast(`Added "${product.title}" to order list`, 'success');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, itemIndex) => itemIndex !== index));
    showToast('Item removed', 'info');
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => prev.map((item, itemIndex) =>
      itemIndex === index ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const openWhatsApp = (customMessage?: string) => {
    const defaultMsg = `Hello J Online Shopping! I am visiting your website and would like assistance sourcing products from China.`;
    const msg = customMessage || defaultMsg;
    const cleanNum = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const updateSettingsState = (s: SiteSettings) => {
    setSettings(s);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        pageParams,
        settings,
        updateSettingsState,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        showToast,
        openWhatsApp
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
