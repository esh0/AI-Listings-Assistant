# Google Ads Audit Report — Marketplace AI
**Data auditu:** 2026-04-08
**Konto:** 810-219-3139 (Marketplace AI)
**Kampania:** [MA] Search — Generator ogłoszeń
**Okres danych:** 4–7 kwi 2026 (4 dni, kampania w fazie nauki)
**Cel pierwotny:** Płatne plany (STARTER/RESELER) — zakupy w Stripe

---

## Google Ads Health Score: 34/100 (Grade: F)

```
Conversion Tracking: 10/100  ██░░░░░░░░  (25%)
Wasted Spend:        45/100  ████░░░░░░  (20%)
Account Structure:   52/100  █████░░░░░  (15%)
Keywords & QS:       50/100  █████░░░░░  (15%)
Ads & Assets:        48/100  ████░░░░░░  (15%)
Settings & Targeting:55/100  █████░░░░░  (10%)
```

> Kampania ma 4 dni i jest w learning phase — score to ocena **konfiguracji**, nie potencjału.
> CTR 12% jest obiecujący (benchmark: 6,66%). Problemy to błędy setupu, nie słabość produktu.

---

## PLAN DZIAŁANIA — co zrobić i jak

### 🔴 PRIORYTET 1 — Śledzenie konwersji (zrób TERAZ, blokuje wszystko inne)

#### Krok 1a: Napraw Consent Mode v2 — kod już poprawiony ✅

Zmiana `wait_for_update: 500 → 2000` w `app/layout.tsx` jest już w kodzie (deploy na Vercel).

Po deployu: wejdź w Google Ads → Cele → Diagnostyka → Tryb uzyskiwania zgody → "View details" i sprawdź czy problem zniknął (może potrwać 24-48h do weryfikacji).

#### Krok 1b: Napraw konwersję — importuj `subscription_activated` z GA4

**Problem:** Mierzysz "Wyświetlenia strony" jako konwersję — to jest błędna konfiguracja (widać stan "Błędna konfiguracja" w Google Ads). Powinieneś mierzyć zakup planu.

**Krok po kroku:**

1. Otwórz:
   ```
   https://ads.google.com/aw/conversions/ga?ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0
   ```
2. Kliknij **"Importuj z Google Analytics"**
3. Wybierz zdarzenie **`subscription_activated`** (to zdarzenie wysyłane przez Stripe webhook)
4. Ustaw:
   - Kategoria: **Zakup**
   - Wartość: możesz zostawić domyślną lub ustawić dynamiczną
   - Okno konwersji: **90 dni**
   - Model atrybucji: **Oparte na danych**
5. Zapisz

6. Następnie idź do listy konwersji:
   ```
   https://ads.google.com/aw/conversions?ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0
   ```
7. Znajdź starą konwersję **"Wyświetlenia strony"** → kliknij ją → zmień typ z **"Podstawowe"** na **"Dodatkowe"** (lub usuń)
8. Nową konwersję `subscription_activated` ustaw jako **"Podstawową"**

> **Dlaczego:** Google Ads optymalizuje kampanię pod konwersję PRIMARY. Jeśli mierzysz wyświetlenie strony (które nigdy nie strzela bo tag jest błędny), kampania nie zbiera żadnych danych i nigdy nie wyjdzie z learning phase.

---

### 🔴 PRIORYTET 2 — Negatywne słowa kluczowe (zrób TERAZ, 71% budżetu w błoto)

**Problem:** Wszystkie 7 wyszukiwanych terminów z ostatnich 7 dni to zapytania "jak coś zrobić na OLX" — ludzie szukający darmowej instrukcji, nie płatnego generatora AI. Nie ma jeszcze żadnych negatywów.

**Krok po kroku:**

1. Otwórz:
   ```
   https://ads.google.com/aw/keywords/negative?campaignId=23723331827&ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0
   ```
2. Kliknij niebieski przycisk **"+"** → **"Dodaj wykluczające słowa kluczowe"**
3. Wybierz poziom: **Kampania** → `[MA] Search — Generator ogłoszeń`
4. Dodaj każde z poniższych (po jednym w linii):

   **Exact Match** (blokuje dokładnie to zapytanie):
   ```
   [jak dodać ogłoszenie]
   [jak wystawić ogłoszenie]
   [jak umieścić ogłoszenie]
   [jak napisać ogłoszenie]
   [jak dodać]
   [jak wystawić]
   [jak umieścić]
   ```

   **Phrase Match** (blokuje zapytania zawierające te słowa):
   ```
   "za darmo"
   "oddam"
   "gratis"
   "za free"
   "sprzedam sam"
   ```
