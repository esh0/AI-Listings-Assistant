# Google Ads — Status i weryfikacja
**Ostatnia aktualizacja:** 2026-04-09
**Konto:** 810-219-3139 (Marketplace AI)

---

## Wszystko wykonane ✅

| Zadanie | Status |
|---------|--------|
| Consent Mode — `wait_for_update` 500→2000ms | ✅ Wdrożone na master (v1.4.7) |
| Consent Mode — `initGA4()` retry race condition | ✅ Wdrożone na master (v1.4.8) |
| Akceptacja domeny `marketplace-ai.pl` w tagu Google | ✅ Zrobione |
| Konwersja `subscription_activated` (Zakup, 19,99 zł) | ✅ Utworzona + kod wdrożony (v1.4.9) |
| Stara konwersja "Wyświetlenie strony" → Dodatkowa | ✅ Zrobione |
| Negatywne słowa kluczowe (11 fraz) | ✅ Dodane |
| Sitelinki (4 linki do podstron) | ✅ Dodane, w trakcie weryfikacji |
| Objaśnienia / callouts (4 teksty) | ✅ Dodane |
| Rozszerzenie informacji (Marki: OLX, Allegro...) | ✅ Dodane |
| Ustawienia kampanii (sieć reklamowa, lokalizacje) | ✅ Sprawdzone |
| Nowe słowa kluczowe w G2 Zakupowa (7 fraz) | ✅ Dodane |
| Kampania brandowa `[MA] Brand` | ✅ Utworzona (3 zł/dzień, max CPC 0,50 zł) |

---

## Do sprawdzenia — terminy

| Kiedy | Co sprawdzić |
|-------|-------------|
| **Za 24-48h** | Diagnostyka tagu Google — czy błąd "0% consent granted" zniknął. Ścieżka: Narzędzia → Menedżer danych → Tag Google → Zarządzaj → "Pokaż issues" |
| **Za 24-48h** | Czy sitelinki i rozszerzenia przeszły weryfikację (status zmieni się z "W trakcie sprawdzania" na aktywny) |
| **Za 7 dni** | Search Terms Report — czy negatywne słowa kluczowe odcięły zapytania "jak dodać/wystawić" i "za darmo". Ścieżka: Kampanie → [MA] Search → Statystyki wyszukiwania |
| **Za 7 dni** | CTR po dodaniu rozszerzeń — powinien wzrosnąć z 12% do 15%+ |
| **Za 30 dni** | Czy konwersja `subscription_activated` zaczęła spływać (wymaga pierwszego zakupu po kliknięciu reklamy) |
| **Za 30 dni** | Ocena Smart Bidding — wymaga min. 15 konwersji/mies. żeby przejść z Manual CPC |

---

## Metryki do monitorowania (co tydzień)

| Metryka | Obecna wartość | Cel |
|---------|---------------|-----|
| CTR | 12% | >15% po dodaniu rozszerzeń |
| Śr. CPC | 1,21 zł | <1,50 zł |
| Konwersje `subscription_activated` | 0 | >1/tydzień |
| % zapytań z intencją zakupową | ~14% | >80% po negatywach |
| Consent Mode status | "Needs attention" | "Active" (za 24-48h) |
| Wynik optymalizacji | 79% | >85% |
