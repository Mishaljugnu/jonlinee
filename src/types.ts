export type Language = 'en' | 'fr';

export type Currency = 'USD' | 'EUR' | 'XOF' | 'GBP';

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameFr: string;
  icon: string;
  image: string;
  description: string;
  descriptionFr: string;
  order: number;
}

export interface Product {
  id: string;
  title: string;
  titleFr: string;
  categoryId: string;
  categorySlug: string;
  description: string;
  descriptionFr: string;
  price: number | null;
  isQuoteOnly: boolean;
  images: string[];
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  stockLocation?: string;
  moq?: string;
  retailAvailable: boolean;
  wholesaleAvailable: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  specs?: Record<string, string>;
  createdAt: string;
}

export interface SourcingRequest {
  id: string;
  trackingCode?: string;
  quotationId?: string | null;
  customerName: string;
  email?: string;
  whatsapp: string;
  destinationCountry: string;
  destinationCity?: string;
  productName: string;
  description: string;
  quantity: number;
  orderType: 'retail' | 'wholesale';
  targetBudget?: string;
  desiredSize?: string;
  desiredColor?: string;
  specifications?: string;
  notes?: string;
  images: string[];
  status: 'new' | 'sourcing' | 'quoted' | 'in_production' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  id: string;
  requestId: string;
  trackingCode: string;
  customerName: string;
  email?: string;
  whatsapp: string;
  itemsSummary: string;
  unitPrice: number;
  estimatedShipping: number;
  totalAmount: number;
  currency: string;
  moq: number;
  validityDays: number;
  productionDays: string;
  notes?: string;
  status: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingCode: string;
  customerName: string;
  email?: string;
  whatsapp: string;
  shippingAddress: string;
  items: Array<Record<string, unknown>>;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  carrier?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  titleFr: string;
  subtitle: string;
  subtitleFr: string;
  code: string;
  discountPercent: number;
  badge?: string;
  bannerImage: string;
  linkUrl: string;
  active: boolean;
  expiryDate: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  roleFr: string;
  company: string;
  location: string;
  avatar: string;
  rating: number;
  productSourced: string;
  text: string;
  textFr: string;
}

export interface SiteSettings {
  brandName: string;
  taglineEn: string;
  taglineFr: string;
  positioning: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  supportPhone: string;
  supportEmail: string;
  sourcingEmail: string;
  chinaOffice: string;
  chinaWarehouse: string;
  socialLinks: {
    whatsapp: string;
    tiktok: string;
    instagram: string;
    facebook: string;
  };
  shippingRates: {
    airFreightPerKg: number;
    seaFreightPerCbm: number;
    expressPerKg: number;
    minAirKg: number;
    minSeaCbm: number;
  };
  announcementEn: string;
  announcementFr: string;
  customDomain?: string;
  customDomainStatus?: 'connected' | 'pending' | 'verifying';
  dnsRecords?: {
    type: string;
    host: string;
    target: string;
    status: string;
  }[];
}
