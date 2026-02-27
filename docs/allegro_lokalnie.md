# REGUŁY TWORZENIA WYSOKOKONWERSYJNYCH OGŁOSZEŃ NA ALLEGRO LOKALNIE

> **Wersja dokumentu:** 1.0  
> **Przeznaczenie:** Agent AI do generowania ogłoszeń sprzedażowych  
> **Platforma:** Allegro Lokalnie (allegrolokalnie.pl)

---

## 1. CHARAKTERYSTYKA PLATFORMY

### 1.1 Specyfika Allegro Lokalnie

**Allegro Lokalnie** to dedykowana sekcja platformy Allegro do sprzedaży C2C (konsument-konsument) z naciskiem na transakcje lokalne i odbiór osobisty [2]. Platforma łączy zaufanie marki Allegro z elastycznością handlu lokalnego.

| Aspekt | Charakterystyka |
|--------|-----------------|
| **Model biznesu** | C2C, sprzedaż lokalna |
| **Prowizja** | 0 zł za wystawienie ogłoszenia |
| **Zasięg użytkowników** | 20+ mln użytkowników Allegro |
| **Integracja zewnętrzna** | Facebook Marketplace [8] |
| **Bezpieczeństwo** | Allegro Protect, system reputacji |
| **Płatności** | Allegro Pay, przelewy tradycyjne |
| **Opcje dostawy** | Odbiór osobisty, wysyłka, Smart! |

### 1.2 Kluczowe cechy platformy

```yaml
unikalne_cechy:
  brak_prowizji:
    opis: "Sprzedawca otrzymuje 100% ceny"
    uwaga: "Minus ewentualne koszty wysyłki"
  
  integracja_allegro:
    opis: "Przeniesienie reputacji i ocen z głównej platformy"
    korzysc: "Natychmiastowe zaufanie kupujących"
  
  allegro_protect:
    opis: "Gwarancja zwrotu pieniędzy dla kupującego"
    korzysc: "Ochrona obu stron transakcji"
  
  facebook_marketplace:
    opis: "Ogłoszenia automatycznie widoczne na FB"
    korzysc: "Dodatkowy zasięg bez wysiłku"
  
  system_ocen:
    opis: "Budowanie wiarygodności poprzez opinie"
    korzysc: "Wyższa konwersja przy lepszych ocenach"
  
  opcje_dostawy:
    - "Odbiór osobisty (główna metoda)"
    - "Wysyłka własna (InPost, kurier)"
    - "Smart! (dla kwalifikujących się sprzedawców)"
```

### 1.3 Najlepiej sprzedające się kategorie

| Kategoria | Potencjał | Dlaczego dobrze się sprzedaje |
|-----------|-----------|-------------------------------|
| **Elektronika** | ⭐⭐⭐⭐⭐ | Możliwość sprawdzenia przed zakupem |
| **Meble i wyposażenie** | ⭐⭐⭐⭐⭐ | Odbiór osobisty preferowany (transport) |
| **Motoryzacja (części)** | ⭐⭐⭐⭐ | Weryfikacja kompatybilności na miejscu |
| **Odzież markowa** | ⭐⭐⭐⭐ | Przymierzenie, sprawdzenie autentyczności |
| **Sprzęt sportowy** | ⭐⭐⭐⭐ | Testowanie przed zakupem |
| **AGD duże** | ⭐⭐⭐⭐ | Transport i instalacja |
| **Kolekcje i hobby** | ⭐⭐⭐ | Weryfikacja stanu i autentyczności |

### 1.4 Obowiązki prawne - Dyrektywa DAC7

Od lipca 2024 r. obowiązuje dyrektywa DAC7, która zobowiązuje Allegro Lokalnie do raportowania informacji o transakcjach do Krajowej Administracji Skarbowej [6]:

```yaml
dac7_regulacje:
  limit_raportowania:
    transakcje: 30 # w roku kalendarzowym
    wartosc: "2000 EUR" # równowartość
    logika: "Przekroczenie któregokolwiek = raportowanie"
  
  raport_dac7:
    odbiorca_1: "Użytkownik (sprzedawca)"
    odbiorca_2: "Krajowa Administracja Skarbowa"
    termin: "Do końca stycznia za poprzedni rok"
  
  opodatkowanie:
    sprzedaz_okazjonalna:
      warunek: "Przedmiot posiadany minimum 6 miesięcy"
      podatek: "Zwolniony"
    
    sprzedaz_z_zyskiem:
      warunek: "Przedmiot posiadany krócej niż 6 miesięcy"
      podatek: "12% od zysku (różnica cena sprzedaży - cena zakupu)"
    
    dzialalnosc_regularna:
      warunek: "Systematyczna sprzedaż z zamiarem zarobku"
      wymog: "Rozważ działalność gospodarczą"
```

---

## 2. TYTUŁ OGŁOSZENIA

### 2.1 Parametry techniczne

| Parametr | Wartość | Uwagi |
|----------|---------|-------|
| **Limit znaków** | Do 75 znaków | Dłuższe obcinane w wynikach wyszukiwania |
| **Słowa kluczowe** | Na początku (2-3 frazy) | Wpływ na widoczność i SEO Allegro |
| **Formatowanie** | Normalne | Bez CAPS LOCK, bez emotikon |
| **Lokalizacja** | Opcjonalna, zalecana | Zwiększa CTR dla ofert lokalnych |
| **Specyfika** | Konkretne parametry | Marka, model, rozmiar, stan |

### 2.2 Formuła struktury tytułu

```
[MARKA] + [MODEL] + [PARAMETR KLUCZOWY] + [STAN] + [LOKALIZACJA opcjonalnie]
```

### 2.3 Struktura tytułu według kategorii

#### Elektronika
```
[MARKA] [MODEL] [POJEMNOŚĆ/PARAMETR] [STAN] [LOKALIZACJA]
```
**Przykład:** `iPhone 13 Pro 256GB Górski Błękit Stan Bardzo Dobry`

#### Meble i wyposażenie
```
[TYP] [MATERIAŁ] [WYMIARY] [CECHA WYRÓŻNIAJĄCA] [LOKALIZACJA]
```
**Przykład:** `Sofa narożna rozkładana szara 290cm`

#### Odzież i obuwie
```
[MARKA] [TYP] [ROZMIAR] [PŁEĆ] [STAN] [LOKALIZACJA]
```
**Przykład:** `Nike Air Max 90 rozmiar 43 Męskie Nowe`

#### AGD i RTV
```
[MARKA] [MODEL] [PARAMETR KLUCZOWY] [STAN] [LOKALIZACJA]
```
**Przykład:** `Samsung TV 55 cali QLED Gwarancja Warszawa`

#### Motoryzacja (części)
```
[CZĘŚĆ] [MARKA AUTA] [MODEL] [ROCZNIKI] [STAN]
```
**Przykład:** `Silnik 1.8 TSI Audi A4 B8 2015-2020 Sprawny`

### 2.4 Optymalizacja SEO tytułu

```yaml
zasady_seo:
  slowa_kluczowe:
    pozycja: "Na początku tytułu"
    ilosc: "2-3 główne frazy"
    priorytet: "Algorytm Allegro priorytetyzuje początek"
  
  nazwy_oficjalne:
    zasada: "Używaj oficjalnych nazw modeli"
    powod: "Zwiększa trafność w wyszukiwarce i porównywarce Allegro"
    przyklad: "iPhone 13 Pro Max zamiast iPhone 13"
  
  synonimy:
    telefon: ["smartfon", "komórka"]
    laptop: ["notebook", "komputer przenośny"]
    telewizor: ["TV", "odbiornik"]
    samochód: ["auto", "pojazd"]
  
  unikaj:
    - "Sprzedam" # zbędne, oczywiste
    - "Super" # marketingowe
    - "Okazja" # marketingowe
    - Ogólniki bez konkretów
```

### 2.5 Zakazane elementy w tytule

```yaml
zakazane_slowa:
  marketingowe:
    - OKAZJA
    - TANIO
    - SUPER
    - MEGA
    - WYPRZEDAŻ
    - HIT
    - GRATISY
    - PROMOCJA
  
  urgency:
    - PILNE
    - SZYBKO
    - OSTATNIA SZTUKA
    - TYLKO DZIŚ
    - LIKWIDACJA
  
  nieprofesjonalne:
    - "bez ściemy"
    - "prawie nieużywany"
    - "pilnie sprzedam"
    - "muszę sprzedać"
    - "mega stan"

zakazane_formatowanie:
  - "CAPS LOCK (całe słowa)"
  - "!!!"
  - "???"
  - "***"
  - "---"
  - "Emotikony (wszystkie)"
  - "Znaki dekoracyjne"
```

### 2.6 Przykłady poprawnych i błędnych tytułów

