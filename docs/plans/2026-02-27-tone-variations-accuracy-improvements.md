# Tone Variations & AI Accuracy Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add selectable tone styles (Professional/Friendly/Casual) with platform defaults, improve AI accuracy to prevent hallucination, and support free listings.

**Architecture:** Modular prompt system with dynamic tone injection, information hierarchy (user data > facts > inference), and hybrid generation mode (single tone or all 3 variants).

**Tech Stack:** Next.js 15, TypeScript, OpenAI o4-mini, Zod validation

---

## Task 1: Update Type Definitions

**Files:**
- Modify: `lib/types.ts:1-50`

**Step 1: Add new type definitions**

Add after existing Platform type:

```typescript
// Tone style for generated listings
export type ToneStyle = "professional" | "friendly" | "casual";

// Price handling modes
export type PriceType = "user_provided" | "ai_suggest" | "free";

// Tone variant structure for multi-tone responses
export interface ToneVariant {
  tone: ToneStyle;
  title: string;
  description: string;
}
```

**Step 2: Update GenerateAdRequest interface**

Replace existing price field with priceType + optional price:

```typescript
export interface GenerateAdRequest {
  platform: Platform;
  productName?: string;
  condition: string;
  priceType: PriceType;        // NEW
  price?: string;               // CHANGED: now optional
  delivery: string;
  notes?: string;
  images: ImageData[];
  tone: ToneStyle;              // NEW
  generateAllTones: boolean;    // NEW
}
```

**Step 3: Update GenerateAdResponse interface**

Update to support both single and multi-tone modes:

```typescript
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

**Step 4: Add platform default tone mapping**

Add constant at the end of file:

```typescript
// Platform-specific default tone styles
export const PLATFORM_DEFAULT_TONES: Record<Platform, ToneStyle> = {
  olx: "casual",
  allegro_lokalnie: "professional",
  facebook_marketplace: "friendly",
  vinted: "friendly",
};

// Tone style display names
export const TONE_STYLE_NAMES: Record<ToneStyle, string> = {
  professional: "Profesjonalny",
  friendly: "Przyjazny",
  casual: "Swobodny",
};

// Tone style descriptions
export const TONE_STYLE_DESCRIPTIONS: Record<ToneStyle, string> = {
  professional: "Formalny, rzeczowy, ekspertycki",
  friendly: "Ciepły, pomocny, naturalny",
  casual: "Luźny, potoczny, bezpośredni",
};
```

**Step 5: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add tone style and price type definitions"
```

---

## Task 2: Update Validation Schemas

**Files:**
- Modify: `lib/schemas.ts:1-50`

**Step 1: Read current schema**

Review existing validation in `lib/schemas.ts`.

**Step 2: Add tone and price type schemas**

Add new Zod schemas:

```typescript
import { z } from "zod";

export const ToneStyleSchema = z.enum(["professional", "friendly", "casual"]);
export const PriceTypeSchema = z.enum(["user_provided", "ai_suggest", "free"]);
```

**Step 3: Update GenerateAdRequestSchema**

Update the request schema to include new fields:

```typescript
export const GenerateAdRequestSchema = z.object({
  platform: z.enum(["olx", "allegro_lokalnie", "facebook_marketplace", "vinted"]),
  productName: z.string().optional(),
  condition: z.string().min(1),
  priceType: PriceTypeSchema,                    // NEW
  price: z.string().optional(),                   // CHANGED: now optional
  delivery: z.string().min(1),
  notes: z.string().optional(),
  images: z.array(z.object({
    filename: z.string(),
    mimeType: z.string(),
    base64: z.string(),
  })).min(1).max(8),
  tone: ToneStyleSchema,                          // NEW
  generateAllTones: z.boolean(),                  // NEW
}).refine(
  (data) => {
    // If priceType is "user_provided", price must be provided
    if (data.priceType === "user_provided") {
      return !!data.price && data.price.trim().length > 0;
    }
    return true;
  },
  {
    message: "Cena jest wymagana gdy wybrano 'Moja cena'",
    path: ["price"],
  }
);
```

**Step 4: Commit**

```bash
git add lib/schemas.ts
git commit -m "feat: add validation schemas for tone and price types"
```

---

## Task 3: Refactor OpenAI System Prompt

**Files:**
- Modify: `lib/openai.ts:53-115`

**Step 1: Create modular prompt constants**

Replace existing SYSTEM_PROMPT constant with modular structure:

```typescript
// Module 1: Information Hierarchy
const PROMPT_INFORMATION_HIERARCHY = `## HIERARCHIA INFORMACJI (od najważniejszej):

1. **DANE OD UŻYTKOWNIKA = PRAWDA ABSOLUTNA**
   - Jeśli użytkownik podał: stan, nazwę produktu, cenę, datę zakupu → UŻYJ TEGO
   - Traktuj informacje użytkownika jako pewne i wiarygodne
   - NIE kwestionuj, NIE dodawaj "prawdopodobnie" do danych użytkownika
   - Przykład: Użytkownik pisze "nowy" → pisz "nowy", "fabrycznie nowy", "nieużywany"

2. **FAKTY WIDOCZNE NA ZDJĘCIACH**
   - Logo, metki, widoczne uszkodzenia
   - Możesz opisywać pewnie i kategorycznie

3. **WNIOSKI Z ANALIZY OBRAZU**
   - Model, specyfikacja niewidoczna
   - Tutaj stosuj język niepewności

ZASADA: Dane użytkownika NADPISUJĄ wszystko inne. Nie weryfikuj ich ze zdjęciami.`;

// Module 2: Facts vs Inference
const PROMPT_FACTS_VS_INFERENCE = `## KRYTYCZNE: FAKTY vs DOMYSŁY

ZAWSZE MOŻESZ NAPISAĆ PEWNIE:
✓ Wszystko co użytkownik podał w formularzu (stan, nazwa, cena, notatki)
✓ Widoczne cechy: kolor, kształt, widoczne logo
✓ Stan wizualny: rysy, uszkodzenia, zużycie
✓ Zawartość zdjęcia: akcesoria, opakowanie