5. Kliknij **"Zapisz"**

> **Dlaczego:** Frazy edukacyjne ("jak dodać ogłoszenie na olx") trafiają do osób, które chcą samodzielnie wystawić ogłoszenie — to nie są Twoi klienci. Twoi klienci szukają "generator ogłoszeń olx" lub "ai do ogłoszeń".

---

### 🟠 PRIORYTET 3 — Rozszerzenia reklam (sitelinki + callouts)

**Problem:** Brak jakichkolwiek rozszerzeń. Google Ads sygnalizuje to wprost: "Brak objaśnień w 1 kampanii" (+2,4%). Sitelinki zwiększają CTR o 10-20%.

**Krok po kroku:**

1. Otwórz ustawienia kampanii:
   ```
   https://ads.google.com/aw/campaigns/settings/detail?campaignId=23723331827&ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0
   ```
   Lub w menu: **Kampanie → [MA] Search — Generator ogłoszeń → Komponenty** (lewy panel)

2. Kliknij **"+"** → **"Sitelink"** → dodaj 4 sitelinki:

   | Tekst linku | Opis 1 | Opis 2 | URL |
   |---|---|---|---|
   | Jak to działa | AI analizuje zdjęcia | Gotowe w 30 sekund | https://www.marketplace-ai.pl/#jak-to-dziala |
   | Cennik | Plan FREE — 5 generacji | Starter od 19,99 zł/mies | https://www.marketplace-ai.pl/pricing |
   | Wypróbuj za darmo | Bez karty kredytowej | Pierwsze ogłoszenie gratis | https://www.marketplace-ai.pl/ |
   | OLX, Allegro, Vinted | 7 platform w jednym | Dopasowany styl i format | https://www.marketplace-ai.pl/ |

3. Kliknij **"+"** → **"Objaśnienie"** (Callout) → dodaj 4 objaśnienia:
   ```
   Bez karty kredytowej
   Wynik w 30 sekund
   OLX · Allegro · Vinted · FB
   AI analizuje zdjęcia
   ```

4. Kliknij **"+"** → **"Fragment informacji"** (Structured snippet):
   - Nagłówek: **"Platformy"**
   - Wartości: `OLX`, `Allegro Lokalnie`, `Vinted`, `Facebook Marketplace`

---

### 🟠 PRIORYTET 4 — Ustawienia kampanii: sieć i lokalizacja

**Krok po kroku:**

1. Otwórz:
   ```
   https://ads.google.com/aw/campaigns/settings/detail?campaignId=23723331827&ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0
   ```

2. **Sieci** → kliknij "Edytuj" → upewnij się że:
   - ✅ Sieć wyszukiwania Google — zaznaczona
   - ❌ Sieć reklamowa Google — **odznaczona** (jeśli zaznaczona, odznacz)

3. **Lokalizacje** → kliknij "Edytuj" → znajdź "Opcje lokalizacji":
   - Zmień z **"Osoby w lokalizacjach docelowych lub zainteresowane nimi"**
   - Na **"Osoby w lokalizacjach docelowych"** (Presence only)

---

### 🟡 PRIORYTET 5 — Dodaj słowa kluczowe do G2 Zakupowej

**Problem:** G2 Zakupowa ma 3 słowa kluczowe z 0 wyświetleniami przez 4 dni — za mało pokrycia.

**Krok po kroku:**

1. Otwórz grupę reklam:
   ```
   https://ads.google.com/aw/adgroups?campaignId=23723331827&ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0
   ```
2. Kliknij **"G2 Zakupowa"** → **"Słowa kluczowe"** → **"+"**
3. Dodaj (Exact Match, jeden per linia):
   ```
   [ai generator ogłoszeń]
   [automatyczne ogłoszenie olx]
   [generator tekstu ogłoszenia]
   [generator ogłoszeń vinted]
   [generator ogłoszeń allegro]
   [ai ogłoszenie sprzedaży]
   [narzędzie do ogłoszeń]
   ```
