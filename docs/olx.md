# REGUŁY TWORZENIA WYSOKOKONWERSYJNYCH OGŁOSZEŃ NA OLX

> **Wersja dokumentu:** 1.0  
> **Przeznaczenie:** Agent AI do generowania ogłoszeń sprzedażowych  
> **Platforma:** OLX.pl

---

## 1. TYTUŁ OGŁOSZENIA

### 1.1 Parametry techniczne

| Parametr | Wartość | Uwagi |
|----------|---------|-------|
| **Limit znaków** | 50-70 znaków | OLX obcina dłuższe tytuły w wynikach wyszukiwania |
| **Pozycja słów kluczowych** | Na początku tytułu | Marka/typ produktu jako pierwsze słowo |
| **Formatowanie** | Normalne | Bez CAPS LOCK, bez emotikon, bez symboli specjalnych |

### 1.2 Formuła struktury tytułu

```
[MARKA] + [MODEL/TYP] + [PARAMETR KLUCZOWY] + [CECHA WYRÓŻNIAJĄCA]
```

**Warianty formuły w zależności od kategorii:**

| Kategoria | Formuła | Przykład |
|-----------|---------|----------|
| Elektronika | Marka + Model + Pojemność/Pamięć + Stan | "iPhone 13 Pro 256GB - Stan Idealny" |
| Odzież | Marka + Typ + Rozmiar + Stan | "Nike Air Max 90 rozmiar 43 - Nowe" |
| Meble | Typ + Materiał + Wymiar + Cecha | "Stół dębowy 160x90cm - rozkładany" |
| Motoryzacja | Marka + Model + Rok + Przebieg | "Audi A4 2019 87000km - Serwisowany" |
| AGD/RTV | Marka + Model + Parametr + Stan | "Samsung TV 55 cali QLED - Gwarancja" |

### 1.3 Przykłady poprawnych tytułów

```
✅ "iPhone 13 Pro 256GB Grafitowy - Stan Idealny"
✅ "Samsung Galaxy S22 128GB Czarny - Gwarancja do 2025"
✅ "Nike Air Max 90 rozmiar 43 - Nowe z metką"
✅ "MacBook Pro 14 M1 Pro 16GB - Komplet"
✅ "Sofa narożna szara 280cm - Transport gratis"
✅ "Rower górski Kross Level 5.0 rama L - Serwisowany"
```

### 1.4 Przykłady błędnych tytułów

```
❌ "SUPER OKAZJA TELEFON!!!" (CAPS LOCK, brak konkretów)
❌ "Telefon do kupienia" (zbyt ogólny)
❌ "📱 iPhone tanio!!!" (emotikony, słowo "tanio")
❌ "PILNE - sprzedam laptopa" (CAPS, słowo "pilne")
❌ "Telefon Samsung jak nowy mega okazja" (słowa marketingowe)
❌ "???" lub "---" (znaki specjalne)
```

### 1.5 Lista zabronionych słów i fraz w tytule

```yaml
zakazane_slowa:
  marketingowe:
    - OKAZJA
    - TANIO
    - MEGA
    - SUPER
    - NAJLEPSZY
    - PROMOCJA
    - WYPRZEDAŻ
  
  urgency:
    - PILNE
    - SZYBKO
    - OSTATNIA SZTUKA
    - TYLKO DZIŚ
  
  niekonkretne:
    - "jak nowy" (chyba że w opisie stanu)
    - "prawie nieużywany"
    - "okazyjnie"
  
  znaki_specjalne:
    - "!!!"
    - "???"
    - "***"
    - "---"
    - emotikony (wszystkie)
```

---

## 2. TREŚĆ OGŁOSZENIA

### 2.1 Optymalna struktura treści

```
┌─────────────────────────────────────────────────────────────┐
│ 📦 SEKCJA 1: WPROWADZENIE (1-2 zdania)                      │
│    └─ Co sprzedajesz + główna zaleta/USP                    │
├─────────────────────────────────────────────────────────────┤
│ 📋 SEKCJA 2: SPECYFIKACJA TECHNICZNA                        │
│    └─ Lista punktowa kluczowych parametrów (5-10 punktów)   │
├─────────────────────────────────────────────────────────────┤
│ ✅ SEKCJA 3: STAN PRZEDMIOTU                                │
│    └─ Szczegółowy opis stanu + historia użytkowania         │
│    └─ Opis wad/uszkodzeń (jeśli istnieją)                   │
├─────────────────────────────────────────────────────────────┤
│ 📎 SEKCJA 4: ZAWARTOŚĆ ZESTAWU                              │
│    └─ Lista wszystkiego co kupujący otrzyma                 │
├─────────────────────────────────────────────────────────────┤
│ 💡 SEKCJA 5: INFORMACJE DODATKOWE                           │
│    └─ Powód sprzedaży                                       │
│    └─ Wysyłka/odbiór                                        │
│    └─ Negocjacje                                            │
│    └─ Szybkość odpowiedzi                                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Parametry treści

| Parametr | Wartość optymalna | Wartość minimalna | Wartość maksymalna |
|----------|-------------------|-------------------|-------------------|
| **Liczba słów** | 200-300 | 150 | 400 |
| **Liczba sekcji** | 5 | 3 | 6 |
| **Punkty specyfikacji** | 6-8 | 4 | 12 |
| **Akapity** | 4-5 | 3 | 7 |

### 2.3 Zasady copywritingu

| Zasada | Opis | Przykład DOBRY | Przykład ZŁY |
|--------|------|----------------|--------------|
| **Konkretność** | Liczby zamiast ogólników | "Bateria trzyma 2 dni przy normalnym użytkowaniu" | "Długa bateria" |
| **Szczerość** | Opisz wady i uszkodzenia | "Rysa na pleckach 2cm (widoczna na zdjęciu 4)" | "Drobne ślady użytkowania" |
| **Język korzyści** | Fokus na użytkownika | "Idealny do pracy zdalnej i nauki" | "Procesor i5, 16GB RAM" |
| **Formatowanie** | Wypunktowania, akapity | Lista punktowa parametrów | Ściana tekstu bez formatowania |
| **Wiarygodność** | Podaj źródło informacji | "Kupiony w Media Expert 12.2023" | "Kupiony jakiś czas temu" |
| **Unikalność** | Wyróżnij się od konkurencji | "Jedyny egzemplarz w tym kolorze na OLX" | Standardowy opis |

### 2.4 Szablon uniwersalny

```markdown
Sprzedaję [PRZEDMIOT] marki [MARKA], model [MODEL].
[1-2 zdania o głównej zalecie lub unikalnej cesze produktu].

