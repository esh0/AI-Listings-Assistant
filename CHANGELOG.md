# Changelog

## [2026-03-03] Dashboard & Ad Management

### Added
- **Authentication System**
  - Google OAuth via NextAuth v5 with JWT strategy
  - User management with Prisma (PostgreSQL via Supabase)
  - Credit system: FREE (3/month) and PREMIUM (unlimited)

- **Dashboard**
  - Overview page with statistics and recent ads
  - Fixed sidebar with navigation and credits display
  - Responsive mobile menu with overlay

- **Ad Management**
  - Full CRUD operations for ads
  - Advanced filtering by status, platform
  - Search by title and description (debounced, 500ms)
  - Sorting by creation date, update date, title
  - Pagination (20 ads per page)
  - Compact card design (144px height)
  - Mark ads as published/sold
  - CSV export functionality

- **Image Storage**
  - Supabase Storage integration
  - Sharp image resizing (800px width, 85% quality)
  - Thumbnail generation and caching

### Changed
- **UI/UX Improvements**
  - Compact ad cards with optimized layout
  - Date moved to title row
  - Action buttons aligned with description bottom
  - Responsive design improvements
  - Loading screen with React Portal (z-9999)

- **Credits System**
  - Simplified from `creditsUsed` to `creditsAvailable`
  - Direct decrement instead of complex resets
  - Migration: 20260303_change_credits_to_available

### Removed
- Deprecated system prompts from lib/openai.ts
- Old plan files from docs/plans/
- Backup files (.env.local.bak)

### Documentation
- Updated CLAUDE.md with complete architecture
- Added authentication, database, storage sections
- Documented filtering, pagination, and search
- Added environment variables guide
