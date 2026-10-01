create table if not exists public.categories (
  id text primary key, slug text not null unique, name text not null, name_fr text not null, icon text not null, image text not null, description text not null default '', description_fr text not null default '', sort_order integer not null default 0
);
create table if not exists public.products (
  id text primary key, title text not null, title_fr text not null, category_id text, category_slug text, description text not null default '', description_fr text not null default '', price numeric, is_quote_only boolean not null default false, images jsonb not null default '[]'::jsonb, colors jsonb not null default '[]'::jsonb, sizes jsonb not null default '[]'::jsonb, in_stock boolean not null default true, stock_location text, moq text, retail_available boolean not null default true, wholesale_available boolean not null default true, is_featured boolean not null default false, is_new boolean not null default false, specs jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.sourcing_requests (
  id text primary key, tracking_code text, customer_name text not null, email text, whatsapp text, destination_country text, destination_city text, product_name text, description text not null default '', quantity integer not null default 1, order_type text not null default 'retail', target_budget text, desired_size text, desired_color text, specifications text, notes text, images jsonb not null default '[]'::jsonb, status text not null default 'new', quotation_id text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.quotations (
  id text primary key, request_id text, tracking_code text, customer_name text, email text, whatsapp text, items_summary text, unit_price numeric, estimated_shipping numeric, total_amount numeric, currency text not null default 'USD', moq integer, validity_days integer, production_days text, notes text, status text, created_at timestamptz not null default now()
);
create table if not exists public.orders (
  id text primary key, order_number text not null unique, tracking_code text, customer_name text, email text, whatsapp text, shipping_address text, items jsonb not null default '[]'::jsonb, subtotal numeric not null default 0, shipping_cost numeric not null default 0, total_amount numeric not null default 0, currency text not null default 'USD', payment_method text, payment_status text, order_status text, carrier text, tracking_number text, notes text, created_at timestamptz not null default now()
);
create table if not exists public.promotions (
  id text primary key, title text not null, title_fr text not null, subtitle text not null default '', subtitle_fr text not null default '', code text not null, discount_percent numeric not null default 0, badge text, banner_image text not null, link_url text not null, active boolean not null default false, expiry_date date
);
create table if not exists public.testimonials (
  id text primary key, name text not null, role text not null, role_fr text not null, company text not null, location text not null, avatar text not null, rating numeric not null default 5, product_sourced text not null, text text not null, text_fr text not null
);
create table if not exists public.site_settings (
  id text primary key, brand_name text not null, tagline_en text not null, tagline_fr text not null, positioning text not null, whatsapp_number text not null, whatsapp_display text not null, support_phone text not null, support_email text not null, sourcing_email text not null, china_office text not null, china_warehouse text not null, social_links jsonb not null default '{}'::jsonb, shipping_rates jsonb not null default '{}'::jsonb, announcement_en text not null, announcement_fr text not null, custom_domain text, custom_domain_status text, dns_records jsonb not null default '[]'::jsonb
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.sourcing_requests enable row level security;
alter table public.quotations enable row level security;
alter table public.orders enable row level security;
alter table public.promotions enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

grant select on public.categories, public.products, public.promotions, public.testimonials, public.site_settings to anon, authenticated;
grant select, insert, update, delete on public.sourcing_requests, public.quotations, public.orders to authenticated;

create policy "Public can read categories" on public.categories for select to anon, authenticated using (true);
create policy "Public can read products" on public.products for select to anon, authenticated using (true);
create policy "Public can read promotions" on public.promotions for select to anon, authenticated using (true);
create policy "Public can read testimonials" on public.testimonials for select to anon, authenticated using (true);
create policy "Public can read site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins can manage sourcing requests" on public.sourcing_requests for all to authenticated using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "Admins can manage quotations" on public.quotations for all to authenticated using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "Admins can manage orders" on public.orders for all to authenticated using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
