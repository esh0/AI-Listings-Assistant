# Marketplace Assistant — Dokumentacja Biznesowa

> **Wersja:** 2.0
> **Data:** 2026-03-19
> **Status:** Produkt wdrożony — gotowy do uruchomienia komercyjnego

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
- Polskich platform (OLX, Allegro Lokalnie, Facebook Marketplace, Vinted)
- Polskiego języka i kultury sprzedaży
- Polskich metod płatności (BLIK + karty przez Stripe)
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
| Szablony | Nie | Tak (plan Reseler) |
| Historia aktywności | Nie | Tak |

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
| **Szablony opisów** | — | — | ✓ (do 10) |
| **Eksport CSV** | ✓ | ✓ | ✓ |
| **Historia aktywności** | ✓ | ✓ | ✓ |
| **Wsparcie** | — | Email | Email |

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

**Free (0 zł, 5 gen, 3 zdjęcia):**
- Wystarczająco, żeby przetestować narzędzie
- Limit 3 zdjęć ogranicza koszty API
- Motywacja do rejestracji i upgrade'u

**Starter (19,99 zł, 30 gen, 5 zdjęć):**
- Pokrywa potrzeby sprzedawcy okazjonalnego (~1 ogłoszenie dziennie)
- 5 zdjęć daje AI więcej kontekstu do analizy
- Cena porównywalna z kawą dziennie — niska bariera psychologiczna

**Reseler (49,99 zł, 80 gen, 8 zdjęć):**
- Dla regularnych sprzedawców: ~2-3 ogłoszenia dziennie
- 8 zdjęć pokrywa potrzeby profesjonalnych listingów
- Szablony (do 10) to kluczowy feature oszczędzający czas reselerom

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
| OpenAI API | ~0,02-0,12 zł/gen. | Zależy od liczby zdjęć (model: GPT-4.1-mini) |
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

- **Model:** GPT-4.1-mini (OpenAI)
- **Typ:** Generative model z analizą obrazu (Vision)
- **Koszt input/1M tokenów:** ~$0.40
- **Koszt output/1M tokenów:** ~$1.60
- **Format odpowiedzi:** JSON (structured output)
- **Max tokenów:** 4 000 (output)
- **Analiza obrazu:** detail: "high"
- **Szybkość:** ~2-5s na generację

### Dlaczego GPT-4.1-mini?

- Model generatywny — idealny do tworzenia treści na bazie promptu + zdjęć
- Nie wymaga reasoning (łańcuch myślenia) — tańszy niż modele reasoning (o4-mini)
- Dobra jakość polskich tekstów z odpowiednim prompt engineeringiem
- Wsparcie Vision (analiza zdjęć) w tej samej cenie co tekst
- **~60-65% taniej** niż modele reasoning przy porównywalnej jakości

### Kosztorysy API per tier

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
- Max 5 generacji z jednego IP w ciągu 24h
- Zapobiega obchodzeniu limitu UUID przez czyszczenie localStorage
- Współdzielone sieci (biura, uczelnie) = dodatkowa motywacja do rejestracji
- Przechowywany hash IP (SHA-256, nie surowy IP) → RODO-safe

**Warstwa 3: Hard-wall po wyczerpaniu limitu**
- Po wykorzystaniu limitu gościa → SoftWall modal (pomarańczowy, tryb "limit")
- Nie można generować więcej bez rejestracji
- CTA z przyciskiem "Zaloguj się przez Google"

### Limity dla gości

| Parametr | Limit |
|---|---|
| Generacje (per UUID) | 3 |
| Generacje (per IP / 24h) | 5 |
| Max zdjęć | 3 |
| Soft-wall modal | Po każdej generacji (zachęta do rejestracji) |
| Zapis do bazy | Wymaga rejestracji |

### Korzyści

- Goście mogą **przetestować** produkt bez zobowiązań (konwersja)
- 3-warstwowa ochrona **minimalizuje nadużycia**
- Brak zbierania danych osobowych = **pełna zgodność z RODO**
- "Sąsiad na tym samym IP zużył limit" = **naturalny bodziec do rejestracji**

