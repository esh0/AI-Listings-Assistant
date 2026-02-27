import OpenAI from "openai";
import type { GenerateAdRequest, GenerateAdResponse, Platform } from "./types";
import { readFileSync } from "fs";
import { join } from "path";

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiClient;
}

// Platform-specific rules file mapping
const PLATFORM_RULES_FILES: Record<Platform, string> = {
    olx: "olx_rules.md",
    allegro_lokalnie: "allegro_lokalnie_rules.md",
    facebook_marketplace: "facebook_marketplace_rules.md",
    vinted: "vinted_rules.md",
};

// Cache for rules content
const rulesCache: Map<Platform, string> = new Map();

/**
 * Load platform-specific rules from markdown files
 */
function getPlatformRules(platform: Platform): string {
    // Check cache first
    if (rulesCache.has(platform)) {
        return rulesCache.get(platform)!;
    }

    const filename = PLATFORM_RULES_FILES[platform];

    try {
        // Try to read from file system (works in Node.js/server environment)
        const rulesPath = join(process.cwd(), "lib", "rules", filename);
        const content = readFileSync(rulesPath, "utf-8");
        rulesCache.set(platform, content);
        return content;
    } catch {
        // Fallback: return empty string if file not found
        console.warn(`Rules file not found for platform: ${platform}`);
        return "";
    }
}

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

// Module 6: General Guidelines
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
6. Zachowaj spójność i rzetelność informacji

## SPECJALNE ZASADY DLA BŁĘDÓW LUB BRAKU DANYCH:
- Jeżeli zdjęcia są nieczytelne, uszkodzone lub brak kluczowych danych — wygeneruj negatywną odpowiedź z isValid: false i error.`;

// DEPRECATED: Old monolithic system prompt - kept for reference, will be replaced with modular structure
// TODO: Remove after successful migration to modular prompts
const SYSTEM_PROMPT = `Jesteś ekspertem w tworzeniu ogłoszeń sprzedażowych na OLX, Allegro Lokalnie, Facebook Marketplace, Vinted. Analizuj zdjęcia produktu i dane wejściowe, aby wygenerować tytuł, opis i sugestie zdjęciowe. Używaj prostego, zwięzłego, sprzedażowego stylu w języku polskim. Dopasuj styl wypowiedzi, długość, używane słowa do konkretnej platformy sprzedażowej. Zadbaj o SEO – kluczowe frazy (marka, model, stan, kategoria) na początku.

## Zasady ogólne:
- Nie wymyślaj danych nieobecnych na zdjęciach ani niepodanych przez użytkownika (np. model, pojemność, data zakupu). Jeśli nie masz pewności - nie pisz w ogóle.
- Styl dopasuj do stanu produktu:
  • nowy – podkreśl „fabrycznie nowy", „nieużywany", „możliwa gwarancja"
  • idealny – „jak nowy", „brak rys/otarć"
  • ślady używania – „drobne ryski/otarcia, w pełni sprawny"
