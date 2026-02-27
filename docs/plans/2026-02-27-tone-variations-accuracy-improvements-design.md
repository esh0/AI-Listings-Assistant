# Design: Tone Variations & AI Accuracy Improvements

**Date**: 2026-02-27
**Status**: Approved
**Approach**: Modular Prompt Architecture

## Overview

This design adds tone/style variations to generated listings (Professional, Friendly, Casual) with intelligent platform-specific defaults, while significantly improving AI accuracy to prevent hallucination and ensure proper handling of user-provided information.

## Goals

1. **Better quality listings** - More engaging, persuasive copy with selectable tone styles
2. **Platform differentiation** - Listings feel native to each marketplace's culture
3. **Improved accuracy** - Reduce AI hallucination, proper fact vs inference separation
4. **Free listing support** - Handle "Za darmo" (free) items appropriately

## Design Decisions

### Tone System
- **3 tone options**: Professional, Friendly, Casual
- **Hybrid generation mode**:
  - Default: Generate smart default tone only (fast, cheap)
  - Optional: "Generate all 3 variants" checkbox for comparison
- **Platform defaults**:
  - OLX → Casual
  - Allegro Lokalnie → Professional
  - Facebook Marketplace → Friendly
  - Vinted → Friendly

### Accuracy Improvements
- **Information hierarchy**: User data > Visible facts > AI inference
- **Uncertainty language system**: 3 levels of confidence phrasing
- **Forbidden phrases list**: Prevents definitive claims without evidence
- **Chain-of-thought analysis**: AI internally separates facts from assumptions

### Price Handling
- **3 price modes**:
  - User-provided price
  - AI-suggested price (with reasoning)
  - Free listing ("Za darmo")

## Data Model Changes

### Request Types

```typescript
export type ToneStyle = "professional" | "friendly" | "casual";
export type PriceType = "user_provided" | "ai_suggest" | "free";

export interface GenerateAdRequest {
  platform: Platform;
  productName?: string;
  condition: string;
  priceType: PriceType;        // NEW
  price?: string;               // Optional based on priceType
  delivery: string;
  notes?: string;
  images: ImageData[];
  tone: ToneStyle;              // NEW
  generateAllTones: boolean;    // NEW
}
```

### Response Types

```typescript
export interface ToneVariant {
  tone: ToneStyle;
  title: string;
  description: string;
}

export interface GenerateAdResponse {
  isValid: boolean;
  error?: string;

  // Single tone mode (generateAllTones = false):
  title?: string;
  description?: string;

  // Multi-tone mode (generateAllTones = true):
  toneVariants?: ToneVariant[];

  // Common fields:
  price?: {
    min: number;
    max: number;
    reason: string;
  } | null;
  isFree?: boolean;             // NEW
  images: ImageAnalysis[];
  confidence?: {                // NEW
    productIdentification: "high" | "medium" | "low";
    specifications: "high" | "medium" | "low";
  };
}
```

## UI Changes

### ProductForm.tsx

**New fields:**

1. **Tone selector** (after platform selection):
   ```
   Styl ogłoszenia:
   ○ Profesjonalny - Formalny, rzeczowy, ekspertycki
   ○ Przyjazny - Ciepły, pomocny, naturalny (Domyślny)
   ○ Swobodny - Luźny, potoczny, bezpośredni

   [✓] Generuj wszystkie 3 warianty do porównania
   ```
   Default tone pre-selected based on platform.

2. **Price type selector** (replace current price field):
   ```
   Cena:
   ○ Sugeruj cenę (AI zaproponuje)
   ○ Moja cena: [_____ zł]
   ○ Za darmo 🎁
   ```

### AdResult.tsx

**Display logic:**

- **Single tone mode**: Display as current (title + description with copy buttons)
- **Multi-tone mode**:
  - Tabs or card switcher to toggle between 3 variants
  - Each variant shows tone name (e.g., "Styl: Przyjazny")
  - Copy buttons work per variant
  - Price/images section shared across all tones

- **Free listings**: Show "Za darmo" badge, hide price suggestion section

## Prompt Architecture

### System Prompt Structure

The system prompt will be reorganized into modular sections:

```
1. ROLE & OUTPUT FORMAT
2. INFORMATION HIERARCHY (user data = truth)
3. CRITICAL RULES: FACTS vs INFERENCE
4. UNCERTAINTY LANGUAGE GUIDE
5. FORBIDDEN PHRASES LIST
6. PRICE HANDLING (user/AI/free)
7. GENERAL CONTENT GUIDELINES
8. ANALYSIS WORKFLOW (chain-of-thought)
9. TONE-SPECIFIC STYLE INJECTION (dynamic)
10. JSON SCHEMA
```

### Key Prompt Sections

#### Information Hierarchy
```markdown
## HIERARCHIA INFORMACJI

1. DANE OD UŻYTKOWNIKA = PRAWDA ABSOLUTNA
   - Traktuj jako pewne i wiarygodne
   - NIE dodawaj "prawdopodobnie" do danych użytkownika
   - Przykład: Użytkownik "nowy" → pisz "fabrycznie nowy"

2. FAKTY WIDOCZNE NA ZDJĘCIACH
   - Logo, metki, uszkodzenia
   - Opisuj pewnie i kategorycznie

3. WNIOSKI Z ANALIZY OBRAZU
   - Model, specyfikacja niewidoczna
   - Stosuj język niepewności
```

#### Uncertainty Language
```markdown
## JĘZYK NIEPEWNOŚCI

Poziom 1 - Wysokie prawdopodobieństwo:
"wygląda na [X]", "prawdopodobnie [X]", "wydaje się być [X]"

Poziom 2 - Średnie prawdopodobieństwo:
"może być [X]", "przypomina [X]", "podobny do [X]"

Poziom 3 - Niska pewność:
"trudno określić", "szczegóły do uzupełnienia"

PRZYKŁADY:
❌ ZŁE: "iPhone 13 Pro Max 256GB" (gdy nie podano)
✓ DOBRE: "Smartfon iPhone, wygląda na model z serii 13"
```

