# Product Requirements Document (PRD)

### Project: Dark Pino Peptides – E-Commerce Platform

---

## 1. Overview

Dark Pino Peptides is an e-commerce platform designed to sell peptide products online. The platform will be simple, secure, and scalable, focusing on a clean user experience. Customers will be able to browse products, add items to their cart, and complete purchases via Stripe Checkout.

---

## 2. Objectives

- Provide an intuitive online storefront for peptide products.
- Ensure secure, reliable payment handling via Stripe.
- Keep technical implementation lean, modern, and maintainable.
- Optimize for speed, SEO, and mobile-first user experience.

---

## 3. Scope

### 3.1 Features (MVP)

1. **Landing Page / Product Catalog**
   - Single-page design with hero section (branding, tagline, call-to-action).
   - Product catalog displayed in a **grid layout**.
   - Each product card includes:
     - Product image
     - Product name
     - Short product description (no separate product detail page)
     - Price
     - Tags (e.g., Tissue Repair, Anti-Aging)
     - Add-to-Cart button

2. **Shopping Cart**
   - Slide-out or pop-up cart accessible from any page.
   - View selected products (name, price, quantity).
   - Ability to adjust quantity/remove products.
   - Checkout button → redirects to Stripe Checkout session.

3. **Checkout & Payments (via Stripe Checkout)**
   - Secure hosted checkout page by Stripe.
   - Support for credit/debit cards, Apple Pay, Google Pay.
   - Order confirmation screen after payment.
   - Stripe sends confirmation email (optional).

4. **Order Confirmation**
   - Post-checkout success page: “Thank you for your order” message.
   - Optional: order summary.

5. **Admin / Product Management**
   - Simple product storage in Supabase (name, description, price, stock, image).
   - No complex admin dashboard initially; products can be managed directly in DB.

---

### 3.2 Out of Scope (for MVP)

- User login/accounts.
- Subscriptions.
- Inventory tracking.
- Discounts/coupons.
- Blog or content pages.

---

## 4. Technical Requirements

### 4.1 Tech Stack

- **Frontend & Backend**: Next.js (React + API routes)
- **Styling**: Tailwind CSS
- **Database**: Supabase (Postgres) for product storage
- **Payments**: Stripe Checkout + Webhooks
- **Deployment**: Vercel

### 4.2 Architecture

- User browses site (Next.js frontend).
- Product data pulled from Supabase.
- On checkout: Next.js API route creates a Stripe Checkout Session.
- User redirected to Stripe’s hosted checkout.
- On payment success/failure: Stripe webhook → Next.js API route (order logging).

---

## 5. User Flows

### Flow A: Browse & Buy

1. User lands on homepage.
2. User scrolls through product catalog grid.
3. User clicks **Add to Cart** on a product card.
4. User reviews cart → clicks **Checkout**.
5. User redirected to **Stripe Checkout**.
6. User completes payment.
7. Redirect back to **Order Confirmation Page**.

---

## 6. Design Requirements

- **Look & Feel**: Modern, minimal, trustworthy.
- **Responsive**: Mobile-first design.
- **Branding**: Dark theme with subtle highlights (aligning with “Dark Pino”).
- **Product Layout**: Grid of product cards, each with image, short description, price, and add-to-cart button.
- **Accessibility**: Contrast ratios, semantic HTML.

---

## 7. Success Metrics

- ✅ Users can complete a purchase from product page to payment confirmation.
- ✅ Payments processed securely via Stripe.
- ✅ Site loads under 2 seconds on mobile.
- ✅ SEO-friendly (products indexable by Google).

---

## 8. Timeline (Rough)

- Week 1: Setup project, branding, initial pages.
- Week 2: Product catalog grid integration (Supabase).
- Week 3: Cart + Stripe Checkout flow.
- Week 4: Webhooks + confirmation page.
- Week 5: Testing, bug fixes, deployment.

---

## 9. Future Enhancements (Post-MVP)

- Customer accounts / login.
- Subscription products.
- Inventory management.
- Admin dashboard for product CRUD.
- Marketing pages (blog, landing funnels).