📋 Specyfikacja:
• [parametr 1]: [wartość]
• [parametr 2]: [wartość]
• [parametr 3]: [wartość]
• [parametr 4]: [wartość]
• [parametr 5]: [wartość]
• [parametr 6]: [wartość]

✅ Stan: [NOWY/IDEALNY/BARDZO DOBRY/DOBRY/DO NAPRAWY]
[Szczegółowy opis stanu - 2-3 zdania]
[Jeśli są wady: dokładny opis z lokalizacją, rozmiarem, widocznością]
[Historia użytkowania - jak długo, jak często, do czego]

📦 W zestawie:
• [element 1]
• [element 2]
• [element 3]
• Oryginalne opakowanie: TAK/NIE
• Paragon/faktura: TAK/NIE
• Gwarancja: TAK (do [data]) / NIE

ℹ️ Dodatkowe informacje:
• Powód sprzedaży: [powód]
• Wysyłka: [opcje wysyłki]
• Odbiór osobisty: [lokalizacja, godziny]
• Negocjacje: TAK/NIE
• Możliwość sprawdzenia: TAK/NIE

Odpowiadam na wiadomości w ciągu [X] godzin.
Zapraszam do kontaktu!
```

### 2.5 Szablony według kategorii

#### Elektronika (telefony, laptopy, tablety)

```markdown
Sprzedaję [URZĄDZENIE] [MARKA] [MODEL] [POJEMNOŚĆ/WARIANT].
[Główna zaleta - np. "Idealny do fotografii" / "Świetny do gier"].

📋 Specyfikacja:
• Model: [pełna nazwa modelu]
• Pojemność: [GB/TB]
• Kolor: [kolor]
• Pamięć RAM: [jeśli dotyczy]
• Procesor: [jeśli dotyczy]
• Wyświetlacz: [rozmiar, typ]
• Bateria: [stan baterii w %, jeśli dostępne]
• System: [wersja systemu]

✅ Stan: [STAN]
[Opis stanu ekranu, obudowy, przycisków]
[Historia użytkowania - "Używany od X jako telefon służbowy/prywatny"]
[Wady jeśli są - dokładna lokalizacja i rozmiar]

📦 W zestawie:
• [Urządzenie]
• Ładowarka: ORYGINALNA/ZAMIENNIK/BRAK
• Kabel: TAK/NIE
• Słuchawki: TAK/NIE
• Etui: TAK/NIE (jakie)
• Szkło ochronne: TAK/NIE (nałożone/nowe)
• Oryginalne pudełko: TAK/NIE
• Paragon/faktura: TAK/NIE

ℹ️ Dodatkowe informacje:
• Zakupiony: [gdzie i kiedy]
• Gwarancja producenta: do [data] / brak
• iCloud/Google wylogowane: TAK
• Możliwość sprawdzenia przed zakupem: TAK

Wysyłka: [opcje]
Odbiór osobisty: [lokalizacja]

Odpowiadam szybko - zwykle w ciągu godziny!
```

#### Odzież i obuwie

```markdown
Sprzedaję [TYP ODZIEŻY] marki [MARKA], model [MODEL/KOLEKCJA].
[Główna cecha - np. "Idealne na co dzień" / "Eleganckie na specjalne okazje"].

📋 Szczegóły:
• Marka: [marka]
• Model/kolekcja: [jeśli dotyczy]
• Rozmiar: [rozmiar] (odpowiada [wymiary w cm])
• Kolor: [kolor]
• Materiał: [skład materiałowy]
• Sezon: [wiosna-lato / jesień-zima / całoroczne]

📏 Wymiary (zmierzone na płasko):
• Długość całkowita: [cm]
• Szerokość w biuście/klatce: [cm]
• Szerokość w pasie: [cm]
• Długość rękawa: [cm] (jeśli dotyczy)
• [inne istotne wymiary]

✅ Stan: [NOWY Z METKĄ / NOWY BEZ METKI / IDEALNY / BARDZO DOBRY / DOBRY]
[Opis stanu - prane ile razy, noszone jak często]
[Wady jeśli są - plamy, przetarcia, braki]

📦 W zestawie:
• [Odzież/obuwie]
• Oryginalne opakowanie: TAK/NIE
• Metki: TAK/NIE
• Dodatkowe elementy: [sznurówki, pasek, etc.]

ℹ️ Powód sprzedaży: [np. "Nietrafiony prezent" / "Zmiana rozmiaru"]

