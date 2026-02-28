# UI Redesign: Dashboard Grid Layout

**Date:** 2026-02-28
**Status:** Approved
**Approach:** Dashboard Grid (Option A)

## Problem Statement

Current interface suffers from "visual noise" (cognitive load):
- Long vertical form with many radio buttons creates chaos
- User sees too much text and choices at once
- Form appears longer and harder to fill than it actually is
- CTA button positioned incorrectly (bottom-left under images instead of bottom-right after form completion)
- Mixed typography (serif + sans-serif) looks dated
- Insufficient whitespace between sections

## Solution: Dashboard Grid (2x2)

Desktop users see entire form at a glance without scrolling. Natural F/Z reading pattern. CTA button in most logical position (bottom-right).

---

## 1. Layout Architecture

### Desktop (≥1024px) - 2x2 Grid

```
┌────────────────────────────────────────────────┐
│          Header (full width)                   │
└────────────────────────────────────────────────┘
┌────────────────────────────────────────────────┐
│         Hero Section (title + description)     │
└────────────────────────────────────────────────┘
┌─────────────────────┬──────────────────────────┐
│  Card 1             │  Card 2                  │
│  PHOTOS             │  PLATFORM + TONE         │
│  (Dropzone)         │  (Tiles + Controls)      │
│  min-h-[400px]      │  min-h-[400px]           │
├─────────────────────┼──────────────────────────┤
│  Card 3             │  Card 4                  │
│  PARAMETERS         │  NOTES + CTA             │
│  (Name, Condition,  │  (Textarea +             │
│   Price, Delivery)  │   Generate button)       │
│  min-h-[500px]      │  min-h-[500px]           │
└─────────────────────┴──────────────────────────┘
```

**Grid properties:**
- `grid-cols-2` (equal proportions)
- `gap-6` (24px between cards)
- Card styling: `bg-card border border-border rounded-xl shadow-sm p-6`
- Hover: `hover:shadow-md transition-shadow`

### Mobile/Tablet (<1024px) - Vertical Stack

```
┌────────────────────┐
│ Header             │
├────────────────────┤
│ Hero Section       │
├────────────────────┤
│ PHOTOS             │
├────────────────────┤
│ PLATFORM + TONE    │
├────────────────────┤
│ PARAMETERS         │
├────────────────────┤
│ NOTES              │
├────────────────────┤
│ [GENERATE BUTTON]  │
└────────────────────┘
```

**Mobile properties:**
- `grid-cols-1` (single column)
- `gap-6` (same spacing)
- CTA button: full width at bottom of page

---

## 2. Card 1: Photos (Dropzone)

### Empty State
- Full card height utilized for dropzone
- Large upload icon: `h-12 w-12`
- Primary text: "Przeciągnij zdjęcia tutaj" (`text-xl`)
- Secondary text: "lub kliknij aby wybrać" (`text-base`)
- Info footer: "JPG, PNG, WEBP • do 8 zdjęć"

### With Photos
- Top section: Grid of thumbnails `grid-cols-3 sm:grid-cols-4 gap-3`
- Each thumbnail:
  - `aspect-square rounded-lg`
  - Hover: `scale-105`, shows overlay with number `#1` and remove button X
  - Border: `border-2 border-border hover:border-primary`
- Bottom section: "+" button to add more (if <8 photos)
- Counter: "3 z 8 zdjęć" + total file size

### Card header
- Icon: `<Camera />` + "Zdjęcia produktu"
- Styling: `text-lg font-semibold`

---

## 3. Card 2: Platform + Tone

### Platform Selection (Top)

**2x2 Grid of Clickable Tiles:**

```
┌──────────┬──────────┐
│   OLX    │ Allegro  │
│   🛍️     │   🏪     │
└──────────┴──────────┘
┌──────────┬──────────┐
│ Facebook │  Vinted  │
│   📱     │   👕     │
└──────────┴──────────┘
```

**Layout:**
- `grid-cols-2 gap-3`
- Each tile: `h-24` (96px height)
- Content: Icon on top, platform name below

**Icons (from lucide-react):**
- OLX: `<ShoppingBag />` (orange accent)
- Allegro: `<Store />` (green/blue accent)
- Facebook: `<Facebook />` (blue accent)
- Vinted: `<Shirt />` (fashion icon)

**States:**
- Not selected: `border-2 border-border bg-background`
- Hover: `hover:border-primary/50 hover:scale-[1.02] hover:shadow-sm`
- Selected: `border-2 border-primary bg-primary/10`
- Transitions: `transition-all duration-200`

