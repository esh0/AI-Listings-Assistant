# Marketplace AI
## Inteligentny asystent do tworzenia profesjonalnych ogłoszeń marketplace

---

## Problem

Sprzedaż rzeczy online na platformach takich jak OLX, Allegro Lokalnie, Facebook Marketplace czy Vinted wymaga:
- **Czasu** - pisanie opisów, optymalizacja tytułów, analiza zdjęć
- **Umiejętności** - znajomość zasad każdej platformy, odpowiedni język i ton
- **Doświadczenia** - ustalanie cen, dostosowywanie treści do grupy docelowej

**Efekt:** Większość ogłoszeń jest nieprofesjonalna, źle wyceniona i nieefektywna, co prowadzi do dłuższego czasu sprzedaży i niższych cen końcowych.

**Skala problemu:** W Polsce ponad 14 mln osób aktywnie sprzedaje na platformach marketplace. Większość z nich tworzy ogłoszenia ad hoc, bez wiedzy o zasadach poszczególnych platform.

---

## Rozwiązanie

**Marketplace AI** to działająca aplikacja webowa, która w 30 sekund tworzy profesjonalne, gotowe do publikacji ogłoszenia na podstawie zdjęć produktu.

### Jak to działa?

1. **Wrzuć zdjęcia** - do 3-8 zdjęć produktu (drag & drop, w zależności od planu)
2. **Wybierz platformę** - OLX, Allegro Lokalnie, Facebook Marketplace lub Vinted
3. **Ustaw parametry** - ton, stan, dostawa, opcjonalna cena
4. **Kliknij "Generuj"** - AI analizuje zdjęcia i tworzy ogłoszenie
5. **Edytuj i zapisz** - inline editing z limitami znakow per platforma, zapis do dashboardu

**Rezultat:** Profesjonalny tytuł, szczegółowy opis, sugerowana cena, ocena jakości zdjęć — wszystko dostosowane do wybranej platformy, gotowe do skopiowania lub zarządzania z poziomu dashboardu.

**Status: Produkt jest zbudowany, wdrożony i działa na produkcji.**

---

## Zbudowane Funkcje (stan obecny)

### 1. Analiza Wizualna AI
- Rozpoznawanie produktów ze zdjęć (GPT-4.1-mini Vision)
- Ocena stanu przedmiotu na podstawie zdjęć
- Analiza jakości zdjęć z sugestiami poprawy
- System hierarchii informacji: dane użytkownika > fakty ze zdjęć > wnioski AI

### 2. Generowanie Treści z Tone Control
- **Tytuły** — krótkie, konkretne, platformowo-specyficzne limity znaków
- **Opisy** — szczegółowe, przekonujące, z dynamicznym tonem
- **Sugerowane ceny** — oparte na stanie, marce i wartości rynkowej z uzasadnieniem
- **3 style tonalne:** Profesjonalny, Przyjazny, Swobodny — każdy z dedykowanym słownictwem
- **Smart defaults** — platforma automatycznie dobiera rekomendowany ton

### 3. Multi-Platform z Dedykowanymi Regułami
Każda platforma ma własne reguły w postaci plików Markdown, ładowanych server-side:
- **OLX** — konkretnie, praktycznie, limit 70 znaków tytuł / 1500 opis
- **Allegro Lokalnie** — profesjonalnie, szczegółowo, 75 / 1500
- **Facebook Marketplace** — przyjaźnie, bezpośrednio, 60 / 1000
- **Vinted** — modowo, lifestylowo, 100 / 750

### 4. Inteligentne Ceny
- **AI Suggest** — algorytm proponuje realistyczny przedział cenowy (min-max) z 2-3 zdaniowym uzasadnieniem
- **Własna cena** — użytkownik podaje kwotę, AI wspomina w opisie z frazami negocjacyjnymi
- **Za darmo** — specjalne formatowanie, zielona odznaka, platformowo-specyficzne frazy

### 5. System Dokładności AI
- **Hierarchia informacji** — dane użytkownika > fakty ze zdjęć > wnioskowanie AI
- **System języka niepewności** — 3 poziomy pewności z polskimi frazami ("wygląda na", "może być", "trudno określić")
- **Lista zabronionych fraz** — AI nie może twierdzić "fabrycznie nowy", "gwarancja producenta" itp. bez dowodów
- **Chain-of-thought** — AI wewnętrznie oddziela fakty od założeń przed generowaniem