Wysyłka: [opcje]
Odbiór osobisty: [lokalizacja]
```

#### Meble i wyposażenie wnętrz

```markdown
Sprzedaję [TYP MEBLA] [MARKA jeśli dotyczy].
[Główna cecha - np. "Idealny do małych przestrzeni" / "Pojemny i funkcjonalny"].

📋 Szczegóły:
• Typ: [sofa, stół, szafa, etc.]
• Marka/producent: [marka lub "bez marki"]
• Kolor: [kolor]
• Materiał: [drewno, płyta, metal, tkanina]
• Styl: [nowoczesny, klasyczny, skandynawski, etc.]

📏 Wymiary:
• Szerokość: [cm]
• Głębokość: [cm]
• Wysokość: [cm]
• Wymiary po rozłożeniu: [cm] (jeśli dotyczy)
• Waga: [kg] (przybliżona)

✅ Stan: [STAN]
[Opis stanu - rysy, odpryski, plamy]
[Historia użytkowania - jak długo, w jakim pomieszczeniu]

📦 Co zawiera oferta:
• [Meble]
• Instrukcja montażu: TAK/NIE
• Elementy montażowe: TAK/NIE
• Możliwość demontażu: TAK/NIE

🚚 Transport:
• Wymaga transportu: [typ auta - kombi wystarczy / bus / ciężarówka]
• Pomoc przy załadunku: TAK/NIE
• Możliwość dostawy: TAK (okolice [miasto], [cena]) / NIE

ℹ️ Powód sprzedaży: [np. "Zmiana wystroju" / "Przeprowadzka"]

Odbiór osobisty: [dokładna lokalizacja]
Dostępność do odbioru: [dni, godziny]
```

### 2.6 Elementy budujące zaufanie (obowiązkowe)

```yaml
elementy_zaufania:
  obowiazkowe:
    - powod_sprzedazy: "Wyjaśnij dlaczego sprzedajesz"
    - data_zakupu: "Kiedy i gdzie kupione"
    - czas_uzytkowania: "Jak długo używane"
    - mozliwosc_sprawdzenia: "Czy można obejrzeć przed zakupem"
    - szybkosc_odpowiedzi: "W jakim czasie odpowiadasz"
  
  opcjonalne_wysokiej_wartosci:
    - paragon_faktura: "Dostępność dowodu zakupu"
    - gwarancja: "Czy jeszcze obowiązuje"
    - historia_serwisowa: "Dla elektroniki i pojazdów"
    - zweryfikowane_konto: "Informacja o weryfikacji"
```

### 2.7 Słowa i frazy zwiększające konwersję

```yaml
slowa_pozytywne:
  stan:
    - "zadbany"
    - "serwisowany"
    - "kompletny"
    - "oryginalny"
    - "sprawny"
  
  wiarygodnosc:
    - "możliwość sprawdzenia"
    - "paragon do wglądu"
    - "odpowiadam szybko"
    - "uczciwy opis"
  
  korzysc:
    - "oszczędzasz [X] zł"
    - "gotowy do użycia"
    - "idealny do [zastosowanie]"

slowa_do_unikania:
  - "prawie nowy" (nieokreślone)
  - "jak ze sklepu" (przesada)
  - "okazja" (marketingowe)
  - "pilnie" (desperacja)
  - "bez ściemy" (nieprofesjonalne)
```

---

## 3. STRATEGIA CENOWA

### 3.1 Formuła wyceny używanych produktów

```
CENA = (Cena_nowego × Współczynnik_stanu × Współczynnik_wieku) - Wartość_wad + Wartość_dodatków
```

### 3.2 Współczynniki stanu

| Stan | Współczynnik | Opis |
|------|--------------|------|
| **Nowy z metką/w folii** | 0.85 - 0.95 | Nieużywany, pełne opakowanie |
| **Nowy bez metki** | 0.75 - 0.85 | Nieużywany, rozpakowany |
| **Idealny** | 0.60 - 0.75 | Minimalne ślady użytkowania, niewidoczne |
| **Bardzo dobry** | 0.45 - 0.60 | Drobne ślady, widoczne przy dokładnym oglądaniu |
| **Dobry** | 0.30 - 0.45 | Wyraźne ślady użytkowania, pełna funkcjonalność |
| **Dostateczny** | 0.15 - 0.30 | Znaczne ślady, możliwe drobne usterki |
| **Do naprawy** | 0.05 - 0.15 | Wymaga naprawy lub części |

### 3.3 Współczynniki wieku

| Wiek produktu | Współczynnik | Kategorie |
|---------------|--------------|-----------|
| **< 3 miesiące** | 1.00 | Wszystkie |
| **3-6 miesięcy** | 0.95 | Wszystkie |
| **6-12 miesięcy** | 0.90 | Wszystkie |
| **1-2 lata** | 0.80 | Elektronika: 0.70 |
| **2-3 lata** | 0.70 | Elektronika: 0.50 |
| **3-5 lat** | 0.55 | Elektronika: 0.35 |
| **> 5 lat** | 0.40 | Elektronika: 0.20, Vintage: może rosnąć |

### 3.4 Przykład kalkulacji

```
Produkt: iPhone 13 Pro 256GB
Cena nowego: 5499 zł
Stan: Bardzo dobry (współczynnik: 0.55)
Wiek: 18 miesięcy (współczynnik: 0.75)
Wady: Rysa na pleckach (wartość: -100 zł)
Dodatki: Oryginalne etui Apple (wartość: +100 zł)

