# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BTM Studio Home Page is a corporate website and portfolio for BTM Studio, a development agency. Built with Next.js 15, React 19, and TypeScript, featuring internationalization (English/Spanish) and Supabase integration.

## Essential Commands

- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - Build for production 
- **Production**: `npm run start` - Start production server
- **Lint**: `npm run lint` - Run ESLint (always run after code changes)

## Architecture Overview

### Directory Structure
- `app/[locale]/` - Internationalized pages using next-intl
- `app/components/` - Page-specific and business logic components
- `components/ui/` - Reusable UI components (shadcn/ui)
- `i18n/` - Internationalization configuration and routing
- `messages/` - Translation files (en.json, es.json)

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase for data storage and auth
- **AI Integration**: OpenAI API through ai-sdk
- **Internationalization**: next-intl with English/Spanish support

### Environment Requirements
- Node.js 22.x (specified in package.json engines)
- Environment variables required:
  - `SUPABASE_URL`
  - `SUPABASE_KEY` 
  - OpenAI API keys for AI features

### Authentication & Data
- Supabase client configured in `app/components/supabase.js`
- User session management in `app/utils/userSession.ts`
- Project management with privacy toggles via API routes

### Internationalization Setup
- Middleware handles locale routing automatically
- Default locale: English (`en`)
- Supported locales: English (`en`), Spanish (`es`)
- Translation files in `messages/` directory

### Code Conventions
- TypeScript throughout the codebase
- Component files use PascalCase.tsx naming
- ESLint configuration with build error ignoring enabled
- Framer Motion for animations
- React Hook Form with Zod validation

### Image Handling
- Next.js Image component with unoptimized setting
- Supabase storage integration for user uploads
- Background images served from `/public/images/`

## Development Notes

The project has ESLint and TypeScript build errors ignored in production builds (`ignoreDuringBuilds: true`, `ignoreBuildErrors: true`) - ensure to run `npm run lint` after making changes to maintain code quality.

Project includes extensive component libraries (Radix UI, React Hook Form, date-fns) and is configured for modern React development patterns with server and client components.