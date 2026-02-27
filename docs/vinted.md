# REGUŁY TWORZENIA WYSOKOKONWERSYJNYCH OGŁOSZEŃ NA VINTED

> **Wersja dokumentu:** 1.0  
> **Przeznaczenie:** Agent AI do generowania ogłoszeń sprzedażowych  
> **Platforma:** Vinted (vinted.pl)

---

## 1. CHARAKTERYSTYKA PLATFORMY

### 1.1 Specyfika Vinted

**Vinted** to największa europejska platforma C2C dedykowana sprzedaży odzieży, obuwia i akcesoriów z drugiej ręki. Platforma promuje zrównoważoną modę i gospodarkę cyrkularną, łącząc świadomych ekologicznie konsumentów.

| Aspekt | Charakterystyka |
|--------|-----------------|
| **Model biznesu** | C2C, moda second-hand |
| **Prowizja dla sprzedawcy** | 0 zł (opłatę ponosi kupujący) |
| **Zasięg** | Europa, ~65 mln użytkowników, ~8 mln w Polsce |
| **Główna grupa docelowa** | Kobiety 18-45 lat (~80% użytkowników) |
| **Specjalizacja** | Odzież, obuwie, akcesoria, dom, elektronika |
| **Wysyłka** | Zintegrowana (InPost, DPD, Poczta Polska) |
| **Płatności** | System escrow (ochrona kupującego) |
| **Negocjacje** | Wbudowany system "Złóż ofertę" |

### 1.2 Kluczowe cechy platformy

```yaml
unikalne_cechy:
  brak_prowizji_sprzedawca:
    opis: "Sprzedawca otrzymuje 100% ceny"
    oplacaja: "Kupujący (ochrona kupującego + prowizja)"
    korzysc: "Pełny zysk dla sprzedającego"
  
  ochrona_kupujacego:
    opis: "System escrow - pieniądze zwolnione po akceptacji"
    okres: "2 dni na zgłoszenie problemu"
    korzysc: "Bezpieczeństwo transakcji dla obu stron"
  
  zintegrowana_wysylka:
    opis: "Automatyczne generowanie etykiet"
    metody:
      - "InPost Paczkomaty"
      - "InPost Kurier"
      - "DPD"
      - "Poczta Polska"
    korzysc: "Łatwość wysyłki, śledzenie przesyłki"
  
  system_negocjacji:
    opis: "Oficjalna funkcja 'Złóż ofertę'"
    dzialanie: "Kupujący proponuje cenę, sprzedawca akceptuje/odrzuca/kontroferta"
    korzysc: "Ustrukturyzowane negocjacje"
  
  wymiana_swap:
    opis: "Możliwość wymiany bez pieniędzy"
    kiedy: "Obie strony mają interesujące przedmioty"
  
  fokus_na_mode:
    opis: "Algorytm promuje atrakcyjne wizualnie ogłoszenia"
    efekt: "Jakość zdjęć ma kluczowe znaczenie"
```

### 1.3 Najlepiej sprzedające się kategorie

| Kategoria | Potencjał | Dlaczego dobrze się sprzedaje |
|-----------|-----------|-------------------------------|
| **Odzież damska markowa** | ⭐⭐⭐⭐⭐ | Główna grupa docelowa, stały popyt |
| **Buty sportowe (sneakersy)** | ⭐⭐⭐⭐⭐ | Kolekcjonerzy, limitowane edycje |
| **Torebki markowe** | ⭐⭐⭐⭐⭐ | Wysoka wartość, autentyczność ceniona |
| **Odzież dziecięca** | ⭐⭐⭐⭐⭐ | Szybko wyrasta, praktyczne zakupy |
| **Odzież ciążowa** | ⭐⭐⭐⭐ | Krótki okres użytkowania, oszczędność |
| **Vintage i retro** | ⭐⭐⭐⭐ | Unikalne, poszukiwane |
| **Odzież sportowa** | ⭐⭐⭐⭐ | Nike, Adidas, Lululemon - stały popyt |
| **Akcesoria (paski, szaliki)** | ⭐⭐⭐ | Dodatki do stylizacji |
| **Biżuteria** | ⭐⭐⭐ | Markowa, vintage |

### 1.4 Grupa docelowa i styl komunikacji

```yaml
grupa_docelowa:
  demografika:
    plec: "~80% kobiety"
    wiek: "18-45 lat (głównie 22-35)"
    zainteresowania: "Moda, zrównoważony styl życia, oszczędność"
  
  oczekiwania:
    - "Uczciwy opis stanu"
    - "Estetyczne zdjęcia"
    - "Szybka wysyłka"
    - "Przyjazna komunikacja"
    - "Dokładne wymiary"
  
  motywacje_zakupowe:
    - "Oszczędność vs nowe"
    - "Unikalne znaleziska"
    - "Ekologia i zrównoważona moda"
    - "Marki premium w niższej cenie"
    - "Vintage i retro"

styl_komunikacji:
  ton: "Przyjazny, pomocny, nieformalny ale profesjonalny"
  jezyk: "Prosty, bezpośredni, pozytywny"
  emoji: "Dozwolone i zalecane (2-4 na opis)"
  typowe_emoji:
    - "💕" # serce
    - "✨" # błysk
    - "📦" # paczka
    - "📏" # wymiary
    - "👗" # sukienka
    - "👜" # torebka
    - "👟" # but
```

---

## 2. TYTUŁ OGŁOSZENIA

### 2.1 Parametry techniczne

| Parametr | Wartość | Uwagi |
|----------|---------|-------|
| **Limit znaków** | 100 znaków | Wyświetla się ~40-50 w podglądzie kafelka |
| **Optymalna długość** | 40-60 znaków | Pełna widoczność w większości widoków |
| **Słowa kluczowe** | Na początku | Marka + typ jako pierwsze słowa |
| **Wielkość liter** | Normalna | Bez CAPS LOCK |
| **Emoji** | Dopuszczalne | Max 1-2, na końcu tytułu |

### 2.2 Formuła struktury tytułu

```
[MARKA] + [TYP ODZIEŻY] + [KOLOR/WZÓR] + [CECHA WYRÓŻNIAJĄCA] + [ROZMIAR opcjonalnie]
```

### 2.3 Struktura tytułu według kategorii

#### Sukienki
```
[MARKA] + sukienka + [DŁUGOŚĆ/FASON] + [KOLOR/WZÓR] + [ROZMIAR]
```
**Przykłady:**
- `Zara sukienka midi satynowa czarna S`
- `H&M sukienka maxi w kwiaty letnia M`
- `Reserved sukienka mini czerwona 36`

#### Bluzki i koszule
```
[MARKA] + [TYP] + [CECHA] + [KOLOR] + [ROZMIAR]
```
**Przykłady:**
- `Mohito bluzka satynowa biała S`
- `Tommy Hilfiger koszula w kratę niebieska M`
- `Zara top na ramiączkach czarny XS`

#### Spodnie i jeansy
```
[MARKA] + [TYP] + [FASON] + [KOLOR] + [ROZMIAR]
```
**Przykłady:**
- `Levi's jeansy 501 niebieskie 32/32`
- `Zara spodnie palazzo czarne S`
- `H&M jeansy mom fit jasne 38`

#### Buty
```
[MARKA] + [TYP] + [MODEL opcjonalnie] + [KOLOR] + [ROZMIAR]
```
**Przykłady:**
- `Nike Air Force 1 białe 39`
- `Adidas Stan Smith zielone 42`
- `Converse trampki wysokie czarne 38`
- `Dr. Martens botki 1460 czarne 40`

#### Torebki
```
[MARKA] + torebka + [TYP] + [KOLOR] + [MATERIAŁ opcjonalnie]
```
**Przykłady:**
- `Michael Kors torebka crossbody czarna`
- `Guess torebka shopper beżowa`
- `Zara torebka kuferek czerwona`

#### Kurtki i płaszcze
```
[MARKA] + [TYP] + [CECHA] + [KOLOR] + [ROZMIAR]
```
**Przykłady:**
- `The North Face kurtka puchowa czarna M`
- `Zara płaszcz wełniany camel S`
- `Nike kurtka wiatrówka granatowa L`

### 2.4 Optymalizacja SEO tytułu

```yaml
zasady_seo_vinted:
  slowa_kluczowe:
    pozycja: "ZAWSZE na początku"
    priorytet_1: "Marka (najważniejsze)"
    priorytet_2: "Typ produktu"
    priorytet_3: "Charakterystyczna cecha"
  
  nazwy_marek:
    zasada: "Używaj oficjalnych, pełnych nazw"
    przyklady:
      dobrze:
        - "The North Face" # nie "TNF"
        - "Tommy Hilfiger" # nie "Tommy"
        - "Calvin Klein" # nie "CK"
        - "Michael Kors" # nie "MK"
      zle:
        - "TNF kurtka"
        - "CK bluza"
        - "MK torebka"
  
  synonimy_popularne:
    sukienka: ["sukienka", "dress"]
    bluza: ["bluza", "hoodie", "sweatshirt"]
    kurtka: ["kurtka", "jacket"]
    spodnie: ["spodnie", "pants"]
    torebka: ["torebka", "torba", "bag"]
```

### 2.5 Zakazane elementy w tytule

```yaml
zakazane_slowa:
  marketingowe:
    - "OKAZJA"
    - "TANIO"
    - "SUPER"
    - "MEGA"
    - "HIT"
    - "WYPRZEDAŻ"
    - "PROMOCJA"
    - "GRATISY"
  
  zbedne:
    - "Sprzedam"
    - "Na sprzedaż"
    - "Do sprzedania"
    - "Oddam"
  
  ogolnikowe:
    - "ładna"
    - "fajna"
    - "super stan"
    - "świetna"
    - "piękna"
  
  urgency:
    - "PILNE"
    - "SZYBKO"
    - "OSTATNIA SZTUKA"
    - "MUSZĘ SPRZEDAĆ"

zakazane_formatowanie:
  - "CAPS LOCK (całe słowa)"
  - "!!!"
  - "???"
  - "***"
  - "Nadmiar emoji (>2)"
```

### 2.6 Przykłady poprawnych i błędnych tytułów

**✅ Poprawne tytuły:**
```
Zara sukienka midi satynowa czarna S
Nike Air Force 1 białe 39 jak nowe
H&M marynarka oversize w kratę M
Levi's jeansy 501 vintage niebieskie 30/32
The North Face kurtka puchowa 700 czarna L
Michael Kors torebka crossbody Jet Set czarna
Adidas bluza Originals z kapturem szara M
Reserved spodnie palazzo szerokie beżowe 36
Converse trampki wysokie Chuck Taylor czarne 38
Massimo Dutti płaszcz wełniany camel S
```

**❌ Błędne tytuły:**
```
SUPER OKAZJA sukienka tanio!!! (CAPS, marketingowe)
Sprzedam ładną sukienkę (zbędne "sprzedam", ogólnik "ładna")
ZARA SUKIENKA CZARNA S (cały CAPS LOCK)
sukienka fajna okazja M (brak marki, ogólniki)
Śliczna bluzeczka do sprzedania pilne (ogólniki, zbędne słowa)
TNF kurtka czarna (skrót zamiast pełnej nazwy)
📱💕✨👗 Sukienka super 💕✨📱 (nadmiar emoji)
```

---

## 3. TREŚĆ OGŁOSZENIA (OPIS)

### 3.1 Specyfika opisów na Vinted

```yaml
charakterystyka_opisow:
  cel:
    - "Uzupełnienie zdjęć, nie zamiennik"
    - "Dostarczenie informacji niemożliwych do zobaczenia"
    - "Budowanie zaufania poprzez szczegółowość"
  
  dlugosc:
    optymalna: "80-150 słów"
    minimum: "40 słów"
    maksimum: "200 słów"
    uwaga: "Zbyt długie opisy nie są czytane"
  
  styl:
    ton: "Przyjazny, pomocny, entuzjastyczny (umiarkowanie)"
    zdania: "Krótkie, konkretne"
    formatowanie: "Listy, emoji, przejrzystość"
  
  emoji:
    ilosc: "2-4 w całym opisie"
    uzycie: "Nagłówki sekcji, akcenty"
    typowe: ["💕", "✨", "📏", "✅", "📦", "👗", "💬"]
```

### 3.2 Optymalna struktura opisu (5 sekcji)

```
┌─────────────────────────────────────────────────────────────┐
│ 💕 SEKCJA 1: WPROWADZENIE                                   │
│    └─ Marka + typ + główna cecha/zaleta                     │
├─────────────────────────────────────────────────────────────┤
│ ✨ SEKCJA 2: SZCZEGÓŁY PRODUKTU                             │
│    └─ Kolor, materiał, krój, cechy szczególne               │
├─────────────────────────────────────────────────────────────┤
│ 📏 SEKCJA 3: WYMIARY (OBOWIĄZKOWE!)                         │
│    └─ Dokładne pomiary w cm                                 │
├─────────────────────────────────────────────────────────────┤
│ ✅ SEKCJA 4: STAN                                           │
│    └─ Precyzyjny opis stanu + wady                          │
├─────────────────────────────────────────────────────────────┤
│ 📦 SEKCJA 5: INFORMACJE DODATKOWE                           │
│    └─ Wysyłka, powód sprzedaży, zachęta do kontaktu         │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Parametry opisu

| Parametr | Wartość optymalna | Minimum | Maximum |
|----------|-------------------|---------|---------|
| **Liczba słów** | 80-150 | 40 | 200 |
| **Liczba sekcji** | 5 | 4 | 5 |
| **Emoji** | 3-4 | 2 | 5 |
| **Wymiary** | Obowiązkowe | - | - |

### 3.4 Szablon uniwersalny

```markdown
💕 [MARKA] [TYP PRODUKTU] w [KOLOR/WZÓR]. [Główna zaleta - 1 zdanie].