---

## 8. Kompletny opis funkcji

### 8.1. Generowanie ogłoszeń AI (wdrożone ✅)

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
- Model: GPT-4.1-mini
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

### 8.2. Edycja wyników inline (wdrożone ✅)

**Opis:** Po wygenerowaniu ogłoszenia użytkownik może edytować tytuł i opis bezpośrednio w widoku wyników.

**Mechanika:**
- Kliknięcie ikony ołówka → pole staje się edytowalne z auto-focus
- Ikona zmienia się na zielony check (potwierdzenie edycji)
- Licznik znaków z limitem platformy (kolor czerwony powyżej 90%)
- Walidacja: puste pola pokazują czerwoną ramkę i blokują zapis
- Skróty klawiszowe: Escape (anuluj), Cmd/Ctrl+Enter (potwierdź)
- Przycisk kopiowania do schowka działa w trybie podglądu i edycji

### 8.3. Zarządzanie ogłoszeniami — Dashboard (wdrożone ✅)

**Opis:** Panel zarządzania z pełnym CRUD (Create, Read, Update, Delete) dla ogłoszeń.

**Funkcje:**
- **Lista ogłoszeń** z kompaktowymi kartami (miniatura + treść + akcje)
- **Filtrowanie:** status (Szkic / Opublikowane / Sprzedane / Zarchiwizowane), platforma
- **Sortowanie:** data utworzenia, data modyfikacji, tytuł A-Z/Z-A
- **Wyszukiwanie:** pełnotekstowe z debounce 500ms
- **Paginacja:** 20 ogłoszeń na stronę
- **Eksport CSV** z kodowaniem UTF-8 (kompatybilny z Excel)
- **Bulk selection:** zaznaczanie wielu ogłoszeń + grupowy eksport CSV + grupowa archiwizacja
- **Zmiana statusu:** Szkic → Opublikowane → Sprzedane (z ceną sprzedaży)
- **Archiwizacja:** Opublikowane/Sprzedane → Zarchiwizowane (ukryte z widoku)
- **Szczegóły ogłoszenia:** pełny widok z galerią zdjęć i metadanymi
- **Usuwanie:** z potwierdzeniem, kasuje też zdjęcia z Supabase Storage

**Statusy ogłoszenia:**
| Status | Opis | Dostępne akcje |
|---|---|---|
| DRAFT (Szkic) | Wygenerowane, niezapisane na platformie | Opublikuj, Edytuj, Usuń |
| PUBLISHED (Opublikowane) | Wystawione na platformie | Sprzedane, Wycofaj (archiwizuj), Edytuj, Usuń |
| SOLD (Sprzedane) | Sprzedany produkt (z ceną sprzedaży) | Wycofaj (archiwizuj), Usuń |
| ARCHIVED (Zarchiwizowane) | Ukryte z widoku | Usuń |

### 8.4. Uwierzytelnianie i konto użytkownika (wdrożone ✅)

**Opis:** System logowania przez Google OAuth z obsługą gości (soft-wall).

**Mechanika:**
- **Logowanie:** Google OAuth (jedyne źródło, JWT strategy)
- **Soft-wall:** Goście generują ogłoszenia → po generacji modal zachęcający do rejestracji
- **IndexedDB persistence:** Wygenerowane ogłoszenie zapisywane lokalnie → po zalogowaniu automatycznie odzyskiwane i zapisywane do bazy
- **Profil:** Imię, email, avatar (z Google), plan, liczba kredytów
- **Sesja:** JWT (bezstanowa), odświeżana przy każdym requeście

### 8.5. System kredytów (wdrożone ✅)