CENA = (5499 × 0.55 × 0.75) - 100 + 100
CENA = 2268 zł

Zaokrąglenie psychologiczne: 2249 zł
Z marginesem negocjacji (+10%): 2479 zł → 2499 zł
```

### 3.5 Strategia analizy konkurencji

```yaml
procedura_analizy:
  krok_1:
    akcja: "Wyszukaj identyczny produkt na OLX"
    parametry:
      - ten sam model
      - podobny stan
      - ta sama lokalizacja (opcjonalnie)
    minimum_probek: 5
  
  krok_2:
    akcja: "Zapisz ceny konkurencji"
    dane:
      - cena_najnizsza
      - cena_najwyzsza
      - cena_mediana
      - liczba_ogloszen
  
  krok_3:
    akcja: "Określ pozycję cenową"
    strategia_szybka_sprzedaz: "dolne 25% zakresu"
    strategia_maksymalny_zysk: "górne 25% zakresu"
    strategia_zbalansowana: "okolice mediany"
  
  krok_4:
    akcja: "Zastosuj psychologię cen"
    reguly:
      - "Cena kończąca się na 9: 499, 1299, 2499"
      - "Cena kończąca się na 0 dla okrągłych kwot: 500, 1000"
      - "Unikaj cen kończących się na 50 (np. 450)"
```

### 3.6 Tabela psychologii cen

| Zakres cenowy | Końcówka optymalna | Przykład |
|---------------|-------------------|----------|
| 1-50 zł | -5, -9 | 25 zł, 49 zł |
| 50-200 zł | -9 | 99 zł, 149 zł, 199 zł |
| 200-1000 zł | -9, -99 | 299 zł, 499 zł, 899 zł |
| 1000-5000 zł | -99, -999 | 1299 zł, 1999 zł, 2499 zł |
| > 5000 zł | -999, -00 | 5999 zł, 7500 zł |

### 3.7 Margines negocjacji

| Sytuacja | Margines | Jak komunikować |
|----------|----------|-----------------|
| **Chcesz szybko sprzedać** | 5-10% | "Cena do małej negocjacji" |
| **Standard** | 10-15% | "Cena do negocjacji" |
| **Nie spieszysz się** | 15-25% | Nie zaznaczaj opcji negocjacji |
| **Cena finalna** | 0% | "Cena ostateczna" w opisie |

### 3.8 Czerwone flagi cenowe

```yaml
czerwone_flagi:
  za_nisko:
    opis: "Cena >40% poniżej rynku"
    skutek: "Kupujący podejrzewają oszustwo, mniej kontaktów"
    rozwiazanie: "Podnieś cenę lub szczegółowo wyjaśnij w opisie"
  
  za_wysoko:
    opis: "Cena >30% powyżej rynku"
    skutek: "Brak zainteresowania, długi czas sprzedaży"
    rozwiazanie: "Obniż cenę lub dodaj wartość (wysyłka gratis)"
  
  brak_ceny:
    opis: "Opcja 'Zamień' lub brak kwoty"
    skutek: "Niższy CTR o 40%, mniej poważnych kupujących"
    rozwiazanie: "Zawsze podawaj konkretną cenę"
  
  niestabilna:
    opis: "Częste zmiany ceny w górę i dół"
    skutek: "Utrata zaufania, kupujący czekają na dalsze obniżki"
    rozwiazanie: "Zmniejszaj cenę stopniowo, nigdy nie podnoś"
```

---

## 4. INFORMACJE DODATKOWE I ATRYBUTY

### 4.1 Obowiązkowe pola OLX

| Pole | Wpływ na widoczność | Jak wypełnić |
|------|---------------------|--------------|
| **Kategoria** | Krytyczny (+50%) | Wybierz najdokładniejszą podkategorię |
| **Lokalizacja** | Krytyczny (+40%) | Dokładna dzielnica, nie tylko miasto |
| **Stan** | Wysoki (+30%) | Użyj oficjalnych kategorii OLX |
| **Cena** | Wysoki (+25%) | Konkretna kwota, nie "zamienię" |
| **Zdjęcia** | Krytyczny (+45%) | Minimum 5, maksimum 8 |

### 4.2 Atrybuty według kategorii

```yaml
elektronika:
  obowiazkowe:
    - marka
    - model
    - stan
    - kolor
  opcjonalne_wazne:
    - pojemnosc_pamieci
    - przekatna_ekranu
    - rok_produkcji

odziez:
  obowiazkowe:
    - marka
    - rozmiar
    - stan
    - plec (damskie/meskie/unisex)
  opcjonalne_wazne:
    - kolor
    - material
    - rodzaj (koszulka, spodnie, etc.)

meble:
  obowiazkowe:
    - typ_mebla
    - stan
  opcjonalne_wazne:
    - material
    - kolor
    - wymiary

motoryzacja:
  obowiazkowe:
    - marka
    - model
    - rok_produkcji
    - przebieg
    - pojemnosc_silnika
    - rodzaj_paliwa
  opcjonalne_wazne:
    - moc_silnika
    - skrzynia_biegow
    - typ_nadwozia
    - kolor
```

### 4.3 Opcje dostawy

| Opcja | Kiedy włączyć | Wpływ na zasięg |
|-------|---------------|-----------------|
| **Wysyłka OLX** | Produkty < 30kg, wartość > 50zł | +300-500% zasięgu |
| **Odbiór osobisty** | Zawsze | Baza lokalna |
| **Dostawa własna** | Meble, duże AGD | +50% w regionie |

### 4.4 Informacje budujące zaufanie

```yaml
poziom_1_podstawowy:
  - zweryfikowany_numer_telefonu
  - wypelnione_wszystkie_atrybuty
  - minimum_5_zdjec
  - cena_konkretna

