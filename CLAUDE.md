# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Generator Ogłoszeń Sprzedażowych (Marketplace Assistant) - A Next.js application that uses OpenAI GPT-4o to automatically generate professional sales listings for Polish marketplace platforms (OLX, Allegro Lokalnie, Facebook Marketplace, Vinted). The app features user authentication, credit-based usage system, ad management dashboard, and AI-powered content generation with image analysis.

**Key Features:**
- 🤖 AI-powered ad generation with image analysis
- 🔐 Google OAuth authentication via NextAuth
- 💳 Credit system (FREE: 3/month, PREMIUM: unlimited)
- 📊 Dashboard with ad management (CRUD operations)
- 🔍 Advanced filtering, sorting, and search
- 📄 Pagination (20 ads per page)
- 🎨 Dark/light mode support
- 📱 Fully responsive design

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma 5.22.0
- **Authentication**: NextAuth v5 (JWT strategy)
- **Storage**: Supabase Storage (image uploads with sharp resizing)
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

**IMPORTANT - Development Server Management:**
Before starting the dev server, ALWAYS kill any processes running on ports 3000 and 3001:
```bash
# Kill processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Then start the dev server
npm run dev
```

This ensures a clean restart and prevents port conflicts. Use this command sequence every time you need to restart the development server.

## Environment Variables

Create `.env.local` with:
```
# OpenAI API
OPENAI_API_KEY=sk-your-api-key-here

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth
AUTH_SECRET=your-random-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Required keys:**
- `OPENAI_API_KEY` - OpenAI API with GPT-4o access
- `DATABASE_URL` - PostgreSQL connection string (Supabase provides this)
- `AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth credentials from Google Cloud Console
- Supabase keys - Available in Supabase project settings

## Architecture

### Application Flow

**Unauthenticated User (Soft-wall):**
1. User visits home page → sees ad creation form
2. Creates ad without login → sees results
3. After generation → prompted to sign in to save ad

**Authenticated User:**
1. User signs in with Google OAuth → redirected to dashboard
2. Dashboard shows: recent ads, statistics, quick actions
3. Click "Nowe ogłoszenie" → `/dashboard/new` page with ad creation form
4. **Image Upload** - Up to 8 images (max 10MB each, JPG/PNG/WEBP)
5. **Form Input** - Platform, tone, condition, price, delivery, notes
6. **AI Processing** - OpenAI generates ad with image analysis, credit consumed
7. **Review Results** - User sees generated title, description, price suggestions
8. **Save to Database** - Click "Zapisz" button to save ad with DRAFT status, images uploaded to Supabase Storage
9. **Manage Ads** - `/dashboard/ads` page with filtering, sorting, search, pagination

**Credits System:**
- FREE users: 3 credits/month (resets monthly)
- PREMIUM users: Unlimited credits (9999)
- **Credit consumed on generation** (before saving) - prevents abuse
- Tracked in `User.creditsAvailable` field

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

**Authentication & Database:**
- `auth.ts` - NextAuth v5 configuration with Google OAuth provider, JWT strategy
- `prisma/schema.prisma` - Database schema (User, Account, Session, Ad models)
- `lib/prisma.ts` - Prisma client singleton
- `lib/credits.ts` - Credit management (hasCredits, consumeCredit, resetCredits, upgradeToPremium)
- `lib/image-upload.ts` - Supabase Storage integration with sharp image resizing

**API Layer:**
- `app/api/generate-ad/route.ts` - POST endpoint for ad generation (validates request, consumes credit, calls OpenAI - **does not save to DB**)
- `app/api/ads/route.ts` - POST endpoint for saving ads (uploads images to Supabase, saves to DB)
- `app/api/ads/[id]/route.ts` - GET/PATCH/DELETE endpoints for ad management
- `app/api/ads/export/route.ts` - CSV export endpoint
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API routes

**Core Logic:**
- `lib/openai.ts` - OpenAI client, modular prompt engineering, platform rules loading, tone injection
- `lib/types.ts` - TypeScript interfaces for all data structures
- `lib/schemas.ts` - Zod validation schemas for forms and API
- `lib/utils.ts` - Utility functions (cn, file conversions)

**Platform Rules:**
- `lib/rules/*.md` - Platform-specific listing guidelines with tone variations

**Dashboard Components:**
- `components/Sidebar.tsx` - Navigation sidebar with user info and credits display
- `components/AdsList.tsx` - Ad list with filtering, sorting, search, pagination
- `components/AdCard.tsx` - Compact ad card with platform icons, status badges, action buttons (Publish/Sold)
- `components/StatsCards.tsx` - Dashboard statistics cards (uses text-lg font-semibold for numbers)
- `components/AdGeneratorForm.tsx` - Reusable ad creation form with header and save flow