**Obecny stan (pełne wdrożenie):**
- **FREE:** 5 kredytów/miesiąc, 3 zdjęcia max
- **STARTER:** 30 kredytów/miesiąc, 5 zdjęć max (19,99 zł/mies.)
- **RESELER:** 80 kredytów/miesiąc, 8 zdjęć max (49,99 zł/mies.)
- **Dostawki:** jednorazowe pakiety 10/30/60 kredytów (nie wygasają)
- **Logika zużycia:** najpierw subskrypcja → potem dostawkowe
- **Reset subskrypcji:** co miesiąc (okres rozliczeniowy)
- Śledzenie w polach `User.creditsAvailable` + `User.boostCredits`
- Kredyt konsumowany na etapie generacji (przed zapisem)
- Gdy 0 kredytów: przycisk generacji zablokowany, CTA "Zmień plan lub dokup kredyty"

### 8.6. Interfejs i UX (wdrożone ✅)

- **Dark/Light mode** z automatyczną detekcją preferencji systemu
- **Responsywny design:** mobile (sidebar overlay z hamburger menu), desktop (fixed sidebar 288px)
- **Pasek boczny:** nawigacja (Przegląd, Moje ogłoszenia, Szablony, Historia, Statystyki, Cennik), info o koncie, badge planu, licznik kredytów (dostępne/limit + boost + data resetu)
- **Statystyki dashboardu:** karty podsumowania, wykres tygodniowy, rozbicie per platforma
- **Skróty klawiszowe:** Escape, Cmd+Enter w edycji

### 8.7. Szablony opisów (wdrożone ✅ — tylko plan Reseler)

**Opis:** Szablony presetów generacji ogłoszeń dostępne wyłącznie dla użytkowników planu Reseler.

**Mechanika:**
- Tworzenie szablonu: użytkownik zapisuje preset z parametrami generacji
- **Pola szablonu:** nazwa, platforma, ton, stan produktu, opcje dostawy, szablon opisu (bodyTemplate), typ ceny, notatki, flaga domyślna
- Zarządzanie: pełny CRUD w dashboardzie (`/dashboard/templates`)
- Limit: do 10 szablonów per użytkownik (constraint: unikalna nazwa per user)
- **Użytkownicy Free/Starter:** widzą stronę z zachętą do upgrade'u (TemplatesSoftwall)

### 8.8. Historia aktywności (wdrożone ✅)

**Opis:** Log aktywności użytkownika w systemie.

**Mechanika:**
- Śledzenie zdarzeń: `AD_GENERATED`, `AD_SAVED`, `AD_PUBLISHED`, `AD_SOLD`, `AD_ARCHIVED`, `AD_DELETED`
- Wyświetlanie: timeline ostatnich 50 zdarzeń w `/dashboard/history`
- Model: `ActivityLog` (userId, action, adId, timestamp)
- Logowanie przez funkcję `logActivity()` wywoływaną z API routes
- Dostępne dla wszystkich planów

### 8.9. System płatności i subskrypcji (wdrożone ✅)

**Opis:** Integracja Stripe do obsługi subskrypcji i jednorazowych płatności.

**Funkcje:**
- Stripe Checkout: subskrypcje miesięczne (STARTER / RESELER)
- Stripe Checkout: jednorazowe zakupy (dostawki kredytów 10/30/60)
- BLIK + karty (Visa, Mastercard) obsługiwane przez Stripe w Polsce
- Portal klienta Stripe: zarządzanie subskrypcją, anulowanie, historia faktur
- Webhooks: `checkout.session.completed` (upgrade/boost), `invoice.paid` (odnowienie), `customer.subscription.deleted` (downgrade do FREE)
- Faktury: generowane automatycznie przez Stripe
- Model User przechowuje `stripeCustomerId` i `stripeSubscriptionId`

### 8.10. Strona cenowa (wdrożone ✅)

**Opis:** Strona z cenami i porównaniem tierów, dostępna publicznie i w dashboardzie.

**Zawartość:**
- 3 kolumny z tierami (Free / Starter / Reseler) — wyróżniony Reseler (popularny)
- Tabela porównania feature'ów
- Sekcja dostawek kredytów (widoczna tylko dla zalogowanych)
- FAQ (accordion)
- CTA "Zacznij za darmo"
- **Niezalogowani:** wszystkie CTA prowadzą do logowania
- **Zalogowani:** "Obecny plan" na aktywnym tierze, przyciski Stripe Checkout na pozostałych