**Accessibility:**
- `role="radio"`, `aria-checked`
- Keyboard: Space/Enter to activate
- Focus: `focus-visible:ring-2 focus-visible:ring-ring`

---

### Tone Style (Bottom)

**Horizontal Segmented Control:**

```
┌─────────────────────────────────────────────┐
│ [Profesjonalny] [Przyjazny] [Swobodny]     │
└─────────────────────────────────────────────┘
```

**Layout:**
- Container: `flex gap-1 bg-muted rounded-lg p-1`
- Each button: `flex-1 px-4 py-2 rounded-md text-sm font-medium`
- Selected: `bg-background shadow-sm text-foreground`
- Not selected: `bg-transparent text-muted-foreground hover:bg-background/50`
- Transitions: `transition-all duration-200`

**Description (shown below when selected):**
- Appears under segmented control with fade-in animation
- Shows full description + platform recommendation
- Example: "Formalny, rzeczowy, ekspertycki. ⭐ Polecany dla: Allegro Lokalnie"
- Styling: `text-sm text-muted-foreground mt-2 animate-fade-in`

**Options:**
1. **Profesjonalny** → "Formalny, rzeczowy, ekspertycki. ⭐ Polecany dla: Allegro Lokalnie"
2. **Przyjazny** → "Ciepły, pomocny, naturalny. ⭐ Polecany dla: Facebook Marketplace, Vinted"
3. **Swobodny** → "Luźny, potoczny, bezpośredni. ⭐ Polecany dla: OLX"

---

## 4. Card 3: Product Parameters

### Product Name (Top)
- Label: "Nazwa produktu" + `(opcjonalne)` in muted color
- Input: `text` type
- Placeholder: "np. iPhone 13 Pro, Krzesło IKEA…"
- Max length: 200 characters

---

### Product Condition - Horizontal Segmented Control

**4 buttons in single row (desktop):**

```
┌─────┬──────────┬──────────┬─────────────┐
│ Nowy│ Jak nowy │ Używany  │ Uszkodzony  │
└─────┴──────────┴──────────┴─────────────┘
```

**Labels (shortened for UI):**
- "nowy" → **"Nowy"**
- "idealny" → **"Jak nowy"**
- "używany, w dobrym stanie" → **"Używany"**
- "ślady używania, uszkodzony" → **"Uszkodzony"**

**Layout:**
- Same segmented control styling as Tone
- Desktop: Single row, 4 equal-width buttons
- Mobile: Vertical stack of radio buttons (for readability)

**Note:** Original values remain unchanged in form data, only UI labels are shortened.

---

### Price (Middle)

**3 radio buttons (vertical):**

1. **"AI zasugeruje cenę"** (default)
   - Description: "AI zaproponuje odpowiednią cenę na podstawie produktu"

2. **"Podaję swoją cenę"**
   - Description: "Wprowadź konkretną kwotę do ogłoszenia"
   - Shows input field when selected:
     - Type: `number`, inputMode: `decimal`
     - Max width: `max-w-[200px]`
     - Suffix: "PLN" (absolute positioned inside input)
     - Placeholder: "0.00"

3. **"Oddam za darmo"**
   - Description: "Produkt zostanie oznaczony jako darmowy"

**Styling:**
- Compact spacing: `space-y-3` between options
- Radio + description layout (vertical)
- Input appears with slide-down animation

---

### Delivery (Bottom)

**2 checkboxes (horizontal):**

```
☑ Odbiór osobisty   ☑ Wysyłka
```

**Layout:**
- `flex gap-4`
- Both checked by default
- At least one must be selected (validation)

**Validation:**
- If none selected: Red message "Wybierz przynajmniej jedną opcję"
- CTA button disabled until at least one selected

---

## 5. Card 4: Notes + CTA

### Additional Information (Textarea)

- Label: "Dodatkowe informacje" + `(opcjonalne)`
- Textarea: `min-h-[200px]` or `rows={8}`
- Placeholder: "np. uszkodzenia, braki, wymiary, historia produktu…"
- Max length: 1000 characters
- Character counter: "0/1000 znaków" (muted, bottom-right)

**Styling:**
- Textarea takes most of available card height
- Auto-grows if needed
- Scrollable if content exceeds height

---

### CTA Button (Sticky at Card Bottom)

**"Generuj ogłoszenie" button:**

**Position:**
- **Sticky to bottom of Card 4** - always visible when scrolling within card
- CSS: `sticky bottom-0` with `bg-card` backdrop

