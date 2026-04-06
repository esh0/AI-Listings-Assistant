# Marketing Strategy Design — Marketplace AI
**Date:** 2026-03-31
**Status:** Draft

---

## Context

marketplace-ai.pl działa ~3 tygodnie. GA4 dane (28 dni): 55 unikalnych użytkowników, 0 zł przychodu. Funnel wewnętrzny działa dobrze (30% sprawdza /pricing, 23% trafia na softwall) — problem to wyłącznie brak zasięgu.

Dotychczasowe kanały organiczne (Reels, grupy FB, blog SEO) generują **ruch discovery** — użytkownik trafia na stronę "bo ciekawe", nie w momencie gdy aktywnie szuka narzędzia. To wyjaśnia niską konwersję mimo dobrego produktu.

**Cel tej strategii:** zbudować kanały z **intencją zakupu** w pierwszych 90 dniach, przy budżecie ~300 zł/mies i profilu operatora: technicznym, bez regularnego nagrywania.

---

## Dane wyjściowe (baseline)

| Metryka | Wartość |
|---|---|
| Unikalni użytkownicy / 7 dni | ~54 |
| Źródła ruchu | Organic Social 40, Direct 17, Paid Social 8, Referral 2 |
| Rejestracje (szacunek) | ~5 |
| Przychód MRR | 0 zł |
| SEO kliknięcia / miesiąc | 3 |
| softwall_shown | 20 (13 userów) |
| pricing_page_viewed | 24 (18 userów) |

---

## Strategia — 3 filary

### Filar 1: Google Ads PPC (priorytet, tydzień 1)

**Cel:** Przechwycić użytkowników z intencją zakupu wpisujących frazy problemowe w Google.

**Frazy (phrase/exact match, NIE broad):**
- "jak napisać ogłoszenie na olx"
- "generator ogłoszeń olx"
- "generator opisu vinted"
- "jak napisać opis produktu olx"
- "ogłoszenie olx przykład"
- "jak wystawić rzeczy na vinted"

**Konfiguracja:**
- Typ kampanii: Search (nie Display, nie Performance Max)
- Budżet: 150 zł pierwsze 2 tygodnie (test), 200-250 zł/mies docelowo
- CPC szacowany: 0.80-1.50 zł → 4-8 kliknięć/dzień
- Landing page: strona główna (bez zmian — formularz już jest)
- Konwersja w GA4: event `softwall_shown` lub `ad_generated` jako cel
- Setup: jednorazowo 4-6h

**KPIs:**
- 30 dni: 120-200 kliknięć, 15-25 rejestracji, 2-4 płatnych konwersji
- 60 dni: optymalizacja na podstawie CTR, wyłączenie niekonwertujących fraz
- 90 dni: dane PPC informują priorytety SEO (które frazy konwertują → pisz artykuły pod nie)

**Ryzyko:** 200 zł może być za mało na Smart Bidding (potrzeba ~50-100 konwersji). Przez pierwsze 30 dni — tryb ręczny, monitoruj co 3-4 dni.

---

### Filar 2: Cold Outreach na Vinted (priorytet, tydzień 1, równolegle)

**Cel:** Bezpośredni kontakt z ICP w momencie gdy aktywnie sprzedają.

**Jak identyfikować cel:**
- Vinted: przeglądaj "nowe" ogłoszenia, filtruj sprzedawców z 15+ wystawionymi przedmiotami
- OLX: wyszukaj "ubrania/elektronika/dom" sortuj od najnowszych, sprawdzaj profile z 15+ ogłoszeniami

**Szablon wiadomości (DM, ~3 zdania):**
> "Hej, widzę że dużo sprzedajesz — tworzę narzędzie które automatyzuje pisanie opisów ogłoszeń na Vinted/OLX z AI. Pierwsze 5 za darmo, bez rejestracji. Chcesz link?"

**Zasady operacyjne:**
- Max 20-25 DM dziennie z jednego konta (ochrona przed banem)
- Zacznij od Vinted (łagodniejsze niż OLX), OLX od tygodnia 3
- Zmieniaj formulację co 3-4 dni (nie kopiuj-wklej identycznie)
- Track w arkuszu: data, platforma, profil, odpowiedź (tak/nie/brak), rejestracja (UTM)
- UTM: `?ref=vinted-dm` / `?ref=olx-dm`

**KPIs:**
- 30 dni: ~280 kontaktów, ~15-30 odpowiedzi, 8-15 rejestracji, 2-5 płatnych
- 60 dni: dane o profilu który konwertuje (ilu ogłoszeń, jak często sprzedaje)
- 90 dni: email follow-up automatyczny na podstawie zebranych patterns