✨ Szczegóły:
• Kolor: [kolor]
• Materiał: [skład]
• Krój/fason: [opis]
• Rozmiar na metce: [rozmiar]

📏 Wymiary (mierzone na płasko):
• Długość: [X] cm
• Szerokość: [X] cm
• [inne istotne wymiary]

✅ Stan: [STAN]. [Opis stanu - 1-2 zdania].
[Opis wad jeśli są - dokładna lokalizacja, rozmiar].

📦 Wysyłka w ciągu 1-2 dni. [Powód sprzedaży - opcjonalnie].

Pytania? Pisz śmiało! 💬
```

### 3.5 Szablony według kategorii

#### Sukienki

```markdown
💕 [MARKA] sukienka [FASON] w kolorze [KOLOR]. [Główna zaleta].

✨ Szczegóły:
• Kolor: [kolor]
• Materiał: [skład z metki]
• Fason: [midi/maxi/mini], [A-line/ołówkowa/trapezowa]
• Dekolt: [okrągły/V/kwadratowy]
• Rękawy: [długie/krótkie/bez rękawów]
• Zapięcie: [suwak/guziki/brak]
• Rozmiar na metce: [rozmiar]

📏 Wymiary (na płasko):
• Długość całkowita: [X] cm
• Szerokość pod pachami: [X] cm
• Szerokość w talii: [X] cm

✅ Stan: [STAN]. [Noszona X razy / nowa z metką].
[Wady jeśli są - gdzie, jak duże, widoczność].

📦 Wysyłam w 1-2 dni. Idealna na [okazję] 👗

Pytania? Pisz śmiało! 💬
```

#### Bluzki i topy

```markdown
💕 [MARKA] [TYP] w kolorze [KOLOR]. [Główna zaleta].

✨ Szczegóły:
• Kolor: [kolor]
• Materiał: [skład]
• Krój: [regular/oversize/slim]
• Rękawy: [długość]
• Rozmiar na metce: [rozmiar]

📏 Wymiary (na płasko):
• Długość: [X] cm
• Szerokość pod pachami: [X] cm
• Długość rękawa: [X] cm

✅ Stan: [STAN]. [Opis użytkowania].
[Wady jeśli są].

📦 Szybka wysyłka!

Pytania? Pisz! 💬
```

#### Spodnie i jeansy

```markdown
💕 [MARKA] [TYP] [FASON] w kolorze [KOLOR]. [Główna zaleta].

✨ Szczegóły:
• Kolor: [kolor]
• Materiał: [skład, % elastanu jeśli jest]
• Fason: [mom/straight/skinny/palazzo/wide leg]
• Stan: [wysoki/średni/niski]
• Rozmiar na metce: [rozmiar]

📏 Wymiary (na płasko):
• Długość całkowita: [X] cm
• Długość wewnętrzna (nogawka): [X] cm
• Szerokość w pasie: [X] cm
• Szerokość w biodrach: [X] cm
• Szerokość nogawki na dole: [X] cm

✅ Stan: [STAN]. [Opis użytkowania].
[Wady jeśli są - przetarcia, wyblaknięcia].

📦 Wysyłka w 1-2 dni.

Pytania? Pisz! 💬
```

#### Buty

```markdown
💕 [MARKA] [TYP] [MODEL jeśli jest] w kolorze [KOLOR]. [Główna zaleta].

✨ Szczegóły:
• Rozmiar: [EU rozmiar]
• Kolor: [kolor]
• Materiał: [skóra/skóra ekologiczna/tkanina]
• Podeszwa: [typ]
• Wysokość obcasa/platformy: [X] cm (jeśli dotyczy)

📏 Wymiary:
• Długość wkładki: [X] cm
• Szerokość w najszerszym miejscu: [X] cm
• Wysokość cholewki: [X] cm (jeśli dotyczy)

✅ Stan: [STAN].
• Zewnątrz: [opis stanu cholewki]
• Podeszwa: [opis zużycia]
• Wnętrze: [opis wkładki]
[Wady jeśli są].

📦 W zestawie: [pudełko/woreczek/brak].
Wysyłka w 1-2 dni 👟

Pytania? Pisz! 💬
```

#### Torebki

```markdown
💕 [MARKA] torebka [TYP] w kolorze [KOLOR]. [Główna zaleta].

✨ Szczegóły:
• Kolor: [kolor]
• Materiał: [skóra/skóra ekologiczna/tkanina]
• Typ: [crossbody/shopper/kuferek/listonoszka]
• Zapięcie: [zamek/magnes/klapka]
• Paski: [regulowany/stały/odpinany]

📏 Wymiary:
• Szerokość: [X] cm
• Wysokość: [X] cm
• Głębokość: [X] cm
• Długość paska: [X] cm

✅ Stan: [STAN].
• Zewnątrz: [opis]
• Wnętrze: [opis]
• Okucia/sprzączki: [opis]
[Wady jeśli są].

📦 W zestawie: [dust bag/pudełko/brak].
Wysyłka w 1-2 dni 👜

Pytania? Pisz! 💬
```

#### Odzież dziecięca

```markdown
💕 [MARKA] [TYP] dla [dziewczynki/chłopca] w rozmiarze [ROZMIAR].

✨ Szczegóły:
• Rozmiar: [rozmiar] (na wzrost [X] cm)
• Kolor: [kolor]
• Materiał: [skład]

📏 Wymiary (na płasko):
• Długość: [X] cm
• Szerokość: [X] cm

✅ Stan: [STAN]. [Noszone przez X miesięcy].
Bez plam, dziur, przetarć. [Lub opis wad].

📦 Wysyłka w 1-2 dni. Idealne dla malucha! 🧒

Pytania? Pisz! 💬
```

### 3.6 Sekcja WYMIARY - szczegółowe instrukcje

```yaml
wymiary_obowiazkowe:
  dlaczego_kluczowe:
    - "Rozmiarówka różni się między markami"
    - "Kupujący nie mogą przymierzyć"
    - "Zmniejsza zwroty i spory"
    - "Buduje zaufanie"
  
  jak_mierzyc:
    zasada: "ZAWSZE na płasko, ubranie rozłożone"
    narzedzie: "Miarka krawiecka (centymetrowa)"
    precyzja: "Do 0.5 cm"
  
  co_mierzyc:
    gora:
      - "Długość całkowita (od ramienia do dołu)"
      - "Szerokość pod pachami (× 2 = obwód)"
      - "Szerokość ramion"
      - "Długość rękawa"
    
    dol:
      - "Długość całkowita (od pasa do dołu)"
      - "Długość wewnętrzna (od kroku do dołu)"
      - "Szerokość w pasie (× 2 = obwód)"
      - "Szerokość w biodrach"
      - "Szerokość nogawki"
    
    sukienki:
      - "Długość całkowita"
      - "Szerokość pod pachami"
      - "Szerokość w talii"
    
    buty:
      - "Długość wkładki (NAJWAŻNIEJSZE)"
      - "Szerokość"
      - "Wysokość cholewki (jeśli dotyczy)"
    
    torebki:
      - "Szerokość"
      - "Wysokość"
      - "Głębokość"
      - "Długość paska"
  
  format_zapisu:
    przyklad: |
      📏 Wymiary (mierzone na płasko):
      • Długość całkowita: 95 cm
      • Szerokość pod pachami: 48 cm
      • Długość rękawa: 60 cm
```

### 3.7 Sekcja STAN - oficjalne kategorie Vinted

```yaml
stany_vinted:
  nowy_z_metka:
    filtr: "Nowy z metką"
    opis: "Nigdy nie noszony, oryginalne metki przymocowane"
    w_opisie: "Nowy z metką, nigdy nie noszony"
  
  nowy_bez_metki:
    filtr: "Nowy bez metki"
    opis: "Nigdy nie noszony, metki odcięte"
    w_opisie: "Nowy, tylko przymierzony, metki odcięte"
  
  bardzo_dobry:
    filtr: "Bardzo dobry"
    opis: "Noszony kilka razy, minimalne/brak śladów użytkowania"
    w_opisie: "Noszony kilka razy, bez widocznych śladów"
  
  dobry:
    filtr: "Dobry"
    opis: "Noszony wielokrotnie, widoczne ślady użytkowania"
    w_opisie: "Noszony regularnie, widoczne drobne ślady użytkowania"
  
  zadowalajacy:
    filtr: "Zadowalający"
    opis: "Wyraźne ślady użytkowania lub drobne wady"
    w_opisie: "Widoczne ślady użytkowania: [opis]"
```

### 3.8 Opisywanie wad - obowiązkowa szczegółowość

```yaml
opis_wad:
  zasada: "KAŻDA wada musi być opisana i sfotografowana"
  
  format_opisu_wady:
    lokalizacja: "Gdzie na ubraniu"
    rozmiar: "Wielkość w cm"
    widocznosc: "Jak bardzo widoczna przy noszeniu"
    zdjecie: "Które zdjęcie pokazuje wadę"
  
  przyklady:
    plama:
      zly: "Ma plamkę"
      dobry: "Plama ~0.5 cm na dole z przodu, mało widoczna przy noszeniu (zdjęcie 4)"
    
    przetarcie:
      zly: "Lekko przetarte"
      dobry: "Przetarcie ~2 cm na wewnętrznej stronie uda, niewidoczne przy noszeniu (zdjęcie 5)"
    
    dziura:
      zly: "Mała dziurka"
      dobry: "Dziura ~3 mm przy prawym szwie, powstała przy wieszaniu - łatwa do zszycia (zdjęcie 6)"
    
    pilling:
      zly: "Trochę pillingu"
      dobry: "Lekki pilling pod pachami, typowy dla tej tkaniny (zdjęcie 4)"
    
    wyblaknięcie:
      zly: "Trochę wyblaknięte"
      dobry: "Delikatne wyblaknięcie przy kołnierzu od prania, widoczne na zdjęciu 3"
```

### 3.9 Słowa i frazy zwiększające konwersję

```yaml
slowa_pozytywne:
  stan:
    - "zadbany"
    - "czysty"
    - "świeży"
    - "jak nowy"
    - "idealny" # tylko jeśli prawda
  
  jakosc:
    - "świetna jakość"
    - "solidny materiał"
    - "dobrze leży"
    - "wygodny"
    - "przyjemny w dotyku"
  
  styl:
    - "klasyczny"
    - "ponadczasowy"
    - "uniwersalny"
    - "modny"
    - "elegancki"
    - "casualowy"
  
  praktycznosc:
    - "z kieszeniami"
    - "na każdą okazję"
    - "łatwy do stylizacji"
    - "nie wymaga prasowania"

frazy_zachęcające:
  - "Pytania? Pisz śmiało!"
  - "Chętnie odpowiem na pytania 💬"
  - "Szybka wysyłka!"
  - "Więcej zdjęć na życzenie"
  - "Zapraszam do innych moich ogłoszeń 💕"

emoji_zalecane:
  - "💕" # serce - wprowadzenie
  - "✨" # błysk - szczegóły
  - "📏" # wymiary
  - "✅" # stan
  - "📦" # wysyłka
  - "👗" # sukienka
  - "👜" # torebka
  - "👟" # buty
  - "💬" # kontakt
  - "🛍️" # zakupy
```

### 3.10 Słowa i frazy do unikania

```yaml
zakazane_slowa:
  marketingowe:
    - "okazja"
    - "tanio"
    - "super cena"
    - "mega"
    - "hit"
    - "wyprzedaż"
  
  nieokreslone:
    - "prawie nowy" # bez szczegółów
    - "mało noszony" # ile to mało?
    - "w dobrym stanie" # bez opisu
    - "ładny"
    - "fajny"
    - "super"
  
  desperacja:
    - "pilnie sprzedam"
    - "muszę sprzedać"
    - "pilne"
  
  nieprofesjonalne:
    - "bez ściemy"
    - "serio"
    - "naprawdę"
    - "na pewno się spodoba"
  
  niedozwolone_vinted:
    - "replika"
    - "kopia"
    - "inspirowane [marką]"
    - "podróbka"
    - "fake"