**✅ Poprawne tytuły:**
```
iPhone 13 Pro Max 256GB Górski Błękit Stan Bardzo Dobry
Sofa narożna rozkładana szara 290cm Poznań
Nike Air Max 90 rozmiar 43 Nowe z metką
Samsung Galaxy S22 128GB Stan Idealny Warszawa
Rower Kross Level 5.0 rama L Serwisowany Kraków
MacBook Pro 14 M1 Pro 16GB 512SSD Komplet
Kurtka The North Face 700 rozmiar L Czarna
Stół dębowy rozkładany 160-200cm 6 krzeseł
PlayStation 5 Disc 2 pady 5 gier Gwarancja
```

**❌ Błędne tytuły:**
```
SUPER OKAZJA iPhone tanio!!! (CAPS, słowa marketingowe, !!!)
Sprzedam laptopa (zbyt ogólny, brak konkretów)
📱 iPhone mega promocja (emotikony, słowa marketingowe)
PILNE - muszę sprzedać sofe (CAPS, desperacja, błąd ortograficzny)
Telefon Samsung jak nowy okazja (ogólniki, słowa marketingowe)
Sprzedam buty sportowe (brak marki, rozmiaru, stanu)
LAPTOP DO GIER TANIO!!! (CAPS, marketingowe, !!!)
```

---

## 3. TREŚĆ OGŁOSZENIA

### 3.1 Optymalna struktura treści (8 sekcji)

```
┌─────────────────────────────────────────────────────────────┐
│ 📦 SEKCJA 1: WPROWADZENIE                                   │
│    └─ Nazwa produktu + główna zaleta + lokalizacja          │
├─────────────────────────────────────────────────────────────┤
│ 📋 SEKCJA 2: SPECYFIKACJA TECHNICZNA                        │
│    └─ Wypunktowana lista 4-6 kluczowych parametrów          │
├─────────────────────────────────────────────────────────────┤
│ ✅ SEKCJA 3: STAN PRZEDMIOTU                                │
│    └─ Szczegółowy opis stanu + czas użytkowania + wady      │
├─────────────────────────────────────────────────────────────┤
│ 📎 SEKCJA 4: ZAWARTOŚĆ ZESTAWU                              │
│    └─ Co kupujący otrzyma + dokumenty                       │
├─────────────────────────────────────────────────────────────┤
│ 📍 SEKCJA 5: LOKALIZACJA I ODBIÓR                           │
│    └─ Dokładne miejsce + możliwość sprawdzenia              │
├─────────────────────────────────────────────────────────────┤
│ 🚚 SEKCJA 6: OPCJE DOSTAWY                                  │
│    └─ Wysyłka, Smart!, dostawa własna                       │
├─────────────────────────────────────────────────────────────┤
│ 🛡️ SEKCJA 7: BEZPIECZEŃSTWO                                │
│    └─ Allegro Protect, reputacja, paragon                   │
├─────────────────────────────────────────────────────────────┤
│ 💬 SEKCJA 8: KONTAKT I NEGOCJACJE                           │
│    └─ Szybkość odpowiedzi, elastyczność                     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Parametry treści

| Parametr | Wartość optymalna | Minimum | Maximum |
|----------|-------------------|---------|---------|
| **Liczba słów** | 150-300 | 120 | 400 |
| **Liczba sekcji** | 8 | 6 | 8 |
| **Punkty specyfikacji** | 4-6 | 4 | 8 |
| **Akapity** | 4-6 | 3 | 7 |

### 3.3 Szablon uniwersalny

```markdown
Sprzedaję [PRZEDMIOT] [MARKA] [MODEL] - [GŁÓWNA ZALETA].
Lokalizacja: [MIASTO], [DZIELNICA].

📋 Specyfikacja:
• [parametr 1]: [wartość]
• [parametr 2]: [wartość]
• [parametr 3]: [wartość]
• [parametr 4]: [wartość]
• [parametr 5]: [wartość]

✅ Stan: [STAN]. Używany [CZAS].
[Szczegółowy opis stanu - 2-3 zdania].
[Opis wad jeśli są - dokładna lokalizacja, rozmiar, widoczność].

📦 W zestawie:
• [element 1]
• [element 2]
• [element 3]
• Oryginalne opakowanie: TAK/NIE
• Paragon/faktura: TAK/NIE
• Gwarancja: TAK (do [data]) / NIE

📍 Odbiór osobisty:
• Lokalizacja: [MIASTO], [DZIELNICA] ([punkt orientacyjny])
• Dostępność: [dni tygodnia], godz. [X-Y]
• Możliwość sprawdzenia przed zakupem: TAK

🚚 Opcje dostawy:
• Wysyłka InPost paczkomat: [X] zł
• Wysyłka InPost kurier: [X] zł
• Smart!: TAK/NIE

🛡️ Bezpieczeństwo transakcji:
• Allegro Protect: transakcja chroniona
• Moja reputacja: [X] pozytywnych opinii
• Paragon do wglądu przy odbiorze

💬 Kontakt:
• Odpowiadam na wiadomości w ciągu [X] godzin
• Negocjacje: możliwe przy szybkiej decyzji
• Powód sprzedaży: [krótkie wyjaśnienie]

Zapraszam do kontaktu!
```

### 3.4 Szablony według kategorii

#### Elektronika (telefony, laptopy, tablety)

```markdown
Sprzedaję [URZĄDZENIE] [MARKA] [MODEL] [POJEMNOŚĆ] - [GŁÓWNA ZALETA].
Lokalizacja: [MIASTO], [DZIELNICA].

📋 Specyfikacja:
• Model: [pełna nazwa modelu]
• Pojemność: [GB/TB]
• Kolor: [kolor]
• Stan baterii: [X%] (jeśli dostępne)
• System: [wersja systemu]
• Simlock/iCloud: brak / wylogowane

✅ Stan: [STAN]. Używany [CZAS] jako [służbowy/prywatny].
[Opis stanu ekranu - rysy, pęknięcia lub ich brak].
[Opis stanu obudowy - ślady użytkowania].
[Działanie wszystkich funkcji - aparaty, głośniki, przyciski].
[Wady jeśli są - dokładna lokalizacja i rozmiar].

📦 W zestawie:
• [Urządzenie]
• Ładowarka: ORYGINALNA/ZAMIENNIK/BRAK
• Kabel: TAK/NIE
• Etui: TAK/NIE (jakie)
• Szkło ochronne: TAK/NIE
• Oryginalne pudełko: TAK/NIE
• Paragon/faktura: TAK/NIE

📍 Odbiór osobisty:
• [MIASTO], [DZIELNICA] ([punkt orientacyjny])
• Dostępność: [dni], godz. [X-Y]
• Możliwość pełnego przetestowania przed zakupem

🚚 Wysyłka:
• InPost paczkomat: [X] zł
• InPost kurier: [X] zł
• Smart!: TAK/NIE

🛡️ Bezpieczeństwo:
• Allegro Protect - transakcja chroniona
• [X] pozytywnych opinii na Allegro
• Zakupiony: [gdzie i kiedy]
• Gwarancja producenta: do [data] / brak

💬 Kontakt:
• Odpowiadam szybko - zwykle w ciągu godziny
• Powód sprzedaży: [np. wymiana na nowszy model]
```

#### Odzież i obuwie

```markdown
Sprzedaję [TYP ODZIEŻY] [MARKA] [MODEL/KOLEKCJA] - [GŁÓWNA CECHA].
Lokalizacja: [MIASTO], [DZIELNICA].

📋 Szczegóły:
• Marka: [marka]
• Model/kolekcja: [jeśli dotyczy]
• Rozmiar: [rozmiar producenta] (odpowiada [rozmiar EU/PL])
• Kolor: [kolor]
• Materiał: [skład materiałowy]
• Sezon: [wiosna-lato / jesień-zima / całoroczne]
• Płeć: [damskie/męskie/unisex]

📏 Wymiary (zmierzone na płasko):
• Długość całkowita: [cm]
• Szerokość w biuście/klatce: [cm]
• Szerokość w pasie: [cm]
• Długość rękawa: [cm] (jeśli dotyczy)

✅ Stan: [NOWY Z METKĄ / NOWY BEZ METKI / IDEALNY / BARDZO DOBRY / DOBRY]
[Opis stanu - prane ile razy, noszone jak często].
[Wady jeśli są - plamy, przetarcia, brakujące elementy].

📦 W zestawie:
• [Odzież/obuwie]
• Oryginalne opakowanie: TAK/NIE
• Metki: TAK/NIE
• Dodatkowe elementy: [sznurówki, pasek, etc.]

📍 Odbiór osobisty:
• [MIASTO], [DZIELNICA]
• Możliwość przymierzenia: TAK

🚚 Wysyłka:
• InPost paczkomat: [X] zł
• Smart!: TAK/NIE

💬 Kontakt:
• Powód sprzedaży: [nietrafiony rozmiar / prezent / zmiana stylu]
• Odpowiadam szybko!
```

#### Meble i wyposażenie wnętrz

```markdown
Sprzedaję [TYP MEBLA] [MARKA jeśli dotyczy] - [GŁÓWNA CECHA].
Lokalizacja: [MIASTO], [DZIELNICA].