**Styling:**
- Width: `w-full` (full card width)
- Height: `h-14` (56px - larger than standard)
- Color: `bg-orange-500 hover:bg-orange-600` (vibrant orange)
- Text: `text-lg font-bold text-white`
- Icon: `<Send />` on left side
- Shadow: `shadow-md hover:shadow-lg`
- Transitions: `transition-all duration-200`
- Hover: `hover:scale-[1.02]`
- Active: `active:scale-[0.98]`

**States:**
- Enabled: Full opacity, interactive
- Disabled: `opacity-50 cursor-not-allowed` when:
  - No images uploaded
  - No delivery options selected
  - User-provided price selected but no value entered

**Mobile:**
- Not sticky on mobile (normal flow)
- Full width at bottom of page
- Same height and styling

---

## 6. Visual Design System

### Typography

**Changes:**
- ❌ Remove: `font-serif` from main title
- ✅ Use everywhere: `font-sans` (default Inter/system font stack)

**Hierarchy:**
- Main hero title: `text-4xl sm:text-5xl font-bold` (changed from `font-normal`)
- Card headers: `text-lg font-semibold`
- Section labels: `text-sm font-medium`
- Body text: `text-sm` or `text-base`
- Helper text: `text-xs text-muted-foreground`

---

### Cards (4 Quadrants)

```css
bg-card
border border-border
rounded-xl (12px)
shadow-sm
hover:shadow-md
p-6
transition-shadow duration-200
```

**Grid gap:** `gap-6` (24px between cards)

---

### Colors & Accents

**Primary Actions:**
- CTA Button: `bg-orange-500 hover:bg-orange-600` (vibrant orange)
- Selected states: `border-primary bg-primary/10`
- Hover states: `hover:border-primary/50`

**Form Controls:**
- Radio buttons/checkboxes: `accent-blue-600` (for visibility)
- Focus rings: `focus-visible:ring-2 focus-visible:ring-ring`

**Feedback:**
- Errors: `border-destructive text-destructive`
- Success: `border-green-500 text-green-600`
- Muted info: `text-muted-foreground`

---

### Spacing (Whitespace)

**Increased spacing for clarity:**
- Between form sections: `space-y-6` (increased from `space-y-4`)
- Between labels and inputs: `space-y-2`
- Card padding: `p-6`
- Grid gap: `gap-6`

**Segmented controls:**
- Container padding: `p-1`
- Button padding: `px-4 py-2`
- Gap between buttons: `gap-1`

---

### Animations & Transitions

**All interactive elements:**
- `transition-all duration-200`

**Hover effects:**
- Scale: `hover:scale-[1.02]`
- Shadow: `hover:shadow-md` or `hover:shadow-lg`

**Active effects:**
- Scale down: `active:scale-[0.98]`

**Fade-in animations:**
- Tone descriptions: `animate-fade-in` (custom or Tailwind animate)
- New content: `transition-opacity duration-200`

---

## 7. Interactions & Behavior

### Responsive Breakpoint
- Desktop 2x2 grid: `lg:grid-cols-2` (≥1024px)
- Mobile stack: `grid-cols-1` (<1024px)

### Platform → Tone Auto-select
- **Maintain current logic:** Changing platform auto-selects recommended tone
- User can override after platform change
- Tone description updates automatically

### Segmented Controls
- **Keyboard navigation:** Arrow keys to move between options
- **Focus states:** `focus-visible:ring-2 focus-visible:ring-ring`
- **Accessibility:** `role="radiogroup"`, `aria-checked`, `aria-label`

### Platform Tiles
- **Click:** Toggle selection (only one active)
- **Keyboard:** Space/Enter to activate, Tab to navigate
- **Visual feedback:**
  - Selected: `border-primary border-2 bg-primary/10`
  - Not selected: `border-border border-2`
  - Hover: `hover:border-primary/50 hover:shadow-sm`

### Form Validation (Real-time)
- **No images:** CTA disabled + tooltip "Dodaj zdjęcia"
- **No delivery:** Message under checkboxes, CTA disabled
- **User price empty:** CTA disabled when "Podaję swoją cenę" selected but no value
- **Error states:** `border-destructive` on problematic fields

### Loading States
- **During generation:** Fullscreen loading (unchanged)
- **Image compression:** Spinner in dropzone + "Przetwarzanie…" text
- **CTA during submit:** Loading spinner replaces Send icon

### Smooth Transitions
- **Platform/tone change:** `transition-opacity duration-200`
- **Card hover:** `transition-all duration-200`
- **Responsive resize:** Smooth grid reflow

---

## 8. Implementation Notes

### Component Structure

