-- Enable Row Level Security
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

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
  country text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security on all tables
alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipping_addresses enable row level security;

-- Create policies for users table
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- Create policies for orders table
create policy "Users can view own orders" on public.orders
  for select using (
    auth.uid() = user_id or 
    (user_id is null and guest_email = (select email from auth.users where id = auth.uid()))
  );

create policy "Anyone can create orders" on public.orders
  for insert with check (true);

create policy "System can update orders" on public.orders
  for update using (true);

-- Create policies for order_items table
create policy "Users can view own order items" on public.order_items
  for select using (
    order_id in (
      select id from public.orders 
      where auth.uid() = user_id or 
      (user_id is null and guest_email = (select email from auth.users where id = auth.uid()))
    )
  );

create policy "Anyone can create order items" on public.order_items
  for insert with check (true);

-- Create policies for shipping_addresses table
create policy "Users can view own shipping addresses" on public.shipping_addresses
  for select using (
    order_id in (
      select id from public.orders 
      where auth.uid() = user_id or 
      (user_id is null and guest_email = (select email from auth.users where id = auth.uid()))
    )
  );

create policy "Anyone can create shipping addresses" on public.shipping_addresses
  for insert with check (true);

-- Create indexes for better performance
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_guest_email_idx on public.orders(guest_email);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists shipping_addresses_order_id_idx on public.shipping_addresses(order_id);

-- Create function to automatically create user profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create user profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_users_updated_at before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger handle_orders_updated_at before update on public.orders
  for each row execute procedure public.handle_updated_at();