📋 Szczegóły:
• Typ: [sofa, stół, szafa, komoda, etc.]
• Marka/producent: [marka lub "producent nieznany"]
• Kolor: [kolor]
• Materiał: [drewno lite, płyta, metal, tkanina, skóra]
• Styl: [nowoczesny, klasyczny, skandynawski, industrialny]

📏 Wymiary:
• Szerokość: [cm]
• Głębokość: [cm]
• Wysokość: [cm]
• Wymiary po rozłożeniu: [cm] (jeśli dotyczy)
• Powierzchnia spania: [cm] (jeśli dotyczy)
• Waga przybliżona: [kg]

✅ Stan: [STAN]
[Opis stanu - rysy, odpryski, plamy, przetarcia].
[Historia użytkowania - jak długo, w jakim pomieszczeniu].
[Funkcjonalność - mechanizmy, szuflady, drzwiczki].

📦 W ofercie:
• [Mebel/meble]
• Instrukcja montażu: TAK/NIE
• Elementy montażowe: TAK/NIE (komplet/niekomplet)
• Możliwość demontażu: TAK/NIE

📍 Odbiór osobisty - WYMAGANY:
• [MIASTO], [DZIELNICA] ([ulica/punkt orientacyjny])
• Dostępność: [dni], godz. [X-Y]
• Piętro: [parter/X piętro, winda TAK/NIE]

🚚 Transport:
• Wymaga transportu: [kombi/bus/ciężarówka z windą]
• Pomoc przy załadunku: TAK/NIE
• Możliwość dostawy: TAK (okolice [X] km, cena [Y] zł) / NIE

💬 Kontakt:
• Powód sprzedaży: [przeprowadzka / zmiana wystroju / remont]
• Negocjacje: możliwe przy szybkim odbiorze
```

#### Motoryzacja (części i akcesoria)

```markdown
Sprzedaję [NAZWA CZĘŚCI] do [MARKA] [MODEL] - [GŁÓWNA CECHA].
Lokalizacja: [MIASTO], [DZIELNICA].

📋 Specyfikacja:
• Część: [dokładna nazwa]
• Pasuje do: [marka] [model] [roczniki od-do]
• Numer katalogowy OE: [numer] (jeśli znany)
• Producent części: OEM / ZAMIENNIK [marka]
• Stan: [NOWY / UŻYWANY / REGENEROWANY]

🔧 Szczegóły techniczne:
• [parametr 1]: [wartość]
• [parametr 2]: [wartość]
• [parametr 3]: [wartość]

✅ Stan części:
[Opis stanu - zużycie, uszkodzenia, przebieg na liczniku przy demontażu].
[Pochodzenie - z jakiego auta zdemontowane, przyczyna].
[Gwarancja działania: TAK [okres] / NIE].

📦 W zestawie:
• [Część główna]
• [Elementy dodatkowe - śruby, uszczelki, etc.]

📍 Odbiór osobisty:
• [MIASTO], [DZIELNICA]
• Możliwość sprawdzenia/dopasowania: TAK

🚚 Wysyłka:
• InPost/kurier: [X] zł
• Waga paczki: około [X] kg

💬 Kontakt:
• Podaj VIN auta - sprawdzę kompatybilność
• Odpowiadam szybko!
```

### 3.5 Zasady copywritingu

| Zasada | Opis | Przykład dobry | Przykład zły |
|--------|------|----------------|--------------|
| **Konkretność** | Liczby zamiast ogólników | "Bateria 89%, używany 8 miesięcy" | "Dobra bateria, mało używany" |
| **Lokalizacja na początku** | Miasto/dzielnica w pierwszych zdaniach | "Lokalizacja: Warszawa, Mokotów" | Lokalizacja dopiero na końcu |
| **Szczerość o wadach** | Dokładny opis z lokalizacją | "Rysa 2cm na lewym rogu (zdj.5)" | "Drobne ślady użytkowania" |
| **Język korzyści** | Wartość dla kupującego | "Możliwość sprawdzenia przy odbiorze" | "Sprzedaję jak jest" |
| **Formatowanie** | Nagłówki, listy, emoji | Struktura 8 sekcji z emoji | Ściana tekstu |
| **Elementy zaufania** | Allegro Protect, reputacja | "100 pozytywnych opinii, Allegro Protect" | Brak informacji |

### 3.6 Słowa i frazy zwiększające konwersję

```yaml
slowa_pozytywne:
  stan:
    - "zadbany"
    - "serwisowany"
    - "kompletny"
    - "oryginalny"
    - "sprawny"
    - "gotowy do użycia"
    - "bezawaryjny"
    - "w pełni funkcjonalny"
  
  lokalizacja_i_odbior:
    - "łatwy dojazd"
    - "przy metrze"
    - "parking pod domem"
    - "centrum miasta"
    - "elastyczne godziny"
    - "również w weekend"
    - "mogę dojechać w okolice"
    - "możliwość sprawdzenia"
    - "możliwość przymierzenia"
    - "możliwość przetestowania"
  
  wiarygodnosc:
    - "Allegro Protect"
    - "paragon do wglądu"
    - "faktura do wglądu"
    - "gwarancja producenta"
    - "odpowiadam szybko"
    - "uczciwy opis"
    - "bez niespodzianek"
    - "[X] pozytywnych opinii"
    - "zweryfikowany sprzedawca"
  
  wysylka:
    - "Smart!"
    - "darmowa dostawa" # jeśli dotyczy
    - "szybka wysyłka"
    - "wysyłka tego samego dnia"
    - "starannie zapakowane"
```

### 3.7 Słowa i frazy do unikania

```yaml
zakazane_slowa:
  marketingowe:
    - "okazja"
    - "tanio"
    - "super"
    - "mega"
    - "hit"
    - "wyprzedaż"
    - "promocja"
  
  nieokreslone:
    - "prawie nowy"
    - "jak ze sklepu"
    - "mega stan"
    - "mało używany"
    - "w dobrym stanie" # bez szczegółów
  
  desperacja:
    - "pilnie sprzedam"
    - "muszę sprzedać"
    - "pilne"
    - "szybko"
  
  nieprofesjonalne:
    - "bez ściemy"
    - "bez kitu"
    - "serio"
    - "naprawdę"
    - "uczciwie mówiąc" # sugeruje nieuczciwość w innych przypadkach
```

---

## 4. STRATEGIA CENOWA

### 4.1 Formuła wyceny używanych produktów

```
CENA = (Cena_nowego × Wsp_stanu × Wsp_wieku) - Wady + Dodatki × Wsp_kompletności × Wsp_reputacji
```

### 4.2 Współczynniki stanu

| Stan | Współczynnik | Opis |
|------|--------------|------|
| **Nowy zapakowany** | 0.90 - 0.98 | Fabrycznie nowy, nieotwierany |
| **Nowy rozpakowany** | 0.80 - 0.90 | Nieużywany, otwarte opakowanie |
| **Idealny** | 0.65 - 0.80 | Minimalne ślady, niewidoczne gołym okiem |
| **Bardzo dobry** | 0.50 - 0.65 | Drobne ślady widoczne przy dokładnym oglądaniu |
| **Dobry** | 0.35 - 0.50 | Wyraźne ślady użytkowania, pełna funkcjonalność |
| **Dostateczny** | 0.20 - 0.35 | Znaczne ślady, możliwe drobne usterki |
| **Do naprawy** | 0.05 - 0.20 | Wymaga naprawy, na części |

### 4.3 Współczynniki wieku

| Wiek produktu | Współczynnik standardowy | Współczynnik elektronika |
|---------------|--------------------------|--------------------------|
| **< 1 miesiąc** | 1.00 | 1.00 |
| **1-3 miesiące** | 0.97 | 0.95 |
| **3-6 miesięcy** | 0.93 | 0.88 |
| **6-12 miesięcy** | 0.88 | 0.78 |
| **1-2 lata** | 0.78 | 0.62 |
| **2-3 lata** | 0.65 | 0.48 |
| **3-5 lat** | 0.50 | 0.32 |
| **> 5 lat** | 0.35 | 0.18 |

### 4.4 Współczynniki dodatkowe

```yaml
wspolczynnik_kompletnosci:
  pelny_zestaw_pudelko: 1.10 # +10% do ceny
  pelny_zestaw_bez_pudelka: 1.05
  podstawowy_zestaw: 1.00
  brak_akcesoriow: 0.90
  sam_produkt: 0.85

wspolczynnik_reputacji:
  super_sprzedawca: 1.08 # +8% do ceny
  powyzej_100_opinii: 1.05
  50_100_opinii: 1.03
  10_50_opinii: 1.00
  ponizej_10_opinii: 0.97
  brak_opinii: 0.93
```

### 4.5 Przykład kalkulacji

```
Produkt: MacBook Pro 14" M1 Pro 16GB 512SSD
Cena nowego: 11 999 zł

Parametry:
- Stan: Bardzo dobry (współczynnik: 0.58)
- Wiek: 18 miesięcy (współczynnik: 0.70)
- Wady: Drobna wgniotka na obudowie (-200 zł)
- Dodatki: Oryginalne pudełko + ładowarka (kompletność: 1.05)
- Reputacja: 85 pozytywnych opinii (współczynnik: 1.03)

