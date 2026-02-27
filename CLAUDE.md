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
2. **Form Input** (`components/ProductForm.tsx`) - User selects:
   - Platform (radio buttons: OLX, Allegro Lokalnie, Facebook Marketplace, Vinted)
   - Tone style (radio buttons: Professional, Friendly, Casual) with platform recommendations
   - Product condition (radio buttons: nowy, idealny, używany w dobrym stanie, ślady używania)
   - Price type (radio buttons: AI suggest, user provided, free)
   - Delivery options (checkboxes: pickup and/or shipping - both selected by default)
   - Optional: product name and notes
3. **API Request** (`app/api/generate-ad/route.ts`) - Form data and images sent to Next.js API route
4. **AI Processing** (`lib/openai.ts`) - OpenAI Vision API analyzes images and generates platform-specific listings using:
   - Modular system prompt with accuracy improvements
   - Platform-specific rules loaded from `lib/rules/*.md` files
   - Tone-specific style injection
   - Multiple images with high-detail analysis
   - Structured JSON response format
5. **Result Display** (`components/AdResult.tsx`) - Shows:
   - Generation parameters summary (platform, product name, condition, price type, delivery, tone)
   - Generated title and description with copy-to-clipboard buttons
   - AI-suggested price range with reasoning (if applicable)
   - Free listing badge (if applicable)
   - Image quality analysis and suggestions for each photo

### Tone Variations

The app supports 3 tone styles for generated listings:

- **Professional** (Profesjonalny) - Formalny, rzeczowy, ekspertycki
  - Recommended for: Allegro Lokalnie
- **Friendly** (Przyjazny) - Ciepły, pomocny, naturalny
  - Recommended for: Facebook Marketplace, Vinted
- **Casual** (Swobodny) - Luźny, potoczny, bezpośredni
  - Recommended for: OLX

Each platform has a smart default tone that auto-selects when the platform changes. Users can override the default to match their preference or product type.

### Price Handling

Three price modes:
- **AI Suggest** - OpenAI analyzes the product and proposes a realistic price range (min-max) with 2-3 sentence reasoning based on product condition, brand, and market
- **User Provided** - User enters their own price in złotych; AI may mention it in the description with negotiation phrases
- **Free** ("Za darmo") - Listings marked as free with special formatting, platform-specific phrasing, and green badge in results

### Accuracy Features

The system uses a modular prompt architecture with:
- **Information hierarchy** - User data treated as absolute truth > visible facts from images > AI inferences with uncertainty language
- **Uncertainty language system** - 3 confidence levels with specific Polish phrases ("wygląda na", "może być", "trudno określić")
- **Forbidden phrases list** - Prevents AI from making definitive claims without evidence (e.g., "fabrycznie nowy", "gwarancja producenta", specific specs)
- **Dynamic tone injection** - Tone-specific vocabulary and phrasing injected based on user selection
- **Chain-of-thought analysis** - AI internally separates facts from assumptions before generating content

### Key Files and Responsibilities

**API Layer:**
- `app/api/generate-ad/route.ts` - POST endpoint that validates request, calls OpenAI, returns JSON response

**Core Logic:**
- `lib/openai.ts` - OpenAI client initialization, modular prompt engineering (6 modules), platform rules loading, tone-specific injection, API error handling
- `lib/types.ts` - TypeScript interfaces for all data structures including ToneStyle, PriceType, ToneVariant, platform defaults
- `lib/schemas.ts` - Zod validation schemas for form and API inputs (includes `tone`, `priceType` fields with conditional validation)
- `lib/utils.ts` - Utility functions (cn for className merging, file conversions)

**Platform Rules:**
- `lib/rules/olx_rules.md` - OLX-specific listing guidelines with tone variations (Professional, Friendly, Casual)
- `lib/rules/allegro_lokalnie_rules.md` - Allegro Lokalnie guidelines with tone variations
- `lib/rules/facebook_marketplace_rules.md` - Facebook Marketplace guidelines with tone variations
- `lib/rules/vinted_rules.md` - Vinted guidelines with tone variations

