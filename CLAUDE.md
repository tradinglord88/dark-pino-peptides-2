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

# Cache management (use when experiencing build errors)
npm run clean         # Clear Next.js and Node cache
npm run clean:all     # Full reset: clear cache + reinstall dependencies
npm run fresh-build   # Clean cache then build
npm run fresh-dev     # Clean cache then start dev server

# Alternative cache clearing
./clear-cache.sh      # Run the bash script for cache cleanup
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

## Troubleshooting

### Cache Issues

If you encounter build errors like "ENOENT: no such file or directory, open '.next/server/app/page.js'":

1. **Quick fix**: `npm run clean` or `./clear-cache.sh`
2. **Full reset**: `npm run clean:all`
3. **Fresh development**: `npm run fresh-dev`

### Common Cache Error Patterns

- Module not found errors after adding new components
- Stale build artifacts causing runtime errors
- TypeScript errors that persist after fixing code
- Hot reload not working properly

### Configuration Features

- `cleanDistDir: true` - Automatically cleans build directory
- `webpackBuildWorker: false` - Improves cache stability
- Development cache disabled - Prevents stale cache in dev mode