```
## 4. STRATEGIA CENOWA

### 4.1 Specyfika cen na Vinted

```yaml
model_cenowy_vinted:
  prowizja_sprzedawca:
    wartosc: "0 zł"
    opis: "Sprzedawca otrzymuje 100% ustalonej ceny"
  
  oplaty_kupujacy:
    ochrona_kupujacego:
      wartosc: "5% ceny + 0.70 zł"
      minimum: "0.70 zł"
    wysylka:
      wartosc: "Zależna od metody i wagi"
      przyklad: "InPost Paczkomat ~10-15 zł"
  
  system_negocjacji:
    funkcja: "Złóż ofertę"
    dzialanie:
      - "Kupujący proponuje cenę"
      - "Sprzedawca: akceptuje / odrzuca / kontroferta"
      - "Limit kontrofert: kilka rund"
    typowy_rabat: "10-20% od ceny wywoławczej"
  
  bundle_rabaty:
    funkcja: "Zniżka przy zakupie kilku przedmiotów"
    ustawienie: "Profil → Ustawienia bundle"
    typowe_rabaty:
      - "5% przy 2 przedmiotach"
      - "10% przy 3+ przedmiotach"
    korzysc: "Zachęca do większych zakupów, jedna wysyłka"
```

### 4.2 Formuła wyceny używanej odzieży

```
CENA = (Cena_nowego × Wsp_marki × Wsp_stanu × Wsp_sezonu) × Wsp_negocjacji
```

### 4.3 Współczynniki marki

| Segment marki | Współczynnik | Przykłady marek |
|---------------|--------------|-----------------|
| **Luksusowe** | 0.40 - 0.70 | Gucci, Prada, Louis Vuitton, Chanel |
| **Premium** | 0.35 - 0.55 | Michael Kors, Tommy Hilfiger, Calvin Klein, Hugo Boss |
| **Średnia-wysoka** | 0.30 - 0.45 | Massimo Dutti, COS, & Other Stories, Arket |
| **Popularne markowe** | 0.25 - 0.40 | Zara, Mango, Reserved, Mohito |
| **Fast fashion** | 0.15 - 0.30 | H&M, Primark, Sinsay, Cropp |
| **Sportowe premium** | 0.35 - 0.55 | Nike, Adidas, The North Face, Lululemon |
| **Sportowe standard** | 0.25 - 0.40 | Puma, Reebok, New Balance |
| **Vintage/unikalne** | 0.40 - 0.80+ | Zależnie od poszukiwalności |

### 4.4 Współczynniki stanu

| Stan (filtr Vinted) | Współczynnik | Opis |
|---------------------|--------------|------|
| **Nowy z metką** | 0.75 - 0.90 | Nigdy nie noszony, metki przymocowane |
| **Nowy bez metki** | 0.60 - 0.75 | Nigdy nie noszony, metki odcięte |
| **Bardzo dobry** | 0.45 - 0.60 | Noszony kilka razy, minimalne ślady |
| **Dobry** | 0.30 - 0.45 | Noszony regularnie, widoczne ślady |
| **Zadowalający** | 0.15 - 0.30 | Wyraźne ślady, drobne wady |

### 4.5 Współczynniki sezonowości

```yaml
sezonowosc:
  w_sezonie:
    wspolczynnik: 1.00 - 1.15
    przyklady:
      - "Kurtki zimowe: listopad-luty"
      - "Sukienki letnie: maj-sierpień"
      - "Kurtki przejściowe: marzec-kwiecień, wrzesień-październik"
  
  przed_sezonem:
    wspolczynnik: 0.90 - 1.00
    przyklady:
      - "Kurtki zimowe: wrzesień-październik"
      - "Sukienki letnie: marzec-kwiecień"
  
  po_sezonie:
    wspolczynnik: 0.60 - 0.80
    przyklady:
      - "Kurtki zimowe: marzec-sierpień"
      - "Sukienki letnie: wrzesień-luty"
  
  calorocznie:
    wspolczynnik: 1.00
    przyklady:
      - "Jeansy"
      - "T-shirty basic"
      - "Torebki"
      - "Sneakersy"
```

### 4.6 Współczynnik negocjacji Vinted

```yaml
wspolczynnik_negocjacji:
  wysoki_popyt:
    wartosc: 1.10
    kiedy:
      - "Marki luksusowe/premium"
      - "Limitowane edycje"
      - "Rozmiary popularne (S, M, 38, 39)"
      - "Poszukiwane modele"
  
  standardowy:
    wartosc: 1.15
    kiedy:
      - "Większość produktów"
      - "Popularne marki (Zara, H&M)"
      - "Standardowe produkty"
  
  niski_popyt:
    wartosc: 1.20 - 1.25
    kiedy:
      - "Rozmiary skrajne (XXS, 3XL)"
      - "Mało popularne marki"
      - "Sezon nieodpowiedni"
      - "Produkty niszowe"
```

### 4.7 Przykłady kalkulacji

#### Przykład 1: Sukienka Zara
```
Produkt: Sukienka Zara midi satynowa
Cena nowa: 199 zł
Stan: Bardzo dobry (noszony 3x)
Sezon: W sezonie (lato)
Marka: Popularna markowa

OBLICZENIE:
Cena bazowa = 199 zł
× Wsp. marki (Zara): 0.35
× Wsp. stanu (bardzo dobry): 0.55
× Wsp. sezonu (w sezonie): 1.00
× Wsp. negocjacji: 1.15
= 199 × 0.35 × 0.55 × 1.00 × 1.15 = 44 zł

Zaokrąglenie: 45 zł
Oczekiwana cena po negocjacjach: ~40 zł
```

#### Przykład 2: Kurtka The North Face
```
Produkt: Kurtka puchowa The North Face 700
Cena nowa: 1200 zł
Stan: Nowy z metką
Sezon: W sezonie (zima)
Marka: Sportowa premium

OBLICZENIE:
Cena bazowa = 1200 zł
× Wsp. marki (TNF): 0.45
× Wsp. stanu (nowy z metką): 0.85
× Wsp. sezonu (w sezonie): 1.10
× Wsp. negocjacji: 1.10
= 1200 × 0.45 × 0.85 × 1.10 × 1.10 = 555 zł

Zaokrąglenie: 549 zł
Oczekiwana cena po negocjacjach: ~500 zł
```

#### Przykład 3: Torebka Michael Kors
```
Produkt: Torebka Michael Kors Jet Set crossbody
Cena nowa: 850 zł
Stan: Dobry (używana regularnie)
Sezon: Całoroczny
Marka: Premium

OBLICZENIE:
Cena bazowa = 850 zł
× Wsp. marki (MK): 0.45
× Wsp. stanu (dobry): 0.40
× Wsp. sezonu (cały rok): 1.00
× Wsp. negocjacji: 1.15
= 850 × 0.45 × 0.40 × 1.00 × 1.15 = 176 zł

Zaokrąglenie: 179 zł
Oczekiwana cena po negocjacjach: ~150-160 zł
```

### 4.8 Psychologia cen na Vinted

| Zakres cenowy | Końcówka optymalna | Przykłady |
|---------------|-------------------|-----------|
| 1-30 zł | -5, -9 | 15 zł, 19 zł, 25 zł, 29 zł |
| 30-100 zł | -5, -9 | 35 zł, 45 zł, 59 zł, 79 zł, 89 zł |
| 100-300 zł | -9 | 119 zł, 149 zł, 189 zł, 249 zł |
| 300-1000 zł | -9 | 349 zł, 449 zł, 549 zł, 799 zł |
| > 1000 zł | -9, -99 | 1099 zł, 1299 zł, 1499 zł |

### 4.9 Strategia reagowania na oferty

```yaml
reagowanie_na_oferty:
  oferta_rozsadna: # 5-15% poniżej ceny
    reakcja: "Akceptuj lub mała kontroferta"
    przyklad: "Cena 80 zł, oferta 70 zł → akceptuj lub kontroferta 75 zł"
  
  oferta_umiarkowana: # 15-25% poniżej ceny
    reakcja: "Kontroferta w połowie"
    przyklad: "Cena 100 zł, oferta 75 zł → kontroferta 85-90 zł"
  
  oferta_lowball: # >30% poniżej ceny
    reakcja: "Grzeczna kontroferta bliżej ceny lub odrzucenie"
    przyklad: "Cena 100 zł, oferta 50 zł → kontroferta 90 zł lub odrzuć"
  
  wielokrotne_oferty:
    zasada: "Schodzisz max 2-3 razy, potem ostateczna cena"
    komunikacja: "Możesz napisać 'To moja ostateczna cena' przy kontrofercie"
  
  bundle:
    zasada: "Przy kilku przedmiotach - dodatkowy rabat"
    typowo: "5-15% extra przy 2+ przedmiotach"
```

### 4.10 Minimum cenowe - kiedy nie warto sprzedawać

```yaml
minimum_cenowe:
  koszty_kupujacego:
    ochrona: "~5% + 0.70 zł"
    wysylka_inpost: "~10-15 zł"
    lacznie: "~15-20 zł przy tanim produkcie"
  
  efekt:
    przyklad: "Produkt za 15 zł + 15 zł wysyłka = 30 zł dla kupującego"
    wniosek: "Produkty <20 zł trudniej sprzedać (wysyłka kosztuje tyle co produkt)"
  
  rozwiazania:
    bundle:
      opis: "Łącz tanie produkty w zestawy"
      przyklad: "3 t-shirty za 45 zł zamiast 3 × 15 zł"
    
    minimalna_cena:
      zalecenie: "Nie wystawiaj produktów poniżej 20-25 zł pojedynczo"
      wyjatki: "Chyba że budujesz reputację lub pozbywasz się rzeczy"
```

---

## 5. ZDJĘCIA PRODUKTU

### 5.1 Znaczenie zdjęć na Vinted

```yaml
znaczenie_zdjec:
  kluczowa_rola:
    - "Vinted to platforma WIZUALNA"
    - "Algorytm promuje atrakcyjne zdjęcia"
    - "Pierwsze zdjęcie = miniatura = decyduje o kliknięciu"
    - "Zdjęcia ważniejsze niż opis"
  
  statystyki:
    - "Ogłoszenia z 4+ zdjęciami sprzedają się 2x szybciej"
    - "Estetyczne zdjęcia = wyższa cena akceptowana"
    - "Słabe zdjęcia = podejrzenia o ukryte wady"
```

### 5.2 Wymagania techniczne

| Parametr | Minimum | Optimum | Maximum |
|----------|---------|---------|---------|
| **Liczba zdjęć** | 3 | 5-7 | 20 |
| **Rozdzielczość** | 800×800 px | 1200×1200 px | 4032×4032 px |
| **Format** | JPG | JPG, PNG | JPG, PNG |
| **Proporcje** | 1:1 (kwadrat) | 1:1, 4:5 | 4:3 |
| **Rozmiar pliku** | 50 KB | 200-500 KB | 20 MB |

### 5.3 Typy zdjęć na Vinted

```yaml
typy_zdjec:
  flat_lay:
    opis: "Ubranie rozłożone na płasko, zdjęcie z góry"
    kiedy: "Bluzki, t-shirty, koszule, spodnie"
    zalety: "Pokazuje krój, wymiary, detale"
    tlo: "Białe, jasne drewno, neutralna tkanina"
  
  na_wieszaku:
    opis: "Ubranie na wieszaku, zdjęcie z przodu"
    kiedy: "Sukienki, marynarki, płaszcze, kurtki"
    zalety: "Pokazuje fason, długość, jak wisi"
    tlo: "Neutralna ściana, drzwi szafy"
  
  na_osobie:
    opis: "Ubranie ubrane na modelce/sprzedawcy"
    kiedy: "Wszystko - NAJLEPSZA OPCJA"
    zalety: "Pokazuje jak leży, rozmiar na ciele, styl"
    uwagi: "Twarz może być przycięta/zasłonięta"
  
  na_manekinie:
    opis: "Ubranie na manekinie/bustie"
    kiedy: "Bluzki, sukienki, góry"
    zalety: "Profesjonalny wygląd, pokazuje kształt"
```

### 5.4 Kolejność zdjęć (strategiczna)

```
ZDJĘCIE 1 - MINIATURA (NAJWAŻNIEJSZE!):
├── Całość produktu
├── Najlepsza prezentacja (na osobie > wieszak > flat lay)
├── Jasne, atrakcyjne
├── Produkt zajmuje 70-80% kadru
├── Format kwadratowy (1:1)
└── Decyduje o kliknięciu w kafelku!

ZDJĘCIE 2:
├── Druga perspektywa (tył lub bok)
└── Pokazuje pełny fason

ZDJĘCIE 3:
├── Metka z marką
└── Potwierdza autentyczność

ZDJĘCIE 4:
├── Metka z rozmiarem i składem
└── Informacje o materiale

ZDJĘCIE 5:
├── Zbliżenie na materiał/fakturę
└── Pokazuje jakość

ZDJĘCIE 6 - WADY (OBOWIĄZKOWE jeśli są!):
├── Zbliżenie na wadę
├── Dobrze oświetlone
└── Z referencją rozmiaru jeśli potrzebna

