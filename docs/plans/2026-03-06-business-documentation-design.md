# Design: Dokumentacja Biznesowa Marketplace Assistant

> **Data:** 2026-03-06
> **Status:** Zatwierdzona

## Kontekst

Marketplace Assistant potrzebuje kompletnej dokumentacji biznesowej zawierającej strategię finansową, model cenowy, opis funkcji i UI. Projekt to side-project z JDG, cel: 4-6 tys. zł/mies.

## Decyzje podjęte podczas brainstormingu

### Model cenowy
- 4 tiery: Free (0 zł, 5 gen, 2 zdj.) / Starter (19.99 zł, 30 gen, 5 zdj.) / Reseler (49.99 zł, 80 gen, 8 zdj.) / Business (99.99 zł, 200 gen, 12 zdj.)
- Dostawki kredytów: 10 za 9.99 zł / 30 za 24.99 zł / 60 za 39.99 zł
- Logika: subskrypcja najpierw, potem dostawkowe. Subskrypcja resetuje się, dostawki nie wygasają.

### Model AI
- Zmiana z o4-mini na GPT-4.1 mini (oszczędność ~60-65%)
- GPT-4.1 mini dla wszystkich tierów
- Wymaga testów jakości po polsku przed wdrożeniem

### Guest tracking
- 3-warstwowy: UUID (localStorage) + IP rate-limiting (hash) + hard-wall po wyczerpaniu
- RODO-safe: UUID nie jest daną osobową, IP przechowywany jako hash

### Bramka płatności
- Stripe (obsługuje BLIK + karty w PL)

### Nowe features
- Szablony opisów z dynamicznymi polami (limity per tier)
- Zapamiętywanie preferencji (ton per platforma, sposób dostawy)
- System płatności Stripe
- Strona cenowa

### Dokumenty prawne
- Regulamin i polityka prywatności (drafty, do weryfikacji przez prawnika)
- Minimalizacja danych właściciela — tylko wymagane prawnie

## Wytworzone pliki

1. `docs/BUSINESS.md` — główna dokumentacja biznesowa (strategia, finanse, funkcje, UI)
2. `docs/legal/regulamin.md` — draft regulaminu serwisu
3. `docs/legal/polityka-prywatnosci.md` — draft polityki prywatności (RODO)