**Main page (`app/page.tsx`):**
```tsx
<div className="container mx-auto px-4 py-8">
  {/* Hero Section */}
  <section>
    <h1 className="font-sans text-4xl sm:text-5xl font-bold">
      Sprzedaj szybciej <span className="text-primary">z lepszym opisem</span>
    </h1>
  </section>

  {/* 2x2 Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
    {/* Card 1: Photos */}
    <Card>
      <UploadDropzone />
    </Card>

    {/* Card 2: Platform + Tone */}
    <Card>
      <PlatformSelector />
      <ToneSelector />
    </Card>

    {/* Card 3: Parameters */}
    <Card>
      <ProductParameters />
    </Card>

    {/* Card 4: Notes + CTA */}
    <Card>
      <NotesTextarea />
      <CTAButton /> {/* sticky bottom-0 */}
    </Card>
  </div>
</div>
```

### New Components to Create

1. **`PlatformSelector.tsx`**
   - 2x2 grid of clickable tiles
   - Platform icons + names
   - Single selection (radio behavior)

2. **`ToneSelector.tsx`**
   - Horizontal segmented control
   - 3 options with descriptions below when selected
   - Auto-select based on platform

3. **`ConditionSegmentedControl.tsx`**
   - 4-button segmented control (desktop)
   - Vertical radio buttons (mobile)
   - Shortened labels with full values in form data

4. **`Card.tsx` wrapper component**
   - Consistent styling for all 4 cards
   - Props: header text, icon, children

### Existing Components to Modify

1. **`ProductForm.tsx`**
   - Split into smaller components
   - Remove vertical radio button lists
   - Add segmented controls

2. **`UploadDropzone.tsx`**
   - Adjust grid to `grid-cols-3 sm:grid-cols-4`
   - Larger icons and text in empty state
   - Better hover effects

3. **`app/page.tsx`**
   - Change grid from `lg:grid-cols-[1.5fr_1fr]` to `lg:grid-cols-2`
   - Remove `font-serif` from title
   - Wrap sections in Card components
   - Move CTA button to Card 4 (sticky bottom)

### CSS/Tailwind Changes

**Add custom animation (if not in Tailwind config):**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}
```

---

## 9. Accessibility Compliance

### ARIA Labels
- All interactive tiles: `aria-label`, `role="radio"`
- Segmented controls: `role="radiogroup"`
- Form sections: `role="group"` with `aria-labelledby`

### Keyboard Navigation
- Tab order: logical flow through cards (1→2→3→4)
- Arrow keys: navigate within segmented controls
- Space/Enter: activate tiles and buttons
- Esc: close any open tooltips/modals

### Focus Management
- Visible focus rings: `focus-visible:ring-2`
- Skip to CTA: keyboard shortcut or skip link
- Maintain focus when platform changes tone

### Screen Reader Support
- All images: descriptive alt text
- Form labels: properly associated with inputs
- Error messages: `aria-live="polite"`
- Loading states: `aria-busy="true"`

---

## 10. Performance Considerations

### Bundle Size
- Platform icons from lucide-react (tree-shaken)
- No external logo assets needed
- Existing dynamic imports maintained (`FullscreenLoading`, `AdResult`)

### Rendering
- Cards use `bg-card` (CSS variable) - instant theme switch
- Segmented controls: pure CSS, no JS state for styling
- Minimal re-renders: form state remains same structure

### Images
- Existing compression logic maintained
- Grid thumbnails: lazy loading with `loading="lazy"`
- Preview generation: debounced

---

## Success Metrics

**User Experience:**
- ✅ Entire form visible at desktop glance (no scrolling)
- ✅ CTA button in expected position (bottom-right after completion)
- ✅ Reduced visual noise (segmented controls vs long radio lists)
- ✅ Faster platform recognition (icons vs text)
- ✅ Modern, cohesive design (unified typography)

**Technical:**
- ✅ Maintains existing form logic and validation
- ✅ No performance regression
- ✅ Accessibility standards met (WCAG 2.1 AA)
- ✅ Responsive on all devices

**Design:**
- ✅ Professional, modern aesthetic
- ✅ Clear visual hierarchy
- ✅ Consistent spacing and rhythm
- ✅ Strong call-to-action

---

## Next Steps

1. **Implementation plan:** Create detailed step-by-step implementation plan using `writing-plans` skill
2. **Component development:** Build new components (PlatformSelector, ToneSelector, etc.)
3. **Layout restructuring:** Implement 2x2 grid in main page
4. **Visual polish:** Apply new typography and styling system
5. **Testing:** Verify responsive behavior and accessibility
6. **User feedback:** Gather impressions on new layout

---

**Design approved by:** User
**Ready for implementation:** Yes
**Next skill to invoke:** `writing-plans`
