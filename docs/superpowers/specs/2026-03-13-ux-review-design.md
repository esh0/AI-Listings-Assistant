# Dokument UI/UX — Przegląd i wymagania

**Projekt:** Marketplace AI
**Data:** 2026-03-13
**Odbiorca:** UX/UI Designer
**Cel:** Audyt obecnego stanu interfejsu + wymagania do przeprojektowania

---

## Jak czytać ten dokument

Każda sekcja opisuje jeden ekran lub przepływ i zawiera trzy elementy:

- **Stan obecny** — co istnieje w aplikacji, jak to wygląda i działa
- **Problemy** — co nie działa dobrze z perspektywy UX/UI
- **Wymagania** — czego oczekujemy od designera (cel, nie rozwiązanie)

Dokument nie proponuje rozwiązań — to zadanie designera.

---

## Sekcja 0 — Kontekst produktu

### Co robi aplikacja

Marketplace AI to narzędzie webowe generujące profesjonalne ogłoszenia sprzedażowe za pomocą AI (GPT-4.1-mini). Użytkownik wrzuca zdjęcia produktu, wypełnia krótki formularz i otrzymuje gotowy tytuł + opis dostosowany do wybranej platformy sprzedażowej.

### Platformy docelowe

| Platforma | Rekomendowany ton |
|---|---|
| OLX | Swobodny |
| Allegro Lokalnie | Profesjonalny |
| Facebook Marketplace | Przyjazny |
| Vinted | Przyjazny |

### Segmenty użytkowników

**Casual (główny)** — sprzedaje 1–5 produktów miesięcznie. Oczekuje szybkości i prostoty. Nie chce płacić za coś, z czego korzysta rzadko. Główne platformy: OLX, Facebook.

**Reseller (docelowy płatnik)** — wystawia 15–50 ogłoszeń miesięcznie. Ceni efektywność i powtarzalność. Gotowy płacić jeśli narzędzie realnie oszczędza czas. Platformy: wszystkie.

**Biznes (aspiracyjny)** — firmy i sklepy, 50–200+ ogłoszeń. Priorytet: bulk export, szablony, wsparcie. Platformy: wszystkie.

### Tone of voice produktu

Aplikacja jest polska, komunikacja wyłącznie po polsku. Ton: pomocny, konkretny, bez zbędnego patosu. Produkt ma być postrzegany jako profesjonalne narzędzie pracy, nie zabawka.

### Obecna identyfikacja wizualna

- **Brand:** "Marketplace AI" — słowo "AI" w kroju Instrument Serif italic w kolorze primary
- **Typografia:** Space Grotesk (główna), Instrument Serif (akcenty)
- **Kolor primary:** pomarańczowy — light: `hsl(24 100% 50%)`, dark: `hsl(24 100% 55%)`
- **Dark mode:** obsługiwany przez CSS variables, bez prefiksów `dark:`
- **Animacje:** fade-in, slide-up, staggered entrance; respektują `prefers-reduced-motion`

---

## Sekcja 1 — Design System — stan obecny

### Tokeny kolorów

| Token | Zastosowanie | Light | Dark |
|---|---|---|---|
| `primary` | CTA, brand accent | pomarańczowy | jaśniejszy pomarańczowy |
| `success` | Opublikowane, checkmarki | zielony | zielony |
| `destructive` | Błędy, usuwanie | czerwony | czerwony |
| `warning` | Ostrzeżenia | bursztynowy | bursztynowy |
| `muted` | Tła drugorzędne, placeholdery | jasny szary | ciemny szary |
| `card` | Tło kart | off-white | ciemny |
| `border` | Obramowania | szary | szary |

Kolory platform są celowo hardkodowane (nie tokeny):
- OLX: `text-orange-500`
- Allegro: `text-green-600`
- Facebook: `text-blue-600`
- Vinted: `text-teal-600`

### Typografia

- **Nagłówki stron:** `text-4xl font-bold tracking-tight` (Space Grotesk)
- **Nagłówki sekcji:** `text-xl/2xl font-semibold`
- **Body:** domyślny Space Grotesk
- **Akcenty:** Instrument Serif italic (brand, powitania użytkownika, hero headline)

### Komponenty bazowe

