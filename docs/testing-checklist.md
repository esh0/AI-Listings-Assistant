# Testing Checklist - Authentication & Dashboard

## Prerequisites
- [ ] `.env.local` configured with all required variables
- [ ] Database migrated: `npx prisma db push`
- [ ] Supabase storage bucket `ad-images` created (public access)
- [ ] Google OAuth credentials configured with correct redirect URIs

---

## 1. Authentication Flow

### Sign In
- [ ] Visit `/auth/signin` - page displays correctly
- [ ] Click "Kontynuuj z Google" - redirects to Google OAuth
- [ ] Complete Google sign-in - redirects back to app
- [ ] Check database - User record created with correct plan (FREE by default)
- [ ] Check session - User appears in sidebar with name, email, image

### Sign Out
- [ ] Click "Wyloguj się" in sidebar - redirects to home page
- [ ] Try accessing `/dashboard` - redirects to `/auth/signin`

### Protected Routes
- [ ] Access `/dashboard` without login - redirects to signin
- [ ] Access `/dashboard/templates` without login - redirects to signin
- [ ] Access `/dashboard/ads` without login - redirects to signin

---

## 2. Credits System

### FREE Plan Limits
- [ ] New user starts with 0 creditsUsed, 3 remaining
- [ ] Generate 1st ad - succeeds, creditsUsed = 1
- [ ] Generate 2nd ad - succeeds, creditsUsed = 2
- [ ] Generate 3rd ad - succeeds, creditsUsed = 3
- [ ] Try 4th ad - fails with "No credits remaining" error
- [ ] Check sidebar - credits display shows 0/3

### Credits Reset (30-day cycle)
- [ ] Manually set `creditsReset` in database to 31+ days ago
- [ ] Generate ad - should succeed and reset creditsUsed to 1
- [ ] Check `creditsReset` - updated to current date

### PREMIUM Plan
- [ ] Manually set user plan to PREMIUM in database
- [ ] Generate multiple ads - all succeed without limit
- [ ] Check sidebar - credits display shows ∞

---

## 3. Soft-Wall Flow (Unauthenticated Users)

### First-Time User
- [ ] Visit home page (not logged in)
- [ ] Upload images and fill form
- [ ] Click "Generuj ogłoszenie"
- [ ] Result displays after loading
- [ ] **1.5 seconds later** - SoftWallModal appears
- [ ] Modal shows benefits, "Zaloguj się i zapisz" button

### Save Pending Ad
- [ ] Click "Zaloguj się i zapisz" in modal
- [ ] Check browser IndexedDB - `marketplace-assistant:pending-ad` exists
- [ ] Redirects to `/auth/signin?callbackUrl=/dashboard`
- [ ] Complete Google sign-in
- [ ] Redirects to dashboard
- [ ] Success alert appears: "Ogłoszenie zostało zapisane w Twoim panelu!"
- [ ] Check IndexedDB - pending ad cleared
- [ ] Check database - Ad saved with DRAFT status
- [ ] Recent ads list shows the saved ad

### Continue Without Saving
- [ ] Generate ad (not logged in)
- [ ] Wait for modal to appear
- [ ] Click "Kontynuuj bez zapisywania"
- [ ] Modal closes, result still visible
- [ ] No ad saved to database

---

## 4. Dashboard - Main Page

### Stats Cards
- [ ] Create ads with different statuses (DRAFT, PUBLISHED, SOLD)
- [ ] Stats cards show correct counts:
  - Total ads
  - Drafts
  - Published
  - Sold

### Recent Ads List
- [ ] Shows last 5 ads in reverse chronological order
- [ ] Each card displays:
  - Thumbnail image
  - Title (truncated if long)
  - Platform badge
  - Status badge
  - Price (min-max range or sold price)
  - Created date
- [ ] Click "View" (eye icon) - navigates to ad detail (placeholder)
- [ ] Empty state - shows "Nie masz jeszcze żadnych ogłoszeń" with CTA

### Navigation
- [ ] Click "Nowe ogłoszenie" - redirects to home page
- [ ] Sidebar active state highlights "Pulpit"

---

## 5. Dashboard - Templates Page

### Create Template
- [ ] Navigate to `/dashboard/templates`
- [ ] Fill form: name, platform, tone, condition
- [ ] Click "Utwórz szablon"
- [ ] Success - template appears in list
- [ ] Try duplicate name - error: "Template with this name already exists"
- [ ] Leave name empty - error: "Nazwa szablonu jest wymagana"

### Template List
- [ ] Templates sorted by: isDefault DESC, createdAt DESC
- [ ] Each card shows:
  - Name
  - Platform badge
  - Tone badge
  - Condition text
  - Star icon if default
  - Set default button (if not default)
  - Delete button

### Set Default
- [ ] Click star button on non-default template
- [ ] Template gets star icon
- [ ] Previous default loses star
- [ ] Check database - only one template has isDefault = true

### Delete Template
- [ ] Click trash button
- [ ] Confirmation dialog appears
- [ ] Confirm - template removed from list
- [ ] Check database - template deleted

---

## 6. Ads Management

### Generate Ad (Logged In)
- [ ] Upload images, fill form, generate ad
- [ ] Result displays
- [ ] Check database - Ad saved with DRAFT status
- [ ] `images` field contains ImageAnalysis array (base64 URLs initially)
- [ ] Background job runs - images uploaded to Supabase Storage
- [ ] After ~5-10 seconds - check database again
- [ ] `images` field updated with Supabase public URLs

### View Ad (via AdCard)
- [ ] Click "View" button on ad card
- [ ] (Currently navigates to placeholder - implementation pending)

