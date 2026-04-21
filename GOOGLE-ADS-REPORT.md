# Google Ads — Audit & Status
**Ostatnia aktualizacja:** 2026-04-21
**Konto:** 810-219-3139 (Marketplace AI)
**Okres danych:** 4–21 kwietnia 2026 (18 dni)
**Kampanie:** `[MA] Search — Generator ogłoszeń` + `[MA] Brand`

---

## Health Score

```
Google Ads Health Score: 44/100 (Grade: D)

Conversion Tracking: 55/100  █████░░░░░  (25%)
Wasted Spend:        20/100  ██░░░░░░░░  (20%)
Account Structure:   50/100  █████░░░░░  (15%)
Keywords:            45/100  ████░░░░░░  (15%)
Ads:                 60/100  ██████░░░░  (15%)
Settings:            65/100  ██████░░░░  (10%)
```

Niski wynik wynika głównie z **zerowych konwersji przy 100 zł wydanych** oraz **masowego marnotrawstwa budżetu na zapytania "jak dodać ogłoszenie"** — ludzi szukających technicznej pomocy OLX, nie generatora AI.

---

## Podsumowanie wyników (4–21 kwietnia)

| Metryka | Wartość | Ocena |
|---------|---------|-------|
| Wydano łącznie | 100,82 zł | — |
| Kliknięcia | 69 | — |
| Wyświetlenia | 1 039 | — |
| CTR | 6,64% | ⚠️ WARNING (próg Pass: ≥6,66%) |
| Śr. CPC | 1,46 zł (~0,36 USD) | ✅ PASS |
| Konwersje `ad_generated` | 0 | 🔴 FAIL |
| Konwersje `subscription_activated` | 0 | 🔴 FAIL |
| CVR | 0,00% | 🔴 FAIL |
| Kampania brandowa `[MA] Brand` | 0 wyświetleń | 🔴 FAIL |

---

## Krytyczne problemy (działaj natychmiast)

### 🔴 #1 — Wasted spend: "jak dodać ogłoszenie" pochłania 29% budżetu

**Hasło:** `jak dodać ogłoszenie na olx`
- 214 wyświetleń, 20 kliknięć, **29,19 zł** — 29% całego budżetu w tym okresie
- Intencja: użytkownik szuka przycisku "Dodaj ogłoszenie" na OLX.pl, nie generatora AI
- Zero konwersji, zero szans na konwersję — całkowicie inna potrzeba

**Inne hasła o tej samej złej intencji (łącznie ~40 zł zmarnowane):**
- `jak wystawić ogłoszenie na olx` — 69 wyśw., 1 klik, 1,47 zł
- `jak wystawić ogloszenie na olx` — 4 wyśw., 2 kliki, 2,98 zł
- `jak dać ogłoszenie na olx` — 17 wyśw., 2 kliki, 2,86 zł
- `jak dodać ogłoszenia na olx` — 3 wyśw., 0 kliki
- `jak zrobić ogłoszenie na olx` — 26 wyśw., 0 kliki
- `jak zamieścić ogłoszenie na olx` — 12 wyśw., 0 kliki
- `jak wystawić na olx` — 5 wyśw., 1 klik, 1,42 zł
- `olx jak dodać ogłoszenie` — 10 wyśw., 0 kliki
- `dodać ogłoszenie na olx` — 3 wyśw., 0 kliki
- `jak założyć ogłoszenie na olx` — 2 wyśw.
- `jak wystawić darmowe ogłoszenie na olx` — 4 wyśw., 1 klik, 1,50 zł

**Szacowany zmarnowany budżet:** ~40–45 zł z 100,82 zł = **~40–45% całego spend**

**Akcja:** Dodaj natychmiast negatywy (patrz sekcja "Plan działań").

---

### 🔴 #2 — Kampania brandowa [MA] Brand ma 0 wyświetleń

Kampania `[MA] Brand` (słowa: `marketplace ai`, `marketplace ai generator`, `marketplace-ai.pl`) — **zero wyświetleń przez 18 dni**.

Możliwe przyczyny:
- Nikt jeszcze nie szuka marki z nazwy (za wcześnie — marka nieznana)
- Błąd w ustawieniach kampanii (wstrzymana, problem z zatwierdzeniem reklam, brak budżetu)
- Zbyt niski max CPC 0,50 zł powoduje, że reklamy nie wygrywają aukcji

**Akcja:** Sprawdź w panelu Google Ads czy kampania jest aktywna i czy reklamy są zatwierdzone. Jeśli tak — zostaw, marka jeszcze nie ma wyszukiwalności. Jeśli nie — napraw.