4. Ustaw stawki: max 1,50 zł (spójnie z kampanią)

---

### 🟡 PRIORYTET 6 — Kampania brandowa (nowa kampania)

**Problem:** Brak kampanii na własną markę. Ktoś szukający "marketplace ai" może trafić na konkurencję. Brand CPC to ok. 0,10-0,30 zł.

**Krok po kroku:**

1. Utwórz nową kampanię:
   ```
   https://ads.google.com/aw/campaigns/new?ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988785&__c=8655786485&authuser=0
   ```
2. Typ: **Sieć wyszukiwania**
3. Nazwa: **[MA] Brand**
4. Budżet: **3 zł/dzień** (brand jest tani)
5. Stawki: Manual CPC, max 0,50 zł
6. Słowa kluczowe (Exact Match):
   ```
   [marketplace ai]
   [marketplace-ai.pl]
   [marketplace ai generator]
   ```

---

## Harmonogram wdrożenia

| Dzień | Akcja |
|-------|-------|
| **Dziś** (2026-04-08) | ✅ `wait_for_update` naprawione w kodzie — deploy na Vercel |
| **Dziś** | Import konwersji `subscription_activated` z GA4 (Priorytet 1b) |
| **Dziś** | Dodaj negatywne słowa kluczowe (Priorytet 2) |
| **Jutro** | Dodaj sitelinki + callouts + structured snippet (Priorytet 3) |
| **Jutro** | Sprawdź/popraw ustawienia sieci i lokalizacji (Priorytet 4) |
| **Ten tydzień** | Dodaj słowa kluczowe do G2 Zakupowej (Priorytet 5) |
| **Ten tydzień** | Utwórz kampanię brandową (Priorytet 6) |
| **Za 2 tygodnie** | Sprawdź czy Consent Mode "Needs attention" zniknął |
| **Za 30 dni** | Ocena czy przejść na Smart Bidding (wymaga min. 15 konwersji) |

---

## Metryki do monitorowania (co tydzień)

| Metryka | Obecna wartość | Cel |
|---------|---------------|-----|
| CTR | 12% | Utrzymać >6,66% |
| Śr. CPC | 1,21 zł | Utrzymać <1,50 zł |
| Konwersje (zakupy) | 0 | >1/tydzień po naprawach |
| % budżetu na G2 Zakupową | ~29% | >70% |
| Wyszukiwane hasła z intencją zakupową | 1/7 (14%) | >80% |
| Consent Mode status | "Needs attention" | "Active" |

---

## Słownik problemów (dla kontekstu)

**Dlaczego G1 Edukacyjna jest problemem:**
Słowo kluczowe `'jak napisać ogłoszenie na olx'` (phrase match) wyświetla reklamę gdy ktoś szuka "jak napisać ogłoszenie na olx krok po kroku". Ta osoba chce darmowej instrukcji — nie płatnego narzędzia AI. Twoja reklama "Napisz ogłoszenie w 30 sek | AI pisze za Ciebie" przyciąga kliknięcia z ciekawości, ale ta osoba nie kupi planu.

**Dlaczego Consent Mode blokuje konwersje:**
Consent Mode v2 informuje Google o stanie zgody użytkownika. Gdy jest błąd ("Needs attention"), Google Ads nie może modelować konwersji ani przypisywać ich do kliknięć. `wait_for_update: 500` było za krótkie — React potrzebuje więcej czasu na zamontowanie CookieBanner. Zmienione na 2000ms.

**Dlaczego `ad_generated` to zła konwersja:**
`ad_generated` strzela gdy użytkownik kliknie "Generuj ogłoszenie" — to darmowa akcja dostępna bez rejestracji (plan FREE: 5 generacji). Kampania optymalizowana pod tę konwersję będzie przyciągać użytkowników FREE, nie płacących. Prawidłowa konwersja to `subscription_activated` = Stripe potwierdził zakup planu.

---

## Pełna lista 74 checków

### 1. Conversion Tracking — 10/100 (25%)