ZDJĘCIE 7:
├── Detale (guziki, zamki, wzór)
└── Cechy wyróżniające
```

### 5.5 Specyfikacje zdjęć według kategorii

#### Sukienki
```yaml
sukienki:
  zdjecie_1: "Na osobie lub wieszaku - przód, całość"
  zdjecie_2: "Tył - całość"
  zdjecie_3: "Na osobie - pokazuje jak leży (opcjonalnie)"
  zdjecie_4: "Metka marki"
  zdjecie_5: "Metka rozmiaru i składu"
  zdjecie_6: "Zbliżenie na materiał/wzór"
  zdjecie_7: "Detale - dekolt, rękawy, zapięcie"
  zdjecie_8: "WADY jeśli są"
```

#### Spodnie i jeansy
```yaml
spodnie:
  zdjecie_1: "Flat lay - przód, całość"
  zdjecie_2: "Flat lay - tył"
  zdjecie_3: "Na osobie (opcjonalnie)"
  zdjecie_4: "Metka marki"
  zdjecie_5: "Metka rozmiaru"
  zdjecie_6: "Zbliżenie na materiał"
  zdjecie_7: "Detale - kieszenie, zapięcie, nogawka"
  zdjecie_8: "WADY - przetarcia, wyblaknięcia"
```

#### Buty
```yaml
buty:
  zdjecie_1: "Para razem - z przodu, lekko z góry"
  zdjecie_2: "Profil (bok) - jeden but"
  zdjecie_3: "Tył - oba buty"
  zdjecie_4: "Podeszwa - stan zużycia"
  zdjecie_5: "Wnętrze - wkładka, rozmiar"
  zdjecie_6: "Logo/marka - zbliżenie"
  zdjecie_7: "Detale - zapięcie, materiał"
  zdjecie_8: "WADY - zarysowania, przetarcia"
  zdjecie_9: "Pudełko (jeśli jest)"
```

#### Torebki
```yaml
torebki:
  zdjecie_1: "Przód - całość, z paskiem"
  zdjecie_2: "Tył"
  zdjecie_3: "Bok - pokazuje głębokość"
  zdjecie_4: "Otwarta - wnętrze"
  zdjecie_5: "Logo/metka marki"
  zdjecie_6: "Okucia - zamki, sprzączki"
  zdjecie_7: "Dno - stan"
  zdjecie_8: "WADY jeśli są"
  zdjecie_9: "Dust bag/pudełko (jeśli są)"
```

#### Bluzki i koszule
```yaml
bluzki:
  zdjecie_1: "Flat lay lub wieszak - przód"
  zdjecie_2: "Tył"
  zdjecie_3: "Na osobie (opcjonalnie)"
  zdjecie_4: "Metka marki"
  zdjecie_5: "Metka składu"
  zdjecie_6: "Zbliżenie materiału"
  zdjecie_7: "Detale - guziki, kołnierzyk, mankiety"
  zdjecie_8: "WADY jeśli są"
```

### 5.6 Wymagania dotyczące tła i oświetlenia

```yaml
tlo:
  idealne:
    flat_lay:
      - "Białe prześcieradło/tkanina"
      - "Jasne drewno (podłoga, blat)"
      - "Szary/biały karton"
    wieszak:
      - "Biała ściana"
      - "Jasne drzwi szafy"
      - "Neutralne tło"
    na_osobie:
      - "Jednolite tło (ściana)"
      - "Neutralne wnętrze"
      - "Lustro (czyste, bez bałaganu)"
  
  akceptowalne:
    - "Jasne, czyste łóżko (jednolita narzuta)"
    - "Dywan jednolity"
    - "Drzwi (bez wzorów)"
  
  zabronione:
    - "Bałagan w tle"
    - "Inne ubrania widoczne"
    - "Wzorzysta pościel"
    - "Ciemne pomieszczenia"
    - "Łazienka"
    - "Niepościelone łóżko"

oswietlenie:
  idealne:
    - "Naturalne światło dzienne"
    - "Przy oknie (rozproszone)"
    - "Pochmurny dzień (miękkie światło)"
    - "Ring light lub softbox"
  
  techniki:
    flat_lay: "Światło z góry, równomiernie"
    wieszak: "Światło z przodu/boku"
    na_osobie: "Światło z przodu, brak cieni na twarzy"
  
  zabronione:
    - "Bezpośrednie słońce (twarde cienie)"
    - "Żółte światło żarówek"
    - "Lampa błyskowa telefonu"
    - "Ciemne zdjęcia (niedoświetlone)"
    - "Podświetlenie od tyłu"
```

### 5.7 Elementy zakazane na zdjęciach Vinted

```yaml
zabronione:
  przez_regulamin_vinted:
    - "Zdjęcia katalogowe (z internetu)"
    - "Zdjęcia stockowe"
    - "Screenshoty z innych ogłoszeń"
    - "Kolaże"
    - "Znaki wodne/watermarki"
    - "Tekst na zdjęciach"
    - "Logo innych platform"
    - "Ramki i filtry znacząco zmieniające kolor"
  
  efekty_naruszenia:
    - "Ukrycie ogłoszenia"
    - "Usunięcie ogłoszenia"
    - "Ostrzeżenie konta"
    - "W skrajnych przypadkach - blokada"
  
  techniczne_bledy:
    - "Rozmazane/nieostre"
    - "Zbyt ciemne"
    - "Prześwietlone"
    - "Produkt zbyt mały w kadrze (<60%)"
    - "Złe proporcje (rozciągnięte)"
  
  zawartość_problematyczna:
    - "Twarz bez zgody (RODO)"
    - "Dzieci"
    - "Widoczne dane osobowe"
    - "Brudne ubrania"
    - "Ukryte wady (nieetyczne)"
```

### 5.8 Edycja zdjęć - dozwolona i zakazana

```yaml
edycja_dozwolona:
  podstawowa:
    - "Kadrowanie (przycięcie)"
    - "Obrót"
    - "Korekcja jasności (lekka)"
    - "Korekcja kontrastu (lekka)"
    - "Balans bieli"
  
  cel: "Wierne odwzorowanie produktu"

edycja_zakazana:
  filtry:
    - "Filtry Instagramowe"
    - "Filtry zmieniające kolor produktu"
    - "Czarno-białe (chyba że produkt jest)"
    - "Vintage/retro efekty"
  
  manipulacja:
    - "Usuwanie wad/plam"
    - "Zmiana koloru produktu"
    - "Rozjaśnianie plam"
    - "Wymazywanie elementów"
  
  dodatki:
    - "Tekst/napisy"
    - "Naklejki/stickery"
    - "Ramki"
    - "Emotikony na zdjęciu"
    - "Logo"
```

### 5.9 Specjalne przypadki fotografii

```yaml
przypadki_specjalne:
  ubrania_z_wadami:
    zasada: "KAŻDA wada MUSI być sfotografowana"
    jak:
      - "Osobne zdjęcie wady"
      - "Dobre oświetlenie"
      - "Zbliżenie (makro jeśli możliwe)"
      - "Referencja rozmiaru (moneta, linijka)"
    przyklad: "Zdjęcie 6: zbliżenie na plamę na rękawie"
  
  przedmioty_markowe_luksusowe:
    zasada: "Dokumentuj autentyczność"
    zdjecia:
      - "Metka marki (zbliżenie)"
      - "Numer seryjny (jeśli jest)"
      - "Certyfikat autentyczności"
      - "Logo/charakterystyczne elementy"
      - "Dust bag/pudełko oryginalne"
  
  zestawy:
    zasada: "Pokaż wszystkie elementy"
    jak:
      - "Zdjęcie 1: wszystko razem"
      - "Kolejne: każdy element osobno"
      - "Metki każdego elementu"
  
  vintage:
    zasada: "Podkreśl autentyczność i wiek"
    jak:
      - "Metki epoki"
      - "Charakterystyczne detale"
      - "Stan (patyna jako zaleta)"
```

---

## 6. KATEGORIE, ROZMIARY I ATRYBUTY

### 6.1 Główne kategorie Vinted

```yaml
kategorie_glowne:
  kobiety:
    odziez:
      - "Sukienki"
      - "Spódnice"
      - "Bluzki i koszule"
      - "T-shirty i topy"
      - "Swetry i bluzy"
      - "Spodnie"
      - "Jeansy"
      - "Szorty"
      - "Kurtki i płaszcze"
      - "Garnitury i żakiety"
      - "Kombinezony"
      - "Odzież sportowa"
      - "Bielizna i piżamy"
      - "Stroje kąpielowe"
      - "Odzież ciążowa"
    
    buty:
      - "Szpilki"
      - "Czółenka"
      - "Baleriny"
      - "Mokasyny"
      - "Trampki i sneakersy"
      - "Botki"
      - "Kozaki"
      - "Sandały"
      - "Klapki"
      - "Espadryle"
      - "Buty sportowe"
    
    akcesoria:
      - "Torebki"
      - "Portfele"
      - "Paski"
      - "Szaliki i chusty"
      - "Czapki i kapelusze"
      - "Rękawiczki"
      - "Biżuteria"
      - "Okulary"
      - "Zegarki"
  
  mezczyzni:
    odziez:
      - "Koszulki"
      - "Koszule"
      - "Swetry i bluzy"
      - "Spodnie"
      - "Jeansy"
      - "Szorty"
      - "Kurtki i płaszcze"
      - "Garnitury i marynarki"
      - "Odzież sportowa"
      - "Bielizna"
    
    buty:
      - "Sneakersy"
      - "Eleganckie"
      - "Sportowe"
      - "Sandały"
      - "Klapki"
    
    akcesoria:
      - "Paski"
      - "Portfele"
      - "Zegarki"
      - "Czapki"
      - "Krawaty"
      - "Okulary"
  
  dzieci:
    dziewczynki:
      - "Noworodki (0-12 mies)"
      - "Małe dzieci (1-5 lat)"
      - "Starsze dzieci (6-14 lat)"
    
    chlopcy:
      - "Noworodki (0-12 mies)"
      - "Małe dzieci (1-5 lat)"
      - "Starsze dzieci (6-14 lat)"
    
    buty_dzieciece: "16-40 EU"
  
  inne_kategorie:
    dom:
      - "Tekstylia (pościel, ręczniki)"
      - "Dekoracje"
    
    rozrywka:
      - "Książki"
      - "Gry"
    
    elektronika:
      - "Telefony"
      - "Konsole"
      - "Słuchawki"
```

### 6.2 System rozmiarów

```yaml
rozmiary_damskie:
  odziez:
    miedzynarodowe: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"]
    europejskie: [32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54]
    uk: [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]
    us: [0, 2, 4, 6, 8, 10, 12, 14, 16]
  
  jeansy:
    format: "W/L (szerokość/długość)"
    przyklad: "W28/L32"
    zakres_w: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 36]
    zakres_l: [28, 30, 32, 34, 36]
  
  buty:
    europejskie: [35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 40, 41, 42]
    uk: [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8]

rozmiary_meskie:
  odziez:
    miedzynarodowe: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"]
    europejskie: [44, 46, 48, 50, 52, 54, 56, 58, 60, 62]
    koszule_kolnierzyk: [37, 38, 39, 40, 41, 42, 43, 44, 45]
  
  jeansy:
    format: "W/L"
    zakres_w: [28, 29, 30, 31, 32, 33, 34, 36, 38, 40, 42]
    zakres_l: [30, 32, 34, 36]
  
  buty:
    europejskie: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48]

rozmiary_dzieciece:
  odziez_wzrost:
    - "50 (noworodek)"
    - "56 (0-1 mies)"
    - "62 (1-3 mies)"
    - "68 (3-6 mies)"
    - "74 (6-9 mies)"
    - "80 (9-12 mies)"
    - "86 (12-18 mies)"
    - "92 (18-24 mies)"
    - "98 (2-3 lata)"
    - "104 (3-4 lata)"
    - "110 (4-5 lat)"
    - "116 (5-6 lat)"
    - "122 (6-7 lat)"
    - "128 (7-8 lat)"
    - "134 (8-9 lat)"
    - "140 (9-10 lat)"
    - "146 (10-11 lat)"
    - "152 (11-12 lat)"
    - "158 (12-13 lat)"
    - "164 (13-14 lat)"
  
  buty:
    zakres: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
```

### 6.3 Obowiązkowe atrybuty przy wystawianiu

```yaml
atrybuty_obowiazkowe:
  wszystkie_kategorie:
    - "Kategoria (wybór z listy)"
    - "Marka (wybór z listy lub 'inna')"
    - "Stan (nowy z metką / nowy / bardzo dobry / dobry / zadowalający)"
    - "Rozmiar (z odpowiedniej skali)"
    - "Kolor (główny)"
    - "Cena"
  
  dodatkowe_zalecane:
    - "Kolor dodatkowy (jeśli jest)"
    - "Materiał (jeśli wymagany)"
    - "Wzór (jeśli jest)"

wyszukiwanie_marki:
  zasada: "Wpisz nazwę marki i wybierz z podpowiedzi"
  brak_marki: "Wybierz 'Inna marka' lub 'Bez marki'"
  uwaga: "Używaj oficjalnych nazw (The North Face, nie TNF)"
