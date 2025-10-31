# UI (Next.js + React + TypeScript)

## Migration from Vite
This project has been migrated from Vite to Next.js App Router for improved Vercel integration.

## Scripts
- dev: `npm run dev` - Starts Next.js dev server on port 3000
- build: `npm run build` - Builds production-optimized Next.js app
- start: `npm run start` - Starts production server (after build)
- test: `npm run test` - Runs Vitest tests

## Port and Hosting
- Dev server runs on port 3000 (Next.js default)
- Production builds output to `.next` directory
- Configured for Vercel deployment via `vercel.json`

## Environment Variables
- Create `.env.local` for local development (not committed)
- See `.env.example` for available variables
- `NEXT_PUBLIC_SITE_URL` - Site URL (default: http://localhost:3000)

## API Routes
- `/api/health` - Health check endpoint returns `{ status: 'ok' }`

## Notes
- Styling uses CSS Modules and `src/styles/global.css` variables
- No external UI libraries (pure HTML/CSS/JS)
- App Router structure: `app/` directory contains routes and layouts
- Client components marked with `'use client'` directive
- Drawer is lazy-loaded for performance

## Vercel Deployment
1. Connect repository to Vercel
2. Build command: `npm run build`
3. Output directory: `.next` (auto-detected)
4. Framework: Next.js (auto-detected)
5. Environment variables configured in Vercel dashboard