OBLICZENIE:
Cena bazowa = 11 999 × 0.58 × 0.70 = 4 871 zł
Po wadach = 4 871 - 200 = 4 671 zł
Po kompletności = 4 671 × 1.05 = 4 905 zł
Po reputacji = 4 905 × 1.03 = 5 052 zł

Zaokrąglenie psychologiczne: 4 999 zł
Z marginesem negocjacji (+10%): 5 499 zł
```

### 4.6 Psychologia cen

| Zakres cenowy | Końcówka optymalna | Przykłady |
|---------------|-------------------|-----------|
| 1-50 zł | -5, -9 | 25 zł, 39 zł, 49 zł |
| 50-200 zł | -9, -99 | 89 zł, 149 zł, 199 zł |
| 200-1000 zł | -9, -99 | 299 zł, 499 zł, 799 zł, 899 zł |
| 1000-5000 zł | -99, -999 | 1 299 zł, 1 999 zł, 2 499 zł, 3 999 zł |
| > 5000 zł | -999, -00 | 5 999 zł, 7 499 zł, 9 999 zł |

### 4.7 Strategia analizy konkurencji

```yaml
procedura_analizy:
  krok_1:
    akcja: "Wyszukaj identyczny produkt na Allegro Lokalnie"
    parametry:
      - "Ten sam model"
      - "Podobny stan"
      - "Ta sama lub bliska lokalizacja"
    minimum_probek: 5
  
  krok_2:
    akcja: "Wyszukaj na głównym Allegro (porównanie do nowych)"
    cel: "Ustalenie ceny referencyjnej nowego produktu"
    uwaga: "Ceny nowych wyznaczają górny limit"
  
  krok_3:
    akcja: "Sprawdź zakończone aukcje (sprzedane)"
    cel: "Realne ceny transakcyjne"
    waga: "Najważniejszy wskaźnik"
  
  krok_4:
    akcja: "Porównaj ze sklepami internetowymi"
    cel: "Benchmark cenowy rynku"
    zrodla: ["Ceneo", "Allegro", "sklepy producenta"]
  
  krok_5:
    akcja: "Określ pozycję cenową"
    strategie:
      szybka_sprzedaz: "Dolne 20% zakresu cen"
      zbalansowana: "Mediana minus 5%"
      maksymalny_zysk: "Górne 30% zakresu"
```

### 4.8 Margines negocjacji

| Strategia | Margines | Kiedy stosować |
|-----------|----------|----------------|
| **Szybka sprzedaż** | 5-8% | Pilna potrzeba gotówki, pozbycie się przedmiotu |
| **Standard** | 10-15% | Większość ogłoszeń |
| **Premium** | 15-20% | Unikalne produkty, wysoka reputacja |
| **Cena finalna** | 0% | Już niska cena, brak miejsca na negocjacje |

### 4.9 Czerwone flagi cenowe

```yaml
czerwone_flagi:
  cena_za_niska:
    definicja: "Cena >40% poniżej rynku bez wyjaśnienia"
    skutek: "Kupujący podejrzewają oszustwo, kradzież lub ukryte wady"
    rozwiazanie: "Podnieś cenę lub szczegółowo wyjaśnij powód w opisie"
  
  cena_za_wysoka:
    definicja: "Cena >25% powyżej mediany rynkowej"
    skutek: "Brak zainteresowania, długi czas sprzedaży"
    rozwiazanie: "Obniż cenę lub dodaj wartość (darmowa wysyłka, bonusy)"
  
  cena_niestabilna:
    definicja: "Częste zmiany ceny w górę i dół"
    skutek: "Kupujący czekają na dalsze obniżki, utrata wiarygodności"
    rozwiazanie: "Obniżaj cenę tylko w dół, stopniowo, max co 5-7 dni"
  
  brak_ceny:
    definicja: "Ogłoszenie bez konkretnej ceny"
    skutek: "Niższy CTR, mniej poważnych kupujących"
    rozwiazanie: "Zawsze podawaj konkretną cenę"
```

---

## 5. ZDJĘCIA PRODUKTU

### 5.1 Wymagania techniczne

| Parametr | Minimum | Optimum | Maximum |
|----------|---------|---------|---------|
| **Liczba zdjęć** | 3 | 8-10 | 16 |
| **Rozdzielczość** | 800×600 px | 1200×900 px | 4096×4096 px |
| **Rozmiar pliku** | 100 KB | 500 KB - 1.5 MB | 10 MB |
| **Format** | JPG | JPG, PNG | JPG, PNG, WEBP |
| **Proporcje** | 4:3 | 4:3, 1:1 | 16:9 |

### 5.2 Strategiczna kolejność zdjęć

```
ZDJĘCIE 1 - MINIATURA (NAJWAŻNIEJSZE):
├── Produkt w całości
├── Najlepsza perspektywa (lekko z góry, pod kątem 30-45°)
├── Jasne, neutralne tło (białe, szare, drewniane)
├── Produkt zajmuje 70-80% kadru
├── Wysokiej jakości - decyduje o kliknięciu!
└── Optymalizowane pod Facebook Marketplace [8]

ZDJĘCIE 2:
├── Zbliżenie na logo/markę/etykietę
└── Potwierdza autentyczność

ZDJĘCIE 3:
├── Druga perspektywa (tył)
└── Pokazuje pełny kształt

ZDJĘCIE 4:
├── Trzecia perspektywa (bok lub spód)
└── Kompletny obraz produktu

ZDJĘCIE 5:
├── Szczegóły/cechy wyróżniające
└── Detale wykończenia, funkcje, przyciski, porty

ZDJĘCIE 6 - WADY (OBOWIĄZKOWE jeśli są!):
├── Zbliżenie na wadę/uszkodzenie
├── Dobrze oświetlone
├── Referencja rozmiaru (np. moneta, linijka)
└── NIGDY nie ukrywaj wad!

ZDJĘCIE 7:
├── Zestaw/akcesoria
└── Wszystko co kupujący otrzyma, rozłożone

ZDJĘCIE 8:
├── Skala/kontekst użycia
└── Produkt przy dłoni, na osobie, w pomieszczeniu

ZDJĘCIE 9:
├── Dokumenty (opcjonalnie)
└── Paragon, gwarancja, certyfikat (zamazane dane osobowe)

ZDJĘCIE 10:
├── Dodatkowe ujęcia
└── Cokolwiek wartościowego dla kupującego
```

### 5.3 Specyfikacje zdjęć według kategorii

#### Elektronika
```yaml
elektronika:
  zdjecie_1: "Przód urządzenia, ekran włączony jeśli możliwe"
  zdjecie_2: "Logo producenta, numer modelu"
  zdjecie_3: "Tył urządzenia (aparaty, etykieta)"
  zdjecie_4: "Boki - porty, przyciski, sloty"
  zdjecie_5: "Ekran z bliska - stan wyświetlacza"
  zdjecie_6: "Screenshot stanu baterii / informacji systemowych"
  zdjecie_7: "WADY jeśli są - zbliżenie na rysę/uszkodzenie"
  zdjecie_8: "Cały zestaw rozłożony"
  zdjecie_9: "Oryginalne pudełko"
  zdjecie_10: "Paragon/faktura (zamazane dane)"
```

#### Odzież i obuwie
```yaml
odziez:
  zdjecie_1: "Na wieszaku lub manekinie - przód, całość"
  zdjecie_2: "Tył - całość"
  zdjecie_3: "Metka rozmiaru - zbliżenie"
  zdjecie_4: "Metka składu materiału"
  zdjecie_5: "Zbliżenie na materiał/fakturę"
  zdjecie_6: "Detale - guziki, zamek, nadruk, haft"
  zdjecie_7: "WADY jeśli są - plamy, przetarcia"
  zdjecie_8: "Na osobie (opcjonalnie) - pokazuje fason"
  zdjecie_9: "Oryginalne opakowanie jeśli jest"
```

#### Meble
```yaml
meble:
  zdjecie_1: "Całość z przodu - główna perspektywa"
  zdjecie_2: "Całość z boku"
  zdjecie_3: "Całość z tyłu lub z góry"
  zdjecie_4: "Zbliżenie na materiał/wykończenie"
  zdjecie_5: "Detale - uchwyty, nogi, zawiasy, mechanizmy"
  zdjecie_6: "Wnętrze (szafy, komody, szuflady)"
  zdjecie_7: "WADY - rysy, odpryski, plamy"
  zdjecie_8: "Mebel w kontekście pomieszczenia (skala)"
  zdjecie_9: "Po rozłożeniu (jeśli rozkładany)"
  zdjecie_10: "Etykieta producenta jeśli jest"
```

#### Motoryzacja (części)
```yaml
motoryzacja:
  zdjecie_1: "Część z przodu - główna perspektywa"
  zdjecie_2: "Numer katalogowy / oznaczenie OE"
  zdjecie_3: "Część z drugiej strony"
  zdjecie_4: "Zbliżenie na stan - zużycie, rdza"
  zdjecie_5: "Miejsca montażowe / gwinty"
  zdjecie_6: "WADY - uszkodzenia, zużycie"
  zdjecie_7: "Porównanie z nową częścią (opcjonalnie)"
  zdjecie_8: "Etykieta/naklejka informacyjna"
