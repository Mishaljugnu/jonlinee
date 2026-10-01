/**
 * Supabase-backed data layer for J Online Shopping.
 *
 * This is the single server-side database adapter and talks to Supabase PostgREST.
 * It intentionally uses the server-only SUPABASE_SECRET_KEY so admin CRUD
 * does not depend on public RLS policies.
 */

export interface Category {
  id: string; slug: string; name: string; nameFr: string; icon: string; image: string;
  description: string; descriptionFr: string; order: number;
}
export interface Product {
  id: string; title: string; titleFr: string; categoryId: string; categorySlug: string;
  description: string; descriptionFr: string; price: number | null; isQuoteOnly: boolean;
  images: string[]; colors?: string[]; sizes?: string[]; inStock: boolean;
  stockLocation?: string; moq?: string; retailAvailable: boolean; wholesaleAvailable: boolean;
  isFeatured?: boolean; isNew?: boolean; specs?: Record<string, string>; createdAt: string;
}
export interface SourcingRequest {
  id: string; trackingCode?: string; customerName: string; email?: string; whatsapp: string;
  destinationCountry: string; destinationCity?: string; productName: string; description: string;
  quantity: number; orderType: 'retail' | 'wholesale'; targetBudget?: string; desiredSize?: string;
  desiredColor?: string; specifications?: string; notes?: string; images: string[];
  status: 'new' | 'sourcing' | 'quoted' | 'in_production' | 'completed' | 'cancelled';
  quotationId?: string | null; createdAt: string; updatedAt: string;
}
export interface Quotation {
  id: string; requestId: string; trackingCode: string; customerName: string; email?: string;
  whatsapp: string; itemsSummary: string; unitPrice: number; estimatedShipping: number;
  totalAmount: number; currency: string; moq: number; validityDays: number; productionDays: string;
  notes?: string; status: string; createdAt: string;
}
export interface Order {
  id: string; orderNumber: string; trackingCode: string; customerName: string; email?: string;
  whatsapp: string; shippingAddress: string; items: Array<Record<string, unknown>>; subtotal: number;
  shippingCost: number; totalAmount: number; currency: string; paymentMethod: string;
  paymentStatus: string; orderStatus: string; carrier?: string; trackingNumber?: string;
  notes?: string; createdAt: string;
}
export interface Promotion {
  id: string; title: string; titleFr: string; subtitle: string; subtitleFr: string; code: string;
  discountPercent: number; badge?: string; bannerImage: string; linkUrl: string; active: boolean; expiryDate: string;
}
export interface Testimonial {
  id: string; name: string; role: string; roleFr: string; company: string; location: string;
  avatar: string; rating: number; productSourced: string; text: string; textFr: string;
}
export interface SiteSettings {
  brandName: string; taglineEn: string; taglineFr: string; positioning: string;
  whatsappNumber: string; whatsappDisplay: string; supportPhone: string; supportEmail: string;
  sourcingEmail: string; chinaOffice: string; chinaWarehouse: string;
  socialLinks: { whatsapp: string; tiktok: string; instagram: string; facebook: string };
  shippingRates: { airFreightPerKg: number; seaFreightPerCbm: number; expressPerKg: number; minAirKg: number; minSeaCbm: number };
  announcementEn: string; announcementFr: string; customDomain?: string;
  customDomainStatus?: 'connected' | 'pending' | 'verifying';
  dnsRecords?: { type: string; host: string; target: string; status: string }[];
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function requireConfig() {
  if (!SUPABASE_URL) throw new Error('SUPABASE_URL is missing.');
  if (!SUPABASE_SECRET_KEY) throw new Error('SUPABASE_SECRET_KEY is missing. Add the server-only Supabase secret key to your environment.');
}

async function request<T>(table: string, init: RequestInit = {}, query = ''): Promise<T> {
  requireConfig();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Supabase ${table} request failed (${response.status}): ${body}`);
  }
  return (body ? JSON.parse(body) : null) as T;
}

function one<T>(rows: T[] | null | undefined): T | null { return rows?.[0] ?? null; }

const categoryFromDb = (x: any): Category => ({
  id: x.id, slug: x.slug, name: x.name, nameFr: x.name_fr, icon: x.icon, image: x.image,
  description: x.description, descriptionFr: x.description_fr, order: x.sort_order,
});
const productFromDb = (x: any): Product => ({
  id: x.id, title: x.title, titleFr: x.title_fr, categoryId: x.category_id, categorySlug: x.category_slug,
  description: x.description, descriptionFr: x.description_fr, price: x.price === null ? null : Number(x.price),
  isQuoteOnly: x.is_quote_only, images: x.images || [], colors: x.colors || [], sizes: x.sizes || [],
  inStock: x.in_stock, stockLocation: x.stock_location, moq: x.moq, retailAvailable: x.retail_available,
  wholesaleAvailable: x.wholesale_available, isFeatured: x.is_featured, isNew: x.is_new, specs: x.specs || {},
  createdAt: x.created_at,
});
const requestFromDb = (x: any): SourcingRequest => ({
  id: x.id, trackingCode: x.tracking_code, customerName: x.customer_name, email: x.email, whatsapp: x.whatsapp,
  destinationCountry: x.destination_country, destinationCity: x.destination_city, productName: x.product_name,
  description: x.description, quantity: x.quantity, orderType: x.order_type, targetBudget: x.target_budget,
  desiredSize: x.desired_size, desiredColor: x.desired_color, specifications: x.specifications, notes: x.notes,
  images: x.images || [], status: x.status, quotationId: x.quotation_id, createdAt: x.created_at, updatedAt: x.updated_at,
});
const orderFromDb = (x: any): Order => ({
  id: x.id, orderNumber: x.order_number, trackingCode: x.tracking_code, customerName: x.customer_name,
  email: x.email, whatsapp: x.whatsapp, shippingAddress: x.shipping_address, items: x.items || [],
  subtotal: Number(x.subtotal || 0), shippingCost: Number(x.shipping_cost || 0), totalAmount: Number(x.total_amount || 0),
  currency: x.currency || 'USD', paymentMethod: x.payment_method || '', paymentStatus: x.payment_status || 'pending',
  orderStatus: x.order_status || 'pending', carrier: x.carrier || '', trackingNumber: x.tracking_number || '',
  notes: x.notes || '', createdAt: x.created_at,
});

const promotionFromDb = (x: any): Promotion => ({
  id: x.id, title: x.title, titleFr: x.title_fr, subtitle: x.subtitle, subtitleFr: x.subtitle_fr, code: x.code,
  discountPercent: Number(x.discount_percent), badge: x.badge, bannerImage: x.banner_image, linkUrl: x.link_url,
  active: x.active, expiryDate: x.expiry_date,
});
const testimonialFromDb = (x: any): Testimonial => ({
  id: x.id, name: x.name, role: x.role, roleFr: x.role_fr, company: x.company, location: x.location,
  avatar: x.avatar, rating: Number(x.rating), productSourced: x.product_sourced, text: x.text, textFr: x.text_fr,
});
const settingsFromDb = (x: any): SiteSettings => ({
  brandName: x.brand_name, taglineEn: x.tagline_en, taglineFr: x.tagline_fr, positioning: x.positioning,
  whatsappNumber: x.whatsapp_number, whatsappDisplay: x.whatsapp_display, supportPhone: x.support_phone,
  supportEmail: x.support_email, sourcingEmail: x.sourcing_email, chinaOffice: x.china_office,
  chinaWarehouse: x.china_warehouse, socialLinks: x.social_links || {}, shippingRates: x.shipping_rates || {},
  announcementEn: x.announcement_en, announcementFr: x.announcement_fr, customDomain: x.custom_domain,
  customDomainStatus: x.custom_domain_status, dnsRecords: x.dns_records || [],
});

export const CategoryRepository = {
  findAll: async (): Promise<Category[]> => (await request<any[]>('categories', {}, '?select=*&order=sort_order.asc')).map(categoryFromDb),
  findById: async (id: string) => { const x = one(await request<any[]>('categories', {}, `?id=eq.${encodeURIComponent(id)}&select=*`)); return x ? categoryFromDb(x) : null; },
  create: async (item: Omit<Category, 'id'>): Promise<Category> => {
    const row = { id: `cat-${Date.now()}`, slug: item.slug, name: item.name, name_fr: item.nameFr, icon: item.icon, image: item.image, description: item.description, description_fr: item.descriptionFr, sort_order: item.order };
    return categoryFromDb(one(await request<any[]>('categories', { method: 'POST', body: JSON.stringify(row), headers: { Prefer: 'return=representation' } }))!);
  },
  update: async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    const row: any = {};
    if (updates.slug !== undefined) row.slug = updates.slug;
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.nameFr !== undefined) row.name_fr = updates.nameFr;
    if (updates.icon !== undefined) row.icon = updates.icon;
    if (updates.image !== undefined) row.image = updates.image;
    if (updates.description !== undefined) row.description = updates.description;
    if (updates.descriptionFr !== undefined) row.description_fr = updates.descriptionFr;
    if (updates.order !== undefined) row.sort_order = updates.order;
    const found = one(await request<any[]>('categories', { method: 'PATCH', body: JSON.stringify(row), headers: { Prefer: 'return=representation' } }, `?id=eq.${encodeURIComponent(id)}&select=*`));
    return found ? categoryFromDb(found) : null;
  },
  delete: async (id: string) => { await request('categories', { method: 'DELETE' }, `?id=eq.${encodeURIComponent(id)}`); return true; },
};

export const ProductRepository = {
  findAll: async (filters?: { search?: string; category?: string; type?: 'retail' | 'wholesale'; quoteOnly?: boolean; minPrice?: number; maxPrice?: number; featured?: boolean; sort?: string; limit?: number; }): Promise<Product[]> => {
    let list = (await request<any[]>('products', {}, '?select=*')).map(productFromDb);
    if (filters?.search) { const q = filters.search.toLowerCase(); list = list.filter(p => p.title.toLowerCase().includes(q) || p.titleFr?.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)); }
    if (filters?.category && filters.category !== 'all') list = list.filter(p => p.categoryId === filters.category || p.categorySlug === filters.category);
    if (filters?.type === 'retail') list = list.filter(p => p.retailAvailable); else if (filters?.type === 'wholesale') list = list.filter(p => p.wholesaleAvailable);
    if (filters?.quoteOnly !== undefined) list = list.filter(p => p.isQuoteOnly === filters.quoteOnly);
    if (filters?.minPrice !== undefined) list = list.filter(p => p.price !== null && p.price >= filters.minPrice!);
    if (filters?.maxPrice !== undefined) list = list.filter(p => p.price !== null && p.price <= filters.maxPrice!);
    if (filters?.featured) list = list.filter(p => p.isFeatured);
    if (filters?.sort === 'price_asc') list.sort((a,b)=>(a.price??999999)-(b.price??999999));
    else if (filters?.sort === 'price_desc') list.sort((a,b)=>(b.price??0)-(a.price??0));
    else if (filters?.sort === 'name_asc') list.sort((a,b)=>a.title.localeCompare(b.title));
    else list.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
    return filters?.limit ? list.slice(0, filters.limit) : list;
  },
  findById: async (id: string) => { const x = one(await request<any[]>('products', {}, `?id=eq.${encodeURIComponent(id)}&select=*`)); return x ? productFromDb(x) : null; },
  create: async (item: Omit<Product, 'id' | 'createdAt'> & { id?: string }): Promise<Product> => {
    const row = { id: item.id || `prod-${Date.now()}`, title: item.title, title_fr: item.titleFr, category_id: item.categoryId, category_slug: item.categorySlug, description: item.description, description_fr: item.descriptionFr, price: item.price, is_quote_only: item.isQuoteOnly, images: item.images || [], colors: item.colors || [], sizes: item.sizes || [], in_stock: item.inStock, stock_location: item.stockLocation, moq: item.moq, retail_available: item.retailAvailable, wholesale_available: item.wholesaleAvailable, is_featured: item.isFeatured || false, is_new: item.isNew || false, specs: item.specs || {}, created_at: new Date().toISOString() };
    return productFromDb(one(await request<any[]>('products', { method:'POST', body:JSON.stringify(row), headers:{Prefer:'return=representation'} }))!);
  },
  update: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    const map:any = { title:'title', titleFr:'title_fr', categoryId:'category_id', categorySlug:'category_slug', description:'description', descriptionFr:'description_fr', price:'price', isQuoteOnly:'is_quote_only', images:'images', colors:'colors', sizes:'sizes', inStock:'in_stock', stockLocation:'stock_location', moq:'moq', retailAvailable:'retail_available', wholesaleAvailable:'wholesale_available', isFeatured:'is_featured', isNew:'is_new', specs:'specs' };
    const row:any={}; for(const [k,v] of Object.entries(updates)){ if(map[k]) row[map[k]]=v; }
    const x=one(await request<any[]>('products',{method:'PATCH',body:JSON.stringify(row),headers:{Prefer:'return=representation'}},`?id=eq.${encodeURIComponent(id)}&select=*`)); return x?productFromDb(x):null;
  },
  delete: async (id:string)=>{await request('products',{method:'DELETE'},`?id=eq.${encodeURIComponent(id)}`);return true;},
};

export const SourcingRequestRepository = {
  findAll: async (filters?: { orderType?: 'retail'|'wholesale'; status?: string }): Promise<SourcingRequest[]> => {
    let list=(await request<any[]>('sourcing_requests',{},'?select=*&order=created_at.desc')).map(requestFromDb);
    if(filters?.orderType) list=list.filter(r=>r.orderType===filters.orderType);
    if(filters?.status && filters.status!=='all') list=list.filter(r=>r.status===filters.status);
    return list;
  },
  findById: async(id:string)=>{const x=one(await request<any[]>('sourcing_requests',{},`?id=eq.${encodeURIComponent(id)}&select=*`));return x?requestFromDb(x):null;},
  create: async(item:Omit<SourcingRequest,'id'|'createdAt'|'updatedAt'>):Promise<SourcingRequest>=>{
    const now=new Date().toISOString(); const row:any={id:`req-${Date.now()}`,tracking_code:item.trackingCode||`JOS-REQ-${Math.floor(1000+Math.random()*9000)}`,customer_name:item.customerName,email:item.email||'',whatsapp:item.whatsapp||'',destination_country:item.destinationCountry,destination_city:item.destinationCity||'',product_name:item.productName,description:item.description,quantity:item.quantity,order_type:item.orderType,target_budget:item.targetBudget||'',desired_size:item.desiredSize||'',desired_color:item.desiredColor||'',specifications:item.specifications||'',notes:item.notes||'',images:item.images||[],status:item.status||'new',quotation_id:item.quotationId||null,created_at:now,updated_at:now};
    return requestFromDb(one(await request<any[]>('sourcing_requests',{method:'POST',body:JSON.stringify(row),headers:{Prefer:'return=representation'}}))!);
  },
  update: async(id:string,updates:Partial<SourcingRequest>):Promise<SourcingRequest|null>=>{
    const map:any={trackingCode:'tracking_code',customerName:'customer_name',email:'email',whatsapp:'whatsapp',destinationCountry:'destination_country',destinationCity:'destination_city',productName:'product_name',description:'description',quantity:'quantity',orderType:'order_type',targetBudget:'target_budget',desiredSize:'desired_size',desiredColor:'desired_color',specifications:'specifications',notes:'notes',images:'images',status:'status',quotationId:'quotation_id'}; const row:any={updated_at:new Date().toISOString()}; for(const[k,v]of Object.entries(updates)){if(map[k])row[map[k]]=v;} const x=one(await request<any[]>('sourcing_requests',{method:'PATCH',body:JSON.stringify(row),headers:{Prefer:'return=representation'}},`?id=eq.${encodeURIComponent(id)}&select=*`));return x?requestFromDb(x):null;
  },
  delete: async(id:string)=>{await request('sourcing_requests',{method:'DELETE'},`?id=eq.${encodeURIComponent(id)}`);return true;},
};

export const PromotionRepository={
  findAll:async()=> (await request<any[]>('promotions',{},'?select=*&order=expiry_date.asc')).map(promotionFromDb),
  findById:async(id:string)=>{const x=one(await request<any[]>('promotions',{},`?id=eq.${encodeURIComponent(id)}&select=*`));return x?promotionFromDb(x):null;},
  create:async(item:Omit<Promotion,'id'>):Promise<Promotion>=>{const row={id:`promo-${Date.now()}`,title:item.title,title_fr:item.titleFr,subtitle:item.subtitle,subtitle_fr:item.subtitleFr,code:item.code,discount_percent:item.discountPercent,badge:item.badge,banner_image:item.bannerImage,link_url:item.linkUrl,active:item.active,expiry_date:item.expiryDate};return promotionFromDb(one(await request<any[]>('promotions',{method:'POST',body:JSON.stringify(row),headers:{Prefer:'return=representation'}}))!);},
  update:async(id:string,updates:Partial<Promotion>):Promise<Promotion|null>=>{const map:any={title:'title',titleFr:'title_fr',subtitle:'subtitle',subtitleFr:'subtitle_fr',code:'code',discountPercent:'discount_percent',badge:'badge',bannerImage:'banner_image',linkUrl:'link_url',active:'active',expiryDate:'expiry_date'};const row:any={};for(const[k,v]of Object.entries(updates)){if(map[k])row[map[k]]=v;}const x=one(await request<any[]>('promotions',{method:'PATCH',body:JSON.stringify(row),headers:{Prefer:'return=representation'}},`?id=eq.${encodeURIComponent(id)}&select=*`));return x?promotionFromDb(x):null;},
  delete:async(id:string)=>{await request('promotions',{method:'DELETE'},`?id=eq.${encodeURIComponent(id)}`);return true;},
};

export const SettingsRepository={
  get:async():Promise<SiteSettings>=>{const x=one(await request<any[]>('site_settings',{},'?id=eq.site&select=*'));if(!x)throw new Error('Site settings row not found');return settingsFromDb(x);},
  update:async(updates:Partial<SiteSettings>):Promise<SiteSettings>=>{const current=await SettingsRepository.get();const merged:any={...current,...updates,socialLinks:{...current.socialLinks,...(updates.socialLinks||{})},shippingRates:{...current.shippingRates,...(updates.shippingRates||{})}};const row={brand_name:merged.brandName,tagline_en:merged.taglineEn,tagline_fr:merged.taglineFr,positioning:merged.positioning,whatsapp_number:merged.whatsappNumber,whatsapp_display:merged.whatsappDisplay,support_phone:merged.supportPhone,support_email:merged.supportEmail,sourcing_email:merged.sourcingEmail,china_office:merged.chinaOffice,china_warehouse:merged.chinaWarehouse,social_links:merged.socialLinks,shipping_rates:merged.shippingRates,announcement_en:merged.announcementEn,announcement_fr:merged.announcementFr,custom_domain:merged.customDomain||null,custom_domain_status:merged.customDomainStatus||null,dns_records:merged.dnsRecords||[]};const x=one(await request<any[]>('site_settings',{method:'PATCH',body:JSON.stringify(row),headers:{Prefer:'return=representation'}},'?id=eq.site&select=*'));if(!x)throw new Error('Failed to update site settings');return settingsFromDb(x);},
};

export const TestimonialRepository={findAll:async()=> (await request<any[]>('testimonials',{},'?select=*')).map(testimonialFromDb)};
const quotationFromDb = (x:any): Quotation => ({
  id:x.id, requestId:x.request_id, trackingCode:x.tracking_code, customerName:x.customer_name, email:x.email,
  whatsapp:x.whatsapp, itemsSummary:x.items_summary || '', unitPrice:Number(x.unit_price || 0), estimatedShipping:Number(x.estimated_shipping || 0),
  totalAmount:Number(x.total_amount || 0), currency:x.currency || 'USD', moq:Number(x.moq || 0), validityDays:Number(x.validity_days || 0),
  productionDays:x.production_days || '', notes:x.notes || '', status:x.status || 'draft', createdAt:x.created_at
});
export const QuotationRepository={
  findAll:async()=> (await request<any[]>('quotations',{},'?select=*&order=created_at.desc')).map(quotationFromDb),
  findById:async(id:string)=>{const x=one(await request<any[]>('quotations',{},`?id=eq.${encodeURIComponent(id)}&select=*`));return x?quotationFromDb(x):null;},
  create:async(item:Omit<Quotation,'id'|'createdAt'>):Promise<Quotation>=>{
    const row:any={id:`quote-${Date.now()}`,request_id:item.requestId,tracking_code:item.trackingCode,customer_name:item.customerName,email:item.email||'',whatsapp:item.whatsapp||'',items_summary:item.itemsSummary,unit_price:item.unitPrice,estimated_shipping:item.estimatedShipping,total_amount:item.totalAmount,currency:item.currency,moq:item.moq,validity_days:item.validityDays,production_days:item.productionDays,notes:item.notes||'',status:item.status||'draft'};
    return quotationFromDb(one(await request<any[]>('quotations',{method:'POST',body:JSON.stringify(row),headers:{Prefer:'return=representation'}}))!);
  },
  update:async(id:string,updates:Partial<Quotation>):Promise<Quotation|null>=>{
    const map:any={itemsSummary:'items_summary',unitPrice:'unit_price',estimatedShipping:'estimated_shipping',totalAmount:'total_amount',currency:'currency',moq:'moq',validityDays:'validity_days',productionDays:'production_days',notes:'notes',status:'status'};
    const row:any={}; for(const[k,v]of Object.entries(updates)){if(map[k])row[map[k]]=v;}
    const x=one(await request<any[]>('quotations',{method:'PATCH',body:JSON.stringify(row),headers:{Prefer:'return=representation'}},`?id=eq.${encodeURIComponent(id)}&select=*`));return x?quotationFromDb(x):null;
  }
};
export const OrderRepository={
  findAll:async()=> (await request<any[]>('orders',{},'?select=*&order=created_at.desc')).map(orderFromDb),
  findById:async(id:string)=>{const x=one(await request<any[]>('orders',{},`?id=eq.${encodeURIComponent(id)}&select=*`));return x?orderFromDb(x):null;},
  update:async(id:string,updates:Partial<Order>|Record<string,unknown>):Promise<Order|null>=>{
    const map:any={orderNumber:'order_number',trackingCode:'tracking_code',customerName:'customer_name',email:'email',whatsapp:'whatsapp',shippingAddress:'shipping_address',items:'items',subtotal:'subtotal',shippingCost:'shipping_cost',totalAmount:'total_amount',currency:'currency',paymentMethod:'payment_method',paymentStatus:'payment_status',orderStatus:'order_status',carrier:'carrier',trackingNumber:'tracking_number',notes:'notes'};
    const row:any={}; for(const[k,v]of Object.entries(updates)){if(map[k])row[map[k]]=v;}
    const x=one(await request<any[]>('orders',{method:'PATCH',body:JSON.stringify(row),headers:{Prefer:'return=representation'}},`?id=eq.${encodeURIComponent(id)}&select=*`));
    return x?orderFromDb(x):null;
  }
};