Biblioteka własna stylizowana podobnie do shadcn/ui:
`Button`, `Input`, `Textarea`, `Card`, `CardWrapper`, `Alert`, `Badge`, `Dialog`

Brakuje: `Tooltip`, `Skeleton` (jest tylko prymitywny), `Toast` (zamiast toastów używany jest komponent `Alert` inline lub natywne okna `alert()` i `confirm()` przeglądarki), `Tabs`.

### Problemy design systemu

1. **Brak toastów/notyfikacji** — powiadomienia o sukcesie/błędzie są mieszane: czasem `Alert` inline, czasem `alert()` natywny przeglądarki (np. przy błędzie zapisu ogłoszenia), czasem reload strony. Brak spójności.
2. **Brak komponentu Skeleton** — placeholdery ładowania są zaimplementowane ad-hoc per komponent.
3. **Brak Tooltip** — niektóre ikony bez etykiet tekstowych mogą być niejasne dla nowych użytkowników.
4. **Niespójne rozmiary przycisków** — CTA `size="lg"` (h-14) na wynikach generowania vs standardowe przyciski w reszcie aplikacji.

### Wymagania

- Ujednolicony system notyfikacji (sukces, błąd, info) spójny wizualnie i pozycyjnie w całej aplikacji
- Spójne stany ładowania per komponent
- Jasne zasady kiedy używać `size="lg"` vs `size="sm"` vs domyślny

---

## Sekcja 2 — Strona główna (gość)

### Stan obecny

Strona pełnoekranowa bez sidebaru. Struktura:

```
[Header: Logo | Zaloguj się | ThemeToggle]
[Hero: nagłówek + podtytuł]
[Formularz: 4 karty w układzie 2x2]
[Footer: linki]
```

**Header:** Logo po lewej (ikona ShoppingBag + "Marketplace AI"), przycisk "Zaloguj się" + toggle motywu po prawej.

**Hero:**
- Nagłówek: „Sprzedaj szybciej *z lepszym opisem*" (italic accent)
- Podtytuł: „Wrzuć zdjęcia, AI stworzy profesjonalne ogłoszenie gotowe na OLX, Allegro, Facebook i Vinted."
- Animacja: `animate-slide-up`

**Formularz (4 karty):**
1. **Karta 1 — Zdjęcia:** opcjonalna nazwa produktu + dropzone
2. **Karta 2 — Platforma i ton:** siatka 2×2 platform + selektor tonu (desktop: segmented control, mobile: radio)
3. **Karta 3 — Parametry:** stan produktu (segmented), cena (segmented), dostawa (checkboxy)
4. **Karta 4 — Notatki i CTA:** textarea na dodatkowe info + przycisk „Generuj ogłoszenie"

**FullscreenLoading:** Portal z-9999, spinner, dynamiczne komunikaty z progressbarem.

**Wyniki generowania (po sukcesie):**
Układ 65/35:
- Lewa kolumna (65%): tytuł + opis z edycją inline, ikonki kopiowania
- Prawa kolumna (35%): karta parametrów, sugestia cenowa, analiza zdjęć z miniaturami