UŻYWAJ JĘZYKA NIEPEWNOŚCI tylko dla:
✗ Dokładny model jeśli nie ma metki/logo I użytkownik nie podał
✗ Pojemność, waga, wymiary jeśli niewidoczne I użytkownik nie podał
✗ Parametry techniczne I użytkownik nie podał
✗ Gwarancja, oryginalność (chyba że użytkownik potwierdził)`;

// Module 3: Uncertainty Language
const PROMPT_UNCERTAINTY_LANGUAGE = `## JĘZYK NIEPEWNOŚCI - UŻYWAJ tylko gdy użytkownik NIE podał informacji:

Poziom 1 - Wysokie prawdopodobieństwo:
"wygląda na [X]", "prawdopodobnie [X]", "wydaje się być [X]"

Poziom 2 - Średnie prawdopodobieństwo:
"może być [X]", "przypomina [X]", "podobny do [X]"

Poziom 3 - Niska pewność:
"trudno określić", "bez dodatkowych informacji", "szczegóły do uzupełnienia"

PRZYKŁADY:
Użytkownik podał "iPhone 13 Pro Max 256GB":
✓ DOBRE: "iPhone 13 Pro Max 256GB" (użyj dokładnie jak podano)

Użytkownik NIE podał modelu, widać tylko logo Apple:
✓ DOBRE: "Smartfon iPhone, wygląda na model z serii 13"

Użytkownik zaznaczył "nowy" w stanie:
✓ DOBRE: "fabrycznie nowy", "nieużywany", "w idealnym stanie"`;

// Module 4: Forbidden Phrases
const PROMPT_FORBIDDEN_PHRASES = `## ZAKAZANE SFORMUŁOWANIA (nigdy nie pisz bez potwierdzenia):

Definitywne twierdzenia bez dowodów:
- "fabrycznie nowy" (chyba że użytkownik podał lub widoczna metka)
- "nigdy nie używany", "nieużywany" (chyba że użytkownik potwierdził)
- "gwarancja producenta" (chyba że paragon/karta widoczne lub użytkownik podał)
- "oryginalny" (bez certyfikatu lub potwierdzenia użytkownika)
- "[konkretny rok] model" (bez metki lub informacji od użytkownika)
- "[dokładna pojemność]GB/TB" (bez specyfikacji lub informacji od użytkownika)
- "pełna funkcjonalność", "wszystko działa" (nieweryfikowalne ze zdjęć)`;

// Module 5: Price Handling
const PROMPT_PRICE_HANDLING = `## OBSŁUGA CENY

JEŚLI priceType="free":
- NIE sugeruj ceny w złotych
- W opisie użyj fraz dopasowanych do tonu (patrz sekcja TON poniżej)
- Podkreśl wartość przedmiotu mimo darmowości
- Wymień powód oddawania jeśli pasuje (przeprowadzka, upgrade, brak miejsca)
- Zachęć do szybkiego kontaktu
- NIE wspominaj o lokalizacji, sposobie odbioru, wysyłce
- Zwróć: isFree: true, price: null

JEŚLI priceType="user_provided":
- Użytkownik podał cenę - możesz ją wspomnieć w opisie jeśli pasuje do kontekstu
- Możesz dodać "cena do negocjacji" w stylu dopasowanym do tonu
- NIE wspominaj o sposobie płatności, dostawy
- Zwróć: price: null (użytkownik zna swoją cenę)

JEŚLI priceType="ai_suggest":
- Przeanalizuj produkt, stan, platformę, rynek
- Zaproponuj realistyczny przedział (min-max) w złotych
- Dodaj 2-3 zdaniowe uzasadnienie (stan, marka, konkurencja)
- NIE włączaj informacji o cenie do tytułu/opisu
- Zwróć: price: { min, max, reason }`;

// Module 6: General Guidelines (keep existing relevant parts)
const PROMPT_GENERAL_GUIDELINES = `## ZASADY OGÓLNE:
- Nie wymyślaj danych nieobecnych na zdjęciach ani niepodanych przez użytkownika
- Styl dopasuj do stanu produktu i platformy
- Styl ogłoszenia ma być spójny z platformą sprzedażową i wybranym TONEM
- Ilość słów dopasowana do przedmiotu (ubranie < elektronika < samochód)
- NIE wspominaj o lokalizacji, sposobie odbioru, wysyłce - użytkownik doda to ręcznie

## ZALECENIA DOTYCZĄCE TYTUŁÓW:
- Tytuły zwięzłe, znaczące, krótsze niż opis
- Poprawna pisownia, gramatyka, odstępy
- Format właściwy dla tytułów (każde słowo wielką literą dla niektórych platform)
- Cyfry zamiast słów: "2" nie "dwa"
- BEZ wiadomości promocyjnych: "Wyprzedaż", "Darmowa dostawa"
- BEZ subiektywnych komentarzy: "Hit", "Bestseller", "Świetny prezent"

## ZALECENIA DOTYCZĄCE OPISÓW:
- Opis dłuższy niż tytuł
- Unikalne cechy produktu i przydatne informacje
- Zwięzłość i czytelność
- Nie za dużo znaków interpunkcyjnych
- Tylko informacje o produkcie

## ETAPY ANALIZY (realizuj wewnętrznie):
1. Przeanalizuj dane od użytkownika - to są FAKTY
2. Rozpoznaj produkt ze zdjęć (marka, model/seria jeśli pewne, typ, kolor, akcesoria)
3. Oceń jakość każdego zdjęcia; zaproponuj konkretne poprawki
4. Zbuduj tytuł z kluczowymi frazami w stylu wybranego TONU
5. Stwórz opis w stylu TONU: wprowadzenie, specyfikacja (tylko dane pewne!), stan, CTA
6. Zachowaj spójność i rzetelność informacji`;
```

**Step 2: Commit prompt modules**

```bash
git add lib/openai.ts
git commit -m "refactor: create modular prompt structure for accuracy"
```

---

## Task 4: Add Tone-Specific Prompt Injection

**Files:**
- Modify: `lib/openai.ts:115-140`

**Step 1: Create tone definition functions**

Add tone-specific prompt sections:

```typescript
// Tone-specific style instructions
function getToneInstructions(tone: ToneStyle): string {
  const toneMap = {
    professional: `## TON: PROFESSIONAL (Profesjonalny)