| # | Check | Status | Uwagi |
|---|-------|--------|-------|
| G-CT1 | Konwersja zdefiniowana i weryfikowalna | ❌ FAIL | Stan "Błędna konfiguracja" |
| G-CT2 | Brak duplikacji konwersji | ⚠️ WARNING | 1 konwersja, ale nie działa |
| G-CT3 | Enhanced Conversions aktywne | ❌ FAIL | Brak potwierdzenia |
| G-CT4 | Consent Mode v2 zaimplementowany | ⚠️ WARNING | Zaimplementowany, ale "Needs attention" — naprawione w kodzie (wait_for_update 500→2000) |
| G-CT5 | Atrybucja: data-driven lub last-click | ❌ FAIL | Nie skonfigurowane (konwersja nie działa) |
| G-CT6 | Okno konwersji odpowiednie do cyklu | ❌ FAIL | Nie skonfigurowane |
| G-CT7 | Konwersje primary vs secondary rozróżnione | ❌ FAIL | `ad_generated` jako primary — mikro-konwersja ≠ zakup |
| G-CT8 | Server-side tagging / GTM | ❌ FAIL | Bezpośredni gtag, brak GTM |
| G-CT9 | Offline conversion import | N/A | Nie dotyczy |
| G-CT10 | Konwersja mierzy cel biznesowy (zakup) | ❌ FAIL | Mierzy "Wyświetlenia strony" (0 wyników) |
| G-CT11 | Tag zweryfikowany i aktywny | ❌ FAIL | Niezweryfikowany |

### 2. Wasted Spend / Negatives — 45/100 (20%)

| # | Check | Status | Uwagi |
|---|-------|--------|-------|
| G-WS1 | Search Terms Report przejrzany | ✅ PASS | 7 terminów przeanalizowanych |
| G-WS2 | Negatywy dodane na bazie STR | ❌ FAIL | 0 negatywów w koncie |
| G-WS3 | Shared negative lists na poziomie konta | ❌ FAIL | Brak |
| G-WS4 | Brak Broad Match bez Smart Bidding | ✅ PASS | Phrase + Exact z Manual CPC |
| G-WS5 | Odfiltrowane "za darmo" | ❌ FAIL | "jak dodać ogłoszenie na olx za darmo" — brak negatywu |
| G-WS6 | Odfiltrowane zapytania informacyjne | ❌ FAIL | 6/7 terminów = instrukcje DIY |
| G-WS7 | Close variant pollution monitorowany | ⚠️ WARNING | Zbliżone odmiany widoczne w STR |
| G-WS8 | Geograficzne marnotrawstwo | ✅ PASS | Polska — OK |

### 3. Account Structure — 52/100 (15%)

| # | Check | Status | Uwagi |
|---|-------|--------|-------|
| G-AS1 | Konwencja nazewnicza | ✅ PASS | [MA] Search, G1/G2 |
| G-AS2 | Brand / non-brand rozdzielone | ❌ FAIL | Brak kampanii brandowej |
| G-AS3 | Ad groups tematycznie spójne | ⚠️ WARNING | G1 miesza intencje edukacyjne |
| G-AS4 | Max 15-20 KW per ad group | ✅ PASS | 5 KW łącznie |
| G-AS5 | Budżet nie ogranicza kampanii | ✅ PASS | 10 zł/dzień, wydano 3,64 zł |
| G-AS6 | Search vs Display rozdzielone | ✅ PASS | Search only |
| G-AS7 | Remarketing kampania istnieje | ❌ FAIL | Brak |
| G-AS8 | Podział ToFu/MoFu/BoFu | ❌ FAIL | Jedna kampania |
| G-AS9 | Etykiety kampanii | ❌ FAIL | Brak |
| G-AS10 | Wykluczenia kampanii | ❌ FAIL | 0 negatywów |
| G-AS11 | Brand vs competitor separation | N/A | Brak kampanii competitor |
| G-AS12 | Budget allocation: BoFu > ToFu | ❌ FAIL | G1 Edukacyjna 71% budżetu |

### 4. Keywords & Quality Score — 50/100 (15%)

| # | Check | Status | Uwagi |
|---|-------|--------|-------|
| G-KW1 | Śr. QS ≥7 | ⚠️ WARNING | Za mało danych |
| G-KW2 | Brak KW z QS <5 | ⚠️ WARNING | Nie można ocenić |
| G-KW3 | CTR komponent QS >3% | ✅ PASS | 12% całość, 11,76% i 25% per KW |
| G-KW4 | Relevance reklamy do KW | ⚠️ WARNING | G1: "jak napisać" → reklama o generatorze AI — słabe dopasowanie intencji |
| G-KW5 | Landing page relevance | ⚠️ WARNING | Brak danych mobile speed |
| G-KW6 | Brak kanibalizacji | ✅ PASS | 1 kampania |
| G-KW7 | Impression Share monitorowany | ❌ FAIL | Brak danych |
| G-KW8 | Match type strategy | ⚠️ WARNING | Phrase match dla edukacyjnych fraz — zbyt szeroki |

