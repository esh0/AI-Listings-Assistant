# Design: Nowe tony RESELER + zawsze widoczny picker szablonu

**Data:** 2026-03-20
**Status:** Zatwierdzony

---

## Kontekst

Aplikacja obsługuje 3 tony komunikacji (Profesjonalny, Przyjazny, Swobodny) dostępne dla wszystkich planów. Picker szablonu jest ukryty dla non-RESELER. Celem jest:

1. Dodanie 5 nowych tonów ekskluzywnych dla planu RESELER (w pełni funkcjonalnych — AI generuje w tych tonach)
2. Pokazanie pickera szablonu zawsze zalogowanym użytkownikom, ale wyszarzonego dla non-RESELER
3. Wizualne zachęcanie do upgrade'u przez Crown icon + tooltip

---

## Sekcja 1: Typy i dane

### `lib/types.ts`

Rozszerzenie `ToneStyle`:

```ts
export type ToneStyle =
  | "professional" | "friendly" | "casual"       // obecne — wszystkie plany
  | "enthusiastic" | "funny" | "technical"        // nowe — RESELER only
  | "persuasive" | "concise";                     // nowe — RESELER only
```

Dwie nowe stałe eksportowane:

```ts
export const FREE_TONES: ToneStyle[] = ["professional", "friendly", "casual"];
export const RESELER_TONES: ToneStyle[] = ["enthusiastic", "funny", "technical", "persuasive", "concise"];
```

Rozszerzenia `TONE_STYLE_NAMES` i `TONE_STYLE_DESCRIPTIONS` o wszystkie 8 tonów:

| Klucz | Nazwa PL | Opis |
|-------|----------|------|
| enthusiastic | Entuzjastyczny | Energetyczny, pełen emocji styl przyciągający uwagę |
| funny | Zabawny | Lekki humor i luźna atmosfera bez utraty wiarygodności |
| technical | Techniczny | Precyzyjne dane i specyfikacje bez ozdobników |
| persuasive | Przekonujący | Argumenty korzyści i CTA skłaniające do zakupu |
| concise | Zwięzły | Minimum słów, maksimum treści — bullet points i krótkie zdania |

### `prisma/schema.prisma`

Enum `ToneStyle` rozszerzony o 5 nowych wartości. Addytywna zmiana — bezpieczna dla istniejących danych.

```prisma
enum ToneStyle {
  professional
  friendly
  casual
  enthusiastic
  funny
  technical
  persuasive
  concise
}
```

Po zmianie: `npx prisma db push` (pooler URL dla obu zmiennych).

### `lib/schemas.ts`

`ToneStyleSchema` jest **jedynym źródłem prawdy** dla wartości tonu. Rozszerzyć o 5 nowych wartości — wszystkie schematy które go referencjonują (`generateAdRequestSchema`, `productFormSchema`, `generateAdResponseSchema`) automatycznie przyjmą wszystkie 8 tonów. Client-side Zod akceptuje wszystkie 8 wartości; blokada w UI (zablokowane przyciski) + 403 na backendzie są jedynymi gatami dla non-RESELER.

---

## Sekcja 2: UI

### `ProductForm.tsx`

Nowy prop dodany do `ProductFormProps`: `userPlan: string`. Przekazywany z `AdGeneratorForm` jako `session?.user?.plan ?? "FREE"`. `ProductForm` używa go do renderowania wolnych vs. zablokowanych RESELER_TONES.

Sekcja tonów iteruje po dwóch grupach:

1. `FREE_TONES` — przyciski działają jak dotychczas
2. `RESELER_TONES` — zawsze renderowane:
   - **gdy `userPlan === "RESELER"`** — działają normalnie (klikalne, zmieniają `selectedTone`)
   - **gdy `userPlan !== "RESELER"`** — wyszarzone, `cursor-not-allowed`, Crown icon po lewej, fioletowe tło (`bg-violet-50`, `text-violet-300`, `border-violet-100`); kliknięcie pokazuje tooltip