### Edit Parameters (via API)
- [ ] Use PATCH `/api/ads/[id]` with updated title/description
- [ ] Check database - changes reflected
- [ ] Try updating soldPrice without status=SOLD - succeeds
- [ ] Try status=SOLD without soldPrice - error: "soldPrice is required"

### Delete Ad
- [ ] Click trash button on ad card
- [ ] Confirmation dialog appears
- [ ] Confirm - ad removed from list
- [ ] Check database - ad deleted
- [ ] Check Supabase Storage - images deleted from bucket

---

## 7. CSV Export

### Export All Ads
- [ ] Navigate to dashboard
- [ ] Use endpoint: GET `/api/ads/export`
- [ ] CSV file downloads
- [ ] Open in Excel/Google Sheets
- [ ] Polish characters display correctly (UTF-8 BOM)
- [ ] Columns: ID, Platforma, Tytuł, Opis, Status, Cena Min, Cena Max, Cena Sprzedaży, Stan, Ton, Dostawa, Data utworzenia, Data aktualizacji
- [ ] All user's ads included

### Filter by Status
- [ ] GET `/api/ads/export?status=SOLD`
- [ ] CSV contains only SOLD ads
- [ ] GET `/api/ads/export?status=DRAFT`
- [ ] CSV contains only DRAFT ads

---

## 8. Image Upload (Background Jobs)

### Successful Upload
- [ ] Generate ad while logged in
- [ ] Check network tab - API response returns quickly
- [ ] Check database immediately - images contain base64 data
- [ ] Wait 10 seconds
- [ ] Check database again - images updated with Supabase URLs
- [ ] Visit Supabase Storage bucket - images visible at `{userId}/{adId}/image-*.jpg`

### Upload Failure (Edge Case)
- [ ] Temporarily break Supabase credentials
- [ ] Generate ad
- [ ] API returns successfully (user not blocked)
- [ ] Check console logs - background error logged
- [ ] Images remain as base64 in database

---

## 9. Edge Cases & Error Handling

### No Credits
- [ ] FREE user with 3 creditsUsed
- [ ] Try to generate ad
- [ ] Error: "No credits remaining. Upgrade to Premium for unlimited ads."
- [ ] No ad created in database

### Invalid Platform (API)
- [ ] POST `/api/templates` with invalid platform
- [ ] Error 400: "Invalid platform value"

### Unauthorized Access
- [ ] Log out
- [ ] Try GET `/api/ads` - Error 401: "Unauthorized"
- [ ] Try POST `/api/templates` - Error 401: "Unauthorized"

### Ownership Validation
- [ ] User A creates ad
- [ ] User B tries to delete User A's ad via API
- [ ] Error 404: "Ad not found" (ownership check prevents access)

---

## 10. UI/UX Polish

### Dark Mode
- [ ] Toggle theme in header
- [ ] All components render correctly in dark mode
- [ ] Modal overlays are visible (black/70 opacity)
- [ ] Colors have proper contrast

### Responsive Design
- [ ] Test on mobile (< 640px)
  - Sidebar becomes overlay with hamburger menu
  - Stats cards stack vertically (1 column)
  - AdCard layout stacks vertically
- [ ] Test on tablet (640-1024px)
  - Stats cards show 2 columns
  - Sidebar still overlay
- [ ] Test on desktop (≥1024px)
  - Sidebar fixed on left
  - Stats cards show 4 columns
  - Full layout visible

### Loading States
- [ ] Generate ad - FullscreenLoading component shows
- [ ] Progress bar animates
- [ ] Platform-specific messages rotate
- [ ] Can't submit form during loading

---

## 11. Prisma & Database

### Schema Validation
- [ ] Run `npx prisma validate` - no errors
- [ ] Run `npx prisma format` - schema properly formatted

### Migrations
- [ ] Run `npx prisma db push` - tables created
- [ ] Check Supabase dashboard - all tables exist:
  - User, Account, Session, VerificationToken
  - Ad, Template
- [ ] Enums created: Plan, AdStatus, Platform, ToneStyle, ProductCondition

### Indexes
- [ ] Check Ad table indexes:
  - `userId_createdAt` (DESC)
  - `userId_status`
- [ ] Check Template table indexes:
  - `userId_isDefault`

---

## 12. Security Checklist

- [ ] `.env.local` not committed to git
- [ ] API routes validate user ownership (userId in WHERE clauses)
- [ ] Protected routes redirect to signin
- [ ] No sensitive data exposed in API responses
- [ ] Prisma queries use parameterized inputs (no SQL injection)

---

## Expected Behaviors Summary

| Action | Expected Result |
|--------|----------------|
| Generate ad (no login) | Result shown + SoftWall modal after 1.5s |
| Generate ad (logged in, FREE, credits available) | Result shown + saved to DB + images uploaded async |
| Generate ad (logged in, FREE, no credits) | Error: "No credits remaining" |
| Generate ad (logged in, PREMIUM) | Always succeeds, unlimited |
| Sign in after pending ad | Dashboard shows success alert, ad saved |
| Create duplicate template name | Error: "Template with this name already exists" |
| Delete ad | Ad removed from DB + images deleted from storage |
| Set template as default | Only one template has isDefault = true |
| Export CSV | All ads exported with Polish characters intact |

---

## Known Issues / Future Work

- **ProductCondition enum mismatch**: Prisma uses underscores (`uzywany_jak_nowy`), app types use spaces/commas (`"używany, jak nowy"`). Currently handled with local mappings in templates page. Consider normalizing across entire app.
- **Ad detail page**: AdCard "View" button currently redirects to placeholder. Full ad detail page not implemented.
- **Ads list page**: Full `/dashboard/ads` page with filtering, pagination, bulk actions not implemented.
