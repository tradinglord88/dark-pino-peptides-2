-- Dark Pino Peptides - Safe Database Setup (handles existing objects)
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/gooexdxpofvjvxrlyenr/sql

-- ========================================
-- STEP 1: DROP EXISTING POLICIES
-- ========================================

-- Drop all existing RLS policies to avoid conflicts
drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can create own orders" on public.orders;
drop policy if exists "Users can view own order items" on public.order_items;
drop policy if exists "Users can create own order items" on public.order_items;
drop policy if exists "Users can view own shipping addresses" on public.shipping_addresses;
drop policy if exists "Users can create own shipping addresses" on public.shipping_addresses;
drop policy if exists "Anyone can view subscription plans" on public.subscription_plans;
drop policy if exists "Users can view own subscriptions" on public.user_subscriptions;
drop policy if exists "Users can create own subscriptions" on public.user_subscriptions;
drop policy if exists "Users can update own subscriptions" on public.user_subscriptions;
drop policy if exists "Users can view own subscription items" on public.subscription_items;
drop policy if exists "Users can create own subscription items" on public.subscription_items;
drop policy if exists "Users can view own deliveries" on public.subscription_deliveries;
drop policy if exists "Users can view own delivery items" on public.subscription_delivery_items;
drop policy if exists "Users can view own subscription preferences" on public.subscription_preferences;
drop policy if exists "Users can update own subscription preferences" on public.subscription_preferences;

-- ========================================
-- STEP 2: CREATE TABLES (IF NOT EXISTS)
-- ========================================

-- Create users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete set null,
  guest_email text,
  total_amount decimal(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled', 'failed')),
  payment_method text not null check (payment_method in ('stripe', 'solana', 'etransfer')),
  stripe_session_id text,
  solana_signature text,
  etransfer_reference text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint either_user_or_guest check (
    (user_id is not null and guest_email is null) or 
    (user_id is null and guest_email is not null)
  )
);

