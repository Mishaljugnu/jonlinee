import React from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { RequestProductPage } from './pages/RequestProductPage.tsx';
import { WholesalePage } from './pages/WholesalePage.tsx';
import { HowItWorksPage } from './pages/HowItWorksPage.tsx';
import { ShippingPage } from './pages/ShippingPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';

const AppContent: React.FC = () => {
  const { currentPage, toasts } = useApp();

  // Page Switcher
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'request':
        return <RequestProductPage />;
      case 'wholesale':
        return <WholesalePage />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'shipping':
        return <ShippingPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Site Header */}
      <Header />

      {/* Main Content View */}
      <main className="flex-1 w-full">
        {renderPage()}
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Global Interactive Elements */}
      <FloatingWhatsApp />
      <SearchModal />
      <CartDrawer />

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col gap-2 transition-all duration-300">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 ${
                toast.type === 'success'
                  ? 'bg-emerald-900 text-white border-emerald-700'
                  : toast.type === 'error'
                  ? 'bg-red-900 text-white border-red-700'
                  : 'bg-slate-900 text-white border-slate-700'
              }`}
            >
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}
