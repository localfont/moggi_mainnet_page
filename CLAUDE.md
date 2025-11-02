# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16.0.1 application built with React 19, TypeScript, and Tailwind CSS v4. The project uses the Next.js App Router architecture.

## Key Commands

### Development
- User runs `npm run dev` themselves (DO NOT run this command)
- Build: `npm run build`
- Production start: `npm start`
- Lint: `npm run lint` (ESLint with Next.js config)

## Architecture

### Directory Structure
- `app/` - Next.js App Router directory containing routes and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Homepage component
  - `globals.css` - Global Tailwind CSS styles
- `public/` - Static assets (SVGs)
- TypeScript configuration uses path alias `@/*` mapped to project root

### Tech Stack
- **Framework**: Next.js 16.0.1 (App Router)
- **React**: v19.2.0
- **TypeScript**: Strict mode enabled, target ES2017
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono (next/font/google)
- **Linting**: ESLint v9 with Next.js config (core-web-vitals + TypeScript rules)

### Configuration Details
- TypeScript uses `jsx: "react-jsx"` and `moduleResolution: "bundler"`
- ESLint configured via `eslint.config.mjs` with Next.js vitals and TypeScript presets
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

### Image Optimization
Uses Next.js `next/image` component with priority loading for above-the-fold images.
