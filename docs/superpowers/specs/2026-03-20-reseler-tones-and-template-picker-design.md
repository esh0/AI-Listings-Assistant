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

`ToneStyleSchema` (Zod) rozszerzony o 5 nowych wartości — dotyczy `generateAdRequestSchema`, `productFormSchema` i walidacji szablonów.

---

## Sekcja 2: UI

### `ProductForm.tsx`

Nowy prop: `userPlan: string` (przekazywany z `AdGeneratorForm` i `LandingForm`).

Sekcja tonów iteruje po dwóch grupach:

1. `FREE_TONES` — przyciski działają jak dotychczas
2. `RESELER_TONES` — zawsze renderowane:
   - **gdy `userPlan === "RESELER"`** — działają normalnie (klikalne, zmieniają `selectedTone`)
   - **gdy `userPlan !== "RESELER"`** — wyszarzone, `cursor-not-allowed`, Crown icon po lewej, fioletowe tło (`bg-violet-50`, `text-violet-300`, `border-violet-100`); kliknięcie pokazuje tooltip

**Tooltip** (dla zablokowanych tonów):
- Prosty `<div>` pozycjonowany absolutnie nad przyciskiem
- Treść: "Dostępne w planie Reseler" (bez linku)
- Pojawia się przy `onClick`, znika automatycznie po 2s (`setTimeout`)
- Stan: `tooltipTone: ToneStyle | null` w komponencie
- Jeden tooltip na raz (nowe kliknięcie zastępuje poprzedni timer)

### `AdGeneratorForm.tsx`

Picker szablonu **zawsze renderowany** dla zalogowanych użytkowników (gość — bez zmian, sekcja ukryta).

Trzy stany:
- **RESELER z szablonami** → działający `<select>` + przycisk edycji (bez zmian)
- **RESELER bez szablonów** → `<select>` z tylko "Brak (domyślny)" + link "Utwórz pierwszy szablon →" do `/dashboard/templates`
- **non-RESELER** → wyszarzony `<div>` (nie `<select>`, bo nie klikalne) z tekstem "Brak (domyślny)" + Crown badge + "Plan Reseler" po prawej, `cursor-not-allowed`, `opacity-50`

Przekazanie `userPlan` do `ProductForm`:
```tsx
<ProductForm
  ...
  userPlan={session?.user?.plan ?? "FREE"}
/>
```

### `LandingForm.tsx`

Analogicznie — przekazuje `userPlan` do `ProductForm`. Gość nie ma planu, więc `userPlan="FREE"` → RESELER_TONES zawsze zablokowane.

### `TemplateFormModal.tsx`

Lista tonów w selektorze rozszerzona o wszystkie 8 wartości. Bez blokowania — formularz szablonu dostępny tylko dla RESELER, więc wszystkie tony aktywne.

---

## Sekcja 3: AI — prompty i reguły

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

Każdy z 4 plików (`olx_rules.md`, `allegro_lokalnie_rules.md`, `facebook_marketplace_rules.md`, `vinted_rules.md`) dostaje nową sekcję z przykładowym frazowaniem dla każdego z 5 tonów, dopasowanym do specyfiki platformy. Przykłady:

- **Techniczny na Allegro** → skupia się na parametrach i kompatybilności
- **Techniczny na Vinted** → skupia się na składzie materiału, rozmiarówce, stanie
- **Zabawny na OLX** → luźny, bezpośredni, "sprzedaję bo żona kazała"
- **Entuzjastyczny na FB Marketplace** → ciepły, społecznościowy, buduje relację

---

## Sekcja 4: Pozostałe zmiany

| Plik | Zmiana |
|------|--------|
| `lib/types.ts` | Nowy typ + stałe FREE_TONES / RESELER_TONES + TONE_STYLE_NAMES/DESCRIPTIONS rozszerzone |
| `lib/schemas.ts` | ToneStyleSchema rozszerzony o 5 wartości |
| `prisma/schema.prisma` | Enum ToneStyle + 5 wartości + db push |
| `components/ProductForm.tsx` | Nowy prop userPlan, blokowanie RESELER_TONES, tooltip |
| `components/AdGeneratorForm.tsx` | Zawsze widoczny picker szablonu + przekazanie userPlan |
| `components/LandingForm.tsx` | Przekazanie userPlan do ProductForm |
| `components/TemplateFormModal.tsx` | Wszystkie 8 tonów w selektorze |
| `lib/openai.ts` | getToneInstructions — 5 nowych przypadków |
| `lib/rules/olx_rules.md` | Sekcje dla 5 nowych tonów |
| `lib/rules/allegro_lokalnie_rules.md` | Sekcje dla 5 nowych tonów |
| `lib/rules/facebook_marketplace_rules.md` | Sekcje dla 5 nowych tonów |
| `lib/rules/vinted_rules.md` | Sekcje dla 5 nowych tonów |

---

## Zmiany których NIE robimy

- `PLATFORM_DEFAULT_TONES` — bez zmian, nowe tony nie stają się defaultem żadnej platformy
- Walidacja na backendzie (`/api/generate-ad`) — `ToneStyleSchema` już jest używany, rozszerzenie Zod wystarczy
- Baza danych ogłoszeń — pole `tone` w `parameters` (JSON) — bez migracji danych, nowe tony po prostu zaczną się pojawiać