```

### 5.4 Wymagania dotyczące tła i oświetlenia

```yaml
tlo:
  idealne:
    - "Jednolite białe (folia, karton, ściana)"
    - "Jednolite szare"
    - "Jasne drewno (naturalne)"
  akceptowalne:
    - "Czyste, neutralne biurko"
    - "Jednolity dywan"
    - "Ściana bez wzoru"
  zabronione:
    - "Bałagan w tle"
    - "Inne przedmioty niezwiązane z ofertą"
    - "Wzorzyste tła (kratka, kwiaty, etc.)"
    - "Lustrzane odbicia z osobą fotografującą"
    - "Łóżko, pościel (nieprofesjonalne)"

oswietlenie:
  idealne:
    - "Naturalne światło dzienne"
    - "Rozproszone (pochmurny dzień lub przy oknie z firanką)"
    - "Softbox lub lampa LED z dyfuzorem"
  akceptowalne:
    - "Sztuczne oświetlenie LED (5000-6500K, białe)"
    - "Lampa biurkowa (unikaj cieni)"
  zabronione:
    - "Bezpośrednie ostre słońce (twarde cienie, prześwietlenia)"
    - "Żółte światło żarówek żarowych (2700K)"
    - "Ciemne pomieszczenie z lampą błyskową"
    - "Podświetlenie od tyłu (sylwetka)"
```

### 5.5 Elementy zakazane na zdjęciach

```yaml
zabronione:
  pochodzenie:
    - "Zdjęcia stockowe / profesjonalne"
    - "Zdjęcia z internetu / innych ogłoszeń"
    - "Zdjęcia katalogowe producenta"
    - "Screenshoty z innych platform"
    - "Zdjęcia z logo innych serwisów (OLX, Vinted)"
  
  edycja:
    - "Filtry znacząco zmieniające kolor"
    - "Nadmierna edycja / retusz usuwający wady"
    - "Kolaże wielu zdjęć w jednym"
    - "Tekst / napisy / banery reklamowe"
    - "Ramki dekoracyjne"
    - "Znaki wodne innych firm"
  
  techniczne:
    - "Rozmazane / nieostre"
    - "Zbyt ciemne (niedoświetlone)"
    - "Prześwietlone (przepalone)"
    - "Produkt zajmuje <50% kadru"
    - "Zły kadr (ucięty produkt)"
  
  zawartosc:
    - "Twarze osób (RODO, prywatność)"
    - "Dane osobowe czytelne (adres, PESEL)"
    - "Numery rejestracyjne pojazdów"
    - "Dzieci"
    - "Zwierzęta (chyba że sprzedajesz akcesoria dla nich)"
    - "Treści nieodpowiednie"
```

---

## 6. ATRYBUTY, KATEGORIE I WIDOCZNOŚĆ

### 6.1 Znaczenie atrybutów

```yaml
wplyw_atrybutow:
  kompletnosc_100_procent:
    efekt: "+40-50% widoczności w wyszukiwarce"
    powod: "Algorytm Allegro promuje kompletne ogłoszenia"
  
  filtry_wyszukiwania:
    efekt: "Pojawienie się w wynikach filtrowanych"
    powod: "Kupujący często używają filtrów (marka, rozmiar, stan)"
  
  porownywarki:
    efekt: "Możliwość porównania z innymi ofertami"
    powod: "Oficjalne nazwy modeli = lepsza identyfikacja"
```

### 6.2 Wybór kategorii

```yaml
zasady_kategoryzacji:
  zasada_1:
    opis: "Wybierz NAJDOKŁADNIEJSZĄ podkategorię"
    zle: "Elektronika"
    dobrze: "Elektronika → Telefony i Akcesoria → Smartfony → Apple → iPhone 13"
  
  zasada_2:
    opis: "Nie umieszczaj w złej kategorii dla większego zasięgu"
    powod: "Kupujący szukają w konkretnych kategoriach"
    skutek: "Niższa konwersja, możliwe usunięcie ogłoszenia"
  
  zasada_3:
    opis: "Sprawdź gdzie konkurencja umieszcza podobne produkty"
    metoda: "Wyszukaj produkt → zobacz kategorie wyników"
```

### 6.3 Atrybuty według kategorii

#### Elektronika
```yaml
elektronika_atrybuty:
  wymagane:
    - marka
    - model
    - stan
  bardzo_wazne:
    - pojemnosc_pamieci
    - kolor
    - system_operacyjny
  wazne:
    - rok_produkcji
    - przekatna_ekranu
    - rozdzielczosc
```

#### Odzież
```yaml
odziez_atrybuty:
  wymagane:
    - marka
    - rozmiar
    - stan
    - plec
  bardzo_wazne:
    - kolor
    - material
    - typ_odziezi
  wazne:
    - sezon
    - styl
    - dlugosc_rekawa
```

#### Meble
```yaml
meble_atrybuty:
  wymagane:
    - typ_mebla
    - stan
  bardzo_wazne:
    - material
    - kolor
    - szerokosc
    - wysokosc
    - glebokosc
  wazne:
    - marka
    - styl
    - pomieszczenie
```

#### Motoryzacja
```yaml
motoryzacja_atrybuty:
  wymagane:
    - kategoria_czesci
    - marka_samochodu
    - model_samochodu
    - stan
  bardzo_wazne:
    - rocznik_od
    - rocznik_do
    - numer_katalogowy
    - producent_czesci
  wazne:
    - strona_montazu
    - wersja_silnika
```

### 6.4 Opcje dostawy

| Opcja | Opis | Wpływ na widoczność |
|-------|------|---------------------|
| **Odbiór osobisty** | Główna metoda na Allegro Lokalnie | Bazowy, wymagany |
| **Wysyłka własna** | InPost, kurier, poczta | +20% zasięgu |
| **Smart!** | Darmowa dostawa dla użytkowników Smart! | +30-40% zasięgu |
| **Dostawa własna** | Dla mebli, dużych przedmiotów | +10% lokalnie |

```yaml
konfiguracja_dostawy:
  odbior_osobisty:
    status: "ZAWSZE włączony"
    lokalizacja: "Dokładna - miasto, dzielnica, punkt orientacyjny"
    dostepnosc: "Określone dni i godziny"
  
  wysylka:
    inpost_paczkomat:
      zalecane: true
      popularnosc: "Najwyższa w Polsce"
    inpost_kurier:
      zalecane: true
      dla: "Większe paczki"
    poczta_polska:
      zalecane: false
      powod: "Dłuższy czas, mniej popularny"
  
  smart:
    warunek: "Kwalifikujący się sprzedawcy"
    korzysc: "Darmowa dostawa dla kupujących Smart!"
    efekt: "Znacząco wyższa konwersja"
```

### 6.5 Integracja z Facebook Marketplace [8]

```yaml
facebook_marketplace:
  opis: "Ogłoszenia z Allegro Lokalnie automatycznie widoczne na FB Marketplace"
  
  aktywacja:
    lokalizacja: "Ustawienia ogłoszenia"
    opcja: "Pokaż na Facebook Marketplace"
    zalecenie: "ZAWSZE włączone"
  
  efekt:
    zasieg: "+200-400% dodatkowego zasięgu lokalnego"
    widocznosc: "Ogłoszenie pojawia się na FB Marketplace"
    kontakt: "Przez Allegro Lokalnie (nie Messenger)"
  
  optymalizacja:
    tytul: "Musi być zrozumiały dla użytkowników FB"
    zdjecie_1: "Szczególnie atrakcyjne - miniatura na FB"
    jezyk: "Prostszy, mniej techniczny"
    lokalizacja: "Kluczowa dla zasięgu"
  
  ograniczenia:
    - "Nie wszystkie kategorie obsługiwane"
    - "FB pokazuje głównie pierwsze 4-5 zdjęć"
    - "Kontakt tylko przez Allegro"
```

---

## 7. SYSTEM REPUTACJI I BEZPIECZEŃSTWO

### 7.1 System ocen na Allegro Lokalnie

```yaml
system_ocen:
  skladowe:
    liczba_opinii:
      wplyw: "Wysoki"
      cel: "Im więcej, tym lepiej"
    srednia_ocena:
      wplyw: "Bardzo wysoki"
      cel: "Minimum 4.8/5.0"
    procent_pozytywnych:
      wplyw: "Wysoki"
      cel: "Minimum 98%"
  
  przenoszenie_reputacji:
    zrodlo: "Główne konto Allegro"
    zakres: "Oceny i historia transakcji"
    korzysc: "Natychmiastowe zaufanie na Allegro Lokalnie"
  
  status_super_sprzedawca:
    wymagania:
      - "Minimum ocen w okresie"
      - "Wysoki procent pozytywnych"
      - "Terminowe wysyłki"
      - "Szybkie odpowiedzi"
    korzysci:
      - "Badge Super Sprzedawca"
      - "Wyższa pozycja w wynikach"
      - "Większe zaufanie kupujących"
      - "Możliwość wyższych cen (+5-10%)"
