-- Enhanced schema for admin dashboard and payment tracking
-- Run this SQL in your Supabase SQL editor

-- Drop existing tables if they exist (be careful in production!)
-- DROP TABLE IF EXISTS solana_payments CASCADE;
-- DROP TABLE IF EXISTS etransfer_payments CASCADE;
-- DROP TABLE IF EXISTS admin_activity_logs CASCADE;
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS shipping_addresses CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;

-- Enhanced orders table with comprehensive payment tracking
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL DEFAULT ('ORD-' || LPAD(nextval('order_number_seq')::text, 6, '0')),

  -- Customer Information
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Payment Information
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'solana', 'etransfer', 'crypto')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_amount DECIMAL(10, 2) NOT NULL,
  payment_currency TEXT DEFAULT 'USD',

  -- Blockchain specific fields
  transaction_hash TEXT,
  wallet_address TEXT,
  merchant_wallet TEXT,

  -- E-Transfer specific fields
  etransfer_reference TEXT,
  etransfer_email TEXT,

  -- Stripe specific fields
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,

  -- Shipping Information
  shipping_name TEXT,
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT,
  shipping_phone TEXT,
  shipping_method TEXT,
  shipping_tracking_number TEXT,
  shipping_carrier TEXT,
  shipping_status TEXT DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'processing', 'shipped', 'delivered', 'returned')),

  -- Order Details
  order_items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,

  -- Metadata
  notes TEXT,
  internal_notes TEXT,
  ip_address INET,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Create sequence for order numbers if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'order_number_seq') THEN
    CREATE SEQUENCE order_number_seq START 1000;
  END IF;
END$$;

-- Solana payment verification table
CREATE TABLE IF NOT EXISTS public.solana_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

  -- Transaction details
  signature TEXT UNIQUE NOT NULL,
  from_wallet TEXT NOT NULL,
  to_wallet TEXT NOT NULL,
  amount DECIMAL(20, 9) NOT NULL,
  token_address TEXT,
  token_symbol TEXT DEFAULT 'SOL',

  -- Verification
  confirmed BOOLEAN DEFAULT FALSE,
  confirmations INTEGER DEFAULT 0,
  slot BIGINT,
  block_time TIMESTAMPTZ,

  -- Status
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'confirmed', 'failed', 'expired')),
  verification_attempts INTEGER DEFAULT 0,
  last_verification_at TIMESTAMPTZ,

  -- Metadata
  raw_transaction JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- E-Transfer tracking table
CREATE TABLE IF NOT EXISTS public.etransfer_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

  -- Transfer details
  reference_number TEXT UNIQUE NOT NULL,
  sender_email TEXT NOT NULL,
  sender_name TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'CAD',

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'deposited', 'rejected', 'expired')),
  received_at TIMESTAMPTZ,
  deposited_at TIMESTAMPTZ,

  -- Banking details
  bank_reference TEXT,
  deposit_account TEXT,

  -- Notes
  admin_notes TEXT,
  customer_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'viewer')),
  permissions JSONB DEFAULT '{"orders": true, "payments": true, "customers": true}'::jsonb,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin activity log
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id),
  admin_email TEXT NOT NULL,

  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,

  old_values JSONB,
  new_values JSONB,

  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

CREATE INDEX IF NOT EXISTS idx_solana_payments_signature ON solana_payments(signature);
CREATE INDEX IF NOT EXISTS idx_solana_payments_order_id ON solana_payments(order_id);

CREATE INDEX IF NOT EXISTS idx_etransfer_reference ON etransfer_payments(reference_number);
CREATE INDEX IF NOT EXISTS idx_etransfer_order_id ON etransfer_payments(order_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_solana_payments_updated_at ON solana_payments;
CREATE TRIGGER update_solana_payments_updated_at BEFORE UPDATE ON solana_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_etransfer_payments_updated_at ON etransfer_payments;
CREATE TRIGGER update_etransfer_payments_updated_at BEFORE UPDATE ON etransfer_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for admin dashboard
CREATE OR REPLACE VIEW admin_order_dashboard AS
SELECT
  o.id,
  o.order_number,
  o.customer_email,
  o.customer_name,
  o.payment_method,
  o.payment_status,
  o.shipping_status,
  o.total_amount,
  o.payment_currency,
  o.created_at,
  o.paid_at,
  o.shipped_at,
  o.shipping_tracking_number,
  CASE
    WHEN o.payment_method = 'solana' THEN sp.signature
    WHEN o.payment_method = 'etransfer' THEN ep.reference_number
    WHEN o.payment_method = 'stripe' THEN o.stripe_payment_intent_id
    ELSE NULL
  END AS payment_reference,
  CASE
    WHEN o.payment_method = 'solana' THEN sp.verification_status
    WHEN o.payment_method = 'etransfer' THEN ep.status
    ELSE o.payment_status
  END AS detailed_payment_status,
  o.order_items,
  o.shipping_name,
  o.shipping_address_line1,
  o.shipping_city,
  o.shipping_country,
  o.internal_notes
FROM orders o
LEFT JOIN solana_payments sp ON sp.order_id = o.id
LEFT JOIN etransfer_payments ep ON ep.order_id = o.id
ORDER BY o.created_at DESC;

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE solana_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE etransfer_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for admin access
CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (
    customer_email = auth.jwt() ->> 'email'
  );

CREATE POLICY "Admins can manage solana payments" ON solana_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage etransfer payments" ON etransfer_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can view admin users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

CREATE POLICY "Admins can view activity logs" ON admin_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "System can insert activity logs" ON admin_activity_logs
  FOR INSERT WITH CHECK (true);

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_admin_email TEXT;
BEGIN
  SELECT email INTO v_admin_email
  FROM admin_users
  WHERE id = auth.uid();

  INSERT INTO admin_activity_logs (
    admin_user_id,
    admin_email,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    v_admin_email,
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data to create an admin user (run this separately after creating your account)
-- INSERT INTO admin_users (id, email, full_name, role)
-- SELECT id, email, raw_user_meta_data->>'full_name', 'super_admin'
-- FROM auth.users
-- WHERE email = 'your-admin-email@example.com'
-- ON CONFLICT (id) DO NOTHING;