---

### 🔴 #3 — Zero konwersji przy 100 zł wydanych

69 kliknięć, 0 konwersji `ad_generated`. Możliwe przyczyny:
1. **Zła intencja ruchu** — większość kliknięć to "jak dodać ogłoszenie" (powyżej)
2. **Problem z tagiem konwersji** — sprawdź w Google Ads → Cele → Konwersje czy `ad_generated` ma status "Rejestrowanie"
3. **Słaba konwersja landing page** — użytkownicy trafiają na stronę główną ale nie klikają "Generuj"
4. **Niezgodność oczekiwań** — reklama obiecuje "generator ogłoszeń", użytkownik szuka "jak wystawić na OLX" i wychodzi

---

### 🟡 #4 — "generator ogłoszeń do druku" — zła intencja

- 8 wyświetleń, 1 klik, 1,44 zł
- Szuka generatora ogłoszeń **do drukowania** (słupy ogłoszeniowe), nie generatora AI

**Akcja:** Dodaj negat `[do druku]` i `"ogłoszenia do druku"`.

---

### 🟡 #5 — "darmowy kreator ogłoszeń" — niska jakość intencji

- 15 wyświetleń, 3 kliki, 4,46 zł, 0 konwersji
- Intencja: szuka darmowego narzędzia, ale "kreator" sugeruje edytor wizualny (Canva-style), nie AI
- Może być wartościowe — obserwuj, ale rozważ negat `[kreator]` jeśli dalej 0 konwersji

---

### 🟡 #6 — Raport "Inne wyszukiwane hasła" = 28 kliknięć za 40,73 zł ukryte

28 kliknięć (za 40,73 zł) jest w kategorii "Inne" — Google nie pokazuje tych haseł ze względu na prywatność (mało wyświetleń każde). To **41% całego budżetu w niewidocznych zapytaniach**. Nie możemy ich wykluczyć, ale warto monitorować.

---

## Analiza Search Terms — intencje

| Intencja | Hasła | Wyśw. | Kliki | Koszt | Ocena |
|----------|-------|-------|-------|-------|-------|
| **Instrukcja techniczna OLX** (jak dodać/wystawić/zamieścić) | ~20 wariantów | ~430 | ~28 | ~40 zł | 🔴 Wyklucz |
| **Instrukcja Vinted** (jak sprzedawać/wystawiać) | ~15 wariantów | ~200 | ~6 | ~9 zł | 🔴 Wyklucz |
| **Generator AI** (generator ogłoszeń, kreator) | 3–4 hasła | ~33 | ~5 | ~7 zł | ✅ Zostaw |
| **Do druku** | 1 hasło | 8 | 1 | 1,44 zł | 🔴 Wyklucz |
| **Niewidoczne** | "Inne" | ~300 | 28 | 40,73 zł | ⚠️ Monitoruj |

---

## Plan działań

### Priorytet 1 — Dodaj negatywy DZIŚ (oszczędność ~40 zł/mies.)

Dodaj do **kampanii [MA] Search** jako listy negatywów (Exact Match chyba że zaznaczono inaczej):

**Blok "instrukcja techniczna OLX"** (Phrase Match — blokuje wszystkie warianty):
```
"jak dodać ogłoszenie"
"jak wystawić ogłoszenie"
"jak zamieścić ogłoszenie"
"jak dać ogłoszenie"
"jak wstawić ogłoszenie"
"jak umieścić ogłoszenie"
"jak zrobić ogłoszenie"
"jak założyć ogłoszenie"
"dodaj ogłoszenie"
"wystaw ogłoszenie"
"dodać ogłoszenie"
"wystawić ogłoszenie"
```

**Blok "instrukcja Vinted"** (Phrase Match):
```
"jak sprzedawać na vinted"
"jak sprzedać na vinted"
"jak wystawić na vinted"
"jak wystawiać na vinted"
"jak wystawić ubrania"
"jak sprzedać ubrania"
"jak wystawić ciuchy"
"jak wystawić przedmiot"
"jak wystawić rzeczy"
"jak zacząć sprzedawać"
"jak zwiększyć sprzedaż"
```

**Blok "do druku"** (Exact + Phrase):
```
[do druku]
"ogłoszenia do druku"
"ogłoszenie do druku"
```

**Blok "za darmo / bezpłatny"** (jeśli jeszcze nie ma):
```
"za darmo"
"bezpłatny"
"darmowe ogłoszenia"
```