Each rules file includes:
- Default recommended tone for the platform
- Tone-specific phrasing examples (introductions, CTAs, condition descriptions, negotiation language)
- Free listing guidelines specific to each platform
- Platform-specific best practices and requirements

These markdown files are loaded at runtime and injected into the AI prompt to ensure platform-appropriate content generation.

**UI Components:**
- `components/ProductForm.tsx` - Main form with radio button groups for platform, tone (with recommendations), condition, and price type; checkboxes for delivery options
- `components/UploadDropzone.tsx` - Drag-and-drop image upload with validation
- `components/AdResult.tsx` - Display generated listing with generation parameters summary, copy buttons, and conditional free listing badge
- `components/ThemeProvider.tsx` & `components/ThemeToggle.tsx` - Dark/light mode
- `components/ui/*` - Reusable UI primitives (buttons, inputs, cards, badges, etc.)

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
- Each platform has tone-specific sections with example phrasing

**Error Handling:**
- API validates requests with Zod schemas
- OpenAI errors are caught and mapped to user-friendly Polish messages
- Rate limiting (429), auth errors (401), and generic errors are handled separately

**State Management:**
- React state for form data and images (no external state library)
- Platform change triggers automatic tone update to platform's recommended default
- Form submission triggers loading state and API call
- Results are displayed in a separate component with generation parameters summary

**UI/UX Patterns:**
- All form controls use radio buttons (no dropdowns) for better accessibility
- Checkboxes and radio buttons use explicit `accent-blue-600` to remain visible when window loses focus
- Default delivery options: both "odbiór osobisty" and "wysyłka" pre-selected
- Platform recommendations shown in tone selector (e.g., "⭐ Polecany dla: OLX")
- Generation parameters summary card displays all selected options in results view

## Code Style

- **Language**: All user-facing text, comments, and error messages in Polish
- **TypeScript**: Strict mode enabled, use proper types (avoid `any`)
- **Components**: Functional components with TypeScript interfaces for props
- **Imports**: Use `@/*` path alias for imports from root directory
- **Styling**: Tailwind classes using `cn()` utility for conditional classes
- **Naming**: camelCase for variables/functions, PascalCase for components/types

## Performance Best Practices

Following Vercel React Best Practices to ensure optimal bundle size and performance:

### Bundle Size Optimization (CRITICAL)

**Dynamic Imports for Conditional Components:**
- ✅ Use `next/dynamic` for components loaded only after user interaction
- ✅ Components like `FullscreenLoading` and `AdResult` are dynamically imported in `app/page.tsx`
- ❌ **NEVER** eagerly import heavy components that aren't shown on initial render
- Pattern to follow:
  ```typescript
  const HeavyComponent = dynamic(() =>
    import("@/components/HeavyComponent").then(mod => ({ default: mod.HeavyComponent })),
    { ssr: false }
  );
  ```

**Icon Imports:**
- ✅ Import from `lucide-react` barrel file (modern bundlers handle tree-shaking automatically)
- ✅ Next.js App Router with Turbopack optimizes these imports
- ❌ **DO NOT** attempt direct imports like `lucide-react/dist/esm/icons/...` (causes TypeScript errors)
- Pattern to follow:
  ```typescript
  import { Icon1, Icon2, Icon3 } from "lucide-react";
  ```

### Re-render Optimization

- ✅ Use `useCallback` for event handlers passed to child components
- ✅ Use `useMemo` for expensive calculations
- ✅ Use `React.memo` for components that receive primitive props
- ✅ Extract default non-primitive parameter values to constants outside component

### Why These Patterns Matter

1. **Dynamic imports reduce initial bundle size** by 50-200KB for large components
2. **Lazy loading improves Time to Interactive (TTI)** - users see content faster
3. **Code splitting** ensures users only download code they actually use
4. **Tree-shaking** removes unused exports from dependencies automatically

