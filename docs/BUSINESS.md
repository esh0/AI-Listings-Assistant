# Marketplace Assistant — Dokumentacja Biznesowa

> **Wersja:** 1.0
> **Data:** 2026-03-06
> **Status:** W przygotowaniu do uruchomienia komercyjnego

---

## Spis treści

1. [Wizja produktu](#1-wizja-produktu)
2. [Analiza konkurencji](#2-analiza-konkurencji)
3. [Grupa docelowa](#3-grupa-docelowa)
4. [Model cenowy](#4-model-cenowy)
5. [Kalkulacja finansowa](#5-kalkulacja-finansowa)
6. [Model AI i koszty API](#6-model-ai-i-koszty-api)
7. [System identyfikacji gości](#7-system-identyfikacji-gości)
8. [Kompletny opis funkcji](#8-kompletny-opis-funkcji)
9. [Opis interfejsu użytkownika (UI)](#9-opis-interfejsu-użytkownika-ui)
10. [Wymogi prawne](#10-wymogi-prawne)
11. [Roadmap](#11-roadmap)

---

## 1. Wizja produktu

### Czym jest Marketplace Assistant?

Marketplace Assistant to aplikacja webowa wykorzystująca sztuczną inteligencję do automatycznego generowania profesjonalnych ogłoszeń sprzedażowych na polskie platformy marketplace: **OLX**, **Allegro Lokalnie**, **Facebook Marketplace** i **Vinted**.

Użytkownik wrzuca zdjęcia produktu, wybiera platformę i ton komunikacji — a AI analizuje zdjęcia i generuje gotowe ogłoszenie: tytuł, opis, sugestię ceny. Treść jest zoptymalizowana pod zasady konkretnej platformy i dostosowana do wybranego stylu komunikacji.

### Jaki problem rozwiązuje?

Pisanie ogłoszeń jest żmudne. Większość sprzedawców:
- Pisze krótkie, nijakie opisy ("sprzedam, stan dobry")
- Nie zna zasad i limitów poszczególnych platform
- Nie wie jak pisać, żeby ogłoszenie się wyróżniło
- Traci czas na przepisywanie między platformami

Marketplace Assistant zamienia 15-30 minut pisania w 30 sekund. Efekt: profesjonalny opis, który zwiększa szansę na szybką sprzedaż.

### Jaką wartość daje?

- **Oszczędność czasu** — generacja w ~3-10 sekund
- **Wyższa jakość** — opisy zgodne z best practices platformy
- **Multi-platform** — jedno zdjęcie, 4 platformy
- **Analiza AI** — rozpoznaje cechy produktu ze zdjęć
- **Sugestie cenowe** — AI szacuje wartość rynkową

### Pozycjonowanie

Jedyne dedykowane narzędzie do generowania ogłoszeń marketplace skupione na **polskim rynku**, z natywnym wsparciem:
- Polskich platform (OLX, Allegro Lokalnie, Facebook Marketplace)
- Polskiego języka i kultury sprzedaży
- Polskich metod płatności (BLIK, Przelewy24)
- Polskiego prawa (RODO, regulamin, polityka prywatności)

---

## 2. Analiza konkurencji

### SharkScribe AI

**Adres:** sharkscribeai.com

**Opis:** Globalny generator opisów produktowych z AI. Obsługuje Amazon, eBay, Vinted, Allegro.

**Cennik:**
| Plan | Cena | Generacje/mies. | Zdjęcia/gen. |
|---|---|---|---|
| Free | $0 | 5 | 1 |
| Standard | $1.99/mies. (~8 zł) | 30 | 3 |
| Premium | $4.99/mies. (~20 zł) | Unlimited | Unlimited |

**Mocne strony:**
- Niskie ceny
- Browser extension do auto-fill
- Obsługa wielu platform globalnych

**Słabe strony:**
- Brak dedykowanego wsparcia OLX i Facebook Marketplace
- Brak polskojęzycznego interfejsu
- Brak tonów komunikacji dostosowanych do polskiego rynku
- Brak zasad platform (np. limity znaków OLX, format Allegro Lokalnie)
- Ograniczona jakość polskich opisów (globalne LLM bez fine-tuningu)

### Nasza przewaga konkurencyjna

| Cecha | SharkScribe AI | Marketplace Assistant |
|---|---|---|
| Platformy PL | Allegro, Vinted | OLX, Allegro, FB, Vinted |
| Interfejs PL | Nie | Tak |
| Tony komunikacji | Brak | 3 tony (Professional, Friendly, Casual) |
| Zasady platform | Ogólne | Dedykowane reguły per platforma |
| Limity znaków | Brak | Walidacja per platforma |
| Analiza zdjęć | Tak | Tak + feedback jakości |
| Sugestia ceny | Nie | Tak (AI suggest z uzasadnieniem) |
| BLIK / płatności PL | Nie | Tak (Stripe) |
| RODO compliance | Nie (US-based) | Tak |

### Inne narzędzia na rynku

Na dzień sporządzenia dokumentacji nie zidentyfikowano bezpośrednich konkurentów oferujących dedykowane generowanie ogłoszeń AI na polskie platformy marketplace. Istnieją ogólne narzędzia copywriterskie (np. Jasper, Copy.ai), ale nie są wyspecjalizowane w ogłoszeniach sprzedażowych.

---

## 3. Grupa docelowa

### Segmenty użytkowników

**Segment 1: Sprzedawcy okazjonalni** (najliczniejszy)
- Osoby sprzedające używane rzeczy: wyprzedaż szafy, garażu, przeprowadzka
- 1-5 ogłoszeń/miesiąc
- Wrażliwi cenowo, preferują darmowy plan
- Główne platformy: OLX, Facebook Marketplace
- Oczekiwania: szybkość, prostota, dobre opisy

**Segment 2: Reselerzy / sprzedawcy regularni**
- Osoby zarabiające na kupnie-sprzedaży
- 15-50 ogłoszeń/miesiąc
- Gotowi płacić za oszczędność czasu
- Multi-platform: OLX, Allegro Lokalnie, Vinted
- Oczekiwania: szablony, hurtowe generowanie, szybkość

**Segment 3: Małe biznesy / komisy**
- Jednoosobowe działalności, komisy, second-handy
- 50-200+ ogłoszeń/miesiąc
- Najwyższa gotowość płatnicza
- Oczekiwania: wysoka jakość, eksport, masowe przetwarzanie

### Konwersja między segmentami

```
Goście (bez rejestracji)
    ↓ 3-5% rejestracja
Free (0 zł, 5 gen/mies.)
    ↓ 8-12% upgrade
Starter (19,99 zł)
    ↓ 15-20% upgrade
Reseler (49,99 zł)
```

---

## 4. Model cenowy

### Tiery subskrypcji

| | **Free** | **Starter** | **Reseler** |
|---|---|---|---|
| **Cena** | 0 zł/mies. | 19,99 zł/mies. | 49,99 zł/mies. |
| **Generacje/mies.** | 5 | 30 | 80 |
| **Max zdjęć/gen.** | 3 | 5 | 8 |
| **Szablony opisów** | — | 3 | 10 |
| **Eksport CSV** | — | ✓ | ✓ |
| **Priorytet generacji** | — | — | ✓ |
| **Wsparcie** | — | Email | Email |
| **Zapamiętywanie preferencji** | — | ✓ | ✓ |

### Dostawki kredytów (jednorazowe)

Użytkownik może w dowolnym momencie dokupić pakiet kredytów. Dostawki **nie zwiększają** limitu zdjęć — ten zależy wyłącznie od tieru subskrypcji.

| Pakiet | Cena | Cena/kredyt |
|---|---|---|
| 10 kredytów | 9,99 zł | ~1,00 zł |
| 30 kredytów | 24,99 zł | ~0,83 zł |
| 60 kredytów | 39,99 zł | ~0,67 zł |

### Logika kredytów

- **Kredyt z subskrypcji** resetuje się co miesiąc (niewykorzystane przepadają)
- **Kredyt z dostawki** nie wygasa — jest dostępny do wykorzystania
- System zużywa najpierw **kredyty subskrypcji**, potem **dostawkowe**
- Kredyt konsumowany jest **na etapie generacji** (przed zapisem), co zapobiega nadużyciom
- Zmiana tieru: nowe limity obowiązują od następnego okresu rozliczeniowego

### Uzasadnienie cen

**Free (0 zł, 5 gen, 2 zdjęcia):**
- Wystarczająco, żeby przetestować narzędzie
- Limit 2 zdjęć ogranicza koszty API
- Motywacja do rejestracji i upgrade'u

**Starter (19,99 zł, 30 gen, 5 zdjęć):**
- Pokrywa potrzeby sprzedawcy okazjonalnego (~1 ogłoszenie dziennie)
- 5 zdjęć daje AI więcej kontekstu do analizy
- Cena porównywalna z kawą dziennie — niska bariera psychologiczna

**Reseler (49,99 zł, 80 gen, 8 zdjęć):**
- Dla regularnych sprzedawców: ~2-3 ogłoszenia dziennie
- 8 zdjęć pokrywa potrzeby profesjonalnych listingów
- Priorytet generacji = szybsza obsługa w godzinach szczytu
- Szablony (10) to kluczowy feature oszczędzający czas reselerom

---

## 5. Kalkulacja finansowa

### Koszty stałe (miesięczne)

| Pozycja | Koszt | Uwagi |
|---|---|---|
| Vercel Pro | ~80 zł ($20) | Hosting, CI/CD, serverless |
| Supabase Pro | ~100 zł ($25) | PostgreSQL, Storage, Auth infra |
| Domena | ~5 zł | Roczna opłata / 12 |
| Email biznesowy | ~10 zł | Np. Google Workspace lub darmowy |
| **Razem stałe** | **~195 zł** | |

### Koszty zmienne

| Pozycja | Koszt | Uwagi |
|---|---|---|
| OpenAI API | ~0,02-0,12 zł/gen. | Zależy od liczby zdjęć (model: GPT-4.1 mini) |
| Stripe prowizje | ~1.5% + 0.50 zł/transakcja | BLIK/karty w Polsce |
| Supabase Storage | ~0,021 zł/GB | Zdjęcia (thumbnails ~50-100KB/szt.) |

### Scenariusze przychodowe

#### Scenariusz minimalny: 4 000 zł netto/mies.

| Tier | Użytkownicy | Przychód |
|---|---|---|
| Free | 2 000 | 0 zł |
| Starter (19,99 zł) | 60 | 1 199 zł |
| Reseler (49,99 zł) | 40 | 2 000 zł |
| Dostawki | ~15 zakupów | 375 zł |
| **Razem przychód** | | **3 574 zł** |
| Koszty stałe | | -195 zł |
| OpenAI API (~2 500 gen.) | | -150 zł |
| Stripe prowizje (~1.5%) | | -55 zł |
| **Netto** | | **~3 174 zł** |

*Wymaga ~100 płacących użytkowników i ~2 000 zarejestrowanych (konwersja ~5%).*

#### Scenariusz docelowy: 5 000 zł netto/mies.

| Tier | Użytkownicy | Przychód |
|---|---|---|
| Free | 3 500 | 0 zł |
| Starter (19,99 zł) | 80 | 1 599 zł |
| Reseler (49,99 zł) | 60 | 2 999 zł |
| Dostawki | ~25 zakupów | 625 zł |
| **Razem przychód** | | **5 223 zł** |
| Koszty stałe | | -195 zł |
| OpenAI API (~4 000 gen.) | | -240 zł |
| Stripe prowizje (~1.5%) | | -80 zł |
| **Netto** | | **~4 708 zł** |

*Wymaga ~140 płacących użytkowników i ~3 500 zarejestrowanych (konwersja ~4%).*

#### Scenariusz optymistyczny: 8 000 zł netto/mies.

| Tier | Użytkownicy | Przychód |
|---|---|---|
| Free | 6 000 | 0 zł |
| Starter (19,99 zł) | 150 | 2 999 zł |
| Reseler (49,99 zł) | 100 | 4 999 zł |
| Dostawki | ~50 zakupów | 1 250 zł |
| **Razem przychód** | | **9 248 zł** |
| Koszty stałe | | -195 zł |
| OpenAI API (~8 000 gen.) | | -480 zł |
| Stripe prowizje (~1.5%) | | -140 zł |
| **Netto** | | **~8 433 zł** |

*Wymaga ~250 płacących użytkowników i ~6 000 zarejestrowanych.*

### Break-even

Przy kosztach stałych ~195 zł/mies., break-even osiągnięty przy zaledwie **10 użytkownikach planu Starter** (199,90 zł). Dzięki niskiemu kosztowi stałemu projekt staje się opłacalny bardzo szybko.

### Uwagi do VAT i podatków

- JDG z VAT: ceny w dokumentacji są **netto** — do cen dla użytkownika należy doliczyć 23% VAT
- Alternatywnie: ceny mogą być brutto (zawierać VAT), co oznacza niższy przychód netto
- **Rekomendacja:** Wyświetlaj ceny brutto (z VAT) na stronie — polscy konsumenci oczekują cen z VAT
- Rozliczenie VAT: miesięczne lub kwartalne (zależnie od statusu VAT-owca)
- **Uwaga:** Jeśli obrót < 200 000 zł/rok, możliwość zwolnienia z VAT (art. 113 ustawy o VAT)

---

## 6. Model AI i koszty API

### Obecna konfiguracja

- **Model:** o4-mini (OpenAI reasoning model)
- **Koszt:** ~0,015 $/request przy 1 zdjęciu (~0,06 zł)
- **Format odpowiedzi:** JSON (structured output)
- **Max tokenów:** 4 000 (output)
- **Analiza obrazu:** detail: "high"

### Rekomendowana zmiana: GPT-4.1 mini

| Parametr | o4-mini (obecny) | GPT-4.1 mini (rekomendowany) |
|---|---|---|
| Typ | Reasoning model | Generative model |
| Koszt input/1M tok. | ~$1.10 | ~$0.40 |
| Koszt output/1M tok. | ~$4.40 | ~$1.60 |
| Vision | ✓ | ✓ |
| Jakość tekstu PL | Bardzo dobra | Dobra (do przetestowania) |
| Szybkość | ~3-8s | ~2-5s |
| **Oszczędność** | — | **~60-65%** |

**Dlaczego zmiana?**
- o4-mini jest modelem "reasoning" — generuje wewnętrzny łańcuch myślenia, za który płacisz
- Generowanie ogłoszeń **nie wymaga reasoning** — to zadanie generatywne (tekst na bazie promptu + zdjęć)
- GPT-4.1 mini oferuje porównywalną jakość tekstu przy znacznie niższym koszcie

**Plan wdrożenia:**
1. Przetestuj GPT-4.1 mini na 20-30 przykładach (różne platformy, tony, typy produktów)
2. Porównaj jakość z o4-mini (subiektywna ocena + ew. feedback od beta-testerów)
3. Jeśli jakość wystarczająca → zmiana modelu w konfiguracji
4. Monitoring kosztów przez pierwszy miesiąc

### Kosztorysy API per tier

Przy modelu **GPT-4.1 mini**:

| Tier | Avg. zdjęć | Koszt/gen. (est.) | Max gen./mies. | Max koszt API/użytkownik |
|---|---|---|---|---|
| Free | 1-2 | ~0,03 zł | 5 | ~0,15 zł |
| Starter | 2-4 | ~0,06 zł | 30 | ~1,80 zł |
| Reseler | 4-6 | ~0,10 zł | 80 | ~8,00 zł |

**Marże per tier:**

| Tier | Przychód | Max koszt API | Marża (minimum) |
|---|---|---|---|
| Free | 0 zł | 0,15 zł | -0,15 zł (akwizycja) |
| Starter | 19,99 zł | 1,80 zł | 18,19 zł (91%) |
| Reseler | 49,99 zł | 8,00 zł | 41,99 zł (84%) |

*Marże są bardzo zdrowe na każdym tierze.*

---

## 7. System identyfikacji gości

### Problem

Niezarejestrowani użytkownicy mogą generować ogłoszenia (soft-wall). Potrzebujemy sposobu na:
- Limitowanie generacji dla gości (zapobieganie nadużyciom)
- Śledzenie wykorzystania bez zbierania danych osobowych (RODO)
- Motywowanie do rejestracji

### Rozwiązanie: 3-warstwowa identyfikacja

**Warstwa 1: Anonimowy UUID (localStorage)**
- Przy pierwszej wizycie generowany jest losowy UUID (np. `guest_a7b3c9d2...`)
- Przechowywany w localStorage przeglądarki
- Nie jest daną osobową w rozumieniu RODO (nie identyfikuje osoby)
- Backend przechowuje: `{ guestId: UUID, generationsUsed: number, firstUsed: Date }`
- Reset przy czyszczeniu przeglądarki → nowe UUID → nowa pula

**Warstwa 2: Rate-limiting po IP**
- Dodatkowe zabezpieczenie server-side
- Max X generacji z jednego IP w ciągu 24h
- Zapobiega obchodzeniu limitu UUID przez czyszczenie localStorage
- Współdzielone sieci (biura, uczelnie) = dodatkowa motywacja do rejestracji
- Przechowywany hash IP (nie surowy IP) → RODO-safe

**Warstwa 3: Hard-wall po wyczerpaniu limitu**
- Po wykorzystaniu limitu gościa → komunikat: "Zarejestruj się za darmo i otrzymaj 5 generacji miesięcznie"
- Nie można generować więcej bez rejestracji
- CTA z przyciskiem "Zaloguj się przez Google"

### Limity dla gości

| Parametr | Limit |
|---|---|
| Generacje (per UUID) | 3 |
| Generacje (per IP / 24h) | 5 |
| Max zdjęć | 1 |
| Soft-wall modal | Po każdej generacji (zachęta do rejestracji) |
| Zapis do bazy | Wymaga rejestracji |

### Korzyści

- Goście mogą **przetestować** produkt bez zobowiązań (konwersja)
- 3-warstwowa ochrona **minimalizuje nadużycia**
- Brak zbierania danych osobowych = **pełna zgodność z RODO**
- "Sąsiad na tym samym IP zużył limit" = **naturalny bodziec do rejestracji**

---

## 8. Kompletny opis funkcji

### 8.1. Generowanie ogłoszeń AI (wdrożone)

**Opis:** Główna funkcja aplikacji. Użytkownik wrzuca zdjęcia produktu, wybiera parametry, a AI generuje gotowe ogłoszenie.

**Przepływ:**
1. Upload zdjęć (drag & drop lub kliknięcie)
2. Wybór platformy docelowej (OLX / Allegro Lokalnie / Facebook Marketplace / Vinted)
3. Wybór tonu komunikacji (Profesjonalny / Przyjazny / Swobodny)
4. Wybór stanu produktu (5 opcji: Nowy → Uszkodzony)
5. Wybór trybu ceny (AI sugeruje / Własna cena / Za darmo)
6. Opcje dostawy (Odbiór osobisty / Wysyłka)
7. Opcjonalnie: nazwa produktu, dodatkowe notatki
8. Kliknięcie "Generuj ogłoszenie"
9. AI analizuje zdjęcia i generuje: tytuł, opis, sugestię ceny

**Parametry AI:**
- Model: GPT-4.1 mini (do zmiany z o4-mini)
- Analiza obrazu: tryb "high detail"
- Strukturyzowana odpowiedź JSON
- Modularny system promptów z regułami per platforma
- System hierarchii informacji (dane użytkownika > fakty ze zdjęć > wnioski AI)
- Język niepewności (3 poziomy pewności z konkretnymi frazami polskimi)

**Obsługiwane platformy i limity:**

| Platforma | Tytuł (max znaków) | Opis (max znaków) | Domyślny ton |
|---|---|---|---|
| OLX | 70 | 1 500 | Swobodny |
| Allegro Lokalnie | 75 | 1 500 | Profesjonalny |
| Facebook Marketplace | 60 | 1 000 | Przyjazny |
| Vinted | 100 | 750 | Przyjazny |

### 8.2. Edycja wyników inline (wdrożone)

**Opis:** Po wygenerowaniu ogłoszenia użytkownik może edytować tytuł i opis bezpośrednio w widoku wyników.

**Mechanika:**
- Kliknięcie ikony ołówka → pole staje się edytowalne z auto-focus
- Ikona zmienia się na zielony check (potwierdzenie edycji)
- Licznik znaków z limitem platformy (kolor czerwony powyżej 90%)
- Walidacja: puste pola pokazują czerwoną ramkę i blokują zapis
- Skróty klawiszowe: Escape (anuluj), Cmd/Ctrl+Enter (potwierdź)
- Przycisk kopiowania do schowka działa w trybie podglądu i edycji

### 8.3. Zarządzanie ogłoszeniami — Dashboard (wdrożone)

**Opis:** Panel zarządzania z pełnym CRUD (Create, Read, Update, Delete) dla ogłoszeń.

**Funkcje:**
- **Lista ogłoszeń** z kompaktowymi kartami (miniatura + treść + akcje)
- **Filtrowanie:** status (Szkic / Opublikowane / Sprzedane), platforma
- **Sortowanie:** data utworzenia, data modyfikacji, tytuł A-Z/Z-A
- **Wyszukiwanie:** pełnotekstowe z debounce 500ms
- **Paginacja:** 20 ogłoszeń na stronę
- **Eksport CSV** z kodowaniem UTF-8 (kompatybilny z Excel)
- **Zmiana statusu:** Szkic → Opublikowane → Sprzedane (z ceną sprzedaży)
- **Szczegóły ogłoszenia:** pełny widok z galerią zdjęć i metadanymi
- **Usuwanie:** z potwierdzeniem, kasuje też zdjęcia z Supabase Storage

**Statusy ogłoszenia:**
| Status | Opis | Dostępne akcje |
|---|---|---|
| DRAFT (Szkic) | Wygenerowane, niezapisane na platformie | Opublikuj, Edytuj, Usuń |
| PUBLISHED (Opublikowane) | Wystawione na platformie | Sprzedane, Archiwizuj, Usuń |
| SOLD (Sprzedane) | Sprzedany produkt (z ceną sprzedaży) | Archiwizuj, Usuń |
| ARCHIVED (Zarchiwizowane) | Ukryte z widoku | Usuń |

### 8.4. Uwierzytelnianie i konto użytkownika (wdrożone)

**Opis:** System logowania przez Google OAuth z obsługą gości (soft-wall).

**Mechanika:**
- **Logowanie:** Google OAuth (jedyne źródło, JWT strategy)
- **Soft-wall:** Goście generują ogłoszenia → po generacji modal zachęcający do rejestracji
- **IndexedDB persistence:** Wygenerowane ogłoszenie zapisywane lokalnie → po zalogowaniu automatycznie odzyskiwane i zapisywane do bazy
- **Profil:** Imię, email, avatar (z Google), plan, liczba kredytów
- **Sesja:** JWT (bezstanowa), odświeżana przy każdym requeście

### 8.5. System kredytów (wdrożone, do rozbudowy)

**Obecny stan:**
- FREE: 3 kredyty/miesiąc
- PREMIUM: 9999 kredytów (symulacja unlimited)

**Docelowy stan** (po wdrożeniu płatności):
- Tiery subskrypcji: Free (5) / Starter (30) / Reseler (80)
- Dostawki: jednorazowe pakiety 10/30/60 kredytów
- Logika zużycia: najpierw subskrypcja → potem dostawkowe
- Reset subskrypcji: co miesiąc (okres rozliczeniowy)
- Dostawki: nie wygasają

### 8.6. Interfejs i UX (wdrożone)

- **Dark/Light mode** z automatyczną detekcją preferencji systemu
- **Responsywny design:** mobile (sidebar overlay z hamburger menu), desktop (fixed sidebar 288px)
- **Pasek boczny:** nawigacja, info o koncie, badge planu, licznik kredytów
- **Statystyki dashboardu:** 4 karty (łączne ogłoszenia, szkice, opublikowane, sprzedane)
- **Skróty klawiszowe:** Escape, Cmd+Enter w edycji

### 8.7. Szablony opisów (planowane)

**Opis:** Szablony z dynamicznymi polami, które AI wypełnia na podstawie analizy zdjęć i danych użytkownika.

**Mechanika:**
- Tworzenie szablonu: użytkownik pisze wzór opisu z placeholderami
- Dostępne placeholdery: `[nazwa]`, `[cena]`, `[stan]`, `[marka]`, `[kolor]`, `[rozmiar]`, `[materiał]` itp.
- AI przy generacji: wypełnia pola na podstawie zdjęć i danych z formularza
- Zarządzanie: CRUD w dashboardzie (`/dashboard/templates`)
- Limity per tier: Starter 3, Reseler 10, Free brak

**Przykład szablonu:**
```
Sprzedam [nazwa] marki [marka] w stanie [stan].
[opis_ai]
Kolor: [kolor]
Rozmiar: [rozmiar]
Cena: [cena] zł — do negocjacji.
```

### 8.8. Zapamiętywanie preferencji użytkownika (planowane)

**Opis:** Aplikacja zapamiętuje ostatnie wybory użytkownika, aby przyspieszyć kolejne generacje.

**Co zapamiętuje:**
- Ostatni ton per platforma (np. OLX → Swobodny, Allegro → Profesjonalny)
- Preferowany sposób dostawy
- Przechowywanie: w profilu użytkownika w bazie danych (pole JSON)
- Dostępne od tieru Starter wzwyż

### 8.9. System płatności i subskrypcji (planowane)

**Opis:** Integracja Stripe do obsługi subskrypcji i jednorazowych płatności.

**Funkcje:**
- Stripe Checkout: subskrypcje miesięczne (4 tiery)
- Stripe Checkout: jednorazowe zakupy (dostawki kredytów)
- BLIK + karty obsługiwane przez Stripe w Polsce
- Portal klienta Stripe: zmiana planu, anulowanie, historia faktur
- Webhooks: automatyczna aktualizacja planu/kredytów po płatności
- Faktury: generowane automatycznie przez Stripe

### 8.10. Strona cenowa (planowane)

**Opis:** Publiczna strona z cenami i porównaniem tierów (landing page).

**Zawartość:**
- Tabela porównania tierów
- Sekcja FAQ
- CTA "Zacznij za darmo"
- Dostawki kredytów z przyciskami zakupu

---

## 9. Opis interfejsu użytkownika (UI)

### 9.1. Strona główna `/` (niezalogowany użytkownik)

**Layout:** Pełnoekranowa strona bez sidebara.

**Elementy:**
- **Header:** Logo aplikacji (lewa strona) + przycisk "Zaloguj się" (prawa strona)
- **Sekcja hero:** Nagłówek "Sprzedaj szybciej z lepszym opisem", podtytuł opisujący wartość, CTA zachęcające do przewinięcia w dół
- **Formularz generacji** (główna treść strony):
  - **Karta 1 — Upload zdjęć:** Obszar drag & drop z ikoną aparatu, podpis "Przeciągnij zdjęcia lub kliknij", limity (max zdjęć zależy od planu, max 10MB/szt., JPG/PNG/WEBP). Po uploadzeniu: siatka miniatur z przyciskiem usunięcia (X)
  - **Karta 2 — Platforma i ton:** Siatka 2x2 z kafelkami platform (ikona + nazwa, hover scale effect, radio behavior). Pod spodem: segmented control z 3 tonami (desktop) lub radio buttons (mobile). Auto-selekcja tonu po zmianie platformy
  - **Karta 3 — Parametry produktu:** Stan (segmented control: Nowy / Używany jak nowy / Dobry stan / Przeciętny / Uszkodzony). Typ ceny (segmented control: AI sugeruje / Własna cena / Za darmo + pole kwoty przy "Własna cena"). Dostawa (checkboxy: Odbiór osobisty, Wysyłka — oba domyślnie zaznaczone)
  - **Karta 4 — Notatki i CTA:** Opcjonalnie: nazwa produktu (input), dodatkowe notatki (textarea). Sticky przycisk "Generuj ogłoszenie" (pomarańczowy, pełna szerokość, dolna część karty)

- **Po kliknięciu "Generuj":**
  - Pełnoekranowy loading overlay (portal do body, z-index 9999) z animowanym spinnerem
  - Po ~3-10s: wynik generacji

- **Wynik generacji** (layout 65% / 35%):
  - **Lewa kolumna (65%):** Wygenerowany tytuł (z ikoną ołówka do edycji + przyciskiem kopiowania). Wygenerowany opis (z ikoną ołówka + kopiowaniem). Przy edycji: licznik znaków z limitem platformy
  - **Prawa kolumna (35%):** Karta parametrów (platforma, ton, stan, dostawa). Sugestia ceny (zakres min-max z uzasadnieniem AI) lub cena użytkownika. Feedback jakości zdjęć (sugestie poprawy)

- **Soft-wall modal** (1.5s po wyświetleniu wyniku):
  - Overlay z przyciskiem "Zaloguj się przez Google"
  - Komunikat: "Zaloguj się aby zapisać ogłoszenie"
  - Ogłoszenie zapisywane w IndexedDB przed redirect'em

### 9.2. Strona logowania `/auth/signin`

**Layout:** Centrowana karta na tle gradientowym.

**Elementy:**
- Logo aplikacji
- Nagłówek "Zaloguj się"
- Przycisk "Kontynuuj z Google" (ikona Google + tekst)
- Link "Wróć na stronę główną"
- Nota o prywatności (link do polityki prywatności)

### 9.3. Dashboard — strona główna `/dashboard`

**Layout:** Fixed sidebar (288px, lewa strona) + główna treść z paddingiem `lg:pl-72`.

**Sidebar (wszystkie strony dashboardu):**
- Logo aplikacji (góra)
- Nawigacja: Dashboard, Ogłoszenia, Szablony
- Karta użytkownika: avatar, imię, email
- Badge planu (FREE / STARTER / RESELER)
- Licznik kredytów (liczba lub ∞)
- Przycisk "Wyloguj się" (dół)
- Mobile: hamburger menu → overlay sidebar

**Główna treść:**
- Nagłówek "Witaj, [imię]!" + przycisk "Nowe ogłoszenie" (pomarańczowy)
- **4 karty statystyk** (siatka 4 kolumn):
  - Łączne ogłoszenia (liczba, font semibold)
  - Szkice
  - Opublikowane
  - Sprzedane
- **Ostatnie ogłoszenia** (5 najnowszych):
  - Kompaktowa lista z miniaturą, tytułem, statusem
  - Link "Zobacz wszystkie" → `/dashboard/ads`

### 9.4. Nowe ogłoszenie `/dashboard/new`

**Layout:** Sidebar + główna treść.

**Treść:** Identyczny formularz jak na stronie głównej, ale:
- W layoucie dashboardu (z sidebarem)
- Bez soft-wall modala (użytkownik jest zalogowany)
- Po generacji: przycisk "Zapisz" (zielony check) zamiast modalu
- Po zapisie: przycisk "Zapisz i stwórz następne" (ikona RotateCcw) resetuje formularz

### 9.5. Lista ogłoszeń `/dashboard/ads`

**Layout:** Sidebar + główna treść.

**Elementy:**
- **Header:** Nagłówek "Ogłoszenia" + liczba łączna + przycisk eksport CSV
- **Panel filtrów** (zwijany):
  - Zakładki statusu: Wszystkie / Szkice / Opublikowane / Sprzedane (z liczbą w badge)
  - Dropdown platformy: Wszystkie / OLX / Allegro / Facebook / Vinted
  - Dropdown sortowania: Data utworzenia ↑↓ / Data modyfikacji ↑↓ / Tytuł A-Z / Z-A
  - Pole wyszukiwania: ikona lupy, debounce 500ms
  - Badge z liczbą aktywnych filtrów

- **Lista kart ogłoszeń** (kompaktowy layout):
  ```
  +------------------------------------------------------------------+
  | [Miniatura] [Tytuł ogłoszenia]                          [Data]   |
  | [144x144px] [Ikona platformy] [Status badge] [Cena]             |
  | [          ] [Opis (3 linie, obcięty)…]          [Akcje: 👁✏🗑] |
  +------------------------------------------------------------------+
  ```
  - Miniatura: 144x144px kwadrat
  - Ikona platformy: kolorowa ikona (ShoppingBag, Store, Facebook, Shirt)
  - Status badge: kolorowy (szary=Szkic, zielony=Opublikowane, pomarańczowy=Sprzedane)
  - Akcje per status:
    - DRAFT: Opublikuj (zielony CheckCircle), Podgląd, Edycja, Usuń
    - PUBLISHED: Sprzedane (pomarańczowy CircleDollarSign), Podgląd, Edycja, Usuń
    - SOLD: Podgląd, Usuń

- **Paginacja** (dół strony):
  - "Wyświetlono X-Y z Z ogłoszeń"
  - Przyciski: Poprzednia / numery stron / Następna

### 9.6. Szczegóły ogłoszenia `/dashboard/ads/[id]`

**Layout:** Sidebar + główna treść.

**Elementy:**
- **Header:** Przycisk "Wróć" ← + Tytuł ogłoszenia + badge platformy + badge statusu
- **Grid 2 kolumny:**
  - **Lewa (szersze):** Pełny opis ogłoszenia. Galeria zdjęć (siatka miniatur)
  - **Prawa (sidebar):** Karta z ceną (zakres lub cena sprzedaży). Metadane: data utworzenia, data modyfikacji, stan produktu, ton, sposób dostawy
- **Pasek akcji:**
  - DRAFT: "Opublikuj" (zielony), "Edytuj", "Usuń" (czerwony)
  - PUBLISHED: "Oznacz jako sprzedane" (pomarańczowy, formularz z ceną), "Archiwizuj", "Usuń"
  - SOLD: "Archiwizuj", "Usuń"

### 9.7. Szablony `/dashboard/templates` (planowane)

**Obecny stan:** Strona z komunikatem "Funkcja szablonów zostanie dodana w przyszłości".

**Docelowy stan:**
- Lista szablonów użytkownika z miniaturką/ikoną
- Przycisk "Nowy szablon" → kreator
- Kreator szablonów: edytor tekstu z wstawianiem placeholderów z menu
- Podgląd szablonu z przykładowymi danymi

### 9.8. Strona cenowa (planowane)

**Layout:** Publiczna strona, pełna szerokość.

**Elementy:**
- Nagłówek "Cennik"
- 4 kolumny z tierami (Free / Starter / Reseler)
- Wyróżniony tier "Reseler" (popularny)
- Tabela porównania feature'ów
- Sekcja dostawek kredytów
- FAQ (accordion)
- CTA "Zacznij za darmo"

---

## 10. Wymogi prawne

### Wymagane dokumenty

Dla prowadzenia serwisu SaaS w Polsce z JDG wymagane są:

1. **Regulamin serwisu** → `docs/legal/regulamin.md`
   - Definicje, zasady korzystania, prawa i obowiązki
   - Warunki subskrypcji i płatności
   - Reklamacje i zwroty
   - Odpowiedzialność

2. **Polityka prywatności** → `docs/legal/polityka-prywatnosci.md`
   - Informacje wymagane przez RODO (art. 13)
   - Administrator danych (JDG)
   - Cele i podstawy przetwarzania
   - Prawa użytkowników
   - Pliki cookies

### Kluczowe wymogi RODO

- **Minimalizacja danych:** Zbieramy tylko to, co niezbędne (email, imię z Google)
- **Podstawa prawna:** Umowa (art. 6.1.b) dla świadczenia usługi, zgoda (art. 6.1.a) dla marketingu
- **Prawo do usunięcia:** Użytkownik może usunąć konto i wszystkie dane
- **Prawo do eksportu:** Eksport CSV ogłoszeń
- **Gości nie identyfikujemy:** UUID nie jest daną osobową
- **Procesory danych:** OpenAI (USA, SCCs), Supabase (EU/USA), Stripe (EU), Google (USA, SCCs)

### Prywatność właściciela

Zgodnie z preferencją właściciela:
- Dane JDG (NIP, adres) widoczne w regulaminie i polityce prywatności (wymagane prawnie)
- Pozostałe elementy serwisu: bez danych osobowych właściciela
- Kontakt przez email firmowy (nie osobisty)
- Możliwość wskazania żony jako osoby kontaktowej (w ramach wspólności majątkowej)

### Drafty dokumentów prawnych

Pełne drafty regulaminu i polityki prywatności znajdują się w:
- `docs/legal/regulamin.md`
- `docs/legal/polityka-prywatnosci.md`

**WAŻNE:** Dokumenty wymagają weryfikacji przez prawnika przed publikacją.

---

## 11. Roadmap

### Faza 1: MVP komercyjne (priorytet: WYSOKI)

1. **System płatności Stripe** — subskrypcje + dostawki kredytów
2. **Nowe tiery kredytowe** — Free/Starter/Reseler/Business z limitami zdjęć
3. **Strona cenowa** — landing page z porównaniem tierów
4. **Guest tracking** — 3-warstwowa identyfikacja (UUID + IP + hard-wall)
5. **Regulamin i polityka prywatności** — po weryfikacji prawnika
6. **Zmiana modelu AI** — GPT-4.1 mini (po testach jakości)

### Faza 2: Rozbudowa wartości (priorytet: ŚREDNI)

7. **Zapamiętywanie preferencji** — ton per platforma, sposób dostawy
8. **Szablony opisów** — dynamiczne pola, CRUD, limity per tier
9. **Strona szablonów** — UI w dashboardzie (zastąpienie "coming soon")

### Faza 3: Wzrost i optymalizacja (priorytet: NISKI)

10. **Analytics** — śledzenie konwersji, popularnych platform, retencji
11. **A/B testing** — optymalizacja promptów i UX
12. **Multi-platform publish** — generacja tego samego ogłoszenia na 2+ platformy jednocześnie
13. **API dla integratorów** — endpoint REST dla zewnętrznych narzędzi

---

*Dokument sporządzony 2026-03-06. Do przeglądu i aktualizacji przy każdym istotnym etapie rozwoju.*
