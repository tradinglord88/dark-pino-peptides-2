# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dark Pino Peptides is an e-commerce platform for premium research peptides. This is a fresh implementation using modern web technologies, designed to be simple, secure, and scalable with a clean user experience.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code with Prettier
npm run format
```

## Tech Stack

- **Frontend & Backend**: Next.js 14+ with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with dark theme support
- **Database**: Supabase (Postgres) for product storage
- **Payments**: Stripe Checkout + Webhooks
- **State Management**: Zustand for cart state
- **Deployment**: Vercel

## Architecture

The application follows a streamlined Next.js App Router architecture:
- Server components by default for better performance
- Client components only for interactivity (cart, forms)
- API routes handle backend functionality
- Supabase for database operations
- Stripe for secure payment processing

## Project Structure

- `/app` - Next.js App Router with route groups
- `/components` - React components organized by feature
- `/lib` - Core utilities and integrations (Supabase, Stripe)
- `/hooks` - Custom React hooks
- `/types` - TypeScript type definitions
- `/config` - Configuration files and constants
- `/public` - Static assets

## Key Features (MVP)

### E-commerce Core
- Product catalog with grid layout
- Shopping cart with localStorage persistence
- Stripe checkout integration
- Order confirmation system

### Design Requirements
- Dark theme with modern, minimal design
- Mobile-first responsive layout
- Accessibility compliance
- Performance optimized (< 2s load time)

## Environment Variables

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Development Guidelines

- Use server components by default
- Client components only when needed (`'use client'`)
- Follow the existing TypeScript patterns
- Use Tailwind classes for styling
- Implement proper error handling
- Test payment flows thoroughly