#### Forbidden Phrases
```markdown
## ZAKAZANE SFORMUŁOWANIA (bez dowodów/potwierdzenia):

- "fabrycznie nowy" (chyba że user podał lub metka widoczna)
- "nigdy nie używany", "nieużywany"
- "gwarancja producenta" (bez paragonu/karty)
- "oryginalny" (bez certyfikatu)
- "[konkretny rok] model" (bez metki)
- "[dokładna pojemność]GB/TB" (bez specyfikacji)
- "pełna funkcjonalność" (nieweryfikowalne)
```

#### Price Handling
```markdown
## OBSŁUGA CENY

JEŚLI priceType="free":
- NIE sugeruj ceny
- Użyj fraz: "Oddaję za darmo", "Za free", "Bezpłatnie"
- Podkreśl wartość mimo darmowości
- Wymień powód oddawania
- NIE wspominaj o lokalizacji/dostawie
- Zwróć: isFree: true, price: null

JEŚLI priceType="user_provided":
- UŻYJ tej ceny w opisie jeśli pasuje
- Możesz dodać "cena do negocjacji"
- Zwróć: price: null

JEŚLI priceType="ai_suggest":
- Zaproponuj przedział min-max
- Dodaj uzasadnienie (2-3 zdania)
- Zwróć: price: { min, max, reason }
```

#### Dynamic Tone Injection

Injected based on `tone` parameter:

**Professional:**
```markdown
- Ton formalny, rzeczowy, ekspertycki
- Pełne zdania, poprawna składnia
- Terminologia techniczna dozwolona
- Unikaj skrótów potocznych
- Przykłady: "Oferuję do sprzedaży...", "Zapraszam do kontaktu"
```

**Friendly:**
```markdown
- Ton ciepły, pomocny, bezpośredni
- Zdania średniej długości
- Balans formalny-potoczny
- Emoji dozwolone (1-2)
- Przykłady: "Sprzedam fajny...", "Pytania? Napisz śmiało!"
```

**Casual:**
```markdown
- Ton luźny, potoczny, naturalny
- Krótkie zdania
- Język codzienny, slang OK
- Emoji mile widziane (2-3)
- Przykłady: "Mam do oddania...", "Gadaj jak coś!"
```

## Platform Rules Updates

Each `lib/rules/*.md` file will be restructured to include:

```markdown
# ZASADY [PLATFORM]

## DOMYŚLNY TON
[professional/friendly/casual]

## TON: PROFESSIONAL
### Frazowanie
- [platform-specific examples]

## TON: FRIENDLY
### Frazowanie
- [platform-specific examples]

## TON: CASUAL
### Frazowanie
- [platform-specific examples]

## ZA DARMO na [PLATFORM]
- [platform-specific free listing guidelines]

## [Rest of existing rules...]
```

### Tone-Specific Vocabulary Guide

| Context | Professional | Friendly | Casual |
|---------|-------------|----------|---------|
| Opening | "Oferuję do sprzedaży" | "Sprzedam" | "Mam do oddania" |
| Condition | "W doskonałym stanie" | "Bardzo dobry stan" | "Mega stan" |
| Contact | "Zapraszam do kontaktu" | "Pisz śmiało!" | "Gadaj!" |
| Questions | "W razie pytań..." | "Masz pytania? Napisz!" | "Pytania? Pisz!" |
| Negotiation | "Cena do negocjacji" | "Cena do dogadania" | "Cena do gada" |

## Implementation Scope

### Files to Modify

1. **Type definitions**: `lib/types.ts`
2. **Validation schemas**: `lib/schemas.ts`
3. **OpenAI logic**: `lib/openai.ts` (major refactor)
4. **Platform rules**: `lib/rules/*.md` (all 4 files)
5. **Form component**: `components/ProductForm.tsx`
6. **Results component**: `components/AdResult.tsx`
7. **API route**: `app/api/generate-ad/route.ts`

### Testing Strategy

1. **Single tone mode** with each tone option
2. **Multi-tone mode** generating all 3 variants
3. **Price types**: user-provided, AI-suggest, free
4. **Accuracy**: Test with/without user data to verify fact vs inference
5. **Platform defaults**: Verify correct default tone per platform
6. **Edge cases**: Empty images, unclear photos, conflicting data

## Success Criteria

- [ ] Users can select tone style with platform-appropriate defaults
- [ ] "Generate all tones" option produces 3 distinct, platform-native variants
- [ ] AI never invents specifications when user hasn't provided them
- [ ] AI uses uncertainty language appropriately for inferred details
- [ ] User-provided data always takes precedence (no "probably" added)
- [ ] Free listings display correctly without price suggestions
- [ ] Each platform's generated content feels authentic to that marketplace
- [ ] Multi-tone UI allows easy comparison and copying

## Future Enhancements (Out of Scope)

- A/B testing to measure which tones convert better per platform
- User feedback mechanism to train tone preferences
- "Custom tone" allowing user-defined style parameters
- Tone suggestions based on product category
- Integration with marketplace APIs for direct posting

## Trade-offs & Risks

**Accepted:**
- Longer prompts (but within o4-mini context limits)
- 3x API cost for multi-tone mode (optional, user choice)
- More complex prompt maintenance (mitigated by modular structure)

**Mitigated:**
- Prompt becoming too prescriptive → Use examples, not rigid rules
- Tone variations feeling artificial → Platform research ensures authenticity
- Performance degradation → Hybrid mode keeps default fast