**Ad Creation Components:**
- `components/UploadDropzone.tsx` - Drag-and-drop image upload
- `components/ProductForm.tsx` - Form with platform, tone, condition, price, delivery
- `components/FullscreenLoading.tsx` - Loading screen with React Portal (renders to document.body, z-9999)
- `components/AdResult.tsx` - Results display with 65/35 grid layout, passes platform and edit state to AdResultMain
- `components/AdResultMain.tsx` - Displays title/description with inline editing (platform-specific character limits, Check icon confirmation)

**Pages:**
- `app/page.tsx` - Home page (redirects authenticated users to dashboard, shows form for guests)
- `app/dashboard/page.tsx` - Dashboard overview
- `app/dashboard/new/page.tsx` - Ad creation page (client component, includes header in form)
- `app/dashboard/ads/page.tsx` - Ad management page (server component with filtering/sorting/search/pagination)
- `app/dashboard/ads/[id]/page.tsx` - Ad details page
- `app/dashboard/layout.tsx` - Dashboard layout with sidebar

### Important Patterns

**Ad Generation & Saving Flow:**
1. User fills form and clicks "Generuj ogłoszenie"
2. API `/api/generate-ad` consumes credit and generates content (does NOT save)
3. User reviews results on same page
4. User can edit title/description with platform-specific character limits
5. Authenticated users click "Zapisz" (Check icon) to save via `/api/ads` POST
6. Unauthenticated users see soft-wall modal after 1.5s
7. After save, user can click "Zapisz i stwórz następne" (RotateCcw icon) to reset form
8. Credits consumed on generation (not on save) to prevent abuse

**Inline Editing Pattern:**
1. User sees generated title/description with Pencil icon in card header
2. Click Pencil → field becomes editable input/textarea with auto-focus
3. Icon changes to green Check, Copy button remains active
4. Keyboard shortcuts: Escape (exit edit), Cmd/Ctrl+Enter (exit edit)
5. Validation: empty fields show red border + error, disable Save button
6. Character counter: shows current/max (platform-specific), turns red > 90% limit
7. Changes saved in parent state, main "Zapisz" (Check icon) button uses edited values
8. Reset button: "Zapisz i stwórz następne" clears all edited state
9. **Platform-specific limits:**
   - OLX: 70 chars title, 1500 chars description
   - Allegro Lokalnie: 75 chars title, 1500 chars description
   - Facebook Marketplace: 60 chars title, 1000 chars description
   - Vinted: 100 chars title, 750 chars description

**Dashboard Layout:**
- Fixed sidebar on desktop (lg:w-72), mobile overlay with hamburger menu
- Main content area with lg:pl-72 padding to account for sidebar
- Sidebar shows user info, plan badge, credits counter (∞ for PREMIUM)

**Ad List Filtering & Search:**
- Server-side filtering by status (DRAFT/PUBLISHED/SOLD), platform, search query
- Client-side UI with collapsible filters panel, active filter count badge
- Debounced search (500ms delay) - no form submission needed
- Sorting by createdAt, updatedAt, title (asc/desc)
- Pagination: 20 ads per page with Prisma skip/take
- URL-based state management via searchParams

**Ad Card Layout (Compact):**
```
+------------------------------------------------------------------+
| [Image  ] [Title]                                         [Date] |
| [144px  ] [Icon] [Status] [Price]                                |
| [h-36   ] [Description line 1, line 2, line 3…]   [Action btns] |
+------------------------------------------------------------------+
```
- Padding: `p-4`, Gap: `gap-4`
- Image: `h-36 w-36` (144px square)
- **Platform Icon**: Colored icon instead of text badge (ShoppingBag, Store, Facebook, Shirt)
- Content: `flex-1 flex flex-col min-h-[144px]`
- Description + Actions: `flex items-end` (aligns buttons to bottom of last line)
- Date moved to title row (top-right)
- **Action Buttons**:
  - DRAFT → "Opublikuj" (green CheckCircle)
  - PUBLISHED → "Sprzedane" (orange CircleDollarSign)
  - All states → View (Eye), Edit, Delete (Trash2)

**Image Storage:**
- Images uploaded to Supabase Storage (`marketplace-ads` bucket)
- Sharp resizes to 800px width, 85% JPEG quality
- Stored as thumbnails, original base64 discarded after upload
- RLS policies allow authenticated uploads