- Ton formalny, rzeczowy, ekspertycki
- Pełne zdania, poprawna składnia
- Terminologia techniczna dozwolona
- Unikaj skrótów potocznych i slangu
- Zero emoji w opisie
- Przykłady fraz:
  * Wprowadzenie: "Oferuję do sprzedaży [produkt]"
  * Stan: "W doskonałym stanie", "Niewielkie ślady użytkowania"
  * CTA: "Zapraszam do kontaktu", "W razie pytań proszę o kontakt"
  * Negocjacje: "Cena do negocjacji"
  * Za darmo: "Oddaję bezpłatnie", "Bezpłatnie do odbioru"`,

    friendly: `## TON: FRIENDLY (Przyjazny)
- Ton ciepły, pomocny, bezpośredni
- Zdania średniej długości
- Balans między formalnym a potocznym
- Emoji dozwolone w umiarkowanej ilości (1-2)
- Naturalny, ludzki język
- Przykłady fraz:
  * Wprowadzenie: "Sprzedam [produkt]"
  * Stan: "Bardzo dobry stan", "W super stanie"
  * CTA: "Pytania? Napisz śmiało!", "Pisz śmiało jeśli masz pytania!"
  * Negocjacje: "Cena do dogadania"
  * Za darmo: "Oddam za darmo!", "Za darmo do odbioru"`,

    casual: `## TON: CASUAL (Swobodny)
- Ton luźny, potoczny, naturalny
- Krótkie, proste zdania
- Język codzienny, slang mile widziany
- Emoji mile widziane (2-3)
- Bezpośredni i szczery
- Przykłady fraz:
  * Wprowadzenie: "Mam do oddania [produkt]", "Wyprzedażam [produkt]"
  * Stan: "Mega stan", "Świetny stan", "Stan OK"
  * CTA: "Gadaj jak coś!", "Pisz!", "Dzwoń śmiało"
  * Negocjacje: "Cena do gada"
  * Za darmo: "Za free", "Daję za darmo", "Oddaje"`,
  };

  return toneMap[tone];
}

// Vocabulary guide for consistency
const TONE_VOCABULARY = `## SŁOWNICTWO WG TONU

| Kontekst | Professional | Friendly | Casual |
|----------|--------------|----------|--------|
| Wprowadzenie | "Oferuję do sprzedaży" | "Sprzedam" | "Mam do oddania" |
| Stan | "W doskonałym stanie" | "Bardzo dobry stan" | "Mega stan" |
| Kontakt | "Zapraszam do kontaktu" | "Pisz śmiało!" | "Gadaj!" |
| Pytania | "W razie pytań proszę o kontakt" | "Masz pytania? Napisz!" | "Pytania? Pisz!" |
| Negocjacje | "Cena do negocjacji" | "Cena do dogadania" | "Cena do gada" |
| Za darmo | "Bezpłatnie do odbioru" | "Oddam za darmo!" | "Za free" |
`;
```

**Step 2: Create system prompt builder function**

Replace hardcoded SYSTEM_PROMPT with a builder:

```typescript
function buildSystemPrompt(tone: ToneStyle): string {
  return `Jesteś ekspertem w tworzeniu ogłoszeń sprzedażowych na polskie platformy marketplace (OLX, Allegro Lokalnie, Facebook Marketplace, Vinted).

Analizuj zdjęcia produktu i dane wejściowe, aby wygenerować tytuł i opis w wybranym stylu językowym (TONIE).

${PROMPT_INFORMATION_HIERARCHY}

${PROMPT_FACTS_VS_INFERENCE}

${PROMPT_UNCERTAINTY_LANGUAGE}

${PROMPT_FORBIDDEN_PHRASES}

${PROMPT_PRICE_HANDLING}

${getToneInstructions(tone)}

${TONE_VOCABULARY}

${PROMPT_GENERAL_GUIDELINES}

## SPECJALNE ZASADY DLA BŁĘDÓW LUB BRAKU DANYCH:
- Jeżeli zdjęcia są nieczytelne, uszkodzone lub brak kluczowych danych — wygeneruj negatywną odpowiedź z isValid: false i error.

Odpowiedz TYLKO w formacie JSON zgodnym z poniższym schematem:`;
}
```

**Step 3: Commit tone injection system**

```bash
git add lib/openai.ts
git commit -m "feat: add dynamic tone-specific prompt injection"
```

---

## Task 5: Update JSON Schema for New Response Format

**Files:**
- Modify: `lib/openai.ts:95-115`

**Step 1: Create conditional JSON schema builder**

Replace hardcoded JSON_SCHEMA with a function:

```typescript
function buildJsonSchema(generateAllTones: boolean): string {
  if (generateAllTones) {
    // Multi-tone response schema
    return `{
  "isValid": boolean,
  "error": string (tylko jeśli isValid=false),
  "toneVariants": [
    {
      "tone": "professional" | "friendly" | "casual",
      "title": string,
      "description": string
    }
  ],
  "price": {
    "min": number,
    "max": number,
    "reason": string
  } | null,
  "isFree": boolean (true jeśli priceType="free"),
  "images": [
    {
      "filename": string,
      "quality": string,
      "suggestions": string,
      "isValid": boolean,
      "reason": string
    }
  ],
  "confidence": {
    "productIdentification": "high" | "medium" | "low",
    "specifications": "high" | "medium" | "low"
  }
}`;
  } else {
    // Single tone response schema
    return `{
  "isValid": boolean,
  "error": string (tylko jeśli isValid=false),
  "title": string,
  "description": string,
  "price": {
    "min": number,
    "max": number,
    "reason": string
  } | null,
  "isFree": boolean (true jeśli priceType="free"),
  "images": [
    {
      "filename": string,
      "quality": string,
      "suggestions": string,
      "isValid": boolean,
      "reason": string
    }
  ],
  "confidence": {
    "productIdentification": "high" | "medium" | "low",
    "specifications": "high" | "medium" | "low"
  }
}`;
  }
}
```

**Step 2: Commit schema builder**

```bash
git add lib/openai.ts
git commit -m "feat: add conditional JSON schema for single/multi-tone modes"
```

---

## Task 6: Refactor generateAd Function

**Files:**
- Modify: `lib/openai.ts:116-215`

**Step 1: Update function signature and user prompt**

Update generateAd to use new request fields:

```typescript
export async function generateAd(
    request: GenerateAdRequest
): Promise<GenerateAdResponse> {
    const imageFilenames = request.images.map((img) => img.filename).join(", ");

    // Load platform-specific rules
    const platformRules = getPlatformRules(request.platform as Platform);

    // Build price context
    let priceContext = "";
    if (request.priceType === "free") {
        priceContext = "Za darmo (użytkownik oddaje produkt bezpłatnie)";
    } else if (request.priceType === "user_provided") {
        priceContext = `Cena podana przez użytkownika: ${request.price} zł`;
    } else {
        priceContext = "Zasugeruj odpowiednią cenę na podstawie analizy produktu i rynku";
    }

    // Build tone context
    const toneContext = request.generateAllTones
        ? "Wygeneruj 3 wersje ogłoszenia w TRZECH RÓŻNYCH TONACH: professional, friendly, casual. Każda wersja powinna być wyraźnie inna stylistycznie."
        : `Wygeneruj ogłoszenie w stylu: ${request.tone.toUpperCase()}`;

    const userPrompt = `## Dane wejściowe:
- Platforma sprzedażowa: ${request.platform}
- Nazwa produktu: ${request.productName || "rozpoznaj ze zdjęć"}
- Stan: ${request.condition}
- ${priceContext}
- Sposób dostawy: ${request.delivery}
- Dodatkowe informacje: ${request.notes || "brak"}
- Liczba zdjęć: ${request.images.length}
- Nazwy plików zdjęć: ${imageFilenames}

## STYL OGŁOSZENIA:
${toneContext}

## ZASADY SPECYFICZNE DLA PLATFORMY ${request.platform.toUpperCase()}:
${platformRules}

Wygeneruj ogłoszenie sprzedażowe w formacie JSON zgodnie z powyższymi zasadami platformy i wybranym stylem (TONEM). Przeanalizuj wszystkie ${request.images.length} zdjęć i dodaj ocenę każdego z nich.`;

    // ... rest of function
}
```

**Step 2: Update OpenAI API call**

Update the API call to use dynamic prompts:

```typescript
    try {
        const openai = getOpenAIClient();

        // Build content array with text and all images
        const contentItems: Array<
            | { type: "text"; text: string }
            | { type: "image_url"; image_url: { url: string; detail: "high" | "low" | "auto" } }
        > = [
                {
                    type: "text",
                    text: userPrompt,
                },
            ];

        // Add all images to the content
        for (const image of request.images) {
            contentItems.push({
                type: "image_url",
                image_url: {
                    url: `data:${image.mimeType};base64,${image.base64}`,
                    detail: "high",
                },
            });
        }

        // Determine which tone to use for system prompt
        const systemTone = request.generateAllTones ? "friendly" : request.tone;

        const response = await openai.chat.completions.create({
            model: "o4-mini",
            messages: [
                {
                    role: "system",
                    content: `${buildSystemPrompt(systemTone)}\n\n${buildJsonSchema(request.generateAllTones)}`,
                },
                {
                    role: "user",
                    content: contentItems,
                },
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: request.generateAllTones ? 6000 : 4000,
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            return {
                isValid: false,
                error: "Brak odpowiedzi od AI. Spróbuj ponownie.",
            };
        }

        // Parse JSON response
        const parsed = JSON.parse(content) as GenerateAdResponse;
        return parsed;
    } catch (error) {
        // ... existing error handling
    }
```

**Step 3: Commit generateAd refactor**

```bash
git add lib/openai.ts
git commit -m "refactor: update generateAd to support tone variants and price types"
```

---

## Task 7: Update Platform Rules - OLX

**Files:**
- Modify: `lib/rules/olx_rules.md:1-58`

**Step 1: Add tone sections to OLX rules**

Insert after line 2 (after heading):

```markdown
## DOMYŚLNY TON DLA PLATFORMY
casual

## TON: PROFESSIONAL
### Frazowanie
- Wprowadzenie: "Oferuję do sprzedaży [produkt]"
- Stan: "W doskonałym stanie", "Minimalne ślady użytkowania"
- CTA: "Zapraszam do kontaktu w celu uzyskania dodatkowych informacji"
- Negocjacje: "Cena do negocjacji"
- Za darmo: "Oddaję bezpłatnie w związku z [powodem]"

## TON: FRIENDLY
### Frazowanie
- Wprowadzenie: "Sprzedam [produkt]"
- Stan: "Bardzo dobry stan", "Super stan jak na wiek"
- CTA: "Pytania? Napisz śmiało! 😊"
- Negocjacje: "Cena do dogadania"
- Za darmo: "Oddam za darmo! Pisz szybko!"

## TON: CASUAL (NAJPOPULARNIEJSZY na OLX)
### Frazowanie
- Wprowadzenie: "Mam na sprzedaż [produkt]", "Do oddania [produkt]"
- Stan: "Mega stan", "Świetny stan", "Normalny stan użytkowy"
- CTA: "Gadaj jak coś!", "Pisz!", "Dzwoń śmiało"
- Negocjacje: "Cena do gada"
- Za darmo: "Za free", "Daję za darmo bo nie potrzebuję"

## ZA DARMO na OLX
- Bardzo popularna kategoria "Oddam za darmo"
- Podkreśl stan i dlaczego oddajesz (przeprowadzka, upgrade, brak miejsca)
- Zachęć do szybkiego kontaktu (duże zainteresowanie!)
- Nie wspominaj o lokalizacji/wysyłce
- Przykład: "Oddaję za darmo, bo kupuję nowy. Stan dobry, sprawny."

```

**Step 2: Commit OLX rules update**

```bash
git add lib/rules/olx_rules.md
git commit -m "feat: add tone variations and free listing rules to OLX"
```

---

## Task 8: Update Platform Rules - Allegro Lokalnie

**Files:**
- Modify: `lib/rules/allegro_lokalnie_rules.md:1-81`

**Step 1: Add tone sections**

Insert after line 2:

```markdown
## DOMYŚLNY TON DLA PLATFORMY
professional

## TON: PROFESSIONAL (NAJPOPULARNIEJSZY na Allegro Lokalnie)
### Frazowanie
- Wprowadzenie: "Oferuję do sprzedaży [produkt]"
- Stan: "W doskonałym stanie technicznym i wizualnym"
- CTA: "Zapraszam do kontaktu", "W razie pytań proszę o wiadomość"
- Negocjacje: "Cena do negocjacji"
- Bezpieczeństwo: "Transakcja chroniona Allegro Protect"
- Za darmo: "Oferuję bezpłatnie w związku z [powodem]"

## TON: FRIENDLY
### Frazowanie
- Wprowadzenie: "Sprzedam [produkt]"
- Stan: "Bardzo dobry stan", "Sprawny i zadbany"
- CTA: "Masz pytania? Napisz!", "Chętnie odpowiem na pytania"
- Negocjacje: "Cena do dogadania przy szybkiej decyzji"
- Bezpieczeństwo: "Chronione przez Allegro Protect"
- Za darmo: "Oddam za darmo bo [powód]"

## TON: CASUAL
### Frazowanie
- Wprowadzenie: "Mam do sprzedaży [produkt]"
- Stan: "Dobry stan", "Sprawny, wszystko działa"
- CTA: "Pisz jak coś!", "Gadaj śmiało"
- Negocjacje: "Cena do gada"
- Za darmo: "Oddaje za free"

## ZA DARMO na Allegro Lokalnie
- Mniej popularne niż na OLX, ale możliwe
- Podkreśl wartość przedmiotu mimo darmowości
- "Bezpłatnie" brzmi lepiej niż "za darmo" (platforma bardziej formalna)
- Wymień konkretny powód (remont, upgrade, przeprowadzka)
- Przykład: "Oferuję bezpłatnie w związku z remontem. Przedmiot sprawny, drobne ślady użytkowania."

```

**Step 2: Commit Allegro rules update**

```bash
git add lib/rules/allegro_lokalnie_rules.md
git commit -m "feat: add tone variations and free listing rules to Allegro"
```

---

## Task 9: Update Platform Rules - Facebook Marketplace

**Files:**
- Modify: `lib/rules/facebook_marketplace_rules.md:1-73`

**Step 1: Add tone sections**

Insert after line 2:

```markdown
## DOMYŚLNY TON DLA PLATFORMY
friendly

## TON: PROFESSIONAL
### Frazowanie
- Wprowadzenie: "Oferuję [produkt]"
- Stan: "W bardzo dobrym stanie", "Zadbany, sprawny"
- CTA: "Zapraszam do kontaktu przez Messenger"
- Negocjacje: "Cena do negocjacji"
- Za darmo: "Oddaję bezpłatnie"

## TON: FRIENDLY (NAJPOPULARNIEJSZY na Facebook)
### Frazowanie
- Wprowadzenie: "Sprzedam [produkt]"
- Stan: "Super stan", "W bardzo dobrym stanie"
- CTA: "Pisz na Messengerze! 😊", "Napisz jak masz pytania!"
- Negocjacje: "Cena do dogadania"
- Za darmo: "Oddam za darmo! 🎁"

## TON: CASUAL
### Frazowanie
- Wprowadzenie: "Mam [produkt]", "Sprzedam [produkt]"
- Stan: "Mega stan", "Wszystko gra"
- CTA: "Pisz!", "Gadaj śmiało!"
- Negocjacje: "Cena do gada"
- Za darmo: "Za free!"

## ZA DARMO na Facebook Marketplace
- Bardzo popularne, szczególnie w lokalnych grupach
- Emoji 🎁 często używane i mile widziane
- Prosty, bezpośredni język
- Zachęć do szybkiego kontaktu
- Przykład: "Oddam za darmo! 🎁 Sprawny, dobry stan. Pisz szybko!"

```

**Step 2: Commit Facebook rules update**

```bash
git add lib/rules/facebook_marketplace_rules.md
git commit -m "feat: add tone variations and free listing rules to Facebook"
```

---

## Task 10: Update Platform Rules - Vinted

**Files:**
- Modify: `lib/rules/vinted_rules.md:1-89`

**Step 1: Add tone sections**

Insert after line 2:

```markdown
## DOMYŚLNY TON DLA PLATFORMY
friendly

## TON: PROFESSIONAL (dla luksusowych marek)
### Frazowanie
- Wprowadzenie: "Oferuję [produkt marki]"
- Stan: "W doskonałym stanie", "Stan idealny"
- Detale: "Dokładne wymiary:", "Autentyczność potwierdzona metką"
- CTA: "Zapraszam do kontaktu w razie pytań"
- Za darmo: "Oddaję bezpłatnie"

## TON: FRIENDLY (STANDARDOWY dla Vinted)
### Frazowanie
- Wprowadzenie: "Sprzedam [produkt] 💕"
- Stan: "Super stan!", "Noszony kilka razy"
- Detale: "Wymiary:", "Piękny kolor!"
- CTA: "Pytania? Pisz śmiało! 💬"
- Za darmo: "Oddam za darmo! (płacisz tylko wysyłkę)"

## TON: CASUAL (młodsza grupa użytkowników)
### Frazowanie
- Wprowadzenie: "Sprzedam [produkt] ✨"
- Stan: "Mega stan", "Noszona parę razy"
- Detale: "Wymiary na zdjęciach", "Cudny kolor"
- CTA: "Pisz! 💕", "Gadaj śmiało!"
- Za darmo: "Za free! (tylko wysyłka)"

## ZA DARMO na Vinted
- Rzadsze niż na innych platformach
- Możliwe: 0 zł + kupujący płaci wysyłkę
- Lub całkowicie za darmo
- Dobry sposób na pozbycie się rzeczy i budowanie reputacji
- Zaznacz "oddaję za darmo" w tytule
- Przykład: "Oddaję za darmo (płacisz tylko wysyłkę). Ładny stan, nie pasuje rozmiarem."

```

**Step 2: Commit Vinted rules update**

```bash
git add lib/rules/vinted_rules.md
git commit -m "feat: add tone variations and free listing rules to Vinted"
```

---

## Task 11: Update ProductForm Component - Add Tone Selector

**Files:**
- Modify: `components/ProductForm.tsx:1-200`

**Step 1: Import new types**

Add imports at the top:

```typescript
import type { ToneStyle, PriceType, Platform } from "@/lib/types";
import { PLATFORM_DEFAULT_TONES, TONE_STYLE_NAMES, TONE_STYLE_DESCRIPTIONS } from "@/lib/types";
```

**Step 2: Add tone state management**

Add state variables after existing useState declarations:

```typescript
const [selectedTone, setSelectedTone] = useState<ToneStyle>("friendly");
const [generateAllTones, setGenerateAllTones] = useState(false);
```

**Step 3: Update platform change handler**

