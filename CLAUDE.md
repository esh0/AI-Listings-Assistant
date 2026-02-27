# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Generator Ogłoszeń Sprzedażowych (AI Sales Listing Generator) - A Next.js application that uses OpenAI GPT-4o to automatically generate professional sales listings for Polish marketplace platforms (OLX, Allegro Lokalnie, Facebook Marketplace, Vinted). The app analyzes product images and generates platform-specific titles, descriptions, price suggestions, and image quality assessments.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **AI**: OpenAI API (o4-mini model)
- **Validation**: Zod schemas
- **UI Components**: Custom components styled similar to shadcn/ui
- **Theme**: next-themes for dark/light mode
- **Icons**: lucide-react

## Development Commands

```bash
# Install dependencies
npm install

# Development server (localhost:3000)
npm run dev

# Development server with network access
npm run dev:network

# Production build
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
```

## Environment Variables

Create `.env.local` with:
```
OPENAI_API_KEY=sk-your-api-key-here
```

The `OPENAI_API_KEY` is required for the app to function. Copy from `.env.example` and add your OpenAI API key with GPT-4o access.

## Architecture

### Application Flow

1. **Image Upload** (`components/UploadDropzone.tsx`) - User uploads up to 8 product images via drag-and-drop or file picker. Images are validated for size (max 10MB) and format (JPG/PNG/WEBP), then converted to base64
2. **Form Input** (`components/ProductForm.tsx`) - User selects platform, product condition, delivery options, and provides optional product details
3. **API Request** (`app/api/generate-ad/route.ts`) - Form data and images sent to Next.js API route
4. **AI Processing** (`lib/openai.ts`) - OpenAI Vision API analyzes images and generates platform-specific listings using:
   - System prompt with general rules
   - Platform-specific rules loaded from `lib/rules/*.md` files
   - Multiple images with high-detail analysis
   - Structured JSON response format
5. **Result Display** (`components/AdResult.tsx`) - Shows generated title, description, price suggestions, and image quality analysis with copy-to-clipboard functionality

### Key Files and Responsibilities

**API Layer:**
- `app/api/generate-ad/route.ts` - POST endpoint that validates request, calls OpenAI, returns JSON response

**Core Logic:**
- `lib/openai.ts` - OpenAI client initialization, prompt engineering, platform rules loading, API error handling
- `lib/types.ts` - TypeScript interfaces for all data structures (requests, responses, form data)
- `lib/schemas.ts` - Zod validation schemas for form and API inputs
- `lib/utils.ts` - Utility functions (cn for className merging)

**Platform Rules:**
- `lib/rules/olx_rules.md` - OLX-specific listing guidelines
- `lib/rules/allegro_lokalnie_rules.md` - Allegro Lokalnie guidelines
- `lib/rules/facebook_marketplace_rules.md` - Facebook Marketplace guidelines
- `lib/rules/vinted_rules.md` - Vinted guidelines

These markdown files are loaded at runtime and injected into the AI prompt to ensure platform-appropriate content generation.

**UI Components:**
- `components/ProductForm.tsx` - Main form for product details and settings
- `components/UploadDropzone.tsx` - Drag-and-drop image upload with validation
- `components/AdResult.tsx` - Display generated listing with copy buttons
- `components/ThemeProvider.tsx` & `components/ThemeToggle.tsx` - Dark/light mode
- `components/ui/*` - Reusable UI primitives (buttons, inputs, cards, etc.)

**Pages:**
- `app/page.tsx` - Main application page that orchestrates the entire flow
- `app/layout.tsx` - Root layout with metadata, fonts, and theme provider

### Important Patterns

**Image Handling:**
- Images are converted to base64 in the browser before API submission
- The OpenAI API receives images as data URLs: `data:image/jpeg;base64,...`
- Multiple images (up to 8) are sent in a single request for comprehensive analysis
- Each image gets individual quality assessment and suggestions in the response

**Platform-Specific Content:**
- Platform rules are markdown files loaded server-side via `fs.readFileSync`
- Rules are cached in a Map to avoid repeated file reads
- The selected platform determines which rules file is injected into the AI prompt

**Error Handling:**
- API validates requests with Zod schemas
- OpenAI errors are caught and mapped to user-friendly Polish messages
- Rate limiting (429), auth errors (401), and generic errors are handled separately

**State Management:**
- React state for form data and images (no external state library)
- Form submission triggers loading state and API call
- Results are displayed in a separate component after successful generation

## Code Style

- **Language**: All user-facing text, comments, and error messages in Polish
- **TypeScript**: Strict mode enabled, use proper types (avoid `any`)
- **Components**: Functional components with TypeScript interfaces for props
- **Imports**: Use `@/*` path alias for imports from root directory
- **Styling**: Tailwind classes using `cn()` utility for conditional classes
- **Naming**: camelCase for variables/functions, PascalCase for components/types

## AI Model Configuration

The app uses OpenAI's `o4-mini` model with:
- `response_format: { type: "json_object" }` for structured output
- `max_completion_tokens: 4000` for comprehensive listings
- `detail: "high"` for image analysis
- Images sent as base64 data URLs in the content array

## Platform Support

The application supports 4 marketplace platforms with distinct content styles:
- **OLX**: Concise, practical, factual
- **Allegro Lokalnie**: Professional, detailed, structured
- **Facebook Marketplace**: Friendly, direct, conversational
- **Vinted**: Fashion-focused, lifestyle-oriented

Each platform has specific rules for title format, description structure, and content style defined in `lib/rules/*.md`.

## Testing the Application

1. Ensure `.env.local` has valid `OPENAI_API_KEY`
2. Run `npm run dev`
3. Upload a product image
4. Fill in the form (platform, condition, delivery)
5. Click "Generuj ogłoszenie" (Generate listing)
6. Verify the generated title, description, and price suggestions
7. Check image quality feedback

## Common Modifications

**To add a new platform:**
1. Add platform type to `lib/types.ts` in `Platform` type and `PLATFORM_NAMES`
2. Create new rules file in `lib/rules/[platform]_rules.md`
3. Update `PLATFORM_RULES_FILES` mapping in `lib/openai.ts`
4. Update platform select options in `components/ProductForm.tsx`

**To modify AI behavior:**
- Edit system prompt in `lib/openai.ts` (SYSTEM_PROMPT constant)
- Adjust platform-specific rules in respective `lib/rules/*.md` files
- Change model parameters (temperature, max_tokens) in the API call

**To change image limits:**
- Update `MAX_IMAGES` constant in `lib/types.ts`
- Update validation in upload component

## Deployment

Recommended: Vercel (optimized for Next.js)
```bash
vercel
vercel env add OPENAI_API_KEY
vercel --prod
```

Alternative: Docker (see README.md for Dockerfile)
