# Supabase Database Setup Instructions

## 🎉 Your Supabase Configuration is Ready!

Your environment variables have been configured with your Supabase project credentials. Now you need to set up the database schema.

## Quick Setup Steps

### 1. Open Supabase SQL Editor
Go to: **https://app.supabase.com/project/gooexdxpofvjvxrlyenr/sql**

### 2. Run the Complete Setup Script
1. Copy the entire contents of `/lib/supabase/complete-setup.sql`
2. Paste it into the SQL Editor
3. Click "Run" to execute the script

**That's it!** The script will create all necessary tables, security policies, and default data.

## What Gets Created

### 🔐 Authentication & Users
- **User profiles** that extend Supabase auth
- **Automatic profile creation** when users sign up
- **Row Level Security** for data protection

### 📦 E-commerce System
- **Orders** tracking system
- **Order items** with product details
- **Shipping addresses** for deliveries
- **Guest checkout** support

### 🔄 Subscription System
- **6 subscription plans** (monthly and quarterly)
- **User subscriptions** with status tracking
- **Delivery management** with tracking numbers
- **User preferences** for customization

### 🛡️ Security Features
- **Row Level Security (RLS)** on all tables
- **User-specific data access** only
- **Proper data isolation** between users
- **Safe database operations**

## Test Your Setup

After running the SQL script, test these features:

### 1. User Authentication
- Go to `/auth` page
- Try creating a new account
- Check if you can sign in/out

### 2. Subscription Plans
- Visit `/products` page
- You should see 6 subscription plans
- Try clicking "Start Subscription" (requires login)

### 3. User Dashboard
- After logging in, go to `/account`
- Check the "My Subscriptions" tab
- View your profile information

## Database Tables Created

| Table | Purpose |
|-------|---------|
| `users` | User profiles extending auth.users |
| `orders` | Customer orders |
| `order_items` | Products in each order |
| `shipping_addresses` | Delivery addresses |
| `subscription_plans` | Available subscription tiers |
| `user_subscriptions` | Active user subscriptions |
| `subscription_items` | Products in subscriptions |
| `subscription_deliveries` | Shipment tracking |
| `subscription_delivery_items` | Items per delivery |
| `subscription_preferences` | User preferences |

## Default Subscription Plans

The setup creates 6 subscription plans:

### Monthly Plans
1. **Starter Monthly** - $79.99/month (1 peptide, 10% discount)
2. **Pro Monthly** - $149.99/month (2 peptides, 15% discount) 
3. **Elite Monthly** - $199.99/month (3 peptides, 20% discount)

### Quarterly Plans
1. **Starter Quarterly** - $199.99/quarter (3 peptides total, 20% discount)
2. **Pro Quarterly** - $379.99/quarter (6 peptides total, 25% discount)
3. **Elite Quarterly** - $499.99/quarter (9 peptides total, 30% discount)

## Troubleshooting

### If you get permission errors:
1. Make sure you're logged into the correct Supabase project
2. Verify you have admin access to the project
3. Try running the script in smaller sections

### If authentication isn't working:
1. Check that your development server restarted
2. Verify the environment variables are correct
3. Clear your browser cache and try again

### If subscription plans don't show:
1. Make sure the SQL script completed successfully
2. Check the `subscription_plans` table has data
3. Verify RLS policies are properly set

## Next Steps

Once your database is set up:

1. **Test user registration** - Create a test account
2. **Try subscriptions** - Test the subscription flow
3. **Check order tracking** - Verify the account dashboard works
4. **Test all payment methods** - Stripe, Solana Pay, E-Transfer

Your Dark Pino Peptides website now has a complete user authentication and subscription system! 🚀

## Security Notes

- All sensitive data is protected by Row Level Security
- Users can only access their own data
- Email addresses are validated through Supabase Auth
- Passwords are handled securely by Supabase
- API keys are properly configured in environment variables

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all SQL commands completed successfully
3. Make sure your development server restarted
4. Confirm environment variables are loaded correctly

---

**Project**: Dark Pino Peptides  
**Database**: Supabase (PostgreSQL)  
**Authentication**: Supabase Auth  
**Security**: Row Level Security (RLS)  