**Platform-Specific Content:**
- Platform rules are markdown files loaded server-side via `fs.readFileSync`
- Rules are cached in a Map to avoid repeated file reads
- The selected platform determines which rules file is injected into the AI prompt
- Each platform has tone-specific sections with example phrasing

**Error Handling:**
- API validates requests with Zod schemas
- OpenAI errors are caught and mapped to user-friendly Polish messages
- Rate limiting (429), auth errors (401), and generic errors are handled separately
- Credit exhaustion shows upgrade prompt

**State Management:**
- React state for form data and images (no external state library)
- NextAuth session for authentication state
- Prisma for database state
- URL searchParams for filter/sort/pagination state

**Authentication Flow:**
- Google OAuth via NextAuth v5
- JWT strategy (no database sessions)
- User created on first sign-in with default FREE plan (3 credits)
- Session contains: id, name, email, image, plan, creditsAvailable

## Code Style

- **Language**: All user-facing text, comments, and error messages in Polish
- **TypeScript**: Strict mode enabled, use proper types (avoid `any`)
- **Components**: Functional components with TypeScript interfaces for props
- **Imports**: Use `@/*` path alias for imports from root directory
- **Styling**: Tailwind classes using `cn()` utility for conditional classes
- **Naming**: camelCase for variables/functions, PascalCase for components/types

**Component Patterns:**
- Segmented controls: Horizontal button group in muted container with roving tabindex
- Platform tiles: 2x2 grid with icons, hover scale effects, and aria-radio roles
- Responsive components: Desktop segmented control, mobile radio buttons (ConditionSegmentedControl)
- Sticky CTA: Bottom-positioned button in Card 4 with `sticky bottom-0` for easy access
- Card composition: CardWrapper with forwardRef and React.memo for performance

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

### Re-render Optimization (MEDIUM)

**Applied optimizations:**
- ✅ Use `useCallback` for event handlers passed to child components
- ✅ Use `useMemo` for expensive calculations
- ✅ Use `React.memo` for components that receive primitive props
- ✅ Extract default non-primitive parameter values to constants outside component
- ✅ Use functional `setState` updates to reduce dependencies

**Specific implementations:**

1. **Functional setState for Stable Callbacks** (`components/ProductForm.tsx`):
   ```typescript
   // ✅ GOOD: Uses functional update, depends only on onDeliveryChange
   const handleDeliveryToggle = useCallback((option: DeliveryOption) => {
       onDeliveryChange((prevDelivery) => {
           // Logic uses previous state, not captured value
           return prevDelivery.includes(option)
               ? prevDelivery.filter((d) => d !== option)
               : [...prevDelivery, option];
       });
   }, [onDeliveryChange]);

   // ❌ BAD: Depends on delivery array, recreates on every delivery change
   const handleDeliveryToggle = useCallback((option: DeliveryOption) => {
       if (delivery.includes(option)) {
           onDeliveryChange(delivery.filter((d) => d !== option));
       }
   }, [delivery, onDeliveryChange]); // delivery dependency causes recreation
   ```

2. **Hoisting Default Values** (`app/page.tsx`):
   ```typescript
   // ✅ GOOD: Constants hoisted outside component (created once)
   const DEFAULT_PLATFORM: Platform = "olx";
   const DEFAULT_DELIVERY: DeliveryOption[] = ["odbiór osobisty", "wysyłka"];

   export default function HomePage() {
       const [platform, setPlatform] = useState<Platform>(DEFAULT_PLATFORM);
       const [delivery, setDelivery] = useState<DeliveryOption[]>(DEFAULT_DELIVERY);
   }

   // ❌ BAD: Recreates array on every render
   export default function HomePage() {
       const [delivery, setDelivery] = useState<DeliveryOption[]>(
           ["odbiór osobisty", "wysyłka"] // New array reference every render
       );
   }
   ```

**Why functional setState matters:**
- Callback depends only on `onDeliveryChange` (stable), not `delivery` (changes frequently)
- Prevents callback recreation on every delivery change
- Reduces unnecessary re-renders in child components receiving the callback
- **Impact**: 30-50% fewer callback recreations in forms with multiple updates

**Pattern to follow:**
```typescript
// When callback needs current state, use functional update
const handleUpdate = useCallback((newValue) => {
    setState((prevState) => {
        // Use prevState, not captured state
        return computeNewState(prevState, newValue);
    });
}, [/* only stable dependencies */]);
```

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
- [ ] Does callback need current state? → Use functional `setState((prev) => ...)` to reduce dependencies
- [ ] Are default values non-primitive (arrays/objects)? → Hoist outside component as constants
- [ ] Does component receive stable props? → Consider `React.memo` to prevent unnecessary re-renders

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