### 6. Pełny Dashboard
- **Zarządzanie ogłoszeniami** — CRUD, statusy (Draft/Published/Sold/Archived), filtrowanie, sortowanie, wyszukiwanie
- **Paginacja** — 20 ogłoszeń na stronę z server-side Prisma skip/take
- **Bulk operations** — zaznaczanie wielu ogłoszeń, eksport CSV, grupowa archiwizacja
- **Szablony** — system szablonów dla planu RESELER (do 10 presetów)
- **Historia aktywności** — log operacji użytkownika (ostatnie 50 zdarzeń)
- **Statystyki** — Server Components z Suspense streaming (tygodniowy wykres, rozbicie na platformy)
- **Inline editing** — edycja tytułu i opisu z walidacją limitów znaków i podglądem na żywo

### 7. Guest Access z Rate Limiting
Trzy warstwy ograniczeń dla niezalogowanych:
- UUID w localStorage (max 3 generacje)
- IP hash via SHA-256 (max 5 generacji / 24h)
- SoftWall modal po wyczerpaniu limitu
- Po zalogowaniu — pending ad automatycznie zapisywany do dashboardu (IndexedDB)

### 8. Autentykacja i Płatności
- **Google OAuth** via NextAuth v5 (strategia JWT)
- **Stripe** — subskrypcje (karta + BLIK) + jednorazowe boosty
- **Customer Portal** — zarządzanie subskrypcją, metody płatności, faktury
- **Webhook handler** — automatyczne upgrade/downgrade/renewal

### 9. UX
- Ciemny/jasny motyw (next-themes, CSS variables)
- W pełni responsywny design (desktop + mobile z drawer nawigacją)
- Kopiowanie treści jednym kliknięciem
- Dynamiczny ekran ładowania z React Portal
- Design token system — wszystkie kolory przez zmienne CSS
- Animacje wejścia na kartach statystyk (staggered entrance)

---

## Model Biznesowy

### Segmenty Klientów

**B2C — Sprzedający indywidualni:**
- Osoby sprzedające używane rzeczy (elektronika, meble, ubrania)
- Młodzi rodzice (sprzęt dziecięcy, ubranka)
- Miłośnicy mody (second-hand, vintage)
- Hobbyści i kolekcjonerzy

**B2B — Komercyjni sprzedający:**
- Małe sklepy online (cross-posting na wiele platform)
- Komisanty i skupy (regularnie dodają nowe produkty)
- Second-handy i lombardy (volume selling)

### Cennik (wdrożony i działający)

#### Plany Subskrypcyjne

| | FREE | STARTER | RESELER |
|---|---|---|---|
| **Cena** | 0 zł/mies. | 19,99 zł/mies. | 49,99 zł/mies. |
| **Generacje/mies.** | 5 | 30 | 80 |
| **Max zdjęć** | 3 | 5 | 8 |
| **Dashboard** | ✓ | ✓ | ✓ |
| **Szablony** | — | — | ✓ |
| **Stripe Portal** | — | ✓ | ✓ |

- Kredyty subskrypcyjne resetują się co miesiąc
- Subskrypcje obsługiwane przez Stripe (karta + BLIK)

#### Boost Credits (jednorazowe doładowania)

| Pakiet | Cena | Cena/kredyt |
|---|---|---|
| 10 kredytów | 9,99 zł | ~1,00 zł |
| 30 kredytów | 24,99 zł | ~0,83 zł |
| 60 kredytów | 39,99 zł | ~0,67 zł |

- Boost credits nie wygasają miesięcznie
- Zużycie: najpierw kredyty subskrypcyjne, potem boost
- Dostępne tylko dla zalogowanych użytkowników

### Mechanika Kredytów
- Kredyt zużyty w momencie generowania (nie zapisu) — zapobiega nadużyciom
- Przy 0 kredytów: przycisk generowania zablokowany, CTA "Zmień plan lub dokup kredyty"
- Gość: SoftWall modal po wyczerpaniu darmowego limitu

---

## Przewaga Konkurencyjna

### Technologia
- **GPT-4.1-mini Vision** — najnowszy model z analizą obrazu i tekstem
- **Modular prompt architecture** — reguły platform w Markdown, tone injection, chain-of-thought
- **Accuracy system** — hierarchia informacji, język niepewności, lista zabronionych fraz
- **Server Components + Suspense** — streaming danych, natychmiastowy TTFB
- **Dynamic imports** — code splitting, redukcja initial bundle o 30-50KB