-- Create order_items table
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  price_at_time decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create shipping_addresses table
create table if not exists public.shipping_addresses (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  address text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price decimal(10,2) not null,
  category text not null,
  stock integer not null default 0,
  image_url text not null,
  is_featured boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscription_plans table
create table if not exists public.subscription_plans (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  billing_interval text not null check (billing_interval in ('monthly', 'quarterly', 'yearly')),
  trial_days integer not null default 0,
  product_count integer not null default 1,
  discount_percentage decimal(5,2) not null default 0.00,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_subscriptions table
create table if not exists public.user_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  plan_id uuid references public.subscription_plans(id) on delete restrict not null,
  status text not null default 'trial' check (status in ('active', 'paused', 'cancelled', 'expired', 'trial')),
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  trial_end timestamp with time zone,
  cancelled_at timestamp with time zone,
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscription_items table
create table if not exists public.subscription_items (
  id uuid default gen_random_uuid() primary key,
  subscription_id uuid references public.user_subscriptions(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  quantity integer not null default 1,
  price_at_time decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscription_deliveries table
create table if not exists public.subscription_deliveries (
  id uuid default gen_random_uuid() primary key,
  subscription_id uuid references public.user_subscriptions(id) on delete cascade not null,
  delivery_date timestamp with time zone not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'failed')),
  tracking_number text,
  shipping_carrier text,
  delivery_notes text,
  total_amount decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscription_delivery_items table
create table if not exists public.subscription_delivery_items (
  id uuid default gen_random_uuid() primary key,
  delivery_id uuid references public.subscription_deliveries(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  quantity integer not null,
  price_at_time decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscription_preferences table
create table if not exists public.subscription_preferences (
  id uuid default gen_random_uuid() primary key,
  subscription_id uuid references public.user_subscriptions(id) on delete cascade not null,
  preferred_delivery_day integer check (preferred_delivery_day between 1 and 31),
  skip_months text[], -- Array of months to skip (e.g., ['January', 'December'])
  special_instructions text,
  allergy_info text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ========================================

alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipping_addresses enable row level security;
alter table public.products enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.subscription_items enable row level security;
alter table public.subscription_deliveries enable row level security;
alter table public.subscription_delivery_items enable row level security;
alter table public.subscription_preferences enable row level security;

-- ========================================
-- STEP 4: CREATE RLS POLICIES
-- ========================================

-- Policies for users table
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Policies for orders table
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id or guest_email = auth.email());

create policy "Users can create own orders" on public.orders
  for insert with check (auth.uid() = user_id or guest_email = auth.email());

-- Policies for order_items table
create policy "Users can view own order items" on public.order_items
  for select using (
    order_id in (
      select id from public.orders where auth.uid() = user_id or guest_email = auth.email()
    )
  );

create policy "Users can create own order items" on public.order_items
  for insert with check (
    order_id in (
      select id from public.orders where auth.uid() = user_id or guest_email = auth.email()
    )
  );

-- Policies for shipping_addresses table
create policy "Users can view own shipping addresses" on public.shipping_addresses
  for select using (
    order_id in (
      select id from public.orders where auth.uid() = user_id or guest_email = auth.email()
    )
  );

create policy "Users can create own shipping addresses" on public.shipping_addresses
  for insert with check (
    order_id in (
      select id from public.orders where auth.uid() = user_id or guest_email = auth.email()
    )
  );

-- Policies for products table (public read)
create policy "Anyone can view products" on public.products
  for select using (true);

-- Policies for subscription_plans (public read, admin write)
create policy "Anyone can view subscription plans" on public.subscription_plans
  for select using (is_active = true);

-- Policies for user_subscriptions
create policy "Users can view own subscriptions" on public.user_subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can create own subscriptions" on public.user_subscriptions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own subscriptions" on public.user_subscriptions
  for update using (auth.uid() = user_id);

-- Policies for subscription_items
create policy "Users can view own subscription items" on public.subscription_items
  for select using (
    subscription_id in (
      select id from public.user_subscriptions where auth.uid() = user_id
    )
  );

create policy "Users can create own subscription items" on public.subscription_items
  for insert with check (
    subscription_id in (
      select id from public.user_subscriptions where auth.uid() = user_id
    )
  );

-- Policies for subscription_deliveries
create policy "Users can view own deliveries" on public.subscription_deliveries
  for select using (
    subscription_id in (
      select id from public.user_subscriptions where auth.uid() = user_id
    )
  );

-- Policies for subscription_delivery_items
create policy "Users can view own delivery items" on public.subscription_delivery_items
  for select using (
    delivery_id in (
      select id from public.subscription_deliveries 
      where subscription_id in (
        select id from public.user_subscriptions where auth.uid() = user_id
      )
    )
  );

-- Policies for subscription_preferences
create policy "Users can view own subscription preferences" on public.subscription_preferences
  for select using (
    subscription_id in (
      select id from public.user_subscriptions where auth.uid() = user_id
    )
  );

create policy "Users can update own subscription preferences" on public.subscription_preferences
  for all using (
    subscription_id in (
      select id from public.user_subscriptions where auth.uid() = user_id
    )
  );

-- ========================================
-- STEP 5: DATABASE INDEXES
-- ========================================

-- Indexes for better performance
create index if not exists users_email_idx on public.users(email);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_guest_email_idx on public.orders(guest_email);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_featured_idx on public.products(is_featured);
create index if not exists user_subscriptions_user_id_idx on public.user_subscriptions(user_id);
create index if not exists user_subscriptions_status_idx on public.user_subscriptions(status);
create index if not exists subscription_deliveries_subscription_id_idx on public.subscription_deliveries(subscription_id);
create index if not exists subscription_deliveries_delivery_date_idx on public.subscription_deliveries(delivery_date);
create index if not exists subscription_deliveries_status_idx on public.subscription_deliveries(status);

-- ========================================
-- STEP 6: TRIGGERS FOR updated_at
-- ========================================

-- Create function to handle updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for tables with updated_at columns
drop trigger if exists handle_updated_at on public.users;
create trigger handle_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_updated_at on public.orders;
create trigger handle_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_updated_at on public.products;
create trigger handle_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_updated_at on public.subscription_plans;
create trigger handle_updated_at
  before update on public.subscription_plans
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_updated_at on public.user_subscriptions;
create trigger handle_updated_at
  before update on public.user_subscriptions
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_updated_at on public.subscription_deliveries;
create trigger handle_updated_at
  before update on public.subscription_deliveries
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_updated_at on public.subscription_preferences;
create trigger handle_updated_at
  before update on public.subscription_preferences
  for each row execute function public.handle_updated_at();

-- ========================================
-- STEP 7: INSERT SUBSCRIPTION PLANS (ONLY IF EMPTY)
-- ========================================

-- Only insert subscription plans if the table is empty
insert into public.subscription_plans (name, description, price, billing_interval, product_count, discount_percentage)
select * from (
  values
    ('Starter Monthly', 'Perfect for beginners - 1 premium peptide per month', 79.99, 'monthly', 1, 10.00),
    ('Premium Monthly', 'For experienced users - 2 premium peptides per month', 149.99, 'monthly', 2, 15.00),
    ('Elite Monthly', 'Maximum results - 3 premium peptides per month', 199.99, 'monthly', 3, 20.00),
    ('Starter Quarterly', 'Save with quarterly billing - 1 premium peptide per month', 215.97, 'quarterly', 1, 15.00),
    ('Premium Quarterly', 'Save with quarterly billing - 2 premium peptides per month', 382.47, 'quarterly', 2, 20.00),
    ('Elite Quarterly', 'Save with quarterly billing - 3 premium peptides per month', 479.97, 'quarterly', 3, 25.00)
) as plans(name, description, price, billing_interval, product_count, discount_percentage)
where not exists (select 1 from public.subscription_plans limit 1);

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

do $$ 
begin 
  raise notice 'Dark Pino Peptides database setup completed successfully!';
  raise notice 'Next step: Run the products SQL to add peptide products to your database.';
end $$;