Przyciski akcji nad wynikami (gość — brak przycisku „Zapisz"; zapis jest możliwy wyłącznie przez SoftWallModal):
- Gość: „Nowe ogłoszenie" (reset)
- Na błędzie: „Popraw" (retry) + „Nowe ogłoszenie" (reset)

**SoftWallModal (1.5s po wynikach):**
- Tryb „save": zachęta do logowania, lista benefitów, CTA „Zaloguj się i zapisz", przycisk „Kontynuuj bez zapisywania"
- Tryb „limit": limit wyczerpany (pomarańczowy motyw), CTA „Zarejestruj się za darmo", brak przycisku X ani „Kontynuuj" — modal jest jedyną dostępną akcją

**Footer:** linki do cennika i listy platform.

### Problemy

1. **Hero jest zbyt generyczny** — nagłówek i podtytuł nie wyróżniają produktu. Nie ma żadnego wizualnego „wow", przykładu outputu ani social proof.
2. **4 równorzędne karty bez hierarchii** — formularz wygląda jak długi checklist. Nie prowadzi użytkownika przez kolejne kroki.
3. **Brak wskazania co produkt robi** — nowy użytkownik nie widzi przykładu wyjścia AI przed wrzuceniem zdjęcia. Brak proof of concept.
4. **SoftWallModal — tryb „limit"** nie ma przycisku zamknięcia ani „Kontynuuj" — użytkownik który wyczerpał limit nie ma ścieżki powrotu do treści bez rejestracji.
5. **CTA „Generuj ogłoszenie" jest pomarańczowy i duży, ale jest dopiero na 4. karcie** — na mobile jest bardzo nisko.
6. **Wyniki nie mają wizualnego oddechu** — po long-scrollu formularza wyniki pojawiają się w tym samym kontekście bez wyraźnego przejścia.
7. **Analiza zdjęć w prawej kolumnie** — miniatura + opis oceny jest mało czytelna; brak wizualnej skali jakości.
8. **Header gościa nie komunikuje wartości** — „Zaloguj się" jako jedyna akcja nie zachęca do wypróbowania.

### Wymagania

- Hero musi od razu komunikować wartość produktu — idealne miejsce na przykład wygenerowanego ogłoszenia lub animację procesu
- Formularz powinien dawać użytkownikowi jasne poczucie kolejności kroków i postępu — bez przytłoczenia równorzędnymi wyborami
- Ścieżka gościa po wyczerpaniu limitu musi dawać jasną alternatywę bez ślepego zaułku
- Przejście „formularz → wyniki" powinno być wizualnie wyraźne
- Wyniki generowania powinny być czytelne i zachęcające do zapisu — to moment konwersji

---

## Sekcja 3 — Nowe ogłoszenie (zalogowany użytkownik)

### Stan obecny

Strona `/dashboard/new` w layoucie dashboardu (sidebar + main content). Używa tego samego komponentu `AdGeneratorForm` co strona główna, z włączonym nagłówkiem.

**Nagłówek formularza:**
- Tytuł: „Nowe ogłoszenie"
- Podtytuł: „Wgraj zdjęcia i wygeneruj profesjonalne ogłoszenie"

**Formularz:** identyczny jak na stronie głównej (4 karty).

**Po wygenerowaniu — przyciski akcji:**
- „Zapisz" (zielony, ikona Check) → zapis + redirect do `/dashboard/ads`
- „Zapisz i stwórz następne" (niebieski/primary, ikona RotateCcw) → zapis + reset formularza w miejscu
- Oba przyciski wyłączone gdy tytuł lub opis jest pusty
- „Zapisywanie…" podczas operacji

**Edycja inline wyników:**
- Kliknięcie ołówka → pole edytowalne z autofocusem
- Licznik znaków platform-specific (czerwony > 90%)
- Escape / Cmd+Enter → wyjście z edycji

### Problemy

1. **Formularz jest identyczny jak dla gościa** — zalogowany użytkownik nie ma żadnych dodatkowych udogodnień (np. podpowiedzi z poprzednich ogłoszeń, szybki wybór platformy z historii).
2. **Układ 2×2 kart na desktop jest niezrównoważony** — karty mają różne wysokości, co tworzy nieregularny siatka.
3. **„Zapisz" i „Zapisz i stwórz następne" są obok siebie** — podobne akcje, różne skutki (redirect vs reset). Może być mylące.
4. **Wyniki edycji inline nie mają wizualnego stanu „zmieniono"** — użytkownik nie wie czy jego edycja zostanie zapisana.
5. **Prawa kolumna wyników (parametry + cena + zdjęcia) jest zatłoczona** — 3 sekcje w 35% szerokości.
6. **Analiza jakości zdjęć** — ocena „OK" / „Uwaga" to binarny badge; brak gradacji ani konkretnych wskazówek co poprawić.
7. **Licznik znaków** — pojawia się tylko w trybie edycji, niewidoczny przed kliknięciem ołówka.

### Wymagania

- Użytkownik musi rozumieć skutek każdej akcji (przekierowanie do listy vs reset formularza w miejscu) przed jej wykonaniem, bez konieczności próbowania
- Wyniki powinny dawać poczucie „gotowości do publikacji" — checklistę tego co jest dobre
- Jakość zdjęć powinna być oceniana w sposób bardziej użyteczny niż binarny badge

---

## Sekcja 4 — Dashboard (przegląd)

### Stan obecny

Strona `/dashboard` — główny ekran po zalogowaniu.

**Struktura:**
```
[Sidebar] | [Nagłówek: powitanie + przycisk "Nowe ogłoszenie"]
           | [StatsCards: 4 karty w siatce]
           | [RecentAdsList: ostatnie 5 ogłoszeń]
```

**Powitanie:** Nagłówek strony to „Pulpit" (`h1`, `text-4xl`, `font-bold`), pod nim podtytuł z imieniem użytkownika: „Witaj ponownie, *{imię}*!". Oba elementy objęte animacją `animate-fade-in`.

**Statystyki (4 karty, 2 kol. mobile / 4 kol. desktop):**
| Karta | Ikona | Kolor |
|---|---|---|
| Wszystkie | FileText | primary |
| Robocze | Edit | muted |
| Opublikowane | CheckCircle | success |
| Sprzedane | DollarSign | primary |

Staggered entrance animation (`animate-stagger-1` przez `4`).

**Lista ostatnich 5 ogłoszeń:** kompaktowe karty z miniaturą, tytułem, platformą, statusem, datą, przyciskami akcji.

**Sidebar (desktop):** fixed, `w-72`, pełna wysokość.

**Sidebar (mobile):** overlay drawer, hamburger button top-left, backdrop.

**Sidebar — zawartość:**
1. Logo
2. Nawigacja: Pulpit, Ogłoszenia, Szablony, Cennik
3. Kredyty: `X/Y` + boost + data odnowienia + link do cennika
4. Użytkownik: avatar + imię + email + badge planu
5. Wyloguj + toggle motywu

**FAB (mobile):** fixed bottom-right „+ Nowe ogłoszenie".

### Problemy

1. **Dashboard nie daje kontekstu co dalej** — nowy użytkownik z 0 ogłoszeniami widzi pustą listę bez wskazówki co zrobić.
2. **Statystyki są płaskie** — 4 liczby bez trendu, historii ani kontekstu. Nie wiadomo czy to dobrze czy źle mieć 12 szkiców.
3. **„Szablony" w nawigacji prowadzi do strony-placeholdera** — strona `/dashboard/templates` istnieje i wyświetla komunikat „Funkcja szablonów zostanie dodana w przyszłości." (komponent `Alert`). Nie jest to blank screen ani 404, ale pełnoprawna strona w nawigacji z komunikatem „coming soon" jest niespójnym wzorcem — sugeruje funkcję której nie ma, bez żadnej alternatywy ani daty.
4. **Sidebar — sekcja kredytów** jest informatywna ale wizualnie ciężka: 4 linie tekstu, link, czasem przycisk portalu. Trudno szybko skanować.
5. **Plan badge** (FREE/STARTER/etc.) jest w sekcji użytkownika na dole sidebaru — nisko widoczny, a to ważna informacja dla konwersji.
6. **Powitanie z imieniem** zajmuje dużo miejsca w nagłówku; na mobile jest ucięte.
7. **Lista ostatnich ogłoszeń na dashboardzie** vs **pełna lista na `/dashboard/ads`** — dwie listy z podobnym UI, brak wyraźnego rozróżnienia roli każdej z nich.
8. **Brak pustego stanu z akcją** — gdy użytkownik ma 0 ogłoszeń, lista jest pusta bez żadnego CTA.

### Wymagania

- Pusty stan dashboardu musi prowadzić do pierwszej akcji (stworzenia ogłoszenia)
- Sidebar musi być skanowalne w < 2 sekundy — kredyty i plan to kluczowe informacje
- Nawigacja powinna jasno komunikować które funkcje są dostępne, a które są planowane — bez sugerowania funkcjonalności której nie ma
- Dashboard powinien dawać poczucie postępu, nie tylko liczniki

---

## Sekcja 5 — Lista ogłoszeń (`/dashboard/ads`)

### Stan obecny

Strona `/dashboard/ads` — zarządzanie ogłoszeniami.

**Filtrowanie i sortowanie:**

Desktop (≥ 640px): inline bar z dropdownami Status, Platforma, Sort + licznik ogłoszeń + checkbox „Zaznacz wszystkie".

Mobile (< 640px): przycisk „Sortuj i filtruj" z badges aktywnych filtrów → otwiera drawer od lewej (animowany slide-in, backdrop, blokada scroll). Drawer zawiera te same opcje co desktop.

Wyszukiwanie: debounce 500ms, bez submit.

**Karta ogłoszenia (kompaktowa):**
```
[Miniatura 144x144] [Tytuł]                    [Data]
                    [Ikona platformy] [Status] [Cena]
                    [Opis (3 linie)]     [Przyciski akcji]
```

Statusy:
- DRAFT: „Wersja robocza" (muted)
- PUBLISHED: „Opublikowane" (success)
- SOLD: „Sprzedane" (primary)

Przyciski akcji per status:
- DRAFT: Opublikuj (CheckCircle, zielony) | Eye | Edit | Trash
- PUBLISHED: Sprzedane (CircleDollarSign, primary) | Eye | Edit | Trash
- SOLD: Eye | Trash (bez Edit)

**Bulk selection:** checkbox na każdej karcie, „Zaznacz wszystkie", pasek akcji z CSV export.

**Paginacja:** 20 ogłoszeń/stronę, numeracja z ellipsis, Poprzednia/Następna.

**Pusty stan:**
- Brak ogłoszeń: „Nie masz jeszcze żadnych ogłoszeń"
- Brak wyników filtrów: „Brak ogłoszeń spełniających wybrane kryteria"

### Problemy

1. **Karta ogłoszenia jest gęsta** — miniatura 144px, 3 linie opisu, 4 przyciski — na mobile to za dużo w jednym rzędzie.
2. **Ikony platformy bez tooltipów** — nowy użytkownik może nie wiedzieć co oznacza ikona ShoppingBag vs Store.
3. **Przyciski akcji na karcie są małe i blisko siebie** — na mobile ryzyko fat-finger, szczególnie Trash vs Edit.
4. **Status „Sprzedane" używa koloru primary (pomarańczowy)** — pomarańczowy jest też kolorem CTA. Semantycznie mylące.
5. **Drawer mobilny jest identyczny wizualnie z sidebariem nawigacyjnym** — te same style, ale różna funkcja. Może dezorientować.
6. **Brak grupowania ogłoszeń** — lista jest chronologiczna; przy dużej liczbie ogłoszeń brak możliwości grupowania po platformie czy statusie.
7. **Pusty stan „brak wyników filtrów"** nie ma przycisku „Wyczyść filtry".
8. **Akcja „Sprzedane" używa natywnego `prompt()` do zbierania ceny** — dialog przeglądarki jest wizualnie spoza aplikacji i niespójny z jej UI. Akcja „Opublikuj" używa natywnego `confirm()` — również niespójne. Oba wzorce psują doświadczenie użytkownika.
9. **Strona szczegółów ogłoszenia (`/dashboard/ads/[id]`) istnieje** — wyświetla tytuł, platformę, status, opis, zdjęcia, cenę i metadane. Jednak edycja z poziomu tej strony jest ograniczona, a nawigacja powrotna na mobile jest słabo widoczna.

### Wymagania

- Karta ogłoszenia musi być czytelna i wygodna do obsługi na mobile
- Statusy ogłoszeń muszą mieć spójną i intuicyjną semantykę kolorystyczną
- Pusty stan z aktywnymi filtrami musi mieć ścieżkę wyjścia (wyczyść filtry)
- Destruktywne lub nieodwracalne akcje (zmiana statusu, usunięcie) wymagają spójnego wzorca potwierdzenia — bez użycia natywnych dialogów przeglądarki (`confirm()`, `prompt()`)

---

## Sekcja 6 — Cennik (`/pricing`)

### Stan obecny

Strona publiczna, dostępna bez logowania.

**Header:**
- Powrót: „Wróć do panelu" (zalogowany) lub „Strona główna" (gość)
- Logo centrowane

**Hero:** „Wybierz plan dla siebie" + podtytuł.

**Siatka planów (1 kol. mobile / 2 kol. tablet / 4 kol. desktop):**

| Plan | Cena | Kredyty | Zdjęcia |
|---|---|---|---|
| FREE | 0 zł | 5/mc | 3 |
| STARTER | 19,99 zł/mc | 30/mc | 5 |
| RESELER | 49,99 zł/mc | 80/mc | 8 |
| BUSINESS | 99,99 zł/mc | 200/mc | 12 |

RESELER wyróżniony: `border-primary border-2 shadow-lg`, badge „Najpopularniejszy".

**Stany CTA:**
- Aktualny plan: „Obecny plan" (disabled)
- Inne plany: „Wybierz [Plan]"
- Gość: wszystkie CTA → signin
- Ładowanie: „Przekierowuję…"

**Boost credits (tylko zalogowani):** 3 pakiety jednorazowe (10/30/60 kredytów).

**FAQ:** 5 pytań w collapsible `<details>` z animowanym chevronem.

### Problemy

1. **Cztery kolumny na desktop to za dużo** — karty są wąskie, tekst jest zbity, trudno porównywać plany.
2. **Różnica między planami nie jest wyraźna** — lista ficzerów jest podobna dla wszystkich; nie wiadomo co realnie zyskuję upgradeując z STARTER do RESELER.
3. **Boost credits sekcja jest ukryta dla gości** — gość nie wie że taka opcja istnieje. Bariera do konwersji.
4. **FAQ używa natywnego `<details>`** — brak spójności z resztą UI (accordion powinien używać komponentu bibliotecznego).
5. **Powrót do panelu/strony głównej** — link jest mały i po lewej; użytkownik po sprawdzeniu cennika może mieć problem z orientacją.
6. **Na mobile siatka 1-kolumnowa** — 4 karty jedna pod drugą to bardzo długie scrollowanie.

### Wymagania

- Plany muszą być łatwe do porównania — różnice między tierami czytelne na pierwszy rzut oka
- Strona cennika musi działać dobrze dla gości (zachęcać do rejestracji) i dla zalogowanych (zachęcać do upgrade'u)
- FAQ powinien być spójny wizualnie z resztą aplikacji

---

## Sekcja 7 — Stany specjalne

### Ładowanie (`FullscreenLoading`)

**Stan obecny:**
- Pełnoekranowy overlay (z-9999 portal)
- Spinner (dual-ring), nagłówek „AI pracuje…"
- Dynamiczne komunikaty w 2 fazach (progress 0-100% → indeterminate po 100%)
- Progressbar: determinate (smooth) → indeterminate (pulsing)
- Czas: ~10s + 1s/zdjęcie

**Problemy:**
1. Spinner i progressbar mogą być postrzegane jako redundantne — oba sygnalizują aktywność w tym samym czasie.
2. Komunikaty fazowe są techniczne — użytkownik nie potrzebuje wiedzieć że AI „ocenia jakość zdjęć".
3. Brak możliwości anulowania generowania (przycisk Cancel nie istnieje, choć `AbortController` jest zaimplementowany w kodzie).
4. Na slow connection faza indeterminate trwa zbyt długo bez informacji zwrotnej.

**Wymagania:**
- Stan ładowania musi dawać poczucie postępu bez technicznego żargonu
- Użytkownik powinien mieć możliwość anulowania długiego generowania

### Brak kredytów

**Stan obecny:**
- Przycisk „Generuj ogłoszenie" jest disabled
- Pod przyciskiem pojawia się CTA: „Zmień plan lub dokup kredyty" (link do /pricing)
- Sidebar pokazuje „0/5"

**Problemy:**
1. Disabled button bez tooltipa — użytkownik może nie wiedzieć dlaczego nie działa.
2. CTA pod przyciskiem jest drobne i łatwe do przeoczenia.
3. Brak rozróżnienia wizualnego między „brak kredytów subskrypcyjnych" a „brak kredytów boost".

**Wymagania:**
- Stan braku kredytów musi być natychmiast czytelny z jasną ścieżką do rozwiązania
- Sidebar i formularz muszą spójnie komunikować ten stan

### Błąd generowania

**Stan obecny:**
- Alert inline z czerwonym tłem
- Komunikat błędu + przycisk „Zamknij"
- Po błędzie: przyciski „Popraw" (retry) i „Nowe ogłoszenie" (reset)

**Problemy:**
1. Alert pojawia się w środku strony, niekoniecznie widoczny bez scrollowania.
2. Przycisk „Popraw" vs „Nowe ogłoszenie" — różnica nie jest oczywista dla użytkownika (jeden wraca do formularza z danymi, drugi czyści wszystko).

**Wymagania:**
- Błędy muszą być widoczne bez scrollowania
- Akcje odtworzeniowe muszą jasno komunikować różnicę między retry a reset

### Offline

**Stan obecny:**
- Czerwony banner fullwidth na górze ekranu: „Brak połączenia z internetem"
- Przycisk generowania disabled

**Problemy:**
1. Banner jest dobrze widoczny, ale znika gdy user wraca online — brak komunikatu „Połączenie przywrócone".

**Wymagania:**
- Przywrócenie połączenia powinno być potwierdzone komunikatem

### Stany puste

| Ekran | Obecny pusty stan | Problem |
|---|---|---|
| Dashboard — lista ostatnich ogłoszeń (0 ogłoszeń) | Brak komunikatu — lista jest pusta | Brak CTA |
| Lista ogłoszeń `/dashboard/ads` (0 ogłoszeń) | „Nie masz jeszcze żadnych ogłoszeń" (tekst w karcie) | Brak CTA |
| Lista ogłoszeń `/dashboard/ads` (0 wyników filtrów) | „Brak ogłoszeń spełniających wybrane kryteria" | Brak przycisku „Wyczyść filtry" |

**Wymagania:**
- Każdy pusty stan musi mieć jasną akcję prowadzącą do wypełnienia go

---

## Sekcja 8 — Priorytety i zakres prac

### Matryca priorytetów

| # | Problem | Wpływ na UX | Pilność | Uwagi |
|---|---|---|---|---|
| 1 | Stany puste bez CTA | Wysoki | Pilne | Nowi użytkownicy utknięci bez wskazówek |
| 2 | Nawigacja „Szablony" — coming soon bez kontekstu | Wysoki | Pilne | Niespójny wzorzec — strona placeholder w głównej nawigacji |
| 3 | Brak spójnego systemu notyfikacji (toast) | Wysoki | Pilne | `alert()` i `confirm()` native w kilku ścieżkach |
| 4 | Strona główna — hero bez proof of concept | Wysoki | Pilne | Kluczowy punkt konwersji gości |
| 5 | Stan braku kredytów mało widoczny | Wysoki | Pilne | Blokuje użytkowników bez jasnego wyjścia |
| 6 | Akcje na liście ogłoszeń używają natywnych dialogów | Wysoki | Pilne | `confirm()` przy Opublikuj, `prompt()` przy Sprzedane — spoza UI aplikacji |
| 7 | Formularz — brak poczucia progresu | Średni | Ważne | 4 równorzędne karty dezorientują |
| 8 | Karta ogłoszenia — gęsta na mobile | Średni | Ważne | Główny widok zarządzający |
| 9 | Semantyka kolorów statusów (SOLD = primary) | Średni | Ważne | Myli z kolorem CTA |
| 10 | Cennik — porównanie planów nieczytelne | Średni | Ważne | Kluczowy dla konwersji |
| 11 | Strona szczegółów ogłoszenia — ograniczona edycja i nawigacja | Średni | Ważne | Strona istnieje, ale brak akcji edycji i słaba nawigacja powrotna na mobile |
| 12 | FullscreenLoading — brak Cancel | Niski | Nice-to-have | Frustrating przy slow connection |
| 13 | Sidebar — sekcja kredytów za gęsta | Niski | Nice-to-have | Czytelność |
| 14 | FAQ na cenniku — natywny `<details>` | Niski | Nice-to-have | Niespójność wizualna |
| 15 | Brak tooltipów na ikonach platformy | Niski | Nice-to-have | Accessibility |

### Zakres redesignu — co jest w scope

- Wszystkie ekrany opisane w sekcjach 2–6
- Design system: tokeny, typografia, komponenty bazowe
- Stany specjalne: ładowanie, błędy, puste stany, offline
- Responsywność: mobile / tablet / desktop

### Co jest poza scope

- Logika generowania AI
- System płatności Stripe
- Backend i API
- Nowe funkcje (szablony, bulk edit, historia)

---

*Dokument wygenerowany: 2026-03-13*
*Wersja: 1.0*