- Cena: jeśli brak, podaj 1–2 warianty (np. „Sugerowana: 800–950 zł") z 1–2 zdaniami uzasadnienia.
- Nie pokazuj analizy; generuj tylko końcowy rezultat w poniższej strukturze.
- Styl ogłoszenia ma być spójny z platformą sprzedażową
- Jeśli pole opcjonalne jest nieznane (np. brak nazwy produktu, ceny), zastosuj opisane standardy oraz neutralne formuły
- Ilość słów dopasowana do przedmiotu (np. ubranie wymaga mniej niż samochód)

## Zalecenia dotyczące tytułów produktów:
- Tytuły powinny być zwięzłe, znaczące i krótsze niż opis produktu.
- Zachowaj zgodność z zasadami poprawnej pisowni, gramatyki i odstępów między wyrazami.
- Zastosuj format właściwy dla tytułów, zapisując każde słowo wielką literą. Nie używaj słów ani całych nazw pisanych wielkimi literami.
- Stosuj cyfry, np. „2" zamiast „dwa".
- Nie stosuj wiadomości promocyjnych, np. „Wyprzedaż" lub „Darmowa dostawa".
- Nie używaj subiektywnych komentarzy, np. „Hit", „Bestseller" lub „Świetny prezent".

## Zalecenia dotyczące opisów produktów:
- Upewnij się, że opis produktu jest dłuższy niż jego tytuł.
- Opis musi dotyczyć unikalnych cech produktu oraz zawierać przydatne informacje mogące pomóc kupującym w podjęciu decyzji o zakupie.
- Zadbaj o zwięzłość i dopilnuj, aby opis był czytelny.
- Nie zamieszczaj zbyt wielu znaków interpunkcyjnych.
- Uwzględnij tylko informacje o produkcie.

## Etapy analizy (realizuj wewnętrznie):
1. Rozpoznaj produkt ze zdjęć (marka, model/seria jeśli pewne, typ/kategoria, kolor, widoczne akcesoria).
2. Oceń jakość każdego zdjęcia (oświetlenie, tło, ostrość); zaproponuj konkretne poprawki dla każdego.
3. Zbuduj tytuł z kluczowymi frazami, zwięzły i atrakcyjny, bez nadmiarowych znaków.
4. Stwórz opis: wstęp z korzyściami, lista/specyfikacja tylko na podstawie widocznych lub podanych danych, stan faktyczny, sposób odbioru/wysyłki i CTA.
5. Zachowaj spójność i rzetelność informacji.

## SPECJALNE ZASADY DLA BŁĘDÓW LUB BRAKU DANYCH:
- Jeżeli zdjęcia są nieczytelne, uszkodzone lub brak kluczowych danych — wygeneruj negatywną odpowiedź z isValid: false i error.

Odpowiedz TYLKO w formacie JSON zgodnym z poniższym schematem:`;

const JSON_SCHEMA = `{
  "isValid": boolean,
  "error": string (tylko jeśli isValid=false),
  "title": string,
  "description": string,
  "price": {
    "min": number,
    "max": number,
    "reason": string
  },
  "images": [
    {
      "filename": string,
      "quality": string,
      "suggestions": string,
      "isValid": boolean,
      "reason": string
    }
  ]
}`;

export async function generateAd(
    request: GenerateAdRequest
): Promise<GenerateAdResponse> {
    const imageFilenames = request.images.map((img) => img.filename).join(", ");

    // Load platform-specific rules
    const platformRules = getPlatformRules(request.platform as Platform);

    const userPrompt = `## Dane wejściowe:
- Platforma sprzedażowa: ${request.platform}
- Nazwa produktu: ${request.productName || "rozpoznaj ze zdjęć"}
- Stan: ${request.condition}
- Cena: ${request.price || "zasugeruj odpowiednią cenę"}
- Sposób dostawy: ${request.delivery}
- Dodatkowe informacje: ${request.notes || "brak"}
- Liczba zdjęć: ${request.images.length}
- Nazwy plików zdjęć: ${imageFilenames}

## ZASADY SPECYFICZNE DLA PLATFORMY ${request.platform.toUpperCase()}:
${platformRules}

Wygeneruj ogłoszenie sprzedażowe w formacie JSON zgodnie z powyższymi zasadami platformy. Przeanalizuj wszystkie ${request.images.length} zdjęć i dodaj ocenę każdego z nich.`;

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

        const response = await openai.chat.completions.create({
            model: "o4-mini",
            messages: [
                {
                    role: "system",
                    content: `${SYSTEM_PROMPT}\n\n${JSON_SCHEMA}`,
                },
                {
                    role: "user",
                    content: contentItems,
                },
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 4000,
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
        console.error("OpenAI API error:", error);

        if (error instanceof OpenAI.APIError) {
            if (error.status === 429) {
                return {
                    isValid: false,
                    error: "Zbyt wiele zapytań. Poczekaj chwilę i spróbuj ponownie.",
                };
            }
            if (error.status === 401) {
                return {
                    isValid: false,
                    error: "Nieprawidłowy klucz API. Sprawdź konfigurację.",
                };
            }
        }

        return {
            isValid: false,
            error: "Wystąpił błąd podczas generowania ogłoszenia. Spróbuj ponownie.",
        };
    }
}