poziom_2_zaawansowany:
  - zweryfikowana_tozsamosc
  - wlaczona_wysylka_olx
  - historia_transakcji
  - opis_powodu_sprzedazy

poziom_3_maksymalny:
  - paragon_faktura_na_zdjeciu
  - mozliwosc_sprawdzenia_przed_zakupem
  - szybkie_odpowiedzi (badge OLX)
  - dlugi_staz_na_platformie
```

---

## 5. ZDJĘCIA PRODUKTU

### 5.1 Wymagania techniczne

| Parametr | Minimum | Optimum | Maximum |
|----------|---------|---------|---------|
| **Liczba zdjęć** | 3 | 6-8 | 15 |
| **Rozdzielczość** | 800×600 px | 1200×900 px | 4000×3000 px |
| **Rozmiar pliku** | 100 KB | 500 KB - 1 MB | 5 MB |
| **Format** | JPG | JPG | JPG, PNG |
| **Proporcje** | 4:3 | 4:3 lub 1:1 | 16:9 |

### 5.2 Kolejność zdjęć (kluczowa - pierwsze = miniatura)

```
ZDJĘCIE 1 (MINIATURA - NAJWAŻNIEJSZE):
├── Produkt w całości
├── Najlepsza perspektywa (lekko z góry, pod kątem 30-45°)
├── Czyste, jasne tło
└── Produkt zajmuje 70-80% kadru

ZDJĘCIE 2:
├── Zbliżenie na markę/logo/etykietę
└── Potwierdza autentyczność

ZDJĘCIE 3:
├── Druga perspektywa (tył lub bok)
└── Pokazuje pełny kształt/wymiary

ZDJĘCIE 4:
├── Szczegóły/cechy wyróżniające
└── Np. porty, przyciski, detale wykończenia

ZDJĘCIE 5:
├── WADY/USZKODZENIA (jeśli są)
└── Zbliżenie na rysę/plamę/uszkodzenie
└── OBOWIĄZKOWE jeśli istnieją wady!

ZDJĘCIE 6:
├── Akcesoria/zestaw
└── Wszystko co kupujący otrzyma

ZDJĘCIE 7:
├── Skala/kontekst
└── Produkt przy dłoni, monecie, lub w użyciu

ZDJĘCIE 8:
├── Paragon/faktura/gwarancja
└── Zamazane dane osobowe, widoczna data i produkt
```

### 5.3 Specyfikacje według kategorii

#### Elektronika
```yaml
elektronika:
  zdjecie_1: "Przód urządzenia, ekran włączony (jeśli możliwe)"
  zdjecie_2: "Tył - aparat, logo producenta"
  zdjecie_3: "Bok - przyciski, porty"
  zdjecie_4: "Ekran z bliska - stan wyświetlacza"
  zdjecie_5: "Stan baterii (screenshot ustawień)"
  zdjecie_6: "Wady jeśli są (zbliżenie)"
  zdjecie_7: "Wszystkie akcesoria rozłożone"
  zdjecie_8: "Pudełko i dokumenty"
```

#### Odzież
```yaml
odziez:
  zdjecie_1: "Na wieszaku lub manekinie - przód"
  zdjecie_2: "Tył"
  zdjecie_3: "Metka z rozmiarem"
  zdjecie_4: "Metka ze składem materiału"
  zdjecie_5: "Zbliżenie na materiał/fakturę"
  zdjecie_6: "Detale - guziki, zamek, nadruk"
  zdjecie_7: "Wady jeśli są"
  zdjecie_8: "Na osobie (opcjonalnie)"
```

#### Meble
```yaml
meble:
  zdjecie_1: "Całość z przodu"
  zdjecie_2: "Całość z boku"
  zdjecie_3: "Z góry (jeśli istotne)"
  zdjecie_4: "Zbliżenie na materiał/wykończenie"
  zdjecie_5: "Detale - uchwyty, nogi, zawiasy"
  zdjecie_6: "Wnętrze (szafy, komody)"
  zdjecie_7: "Wady - rysy, odpryski"
  zdjecie_8: "Mebel w kontekście pomieszczenia (skala)"
```

### 5.4 Wymagania dotyczące tła i oświetlenia

```yaml
tlo:
  idealne:
    - "Jednolite białe"
    - "Jednolite szare"
    - "Jasne, neutralne"
  akceptowalne:
    - "Czyste biurko"
    - "Jednolity dywan"
    - "Ściana bez wzoru"
  zabronione:
    - "Bałagan w tle"
    - "Inne przedmioty (chyba że zestaw)"
    - "Lustrzane odbicia z osobą"
    - "Wzorzyste tła"

oswietlenie:
  idealne:
    - "Naturalne światło dzienne"
    - "Rozproszone (pochmurny dzień lub przy oknie)"
  akceptowalne:
    - "Sztuczne oświetlenie LED (białe/neutralne)"
  zabronione:
    - "Bezpośrednie słońce (cienie, prześwietlenia)"
    - "Żółte światło żarówek"
    - "Ciemne pomieszczenie z lampą błyskową"
