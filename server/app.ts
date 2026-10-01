import express from 'express';
import crypto from 'crypto';
import {
  Product,
  Category,
  SourcingRequest,
  Promotion,
  ProductRepository,
  CategoryRepository,
  SourcingRequestRepository,
  QuotationRepository,
  PromotionRepository,
  OrderRepository,
  SettingsRepository,
  TestimonialRepository
} from './db.ts';

const app = express();
const PORT = 3000;

// Increase JSON body parser limit for base64 image uploads
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true, limit: '8mb' }));

// Basic browser hardening. These headers do not alter the site's application flow.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Supabase Auth-backed admin authorization
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token || !SUPABASE_URL || !SUPABASE_KEY) return res.status(401).json({ error: 'Authentication required' });

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` }
    });
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid or expired session' });
    const user = await userRes.json();

    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` }
    });
    if (!profileRes.ok) return res.status(403).json({ error: 'Could not verify account role' });
    const profiles = await profileRes.json();
    if (profiles?.[0]?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

    (req as any).authUser = user;
    next();
  } catch (error) {
    console.error('Supabase auth verification failed:', error);
    return res.status(401).json({ error: 'Authentication verification failed' });
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'J Online Shopping', time: new Date().toISOString() });
});

// Auth is handled by Supabase directly from the browser. This endpoint only reports its status.
app.get('/api/auth/config', (_req, res) => {
  res.json({ configured: Boolean(SUPABASE_URL && SUPABASE_KEY) });
});