### 8.11. Eksport CSV (wdrożone ✅)

**Opis:** Eksport ogłoszeń do pliku CSV.

**Mechanika:**
- Dostępny dla wszystkich planów (nie jest ograniczony tierem)
- Eksport wybranych ogłoszeń (bulk selection) przez parametr `?ids=`
- Eksport po statusie przez parametr `?status=`
- Format: UTF-8 z BOM, kompatybilny z Excel
- Pola: ID, platforma, tytuł, opis, status, ceny, stan, ton, dostawa, daty

### 8.12. Zapamiętywanie preferencji użytkownika (planowane)

**Opis:** Aplikacja zapamiętuje ostatnie wybory użytkownika, aby przyspieszyć kolejne generacje.

**Co zapamiętuje:**
- Ostatni ton per platforma (np. OLX → Swobodny, Allegro → Profesjonalny)
- Preferowany sposób dostawy
- Przechowywanie: w profilu użytkownika w bazie danych (pole JSON)

---

## 9. Opis interfejsu użytkownika (UI)

### 9.1. Strona główna `/` (niezalogowany użytkownik)

**Layout:** Pełnoekranowa strona bez sidebara.

**Elementy:**
- **Header:** Logo "Marketplace AI" (serif italic accent) + przycisk "Zaloguj się"
- **Sekcja hero:** Nagłówek z serif italic akcentem, podtytuł opisujący wartość
- **Formularz generacji** (główna treść strony):
  - **Karta 1 — Upload zdjęć:** Obszar drag & drop, limity (max 3 zdjęcia dla gości, max 10MB/szt., JPG/PNG/WEBP). Skeleton placeholdery podczas kompresji
  - **Karta 2 — Platforma i ton:** Siatka 2x2 z kafelkami platform (ikona + nazwa). Segmented control z 3 tonami (desktop) lub radio buttons (mobile). Auto-selekcja tonu po zmianie platformy
  - **Karta 3 — Parametry produktu:** Stan (segmented control), typ ceny (AI/Własna/Za darmo), dostawa (checkboxy)
  - **Karta 4 — Notatki i CTA:** Nazwa produktu, notatki, przycisk "Generuj ogłoszenie"

- **Wynik generacji** (layout 65% / 35%):
  - **Lewa kolumna (65%):** Tytuł + opis (z edycją inline + kopiowaniem)
  - **Prawa kolumna (35%):** Parametry, sugestia ceny, feedback zdjęć

- **Soft-wall modal** (1.5s po wyniku): Zachęta do logowania, ogłoszenie w IndexedDB

### 9.2. Dashboard — strona główna `/dashboard`

**Layout:** Fixed sidebar (288px) + główna treść z `lg:pl-72`.

**Sidebar (wszystkie strony dashboardu):**
- Logo aplikacji
- Nawigacja: Przegląd, Moje ogłoszenia, Szablony, Historia, Statystyki, Cennik
- Kredyty: dostępne/limit + boost + data resetu
- Badge planu (FREE / STARTER / RESELER)
- Link "Zarządzaj subskrypcją" (dla płatnych planów → Stripe Portal)
- Karta użytkownika: avatar, imię
- Przycisk "Wyloguj się"
- Mobile: hamburger menu → overlay sidebar

**Główna treść:**
- Nagłówek "Witaj, [imię]!" (serif italic) + przycisk "Nowe ogłoszenie"
- 4 karty statystyk z animacją staggered entrance
- Ostatnie ogłoszenia (5 najnowszych)
- `PendingAdHandler` — automatycznie zapisuje ogłoszenie z IndexedDB po soft-wall redirect

### 9.3. Lista ogłoszeń `/dashboard/ads`