```

### 6.4 Filtry zwiększające widoczność

```yaml
filtry_vinted:
  kupujacy_filtruja_po:
    najczestsze:
      - "Kategoria"
      - "Rozmiar"
      - "Marka"
      - "Cena (zakres)"
      - "Stan"
    
    dodatkowe:
      - "Kolor"
      - "Materiał"
      - "Wzór"
      - "Lokalizacja sprzedawcy"
  
  strategia:
    - "Wypełnij WSZYSTKIE dostępne filtry"
    - "Im więcej filtrów = większa szansa na wyświetlenie"
    - "Brak filtra = brak w wynikach filtrowanych"
```
## 7. SYSTEM OCEN I REPUTACJA

### 7.1 Znaczenie ocen na Vinted

```yaml
system_ocen:
  skala:
    zakres: "1-5 gwiazdek"
    wyswietlanie: "Średnia + liczba ocen na profilu"
    widocznosc: "Przy każdym ogłoszeniu i profilu"
  
  co_ocenia_kupujacy:
    - "Zgodność produktu z opisem"
    - "Rzeczywisty stan vs opisany"
    - "Szybkość wysyłki"
    - "Jakość komunikacji"
    - "Pakowanie"
  
  wplyw_ocen_na_sprzedaz:
    brak_ocen:
      efekt: "Niższe zaufanie, trudniej sprzedać"
      rozwiazanie: "Zacznij od tanich produktów, buduj historię"
    
    niskie_oceny: # <4.0
      efekt: "Znacząco niższa konwersja"
      rozwiazanie: "Popraw procedury, zbieraj pozytywne"
    
    srednie_oceny: # 4.0-4.5
      efekt: "Standardowa konwersja"
    
    wysokie_oceny: # 4.5-4.8
      efekt: "Dobra konwersja, zaufanie"
    
    doskonale_oceny: # 4.8-5.0
      efekt: "Najwyższa konwersja, premium ceny możliwe"
```

### 7.2 Proces oceniania na Vinted

```yaml
proces_oceniania:
  kiedy:
    trigger: "Po oznaczeniu transakcji jako zakończonej"
    czas_na_ocene: "Obie strony mogą ocenić"
    widocznosc: "Oceny widoczne po wystawieniu przez obie strony lub po 48h"
  
  kto_ocenia:
    kupujacy: "Ocenia sprzedawcę"
    sprzedawca: "Ocenia kupującego"
    wzajemnosc: "Obie strony się oceniają"
  
  elementy_oceny:
    gwiazdki: "1-5"
    komentarz: "Opcjonalny tekst"
    tagi: "Predefiniowane tagi (opcjonalne)"
  
  widocznosc_ocen:
    profil: "Wszystkie oceny widoczne"
    srednia: "Wyświetlana przy ogłoszeniach"
    szczegoly: "Można przeczytać komentarze"
```

### 7.3 Jak zdobywać pozytywne oceny

```yaml
przed_sprzedaza:
  opis:
    - "Szczegółowy, uczciwy opis"
    - "WSZYSTKIE wady wymienione i sfotografowane"
    - "Dokładne wymiary"
    - "Prawdziwe, jasne zdjęcia"
  
  zdjecia:
    - "Minimum 5 zdjęć wysokiej jakości"
    - "Wady widoczne"
    - "Rzeczywiste kolory (bez filtrów)"
  
  cena:
    - "Uczciwa, rynkowa"
    - "Elastyczność w negocjacjach"

podczas_transakcji:
  komunikacja:
    - "Odpowiadaj szybko (<24h, najlepiej <2h)"
    - "Bądź uprzejmy i pomocny"
    - "Odpowiadaj na wszystkie pytania"
    - "Informuj o statusie wysyłki"
  
  negocjacje:
    - "Bądź otwarty na rozsądne oferty"
    - "Grzeczne kontroferty"
    - "Szybka decyzja"

po_sprzedazy:
  wysylka:
    zasada: "Wyślij w ciągu 1-2 dni roboczych"
    maksimum: "5 dni (limit Vinted)"
    idealne: "Tego samego lub następnego dnia"
  
  pakowanie:
    podstawowe:
      - "Czyste, suche opakowanie"
      - "Ochrona przed zamoczeniem (folia)"
      - "Odpowiedni rozmiar paczki"
    
    dobre:
      - "Ładnie złożone ubranie"
      - "Papier bibułkowy"
      - "Estetyczne opakowanie"
    
    doskonale:
      - "Personalizowana karteczka z podziękowaniem"
      - "Drobny upominek (próbka perfum, cukierek)"
      - "Wstążka lub ozdoba"
    
    efekt: "Dobre pakowanie = lepsze oceny + polecenia"
  
  follow_up:
    - "Wiadomość 'Wysłane!' z numerem śledzenia"
    - "Sprawdzenie czy dotarło (opcjonalnie)"
```

### 7.4 Obsługa problemów i sporów

```yaml
typowe_problemy:
  produkt_niezgodny_z_opisem:
    przyczyna: "Kupujący twierdzi, że produkt inny niż w opisie"
    zapobieganie:
      - "Dokładne opisy"
      - "Szczegółowe zdjęcia"
      - "Fotografuj przed wysyłką"
    
    reakcja:
      - "Przeproś za niedogodność"
      - "Wyjaśnij sytuację spokojnie"
      - "Zaproponuj rozwiązanie (częściowy zwrot, zwrot całości)"
  
  ukryta_wada:
    przyczyna: "Wada nieopisana/niezauważona"
    zapobieganie:
      - "Dokładnie sprawdzaj przed wystawieniem"
      - "Sprawdzaj ponownie przed wysyłką"
    
    reakcja:
      - "Przyznaj się do błędu"
      - "Zaproponuj częściowy zwrot lub pełny zwrot"
      - "Przeproś szczerze"
  
  uszkodzenie_w_transporcie:
    przyczyna: "Paczka uszkodzona podczas wysyłki"
    zapobieganie:
      - "Solidne pakowanie"
      - "Dokumentacja (zdjęcie przed wysyłką)"
    
    reakcja:
      - "Pomóż kupującemu zgłosić reklamację do przewoźnika"
      - "Współpracuj przy rozwiązaniu"
  
  zwrot:
    proces_vinted:
      - "Kupujący ma 2 dni na zgłoszenie problemu"
      - "Vinted mediuje spór"
      - "Zwrot przez system Vinted"
    
    twoja_reakcja:
      - "Akceptuj uzasadnione zwroty bez walki"
      - "Negatywna ocena gorsza niż koszt zwrotu"
```

### 7.5 Odzyskiwanie po negatywnej ocenie

```yaml
negatywna_ocena:
  natychmiastowe_dzialania:
    - "NIE odpowiadaj emocjonalnie"
    - "Poczekaj min. kilka godzin"
    - "Przemyśl odpowiedź"
  
  odpowiedz_publiczna:
    ton: "Profesjonalny, spokojny, przepraszający"
    
    struktura:
      - "Przeprosiny za negatywne doświadczenie"
      - "Wyjaśnienie (bez wymówek)"
      - "Co zrobisz, żeby to się nie powtórzyło"
    
    przyklad: |
      "Przepraszam za tę sytuację. Nie zauważyłam tej wady przy 
      sprawdzaniu i jest mi bardzo przykro. Zaproponowałam zwrot 
      części kwoty. Na przyszłość będę dokładniej sprawdzać produkty 
      przed wysyłką. Dziękuję za feedback."
  
  dlugoterminowe:
    - "Przeanalizuj co poszło nie tak"
    - "Zmień swoje procedury"
    - "Zbieraj pozytywne oceny (każda kolejna zmniejsza wagę negatywnej)"
    - "Jedna negatywna przy 50+ pozytywnych = marginalny wpływ"
```

### 7.6 System "Ulubieni sprzedawcy"

```yaml
ulubieni_sprzedawcy:
  funkcja:
    opis: "Kupujący mogą obserwować (follow) sprzedawców"
    efekt: "Powiadomienia o nowych produktach"
  
  budowanie_bazy_obserwujacych:
    - "Regularnie dodawaj nowe produkty"
    - "Utrzymuj spójną jakość"
    - "Specjalizuj się w niszy (np. tylko Zara, tylko buty sportowe)"
    - "Szybko odpowiadaj na wiadomości"
    - "Oferuj zniżki bundle"
  
  korzysci:
    - "Lojalni kupujący"
    - "Szybsza sprzedaż nowych produktów"
    - "Polecenia znajomym"
```

---

## 8. WYSYŁKA I LOGISTYKA

### 8.1 Zintegrowane metody wysyłki Vinted

```yaml
metody_wysylki:
  inpost_paczkomat:
    popularnosc: "Najpopularniejsza w Polsce"
    waga_max: "25 kg"
    wymiary_max: "41×38×64 cm (rozmiar C)"
    cena_orientacyjna: "~12-15 zł (płaci kupujący)"
    czas_dostawy: "1-2 dni robocze"
    zalety:
      - "Wygoda (24/7)"
      - "Sieć paczkomatów"
      - "Śledzenie przesyłki"
  
  inpost_kurier:
    waga_max: "25 kg"
    cena_orientacyjna: "~15-20 zł"
    czas_dostawy: "1-2 dni robocze"
    kiedy: "Większe/cięższe paczki"
  
  dpd:
    waga_max: "31.5 kg"
    cena_orientacyjna: "~15-18 zł"
    czas_dostawy: "1-2 dni robocze"
  
  poczta_polska:
    opcje:
      - "Pocztex"
      - "Kurier Pocztowy"
    cena_orientacyjna: "~12-16 zł"
    czas_dostawy: "2-4 dni robocze"
  
  odbior_osobisty:
    dostepnosc: "TAK, opcja dostępna"
    kiedy: "Kupujący w tej samej miejscowości"
    uwagi:
      - "Brak ochrony Vinted"
      - "Płatność gotówką lub BLIK"
      - "Ustal szczegóły przez Messenger"
```

### 8.2 Generowanie etykiety wysyłkowej

```yaml
proces_wysylki:
  krok_1:
    akcja: "Kupujący kupuje i płaci"
    efekt: "Pieniądze trafiają do 'portfela Vinted' (escrow)"
  
  krok_2:
    akcja: "Pobierasz etykietę wysyłkową"
    gdzie: "Zakładka 'Sprzedaż' → 'Wyślij'"
    format: "PDF do wydrukowania"
  
  krok_3:
    akcja: "Pakujesz i nadajesz paczkę"
    termin: "Do 5 dni roboczych (im szybciej tym lepiej)"
    gdzie: "Paczkomat/punkt nadania/kurier"
  
  krok_4:
    akcja: "Paczka w drodze"
    sledzenie: "Automatyczne w aplikacji"
  
  krok_5:
    akcja: "Kupujący odbiera i akceptuje"
    czas: "2 dni na zgłoszenie problemu"
    akceptacja: "Automatyczna po 2 dniach bez zgłoszenia"
  
  krok_6:
    akcja: "Pieniądze zwolnione"
    gdzie: "Portfel Vinted → można wypłacić na konto"
```

### 8.3 Pakowanie - najlepsze praktyki

```yaml
pakowanie:
  materialy_podstawowe:
    obowiazkowe:
      - "Koperta foliowa lub karton"
      - "Folia stretch lub woreczek foliowy (ochrona przed wilgocią)"
      - "Taśma pakowa"
    
    zalecane:
      - "Papier bibułkowy"
      - "Naklejka z podziękowaniem"
      - "Woreczek na ubranie"
  
  jak_pakowac_odziez:
    krok_1: "Złóż ubranie starannie"
    krok_2: "Włóż do woreczka foliowego (ochrona przed wilgocią)"
    krok_3: "Włóż do koperty/kartonu"
    krok_4: "Dodaj karteczkę z podziękowaniem (opcjonalnie)"
    krok_5: "Zaklej solidnie"
    krok_6: "Naklej etykietę (widoczna, nieprzysłonięta)"
  
  jak_pakowac_buty:
    krok_1: "Włóż papier do środka (zachowanie kształtu)"
    krok_2: "Zapakuj każdy but osobno w folię"
    krok_3: "Włóż do pudełka (oryginalnego lub zastępczego)"
    krok_4: "Wypełnij puste przestrzenie"
    krok_5: "Zaklej pudełko"
    krok_6: "Opcjonalnie: włóż pudełko do koperty foliowej"
  
  jak_pakowac_torebki:
    krok_1: "Wypełnij wnętrze papierem (zachowanie kształtu)"
    krok_2: "Włóż do dust baga (jeśli jest)"
    krok_3: "Zapakuj w folię bąbelkową lub bibułkę"
    krok_4: "Włóż do kartonu"
    krok_5: "Wypełnij puste przestrzenie"
  
  bledy_do_unikania:
    - "Zbyt duże opakowanie (droższe, nieprofesjonalne)"
    - "Brak ochrony przed wilgocią"
    - "Nieuważne złożenie (zagięcia)"
    - "Brudne opakowanie"
    - "Recyklingowe pudełka z widocznymi starymi etykietami"