// Image Upload Endpoint
app.post('/api/upload', async (req, res) => {
  try {
    const { data, filename, mimeType } = req.body;
    if (!data) return res.status(400).json({ error: 'No image data provided' });

    const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (mimeType && !allowedMime.includes(mimeType.toLowerCase())) {
      return res.status(400).json({ error: 'Unsupported file type. Please upload JPG, PNG, or WebP.' });
    }

    const base64Data = data.includes(';base64,') ? data.split(';base64,').pop() : data;
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > 5 * 1024 * 1024) return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
    if (buffer.length === 0) return res.status(400).json({ error: 'Uploaded image is empty.' });

    const ext = mimeType ? mimeType.split('/')[1] : 'jpg';
    const safeExt = ext === 'jpeg' ? 'jpg' : ext;
    const uniqueName = `sourcing_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${safeExt}`;
    const storageUrl = `${SUPABASE_URL}/storage/v1/object/uploads/${encodeURIComponent(uniqueName)}`;
    const uploadRes = await fetch(storageUrl, {
      method: 'POST',
      headers: { apikey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '', 'Content-Type': mimeType || 'image/jpeg', 'x-upsert': 'false' },
      body: buffer
    });
    if (!uploadRes.ok) {
      const detail = await uploadRes.text();
      throw new Error(`Supabase Storage upload failed (${uploadRes.status}): ${detail}`);
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${encodeURIComponent(uniqueName)}`;
    return res.json({ success: true, url: publicUrl, filename: uniqueName, originalFilename: filename || uniqueName, size: buffer.length });
  } catch (err: any) {
    console.error('Image upload error:', err);
    return res.status(500).json({ error: 'Failed to upload image to Supabase Storage.' });
  }
});

// Categories API
app.get('/api/categories', async (req, res) => {
  const categories = await CategoryRepository.findAll();
  res.json(categories);
});

const makeCategorySlug = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `category-${Date.now()}`;

app.post('/api/categories', requireAdmin, async (req, res) => {
  try {
    const { name, nameFr, icon, image, description, descriptionFr, order } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
    const slug = makeCategorySlug(name);
    const existing = await CategoryRepository.findAll();
    if (existing.some(c => c.slug === slug)) return res.status(409).json({ error: 'A category with this name/slug already exists' });
    const newCat = await CategoryRepository.create({ slug, name: name.trim(), nameFr: nameFr?.trim() || name.trim(), icon: icon?.trim() || 'ShoppingBag', image: image?.trim() || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', description: description?.trim() || '', descriptionFr: descriptionFr?.trim() || description?.trim() || '', order: Number(order) || (existing.length + 1) });
    res.status(201).json(newCat);
  } catch (error: any) { console.error('Create category error:', error); res.status(500).json({ error: error?.message || 'Failed to create category' }); }
});

const handleUpdateCategory = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const current = await CategoryRepository.findById(id);
    if (!current) return res.status(404).json({ error: 'Category not found' });
    const updates = { ...req.body };
    if (updates.name !== undefined) {
      if (!String(updates.name).trim()) return res.status(400).json({ error: 'Name is required' });
      updates.name = String(updates.name).trim();
      updates.slug = makeCategorySlug(updates.name);
    }
    if (updates.slug !== undefined) {
      updates.slug = makeCategorySlug(String(updates.slug));
      const all = await CategoryRepository.findAll();
      if (all.some(c => c.id !== id && c.slug === updates.slug)) return res.status(409).json({ error: 'A category with this name/slug already exists' });
    }
    const updatedCat = await CategoryRepository.update(id, updates);
    if (!updatedCat) return res.status(404).json({ error: 'Category not found' });
    if (updatedCat.slug !== current.slug) {
      const products = await ProductRepository.findAll();
      await Promise.all(products.filter(p => p.categoryId === id || p.categorySlug === current.slug).map(p => ProductRepository.update(p.id, { categoryId: id, categorySlug: updatedCat.slug })));
    }
    res.json(updatedCat);
  } catch (error: any) { console.error('Update category error:', error); res.status(500).json({ error: error?.message || 'Failed to update category' }); }
};

app.put('/api/categories/:id', requireAdmin, handleUpdateCategory);
app.patch('/api/categories/:id', requireAdmin, handleUpdateCategory);

app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryRepository.findById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    const products = await ProductRepository.findAll();
    const productCount = products.filter(p => p.categoryId === id || p.categorySlug === category.slug).length;
    if (productCount > 0) return res.status(409).json({ error: `Cannot delete this category because ${productCount} product${productCount === 1 ? '' : 's'} still use it. Move those products to another category first.` });
    await CategoryRepository.delete(id);
    res.json({ success: true, id });
  } catch (error: any) { console.error('Delete category error:', error); res.status(500).json({ error: error?.message || 'Failed to delete category' }); }
});

// Products API
app.get('/api/products', async (req, res) => {
  const { search, category, type, quoteOnly, minPrice, maxPrice, sort, featured, limit } = req.query;
  const products = await ProductRepository.findAll({
    search: typeof search === 'string' ? search : undefined,
    category: typeof category === 'string' ? category : undefined,
    type: type === 'retail' || type === 'wholesale' ? type : undefined,
    quoteOnly: quoteOnly === 'true' ? true : (quoteOnly === 'false' ? false : undefined),
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: typeof sort === 'string' ? sort : undefined,
    featured: featured === 'true' ? true : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await ProductRepository.findById(id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', requireAdmin, async (req, res) => {
  const p = req.body;
  if (!p.title) return res.status(400).json({ error: 'Title is required' });

  // Get category info
  const categories = await CategoryRepository.findAll();
  const cat = categories.find(c => c.id === p.categoryId || c.slug === p.categorySlug);
  const newProduct = await ProductRepository.create({
    title: p.title,
    titleFr: p.titleFr || p.title,
    categoryId: cat ? cat.id : (p.categoryId || 'cat-other'),
    categorySlug: cat ? cat.slug : (p.categorySlug || 'other-products'),
    description: p.description || '',
    descriptionFr: p.descriptionFr || p.description || '',
    price: p.isQuoteOnly ? null : (p.price !== undefined && p.price !== null && p.price !== '' ? Number(p.price) : null),
    isQuoteOnly: Boolean(p.isQuoteOnly),
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'],
    colors: p.colors || [],
    sizes: p.sizes || [],
    inStock: p.inStock !== undefined ? Boolean(p.inStock) : true,
    stockLocation: p.stockLocation || 'Guangzhou Sourcing Center',
    moq: p.moq || (p.wholesaleAvailable ? '10 pcs' : '1 pc'),
    retailAvailable: p.retailAvailable !== undefined ? Boolean(p.retailAvailable) : true,
    wholesaleAvailable: p.wholesaleAvailable !== undefined ? Boolean(p.wholesaleAvailable) : true,
    isFeatured: Boolean(p.isFeatured),
    isNew: Boolean(p.isNew),
    specs: p.specs || {}
  });

  res.status(201).json(newProduct);
});

const handleUpdateProduct = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const updates = { ...req.body };

  // Keep category_id and category_slug synchronized when an admin moves a product.
  if (updates.categoryId) {
    const categories = await CategoryRepository.findAll();
    const cat = categories.find(c => c.id === updates.categoryId || c.slug === updates.categoryId);
    if (!cat) return res.status(400).json({ error: 'Selected category was not found' });
    updates.categoryId = cat.id;
    updates.categorySlug = cat.slug;
  }

  if (updates.price !== undefined && updates.price !== null && updates.price !== '') {
    const price = Number(updates.price);
    if (!Number.isFinite(price) || price < 0) return res.status(400).json({ error: 'Price must be a non-negative number' });
    updates.price = price;
  }

  const updatedProduct = await ProductRepository.update(id, updates);
  if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
  res.json(updatedProduct);
};

app.put('/api/products/:id', requireAdmin, handleUpdateProduct);
app.patch('/api/products/:id', requireAdmin, handleUpdateProduct);

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  await ProductRepository.delete(id);
  res.json({ success: true, id });
});

// Orders API
app.get('/api/orders', requireAdmin, async (_req, res) => {
  try {
    res.json(await OrderRepository.findAll());
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: error?.message || 'Failed to fetch orders' });
  }
});

const handleUpdateOrder = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const allowed = ['paymentStatus', 'orderStatus', 'carrier', 'trackingNumber', 'notes'];
    const paymentStatuses = ['pending', 'paid', 'partially_paid', 'failed', 'refunded'];
    const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) if (key in req.body) updates[key] = req.body[key];
    if ('paymentStatus' in updates && !paymentStatuses.includes(String(updates.paymentStatus))) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }
    if ('orderStatus' in updates && !orderStatuses.includes(String(updates.orderStatus))) {
      return res.status(400).json({ error: 'Invalid order status' });
    }
    const updated = await OrderRepository.update(id, updates);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (error: any) {
    console.error('Update order error:', error);
    res.status(500).json({ error: error?.message || 'Failed to update order' });
  }
};

app.patch('/api/orders/:id', requireAdmin, handleUpdateOrder);
app.put('/api/orders/:id', requireAdmin, handleUpdateOrder);

// Sourcing Requests API
const handleCreateRequest = async (req: express.Request, res: express.Response) => {
  const b = req.body;
  if (!b.productName && !b.description && !b.notes) {
    return res.status(400).json({ error: 'Product name or description is required.' });
  }

  const quantity = Number(b.quantity);
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 1000000000) {
    return res.status(400).json({ error: 'Quantity must be a valid positive number.' });
  }
  if (b.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(b.email))) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (b.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(b.customerEmail))) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (Array.isArray(b.images) && b.images.some((image: unknown) => typeof image !== 'string' || image.length > 2000 || image.startsWith('data:'))) {
    return res.status(400).json({ error: 'Images must be uploaded through the image upload endpoint first.' });
  }

  const newRequest = await SourcingRequestRepository.create({
    customerName: b.customerName || b.name || 'Anonymous Client',
    email: b.email || b.customerEmail || '',
    whatsapp: b.whatsapp || b.customerWhatsapp || b.phone || '',
    destinationCountry: b.destinationCountry || 'Global',
    destinationCity: b.destinationCity || '',
    productName: b.productName || 'Sourcing Request',
    description: b.description || b.notes || '',
    quantity,
    orderType: b.orderType === 'wholesale' ? 'wholesale' : 'retail',
    targetBudget: b.targetBudget || '',
    desiredSize: b.desiredSize || '',
    desiredColor: b.desiredColor || '',
    specifications: b.specifications || '',
    notes: b.notes || '',
    images: Array.isArray(b.images) && b.images.length > 0 ? b.images : [],
    status: 'new'
  });

  res.status(201).json(newRequest);
};

app.get('/api/requests', requireAdmin, async (req, res) => {
  const { orderType, status } = req.query;
  const requests = await SourcingRequestRepository.findAll({
    orderType: orderType === 'wholesale' || orderType === 'retail' ? orderType : undefined,
    status: typeof status === 'string' ? status : undefined
  });
  res.json(requests);
});

// Alias for backwards compatibility
app.get('/api/sourcing-requests', requireAdmin, async (req, res) => {
  const { orderType, status } = req.query;
  const requests = await SourcingRequestRepository.findAll({
    orderType: orderType === 'wholesale' || orderType === 'retail' ? orderType : undefined,
    status: typeof status === 'string' ? status : undefined
  });
  res.json(requests);
});

app.post('/api/requests', handleCreateRequest);
app.post('/api/sourcing-requests', handleCreateRequest);

const handleUpdateRequest = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedReq = await SourcingRequestRepository.update(id, updates);
  if (!updatedReq) return res.status(404).json({ error: 'Request not found' });
  res.json(updatedReq);
};

app.put('/api/requests/:id', requireAdmin, handleUpdateRequest);
app.patch('/api/requests/:id', requireAdmin, handleUpdateRequest);
app.patch('/api/requests/:id/status', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['new', 'sourcing', 'quoted', 'in_production', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid request status' });
  const updatedReq = await SourcingRequestRepository.update(id, { status });
  if (!updatedReq) return res.status(404).json({ error: 'Request not found' });
  res.json(updatedReq);
});

app.delete('/api/requests/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  await SourcingRequestRepository.delete(id);
  res.json({ success: true, id });
});

// Quotations API
app.get('/api/quotations', requireAdmin, async (_req, res) => {
  res.json(await QuotationRepository.findAll());
});
app.post('/api/quotations', requireAdmin, async (req, res) => {
  const q = req.body || {};
  if (!q.requestId || !q.trackingCode || !q.customerName) return res.status(400).json({ error: 'Request, tracking code, and customer are required' });
  const created = await QuotationRepository.create({
    requestId: q.requestId, trackingCode: q.trackingCode, customerName: q.customerName, email: q.email || '', whatsapp: q.whatsapp || '',
    itemsSummary: q.itemsSummary || '', unitPrice: Number(q.unitPrice) || 0, estimatedShipping: Number(q.estimatedShipping) || 0,
    totalAmount: Number(q.totalAmount) || 0, currency: q.currency || 'USD', moq: Number(q.moq) || 0, validityDays: Number(q.validityDays) || 7,
    productionDays: q.productionDays || '', notes: q.notes || '', status: q.status || 'draft'
  });
  await SourcingRequestRepository.update(q.requestId, { quotationId: created.id, status: 'quoted' });
  res.status(201).json(created);
});
app.patch('/api/quotations/:id', requireAdmin, async (req, res) => {
  const updated = await QuotationRepository.update(req.params.id, req.body || {});
  if (!updated) return res.status(404).json({ error: 'Quotation not found' });
  res.json(updated);
});

// Promotions API
app.get('/api/promotions', async (req, res) => {
  const list = await PromotionRepository.findAll();
  res.json(list);
});

app.post('/api/promotions', requireAdmin, async (req, res) => {
  const p = req.body;
  const discountPercent = Number(p.discountPercent);
  if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    return res.status(400).json({ error: 'Discount must be between 0 and 100' });
  }
  const newPromo = await PromotionRepository.create({
    title: p.title,
    titleFr: p.titleFr || p.title,
    subtitle: p.subtitle || '',
    subtitleFr: p.subtitleFr || p.subtitle || '',
    code: p.code || 'SPECIAL',
    discountPercent,
    badge: p.badge || 'Promo',
    bannerImage: p.bannerImage || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
    linkUrl: p.linkUrl || '/shop',
    active: p.active !== undefined ? Boolean(p.active) : true,
    expiryDate: p.expiryDate || '2026-12-31'
  });
  res.status(201).json(newPromo);
});

const handleUpdatePromotion = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const updates = { ...req.body };
  if ('discountPercent' in updates) {
    const discountPercent = Number(updates.discountPercent);
    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      return res.status(400).json({ error: 'Discount must be between 0 and 100' });
    }
    updates.discountPercent = discountPercent;
  }
  const updated = await PromotionRepository.update(id, updates);
  if (!updated) return res.status(404).json({ error: 'Promotion not found' });
  res.json(updated);
};

app.put('/api/promotions/:id', requireAdmin, handleUpdatePromotion);
app.patch('/api/promotions/:id', requireAdmin, handleUpdatePromotion);

app.delete('/api/promotions/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  await PromotionRepository.delete(id);
  res.json({ success: true, id });
});

// Testimonials API
app.get('/api/testimonials', async (req, res) => {
  res.json(await TestimonialRepository.findAll());
});

// Settings API
app.get('/api/settings', async (req, res) => {
  const settings = await SettingsRepository.get();
  res.json(settings);
});

const handleUpdateSettings = async (req: express.Request, res: express.Response) => {
  const updates = req.body;
  const updatedSettings = await SettingsRepository.update(updates);
  res.json(updatedSettings);
};

app.put('/api/settings', requireAdmin, handleUpdateSettings);
app.patch('/api/settings', requireAdmin, handleUpdateSettings);

// Stats API for Admin Dashboard (Simplified: products, categories, requests, promotions)
app.get('/api/stats', requireAdmin, async (req, res) => {
  const [products, requests, categories, promotions, orders] = await Promise.all([
    ProductRepository.findAll(),
    SourcingRequestRepository.findAll(),
    CategoryRepository.findAll(),
    PromotionRepository.findAll(),
    OrderRepository.findAll()
  ]);
  res.json({
    totalProducts: products.length,
    newRequests: requests.filter(r => r.status === 'new').length,
    activeRequests: requests.filter(r => r.status === 'new' || r.status === 'sourcing').length,
    wholesaleRequests: requests.filter(r => r.orderType === 'wholesale').length,
    totalRequests: requests.length,
    categoriesCount: categories.length,
    activePromotions: promotions.filter(p => p.active).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => ['pending', 'processing'].includes(o.orderStatus)).length,
    paidOrders: orders.filter(o => ['paid', 'partially_paid'].includes(o.paymentStatus)).length
  });
});

export default app;
