-- Dark Pino Peptides - Complete Database Setup
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/gooexdxpofvjvxrlyenr/sql

-- ========================================
-- STEP 1: CORE TABLES (Users & Orders)
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
  order_id uuid references public.orders(id) on delete cascade not null unique,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  address text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'Canada',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================
-- STEP 2: SUBSCRIPTION TABLES
-- ========================================

-- Subscription Plans Table
create table if not exists public.subscription_plans (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  billing_interval text not null check (billing_interval in ('monthly', 'quarterly', 'yearly')),
  trial_days integer default 0,
  product_count integer not null default 1,
  discount_percentage decimal(5,2) default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Subscriptions Table
create table if not exists public.user_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  plan_id uuid references public.subscription_plans(id) not null,
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled', 'expired', 'trial')),
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  trial_end timestamp with time zone,
  cancelled_at timestamp with time zone,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscription Items (Products included in subscription)
create table if not exists public.subscription_items (
  id uuid default gen_random_uuid() primary key,
  subscription_id uuid references public.user_subscriptions(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  quantity integer not null default 1,
  price_at_time decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscription Deliveries (Track monthly shipments)
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

-- Subscription Delivery Items (What was shipped in each delivery)
create table if not exists public.subscription_delivery_items (
  id uuid default gen_random_uuid() primary key,
  delivery_id uuid references public.subscription_deliveries(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  quantity integer not null,
  price_at_time decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscription Preferences (User preferences for their subscription)
create table if not exists public.subscription_preferences (
  id uuid default gen_random_uuid() primary key,
  subscription_id uuid references public.user_subscriptions(id) on delete cascade not null unique,
  preferred_delivery_day integer default 1 check (preferred_delivery_day between 1 and 28),
  skip_months text[], -- Array of months to skip (e.g., ['2025-01', '2025-03'])
  special_instructions text,
  allergy_info text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================
-- STEP 3: ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipping_addresses enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.subscription_items enable row level security;
alter table public.subscription_deliveries enable row level security;
alter table public.subscription_delivery_items enable row level security;
alter table public.subscription_preferences enable row level security;

-- ========================================
-- STEP 4: SECURITY POLICIES
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

create policy "Users can update own orders" on public.orders
  for update using (auth.uid() = user_id);

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
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Add triggers for updated_at
create trigger handle_users_updated_at before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger handle_orders_updated_at before update on public.orders
  for each row execute procedure public.handle_updated_at();

create trigger handle_subscription_plans_updated_at before update on public.subscription_plans
  for each row execute procedure public.handle_updated_at();

create trigger handle_user_subscriptions_updated_at before update on public.user_subscriptions
  for each row execute procedure public.handle_updated_at();

create trigger handle_subscription_deliveries_updated_at before update on public.subscription_deliveries
  for each row execute procedure public.handle_updated_at();

create trigger handle_subscription_preferences_updated_at before update on public.subscription_preferences
  for each row execute procedure public.handle_updated_at();

-- ========================================
-- STEP 7: TRIGGER TO AUTO-CREATE USER PROFILES
-- ========================================

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

-- Trigger to automatically create user profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================================
-- STEP 8: DEFAULT DATA
-- ========================================

-- Insert default subscription plans
insert into public.subscription_plans (name, description, price, billing_interval, product_count, discount_percentage) values
('Starter Monthly', 'Perfect for beginners - 1 premium peptide per month', 79.99, 'monthly', 1, 10.00),
('Pro Monthly', 'For serious researchers - 2 premium peptides per month', 149.99, 'monthly', 2, 15.00),
('Elite Monthly', 'Complete research package - 3 premium peptides per month', 199.99, 'monthly', 3, 20.00),
('Starter Quarterly', 'Perfect for beginners - 3 months of premium peptides', 199.99, 'quarterly', 3, 20.00),
('Pro Quarterly', 'For serious researchers - 3 months of 2 peptides each', 379.99, 'quarterly', 6, 25.00),
('Elite Quarterly', 'Complete research package - 3 months of 3 peptides each', 499.99, 'quarterly', 9, 30.00)
on conflict do nothing;

-- ========================================
-- SETUP COMPLETE! 🎉
-- ========================================

-- Your database is now ready with:
-- ✅ User authentication and profiles
-- ✅ Order management system  
-- ✅ Complete subscription system
-- ✅ Row Level Security (RLS)
-- ✅ Proper indexes for performance
-- ✅ Automatic user profile creation
-- ✅ Default subscription plans

-- Next steps:
-- 1. Restart your Next.js development server
-- 2. Test user registration and login
-- 3. Try creating a subscription
-- 4. Check your user account dashboard