### 5. Ads & Assets — 48/100 (15%)

| # | Check | Status | Uwagi |
|---|-------|--------|-------|
| G-AD1 | RSA: ≥8 unikalnych nagłówków | ❌ FAIL | Nieweryfikowalne (brak screenshotu edytora) |
| G-AD2 | RSA: ≥3 opisy | ❌ FAIL | Nieweryfikowalne |
| G-AD3 | Ad strength: Good lub Excellent | ⚠️ WARNING | "Odpowiednia" = Average |
| G-AD4 | Minimalne użycie pinów | ⚠️ WARNING | Nieweryfikowalne |
| G-AD5 | Sitelinki ≥4 | ❌ FAIL | Brak |
| G-AD6 | Callouts ≥4 | ❌ FAIL | Brak — Google sygnalizuje +2,4% |
| G-AD7 | Structured snippets | ❌ FAIL | Brak |
| G-AD8 | Image extensions | ❌ FAIL | Brak |
| G-AD9 | CTA w treści reklamy | ✅ PASS | "Zacznij za darmo bez karty" |
| G-AD10 | Value proposition widoczna | ✅ PASS | "AI generuje tytuł, opis i cenę w sekundy" |
| G-AD11 | CTR reklamy vs benchmark | ✅ PASS | 9,52% > benchmark 6,66% |
| G-AD12 | Objaśnienia skonfigurowane | ❌ FAIL | Brak — rekomendacja Google +2,4% |

### 6. Settings & Targeting — 55/100 (10%)

| # | Check | Status | Uwagi |
|---|-------|--------|-------|
| G-ST1 | Bid strategy odpowiednia | ✅ PASS | Manual CPC przy braku konwersji — prawidłowo |
| G-ST2 | Lokalizacja: "Presence only" | ⚠️ WARNING | Do weryfikacji — domyślnie Google ustawia "Presence or Interest" |
| G-ST3 | Display opt-out dla Search | ⚠️ WARNING | Do weryfikacji |
| G-ST4 | Ad schedule ustawiony | ❌ FAIL | 24/7 bez harmonogramu |
| G-ST5 | Device bid adjustments | ⚠️ WARNING | 100% mobile — monitorować CVR po danych |
| G-ST6 | Audiences w trybie obserwacji | ❌ FAIL | Brak list odbiorców |
| G-ST7 | Customer Match lista | ❌ FAIL | Brak |
| G-ST8 | Placement exclusions | N/A | Search only |
| G-ST9 | Landing page speed mobile | ❌ FAIL | Wynik "–" w raporcie stron docelowych |
| G-ST10 | URL tracking parametry | ✅ PASS | utm_source/medium/campaign/content skonfigurowane |
| G-ST11 | Partnerzy wyszukiwania | ⚠️ WARNING | Wyłączeni — do decyzji po zebraniu danych |
| G-ST12 | Target locations precyzyjne | ✅ PASS | Polska |

---

## Szybkie linki do Google Ads

| Gdzie | Link |
|-------|------|
| Konwersje | `https://ads.google.com/aw/conversions?ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0` |
| Import z GA4 | `https://ads.google.com/aw/conversions/ga?ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0` |
| Negatywne KW | `https://ads.google.com/aw/keywords/negative?campaignId=23723331827&ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0` |
| Grupy reklam | `https://ads.google.com/aw/adgroups?campaignId=23723331827&ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0` |
| Ustawienia kampanii | `https://ads.google.com/aw/campaigns/settings/detail?campaignId=23723331827&ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0` |
| Diagnostyka konwersji | `https://ads.google.com/aw/conversions/summary?ocid=8137988765&euid=100163053&__u=6555596997&uscid=8137988765&__c=8655786485&authuser=0` |

---

*Raport wygenerowany: 2026-04-08 | Marketplace AI Google Ads Audit v2*