```

### 8.4 Terminy wysyłki

```yaml
terminy:
  limit_vinted:
    maksymalny: "5 dni roboczych od zakupu"
    przekroczenie: "Automatyczne anulowanie transakcji"
  
  zalecane:
    idealnie: "Tego samego dnia (jeśli przed 14:00)"
    bardzo_dobrze: "Następny dzień roboczy"
    akceptowalne: "2-3 dni robocze"
    
  wplyw_na_oceny:
    szybka_wysylka: "Częste pozytywne komentarze"
    wolna_wysylka: "Możliwe negatywne oceny"
  
  komunikacja:
    po_zakupie: "Wiadomość 'Dziękuję! Wyślę jutro/pojutrze'"
    po_wyslaniu: "Wiadomość 'Wysłane! Numer śledzenia: X'"
```

### 8.5 Wypłata środków

```yaml
wyplata_srodkow:
  portfel_vinted:
    opis: "Pieniądze ze sprzedaży trafiają do portfela"
    dostepnosc: "Po akceptacji transakcji przez kupującego (lub 2 dni)"
  
  wyplata_na_konto:
    metoda: "Przelew na konto bankowe"
    dodanie_konta: "Ustawienia → Płatności → Dodaj konto"
    czas_wyplaty: "2-5 dni roboczych"
    minimum: "Brak minimum"
  
  uzycie_w_vinted:
    alternatywa: "Możesz użyć środków do zakupów na Vinted"
    korzysc: "Natychmiastowe użycie bez wypłaty"
```

---

## 9. OPTYMALIZACJA I ALGORYTM VINTED

### 9.1 Jak działa algorytm Vinted

```yaml
algorytm_vinted:
  czynniki_rankingowe:
    jakosc_zdjec:
      waga: "Bardzo wysoka"
      algorytm: "Rozpoznaje estetykę, jasność, jakość"
      efekt: "Atrakcyjne zdjęcia = wyższa pozycja"
    
    aktywnosc_sprzedawcy:
      waga: "Wysoka"
      elementy:
        - "Częstotliwość dodawania produktów"
        - "Szybkość odpowiedzi na wiadomości"
        - "Regularne logowanie"
      efekt: "Aktywni sprzedawcy promowani"
    
    kompletnosc_ogloszenia:
      waga: "Wysoka"
      elementy:
        - "Wypełnione wszystkie atrybuty"
        - "Szczegółowy opis"
        - "Wiele zdjęć"
    
    cena_konkurencyjna:
      waga: "Średnia"
      efekt: "Produkty w rynkowych cenach lepiej widoczne"
    
    historia_sprzedawcy:
      waga: "Średnia-wysoka"
      elementy:
        - "Oceny"
        - "Liczba sprzedaży"
        - "Czas na platformie"
    
    swiezosc:
      waga: "Średnia"
      efekt: "Nowe ogłoszenia boost na początku"
```

### 9.2 Strategia "Podbijania" ogłoszeń

```yaml
podbijanie_ogloszen:
  metody:
    edycja:
      akcja: "Wprowadź drobną zmianę w opisie/cenie"
      efekt: "Może odświeżyć pozycję"
      czestotliwosc: "Co kilka dni"
    
    zmiana_ceny:
      akcja: "Obniż cenę o małą kwotę"
      efekt: "Sygnał aktywności + powiadomienie obserwujących"
      strategia: "5-10 zł obniżki co tydzień"
    
    nowe_zdjecie:
      akcja: "Dodaj nowe zdjęcie lub zamień główne"
      efekt: "Odświeża ogłoszenie"
    
    bump_vinted:
      akcja: "Płatna opcja 'Podbij'"
      koszt: "~2-5 zł"
      efekt: "Wyświetlanie na górze przez 24h"
      kiedy: "Dla produktów, które długo nie sprzedają się"
  
  harmonogram:
    dzien_1_3: "Obserwuj, odpowiadaj na pytania"
    dzien_4_7: "Drobna edycja lub zmiana ceny"
    dzien_8_14: "Obniżka 5-10%, nowe zdjęcie"
    dzien_15_21: "Kolejna obniżka lub płatny bump"
    dzien_22_plus: "Znacząca obniżka lub bundle z innymi"
```

### 9.3 Optymalizacja profilu sprzedawcy

```yaml
optymalizacja_profilu:
  zdjecie_profilowe:
    zalecane: "Prawdziwe zdjęcie twarzy (uśmiech)"
    akceptowalne: "Estetyczne zdjęcie (kwiaty, krajobraz)"
    unikaj: "Brak zdjęcia, logo, tekst"
  
  nazwa_uzytkownika:
    zalecane: "Imię lub pseudonim"
    unikaj: "Ciągi cyfr, trudne do zapamiętania"
  
  opis_profilu:
    zawartosc:
      - "Kilka słów o sobie"
      - "Co sprzedajesz (specjalizacja)"
      - "Częstotliwość wysyłki"
      - "Otwartość na negocjacje"
    
    przyklad: |
      "Cześć! 👋 Sprzedaję ubrania z własnej szafy - głównie Zara, 
      H&M, Reserved. Wszystko czyste i zadbane. Wysyłam w 1-2 dni. 
      Otwarta na negocjacje i bundle! 💕"
  
  ustawienia_bundle:
    gdzie: "Ustawienia → Zniżki bundle"
    zalecane:
      - "5% przy 2 przedmiotach"
      - "10% przy 3+ przedmiotach"
    korzysc: "Zachęca do większych zakupów"
  
  wakacje:
    funkcja: "Tryb wakacyjny"
    kiedy: "Gdy nie możesz wysyłać (urlop, choroba)"
    efekt: "Informuje kupujących, ukrywa z wyników"
```

### 9.4 Strategia regularnego dodawania

```yaml
strategia_dodawania:
  czestotliwosc:
    idealna: "2-5 produktów dziennie"
    dobra: "5-10 produktów tygodniowo"
    minimalna: "2-3 produkty tygodniowo"
  
  dlaczego_wazne:
    - "Algorytm promuje aktywnych sprzedawców"
    - "Więcej produktów = więcej szans na sprzedaż"
    - "Regularność buduje obserwujących"
  
  najlepszy_czas:
    wieczor: "18:00-21:00 (po pracy/szkole)"
    weekend: "10:00-12:00 i 18:00-20:00"
    unikaj: "Głęboka noc, wczesny ranek"
  
  batch_processing:
    opis: "Przygotuj wiele ogłoszeń na raz, publikuj stopniowo"
    przygotowanie: "Zdjęcia + opisy w weekend"
    publikacja: "2-3 dziennie przez tydzień"
```

### 9.5 Analiza statystyk

```yaml
statystyki_vinted:
  dostepne_metryki:
    wyswietlenia:
      opis: "Ile razy ogłoszenie było pokazane"
      gdzie: "Pod każdym ogłoszeniem"
    
    polubienia:
      opis: "Ile osób dodało do ulubionych"
      znaczenie: "Wysoka intencja zakupu"
    
    obserwujacy:
      opis: "Ile osób obserwuje Twój profil"
      gdzie: "Profil → Obserwujący"
  
  interpretacja:
    wysokie_wyswietlenia_niskie_polubienia:
      problem: "Zdjęcie główne przyciąga, ale treść odpycha"
      rozwiazanie: "Popraw cenę, opis lub zdjęcia szczegółowe"
    
    wysokie_polubienia_brak_sprzedazy:
      problem: "Zainteresowanie jest, ale coś blokuje"
      rozwiazanie: "Obniż cenę, dodaj więcej szczegółów, włącz negocjacje"
    
    niskie_wyswietlenia:
      problem: "Ogłoszenie nie jest widoczne"
      rozwiazanie: "Popraw tytuł, zdjęcie główne, kategorię, podbij"
```
## 10. CHECKLIST PRZED PUBLIKACJĄ

### 10.1 Kompletny checklist

```yaml
tytul:
  - [ ] Zawiera markę (oficjalna nazwa)
  - [ ] Zawiera typ produktu (sukienka, spodnie, buty)
  - [ ] Zawiera kolor lub wzór
  - [ ] Zawiera rozmiar (opcjonalnie w tytule)
  - [ ] Długość 40-60 znaków (max 100)
  - [ ] Bez CAPS LOCK
  - [ ] Bez "!!!", "???", nadmiaru emoji
  - [ ] Bez słów: OKAZJA, TANIO, PILNE, SUPER
  - [ ] Bez "sprzedam", "oddam"
  - [ ] Słowo kluczowe (marka) na początku

opis:
  - [ ] 80-150 słów
  - [ ] 5 sekcji (wprowadzenie, szczegóły, wymiary, stan, info)
  - [ ] Emoji przy nagłówkach sekcji (💕 ✨ 📏 ✅ 📦)
  - [ ] WYMIARY OBOWIĄZKOWE (mierzone na płasko)
  - [ ] Szczegółowy opis stanu
  - [ ] WSZYSTKIE wady opisane (lokalizacja, rozmiar, widoczność)
  - [ ] Informacja o materiale/składzie
  - [ ] Zachęta do kontaktu
  - [ ] Ton przyjazny, pomocny
  - [ ] Brak zakazanych słów i fraz

cena:
  - [ ] Sprawdzona konkurencja na Vinted
  - [ ] Zastosowane współczynniki (marka, stan, sezon)
  - [ ] Margines na negocjacje 10-20%
  - [ ] Minimum 20-25 zł (opłacalność)
  - [ ] Psychologia cen (końcówka -9 lub -5)
  - [ ] Włączona opcja "Akceptuję oferty"

zdjecia:
  - [ ] Minimum 5 zdjęć (optymalnie 6-8)
  - [ ] Zdjęcie 1 = atrakcyjna miniatura (całość produktu)
  - [ ] Różne perspektywy (przód, tył, bok)
  - [ ] Metka marki (zbliżenie)
  - [ ] Metka rozmiaru i składu
  - [ ] Zbliżenie na materiał/fakturę
  - [ ] WSZYSTKIE wady sfotografowane
  - [ ] Jasne tło, dobre oświetlenie
  - [ ] Własne zdjęcia (nie z internetu!)
  - [ ] Brak filtrów zmieniających kolor
  - [ ] Format kwadratowy lub 4:5

atrybuty:
  - [ ] Kategoria wybrana najdokładniej
  - [ ] Marka wybrana z listy (lub "Inna")
  - [ ] Rozmiar prawidłowy (odpowiednia skala)
  - [ ] Stan wybrany prawidłowo
  - [ ] Kolor główny wybrany
  - [ ] Kolor dodatkowy (jeśli jest)
  - [ ] Materiał (jeśli wymagany)

przed_publikacja:
  - [ ] Produkt sprawdzony (stan, wady, czystość)
  - [ ] Produkt gotowy do wysyłki
  - [ ] Powiadomienia włączone
  - [ ] Materiały do pakowania przygotowane
```

### 10.2 Szybki checklist (wersja skrócona)

```yaml
przed_publikacja:
  tytul:
    - "Marka + Typ + Cecha + Rozmiar"
    - "40-60 znaków, bez caps i zakazanych słów"
  
  opis:
    - "Wymiary NA PŁASKO (obowiązkowe!)"
    - "Stan szczegółowo + wszystkie wady"
    - "5 sekcji z emoji"
  
  zdjecia:
    - "Minimum 5, atrakcyjna miniatura"
    - "Metki, wady sfotografowane"
    - "Własne, bez filtrów"
  
  cena:
    - "Sprawdzona konkurencja"
    - "Margines na negocjacje"
  
  atrybuty:
    - "Wszystkie wypełnione"

po_publikacji:
  - "Odpowiadaj na wiadomości <24h (najlepiej <2h)"
  - "Po sprzedaży: wyślij w 1-2 dni"
  - "Zapakuj starannie"
  - "Poinformuj o wysyłce"
```

### 10.3 System punktacji jakości ogłoszenia

```yaml
system_punktacji:
  tytul: # 15 punktów
    marka_i_typ: 6
    kolor_cecha: 4
    optymalna_dlugosc: 3
    brak_zakazanych_elementow: 2
  
  opis: # 30 punktów
    struktura_5_sekcji: 8
    wymiary_kompletne: 8
    opis_stanu_szczegolowy: 6
    opis_wad_dokladny: 5
    ton_i_formatowanie: 3
  
  cena: # 15 punktów
    konkurencyjnosc: 6
    zastosowanie_wspolczynnikow: 4
    margines_negocjacji: 3
    psychologia_cen: 2
  
  zdjecia: # 30 punktów
    miniatura_atrakcyjna: 8
    liczba_min_5: 6
    wady_sfotografowane: 6
    metki_widoczne: 5
    jakosc_techniczna: 5
  
  atrybuty: # 10 punktów
    kategoria_prawidlowa: 4
    marka_rozmiar_stan: 4
    kolory_material: 2

progi_jakosci:
  wzorcowe: "90-100 punktów - publikuj bez zmian"
  dobre: "75-89 punktów - drobne poprawki zalecane"
  wymaga_poprawy: "60-74 punktów - popraw przed publikacją"
  nie_publikowac: "<60 punktów - wymaga znaczących zmian"