**Ryzyko:** Niska stopa odpowiedzi (<5%) = problem z treścią wiadomości, zmień szablon. Ban OLX = rozgrzej konto przez tydzień normalną aktywnością przed DM.

---

### Filar 3: Nano-influencer barter (priorytet 3, od miesiąca 2)

**Cel:** Dotarcie do publiczności #secondhandpolska przez zaufaną rekomendację.

**Kiedy zacząć:** Dopiero po osiągnięciu ~50-100 aktywnych userów i zebraniu 3-5 testimoniali — łatwiej przekonać twórcę do testu gdy produkt ma social proof.

**Target twórcy:**
- TikTok/Instagram, 2k-20k followersów
- Nisza: #secondhandpolska, #thriftpolska, ogłoszenia online, minimalizm/porządki
- Engagement rate >3%, ostatni film <2 tygodnie temu
- Już robią format "jak sprzedaję online" / "porządki w szafie"

**Oferta:** Darmowy dostęp RESELER na 3 miesiące (koszt marginalny = 0 zł) w zamian za szczery test i ewentualny post — bez zobowiązań co do formatu ani terminu.

**Szablon DM:**
> "Hej, widzę że regularnie sprzedajesz online — tworzę Marketplace AI, automatyzuje pisanie ogłoszeń na OLX i Vinted. Chcesz przetestować za darmo? Daję darmowy dostęp premium na 3 miesiące, bez żadnych zobowiązań co do posta."

**KPIs:**
- 30 dni od startu: 2-3 partnerstwa nawiązane, 1 post live
- Efekt nieliniowy: 0 lub 50-500 wizyt jednorazowo

---

## Co porzucić / zredukować

| Kanał | Decyzja | Powód |
|---|---|---|
| Instagram posty-grafiki | Opublikuj zaplanowane, nie inwestuj więcej czasu | Nikt nie szuka generatora ogłoszeń na IG |
| Grupy FB "dajcie feedback" | Stop | Błędny target (SaaS ownerzy ≠ sprzedawcy OLX) |
| Artykuły SEO (nowe) | Wstrzymaj pisanie nowych | Za wcześnie, pozycje 7-35, dane z PPC wskażą priorytety |
| SEO artykuły istniejące | Zaktualizuj pod long-tail intent | Dodaj FAQ schema, konkretne frazy z PPC który konwertują |
| TikTok Reels | Zostaw konto, ale nie nagrywaj regularnie | Nie pasuje do profilu "technicznego" operatora |

---

## Budżet miesięczny

| Kanał | Koszt |
|---|---|
| Google Ads PPC | 200-250 zł |
| Cold Outreach | 0 zł |
| Nano-influencer (od m2) | 0-50 zł (opcjonalnie) |
| **Łącznie** | **200-300 zł** |

---

## Timeline (90 dni)

**Tydzień 1-2:**
- [ ] Założyć konto Google Ads, skonfigurować kampanię Search
- [ ] Skonfigurować konwersję GA4 → Google Ads (event `ad_generated`)
- [ ] Start cold outreach na Vinted (20 DM/dzień)
- [ ] Arkusz trackingowy dla outreach

**Tydzień 3-4:**
- [ ] Analiza pierwszych danych PPC (CTR per fraza, koszty)
- [ ] Wyłączyć nieefektywne frazy, zwiększyć stawki na konwertujące
- [ ] Rozszerzyć outreach na OLX (po rozgrzaniu konta)
- [ ] Pierwsza ocena: ile rejestracji, skąd, co konwertuje

**Miesiąc 2:**
- [ ] Optymalizacja PPC na podstawie 30-dniowych danych
- [ ] Start poszukiwań nano-influencerów (gdy ~50 aktywnych userów)
- [ ] Zaktualizować artykuły SEO na podstawie fraz z PPC które konwertują

**Miesiąc 3:**
- [ ] Ocena CAC per kanał, decyzja o skalowaniu budżetu PPC
- [ ] Jeśli influencer barter działa: 2-3 kolejne partnerstwa
- [ ] Cel: 10-20 płatnych userów, MRR ~300-500 zł

---

## Metryki sukcesu (30/60/90 dni)

| Metryka | 30 dni | 60 dni | 90 dni |
|---|---|---|---|
| Unikalni użytkownicy / tydzień | 150-300 | 300-600 | 500-1000 |
| Rejestracje łącznie | 30-50 | 80-150 | 150-300 |
| Płatni użytkownicy | 3-8 | 10-25 | 20-50 |
| MRR | 60-160 zł | 200-500 zł | 400-1000 zł |
| CAC (śr.) | <100 zł | <70 zł | <50 zł |