### Design
- **Polish-first UX** — cała aplikacja w 100% po polsku
- **Platform-native content** — 4 platformy × 3 tony = 12 unikalnych podejść
- **Design token system** — ciemny/jasny motyw bez `dark:` prefixów, CSS variables
- **Mobile-first** — drawer nawigacja, FAB, responsywne filtry

### Moat
- **Kurowane reguły platform** — ręcznie tworzone i aktualizowane zasady dla każdej platformy
- **System dokładności AI** — unikalne podejście do ograniczania halucynacji w generowanych treściach
- **Pełny cykl życia ogłoszenia** — od generowania przez edycję po zarządzanie i eksport

---

## Go-to-Market

### Faza 1: Walidacja (Miesiące 1-3)
**Cel:** 1 000 użytkowników, walidacja product-market fit

**Kanały:**
- Grupy FB dla sprzedających (OLX/Vinted/Allegro communities)
- Reddit Poland (r/Polska)
- TikTok/Instagram — viral content (before/after ogłoszeń)
- SEO — blog posty "jak sprzedać X na Y"

**Metryki:**
- CAC < 20 zł
- Activation rate > 40% (signup → first ad)
- Retention D7 > 20%

### Faza 2: Growth (Miesiące 4-9)
**Cel:** 10 000 użytkowników, stabilne MRR

**Kanały:**
- Google Ads — keywords "generator ogłoszeń", "jak sprzedać na olx"
- Facebook Ads — targetowanie sprzedających
- Influencer marketing — nano-influencers (1K-10K followers)
- Referral program — darmowe kredyty za polecenie

**Metryki:**
- CAC < 40 zł
- Free-to-paid conversion > 5%
- MRR > 20 000 zł

### Faza 3: Scale (Miesiące 10-18)
**Cel:** 50 000+ użytkowników, profitable unit economics

**Kanały:**
- Partnerships z platformami (OLX, Allegro — integracje)
- B2B outreach — sklepy, komisanty, agencje
- Content marketing — YouTube tutorials, case studies
- PR — tech media, startup competitions

**Metryki:**
- CAC < 60 zł
- LTV > 300 zł
- LTV:CAC > 3:1
- Churn < 5%/month

---

## Prognozy Finansowe (18 miesięcy)

### Założenia

**Przychody per user (monthly):**
- FREE: 0 zł (ale kupują boosty: średni przychód ~2 zł/mies. od 10% free users)
- STARTER: 19,99 zł + średni boost 5 zł = ~25 zł
- RESELER: 49,99 zł + średni boost 10 zł = ~60 zł

**Konwersja:**
- Free → STARTER: 6%
- Free → RESELER: 2%
- Boost purchase rate (wśród free): 10%
- Boost purchase rate (wśród paid): 30%
- Miesięczny churn (paid): 5%

**Koszty per generacja:**
- OpenAI API: 0,02-0,12 zł (zależne od ilości zdjęć, średnio ~0,05 zł)
- Stripe: ~1,5% + 0,50 zł per transakcja

### Scenariusz Bazowy

| Miesiąc | Users | STARTER | RESELER | Boosty (szt.) | MRR (zł) | Koszty AI (zł) | Koszty Stripe (zł) |
|---------|-------|---------|---------|---------------|----------|----------------|---------------------|
| 3 | 1 000 | 40 | 15 | 60 | 1 950 | 150 | 90 |
| 6 | 3 500 | 150 | 50 | 250 | 6 950 | 620 | 380 |
| 9 | 10 000 | 450 | 150 | 800 | 19 800 | 1 800 | 1 050 |
| 12 | 20 000 | 900 | 300 | 1 800 | 40 500 | 3 800 | 2 200 |
| 18 | 50 000 | 2 200 | 750 | 5 000 | 102 500 | 9 500 | 5 600 |

**MRR breakdown (M18):**
- STARTER: 2 200 × 19,99 = 43 978 zł
- RESELER: 750 × 49,99 = 37 493 zł
- Boosty: ~21 000 zł (średnio 5 000 zakupów/mies. × średnia 4,20 zł)
- Łącznie: ~102 500 zł MRR

### Gross Margin

**Przychód na przykładzie STARTER (19,99 zł/mies.):**
- Stripe fee: 19,99 × 1,5% + 0,50 = 0,80 zł (4,0%)
- Koszt AI (30 generacji × 0,05 zł): 1,50 zł (7,5%)
- **Gross margin: 88,5%**

