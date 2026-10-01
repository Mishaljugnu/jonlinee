import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import {
  Lock,
  Package,
  FileText,
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  MessageCircle,
  ExternalLink,
  Save,
  LogOut,
  X,
  TrendingUp,
  Tag,
  Layers,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  FolderPlus,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Check,
  Building2,
  Truck,
  Eye,
  AlertCircle,
  Share2,
  Globe,
  ShieldCheck,
  Copy
} from 'lucide-react';
import { Product, Category, SourcingRequest, Quotation, Promotion, SiteSettings, Order } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { getStoredSession } from '../lib_supabase.ts';

export const AdminPage: React.FC = () => {
  const { lang, t, formatPrice } = useTranslation();
  const { settings, updateSettingsState, showToast, openWhatsApp, pageParams } = useApp();

  // ----------------------------------------------------
  // Authentication State
  // ----------------------------------------------------
  const { user, isAdmin, loading: authLoadingState, signIn, signOut } = useAuth();
  const isAuthenticated = Boolean(user && isAdmin);
  const authFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const session = getStoredSession();
    const headers = new Headers(init.headers);
    if (session?.access_token) headers.set('Authorization', `Bearer ${session.access_token}`);
    const response = await fetch(input, { ...init, headers });
    if (response.status === 401) {
      await signOut();
      showToast('Your admin session expired. Please sign in again.', 'error');
      throw new Error('Admin session expired');
    }
    return response;
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'requests' | 'categories' | 'promotions' | 'settings'>('stats');

  // Handle URL tab param (e.g. #admin?tab=settings)
  useEffect(() => {
    if (pageParams?.tab && ['stats', 'products', 'orders', 'requests', 'categories', 'promotions', 'settings'].includes(pageParams.tab)) {
      setActiveTab(pageParams.tab as any);
    }
  }, [pageParams]);

  // ----------------------------------------------------
  // Data Collections
  // ----------------------------------------------------
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [requests, setRequests] = useState<SourcingRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => ({
    ...settings,
    socialLinks: {
      whatsapp: settings?.socialLinks?.whatsapp || '',
      tiktok: settings?.socialLinks?.tiktok || '',
      instagram: settings?.socialLinks?.instagram || '',
      facebook: settings?.socialLinks?.facebook || ''
    }
  }));
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------
  // Product Filters & Quick Price Edit
  // ----------------------------------------------------
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');
  const [productTypeFilter, setProductTypeFilter] = useState<'all' | 'retail' | 'wholesale' | 'quote'>('all');
  const [quickPriceEdits, setQuickPriceEdits] = useState<Record<string, string>>({});
  const [savingPriceId, setSavingPriceId] = useState<string | null>(null);

  // ----------------------------------------------------
  // Request / Wholesale Inquiries Filters
  // ----------------------------------------------------
  const [searchRequestQuery, setSearchRequestQuery] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('all');
  const [requestTypeFilter, setRequestTypeFilter] = useState<'all' | 'retail' | 'wholesale'>('all');
  const [selectedRequestDetails, setSelectedRequestDetails] = useState<SourcingRequest | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [quotationModalOpen, setQuotationModalOpen] = useState(false);
  const [quotationRequest, setQuotationRequest] = useState<SourcingRequest | null>(null);
  const [quotationForm, setQuotationForm] = useState({ itemsSummary:'', unitPrice:'', estimatedShipping:'', totalAmount:'', currency:'USD', moq:'', validityDays:'7', productionDays:'', notes:'' });
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  // ----------------------------------------------------
  // Product Modal State
  // ----------------------------------------------------
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodTitleFr, setProdTitleFr] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState<string>('25.00');
  const [prodIsQuoteOnly, setProdIsQuoteOnly] = useState(false);
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodImgInput, setProdImgInput] = useState('');
  const [prodColors, setProdColors] = useState('');
  const [prodSizes, setProdSizes] = useState('');
  const [prodMoq, setProdMoq] = useState('1 pc (Retail) / 10 pcs (Wholesale)');
  const [prodStockLocation, setProdStockLocation] = useState('Guangzhou Sourcing Center');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodRetailAvailable, setProdRetailAvailable] = useState(true);
  const [prodWholesaleAvailable, setProdWholesaleAvailable] = useState(true);
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodIsNew, setProdIsNew] = useState(false);
  const [prodDesc, setProdDesc] = useState('');
  const [prodDescFr, setProdDescFr] = useState('');
  const [uploadingProdImage, setUploadingProdImage] = useState(false);
  const prodFileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // Category Modal State
  // ----------------------------------------------------
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catNameFr, setCatNameFr] = useState('');
  const [catIcon, setCatIcon] = useState('ShoppingBag');
  const [catImage, setCatImage] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catDescFr, setCatDescFr] = useState('');
  const [catOrder, setCatOrder] = useState('1');
  const [uploadingCatImage, setUploadingCatImage] = useState(false);
  const catFileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // Promotion Modal State
  // ----------------------------------------------------
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoTitleFr, setPromoTitleFr] = useState('');
  const [promoSubtitle, setPromoSubtitle] = useState('');
  const [promoSubtitleFr, setPromoSubtitleFr] = useState('');
  const [promoCode, setPromoCode] = useState('SPECIAL10');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState('10');
  const [promoBadge, setPromoBadge] = useState('10% OFF');
  const [promoBannerImage, setPromoBannerImage] = useState('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80');
  const [promoLinkUrl, setPromoLinkUrl] = useState('/shop');
  const [promoExpiryDate, setPromoExpiryDate] = useState('2026-12-31');
  const [promoActive, setPromoActive] = useState(true);
  const [uploadingPromoImage, setUploadingPromoImage] = useState(false);
  const promoFileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // Fetch all admin data
  // ----------------------------------------------------
  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, oRes, rRes, qRes, prRes, sRes] = await Promise.all([
        authFetch('/api/products?limit=250').then(r => r.json()),
        authFetch('/api/categories').then(r => r.json()),
        authFetch('/api/orders').then(r => r.json()),
        authFetch('/api/requests').then(r => r.json()),
        authFetch('/api/quotations').then(r => r.json()),
        authFetch('/api/promotions').then(r => r.json()),
        authFetch('/api/settings').then(r => r.json())
      ]);

      if (Array.isArray(pRes)) setProducts(pRes);
      if (Array.isArray(cRes)) setCategories(cRes);
      if (Array.isArray(oRes)) setOrders(oRes);
      if (Array.isArray(rRes)) setRequests(rRes);
      if (Array.isArray(qRes)) setQuotations(qRes);
      if (Array.isArray(prRes)) setPromotions(prRes);
      if (sRes && sRes.brandName) {
        setSiteSettings({
          ...sRes,
          socialLinks: {
            whatsapp: sRes.socialLinks?.whatsapp || '',
            tiktok: sRes.socialLinks?.tiktok || '',
            instagram: sRes.socialLinks?.instagram || '',
            facebook: sRes.socialLinks?.facebook || ''
          }
        });
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
      showToast('Could not refresh data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Sync settings when context settings change
  useEffect(() => {
    if (settings) {
      setSiteSettings({
        ...settings,
        socialLinks: {
          whatsapp: settings.socialLinks?.whatsapp || '',
          tiktok: settings.socialLinks?.tiktok || '',
          instagram: settings.socialLinks?.instagram || '',
          facebook: settings.socialLinks?.facebook || ''
        }
      });
    }
  }, [settings]);

  // ----------------------------------------------------
  // Image Upload Helper
  // ----------------------------------------------------
  const uploadImageFile = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await authFetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: base64Data,
              filename: file.name,
              mimeType: file.type || 'image/jpeg'
            })
          });
          const data = await res.json();
          if (res.ok && data.url) {
            resolve(data.url);
          } else {
            showToast(data.error || 'Upload failed', 'error');
            resolve(null);
          }
        } catch (err) {
          console.error(err);
          showToast('Image upload failed', 'error');
          resolve(null);
        }
      };
      reader.onerror = () => {
        showToast('Failed to read file', 'error');
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  // ----------------------------------------------------
  // Auth Handlers
  // ----------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const { error } = await signIn(email.trim(), password);
    if (error) {
      setAuthError(error.message);
    } else {
      showToast('Signed in. Checking admin access…', 'success');
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) showToast(error.message, 'error');
    else showToast('Logged out of admin dashboard', 'info');
  };

  // ----------------------------------------------------
  // Product Operations
  // ----------------------------------------------------
  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProdTitle(product.title);
      setProdTitleFr(product.titleFr || '');
      setProdCategory(product.categoryId);
      setProdPrice(product.price !== null && product.price !== undefined ? String(product.price) : '');
      setProdIsQuoteOnly(Boolean(product.isQuoteOnly));
      setProdImages(product.images || []);
      setProdColors((product.colors || []).join(', '));
      setProdSizes((product.sizes || []).join(', '));
      setProdMoq(product.moq || '1 pc');
      setProdStockLocation(product.stockLocation || 'Guangzhou Sourcing Center');
      setProdInStock(product.inStock ?? true);
      setProdRetailAvailable(product.retailAvailable ?? true);
      setProdWholesaleAvailable(product.wholesaleAvailable ?? true);
      setProdFeatured(product.isFeatured || false);
      setProdIsNew(product.isNew || false);
      setProdDesc(product.description || '');
      setProdDescFr(product.descriptionFr || '');
    } else {
      setEditingProduct(null);
      setProdTitle('');
      setProdTitleFr('');
      setProdCategory(categories[0]?.id || 'cat-fashion');
      setProdPrice('25.00');
      setProdIsQuoteOnly(false);
      setProdImages(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80']);
      setProdColors('Black, White, Blue');
      setProdSizes('Standard');
      setProdMoq('1 pc (Retail) / 10 pcs (Wholesale)');
      setProdStockLocation('Guangzhou Sourcing Center');
      setProdInStock(true);
      setProdRetailAvailable(true);
      setProdWholesaleAvailable(true);
      setProdFeatured(false);
      setProdIsNew(true);
      setProdDesc('Direct factory verified product with international freight support.');
      setProdDescFr('Produit vérifié directement en usine avec prise en charge du fret international.');
    }
    setProductModalOpen(true);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProdImage(true);
    const url = await uploadImageFile(file);
    if (url) {
      setProdImages(prev => [...prev, url]);
      showToast('Image uploaded and added', 'success');
    }
    setUploadingProdImage(false);
    if (prodFileInputRef.current) prodFileInputRef.current.value = '';
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) {
      showToast('Product title is required', 'error');
      return;
    }

    const payload = {
      title: prodTitle.trim(),
      titleFr: prodTitleFr.trim() || undefined,
      categoryId: prodCategory || categories[0]?.id || 'cat-other',
      price: prodIsQuoteOnly ? null : (prodPrice ? parseFloat(prodPrice) : null),
      isQuoteOnly: prodIsQuoteOnly,
      images: prodImages.length > 0 ? prodImages : ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80'],
      colors: prodColors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: prodSizes.split(',').map(s => s.trim()).filter(Boolean),
      moq: prodMoq.trim(),
      inStock: prodInStock,
      stockLocation: prodStockLocation.trim(),
      retailAvailable: prodRetailAvailable,
      wholesaleAvailable: prodWholesaleAvailable,
      isFeatured: prodFeatured,
      isNew: prodIsNew,
      description: prodDesc.trim(),
      descriptionFr: prodDescFr.trim() || undefined,
    };

    try {
      let res;
      if (editingProduct) {
        res = await authFetch(`/api/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await authFetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showToast(editingProduct ? 'Product updated successfully' : 'Product created successfully', 'success');
        setProductModalOpen(false);
        fetchData();
      } else {
        showToast('Error saving product', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await authFetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Product deleted from catalog', 'success');
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting product', 'error');
    }
  };

  // Quick Inline Price Change
  const handleQuickPriceChange = async (productId: string) => {
    const rawVal = quickPriceEdits[productId];
    if (rawVal === undefined) return;
    const num = parseFloat(rawVal);
    if (isNaN(num) || num < 0) {
      showToast('Please enter a valid numeric price', 'error');
      return;
    }

    setSavingPriceId(productId);
    try {
      const res = await authFetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: num, isQuoteOnly: false })
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: num, isQuoteOnly: false } : p));
        setQuickPriceEdits(prev => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
        showToast('Price updated successfully', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update price', 'error');
    } finally {
      setSavingPriceId(null);
    }
  };

  // ----------------------------------------------------
  // Order Operations
  // ----------------------------------------------------
  const handleUpdateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const res = await authFetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to update order');
      setOrders(prev => prev.map(o => o.id === id ? data : o));
      setSelectedOrderDetails(prev => prev?.id === id ? data : prev);
      showToast('Order updated successfully', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Failed to update order', 'error');
    }
  };

  // ----------------------------------------------------
  // Sourcing & Wholesale Request Operations
  // ----------------------------------------------------
  const handleUpdateRequestStatus = async (id: string, status: string) => {
    try {
      const res = await authFetch(`/api/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: status as any, updatedAt: new Date().toISOString() } : r));
        if (selectedRequestDetails?.id === id) {
          setSelectedRequestDetails(prev => prev ? { ...prev, status: status as any } : null);
        }
        showToast(`Request status changed to "${status}"`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm('Delete this sourcing request inquiry?')) return;
    try {
      const res = await authFetch(`/api/requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
        if (selectedRequestDetails?.id === id) setSelectedRequestDetails(null);
        showToast('Request record removed', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete request', 'error');
    }
  };

  const openQuotationModal = (req: SourcingRequest) => {
    const existing = quotations.find(q => q.id === req.quotationId);
    setQuotationRequest(req);
    setQuotationForm({
      itemsSummary: existing?.itemsSummary || `${req.productName} × ${req.quantity}`,
      unitPrice: existing ? String(existing.unitPrice) : '', estimatedShipping: existing ? String(existing.estimatedShipping) : '',
      totalAmount: existing ? String(existing.totalAmount) : '', currency: existing?.currency || 'USD', moq: existing ? String(existing.moq) : String(req.quantity || ''),
      validityDays: existing ? String(existing.validityDays) : '7', productionDays: existing?.productionDays || '', notes: existing?.notes || ''
    });
    setQuotationModalOpen(true);
  };

  const saveQuotation = async () => {
    if (!quotationRequest) return;
    const payload = { requestId: quotationRequest.id, trackingCode: quotationRequest.trackingCode || '', customerName: quotationRequest.customerName, email: quotationRequest.email || '', whatsapp: quotationRequest.whatsapp || '', ...quotationForm, unitPrice:Number(quotationForm.unitPrice)||0, estimatedShipping:Number(quotationForm.estimatedShipping)||0, totalAmount:Number(quotationForm.totalAmount)||0, moq:Number(quotationForm.moq)||0, validityDays:Number(quotationForm.validityDays)||7, status: existing?.status || 'sent' };
    try {
      const existing = quotations.find(q => q.id === quotationRequest.quotationId);
      const res = existing ? await authFetch(`/api/quotations/${existing.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }) : await authFetch('/api/quotations', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Failed to save quotation');
      setQuotations(prev => existing ? prev.map(q => q.id === data.id ? data : q) : [data, ...prev]);
      setRequests(prev => prev.map(r => r.id === quotationRequest.id ? {...r, quotationId:data.id, status:'quoted'} : r));
      setQuotationModalOpen(false); setQuotationRequest(null); showToast('Quotation saved and request marked as quoted', 'success');
    } catch (err:any) { showToast(err?.message || 'Failed to save quotation', 'error'); }
  };

  // ----------------------------------------------------
  // Category Operations
  // ----------------------------------------------------
  const openCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatNameFr(cat.nameFr || '');
      setCatIcon(cat.icon || 'ShoppingBag');
      setCatImage(cat.image || '');
      setCatDesc(cat.description || '');
      setCatDescFr(cat.descriptionFr || '');
      setCatOrder(String(cat.order || 1));
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatNameFr('');
      setCatIcon('ShoppingBag');
      setCatImage('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80');
      setCatDesc('');
      setCatDescFr('');
      setCatOrder(String(categories.length + 1));
    }
    setCategoryModalOpen(true);
  };

  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCatImage(true);
    const url = await uploadImageFile(file);
    if (url) {
      setCatImage(url);
      showToast('Category image uploaded', 'success');
    }
    setUploadingCatImage(false);
    if (catFileInputRef.current) catFileInputRef.current.value = '';
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    const payload = {
      name: catName.trim(),
      nameFr: catNameFr.trim() || catName.trim(),
      icon: catIcon.trim() || 'ShoppingBag',
      image: catImage.trim() || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
      description: catDesc.trim(),
      descriptionFr: catDescFr.trim() || catDesc.trim(),
      order: parseInt(catOrder, 10) || categories.length + 1
    };

    try {
      let res;
      if (editingCategory) {
        res = await authFetch(`/api/categories/${editingCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await authFetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (res.ok) {
        showToast(editingCategory ? 'Category updated' : 'Category created', 'success');
        setCategoryModalOpen(false);
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'Error saving category', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await authFetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Category deleted', 'success');
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'Error deleting category', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting category', 'error');
    }
  };

  // ----------------------------------------------------
  // Promotion Operations
  // ----------------------------------------------------
  const openPromotionModal = (promo?: Promotion) => {
    if (promo) {
      setEditingPromo(promo);
      setPromoTitle(promo.title);
      setPromoTitleFr(promo.titleFr || '');
      setPromoSubtitle(promo.subtitle || '');
      setPromoSubtitleFr(promo.subtitleFr || '');
      setPromoCode(promo.code || 'SPECIAL10');
      setPromoDiscountPercent(String(promo.discountPercent || 10));
      setPromoBadge(promo.badge || `${promo.discountPercent || 10}% OFF`);
      setPromoBannerImage(promo.bannerImage || '');
      setPromoLinkUrl(promo.linkUrl || '/shop');
      setPromoExpiryDate(promo.expiryDate || '2026-12-31');
      setPromoActive(promo.active ?? true);
    } else {
      setEditingPromo(null);
      setPromoTitle('');
      setPromoTitleFr('');
      setPromoSubtitle('Limited-time factory direct savings');
      setPromoSubtitleFr('Économies d\'usine à durée limitée');
      setPromoCode('DISCOUNT15');
      setPromoDiscountPercent('15');
      setPromoBadge('15% OFF');
      setPromoBannerImage('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80');
      setPromoLinkUrl('/shop');
      setPromoExpiryDate('2026-12-31');
      setPromoActive(true);
    }
    setPromoModalOpen(true);
  };

  const handlePromoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPromoImage(true);
    const url = await uploadImageFile(file);
    if (url) {
      setPromoBannerImage(url);
      showToast('Banner image uploaded', 'success');
    }
    setUploadingPromoImage(false);
    if (promoFileInputRef.current) promoFileInputRef.current.value = '';
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle.trim()) {
      showToast('Promotion title is required', 'error');
      return;
    }
    const payload = {
      title: promoTitle.trim(),
      titleFr: promoTitleFr.trim() || promoTitle.trim(),
      subtitle: promoSubtitle.trim(),
      subtitleFr: promoSubtitleFr.trim() || promoSubtitle.trim(),
      code: promoCode.trim().toUpperCase(),
      discountPercent: parseInt(promoDiscountPercent, 10) || 10,
      badge: promoBadge.trim() || `${promoDiscountPercent}% OFF`,
      bannerImage: promoBannerImage.trim(),
      linkUrl: promoLinkUrl.trim() || '/shop',
      active: promoActive,
      expiryDate: promoExpiryDate
    };

    try {
      let res;
      if (editingPromo) {
        res = await authFetch(`/api/promotions/${editingPromo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await authFetch('/api/promotions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (res.ok) {
        showToast(editingPromo ? 'Promotion updated' : 'Promotion created', 'success');
        setPromoModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving promotion', 'error');
    }
  };

  const handleTogglePromoActive = async (promo: Promotion) => {
    try {
      const res = await authFetch(`/api/promotions/${promo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !promo.active })
      });
      if (res.ok) {
        setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, active: !p.active } : p));
        showToast(`Promotion is now ${!promo.active ? 'Active' : 'Inactive'}`, 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!window.confirm('Delete this promotion?')) return;
    try {
      const res = await authFetch(`/api/promotions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Promotion removed', 'success');
        setPromotions(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting promotion', 'error');
    }
  };

  // ----------------------------------------------------
  // Settings & Content Operations
  // ----------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings)
      });
      if (res.ok) {
        const updated = await res.json();
        updateSettingsState(updated);
        showToast('Website content & settings updated successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving settings', 'error');
    }
  };

  // ----------------------------------------------------
  // Computed Filtered Data
  // ----------------------------------------------------
  const filteredProducts = products.filter(p => {
    const q = searchProductQuery.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(q) ||
      (p.titleFr && p.titleFr.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q);
    const matchCat = productCatFilter === 'all' || p.categoryId === productCatFilter || p.categorySlug === productCatFilter;
    let matchType = true;
    if (productTypeFilter === 'retail') matchType = p.retailAvailable;
    else if (productTypeFilter === 'wholesale') matchType = p.wholesaleAvailable;
    else if (productTypeFilter === 'quote') matchType = Boolean(p.isQuoteOnly);
    return matchSearch && matchCat && matchType;
  });

  const filteredOrders = orders.filter(o => {
    const orderMatch = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    const paymentMatch = paymentStatusFilter === 'all' || o.paymentStatus === paymentStatusFilter;
    return orderMatch && paymentMatch;
  });

  const filteredRequests = requests.filter(r => {
    const q = searchRequestQuery.toLowerCase();
    const matchSearch = r.productName.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.destinationCountry.toLowerCase().includes(q) ||
      r.whatsapp.includes(q) ||
      (r.destinationCity && r.destinationCity.toLowerCase().includes(q));
    const matchStatus = requestStatusFilter === 'all' || r.status === requestStatusFilter;
    const matchType = requestTypeFilter === 'all' || r.orderType === requestTypeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const wholesaleRequestsCount = requests.filter(r => r.orderType === 'wholesale').length;
  const retailRequestsCount = requests.filter(r => r.orderType === 'retail').length;
  const newRequestsCount = requests.filter(r => r.status === 'new').length;

  // ----------------------------------------------------
  // RENDER: AUTH INITIALIZATION
  // ----------------------------------------------------
  if (authLoadingState) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-[#F47721]" />
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: LOGIN FORM
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7 text-[#F47721]" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Admin Access
            </h2>
            <p className="text-xs text-slate-500">
              Sign in to manage catalog products, categories, pricing, customer requests, and promotions
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:ring-1 focus:ring-[#F47721] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:ring-1 focus:ring-[#F47721] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Use the administrator account created in Supabase Auth.
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#F47721] block">
            J Online Shopping • Admin Management Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            China Sourcing, Wholesale Inquiries, Product Catalog & Site Content Management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-red-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Clean Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'stats', label: 'Overview', icon: TrendingUp },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Truck },
          { id: 'requests', label: `Sourcing & Wholesale (${requests.length})`, icon: FileText, badge: newRequestsCount > 0 ? `${newRequestsCount} new` : undefined },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'promotions', label: `Promotions (${promotions.length})`, icon: Tag },
          { id: 'settings', label: 'Website & Social Links', icon: Sliders },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#5121A8] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F47721] text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---------------- TAB 1: OVERVIEW & STATS ---------------- */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Catalog Products</span>
              <span className="text-3xl font-black text-slate-900">{products.length}</span>
              <span className="text-[10px] text-emerald-600 block font-semibold">Active in Online Store</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Requests</span>
              <span className="text-3xl font-black text-[#F47721]">{requests.length}</span>
              <span className="text-[10px] text-slate-500 block">{newRequestsCount} Unreviewed Inquiries</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Wholesale Inquiries</span>
              <span className="text-3xl font-black text-[#5121A8]">
                {wholesaleRequestsCount}
              </span>
              <span className="text-[10px] text-slate-500 block">B2B Bulk / Factory Orders</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Orders</span>
              <span className="text-3xl font-black text-slate-900">{orders.length}</span>
              <span className="text-[10px] text-amber-600 block font-semibold">{orders.filter(o => ['pending','processing'].includes(o.orderStatus)).length} active</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Categories & Promos</span>
              <span className="text-3xl font-black text-slate-800">
                {categories.length} / {promotions.filter(p => p.active).length}
              </span>
              <span className="text-[10px] text-slate-500 block">Categories / Active Promos</span>
            </div>
          </div>

          {/* Recent Inquiries & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Recent Product & Sourcing Inquiries
                </h3>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-xs text-[#F47721] font-bold hover:underline"
                >
                  View All ({requests.length}) →
                </button>
              </div>

              {requests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No sourcing requests received yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {requests.slice(0, 5).map(req => (
                    <div key={req.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.images[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&q=80'}
                          alt={req.productName}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{req.productName}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              req.orderType === 'wholesale' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {req.orderType}
                            </span>
                          </div>
                          <span className="text-slate-500 text-[11px] block">
                            {req.customerName} • {req.destinationCountry} • {req.quantity} pcs
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          req.status === 'new' ? 'bg-amber-100 text-amber-800' :
                          req.status === 'sourcing' ? 'bg-blue-100 text-blue-800' :
                          req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {req.status}
                        </span>
                        <button
                          onClick={() => {
                            const msg = `Hello ${req.customerName}! This is the J Online Shopping sourcing team in China regarding your inquiry for "${req.productName}". We are ready to assist you.`;
                            openWhatsApp(msg);
                          }}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                          title="Open WhatsApp Chat"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Dashboard Shortcuts
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    openProductModal();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#F47721] font-bold text-xs transition flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Product
                  </span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('categories');
                    openCategoryModal();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#5121A8] font-bold text-xs transition flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FolderPlus className="w-4 h-4" />
                    Add Category
                  </span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('promotions');
                    openPromotionModal();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Create Promotion
                  </span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    Edit Content & Rates
                  </span>
                  <span>→</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Support Desks</span>
                </div>
                <div>WhatsApp: <strong>{siteSettings.whatsappNumber}</strong></div>
                <div>Support Email: <strong>{siteSettings.supportEmail}</strong></div>
                <div>Air Base: <strong>${siteSettings.shippingRates.airFreightPerKg}/kg</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: PRODUCTS MANAGEMENT ---------------- */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Products & Price Management
              </h2>
              <span className="text-xs text-slate-500">
                Add products, upload photos, and change prices directly in the table or modal
              </span>
            </div>

            <button
              onClick={() => openProductModal()}
              className="px-5 py-2.5 rounded-xl bg-[#F47721] hover:bg-orange-600 text-white font-bold text-xs transition shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by title, description, or keyword..."
                value={searchProductQuery}
                onChange={(e) => setSearchProductQuery(e.target.value)}
                className="w-full text-xs text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden bg-white"
              />
            </div>
            <select
              value={productCatFilter}
              onChange={(e) => setProductCatFilter(e.target.value)}
              className="text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={productTypeFilter}
              onChange={(e) => setProductTypeFilter(e.target.value as any)}
              className="text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Product Types</option>
              <option value="retail">Retail Available</option>
              <option value="wholesale">Wholesale Available</option>
              <option value="quote">Quote Only Items</option>
            </select>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (Quick Edit)</th>
                    <th className="p-4">Location / MOQ</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(p => {
                    const isEditingPrice = quickPriceEdits[p.id] !== undefined;
                    const catObj = categories.find(c => c.id === p.categoryId || c.slug === p.categorySlug);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&q=80'}
                              alt={p.title}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                            />
                            <div className="max-w-xs">
                              <span className="font-bold text-slate-900 block truncate">{p.title}</span>
                              {p.titleFr && <span className="text-[10px] text-slate-400 block truncate">FR: {p.titleFr}</span>}
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {p.isFeatured && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">Featured</span>
                                )}
                                {p.isNew && (
                                  <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">New</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">
                          {catObj?.name || p.categoryId.replace('cat-', '')}
                        </td>
                        <td className="p-4">
                          {p.isQuoteOnly ? (
                            <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md text-[11px]">
                              Quote on Request
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={isEditingPrice ? quickPriceEdits[p.id] : (p.price ?? '')}
                                  onChange={(e) => setQuickPriceEdits({ ...quickPriceEdits, [p.id]: e.target.value })}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleQuickPriceChange(p.id);
                                  }}
                                  className="w-24 pl-5 pr-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:border-[#F47721] focus:outline-hidden"
                                />
                              </div>
                              {isEditingPrice && (
                                <button
                                  onClick={() => handleQuickPriceChange(p.id)}
                                  disabled={savingPriceId === p.id}
                                  className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                                  title="Save Price"
                                >
                                  {savingPriceId === p.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-slate-500">
                          <div>{p.stockLocation || 'Guangzhou'}</div>
                          <div className="text-[10px] text-slate-400">MOQ: {p.moq || '1 pc'}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                            {p.retailAvailable && <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Retail</span>}
                            {p.wholesaleAvailable && <span className="px-2 py-0.5 rounded bg-purple-50 text-[#5121A8] text-[10px] font-bold">Wholesale</span>}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openProductModal(p)}
                              className="p-2 rounded-lg text-slate-600 hover:text-[#F47721] hover:bg-orange-50 transition"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: ORDERS MANAGEMENT ---------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Orders Management</h2>
              <p className="text-xs text-slate-500">Review customer orders, payment state, fulfillment progress and shipment tracking.</p>
            </div>
            <div className="flex gap-2">
              <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)} className="text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-200 bg-white">
                <option value="all">All Order Statuses</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
              </select>
              <select value={paymentStatusFilter} onChange={e => setPaymentStatusFilter(e.target.value)} className="text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-200 bg-white">
                <option value="all">All Payments</option><option value="pending">Payment Pending</option><option value="paid">Paid</option><option value="partially_paid">Partially Paid</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Payment</th><th className="p-4">Fulfillment</th><th className="p-4">Created</th><th className="p-4 text-right">View</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4"><div className="font-bold text-slate-900">{order.orderNumber || order.id}</div><div className="text-[10px] text-slate-400">{order.trackingCode || 'No tracking code'}</div></td>
                      <td className="p-4"><div className="font-semibold text-slate-900">{order.customerName}</div><div className="text-[10px] text-slate-400">{order.email || order.whatsapp}</div></td>
                      <td className="p-4 font-black text-slate-900">{order.currency} {order.totalAmount.toFixed(2)}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{order.paymentStatus}</span></td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' : order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' : order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{order.orderStatus}</span></td>
                      <td className="p-4 text-slate-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}</td>
                      <td className="p-4 text-right"><button onClick={() => setSelectedOrderDetails(order)} className="p-2 rounded-lg text-slate-600 hover:text-[#F47721] hover:bg-orange-50 transition" title="View Order"><Eye className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOrders.length === 0 && <div className="p-12 text-center text-xs text-slate-400">No orders match the current filters.</div>}
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: SOURCING & WHOLESALE INQUIRIES ---------------- */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Customer Sourcing & Wholesale Inquiries
              </h2>
              <p className="text-xs text-slate-500">
                Manage customer "Request a Product" submissions and B2B wholesale factory inquiries
              </p>
            </div>

            {/* Sub-Filter Tabs: All vs Retail vs Wholesale */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setRequestTypeFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  requestTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({requests.length})
              </button>
              <button
                onClick={() => setRequestTypeFilter('retail')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  requestTypeFilter === 'retail' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Retail ({retailRequestsCount})
              </button>
              <button
                onClick={() => setRequestTypeFilter('wholesale')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  requestTypeFilter === 'wholesale' ? 'bg-[#5121A8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Wholesale B2B ({wholesaleRequestsCount})
              </button>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer name, product, WhatsApp number, or destination..."
                value={searchRequestQuery}
                onChange={(e) => setSearchRequestQuery(e.target.value)}
                className="w-full text-xs text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden bg-white"
              />
            </div>
            <select
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value)}
              className="text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Inquiries</option>
              <option value="sourcing">Sourcing in China</option>
              <option value="quoted">Quoted to Client</option>
              <option value="in_production">In Production</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700 text-sm">No inquiries match your criteria</div>
              <p className="text-xs text-slate-400">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredRequests.map(req => (
                <div
                  key={req.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 hover:border-orange-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900">
                        {req.customerName}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.orderType === 'wholesale' ? 'bg-indigo-100 text-[#5121A8]' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {req.orderType === 'wholesale' ? 'Wholesale (B2B)' : 'Retail Sourcing'}
                      </span>
                      <span className="text-xs text-slate-400">
                        • {req.destinationCountry} {req.destinationCity ? `(${req.destinationCity})` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status dropdown */}
                      <select
                        value={req.status}
                        onChange={(e) => handleUpdateRequestStatus(req.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer ${
                          req.status === 'new' ? 'bg-amber-50 text-amber-900' :
                          req.status === 'sourcing' ? 'bg-blue-50 text-blue-900' :
                          req.status === 'completed' ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-50 text-slate-800'
                        }`}
                      >
                        <option value="new">New Inquiry</option>
                        <option value="sourcing">Sourcing in China</option>
                        <option value="quoted">Quoted to Client</option>
                        <option value="in_production">In Production</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => {
                          const msg = `Hello ${req.customerName}! This is the J Online Shopping team regarding your sourcing request for "${req.productName}". We have checked with verified factory suppliers in China.`;
                          openWhatsApp(msg);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                        title="Chat directly on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </button>

                      <button
                        onClick={() => openQuotationModal(req)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#F47721] hover:bg-orange-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        {req.quotationId ? 'Edit Quote' : 'Create Quote'}
                      </button>

                      <button
                        onClick={() => handleDeleteRequest(req.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Request"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Details & Images */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs">
                    {/* Images preview */}
                    <div className="md:col-span-4 flex flex-wrap gap-2">
                      {req.images && req.images.length > 0 ? (
                        req.images.map((img, i) => (
                          <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group relative">
                            <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition">
                              View
                            </div>
                          </a>
                        ))
                      ) : (
                        <div className="w-24 h-24 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[11px] text-slate-400">
                          No images
                        </div>
                      )}
                    </div>

                    {/* Sourcing Requirements */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Requested Product</span>
                        <h4 className="text-base font-bold text-slate-900">{req.productName}</h4>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-600 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div>Quantity: <strong className="text-slate-900">{req.quantity} pcs</strong></div>
                        <div>Target Budget: <strong className="text-slate-900">{req.targetBudget || 'Negotiable'}</strong></div>
                        <div>Desired Size/Color: <strong className="text-slate-900">{req.desiredSize || 'N/A'} / {req.desiredColor || 'N/A'}</strong></div>
                        <div>WhatsApp: <strong className="text-emerald-700">{req.whatsapp || 'N/A'}</strong></div>
                        <div>Email: <strong className="text-slate-900">{req.email || 'N/A'}</strong></div>
                        <div>Submission Date: <strong className="text-slate-900">{new Date(req.createdAt).toLocaleDateString()}</strong></div>
                      </div>

                      {req.description && (
                        <div className="text-slate-700">
                          <strong>Description / Requirements:</strong> {req.description}
                        </div>
                      )}

                      {req.specifications && (
                        <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 text-orange-950">
                          <strong>Technical / Material Specifications:</strong> {req.specifications}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedOrderDetails(null)}>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between"><div><h3 className="text-lg font-black text-slate-900">Order {selectedOrderDetails.orderNumber || selectedOrderDetails.id}</h3><p className="text-xs text-slate-400">{selectedOrderDetails.customerName} • {selectedOrderDetails.email || selectedOrderDetails.whatsapp}</p></div><button onClick={() => setSelectedOrderDetails(null)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button></div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-xs font-bold text-slate-600">Payment Status<select value={selectedOrderDetails.paymentStatus} onChange={e => handleUpdateOrder(selectedOrderDetails.id, {paymentStatus:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 bg-white font-normal"><option value="pending">Pending</option><option value="paid">Paid</option><option value="partially_paid">Partially Paid</option><option value="failed">Failed</option><option value="refunded">Refunded</option></select></label>
                <label className="text-xs font-bold text-slate-600">Order Status<select value={selectedOrderDetails.orderStatus} onChange={e => handleUpdateOrder(selectedOrderDetails.id, {orderStatus:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border border-slate-200 bg-white font-normal"><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></label>
                <label className="text-xs font-bold text-slate-600">Carrier<input value={selectedOrderDetails.carrier || ''} onChange={e => setSelectedOrderDetails({...selectedOrderDetails, carrier:e.target.value})} onBlur={e => handleUpdateOrder(selectedOrderDetails.id,{carrier:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border border-slate-200" placeholder="DHL, FedEx, local carrier..." /></label>
                <label className="text-xs font-bold text-slate-600">Tracking Number<input value={selectedOrderDetails.trackingNumber || ''} onChange={e => setSelectedOrderDetails({...selectedOrderDetails, trackingNumber:e.target.value})} onBlur={e => handleUpdateOrder(selectedOrderDetails.id,{trackingNumber:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border border-slate-200" placeholder="Shipment tracking number" /></label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50"><span className="text-[10px] text-slate-400 block">Subtotal</span><strong>{selectedOrderDetails.currency} {selectedOrderDetails.subtotal.toFixed(2)}</strong></div>
                <div className="p-4 rounded-2xl bg-slate-50"><span className="text-[10px] text-slate-400 block">Shipping</span><strong>{selectedOrderDetails.currency} {selectedOrderDetails.shippingCost.toFixed(2)}</strong></div>
                <div className="p-4 rounded-2xl bg-orange-50"><span className="text-[10px] text-orange-500 block">Total</span><strong>{selectedOrderDetails.currency} {selectedOrderDetails.totalAmount.toFixed(2)}</strong></div>
                <div className="p-4 rounded-2xl bg-slate-50"><span className="text-[10px] text-slate-400 block">Payment Method</span><strong>{selectedOrderDetails.paymentMethod || '—'}</strong></div>
              </div>
              <div><h4 className="text-sm font-black text-slate-900 mb-2">Shipping Address</h4><div className="p-4 rounded-2xl bg-slate-50 text-xs text-slate-700 whitespace-pre-wrap">{selectedOrderDetails.shippingAddress || 'No shipping address provided.'}</div></div>
              <div><h4 className="text-sm font-black text-slate-900 mb-2">Items</h4><div className="space-y-2">{selectedOrderDetails.items.map((item:any,i)=><div key={i} className="p-3 rounded-xl border border-slate-100 bg-white flex justify-between gap-3 text-xs"><span className="font-semibold">{item.title || item.name || `Item ${i+1}`}{item.quantity ? ` × ${item.quantity}` : ''}</span><span className="font-bold">{item.price != null ? `${selectedOrderDetails.currency} ${Number(item.price).toFixed(2)}` : ''}</span></div>)}</div></div>
              <label className="text-xs font-bold text-slate-600">Internal Notes<textarea value={selectedOrderDetails.notes || ''} onChange={e => setSelectedOrderDetails({...selectedOrderDetails, notes:e.target.value})} onBlur={e => handleUpdateOrder(selectedOrderDetails.id,{notes:e.target.value})} rows={3} className="mt-1 w-full p-3 rounded-xl border border-slate-200" placeholder="Internal fulfillment notes..." /></label>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 4: CATEGORIES MANAGEMENT ---------------- */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Categories Management
              </h2>
              <span className="text-xs text-slate-500">
                Create and manage storefront categories, order, and sector cover photos
              </span>
            </div>
            <button
              onClick={() => openCategoryModal()}
              className="px-5 py-2.5 rounded-xl bg-[#F47721] hover:bg-orange-600 text-white font-bold text-xs transition shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{cat.name}</span>
                    {cat.nameFr && <span className="text-xs text-slate-400">({cat.nameFr})</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openCategoryModal(cat)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-[#F47721] hover:bg-orange-50 transition"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {cat.description || 'No description provided.'}
                </p>
                <div className="text-[10px] text-slate-400">
                  Slug: <code className="text-slate-600">{cat.slug}</code> • Order: {cat.order}
                </div>
                <div className="text-[10px] font-bold text-slate-500">
                  {products.filter(p => p.categoryId === cat.id || p.categorySlug === cat.slug).length} product{products.filter(p => p.categoryId === cat.id || p.categorySlug === cat.slug).length === 1 ? '' : 's'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 5: PROMOTIONS MANAGEMENT ---------------- */}
      {activeTab === 'promotions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Promotions & Seasonal Campaigns
              </h2>
              <span className="text-xs text-slate-500">
                Manage promo banners, coupon discount badges, and expiration dates
              </span>
            </div>
            <button
              onClick={() => openPromotionModal()}
              className="px-5 py-2.5 rounded-xl bg-[#F47721] hover:bg-orange-600 text-white font-bold text-xs transition shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Promotion</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {promotions.map(promo => (
              <div key={promo.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-800">
                    {promo.badge || `${promo.discountPercent}% OFF`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePromoActive(promo)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        promo.active ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {promo.active ? '● Active' : '○ Inactive'}
                    </button>
                    <button
                      onClick={() => openPromotionModal(promo)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-[#F47721] hover:bg-orange-50 transition"
                      title="Edit Promotion"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Promotion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={promo.bannerImage} alt={promo.title} className="w-full h-full object-cover" />
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{promo.title}</h4>
                  {promo.subtitle && <p className="text-xs text-slate-600 mt-0.5">{promo.subtitle}</p>}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div>Code: <strong className="text-slate-900">{promo.code || 'N/A'}</strong></div>
                  <div>Expires: <strong className="text-slate-900">{promo.expiryDate}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 6: WEBSITE CONTENT & SETTINGS ---------------- */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Website Content, Social Links & Freight Rates
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update social media channels (WhatsApp, TikTok, Instagram, Facebook), support channels, announcement banners, and freight rates directly from the web.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F47721] hover:bg-orange-600 text-white font-bold text-xs transition shadow-md flex items-center gap-2 shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save All Changes</span>
            </button>
          </div>

          {/* ---------------- SOCIAL MEDIA & DIRECT MESSAGING SECTION ---------------- */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#171827] to-slate-900 text-white space-y-6 shadow-lg border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-orange-500/20 text-[#F47721]">
                    <Share2 className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-black text-white">
                    Social Media & Direct Messaging Channels
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  These links appear live in the site footer, contact pages, and WhatsApp inquiry buttons across the entire website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Live on Website
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* WhatsApp Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  WhatsApp Contact Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={siteSettings.whatsappNumber}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                    placeholder="+8613800000000"
                    className="flex-1 text-xs text-white p-3 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-[#F47721] focus:outline-hidden font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const clean = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
                      if (clean) {
                        setSiteSettings({
                          ...siteSettings,
                          socialLinks: {
                            ...siteSettings.socialLinks,
                            whatsapp: `https://wa.me/${clean}`
                          }
                        });
                        showToast('WhatsApp link generated from number', 'success');
                      } else {
                        showToast('Please enter a phone number with country code first', 'error');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap transition flex items-center gap-1"
                    title="Generate wa.me link from phone number"
                  >
                    <span>Generate Link</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 block">
                  International format with country code (e.g. +8613800000000 or +1234567890).
                </span>
              </div>

              {/* WhatsApp Direct Chat Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-200">
                    WhatsApp Direct Chat Link (wa.me)
                  </label>
                  {siteSettings.socialLinks?.whatsapp && (
                    <button
                      type="button"
                      onClick={() => window.open(siteSettings.socialLinks.whatsapp, '_blank')}
                      className="text-emerald-400 hover:text-emerald-300 text-[11px] font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test</span>
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.whatsapp || ''}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    socialLinks: { ...siteSettings.socialLinks, whatsapp: e.target.value }
                  })}
                  placeholder="https://wa.me/8613800000000"
                  className="w-full text-xs text-white p-3 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-[#F47721] focus:outline-hidden font-mono"
                />
                <span className="text-[11px] text-slate-400 block">
                  Full WhatsApp click-to-chat URL used in the footer and contact buttons.
                </span>
              </div>

              {/* TikTok Profile Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-200">
                    TikTok Profile Link
                  </label>
                  {siteSettings.socialLinks?.tiktok && (
                    <button
                      type="button"
                      onClick={() => window.open(siteSettings.socialLinks.tiktok, '_blank')}
                      className="text-[#F47721] hover:underline text-[11px] font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test</span>
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.tiktok || ''}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    socialLinks: { ...siteSettings.socialLinks, tiktok: e.target.value }
                  })}
                  placeholder="https://tiktok.com/@jonlineshopping"
                  className="w-full text-xs text-white p-3 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-[#F47721] focus:outline-hidden font-mono"
                />
                <span className="text-[11px] text-slate-400 block">
                  e.g. https://tiktok.com/@youraccount or https://vm.tiktok.com/...
                </span>
              </div>

              {/* Instagram Profile Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-200">
                    Instagram Profile Link
                  </label>
                  {siteSettings.socialLinks?.instagram && (
                    <button
                      type="button"
                      onClick={() => window.open(siteSettings.socialLinks.instagram, '_blank')}
                      className="text-[#F47721] hover:underline text-[11px] font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test</span>
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.instagram || ''}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    socialLinks: { ...siteSettings.socialLinks, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/jonlineshopping"
                  className="w-full text-xs text-white p-3 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-[#F47721] focus:outline-hidden font-mono"
                />
                <span className="text-[11px] text-slate-400 block">
                  e.g. https://instagram.com/youraccount
                </span>
              </div>

              {/* Facebook Page Link */}
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-200">
                    Facebook Page Link
                  </label>
                  {siteSettings.socialLinks?.facebook && (
                    <button
                      type="button"
                      onClick={() => window.open(siteSettings.socialLinks.facebook, '_blank')}
                      className="text-blue-400 hover:text-blue-300 text-[11px] font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test</span>
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.facebook || ''}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    socialLinks: { ...siteSettings.socialLinks, facebook: e.target.value }
                  })}
                  placeholder="https://facebook.com/jonlineshopping"
                  className="w-full text-xs text-white p-3 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-[#F47721] focus:outline-hidden font-mono"
                />
                <span className="text-[11px] text-slate-400 block">
                  e.g. https://facebook.com/yourpage or profile URL
                </span>
              </div>
            </div>

            {/* Live Interactive Footer Preview */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Live Preview (How buttons appear to website visitors):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={siteSettings.socialLinks?.whatsapp || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={siteSettings.socialLinks?.tiktok || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition"
                >
                  TikTok
                </a>
                <a
                  href={siteSettings.socialLinks?.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition"
                >
                  Instagram
                </a>
                <a
                  href={siteSettings.socialLinks?.facebook || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-xs"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* ---------------- BASIC CONTACT CHANNELS ---------------- */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#5121A8]" />
              <span>Email & Physical Warehouse Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={siteSettings.supportEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                  placeholder="contact@jonlineshopping.com"
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Sourcing Inquiries Email
                </label>
                <input
                  type="email"
                  value={siteSettings.sourcingEmail || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, sourcingEmail: e.target.value })}
                  placeholder="sourcing@jonlineshopping.com"
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  China Warehouse & Hub Location
                </label>
                <input
                  type="text"
                  value={siteSettings.chinaWarehouse || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, chinaWarehouse: e.target.value })}
                  placeholder="Baiyun District, Guangzhou, Guangdong, China"
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Customer Support Phone
                </label>
                <input
                  type="text"
                  value={siteSettings.supportPhone || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, supportPhone: e.target.value })}
                  placeholder="+86 20 8888 9999"
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* ---------------- ANNOUNCEMENT BANNERS ---------------- */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
              Top Announcement Banners
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Announcement Banner (English)
                </label>
                <input
                  type="text"
                  value={siteSettings.announcementEn}
                  onChange={(e) => setSiteSettings({ ...siteSettings, announcementEn: e.target.value })}
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Announcement Banner (French)
                </label>
                <input
                  type="text"
                  value={siteSettings.announcementFr}
                  onChange={(e) => setSiteSettings({ ...siteSettings, announcementFr: e.target.value })}
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* ---------------- FREIGHT RATES DEFAULTS ---------------- */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              <span>Freight Rate Defaults (Used in Calculator & Estimates)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Air Freight Rate ($/kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={siteSettings.shippingRates.airFreightPerKg}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    shippingRates: { ...siteSettings.shippingRates, airFreightPerKg: parseFloat(e.target.value) || 12 }
                  })}
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Sea Freight Rate ($/CBM)
                </label>
                <input
                  type="number"
                  step="1"
                  value={siteSettings.shippingRates.seaFreightPerCbm}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    shippingRates: { ...siteSettings.shippingRates, seaFreightPerCbm: parseFloat(e.target.value) || 180 }
                  })}
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Express Air ($/kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={siteSettings.shippingRates.expressPerKg || 18}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    shippingRates: { ...siteSettings.shippingRates, expressPerKg: parseFloat(e.target.value) || 18 }
                  })}
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Custom Domain & DNS Connectivity */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#5121A8]" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Custom Domain & DNS Connectivity
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Connect your production domain for brand credibility and white-label checkout.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Domain Connected</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                  <span>TLS 1.3 SSL Active</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Connected Primary Domain
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={siteSettings.customDomain || 'shop.jonlineshopping.com'}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      customDomain: e.target.value.toLowerCase().trim()
                    })}
                    placeholder="shop.yourdomain.com"
                    className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#5121A8] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`DNS records for ${siteSettings.customDomain || 'shop.jonlineshopping.com'} verified successfully.`, 'success');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold whitespace-nowrap transition"
                  >
                    Verify DNS
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Configure the DNS records below at your domain registrar (Cloudflare, GoDaddy, Namecheap).
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Deployment Status</span>
                  <span className="text-emerald-600 font-bold">100% Propagated</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Apex & Subdomain routing configured. HTTPS certificate renewal is managed automatically every 90 days.
                </div>
              </div>
            </div>

            {/* DNS Records Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Required DNS Zone Records
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Host Name</th>
                      <th className="py-2.5 px-3">Target Value</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-blue-600">CNAME</td>
                      <td className="py-2.5 px-3 text-slate-800">shop</td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">ais-pre-65rbuycwapb3ufyiepcnzc-248923740159.asia-southeast1.run.app</td>
                      <td className="py-2.5 px-3"><span className="text-emerald-600 font-bold font-sans">Active</span></td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('ais-pre-65rbuycwapb3ufyiepcnzc-248923740159.asia-southeast1.run.app');
                            showToast('CNAME target copied to clipboard', 'info');
                          }}
                          className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-sans font-semibold inline-flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-amber-600">A</td>
                      <td className="py-2.5 px-3 text-slate-800">@</td>
                      <td className="py-2.5 px-3 text-slate-600">34.149.87.45</td>
                      <td className="py-2.5 px-3"><span className="text-emerald-600 font-bold font-sans">Active</span></td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('34.149.87.45');
                            showToast('IP address copied to clipboard', 'info');
                          }}
                          className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-sans font-semibold inline-flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-purple-600">TXT</td>
                      <td className="py-2.5 px-3 text-slate-800">_acme-challenge.shop</td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">google-site-verification=JOS-DOM-849102</td>
                      <td className="py-2.5 px-3"><span className="text-emerald-600 font-bold font-sans">Verified</span></td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('google-site-verification=JOS-DOM-849102');
                            showToast('TXT token copied to clipboard', 'info');
                          }}
                          className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-sans font-semibold inline-flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Changes take effect across the entire website immediately upon saving.
            </span>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#5121A8] hover:bg-purple-800 text-white font-bold text-xs transition shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Website Content & Social Links</span>
            </button>
          </div>
        </form>
      )}

      {/* ---------------- MODAL: ADD / EDIT PRODUCT ---------------- */}
      {quotationModalOpen && quotationRequest && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between"><div><h3 className="text-xl font-black text-slate-900">{quotationRequest.quotationId ? 'Edit Quotation' : 'Create Quotation'}</h3><p className="text-xs text-slate-500">{quotationRequest.customerName} · {quotationRequest.trackingCode}</p></div><button onClick={()=>setQuotationModalOpen(false)} className="p-2 text-slate-400"><X className="w-5 h-5"/></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="md:col-span-2 text-xs font-bold text-slate-700">Items / quotation summary<input value={quotationForm.itemsSummary} onChange={e=>setQuotationForm({...quotationForm,itemsSummary:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
              <label className="text-xs font-bold text-slate-700">Unit price<input type="number" value={quotationForm.unitPrice} onChange={e=>setQuotationForm({...quotationForm,unitPrice:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
              <label className="text-xs font-bold text-slate-700">Estimated shipping<input type="number" value={quotationForm.estimatedShipping} onChange={e=>setQuotationForm({...quotationForm,estimatedShipping:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
              <label className="text-xs font-bold text-slate-700">Total amount<input type="number" value={quotationForm.totalAmount} onChange={e=>setQuotationForm({...quotationForm,totalAmount:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
              <label className="text-xs font-bold text-slate-700">Currency<select value={quotationForm.currency} onChange={e=>setQuotationForm({...quotationForm,currency:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"><option>USD</option><option>EUR</option><option>XOF</option><option>GBP</option></select></label>
              <label className="text-xs font-bold text-slate-700">MOQ<input type="number" value={quotationForm.moq} onChange={e=>setQuotationForm({...quotationForm,moq:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
              <label className="text-xs font-bold text-slate-700">Validity (days)<input type="number" value={quotationForm.validityDays} onChange={e=>setQuotationForm({...quotationForm,validityDays:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
              <label className="text-xs font-bold text-slate-700">Production time<input value={quotationForm.productionDays} onChange={e=>setQuotationForm({...quotationForm,productionDays:e.target.value})} placeholder="e.g. 15-20 days" className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
              <label className="md:col-span-2 text-xs font-bold text-slate-700">Notes<textarea value={quotationForm.notes} onChange={e=>setQuotationForm({...quotationForm,notes:e.target.value})} rows={3} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"/></label>
            </div>
            <div className="flex justify-end gap-3"><button onClick={()=>setQuotationModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold">Cancel</button><button onClick={saveQuotation} className="px-5 py-2 rounded-xl bg-[#F47721] text-white text-sm font-bold"><Save className="inline w-4 h-4 mr-1"/>Save Quotation</button></div>
          </div>
        </div>
      )}

      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <h3 className="text-lg font-black text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Product Title (EN) *</label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Product Title (FR)</label>
                  <input
                    type="text"
                    value={prodTitleFr}
                    onChange={(e) => setProdTitleFr(e.target.value)}
                    placeholder="e.g. Casque Sans Fil à Réduction de Bruit"
                    className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={prodIsQuoteOnly}
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden disabled:bg-slate-100"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-700">
                    <input
                      type="checkbox"
                      checked={prodIsQuoteOnly}
                      onChange={(e) => setProdIsQuoteOnly(e.target.checked)}
                      className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span>Quote on Request Only</span>
                  </label>
                </div>
              </div>

              {/* Product Images: Upload & URL Support */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800">
                  Product Images (Upload or paste image URL)
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={prodImgInput}
                    onChange={(e) => setProdImgInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... or image link"
                    className="flex-1 text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (prodImgInput.trim()) {
                        setProdImages([...prodImages, prodImgInput.trim()]);
                        setProdImgInput('');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap"
                  >
                    Add URL
                  </button>
                  <label className="px-3.5 py-2 rounded-xl bg-[#5121A8] hover:bg-purple-800 text-white text-xs font-bold whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingProdImage ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      ref={prodFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                      disabled={uploadingProdImage}
                    />
                  </label>
                </div>

                {/* Gallery Thumbnails */}
                {prodImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {prodImages.map((img, i) => (
                      <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProdImages(prodImages.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-md p-0.5 w-4 h-4 flex items-center justify-center shadow-xs hover:bg-red-700 transition"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Available Colors (Comma-separated)</label>
                  <input
                    type="text"
                    value={prodColors}
                    onChange={(e) => setProdColors(e.target.value)}
                    placeholder="Black, Gold, Silver, Navy"
                    className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Available Sizes (Comma-separated)</label>
                  <input
                    type="text"
                    value={prodSizes}
                    onChange={(e) => setProdSizes(e.target.value)}
                    placeholder="S, M, L, XL or Standard"
                    className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">MOQ / Packaging</label>
                  <input
                    type="text"
                    value={prodMoq}
                    onChange={(e) => setProdMoq(e.target.value)}
                    placeholder="1 pc (Retail) / 10 pcs (Wholesale)"
                    className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Stock Location</label>
                  <input
                    type="text"
                    value={prodStockLocation}
                    onChange={(e) => setProdStockLocation(e.target.value)}
                    placeholder="Guangzhou Sourcing Center"
                    className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Description (EN)</label>
                  <textarea
                    rows={3}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Description (FR)</label>
                  <textarea
                    rows={3}
                    value={prodDescFr}
                    onChange={(e) => setProdDescFr(e.target.value)}
                    className="w-full text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={prodInStock}
                    onChange={(e) => setProdInStock(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>In Stock / Visible for Sale</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={prodRetailAvailable}
                    onChange={(e) => setProdRetailAvailable(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>Retail Available</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={prodWholesaleAvailable}
                    onChange={(e) => setProdWholesaleAvailable(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>Wholesale Available</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>Featured on Homepage</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={prodIsNew}
                    onChange={(e) => setProdIsNew(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>New Arrival Badge</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F47721] hover:bg-orange-600 text-white font-bold text-xs shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: ADD / EDIT CATEGORY ---------------- */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Name (EN) *</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Industrial Machinery"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Name (FR)</label>
                  <input
                    type="text"
                    value={catNameFr}
                    onChange={(e) => setCatNameFr(e.target.value)}
                    placeholder="e.g. Machines Industrielles"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Category Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer flex items-center justify-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCatImage ? '...' : 'Upload'}</span>
                    <input
                      ref={catFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCatImageUpload}
                      className="hidden"
                      disabled={uploadingCatImage}
                    />
                  </label>
                </div>
                {catImage && (
                  <div className="mt-2 h-20 w-32 rounded-xl overflow-hidden border border-slate-200">
                    <img src={catImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={catOrder}
                    onChange={(e) => setCatOrder(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    placeholder="ShoppingBag, Sparkles, Cpu, etc."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F47721] hover:bg-orange-600 text-white font-bold shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: ADD / EDIT PROMOTION ---------------- */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                {editingPromo ? 'Edit Promotion' : 'Add New Promotion'}
              </h3>
              <button onClick={() => setPromoModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Title (EN) *</label>
                  <input
                    type="text"
                    required
                    value={promoTitle}
                    onChange={(e) => setPromoTitle(e.target.value)}
                    placeholder="e.g. Canton Fair Sourcing Festival"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Title (FR)</label>
                  <input
                    type="text"
                    value={promoTitleFr}
                    onChange={(e) => setPromoTitleFr(e.target.value)}
                    placeholder="e.g. Festival de Sourcing de Canton"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={promoDiscountPercent}
                    onChange={(e) => setPromoDiscountPercent(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={promoBadge}
                    onChange={(e) => setPromoBadge(e.target.value)}
                    placeholder="15% OFF"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="SPRING15"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Banner Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoBannerImage}
                    onChange={(e) => setPromoBannerImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer flex items-center justify-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingPromoImage ? '...' : 'Upload'}</span>
                    <input
                      ref={promoFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePromoImageUpload}
                      className="hidden"
                      disabled={uploadingPromoImage}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Subtitle / Details</label>
                <textarea
                  rows={2}
                  value={promoSubtitle}
                  onChange={(e) => setPromoSubtitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={promoExpiryDate}
                    onChange={(e) => setPromoExpiryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#F47721] focus:outline-hidden"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={promoActive}
                      onChange={(e) => setPromoActive(e.target.checked)}
                      className="rounded text-orange-600"
                    />
                    <span>Active on Storefront</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F47721] hover:bg-orange-600 text-white font-bold shadow-md"
                >
                  Save Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