- Filtrowanie: status (Szkic/Opublikowane/Sprzedane/Zarchiwizowane), platforma
- Sortowanie: data, tytuł
- Wyszukiwanie: debounce 500ms
- Paginacja: 20 ogłoszeń/strona
- Bulk selection: zaznaczanie + grupowy CSV export + grupowa archiwizacja
- Kompaktowe karty z miniaturą (144x144px), ikoną platformy, badge statusu, akcjami
- Mobile: drawer z filtrami, FAB "Nowe ogłoszenie"

### 9.4. Szablony `/dashboard/templates`

- **Plan Reseler:** Lista szablonów z CRUD, modal tworzenia/edycji
- **Inne plany:** TemplatesSoftwall z zachętą do upgrade'u
- Suspense z TemplatesListSkeleton

### 9.5. Historia `/dashboard/history`

- Timeline ostatnich 50 zdarzeń (generacja, zapis, publikacja, sprzedaż, archiwizacja, usunięcie)
- Ikony per typ akcji, timestampy
- Suspense z HistorySkeleton

### 9.6. Statystyki `/dashboard/stats`

- Server Component z Suspense streaming
- Karty podsumowania, wykres tygodniowy, rozbicie per platforma
- Dane z DB (groupBy status, groupBy platform+status)
- StatsSkeleton jako fallback

### 9.7. Cennik `/dashboard/pricing`

- Mirror strony publicznej `/pricing`
- 3 tiery + dostawki (dla zalogowanych)
- Stripe Checkout dla upgrade'u
- FAQ

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

### Drafty dokumentów prawnych

Pełne drafty regulaminu i polityki prywatności znajdują się w:
- `docs/legal/regulamin.md`
- `docs/legal/polityka-prywatnosci.md`

**WAŻNE:** Dokumenty wymagają weryfikacji przez prawnika przed publikacją.

---

## 11. Roadmap

### Zrealizowane (stan na 2026-03-19) ✅

1. **Generowanie ogłoszeń AI** — GPT-4.1-mini z analizą obrazu
2. **Edycja inline** — z limitami znaków per platforma
3. **Dashboard z zarządzaniem ogłoszeniami** — CRUD, filtrowanie, sortowanie, paginacja
4. **System kredytów** — 3 tiery (Free/Starter/Reseler) + dostawki
5. **System płatności Stripe** — subskrypcje + dostawki kredytów
6. **Strona cenowa** — publiczna + w dashboardzie
7. **Guest tracking** — 3-warstwowa identyfikacja (UUID + IP + hard-wall)
8. **Szablony** — CRUD, RESELER-only
9. **Historia aktywności** — ActivityLog z timeline
10. **Eksport CSV** — bulk + filtrowany
11. **Bulk operations** — zaznaczanie + grupowa archiwizacja
12. **4 statusy ogłoszeń** — DRAFT, PUBLISHED, SOLD, ARCHIVED
13. **Uwierzytelnianie** — Google OAuth + soft-wall + IndexedDB persistence
14. **Dark/light mode** — z auto-detekcją
15. **Responsywny design** — mobile + desktop
16. **Regulamin i polityka prywatności** — drafty (do weryfikacji prawnika)

### Faza następna: Rozbudowa wartości (priorytet: ŚREDNI)

17. **Zapamiętywanie preferencji** — ton per platforma, sposób dostawy
18. **Retencja danych** — backend cleanup job (7d/180d/365d per tier, zadeklarowane w UI)
19. **Weryfikacja prawna** — regulamin i polityka prywatności zweryfikowane przez prawnika

### Faza przyszła: Wzrost i optymalizacja (priorytet: NISKI)

20. **Analytics** — śledzenie konwersji, popularnych platform, retencji
21. **A/B testing** — optymalizacja promptów i UX
22. **Multi-platform publish** — generacja tego samego ogłoszenia na 2+ platformy jednocześnie
23. **API dla integratorów** — endpoint REST dla zewnętrznych narzędzi

---

*Dokument zaktualizowany 2026-03-19. Do przeglądu i aktualizacji przy każdym istotnym etapie rozwoju.*