**Przychód na przykładzie RESELER (49,99 zł/mies.):**
- Stripe fee: 49,99 × 1,5% + 0,50 = 1,25 zł (2,5%)
- Koszt AI (80 generacji × 0,05 zł): 4,00 zł (8,0%)
- **Gross margin: 89,5%**

**Przychód na przykładzie Boost 30 (24,99 zł):**
- Stripe fee: 24,99 × 1,5% + 0,50 = 0,87 zł (3,5%)
- Koszt AI (30 generacji × 0,05 zł): 1,50 zł (6,0%)
- **Gross margin: 90,5%**

**Ważne:** Gross margin to nie net margin — nie uwzględnia hostingu, marketingu, zespołu. Ale koszty zmienne (AI + payments) są niskie, co daje silną dźwignię operacyjną.

### Koszty Stałe (monthly)
- **Vercel Pro:** ~80 zł
- **Supabase Pro:** ~100 zł (DB + Storage)
- **Narzędzia (analytics, monitoring):** ~200 zł
- **Łączne fixed costs:** ~380 zł/mies.

**Break-even (pokrycie fixed costs):** ~Miesiąc 2-3 (już przy 20 płatnych użytkownikach)
**Break-even (z kosztami marketingu):** Miesiąc 12-14

---

## Technologia i Architektura

### Tech Stack (wdrożony)
- **Frontend:** Next.js 15 (App Router), React, TypeScript 5.7, Tailwind CSS 3.4
- **AI:** OpenAI GPT-4.1-mini (vision + text, JSON mode)
- **Database:** PostgreSQL via Supabase (PgBouncer connection pooling)
- **ORM:** Prisma 5.22
- **Auth:** NextAuth v5 (Google OAuth, strategia JWT)
- **Storage:** Supabase Storage (sharp resizing: 800px, 85% JPEG)
- **Payments:** Stripe (subskrypcje + jednorazowe boosty, BLIK + karty)
- **Hosting:** Vercel
- **Validation:** Zod schemas

### Koszty Płatności (Stripe w Polsce)

**Stripe (jedyny payment gateway):**
- **Prowizja:** ~1,5% + 0,50 zł per transakcja (European cards)
- **BLIK:** obsługiwany przez Stripe
- **Karty:** Visa, Mastercard
- **Wypłaty:** automatyczne
- **Customer Portal:** zarządzanie subskrypcją, faktury

**Przykładowe koszty transakcyjne:**
- STARTER (19,99 zł): 0,80 zł prowizji (4,0%)
- RESELER (49,99 zł): 1,25 zł prowizji (2,5%)
- Boost 10 (9,99 zł): 0,65 zł prowizji (6,5%)
- Boost 30 (24,99 zł): 0,87 zł prowizji (3,5%)
- Boost 60 (39,99 zł): 1,10 zł prowizji (2,8%)

**Wniosek:** Subskrypcje i większe pakiety mają akceptowalne koszty transakcyjne (2,5-4%). Małe boosty (9,99 zł) mają wyższą prowizję procentową (6,5%), ale nadal są opłacalne dzięki niskim kosztom AI.

### Skalowalność
- **Architektura:** Stateless, serverless (Vercel Edge + Serverless Functions)
- **Database:** Supabase PgBouncer z connection pooling (session mode, limit 5)
- **Bottleneck:** OpenAI API rate limits (mitowalny przez tier upgrade)
- **Cost scaling:** Liniowe z użyciem (pay-as-you-grow)
- **Optymalizacje:** groupBy zamiast wielu count(), $transaction dla batch queries, dynamic imports

---

## Zespół (Potrzebny)

### Core Team
**CTO** (obecny)
- Architektura techniczna i development
- AI prompt engineering
- Performance i security
- Cały produkt zbudowany solo

**CEO/Product** (potrzebny)
- Wizja produktu i strategia
- Fundraising i relacje z inwestorami
- Egzekucja go-to-market

**Head of Growth** (potrzebny)
- Pozyskiwanie i retencja użytkowników
- Kampanie marketingowe
- Community building

### Advisors (potrzebni)
- **Marketplace expert** — ex-OLX/Allegro
- **AI/ML advisor** — optymalizacja promptów, wybór modeli
- **Legal advisor** — GDPR, regulamin, IP

---

## Funding Ask

### Pre-Seed Round: 800 000 zł (~$200K)