Add effect to update tone when platform changes:

```typescript
useEffect(() => {
  if (platform) {
    const defaultTone = PLATFORM_DEFAULT_TONES[platform as Platform];
    setSelectedTone(defaultTone);
  }
}, [platform]);
```

**Step 4: Add tone selector UI**

Insert after platform selector, before condition field:

```typescript
{/* Tone Style Selector */}
<div className="space-y-3">
  <label className="text-sm font-medium">
    Styl ogłoszenia
  </label>
  <div className="space-y-2">
    {(["professional", "friendly", "casual"] as const).map((tone) => (
      <label
        key={tone}
        className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
      >
        <input
          type="radio"
          name="tone"
          value={tone}
          checked={selectedTone === tone}
          onChange={(e) => setSelectedTone(e.target.value as ToneStyle)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-medium">{TONE_STYLE_NAMES[tone]}</div>
          <div className="text-sm text-muted-foreground">
            {TONE_STYLE_DESCRIPTIONS[tone]}
          </div>
        </div>
      </label>
    ))}
  </div>

  {/* Generate All Tones Checkbox */}
  <label className="flex items-center space-x-2 text-sm">
    <input
      type="checkbox"
      checked={generateAllTones}
      onChange={(e) => setGenerateAllTones(e.target.checked)}
      className="rounded"
    />
    <span>Generuj wszystkie 3 warianty do porównania</span>
  </label>
  {generateAllTones && (
    <p className="text-xs text-muted-foreground">
      Generowanie 3 wersji zajmuje więcej czasu i kosztuje 3x więcej tokenów API.
    </p>
  )}
</div>
```

**Step 5: Commit tone selector UI**

```bash
git add components/ProductForm.tsx
git commit -m "feat: add tone style selector with platform defaults"
```

---

## Task 12: Update ProductForm Component - Add Price Type Selector

**Files:**
- Modify: `components/ProductForm.tsx:1-250`

**Step 1: Add price type state**

Add state for price type:

```typescript
const [priceType, setPriceType] = useState<PriceType>("ai_suggest");
const [userPrice, setUserPrice] = useState("");
```

**Step 2: Replace existing price field**

Replace the current price input field with radio buttons:

```typescript
{/* Price Type Selector */}
<div className="space-y-3">
  <label className="text-sm font-medium">Cena</label>

  {/* AI Suggest */}
  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
    <input
      type="radio"
      name="priceType"
      value="ai_suggest"
      checked={priceType === "ai_suggest"}
      onChange={() => setPriceType("ai_suggest")}
    />
    <div>
      <div className="font-medium">Sugeruj cenę</div>
      <div className="text-sm text-muted-foreground">
        AI zaproponuje odpowiednią cenę na podstawie produktu
      </div>
    </div>
  </label>

  {/* User Provided */}
  <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
    <input
      type="radio"
      name="priceType"
      value="user_provided"
      checked={priceType === "user_provided"}
      onChange={() => setPriceType("user_provided")}
      className="mt-1"
    />
    <div className="flex-1 space-y-2">
      <div>
        <div className="font-medium">Moja cena</div>
        <div className="text-sm text-muted-foreground">
          Podaj własną cenę w złotych
        </div>
      </div>
      {priceType === "user_provided" && (
        <input
          type="number"
          value={userPrice}
          onChange={(e) => setUserPrice(e.target.value)}
          placeholder="np. 500"
          className="w-full px-3 py-2 border rounded-md"
          min="0"
          step="1"
        />
      )}
    </div>
  </label>

  {/* Free */}
  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
    <input
      type="radio"
      name="priceType"
      value="free"
      checked={priceType === "free"}
      onChange={() => setPriceType("free")}
    />
    <div>
      <div className="font-medium">Za darmo 🎁</div>
      <div className="text-sm text-muted-foreground">
        Oddaję produkt bezpłatnie
      </div>
    </div>
  </label>
</div>
```

**Step 3: Commit price type selector**

```bash
git add components/ProductForm.tsx
git commit -m "feat: add price type selector (AI/user/free)"
```

---

## Task 13: Update ProductForm Component - Form Submission

**Files:**
- Modify: `components/ProductForm.tsx:200-250`

**Step 1: Update form submission handler**

Update the onSubmit function to include new fields:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (priceType === "user_provided" && (!userPrice || userPrice.trim() === "")) {
    alert("Podaj cenę lub wybierz inną opcję");
    return;
  }

  setIsGenerating(true);
  setError(null);

  try {
    const requestData = {
      platform,
      productName,
      condition,
      priceType,
      price: priceType === "user_provided" ? userPrice : undefined,
      delivery,
      notes,
      images: uploadedImages,
      tone: selectedTone,
      generateAllTones,
    };

    const response = await fetch("/api/generate-ad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to generate ad");
    }

    const result = await response.json();

    if (!result.isValid) {
      setError(result.error || "Nie udało się wygenerować ogłoszenia");
      return;
    }

    onGenerate(result);
  } catch (err) {
    setError("Wystąpił błąd podczas generowania ogłoszenia. Spróbuj ponownie.");
    console.error(err);
  } finally {
    setIsGenerating(false);
  }
};
```

**Step 2: Commit form submission update**

```bash
git add components/ProductForm.tsx
git commit -m "feat: update form submission with tone and price type"
```

---

## Task 14: Update AdResult Component - Multi-Tone Display

**Files:**
- Modify: `components/AdResult.tsx:1-150`

**Step 1: Add state for selected tone variant**

Add imports and state:

```typescript
import { useState } from "react";
import type { ToneStyle } from "@/lib/types";
import { TONE_STYLE_NAMES } from "@/lib/types";

