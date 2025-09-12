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

-- Enable Row Level Security
alter table public.subscription_plans enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.subscription_items enable row level security;
alter table public.subscription_deliveries enable row level security;
alter table public.subscription_delivery_items enable row level security;
alter table public.subscription_preferences enable row level security;

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

-- Indexes for better performance
create index if not exists user_subscriptions_user_id_idx on public.user_subscriptions(user_id);
create index if not exists user_subscriptions_status_idx on public.user_subscriptions(status);
create index if not exists subscription_deliveries_subscription_id_idx on public.subscription_deliveries(subscription_id);
create index if not exists subscription_deliveries_delivery_date_idx on public.subscription_deliveries(delivery_date);
create index if not exists subscription_deliveries_status_idx on public.subscription_deliveries(status);

-- Triggers for updated_at
create trigger handle_subscription_plans_updated_at before update on public.subscription_plans
  for each row execute procedure public.handle_updated_at();

create trigger handle_user_subscriptions_updated_at before update on public.user_subscriptions
  for each row execute procedure public.handle_updated_at();

create trigger handle_subscription_deliveries_updated_at before update on public.subscription_deliveries
  for each row execute procedure public.handle_updated_at();

create trigger handle_subscription_preferences_updated_at before update on public.subscription_preferences
  for each row execute procedure public.handle_updated_at();

-- Insert default subscription plans
insert into public.subscription_plans (name, description, price, billing_interval, product_count, discount_percentage) values
('Starter Monthly', 'Perfect for beginners - 1 premium peptide per month', 79.99, 'monthly', 1, 10.00),
('Pro Monthly', 'For serious researchers - 2 premium peptides per month', 149.99, 'monthly', 2, 15.00),
('Elite Monthly', 'Complete research package - 3 premium peptides per month', 199.99, 'monthly', 3, 20.00),
('Starter Quarterly', 'Perfect for beginners - 3 months of premium peptides', 199.99, 'quarterly', 3, 20.00),
('Pro Quarterly', 'For serious researchers - 3 months of 2 peptides each', 379.99, 'quarterly', 6, 25.00),
('Elite Quarterly', 'Complete research package - 3 months of 3 peptides each', 499.99, 'quarterly', 9, 30.00);