> ⚠️ Uwaga: NIE dodawaj `[jak napisać ogłoszenie]` jako negatywu — to intencja edukacyjna bliska Twojemu produktowi i G1 Edukacyjna jest na nią ukierunkowana. Dodaj tylko hasła o intencji "kliknięcia na OLX/Vinted".

---

### Priorytet 2 — Przepisz słowa kluczowe G1 Edukacyjna

Obecne słowo kluczowe: `"jak napisać ogłoszenie na olx"` (Phrase Match) — przyciąga zbyt szeroki ruch.

**Zamień na Exact Match + wąskie warianty:**
```
[jak napisać ogłoszenie na olx]
[jak napisać opis produktu olx]
[jak napisać ogłoszenie vinted]
[jak napisać opis na vinted]
[jak napisać dobre ogłoszenie]
[opis produktu generator]
```

Phrase Match zostaw tylko dla fraz, które historycznie dawały wartościowe kliknięcia.

---

### Priorytet 3 — Dodaj słowa kluczowe do G2 Zakupowa

G2 Zakupowa ma teraz tylko `[generator ogłoszeń olx]`, `[generator opisu vinted]`, `"generator ogłoszeń"`. Dodaj:
```
[generator ogłoszeń ai]
[generator ogłoszeń allegro]
[ai generator ogłoszeń]
[marketplace ai]
[generator opisu produktu]
[automatyczne ogłoszenie olx]
"generator ogłoszeń"  (już jest — zostaw)
```

---

### Priorytet 4 — Sprawdź tag konwersji

Ścieżka: Google Ads → Cele → Konwersje → `ad_generated`

Sprawdź:
- Status: "Rejestrowanie" (zielony) czy "Brak ostatnich konwersji" (szary)?
- Jeśli szary — sprawdź w GA4 czy zdarzenie `ad_generated` spływa (Raporty → Czas rzeczywisty → Zdarzenia)
- Jeśli GA4 rejestruje ale Google Ads nie — problem z połączeniem GA4↔Google Ads lub import konwersji

---

### Priorytet 5 — Kampania brandowa

Jeśli `[MA] Brand` jest aktywna i reklamy zatwierdzone — zostaw i wróć za 30 dni. Marka jest za świeża na mierzalne wyszukiwania brandowe. Możesz obniżyć budżet do 1 zł/dzień żeby nie marnować limitu.

---

## Co działa dobrze

| Element | Ocena |
|---------|-------|
| CTR 6,64% | Blisko progu "Pass" — dobry jak na nowe konto |
| Śr. CPC 1,46 zł | Poniżej max 1,50 zł — efektywne |
| Sitelinki (4) | ✅ Aktywne |
| Callouts (4) | ✅ Aktywne |
| Structured snippets | ✅ Aktywne |
| Consent Mode v2 | ✅ Wdrożone |
| Brand/non-brand separation | ✅ Osobna kampania brandowa |
| Targeting Polska only | ✅ Brak wasted spend zagraniczny |
| Manual CPC | ✅ Odpowiednie przy 0 konwersjach (Smart Bidding wymaga min. 15/mies.) |

---

## Do sprawdzenia — terminy

| Kiedy | Co |
|-------|----|
| **Dziś** | Dodaj negatywy z Priorytetu 1 |
| **Dziś** | Sprawdź status tagu `ad_generated` w Google Ads → Cele |
| **Dziś** | Sprawdź czy `[MA] Brand` jest aktywna i reklamy zatwierdzone |
| **Za 7 dni** | Search Terms Report — czy negatywy odcięły "jak dodać/wystawić" |
| **Za 7 dni** | CTR — powinien wzrosnąć do 8–10% po wyczyszczeniu złego ruchu |
| **Za 14 dni** | Jeśli nadal 0 konwersji — sprawdź heatmapy landing page (Hotjar/Microsoft Clarity) |
| **Za 30 dni** | Ocena Smart Bidding — wymaga min. 15 konwersji/mies. |
| **Za 30 dni** | Rozważ dodanie słów kluczowych konkurencji jako negatywy lub jako osobna kampania |

---

## Metryki do monitorowania (co tydzień)

| Metryka | Obecna | Cel po optymalizacji |
|---------|--------|----------------------|
| CTR | 6,64% | >10% (po usunięciu złego ruchu) |
| Śr. CPC | 1,46 zł | <1,50 zł |
| % budżetu na "instrukcja techniczna" | ~40% | <5% |
| Konwersje `ad_generated` | 0 | >5/tydzień |
| Konwersje `subscription_activated` | 0 | >1/miesiąc |
| Wynik optymalizacji | bd. | >80% |