```

### 5.5 Czego bezwzględnie unikać

```yaml
zabronione_zdjecia:
  pochodzenie:
    - "Zdjęcia stockowe"
    - "Zdjęcia z internetu/innych ogłoszeń"
    - "Zdjęcia producenta (katalogowe)"
    - "Screenshoty z innych platform"
  
  edycja:
    - "Filtry zmieniające kolor"
    - "Nadmierna edycja/retusz"
    - "Kolaże wielu zdjęć w jednym"
    - "Tekst/napisy/banery na zdjęciu"
    - "Logo innych platform"
    - "Ramki i ozdobniki"
  
  techniczne:
    - "Rozmazane/nieostre"
    - "Zbyt ciemne"
    - "Prześwietlone"
    - "Kadr w pionie (dla większości produktów)"
    - "Produkt zajmuje <50% kadru"
  
  zawartość:
    - "Osoby (twarz) bez związku z produktem"
    - "Zwierzęta"
    - "Dane osobowe czytelne"
    - "Treści nieodpowiednie"
```

---

## 6. OPTYMALIZACJA DLA ALGORYTMU OLX

### 6.1 Czynniki rankingowe

| Czynnik | Wpływ | Jak optymalizować |
|---------|-------|-------------------|
| **Świeżość** | +40% | Odświeżaj co 3-5 dni |
| **Kompletność** | +30% | Wypełnij 100% atrybutów |
| **Zdjęcia** | +25% | 6-8 zdjęć wysokiej jakości |
| **Responsywność** | +20% | Odpowiadaj w <1h |
| **Cena vs rynek** | +15% | Konkurencyjna cena |
| **Wysyłka** | +15% | Włącz "Wysyłka OLX" |
| **Weryfikacja** | +10% | Zweryfikuj telefon i tożsamość |

### 6.2 Strategia odświeżania

```yaml
strategia_odsiwezania:
  metoda_1_zmiana_ceny:
    opis: "Zmień cenę o 1-5 zł"
    efekt: "Resetuje datę ogłoszenia"
    czestotliwosc: "Co 3-5 dni"
    kierunek: "Zawsze w dół, nigdy w górę"
  
  metoda_2_edycja_tresci:
    opis: "Drobna zmiana w opisie"
    efekt: "Odświeża ogłoszenie"
    czestotliwosc: "Co tydzień"
    co_zmienic: "Dodaj szczegół, popraw formatowanie"
  
  metoda_3_nowe_zdjecie:
    opis: "Dodaj lub zamień zdjęcie"
    efekt: "Sygnalizuje aktywność"
    czestotliwosc: "Co 2 tygodnie"
  
  metoda_4_promowanie:
    opis: "Płatne wyróżnienie"
    kiedy: "Gdy bezpłatne metody nie działają"
    opcje:
      - "Odśwież (najtańsza opcja)"
      - "Wyróżnij na liście"
      - "Promuj na stronie głównej"
```

### 6.3 Harmonogram działań

```
TYDZIEŃ 1:
├── Dzień 1: Publikacja ogłoszenia
├── Dzień 3: Sprawdź statystyki, ewentualna korekta ceny
├── Dzień 5: Zmiana ceny o 5-10 zł w dół (odświeżenie)
└── Dzień 7: Analiza - jeśli mało wyświetleń, popraw tytuł/zdjęcie główne

TYDZIEŃ 2:
├── Dzień 8: Edycja opisu (dodaj szczegół)
├── Dzień 10: Zmiana ceny o kolejne 5-10 zł
├── Dzień 12: Rozważ włączenie wysyłki (jeśli nie ma)
└── Dzień 14: Analiza - jeśli brak zainteresowania, obniż cenę o 10-15%

TYDZIEŃ 3+:
├── Kontynuuj cykl zmian ceny co 3-5 dni
├── Rozważ płatne promowanie
└── Jeśli brak efektów po 3 tygodniach - weryfikuj cenę vs konkurencja
```

---

## 7. CHECKLIST PRZED PUBLIKACJĄ

### 7.1 Checklist kompletny

```yaml
tytul:
  - [ ] Zawiera markę i model
  - [ ] Ma 50-70 znaków
  - [ ] Bez CAPS LOCK
  - [ ] Bez "!!!" i "???"
  - [ ] Bez słów: OKAZJA, TANIO, PILNE
  - [ ] Konkretny parametr (rozmiar/pojemność/rok)
  - [ ] Słowo kluczowe na początku

tresc:
  - [ ] 150-400 słów
  - [ ] Wypunktowana specyfikacja (min. 5 punktów)
  - [ ] Szczery opis stanu
  - [ ] Opisane wady (jeśli są)
  - [ ] Lista zawartości zestawu
  - [ ] Informacja o wysyłce/odbiorze
  - [ ] Powód sprzedaży
  - [ ] Informacja o szybkości odpowiedzi
  - [ ] Poprawna interpunkcja i ortografia

cena:
  - [ ] Sprawdzona konkurencja (min. 5 ogłoszeń)
  - [ ] Realistyczna wycena
  - [ ] Uwzględniony margines negocjacji
  - [ ] Psychologia cen (końcówka 9 lub 99)
  - [ ] Nie za niska (podejrzana) ani za wysoka

zdjecia:
  - [ ] Minimum 5 zdjęć
  - [ ] Maksimum 8-10 zdjęć
  - [ ] Pierwsze zdjęcie = najlepsze, produkt w całości
  - [ ] Pokazane wady (jeśli są)
  - [ ] Jasne tło, dobre oświetlenie
  - [ ] Własne zdjęcia (nie z internetu)
  - [ ] Różne perspektywy
  - [ ] Brak filtrów i napisów
  - [ ] Rozdzielczość min. 1024x768