```

---

## 11. OBSŁUGA BŁĘDÓW I PRZYPADKI SPECJALNE

### 11.1 Brak informacji od użytkownika

```yaml
brakujace_informacje:
  marka_nieznana:
    akcja: "Wybierz 'Inna marka' w filtrze"
    tytul: "[TYP] + [CECHA] + [KOLOR] + [ROZMIAR]"
    opis: "Marka nieznana / bez metki"
    przyklad_tytulu: "Sukienka midi satynowa czarna S"
  
  rozmiar_nieznany:
    akcja: "OBOWIĄZKOWE - zapytaj użytkownika"
    alternatywa: "Poproś o wymiary, określ przybliżony rozmiar"
    pytania:
      - "Jaki rozmiar jest na metce?"
      - "Jakie są wymiary (długość, szerokość)?"
      - "Do jakiego rozmiaru pasuje?"
  
  stan_nieopisany:
    akcja: "OBOWIĄZKOWE - zapytaj użytkownika"
    pytania:
      - "Ile razy było noszone?"
      - "Czy są jakiekolwiek wady (plamy, przetarcia, dziury)?"
      - "Czy było prane/czyszczone?"
      - "Czy są wszystkie elementy (guziki, paski)?"
  
  wymiary_nieznane:
    akcja: "OBOWIĄZKOWE - poproś o pomiar"
    instrukcja: "Zmierz na płasko: długość, szerokość pod pachami, długość rękawa"
    komunikat: "Proszę o zmierzenie ubrania na płasko - potrzebuję: [lista wymiarów dla kategorii]"
  
  brak_zdjec:
    akcja: "NIE publikuj bez zdjęć"
    minimum: "3 zdjęcia (zalecane 5+)"
    komunikat: "Vinted wymaga własnych zdjęć produktu. Proszę o dodanie minimum 3 zdjęć."
  
  cena_nieznana:
    akcja_1: "Wyszukaj podobne produkty na Vinted"
    akcja_2: "Zapytaj użytkownika o oczekiwany zakres"
    akcja_3: "Zastosuj formułę wyceny"
```

### 11.2 Produkty specjalne

```yaml
produkty_specjalne:
  luksusowe_premium:
    marki: ["Louis Vuitton", "Gucci", "Prada", "Chanel", "Hermès"]
    wymagania:
      - "Zdjęcia metek autentyczności"
      - "Numer seryjny (jeśli jest)"
      - "Certyfikat autentyczności (jeśli jest)"
      - "Zdjęcia charakterystycznych elementów marki"
      - "Dust bag, pudełko, dokumenty"
    opis: "Podkreśl autentyczność, opisz pochodzenie"
    cena: "Wyższe współczynniki (0.40-0.70)"
  
  vintage_retro:
    definicja: "Produkty 20+ lat"
    wymagania:
      - "Zdjęcia metek epoki"
      - "Opis charakterystycznych cech okresu"
      - "Stan jako 'patyna' (zaleta)"
    opis: "Podkreśl wiek, unikalność, kolekcjonerski charakter"
    cena: "Może być wyższa niż standardowa deprecjacja"
  
  z_wadami:
    wymagania:
      - "KAŻDA wada opisana szczegółowo"
      - "KAŻDA wada sfotografowana"
      - "Stan: 'Dobry' lub 'Zadowalający'"
    format_opisu_wady: "[CO] + [GDZIE] + [ROZMIAR] + [WIDOCZNOŚĆ] + [ZDJĘCIE]"
    przyklad: "Plama ~1cm na dole z przodu, mało widoczna przy noszeniu (zdjęcie 5)"
    cena: "Niższa o wartość wady"
  
  zestawy_bundle:
    tytul: "ZESTAW [LICZBA] szt [TYP] [MARKA] [ROZMIAR]"
    opis:
      - "Lista wszystkich elementów"
      - "Opis każdego elementu osobno"
      - "Stan każdego elementu"
    zdjecia:
      - "Wszystkie elementy razem (zdjęcie 1)"
      - "Każdy element osobno"
      - "Metki każdego elementu"
    cena: "Suma wartości - 10-20% rabatu"
  
  odziez_dziecieca:
    rozmiar: "Podwójny: cm + wiek (np. '80 cm / 12 mies')"
    stan: "Szczegółowo opisz (dzieci brudzą)"
    opis: "Okres użytkowania, przez ile dzieci"
    cena: "Szybka deprecjacja, niższe ceny"
  
  odziez_ciazowa:
    specyfika: "Krótki okres użytkowania"
    opis: "Przez ile miesięcy noszone, w którym trymestrze"
    cena: "Dobra sprzedawalność mimo niskich cen"
```

### 11.3 Sytuacje problematyczne

```yaml
sytuacje_problematyczne:
  podrobki_falsyfikaty:
    akcja: "ODMÓW wystawienia"
    powod: "Nielegalne, grozi blokadą konta i konsekwencjami prawnymi"
    komunikat: "Nie mogę wystawić produktu, który może być podróbką. Vinted zabrania sprzedaży fałszywych produktów."
  
  niepewnosc_autentycznosci:
    akcja: "Zaznacz w opisie"
    opis: "Nie jestem w stanie potwierdzić autentyczności. Kupione na [pchlim targu/second handzie]. Cena odzwierciedla tę niepewność."
    cena: "Znacząco niższa"
  
  produkt_bardzo_zniszczony:
    akcja: "Oceń sens sprzedaży"
    kryteria:
      - "Fast fashion zniszczony = nie warto (czas > wartość)"
      - "Marka premium zniszczona = może warto (na części, DIY)"
    alternatywa: "Oddaj za darmo, przekaż do PCK"
  
  cena_ponizej_oplacalnosci:
    definicja: "Produkt wart <20 zł"
    rozwiazania:
      - "Bundle z innymi produktami"
      - "Zestaw kilku podobnych"
      - "Oddaj za darmo / wymień"
    komunikat: "Produkt wart ~X zł - przy kosztach wysyłki ~15 zł może być nieatrakcyjny dla kupujących. Sugeruję połączenie w zestaw z innymi produktami."
```

### 11.4 Najczęstsze błędy sprzedawców

```yaml
najczestsze_bledy:
  brak_wymiarow:
    skutek: "Pytania kupujących, niższe zaufanie, zwroty"
    rozwiazanie: "ZAWSZE podawaj wymiary mierzone na płasko"
  
  ukrywanie_wad:
    skutek: "Negatywne oceny, zwroty, spory"
    rozwiazanie: "Opisz i sfotografuj KAŻDĄ wadę"
  
  zle_zdjecia:
    skutek: "Niskie wyświetlenia, brak zainteresowania"
    rozwiazanie: "Jasne, ostre, atrakcyjna miniatura"
  
  zdjecia_z_internetu:
    skutek: "Usunięcie ogłoszenia, ostrzeżenie, blokada"
    rozwiazanie: "TYLKO własne zdjęcia"
  
  za_wysoka_cena:
    skutek: "Brak zainteresowania"
    rozwiazanie: "Sprawdź konkurencję, bądź realistyczny"
  
  wolne_odpowiedzi:
    skutek: "Kupujący kupuje gdzie indziej"
    rozwiazanie: "Odpowiadaj <24h, najlepiej <2h"
  
  opozniona_wysylka:
    skutek: "Negatywne oceny, anulowanie po 5 dniach"
    rozwiazanie: "Wysyłaj w 1-2 dni"
  
  brak_metek_na_zdjeciach:
    skutek: "Wątpliwości co do autentyczności"
    rozwiazanie: "Zawsze fotografuj metki marki i rozmiaru"
  
  opis_stanu_ogolnikowy:
    przyklad_zly: "W dobrym stanie"
    przyklad_dobry: "Noszony ~10 razy, bez plam i dziur, drobny pilling pod pachami (zdjęcie 5)"
```

---

## 12. PRZYKŁADY KOMPLETNYCH OGŁOSZEŃ

### 12.1 Przykład: Sukienka markowa

**Tytuł:**
```
Zara sukienka midi satynowa czarna elegancka S
```

**Opis:**
```
💕 Piękna sukienka Zara z satynowej tkaniny w kolorze czarnym. 
Elegancka i uniwersalna - idealna na wyjście i do biura.

✨ Szczegóły:
• Marka: Zara
• Kolor: czarny
• Materiał: 97% poliester, 3% elastan (satynowy połysk)
• Fason: midi, lekko rozkloszowana
• Dekolt: V
• Rękawy: długie
• Zapięcie: kryty zamek z tyłu

📏 Wymiary (mierzone na płasko):
• Długość całkowita: 110 cm
• Szerokość pod pachami: 44 cm
• Szerokość w talii: 38 cm
• Długość rękawa: 58 cm

✅ Stan: Bardzo dobry. Noszona 3-4 razy na specjalne okazje. 
Bez plam, dziur, przetarć. Materiał w idealnym stanie, 
bez zaciągnięć.

📦 Wysyłam w ciągu 1-2 dni, starannie zapakowane.

Pytania? Pisz śmiało! 💬
```

**Cena:** 89 zł

**Atrybuty:**
- Kategoria: Kobiety → Sukienki → Sukienki midi
- Marka: Zara
- Rozmiar: S
- Stan: Bardzo dobry
- Kolor: Czarny
- Materiał: Poliester

**Zdjęcia (7):**
1. Sukienka na wieszaku - przód (miniatura)
2. Sukienka na wieszaku - tył
3. Sukienka na osobie (opcjonalnie)
4. Metka Zara - zbliżenie
5. Metka rozmiaru i składu
6. Zbliżenie na materiał (satynowy połysk)
7. Detal dekoltu V

---

### 12.2 Przykład: Buty sportowe

**Tytuł:**
```
Nike Air Force 1 białe niskie 39 stan bardzo dobry
```

**Opis:**
```
💕 Kultowe Nike Air Force 1 '07 w kolorze białym. Klasyk, 
który pasuje do wszystkiego!

✨ Szczegóły:
• Marka: Nike
• Model: Air Force 1 '07 Low
• Kolor: białe (Triple White)
• Rozmiar: EU 39 / US 8 / 25 cm wkładka
• Materiał: skóra naturalna

📏 Wymiary:
• Długość wkładki: 25 cm
• Szerokość w najszerszym miejscu: 9 cm

✅ Stan: Bardzo dobry. Noszone przez jeden sezon (~30 razy).
• Cholewka: czysta, bez przetarć, minimalne zagięcia przy zginaniu
• Podeszwa: lekkie ślady użytkowania, bieżnik 85%
• Wnętrze: czyste, wkładka w dobrym stanie
• Wada: drobne zabrudzenie na lewym nosku ~0.5cm (zdjęcie 6) 
  - można wyczyścić

📦 W zestawie: buty + oryginalne pudełko Nike.
Wysyłam w 1-2 dni 👟

Pytania? Pisz! 💬
```

**Cena:** 189 zł

**Atrybuty:**
- Kategoria: Kobiety → Buty → Trampki i sneakersy
- Marka: Nike
- Rozmiar: 39
- Stan: Bardzo dobry
- Kolor: Biały

**Zdjęcia (9):**
1. Para butów - przód, lekko z góry (miniatura)
2. Profil - jeden but z boku
3. Tył - oba buty
4. Logo Nike - zbliżenie na swoosh
5. Podeszwa - stan zużycia
6. Wada - zabrudzenie na nosku (zbliżenie)
7. Wnętrze - wkładka, rozmiar
8. Metka wewnętrzna z rozmiarem
9. Oryginalne pudełko

---

### 12.3 Przykład: Torebka premium

**Tytuł:**
```
Michael Kors torebka crossbody Jet Set czarna skóra
```

**Opis:**
```
💕 Elegancka torebka Michael Kors z linii Jet Set Travel. 
Ponadczasowy model z saffiano leather - idealna na co dzień!

✨ Szczegóły:
• Marka: Michael Kors
• Model: Jet Set Travel Medium Crossbody
• Kolor: czarny ze złotymi okuciami
• Materiał: skóra saffiano (charakterystyczny wzór)
• Zapięcie: zamek błyskawiczny
• Pasek: regulowany, odpinany

📏 Wymiary:
• Szerokość: 24 cm
• Wysokość: 17 cm
• Głębokość: 6 cm
• Długość paska: 55-130 cm (regulowany)

✅ Stan: Dobry. Używana regularnie przez rok.
• Zewnątrz: skóra w bardzo dobrym stanie, drobne otarcie 
  na dolnej krawędzi ~1cm (zdjęcie 7)
• Wnętrze: czyste, bez plam
• Okucia: złote elementy bez zarysowań
• Pasek: w bardzo dobrym stanie

📦 W zestawie: torebka + oryginalny dust bag MK.
Wysyłam w 1-2 dni 👜

Zapraszam do innych moich ogłoszeń! 💕
```

**Cena:** 279 zł

**Atrybuty:**
- Kategoria: Kobiety → Akcesoria → Torebki
- Marka: Michael Kors
- Stan: Dobry
- Kolor: Czarny
- Materiał: Skóra

**Zdjęcia (9):**
1. Torebka - przód z paskiem (miniatura)
2. Tył
3. Bok - pokazuje głębokość
4. Wnętrze - otwarta
5. Logo MK - zbliżenie na sprzączkę
6. Okucia - zamek, elementy złote
7. Wada - otarcie na dole (zbliżenie)
8. Dno - stan
9. Dust bag MK

---

### 12.4 Przykład: Kurtka zimowa

**Tytuł:**
```
The North Face kurtka puchowa 700 czarna M damska
```

**Opis:**
```
💕 Ciepła kurtka puchowa The North Face z wypełnieniem 700 cuin. 
Idealna na zimę - lekka, ciepła i stylowa!