### Performance Checklist for New Features

When adding new features or components:
- [ ] Is this component shown on initial page load? If NO → use `dynamic` import
- [ ] Does this component depend on user action? If YES → use `dynamic` import with `ssr: false`
- [ ] Are you importing 5+ icons from lucide-react? → Use barrel import (tree-shaking handles it)
- [ ] Are callbacks passed to multiple children? → Wrap in `useCallback`
- [ ] Are you computing derived values? → Wrap in `useMemo`

## AI Model Configuration

The app uses OpenAI's `o4-mini` model with:
- `response_format: { type: "json_object" }` for structured output
- `max_completion_tokens: 4000` for comprehensive single-tone listings
- `detail: "high"` for image analysis
- Images sent as base64 data URLs in the content array
- Dynamic system prompt built from modular components based on selected tone

## Platform Support

The application supports 4 marketplace platforms with distinct content styles and recommended tones:

- **OLX**: Concise, practical, factual | Recommended tone: **Casual**
- **Allegro Lokalnie**: Professional, detailed, structured | Recommended tone: **Professional**
- **Facebook Marketplace**: Friendly, direct, conversational | Recommended tone: **Friendly**
- **Vinted**: Fashion-focused, lifestyle-oriented | Recommended tone: **Friendly**

Each platform has:
- Specific rules for title format, description structure, and content style in `lib/rules/*.md`
- Tone-specific phrasing examples (Professional, Friendly, Casual)
- Free listing guidelines tailored to platform culture

## Testing the Application

1. Ensure `.env.local` has valid `OPENAI_API_KEY`
2. Run `npm run dev`
3. Upload 1-8 product images
4. Select platform (radio button) - tone will auto-select to platform's recommended default
5. Optionally override tone selection if needed
6. Select product condition (radio button)
7. Select price type: AI suggest, user-provided amount, or free
8. Delivery options are pre-selected (both pickup and shipping)
9. Optionally add product name and notes
10. Click "Generuj ogłoszenie" (Generate listing)
11. Review generation parameters summary card
12. Verify generated title, description, and price suggestions (if applicable)
13. Check image quality feedback and suggestions
14. Use copy buttons to copy content to clipboard

## Common Modifications

**To add a new platform:**
1. Add platform type to `lib/types.ts` in `Platform` type and `PLATFORM_NAMES`
2. Add default tone for the platform in `PLATFORM_DEFAULT_TONES`
3. Create new rules file in `lib/rules/[platform]_rules.md` with tone sections
4. Update `PLATFORM_RULES_FILES` mapping in `lib/openai.ts`
5. Add radio button option in `components/ProductForm.tsx` platform section
6. Update platform recommendations in tone selector descriptions

**To modify AI behavior:**
- Edit modular prompt sections in `lib/openai.ts` (e.g., `PROMPT_INFORMATION_HIERARCHY`, `PROMPT_UNCERTAINTY_LANGUAGE`)
- Adjust platform-specific rules and tone examples in respective `lib/rules/*.md` files
- Modify `getToneInstructions()` function for tone-specific phrasing
- Change model parameters in the `generateAd()` function

**To add a new tone style:**
1. Add tone to `ToneStyle` type in `lib/types.ts`
2. Add display names in `TONE_STYLE_NAMES` and descriptions in `TONE_STYLE_DESCRIPTIONS`
3. Update `getToneInstructions()` function in `lib/openai.ts`
4. Add tone sections to all platform rules files in `lib/rules/*.md`
5. Add radio button option in `components/ProductForm.tsx` with platform recommendations

**To change image limits:**
- Update `MAX_IMAGES` constant in `lib/types.ts`
- Update validation in `components/UploadDropzone.tsx`

## Deployment

Recommended: Vercel (optimized for Next.js)
```bash
vercel
vercel env add OPENAI_API_KEY
vercel --prod
```

Alternative: Docker (see README.md for Dockerfile)