// Inside component:
const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
```

**Step 2: Add multi-tone tabs UI**

Add before the title/description display:

```typescript
{/* Multi-Tone Tabs */}
{result.toneVariants && result.toneVariants.length > 0 && (
  <div className="mb-6">
    <div className="flex space-x-2 border-b">
      {result.toneVariants.map((variant, index) => (
        <button
          key={variant.tone}
          onClick={() => setSelectedVariantIndex(index)}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedVariantIndex === index
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {TONE_STYLE_NAMES[variant.tone as ToneStyle]}
        </button>
      ))}
    </div>
    <p className="mt-2 text-sm text-muted-foreground">
      Wybierz styl, który najbardziej Ci odpowiada
    </p>
  </div>
)}
```

**Step 3: Update title/description display logic**

Replace existing title/description display with conditional rendering:

```typescript
{/* Determine which content to show */}
{(() => {
  const displayContent = result.toneVariants && result.toneVariants.length > 0
    ? result.toneVariants[selectedVariantIndex]
    : { title: result.title, description: result.description };

  return (
    <>
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tytuł</h3>
          <button
            onClick={() => copyToClipboard(displayContent.title || "", "title")}
            className="text-sm text-primary hover:underline"
          >
            {copiedField === "title" ? "Skopiowano!" : "Kopiuj"}
          </button>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium">{displayContent.title}</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Opis</h3>
          <button
            onClick={() => copyToClipboard(displayContent.description || "", "description")}
            className="text-sm text-primary hover:underline"
          >
            {copiedField === "description" ? "Skopiowano!" : "Kopiuj"}
          </button>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="whitespace-pre-wrap">{displayContent.description}</p>
        </div>
      </div>
    </>
  );
})()}
```

**Step 4: Commit multi-tone display**

```bash
git add components/AdResult.tsx
git commit -m "feat: add multi-tone tab switcher in results"
```

---

## Task 15: Update AdResult Component - Free Listing Display

**Files:**
- Modify: `components/AdResult.tsx:100-150`

**Step 1: Add free listing badge and conditional price display**

Update the price section:

```typescript
{/* Price Section */}
{result.isFree ? (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold">Cena</h3>
    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">🎁</span>
        <div>
          <p className="font-semibold text-green-700 dark:text-green-400">
            Za darmo
          </p>
          <p className="text-sm text-green-600 dark:text-green-500">
            Oddajesz produkt bezpłatnie
          </p>
        </div>
      </div>
    </div>
  </div>
) : result.price ? (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold">Sugerowana cena</h3>
    <div className="p-4 bg-muted rounded-lg space-y-2">
      <p className="text-2xl font-bold">
        {result.price.min} - {result.price.max} zł
      </p>
      <p className="text-sm text-muted-foreground">
        {result.price.reason}
      </p>
    </div>
  </div>
) : null}
```

**Step 2: Commit free listing display**

```bash
git add components/AdResult.tsx
git commit -m "feat: add free listing badge and conditional price display"
```

---

## Task 16: Update API Route Validation

**Files:**
- Modify: `app/api/generate-ad/route.ts:1-50`

**Step 1: Update request validation**

Update the POST handler to validate new fields:

```typescript
import { GenerateAdRequestSchema } from "@/lib/schemas";
import { generateAd } from "@/lib/openai";
import type { GenerateAdRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request with updated schema
    const validationResult = GenerateAdRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          isValid: false,
          error: "Nieprawidłowe dane wejściowe: " + validationResult.error.message,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data as GenerateAdRequest;

    // Generate ad with OpenAI
    const result = await generateAd(validatedData);

    return Response.json(result);
  } catch (error) {
    console.error("API route error:", error);
    return Response.json(
      {
        isValid: false,
        error: "Wystąpił błąd serwera. Spróbuj ponownie.",
      },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit API route update**

```bash
git add app/api/generate-ad/route.ts
git commit -m "feat: update API validation for tone and price types"
```

---

## Task 17: Manual Testing - Single Tone Mode

**Files:**
- Test: All components

**Step 1: Start development server**

```bash
npm run dev
```

**Step 2: Test Professional tone**

1. Upload a product image
2. Select platform: Allegro Lokalnie (default Professional)
3. Fill condition, delivery
4. Leave "Sugeruj cenę" selected
5. Keep "Generuj wszystkie 3 warianty" unchecked
6. Submit form
7. Verify: Generated listing has formal, professional tone
8. Verify: Price suggestion appears
9. Test copy buttons

**Step 3: Test Friendly tone**

1. Change platform to Facebook Marketplace (default Friendly)
2. Submit form
3. Verify: Tone is warm and helpful
4. Check for 1-2 emoji usage

**Step 4: Test Casual tone**

1. Change platform to OLX (default Casual)
2. Submit form
3. Verify: Tone is informal and conversational
4. Check for 2-3 emoji usage

**Step 5: Document any issues**

Note any problems in a comment or file.

---

## Task 18: Manual Testing - Multi-Tone Mode

**Files:**
- Test: All components

**Step 1: Enable multi-tone generation**

1. Upload product images
2. Select any platform
3. Check "Generuj wszystkie 3 warianty"
4. Submit form

**Step 2: Verify tab switching**

1. Verify 3 tabs appear: Profesjonalny, Przyjazny, Swobodny
2. Click each tab
3. Verify title and description change
4. Verify distinct stylistic differences between tones

**Step 3: Test copy functionality per variant**

1. Select Professional tab, copy title
2. Switch to Friendly tab, copy description
3. Switch to Casual tab, copy both
4. Verify correct content copied each time

**Step 4: Verify shared sections**

1. Verify price section is shared (same across all tabs)
2. Verify image analysis is shared

---

## Task 19: Manual Testing - Price Types

**Files:**
- Test: All components

**Step 1: Test AI suggest mode**

1. Select "Sugeruj cenę"
2. Submit form
3. Verify: Price range with reasoning appears
4. Verify: No price mentioned in title/description

**Step 2: Test user-provided price**

1. Select "Moja cena"
2. Enter: 500
3. Submit form
4. Verify: Price may be mentioned in description if contextually appropriate
5. Verify: No separate price suggestion box

**Step 3: Test free listing**

1. Select "Za darmo 🎁"
2. Submit form
3. Verify: Green "Za darmo" badge appears
4. Verify: No price section
5. Verify: Description mentions "za darmo"/"bezpłatnie"/"za free" depending on tone
6. Verify: isFree flag is true in response

**Step 4: Test validation**

1. Select "Moja cena" but leave field empty
2. Try to submit
3. Verify: Alert or validation message appears

---

## Task 20: Manual Testing - Accuracy Improvements

**Files:**
- Test: AI prompt behavior

**Step 1: Test user data priority**

1. Upload unclear product image
2. Fill productName: "iPhone 13 Pro Max 256GB"
3. Condition: "nowy"
4. Submit
5. Verify: Title/description uses exact product name confidently
6. Verify: No "prawdopodobnie" or "wygląda na" for user-provided data

**Step 2: Test uncertainty language**

1. Upload image with NO visible brand/model
2. Leave productName empty
3. Submit
4. Verify: Description uses uncertainty phrases like "wygląda na", "może być"
5. Verify: No definitive model claims

**Step 3: Test forbidden phrases**

1. Upload used product image (visible wear)
2. Leave productName empty
3. Condition: "używany"
4. Submit
5. Verify: AI doesn't claim "fabrycznie nowy", "gwarancja producenta" without evidence
6. Verify: Describes visible condition honestly

**Step 4: Test confidence field**

1. Check response JSON (browser dev tools)
2. Verify: `confidence` field exists with productIdentification and specifications ratings

---

## Task 21: Final Integration Test

**Files:**
- Test: End-to-end workflow

**Step 1: Complete workflow - OLX Casual**

1. Platform: OLX
2. Product: Empty (let AI detect)
3. Condition: "ślady używania"
4. Price: "Za darmo"
5. Delivery: "Odbiór osobisty"
6. Upload: 3 product images
7. Tone: Casual (default)
8. Multi-tone: No
9. Submit and verify casual free listing

**Step 2: Complete workflow - Allegro Professional Multi-tone**

1. Platform: Allegro Lokalnie
2. Product: "Samsung Galaxy S23"
3. Condition: "idealny"
4. Price: "Moja cena: 2500"
5. Delivery: "Wysyłka lub odbiór"
6. Upload: 5 images
7. Tone: Professional (default)
8. Multi-tone: Yes
9. Submit and verify 3 distinct variants

**Step 3: Complete workflow - Facebook Free Multi-tone**

1. Platform: Facebook Marketplace
2. Product: Empty
3. Condition: "nowy"
4. Price: "Za darmo"
5. Delivery: "Odbiór osobisty"
6. Upload: 4 images
7. Tone: Friendly (default)
8. Multi-tone: Yes
9. Submit and verify all 3 tones handle free listing correctly

---

## Task 22: Update Documentation

**Files:**
- Modify: `CLAUDE.md:1-150`

**Step 1: Document new features**

Add section after "Application Flow":

```markdown
### Tone Variations

The app supports 3 tone styles for generated listings:

- **Professional** - Formalny, rzeczowy, ekspertycki
- **Friendly** - Ciepły, pomocny, naturalny
- **Casual** - Luźny, potoczny, bezpośredni

Each platform has a smart default tone:
- OLX → Casual
- Allegro Lokalnie → Professional
- Facebook Marketplace → Friendly
- Vinted → Friendly

Users can override the default or generate all 3 variants at once for comparison.

### Price Handling

Three price modes:
- **AI Suggest** - OpenAI proposes price range with reasoning
- **User Provided** - User sets their own price
- **Free** - "Za darmo" listings with special formatting

### Accuracy Features

The system uses a modular prompt architecture with:
- Information hierarchy (user data > visible facts > AI inference)
- Uncertainty language system (3 confidence levels)
- Forbidden phrases list to prevent hallucination
- Dynamic tone injection based on selection
```

**Step 2: Update API section**

Update the GenerateAdRequest interface documentation:

```markdown
GenerateAdRequest now includes:
- `tone: ToneStyle` - Selected tone (professional/friendly/casual)
- `generateAllTones: boolean` - Generate all 3 variants?
- `priceType: PriceType` - How to handle price (user_provided/ai_suggest/free)
- `price?: string` - Optional user price (when priceType="user_provided")

GenerateAdResponse now includes:
- `toneVariants?: ToneVariant[]` - Array of 3 variants (when generateAllTones=true)
- `isFree?: boolean` - Indicates free listing
- `confidence?: {...}` - AI confidence levels for identification
```

**Step 3: Commit documentation**

```bash
git add CLAUDE.md
git commit -m "docs: update with tone variations and accuracy features"
```

---

## Task 23: Create Pull Request or Merge

**Files:**
- Git operations

**Step 1: Review all commits**

```bash
git log --oneline develop..HEAD
```

Expected: ~23 commits covering types, schemas, prompts, rules, UI, testing, docs

**Step 2: Push branch**

```bash
git push origin HEAD
```

**Step 3: Create PR or merge to develop**

If working in feature branch:
```bash
gh pr create --title "feat: tone variations & AI accuracy improvements" --body "Implements tone style selection (Professional/Friendly/Casual) with platform defaults, improved AI accuracy with modular prompts, and free listing support."
```

Or merge directly to develop if already in develop:
```bash
# Already in develop, no PR needed
```

---

## Success Criteria Checklist

- [ ] Users can select tone style (Professional/Friendly/Casual)
- [ ] Platform-specific default tones are pre-selected
- [ ] "Generate all 3 tones" option works and shows tabs
- [ ] Each tone produces distinctly different stylistic output
- [ ] AI respects user-provided data as absolute truth
- [ ] AI uses uncertainty language for inferred details
- [ ] AI avoids forbidden phrases without confirmation
- [ ] Free listing option displays correctly with badge
- [ ] User-provided price mode works and validates
- [ ] AI suggest price mode provides reasoning
- [ ] Multi-tone tabs switch correctly
- [ ] Copy buttons work per variant
- [ ] All 4 platform rules include tone sections
- [ ] Manual testing passes all scenarios
- [ ] Documentation is updated

---

## Notes for Implementation

- **TDD**: No explicit tests in this plan (Next.js app without test setup). Manual testing covers verification.
- **Commits**: Frequent commits after each logical change (~23 commits total)
- **YAGNI**: No extra features beyond spec (no custom tones, no A/B testing, no API integrations)
- **DRY**: Modular prompt structure, reusable tone functions, shared constants
- **Error handling**: Existing error handling preserved and extended for new validation

## Estimated Time

- Type/schema updates: 15 min
- Prompt refactor: 45 min
- Platform rules updates: 30 min
- UI components: 45 min
- API updates: 15 min
- Manual testing: 45 min
- Documentation: 15 min

**Total**: ~3.5 hours

## Risk Mitigation

- **Long prompts**: o4-mini has 128k context - modular prompts fit comfortably
- **API cost**: Hybrid mode default (single tone) keeps costs low; multi-tone is optional
- **Tone quality**: Platform research in rules ensures authentic output
- **Validation**: Zod schemas prevent malformed requests