dane_i_atrybuty:
  - [ ] Wszystkie atrybuty wypełnione
  - [ ] Kategoria wybrana najdokładniej
  - [ ] Dokładna lokalizacja (dzielnica)
  - [ ] Zweryfikowany numer telefonu
  - [ ] Wysyłka zaznaczona (jeśli możliwa)
  - [ ] Stan przedmiotu wybrany poprawnie
```

### 7.2 Punktacja jakości ogłoszenia

```yaml
system_punktacji:
  tytul: 20 pkt
    - marka_i_model: 8 pkt
    - parametr_kluczowy: 6 pkt
    - optymalna_dlugosc: 4 pkt
    - brak_zakazanych_slow: 2 pkt
  
  tresc: 25 pkt
    - struktura_kompletna: 8 pkt
    - specyfikacja_szczegolowa: 6 pkt
    - opis_stanu_i_wad: 5 pkt
    - elementy_zaufania: 4 pkt
    - formatowanie: 2 pkt
  
  cena: 15 pkt
    - konkurencyjnosc: 8 pkt
    - psychologia: 4 pkt
    - margines_negocjacji: 3 pkt
  
  zdjecia: 25 pkt
    - liczba_min_5: 8 pkt
    - jakosc_i_oswietlenie: 7 pkt
    - roznorodnosc_perspektyw: 5 pkt
    - pokazane_wady: 5 pkt
  
  atrybuty: 15 pkt
    - kompletnosc: 8 pkt
    - lokalizacja_dokladna: 4 pkt
    - wysylka_wlaczona: 3 pkt

progi:
  excellent: 90-100 pkt
  good: 75-89 pkt
  acceptable: 60-74 pkt
  needs_improvement: <60 pkt
```

---

## 8. OBSŁUGA BŁĘDÓW I EDGE CASES

### 8.1 Brak informacji od użytkownika

```yaml
brakujace_informacje:
  marka_nieznana:
    akcja: "Użyj 'bez marki' lub opisz producenta"
    tytul: "[TYP PRODUKTU] + [KOLOR/CECHA] + [ROZMIAR]"
    przyklad: "Kurtka zimowa czarna rozmiar L - Ciepła"
  
  cena_nieznana:
    akcja: "Wyszukaj podobne na OLX, użyj mediany"
    fallback: "Zapytaj użytkownika o zakres cenowy"
  
  stan_nieopisany:
    akcja: "Zapytaj o szczegóły stanu"
    pytania:
      - "Czy są widoczne ślady użytkowania?"
      - "Czy wszystko działa prawidłowo?"
      - "Jak długo był używany?"
  
  brak_zdjec:
    akcja: "Nie publikuj bez zdjęć"
    minimum: 3 zdjęcia
    komunikat: "Proszę o dodanie minimum 3 zdjęć produktu"
```

### 8.2 Produkty specjalne

```yaml
produkty_specjalne:
  antyki_vintage:
    cena: "Nie stosuj standardowej formuły deprecjacji"
    opis: "Podkreśl wiek jako zaletę, historię"
    zdjecia: "Pokaż patynę jako wartość"
  
  kolekcjonerskie:
    cena: "Sprawdź aukcje zakończone, ceny realizacji"
    opis: "Stan zachowania kluczowy, certyfikaty"
    zdjecia: "Detale, oznaczenia, certyfikaty"
  
  uszkodzone:
    cena: "Drastycznie niższa, ~10-25% wartości"
    tytul: "Dodaj 'uszkodzony' lub 'do naprawy'"
    opis: "Szczegółowo opisz usterkę i koszt naprawy"
    zdjecia: "OBOWIĄZKOWO pokaż uszkodzenie"
  
  zestawy_bundle:
    cena: "Suma elementów - 10-20%"
    tytul: "Użyj 'ZESTAW' lub 'KOMPLET'"
    opis: "Wymień każdy element osobno z wartością"
    zdjecia: "Wszystkie elementy razem + osobno"
```

---

## 9. PRZYKŁADY KOMPLETNYCH OGŁOSZEŃ

### 9.1 Przykład: Smartfon

**Tytuł:**
```
iPhone 13 Pro 256GB Grafitowy - Stan Bardzo Dobry
```

**Treść:**
```
Sprzedaję iPhone 13 Pro 256GB w kolorze grafitowym.
Telefon sprawny w 100%, bateria w bardzo dobrym stanie (89% kondycji).
Idealny dla kogoś, kto szuka flagowca Apple w rozsądnej cenie.

📋 Specyfikacja:
• Model: iPhone 13 Pro (A2638)
• Pojemność: 256GB
• Kolor: Grafitowy (Graphite)
• Wyświetlacz: 6.1" Super Retina XDR, ProMotion 120Hz
• Kondycja baterii: 89%
• System: iOS 17.2 (najnowszy)
• Simlock: Brak, działa ze wszystkimi operatorami

✅ Stan: BARDZO DOBRY
Telefon użytkowany przez 14 miesięcy jako telefon służbowy.
Ekran bez rys (zawsze było szkło ochronne).
Na obudowie minimalne ślady użytkowania - drobne mikrokratki 
widoczne tylko pod światło (pokazane na zdjęciu 5).
Face ID, wszystkie aparaty, głośniki - działają perfekcyjnie.