```

### 7.2 Allegro Protect

```yaml
allegro_protect:
  dla_kupujacego:
    - "Gwarancja zwrotu pieniędzy"
    - "Ochrona przed oszustwem"
    - "Pomoc w sporach"
    - "Bezpieczna płatność"
  
  dla_sprzedajacego:
    - "Ochrona przed nieuczciwymi roszczeniami"
    - "Bezpieczne otrzymanie płatności"
    - "Mediacja w sporach"
  
  komunikacja_w_ogloszeniu:
    gdzie: "Sekcja Bezpieczeństwo"
    jak: "Transakcja chroniona Allegro Protect"
    efekt: "Zwiększa zaufanie i konwersję"
```

### 7.3 Budowanie pozytywnych ocen

```yaml
przed_transakcja:
  - "Szczegółowy, uczciwy opis"
  - "Wysokiej jakości zdjęcia"
  - "Szybka odpowiedź na pytania (<2h)"
  - "Profesjonalna komunikacja"

podczas_transakcji:
  - "Punktualność na spotkanie (odbiór osobisty)"
  - "Produkt zgodny z opisem"
  - "Szybka wysyłka (tego samego/następnego dnia)"
  - "Staranne pakowanie"

po_transakcji:
  - "Wiadomość z podziękowaniem"
  - "Prośba o wystawienie opinii"
  - "Szybka reakcja na ewentualne problemy"
```

---

## 8. OPTYMALIZACJA DLA ALGORYTMU ALLEGRO

### 8.1 Czynniki rankingowe

| Czynnik | Wpływ | Jak optymalizować |
|---------|-------|-------------------|
| **Trafność tytułu** | +35% | Słowa kluczowe na początku, oficjalne nazwy |
| **Kompletność atrybutów** | +30% | 100% wypełnionych pól |
| **Jakość zdjęć** | +25% | 8+ zdjęć, wysoka rozdzielczość |
| **Cena konkurencyjna** | +20% | Dolne 30% zakresu rynkowego |
| **Responsywność** | +20% | Odpowiedzi <2h |
| **Reputacja** | +15% | Wysoka ocena, dużo opinii |
| **Opcje dostawy** | +15% | Smart!, wysyłka + odbiór |
| **Świeżość** | +10% | Regularna aktywność |

### 8.2 Strategia optymalizacji

```yaml
codziennie:
  - "Sprawdź wiadomości i odpowiedz <2h"
  - "Monitoruj statystyki ogłoszenia"

co_3_5_dni:
  - "Drobna edycja opisu (odświeżenie)"
  - "Sprawdź konkurencję - czy cena aktualna?"

co_tydzien:
  - "Analiza: wyświetlenia vs kontakty"
  - "Jeśli mało kontaktów - rozważ obniżkę ceny"
  - "Dodaj/zmień zdjęcie jeśli potrzebne"

co_2_tygodnie:
  - "Głębsza analiza - czy ogłoszenie działa?"
  - "Porównanie z konkurencją"
  - "Decyzja: kontynuować / zmienić strategię / usunąć"
```

### 8.3 Sygnały wymagające reakcji

```yaml
sygnaly_ostrzegawcze:
  niskie_wysiwetlenia:
    przyczyna: "Słaby tytuł, zła kategoria, nieatrakcyjne zdjęcie główne"
    rozwiazanie: "Popraw tytuł, sprawdź kategorię, zmień zdjęcie 1"
  
  wysiwetlenia_bez_kontaktow:
    przyczyna: "Za wysoka cena, słaby opis, mało zdjęć"
    rozwiazanie: "Obniż cenę, rozbuduj opis, dodaj zdjęcia"
  
  kontakty_bez_sprzedazy:
    przyczyna: "Zbyt mały margines negocjacji, problemy z odbiorem"
    rozwiazanie: "Bądź bardziej elastyczny cenowo, ułatw odbiór"
  
  negatywne_opinie:
    przyczyna: "Produkt niezgodny z opisem, problemy z komunikacją"
    rozwiazanie: "Popraw opisy, bądź bardziej responsywny, rozwiązuj problemy"
```

---

## 9. CHECKLIST PRZED PUBLIKACJĄ

### 9.1 Kompletny checklist

```yaml
tytul:
  - [ ] Zawiera markę i model
  - [ ] Słowa kluczowe na początku
  - [ ] Długość 50-75 znaków
  - [ ] Bez CAPS LOCK
  - [ ] Bez "!!!", "???", emotikon
  - [ ] Bez słów: OKAZJA, TANIO, PILNE, SUPER
  - [ ] Konkretny parametr (rozmiar/pojemność/rok)
  - [ ] Lokalizacja (opcjonalnie, zalecane)

tresc:
  - [ ] 8 sekcji (struktura kompletna)
  - [ ] 150-300 słów
  - [ ] Specyfikacja 4-6 punktów
  - [ ] Szczegółowy opis stanu
  - [ ] Wady opisane (jeśli są)
  - [ ] Zawartość zestawu
  - [ ] Lokalizacja i opcje odbioru
  - [ ] Opcje dostawy (wysyłka, Smart!)
  - [ ] Elementy bezpieczeństwa (Allegro Protect)
  - [ ] Kontakt i szybkość odpowiedzi
  - [ ] Powód sprzedaży
  - [ ] Formatowanie (nagłówki, listy, emoji)

cena:
  - [ ] Sprawdzona konkurencja na Allegro Lokalnie
  - [ ] Sprawdzona konkurencja na głównym Allegro
  - [ ] Realistyczna wycena (formuła)
  - [ ] Margines negocjacji 10-15%
  - [ ] Psychologia cen (końcówka 9 lub 99)
  - [ ] Opcja "do negocjacji" zaznaczona

zdjecia:
  - [ ] Minimum 6 zdjęć (optimum 8-10)
  - [ ] Zdjęcie 1 = atrakcyjna miniatura
  - [ ] Jasne tło, dobre oświetlenie
  - [ ] Różne perspektywy (przód, tył, bok)
  - [ ] Zbliżenie na markę/etykietę
  - [ ] WADY pokazane (jeśli są!)
  - [ ] Zestaw/akcesoria
  - [ ] Własne zdjęcia (nie z internetu)
  - [ ] Rozdzielczość min. 1024×768
  - [ ] Bez filtrów, napisów, logo innych platform

atrybuty:
  - [ ] 100% atrybutów wypełnionych
  - [ ] Najdokładniejsza kategoria wybrana
  - [ ] Stan przedmiotu prawidłowy
  - [ ] Marka i model wpisane poprawnie

dostawa_i_lokalizacja:
  - [ ] Odbiór osobisty włączony
  - [ ] Lokalizacja dokładna (miasto + dzielnica)
  - [ ] Wysyłka skonfigurowana (jeśli możliwa)
  - [ ] Smart! włączone (jeśli dostępne)
  - [ ] Facebook Marketplace włączone

bezpieczenstwo:
  - [ ] Allegro Protect wspomniane w opisie
  - [ ] Reputacja wspomniana (jeśli dobra)
  - [ ] Paragon/faktura wspomniane (jeśli dostępne)
```

### 9.2 System punktacji jakości

```yaml
system_punktacji:
  tytul: # 15 punktów
    marka_i_model: 6
    slowa_kluczowe_na_poczatku: 4
    optymalna_dlugosc: 3
    brak_zakazanych_elementow: 2
  
  tresc: # 30 punktów
    struktura_8_sekcji: 10
    szczegolowy_opis_stanu: 6
    opis_wad: 4
    elementy_bezpieczenstwa: 4
    opcje_dostawy: 4
    formatowanie: 2
  
  cena: # 15 punktów
    analiza_konkurencji: 6
    zgodnosc_z_formula: 4
    psychologia_cen: 3
    margines_negocjacji: 2
  
  zdjecia: # 25 punktów
    liczba_min_6: 6
    miniatura_atrakcyjna: 6
    pokazane_wady: 5
    roznorodnosc_perspektyw: 4
    jakosc_techniczna: 4
  
  atrybuty: # 15 punktów
    kompletnosc_100: 8
    kategoria_dokladna: 4
    facebook_marketplace: 3

progi_jakosci:
  excellent: "90-100 punktów"
  good: "75-89 punktów"
  acceptable: "60-74 punktów"
  needs_improvement: "<60 punktów"