**Tooltip** (dla zablokowanych tonów):
- Prosty `<div>` pozycjonowany absolutnie nad przyciskiem
- Treść: "Dostępne w planie Reseler" (bez linku)
- Pojawia się przy `onClick`, znika automatycznie po 2s
- Stan: `tooltipTone: ToneStyle | null` w komponencie
- Timer w `timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)` — przed każdym nowym `setTimeout` wykonujemy `clearTimeout(timerRef.current)`, a `useEffect` cleanup wywołuje `clearTimeout(timerRef.current)` przy odmontowaniu — brak memory leaków i ostrzeżeń React

### `LandingForm.tsx`

`LandingForm` ma własny inline selektor tonów (linia 837) — **nie używa `ProductForm`**, nie ma sub-komponentu do którego można by przekazać prop. Zmiana wykonywana bezpośrednio w tym pliku: zastąpić hardkodowaną listę `["professional", "friendly", "casual"]` iteracją po `FREE_TONES` + `RESELER_TONES` z identyczną logiką blokowania i tooltipem co w `ProductForm`. `userPlan` nie jest propem — komponent samodzielnie określa plan: gość = `"FREE"`, zalogowany = `session?.user?.plan ?? "FREE"`. RESELER_TONES zawsze zablokowane dla gości.

### `AdGeneratorForm.tsx`

Picker szablonu **zawsze renderowany** dla zalogowanych użytkowników (gość — bez zmian, sekcja ukryta).

Trzy stany:
- **RESELER z szablonami** → działający `<select>` + przycisk edycji (bez zmian)
- **RESELER bez szablonów** → `<select>` z tylko "Brak (domyślny)" + link "Utwórz pierwszy szablon →" do `/dashboard/templates`
- **non-RESELER** → wyszarzony `<div>` (nie `<select>`) z tekstem "Brak (domyślny)" + Crown badge + "Plan Reseler" po prawej, `cursor-not-allowed`, `opacity-50`; brak jakiejkolwiek akcji przy kliknięciu

Przekazanie `userPlan` do `ProductForm`:
```tsx
<ProductForm
  ...
  userPlan={session?.user?.plan ?? "FREE"}
/>
```

### `TemplateFormModal.tsx`

Lista tonów w selektorze rozszerzona o wszystkie 8 wartości. Bez blokowania — formularz szablonu dostępny tylko dla RESELER.

### `components/ToneSelector.tsx`

Plik jest **martwym kodem** — nie jest importowany nigdzie w projekcie. Zawiera `TONE_RECOMMENDATIONS` typed `as const` z 3 kluczami, co spowoduje błąd TypeScript po rozszerzeniu `ToneStyle`. Plik należy **usunąć**.

---

## Sekcja 3: Backend

### `app/api/generate-ad/route.ts`

Po parsowaniu i walidacji requesta (Zod), przed wywołaniem OpenAI — dodać sprawdzenie planu:

```ts
if (RESELER_TONES.includes(parsed.data.tone) && session.user.plan !== "RESELER") {
  return NextResponse.json(
    { error: "Ten styl komunikacji dostępny jest tylko w planie Reseler" },
    { status: 403 }
  );
}
```

Dotyczy tylko zalogowanych użytkowników — ścieżka gościa (`guestId`) nigdy nie powinna mieć dostępu do RESELER_TONES (blokada UI + Zod wystarczy dla gości, bo goście nie mają planu).

### `app/api/templates/route.ts`

Lokalny Zod schema ma hardkodowane `z.enum(["professional", "friendly", "casual"])` dla pola `tone`. Rozszerzyć o wszystkie 8 wartości (lub zastąpić importem `ToneStyleSchema` z `lib/schemas.ts`).

### `app/api/templates/[id]/route.ts`

Analogicznie — lokalny schema `tone` rozszerzyć o 5 nowych wartości.

---

## Sekcja 4: AI — prompty i reguły

### `lib/openai.ts` — `getToneInstructions(tone)`

Rozszerzenie funkcji o 5 nowych przypadków:

| Ton | Instrukcja |
|-----|-----------|
| **enthusiastic** | Energetyczny, entuzjastyczny styl. Wykrzyknienia, wyrażenia emocji, "Niesamowita okazja!", "Musisz to zobaczyć!". Zaraźliwy entuzjazm bez przesady. |
| **funny** | Lekki humor i dowcip sytuacyjny. Żarty nawiązujące do produktu, ale nie kosztem wiarygodności. Emoji dozwolone z umiarem. Kupujący powinien się uśmiechnąć. |
| **technical** | Precyzja i dane. Każde zdanie niesie konkretną informację — parametry, specyfikacje, materiały. Zero ozdobników, zero emocji. Styl jak dokumentacja techniczna. |
| **persuasive** | Argumenty korzyści dla kupującego. Social proof ("bardzo popularny model"), poczucie pilności ("ostatnia sztuka", "okazja cenowa"), wyraźne CTA. Koncentracja na "co zyskujesz". |
| **concise** | Minimum słów, maksimum treści. Krótkie zdania lub bullet points. Tytuł i opis maksymalnie skrócone — tylko to co niezbędne. Zero lania wody. |

### `lib/rules/*.md` — pliki reguł platform

Każdy z 4 plików (`olx_rules.md`, `allegro_lokalnie_rules.md`, `facebook_marketplace_rules.md`, `vinted_rules.md`) dostaje nową sekcję z przykładowym frazowaniem dla każdego z 5 tonów, dopasowanym do specyfiki platformy:

- **Techniczny na Allegro** → parametry, kompatybilność, numer modelu
- **Techniczny na Vinted** → skład materiału, rozmiarówka, stan tkaniny
- **Zabawny na OLX** → luźny, bezpośredni, "sprzedaję bo żona kazała"
- **Entuzjastyczny na FB Marketplace** → ciepły, społecznościowy, buduje relację
- **Zwięzły na każdej platformie** → bullet points zamiast zdań, tytuł = najważniejsza cecha

---

## Sekcja 5: Tabela plików do modyfikacji

| Plik | Zmiana |
|------|--------|
| `lib/types.ts` | Rozszerzenie ToneStyle + FREE_TONES / RESELER_TONES + TONE_STYLE_NAMES/DESCRIPTIONS |
| `lib/schemas.ts` | ToneStyleSchema rozszerzony o 5 wartości |
| `prisma/schema.prisma` | Enum ToneStyle + 5 wartości + db push |
| `components/ProductForm.tsx` | Prop userPlan, blokowanie RESELER_TONES, tooltip z timerRef |
| `components/LandingForm.tsx` | Inline blokowanie RESELER_TONES + tooltip (własny selektor, nie ProductForm) |
| `components/AdGeneratorForm.tsx` | Zawsze widoczny picker szablonu + przekazanie userPlan do ProductForm |
| `components/TemplateFormModal.tsx` | Wszystkie 8 tonów w selektorze |
| `components/ToneSelector.tsx` | **Usunąć** (martwy kod, powoduje błąd TS po rozszerzeniu ToneStyle) |
| `app/api/generate-ad/route.ts` | Sprawdzenie planu dla RESELER_TONES (403 dla non-RESELER) |
| `app/api/templates/route.ts` | Enum tone rozszerzony o 5 wartości |
| `app/api/templates/[id]/route.ts` | Enum tone rozszerzony o 5 wartości |
| `lib/openai.ts` | getToneInstructions — 5 nowych przypadków |
| `lib/rules/olx_rules.md` | Sekcje dla 5 nowych tonów |
| `lib/rules/allegro_lokalnie_rules.md` | Sekcje dla 5 nowych tonów |
| `lib/rules/facebook_marketplace_rules.md` | Sekcje dla 5 nowych tonów |
| `lib/rules/vinted_rules.md` | Sekcje dla 5 nowych tonów |

---

## Zmiany których NIE robimy

- `PLATFORM_DEFAULT_TONES` — bez zmian, nowe tony nie stają się defaultem żadnej platformy
- Baza danych ogłoszeń — pole `tone` w `parameters` (JSON) — bez migracji danych, nowe tony po prostu zaczną się pojawiać w nowych ogłoszeniach