📦 W zestawie:
• iPhone 13 Pro 256GB
• Oryginalne pudełko
• Kabel USB-C do Lightning (nowy, nieużywany)
• Etui silikonowe Apple (Midnight) - używane
• Szkło hartowane 9H (nowe, w opakowaniu)
• Paragon z Media Expert (data zakupu: 15.09.2023)

ℹ️ Dodatkowe informacje:
• Zakupiony w Media Expert, paragon do wglądu
• Gwarancja Apple: zakończona
• Powód sprzedaży: przesiadka na iPhone 15 Pro
• iCloud wylogowane, telefon gotowy do konfiguracji

🚚 Wysyłka: InPost (kurier lub paczkomat), koszt 15 zł
📍 Odbiór osobisty: Warszawa, Mokotów (okolice metra Wilanowska)
💬 Negocjacje: możliwe przy szybkiej decyzji
✅ Możliwość sprawdzenia i przetestowania przed zakupem

Odpowiadam na wiadomości zwykle w ciągu 30 minut.
Zapraszam do kontaktu!
```

**Cena:** 2 899 zł (do negocjacji)

---

### 9.2 Przykład: Odzież

**Tytuł:**
```
Kurtka The North Face 700 rozmiar L - Puchowa, Czarna
```

**Treść:**
```
Sprzedaję oryginalną kurtkę puchową The North Face z wypełnieniem 700 cuin.
Ciepła, lekka i kompaktowa - idealna na zimę i górskie wycieczki.

📋 Szczegóły:
• Marka: The North Face
• Model: Aconcagua Jacket
• Rozmiar: L (US) / 52 (EU)
• Kolor: TNF Black (czarny)
• Wypełnienie: Puch gęsi 700 cuin (certyfikowany RDS)
• Materiał zewnętrzny: 100% nylon ripstop, wodoodporny
• Sezon: Jesień/Zima

📏 Wymiary (zmierzone na płasko):
• Długość całkowita: 72 cm
• Szerokość pod pachami: 58 cm
• Długość rękawa: 68 cm
• Szerokość ramion: 48 cm

✅ Stan: BARDZO DOBRY
Noszona przez jeden sezon (ok. 20 razy). Prana zgodnie z instrukcją 
(środek do puchu, suszarka z piłeczkami).
Bez plam, dziur, przetarć. Zamki sprawne. Puch równomiernie 
rozłożony, bez zbitych miejsc.
Jedyna wada: lekkie wytarcie na łokciach (normalne dla kurtek 
puchowych, widoczne na zdjęciu 6).

📦 W zestawie:
• Kurtka The North Face Aconcagua
• Oryginalne opakowanie (woreczek strunowy TNF)
• Metki: wycięta metka z ceną, metka składu na miejscu

ℹ️ Powód sprzedaży: kupiłem rozmiar za duży, teraz mam M.

🚚 Wysyłka: InPost paczkomat lub kurier (15 zł)
📍 Odbiór osobisty: Kraków, Krowodrza

Zapraszam do kontaktu - odpowiadam szybko!
```

**Cena:** 549 zł

---

## 10. ZASADY GENEROWANIA PRZEZ AGENTA AI

### 10.1 Parametry wejściowe (wymagane)

```yaml
wymagane:
  - nazwa_produktu: "string"
  - kategoria: "enum[elektronika, odziez, meble, motoryzacja, inne]"
  - stan: "enum[nowy, idealny, bardzo_dobry, dobry, dostateczny, uszkodzony]"
  - cena_oczekiwana: "number | null"
  - zdjecia: "array[min: 3]"

opcjonalne:
  - marka: "string | null"
  - model: "string | null"
  - parametry_techniczne: "object"
  - wady: "string[]"
  - akcesoria: "string[]"
  - powod_sprzedazy: "string"
  - lokalizacja: "string"
  - wysylka: "boolean"
```

### 10.2 Proces generowania

```yaml
krok_1_analiza:
  - Zidentyfikuj kategorię produktu
  - Określ wymagane atrybuty dla kategorii
  - Sprawdź kompletność danych wejściowych
  - Jeśli brakuje kluczowych danych → zapytaj użytkownika

krok_2_tytul:
  - Zastosuj formułę dla kategorii
  - Sprawdź limit znaków (50-70)
  - Zweryfikuj brak zakazanych słów
  - Upewnij się, że słowo kluczowe jest na początku

krok_3_cena:
  - Jeśli brak ceny → zapytaj lub zasugeruj zakres
  - Zastosuj formułę wyceny
  - Dostosuj do psychologii cen
  - Dodaj margines negocjacji jeśli wskazano

krok_4_tresc:
  - Użyj szablonu dla kategorii
  - Wypełnij wszystkie sekcje
  - Dostosuj język do kategorii
  - Sprawdź długość (150-400 słów)

krok_5_weryfikacja:
  - Przejdź checklist jakości
  - Oblicz punktację
  - Jeśli <75 pkt → zasugeruj poprawki
  - Wygeneruj raport jakości
```

### 10.3 Odpowiedź agenta

```yaml
format_odpowiedzi:
  tytul: "string"
  tresc: "string (markdown)"
  cena:
    kwota: "number"
    negocjacje: "boolean"
  atrybuty:
    kategoria: "string"
    stan: "string"
    lokalizacja: "string"
    wysylka: "boolean"
    inne: "object"
  jakosc:
    punktacja: "number"
    poziom: "enum[excellent, good, acceptable, needs_improvement]"
    sugestie: "string[]"
  zdjecia:
    kolejnosc_sugerowana: "string[]"
    brakujace: "string[]"
```

---

**Koniec dokumentu reguł dla OLX**