```

---

## 10. OBSŁUGA BŁĘDÓW I PRZYPADKI SPECJALNE

### 10.1 Brak informacji od użytkownika

```yaml
brakujace_informacje:
  marka_nieznana:
    akcja: "Użyj 'bez marki' lub opisz cechy charakterystyczne"
    tytul_wzor: "[TYP] + [CECHA] + [WYMIAR/ROZMIAR]"
    przyklad: "Kurtka zimowa puchowa czarna rozmiar L"
  
  model_nieznany:
    akcja: "Pomiń model, skup się na typie i parametrach"
    przyklad: "Samsung smartfon 128GB czarny" (bez modelu)
  
  cena_nieznana:
    akcja: "Wyszukaj podobne na Allegro Lokalnie i głównym Allegro"
    fallback: "Zapytaj użytkownika o oczekiwany zakres cenowy"
  
  stan_nieopisany:
    akcja: "OBOWIĄZKOWE - zapytaj użytkownika"
    pytania:
      - "Czy są widoczne ślady użytkowania?"
      - "Czy wszystko działa prawidłowo?"
      - "Jak długo przedmiot był używany?"
      - "Czy są jakiekolwiek wady lub uszkodzenia?"
  
  lokalizacja_nieznana:
    akcja: "OBOWIĄZKOWE - zapytaj użytkownika"
    znaczenie: "Kluczowe dla Allegro Lokalnie"
    pytanie: "Podaj miasto i dzielnicę do odbioru osobistego"
  
  brak_zdjec:
    akcja: "NIE publikuj bez zdjęć"
    minimum: "3 zdjęcia"
    komunikat: "Proszę o dodanie minimum 3 własnych zdjęć produktu"
```

### 10.2 Produkty specjalne

```yaml
produkty_specjalne:
  antyki_vintage:
    cena: "Nie stosuj standardowej formuły deprecjacji"
    wycena: "Sprawdź aukcje kolekcjonerskie, portale specjalistyczne"
    opis: "Podkreśl wiek jako zaletę, historię, proweniencję"
    zdjecia: "Pokaż patynę, znaki autentyczności"
  
  kolekcjonerskie:
    cena: "Ceny rynkowe mogą znacząco przewyższać cenę nowego"
    wycena: "Sprawdź zakończone aukcje, fora kolekcjonerskie"
    opis: "Stan zachowania kluczowy, certyfikaty, pudełka"
    zdjecia: "Detale, oznaczenia, certyfikaty autentyczności"
  
  uszkodzone:
    cena: "10-25% wartości sprawnego produktu"
    tytul: "OBOWIĄZKOWO dodaj 'uszkodzony' lub 'do naprawy' lub 'na części'"
    opis: "Szczegółowo opisz usterkę i szacunkowy koszt naprawy"
    zdjecia: "OBOWIĄZKOWO pokaż uszkodzenie z bliska"
  
  zestawy_bundle:
    cena: "Suma wartości elementów - 10-20% rabatu"
    tytul: "Użyj 'ZESTAW' lub 'KOMPLET' lub 'X elementów'"
    opis: "Wymień każdy element osobno z przybliżoną wartością"
    zdjecia: "Wszystkie elementy razem + osobno najważniejsze"
  
  czesci_samochodowe:
    kompatybilnosc: "KLUCZOWA - podaj dokładne roczniki i wersje"
    numer_oe: "Podaj numer katalogowy jeśli dostępny"
    opis: "Zaoferuj sprawdzenie VIN przed zakupem"
    zdjecia: "Pokaż numery, oznaczenia, stan techniczny"
```

### 10.3 Sytuacje problematyczne

```yaml
sytuacje_problematyczne:
  produkt_falszywy_podrobka:
    akcja: "NIE wystawiaj"
    powod: "Nielegalne, usunięcie ogłoszenia, blokada konta"
  
  produkt_bez_dokumentow:
    akcja: "Wyraźnie zaznacz w opisie"
    opis: "Brak paragonu/faktury, pochodzenie: [źródło]"
  
  produkt_kradziez:
    akcja: "NIE wystawiaj"
    powod: "Przestępstwo, konsekwencje prawne"
  
  produkt_po_gwarancji:
    akcja: "Wyraźnie zaznacz"
    opis: "Gwarancja producenta zakończona [data]"
  
  produkt_importowany:
    akcja: "Zaznacz specyfikę"
    opis: "Wersja [region], może różnić się [szczegóły]"
```

---

## 11. PRZYKŁADY KOMPLETNYCH OGŁOSZEŃ

### 11.1 Przykład: Smartfon

**Tytuł:**
```
iPhone 13 Pro 256GB Górski Błękit Stan Bardzo Dobry Warszawa
```

**Treść:**
```markdown
Sprzedaję iPhone 13 Pro 256GB w kolorze Górski Błękit - świetny aparat, płynne działanie.
Lokalizacja: Warszawa, Mokotów (okolice metra Wilanowska).

📋 Specyfikacja:
• Model: iPhone 13 Pro (A2638)
• Pojemność: 256GB
• Kolor: Sierra Blue (Górski Błękit)
• Stan baterii: 87% (pokazane na zdjęciu 6)
• System: iOS 17.4 (najnowszy)
• Simlock: BRAK - działa ze wszystkimi operatorami
• iCloud: wylogowane, gotowy do konfiguracji

✅ Stan: BARDZO DOBRY
Używany 16 miesięcy jako telefon prywatny. Zawsze w etui i ze szkłem ochronnym.
• Ekran: idealny, bez żadnych rys
• Obudowa: drobne ślady na ramce (mikrokratki widoczne pod światło)
• Plecki: bez rys
• Wszystkie funkcje sprawne: Face ID, aparaty (wszystkie 3), głośniki, mikrofony
Na zdjęciu 7 widoczne drobne ślady na ramce (trzeba szukać).

📦 W zestawie:
• iPhone 13 Pro 256GB
• Oryginalne pudełko
• Kabel USB-C do Lightning (nowy, nieużywany)
• Ładowarka 20W (zamiennik, używana)
• Etui Apple Silicone Case (Midnight) - stan dobry
• Szkło hartowane (nowe, w opakowaniu)
• Paragon z Media Expert (do wglądu)

📍 Odbiór osobisty:
• Warszawa, Mokotów - okolice metra Wilanowska
• Dostępność: pon-pt 17-20, sobota 10-18
• Możliwość pełnego sprawdzenia i przetestowania przed zakupem
• Chętnie pokażę historię baterii, sprawność aparatów, etc.

🚚 Opcje dostawy:
• InPost paczkomat: 15 zł (wysyłka tego samego dnia do 14:00)
• InPost kurier: 18 zł
• Smart!: TAK - darmowa dostawa dla użytkowników Smart!

🛡️ Bezpieczeństwo transakcji:
• Allegro Protect - transakcja w pełni chroniona
• Moja reputacja: 127 pozytywnych opinii (100%)
• Paragon z Media Expert z datą zakupu 15.10.2022

💬 Kontakt:
• Odpowiadam na wiadomości zwykle w ciągu 30-60 minut
• Negocjacje: możliwe przy szybkiej decyzji
• Powód sprzedaży: przesiadka na iPhone 15 Pro Max

Zapraszam do kontaktu - chętnie odpowiem na wszystkie pytania!
```

**Cena:** 2 899 zł (do negocjacji)

---

### 11.2 Przykład: Meble

**Tytuł:**
```
Sofa narożna rozkładana szara 290cm pojemnik Poznań Grunwald
```

**Treść:**
```markdown
Sprzedaję wygodną sofę narożną z funkcją spania i dużym pojemnikiem na pościel.
Lokalizacja: Poznań, Grunwald (ul. Głogowska, okolice Parku Wilsona).

📋 Szczegóły:
• Typ: Sofa narożna z funkcją spania
• Kolor: Szary melanż
• Materiał obicia: Tkanina plamoodporna (łatwa w czyszczeniu)
• Wypełnienie: Pianka T25 + sprężyny bonellowe
• Narożnik: PRAWY (patrząc od frontu)
• Pojemnik na pościel: TAK, duży (w części z szezlongiem)

📏 Wymiary:
• Szerokość całkowita: 290 cm
• Głębokość (część dłuższa): 180 cm
• Głębokość (część krótsza): 95 cm
• Wysokość całkowita: 85 cm
• Wysokość siedziska: 45 cm
• Powierzchnia spania: 200 × 140 cm

✅ Stan: DOBRY
Używana 2,5 roku w salonie (niepalący, bez zwierząt).
• Ogólnie: zadbana, regularnie czyszczona odkurzaczem
• Siedzisko: lekkie odgniecenia (normalne zużycie), sprężyny sprawne
• Podłokietniki: bez plam i przetarć
• Nogi: drewniane, bez uszkodzeń
• Wada: na lewej poduszce plama po kawie ~3cm (słabo widoczna, zdjęcie 7)
• Mechanizm rozkładania: sprawny, działa płynnie

📦 W ofercie:
• Sofa narożna
• 4 poduszki dekoracyjne (widoczne na zdjęciach)
• Możliwość demontażu: TAK - rozkłada się na 2 części (przewóz kombi/bus)

📍 Odbiór osobisty - WYMAGANY:
• Poznań, Grunwald - ul. Głogowska (okolice Parku Wilsona)
• Piętro: 2 (bez windy, ale schody szerokie)
• Dostępność: sobota-niedziela 10-18, dni robocze po 17:00
• Pomoc przy wynoszeniu: TAK (ze mną pomoże jedna osoba)