**Use of Funds:**
- **Team (55% — 440K zł):** Hire CEO/Product + Head of Growth
- **Marketing (35% — 280K zł):** User acquisition, content, paid ads, partnerships
- **Operations (10% — 80K zł):** Narzędzia, legal, runway buffer

**Milestones (12 miesięcy):**
- 10 000+ zarejestrowanych użytkowników
- 30 000+ zł MRR
- 5% konwersja free-to-paid
- Product-market fit zwalidowany
- Gotowi na rundę Seed (3-6M zł)

**Dlaczego mniej niż typowy pre-seed:**
- Produkt już jest zbudowany i działający (brak kosztu MVP)
- Koszty techniczne bliskie zeru (serverless, pay-as-you-go)
- Środki idą głównie na zespół i marketing, nie development

**Terms:**
- **Valuation:** 4M zł post-money (~$1M)
- **Equity:** 20%
- **Instrument:** SAFE lub udziały
- **Investor involvement:** Kwartalne update'y, strategiczne doradztwo

---

## Ryzyka i Mitigation

### 1. Konkurencja
**Ryzyko:** Duzi gracze (OLX, Allegro) mogą dodać podobną funkcję
**Mitigation:**
- First-mover advantage z działającym produktem
- Multi-platform (oni mają lock-in na swoją platformę)
- Superior UX z głębokimi regułami platformowymi
- Szybkość iteracji jako mały zespół

### 2. Regulacje AI
**Ryzyko:** EU AI Act może wprowadzić ograniczenia
**Mitigation:**
- Human-in-the-loop: użytkownik zawsze zatwierdza i edytuje treść
- Transparentność: system języka niepewności pokazuje co AI wie, a czego nie
- Compliance-first approach, monitoring regulacji

### 3. Koszty AI
**Ryzyko:** Ceny OpenAI mogą wzrosnąć
**Mitigation:**
- Obecne koszty AI stanowią ~8% przychodu (niska wrażliwość)
- Model-agnostic architecture (łatwe przejście na innego dostawcę)
- Trend rynkowy: ceny modeli AI spadają, nie rosną
- Caching i optymalizacje zapytań mogą zredukować koszty o 20-30%

### 4. Adoption
**Ryzyko:** Sprzedający mogą nie chcieć płacić za narzędzie
**Mitigation:**
- Guest access (3 darmowe generacje bez rejestracji) — niska bariera wejścia
- Freemium z 5 generacjami/mies. — długofalowe try-before-buy
- Boost packs — elastyczność bez zobowiązań subskrypcyjnych
- ROI jest oczywiste: 30s vs 15 min na napisanie ogłoszenia

### 5. Stripe / Płatności
**Ryzyko:** Uzależnienie od jednego payment gatewaya
**Mitigation:**
- Stripe jest stabilny i rozwijający się w Polsce
- Architektura pozwala na dodanie kolejnego gatewaya (PayU, Przelewy24) w razie potrzeby
- BLIK obsługiwany przez Stripe natywnie

---

## Vision (3-5 lat)

### Rok 1-2: Dominacja Polski
- #1 narzędzie do ogłoszeń marketplace w Polsce
- 50K+ active users
- Partnerships z głównymi platformami (OLX, Allegro)
- Auto-posting — integracje z API platform (1-click publish)

### Rok 3: Ekspansja CEE
- Wejście na rynki: Czechy, Słowacja, Węgry, Rumunia
- Lokalizacja UI i reguł platform
- 200K+ users, 20M+ zł ARR

### Rok 4-5: Beyond Listings
- **Price Prediction** — ML na danych historycznych, rekomendacje cenowe
- **Analytics** — competitive intelligence, trendy rynkowe
- **B2B Platform** — API dla sklepów, komisantów, agencji
- **AI Shopping Assistant** — pomoc w zakupach, porównywanie ofert

**Ultimate Goal:** Stać się infrastrukturą dla C2C commerce w CEE — każdy sprzedający używa naszych narzędzi, każda platforma integruje się z nami.

---

## Kontakt

**Email:** [your-email@example.com]
**Demo:** [app-url]
**GitHub:** [github.com/your-repo]

**Ready to talk?** Zapraszamy na 30-minutowe demo:
- Live product walkthrough (działający produkt, nie mockup)
- Detailed financial model
- Technical deep dive
- Go-to-market roadmap

---

*"Każdy zasługuje na profesjonalne ogłoszenie. AI to umożliwia."*