✨ Szczegóły:
• Marka: The North Face
• Model: Nuptse Jacket
• Kolor: TNF Black (czarny)
• Rozmiar: M (damski)
• Wypełnienie: puch gęsi 700 cuin
• Materiał zewnętrzny: nylon ripstop, wodoodporny

📏 Wymiary (mierzone na płasko):
• Długość całkowita: 62 cm
• Szerokość pod pachami: 54 cm
• Długość rękawa: 64 cm

✅ Stan: Bardzo dobry. Noszona jeden sezon zimowy.
• Zewnątrz: bez dziur, przetarć, plam
• Puch: równomiernie rozłożony, nie zbity
• Zamki: sprawne, działają płynnie
• Wada: mikroskopijne zabrudzenie przy lewym mankiecie 
  ~3mm (zdjęcie 8) - praktycznie niewidoczne

📦 W zestawie: kurtka + oryginalny woreczek kompresyjny TNF.
Wysyłam w 1-2 dni, starannie zapakowane ❄️

Pytania? Pisz! 💬
```

**Cena:** 449 zł

**Atrybuty:**
- Kategoria: Kobiety → Odzież → Kurtki i płaszcze
- Marka: The North Face
- Rozmiar: M
- Stan: Bardzo dobry
- Kolor: Czarny

**Zdjęcia (9):**
1. Kurtka - przód (miniatura)
2. Tył
3. Na osobie (opcjonalnie)
4. Logo TNF - zbliżenie
5. Metka z rozmiarem i składem
6. Metka 700 fill power
7. Detale - kieszenie, zamki
8. Wada - zabrudzenie przy mankiecie (zbliżenie)
9. Woreczek kompresyjny TNF

---

### 12.5 Przykład: Zestaw dziecięcy

**Tytuł:**
```
ZESTAW 5 szt body H&M 68 (4-6 mies) bawełna organiczna
```

**Opis:**
```
💕 Zestaw 5 uroczych body H&M z bawełny organicznej dla 
malucha. Idealne na co dzień!

✨ Szczegóły:
• Marka: H&M (linia Conscious)
• Rozmiar: 68 (na 4-6 miesięcy)
• Materiał: 100% bawełna organiczna
• Zapięcie: patentki na dole
• Kolory w zestawie:
  - Białe z nadrukiem misia
  - Szare melanż
  - Niebieskie w paski
  - Beżowe
  - Białe gładkie

📏 Wymiary (body białe, mierzone na płasko):
• Długość całkowita: 40 cm
• Szerokość pod pachami: 24 cm

✅ Stan: Bardzo dobry. Noszone przez jedno dziecko, 
przez ok. 2 miesiące. Prane w 40°C.
• Wszystkie bez plam, dziur, przetarć
• Kolory nie sprane
• Patentki sprawne
• Bawełna miękka, niepilling

📦 Wysyłam w 1-2 dni. Wyprane, czyste, gotowe do noszenia! 🧒

Mam więcej ubranek w tym rozmiarze - sprawdź moje ogłoszenia! 💕
```

**Cena:** 45 zł (za zestaw 5 szt)

**Atrybuty:**
- Kategoria: Dzieci → Chłopcy/Dziewczynki → Niemowlęta
- Marka: H&M
- Rozmiar: 68
- Stan: Bardzo dobry
- Kolor: Wielokolorowy

**Zdjęcia (8):**
1. Wszystkie 5 body razem rozłożone (miniatura)
2. Body białe z misiem - osobno
3. Body szare melanż - osobno
4. Body niebieskie w paski - osobno
5. Metka H&M Conscious
6. Metka rozmiaru 68
7. Patentki - zbliżenie
8. Metka składu (100% organic cotton)

---

## 13. ZASADY GENEROWANIA PRZEZ AGENTA AI

### 13.1 Parametry wejściowe

```yaml
wymagane:
  - nazwa_produktu: "string"
  - kategoria: "enum[sukienki, bluzki, spodnie, buty, torebki, kurtki, inne]"
  - marka: "string | 'nieznana'"
  - rozmiar: "string"
  - stan: "enum[nowy_z_metka, nowy_bez_metki, bardzo_dobry, dobry, zadowalajacy]"
  - zdjecia: "array[min: 3, zalecane: 5+]"

wymagane_zalezne:
  - wymiary: "object" # OBOWIĄZKOWE dla odzieży
  - dlugosc_wkladki: "number" # OBOWIĄZKOWE dla butów

opcjonalne:
  - cena_oczekiwana: "number | null"
  - kolor: "string"
  - material: "string"
  - wady: "array[string]"
  - historia_uzytkowania: "string"
  - powod_sprzedazy: "string"
  - akcesoria: "array[string]" # pudełko, dust bag, metki
```

### 13.2 Proces generowania

```yaml
krok_1_walidacja:
  akcje:
    - "Sprawdź kompletność danych wejściowych"
    - "Zidentyfikuj kategorię Vinted"
    - "Określ wymagane atrybuty dla kategorii"
  walidacja:
    - "Jeśli brak wymiarów → ZAPYTAJ (obowiązkowe!)"
    - "Jeśli brak stanu → ZAPYTAJ"
    - "Jeśli brak rozmiaru → ZAPYTAJ"
    - "Jeśli brak zdjęć → KOMUNIKAT (minimum 3, zalecane 5+)"

krok_2_tytul:
  akcje:
    - "Zastosuj formułę: Marka + Typ + Cecha + Rozmiar"
    - "Sprawdź czy marka ma oficjalną nazwę"
    - "Ogranicz do 40-60 znaków"
  walidacja:
    - "Brak zakazanych słów"
    - "Brak CAPS LOCK"
    - "Słowo kluczowe na początku"

krok_3_opis:
  akcje:
    - "Utwórz 5 sekcji z emoji"
    - "Wypełnij szczegóły produktu"
    - "OBOWIĄZKOWO dodaj wymiary"
    - "Opisz stan szczegółowo"
    - "Opisz WSZYSTKIE wady (jeśli są)"
  walidacja:
    - "80-150 słów"
    - "Wymiary kompletne"
    - "Brak zakazanych słów"
    - "Ton przyjazny"

krok_4_cena:
  akcje:
    - "Jeśli brak ceny → wyszukaj konkurencję lub zapytaj"
    - "Zastosuj formułę: Cena_nowego × Wsp_marki × Wsp_stanu × Wsp_sezonu"
    - "Dodaj margines negocjacji 10-20%"
    - "Zastosuj psychologię cen (końcówka -9 lub -5)"
  walidacja:
    - "Minimum 20-25 zł (opłacalność)"
    - "Konkurencyjna względem Vinted"

krok_5_atrybuty:
  akcje:
    - "Wybierz najdokładniejszą kategorię"
    - "Ustaw markę (z listy lub 'Inna')"
    - "Ustaw rozmiar (prawidłowa skala)"
    - "Ustaw stan"
    - "Ustaw kolory"
    - "Ustaw materiał (jeśli wymagany)"

krok_6_zdjecia:
  akcje:
    - "Określ zalecaną kolejność zdjęć"
    - "Wskaż brakujące typy zdjęć"
    - "Sprawdź czy wady są na zdjęciach"

krok_7_weryfikacja:
  akcje:
    - "Przejdź pełny checklist"
    - "Oblicz punktację jakości"
    - "Wygeneruj listę sugestii poprawy"
```

### 13.3 Format odpowiedzi agenta

```yaml
format_odpowiedzi:
  tytul:
    wartosc: "string (40-60 znaków)"
    walidacja: "passed/failed + uwagi"
  
  opis:
    wartosc: "string (markdown, 80-150 słów)"
    sekcje: 5
    wymiary: "object (obowiązkowe)"
    wady: "array[string]"
  
  cena:
    kwota: "number"
    waluta: "PLN"
    margines_negocjacji: "number (%)"
    cena_minimalna: "number (po negocjacjach)"
    uzasadnienie: "string"
  
  atrybuty:
    kategoria: "string (pełna ścieżka Vinted)"
    marka: "string"
    rozmiar: "string"
    stan: "enum"
    kolor_glowny: "string"
    kolor_dodatkowy: "string | null"
    material: "string | null"
  
  zdjecia:
    kolejnosc_zalecana: "array[string]"
    brakujace: "array[string]"
    wady_do_sfotografowania: "array[string]"
  
  jakosc:
    punktacja: "number (0-100)"
    poziom: "enum[wzorcowe, dobre, wymaga_poprawy, nie_publikowac]"
    szczegoly:
      tytul: "number/15"
      opis: "number/30"
      cena: "number/15"
      zdjecia: "number/30"
      atrybuty: "number/10"
    sugestie_poprawy: "array[string]"
  
  ostrzezenia:
    - "Lista potencjalnych problemów"
    - "Rzeczy wymagające uwagi użytkownika"
```

### 13.4 Reguły walidacji

```yaml
reguly_walidacji:
  tytul:
    max_dlugosc: 100
    optymalna_dlugosc: [40, 60]
    zakazane_slowa: ["okazja", "tanio", "pilne", "super", "sprzedam"]
    zakazane_formatowanie: ["CAPS LOCK", "!!!", "???", "nadmiar emoji"]
    wymagane: ["marka lub typ", "kategoria produktu"]
  
  opis:
    min_slow: 40
    max_slow: 200
    optymalna_dlugosc: [80, 150]
    wymagane_sekcje: ["szczegóły", "wymiary", "stan"]
    wymagane_wymiary: true
    wymagany_opis_wad: true # jeśli stan != nowy
    emoji: [2, 5]
  
  cena:
    minimum: 20 # opłacalność
    format: "liczba całkowita"
    koncowki: [-9, -5, 0]
  
  zdjecia:
    minimum: 3
    zalecane: [5, 8]
    maximum: 20
    wymagane_typy: ["calosc", "metka_marki", "metka_rozmiaru"]
    wymagane_jesli_wady: ["zdjecie_wady"]
  
  atrybuty:
    wymagane: ["kategoria", "marka", "rozmiar", "stan", "kolor"]
```

---

## 14. PODSUMOWANIE - ZŁOTE ZASADY VINTED

### 14.1 Najważniejsze zasady

```yaml
zlote_zasady:
  zdjecia_najwazniejsze:
    - "Minimum 5 zdjęć, atrakcyjna miniatura"
    - "Metki ZAWSZE sfotografowane"
    - "KAŻDA wada sfotografowana"
    - "Własne zdjęcia, bez filtrów"
  
  wymiary_obowiazkowe:
    - "ZAWSZE mierz na płasko"
    - "Podawaj wszystkie kluczowe wymiary"
    - "Rozmiar na metce ≠ rzeczywisty rozmiar"
  
  szczerosc_o_stanie:
    - "Opisz KAŻDĄ wadę: gdzie, jak duża, jak widoczna"
    - "Sfotografuj każdą wadę"
    - "Lepiej napisać więcej niż mniej"
  
  cena_konkurencyjna:
    - "Sprawdź podobne produkty na Vinted"
    - "Zostaw margines na negocjacje 10-20%"
    - "Minimum ~20-25 zł (opłacalność)"
  
  szybkosc:
    - "Odpowiadaj na wiadomości <24h (najlepiej <2h)"
    - "Wysyłaj w 1-2 dni po sprzedaży"
    - "Informuj o statusie"
  
  pakowanie:
    - "Starannie, estetycznie"
    - "Ochrona przed wilgocią"
    - "Drobny bonus (karteczka, upominek)"
```

### 14.2 Najczęstsze błędy do unikania

```yaml
bledy_do_unikania:
  krytyczne:
    - "Brak wymiarów"
    - "Ukrywanie wad"
    - "Zdjęcia z internetu"
    - "Podróbki"
  
  powazne:
    - "Słabe zdjęcia (ciemne, nieostre)"
    - "Za wysoka cena"
    - "Wolne odpowiedzi (>24h)"
    - "Opóźniona wysyłka (>5 dni)"
  
  umiarkowane:
    - "Brak zdjęć metek"
    - "Ogólnikowy opis stanu"
    - "Brak informacji o materiale"
    - "Zła kategoria"
```

### 14.3 Metryki sukcesu

```yaml
metryki_sukcesu:
  oceny:
    cel: "4.8+ / 5.0"
    minimum: "4.5 / 5.0"
  
  czas_odpowiedzi:
    idealny: "<2 godziny"
    maksymalny: "<24 godziny"
  
  czas_wysylki:
    idealny: "1-2 dni"
    maksymalny: "5 dni"
  
  konwersja:
    dobra: "1 sprzedaż na 10 polubień"
    srednia: "1 sprzedaż na 20 polubień"
  
  wskazniki_poprawy:
    niskie_wyswietlenia: "Popraw tytuł i zdjęcie główne"
    niskie_polubienia: "Popraw cenę i zdjęcia"
    niskie_konwersje: "Popraw opis i cenę"
```