🚚 Transport:
• Wymaga: bus lub duże kombi (po demontażu: 2 części ~150cm każda)
• Waga szacunkowa: ~70 kg
• Możliwość dostawy: TAK - okolice 20 km od Poznania, 100 zł

🛡️ Bezpieczeństwo:
• Allegro Protect
• 45 pozytywnych opinii

💬 Kontakt:
• Powód sprzedaży: zmiana wystroju salonu (nowy kolor ścian)
• Negocjacje: możliwe przy szybkim odbiorze
• Odpowiadam szybko!

Zapraszam na oględziny - można usiąść, rozłożyć, wszystko sprawdzić!
```

**Cena:** 1 499 zł (do negocjacji)

---

### 11.3 Przykład: Odzież

**Tytuł:**
```
Kurtka The North Face 1996 Nuptse 700 rozmiar L Czarna Nowa
```

**Treść:**
```markdown
Sprzedaję kultową kurtkę puchową The North Face 1996 Retro Nuptse - nowa z metkami.
Lokalizacja: Kraków, Krowodrza.

📋 Szczegóły:
• Marka: The North Face
• Model: 1996 Retro Nuptse Jacket
• Rozmiar: L (męski)
• Kolor: TNF Black (czarny)
• Wypełnienie: Puch gęsi 700 cuin (certyfikat RDS)
• Materiał zewnętrzny: 100% nylon ripstop, powłoka DWR
• Sezon: jesień-zima

📏 Wymiary (mierzone na płasko):
• Długość całkowita: 72 cm
• Szerokość pod pachami: 62 cm
• Szerokość w pasie: 58 cm
• Długość rękawa: 70 cm

✅ Stan: NOWY Z METKAMI
Kurtka nigdy nie noszona, wszystkie metki na miejscu.
Oryginalnie kupiona jako prezent, nietrafiony rozmiar (potrzebuję M).
Przechowywana w woreczku strunowym TNF.

📦 W zestawie:
• Kurtka The North Face 1996 Retro Nuptse
• Oryginalne metki (przymocowane)
• Oryginalny woreczek strunowy TNF
• Paragon ze sklepu The North Face (Galeria Krakowska, 12.2023)

📍 Odbiór osobisty:
• Kraków, Krowodrza - okolice Teatru Bagatela
• Możliwość przymierzenia
• Dostępność: elastyczne godziny, również weekend

🚚 Wysyłka:
• InPost paczkomat: 15 zł
• Smart!: TAK

🛡️ Bezpieczeństwo:
• Allegro Protect
• Paragon do wglądu - potwierdza oryginalność
• 89 pozytywnych opinii

💬 Kontakt:
• Powód sprzedaży: nietrafiony prezent (rozmiar za duży)
• Cena zakupu w sklepie: 1 699 zł
• Odpowiadam bardzo szybko!
```

**Cena:** 1 299 zł (do negocjacji)

---

## 12. ZASADY GENEROWANIA PRZEZ AGENTA AI

### 12.1 Parametry wejściowe

```yaml
wymagane:
  - nazwa_produktu: "string"
  - kategoria: "enum[elektronika, odziez, meble, motoryzacja, inne]"
  - stan: "enum[nowy_zapakowany, nowy_rozpakowany, idealny, bardzo_dobry, dobry, dostateczny, uszkodzony]"
  - lokalizacja: "string (miasto + dzielnica)"
  - zdjecia: "array[min: 3]"

opcjonalne:
  - marka: "string | null"
  - model: "string | null"
  - cena_oczekiwana: "number | null"
  - parametry_techniczne: "object"
  - wady: "string[]"
  - akcesoria: "string[]"
  - powod_sprzedazy: "string"
  - opcje_wysylki: "object"
  - paragon_faktura: "boolean"
  - gwarancja_do: "date | null"
  - reputacja_allegro: "object"
```

### 12.2 Proces generowania

```yaml
krok_1_analiza:
  akcje:
    - "Zidentyfikuj kategorię produktu"
    - "Określ wymagane atrybuty dla kategorii Allegro"
    - "Sprawdź kompletność danych wejściowych"
  walidacja:
    - "Jeśli brak lokalizacji → ZAPYTAJ (obowiązkowe)"
    - "Jeśli brak stanu → ZAPYTAJ (obowiązkowe)"
    - "Jeśli brak zdjęć → KOMUNIKAT (minimum 3)"

krok_2_tytul:
  akcje:
    - "Zastosuj formułę dla kategorii"
    - "Umieść słowa kluczowe na początku"
    - "Dodaj lokalizację (jeśli miejsce)"
  walidacja:
    - "Sprawdź limit 75 znaków"
    - "Zweryfikuj brak zakazanych słów"
    - "Potwierdź brak CAPS LOCK i emotikon"

krok_3_cena:
  akcje:
    - "Jeśli brak ceny → wyszukaj konkurencję lub zapytaj"
    - "Zastosuj formułę wyceny z współczynnikami"
    - "Uwzględnij reputację sprzedawcy"
    - "Zastosuj psychologię cen"
    - "Dodaj margines negocjacji 10-15%"

krok_4_tresc:
  akcje:
    - "Użyj szablonu 8 sekcji dla kategorii"
    - "Wypełnij wszystkie sekcje"
    - "Opisz wady szczegółowo (jeśli są)"
    - "Dodaj elementy zaufania (Allegro Protect, reputacja)"
  walidacja:
    - "Sprawdź długość 150-300 słów"
    - "Zweryfikuj formatowanie (listy, emoji)"

krok_5_atrybuty:
  akcje:
    - "Wypełnij 100% atrybutów dla kategorii"
    - "Wybierz najdokładniejszą kategorię"
    - "Skonfiguruj opcje dostawy"
    - "Włącz Facebook Marketplace"

krok_6_weryfikacja:
  akcje:
    - "Przejdź kompletny checklist"
    - "Oblicz punktację jakości"
    - "Wygeneruj raport z sugestiami poprawy"
```

### 12.3 Format odpowiedzi agenta

```yaml
format_odpowiedzi:
  tytul:
    wartosc: "string (max 75 znaków)"
    walidacja: "passed/failed + uwagi"
  
  tresc:
    wartosc: "string (markdown, 150-300 słów)"
    sekcje: 8
    formatowanie: "listy, emoji, nagłówki"
  
  cena:
    kwota: "number"
    negocjacje: "boolean"
    margines: "number (procent)"
    uzasadnienie: "string"
  
  atrybuty:
    kategoria: "string (pełna ścieżka)"
    stan: "string"
    marka: "string | null"
    model: "string | null"
    lokalizacja: "string"
    wysylka: "object"
    smart: "boolean"
    facebook_marketplace: "boolean"
    pozostale: "object"
  
  jakosc:
    punktacja: "number (0-100)"
    poziom: "enum[excellent, good, acceptable, needs_improvement]"
    szczegoly:
      tytul: "number/15"
      tresc: "number/30"
      cena: "number/15"
      zdjecia: "number/25"
      atrybuty: "number/15"
    sugestie_poprawy: "string[]"
  
  zdjecia:
    kolejnosc_sugerowana: "string[] (opis każdego zdjęcia)"
    brakujace: "string[]"
    wskazowki: "string[]"
  
  ostrzezenia:
    - "Lista potencjalnych problemów"
    - "Sugestie dotyczące DAC7 jeśli dotyczy"
```

---

## 13. RÓŻNICE WZGLĘDEM INNYCH PLATFORM

### 13.1 Unikalne cechy Allegro Lokalnie

```yaml
unikalne_cechy:
  integracja_allegro:
    - "Przeniesienie reputacji z głównego Allegro"
    - "System ocen wspólny"
    - "Allegro Pay dostępne"
    - "Allegro Protect"
  
  integracja_facebook:
    - "Automatyczna publikacja na FB Marketplace"
    - "Dodatkowy zasięg bez wysiłku"
  
  smart:
    - "Możliwość darmowej dostawy dla kupujących Smart!"
    - "Znacząco zwiększa konwersję"
  
  allegro_protect:
    - "Ochrona transakcji dla obu stron"
    - "Element budujący zaufanie w opisie"
  
  baza_20mln_uzytkownikow:
    - "Dostęp do największej bazy kupujących w Polsce"
    - "Wyższe zaufanie do platformy"
```

### 13.2 Elementy specyficzne dla struktury ogłoszenia

```yaml
specyfika_struktury:
  sekcja_bezpieczenstwa:
    - "Allegro Protect - ZAWSZE wspomnij"
    - "Reputacja - podaj liczbę opinii"
    - "Paragon/faktura - wyeksponuj jeśli dostępne"
  
  sekcja_dostawy:
    - "Smart! - wyróżnij jeśli dostępne"
    - "Wysyłka + odbiór osobisty = standard"
  
  tytul:
    - "Do 75 znaków (więcej niż inne platformy)"
    - "Lokalizacja zalecana"
  
  tresc:
    - "8 sekcji (więcej niż na innych platformach)"
    - "Elementy zaufania obowiązkowe"
```

---

**Koniec dokumentu reguł dla Allegro Lokalnie**