# Polityka Prywatności Serwisu Marketplace Assistant

> **UWAGA:** Niniejszy dokument jest draftem wymagającym weryfikacji przez prawnika przed publikacją.
> Data sporządzenia draftu: 2026-03-19

---

## 1. Administrator danych osobowych

Administratorem Twoich danych osobowych jest [IMIĘ I NAZWISKO], prowadzący jednoosobową działalność gospodarczą pod firmą [NAZWA FIRMY], z siedzibą w [ADRES], NIP: [NIP], REGON: [REGON] (dalej: „Administrator").

Kontakt z Administratorem: [EMAIL_KONTAKTOWY]

---

## 2. Jakie dane zbieramy?

### 2.1. Użytkownicy zarejestrowani (logowanie przez Google)

Podczas logowania przez Google OAuth pobieramy:
- **Imię i nazwisko** — wyświetlanie w profilu
- **Adres e-mail** — identyfikacja konta, kontakt
- **Zdjęcie profilowe** — wyświetlanie w interfejsie (opcjonalne)

Dodatkowo przechowujemy:
- **Plan taryfowy i liczbę kredytów** — obsługa subskrypcji
- **Wygenerowane ogłoszenia** — tytuły, opisy, zdjęcia produktów, parametry generacji
- **Szablony ogłoszeń** — predefiniowane szablony przechowywane na koncie użytkownika (dostępne w planie RESELER), zawierające: nazwę, platformę, ton, stan produktu, preferencje dostawy, treść szablonu, notatki
- **Historia aktywności** — rejestr działań użytkownika (generowanie, zapisywanie, publikowanie, sprzedaż, archiwizacja, usuwanie ogłoszeń) przechowywany w modelu ActivityLog

### 2.2. Goście (niezarejestrowani)

Dla niezarejestrowanych użytkowników przechowujemy:
- **Anonimowy identyfikator (UUID)** — generowany losowo, przechowywany w przeglądarce (localStorage). Nie jest to dana osobowa — nie pozwala na identyfikację osoby.
- **Zahaszowany adres IP** — jednokierunkowy hash, służący do rate-limitingu. Nie przechowujemy surowych adresów IP.

### 2.3. Dane płatnicze

Dane płatnicze (numer karty, dane BLIK) są przetwarzane wyłącznie przez Stripe, Inc. i **nie są przechowywane** w naszym Serwisie. Szczegóły w [Polityce prywatności Stripe](https://stripe.com/privacy).

### 2.4. Zdjęcia produktów

Zdjęcia przesłane przez Użytkownika:
- Są przesyłane do OpenAI API w celu analizy przez AI (chwilowo, nie są przechowywane przez OpenAI)
- Po zapisaniu ogłoszenia: thumbnails (zmniejszone kopie) przechowywane w Supabase Storage
- Użytkownik może je usunąć w dowolnym momencie (usunięcie ogłoszenia kasuje też zdjęcia)

---

## 3. W jakim celu przetwarzamy dane?

| Cel | Dane | Podstawa prawna (RODO) |
|---|---|---|
| Świadczenie usługi (generowanie ogłoszeń) | Imię, email, zdjęcia produktów | Art. 6 ust. 1 lit. b — wykonanie umowy |
| Obsługa konta użytkownika | Imię, email, avatar | Art. 6 ust. 1 lit. b — wykonanie umowy |
| Obsługa płatności i subskrypcji | Email (przekazywany do Stripe) | Art. 6 ust. 1 lit. b — wykonanie umowy |
| Rate-limiting gości | UUID, hash IP | Art. 6 ust. 1 lit. f — prawnie uzasadniony interes (zabezpieczenie przed nadużyciami) |
| Rozpatrywanie reklamacji | Email, dane konta | Art. 6 ust. 1 lit. b — wykonanie umowy |
| Wystawianie faktur | Dane do faktury (jeśli podane) | Art. 6 ust. 1 lit. c — obowiązek prawny |
| Marketing bezpośredni (email) | Email | Art. 6 ust. 1 lit. a — zgoda (opcjonalna) |
| Prowadzenie historii aktywności | Typ akcji, ID ogłoszenia, data | Art. 6 ust. 1 lit. b — wykonanie umowy |

---

## 4. Komu udostępniamy dane?

Twoje dane mogą być przekazywane następującym podmiotom (procesorom danych):

| Podmiot | Cel | Lokalizacja | Zabezpieczenia |
|---|---|---|---|
| **Google** (OAuth) | Uwierzytelnianie | USA | Standardowe klauzule umowne (SCCs) |
| **OpenAI** | Generowanie treści AI | USA | SCCs, Data Processing Agreement |
| **Supabase** | Baza danych, storage | EU/USA | SCCs, szyfrowanie |
| **Stripe** | Płatności | EU | Certyfikat PCI DSS Level 1 |
| **Vercel** | Hosting aplikacji | EU/USA | SCCs, Edge Functions |

**Nie sprzedajemy** Twoich danych osobowych osobom trzecim.

**Nie wykorzystujemy** treści Twoich ogłoszeń do trenowania modeli AI ani w celach marketingowych.

---

## 5. Jak długo przechowujemy dane?

| Dane | Okres przechowywania |
|---|---|
| Dane konta (imię, email) | Do momentu usunięcia konta |
| Ogłoszenia i zdjęcia | Do momentu usunięcia przez Użytkownika lub usunięcia konta |
| Szablony ogłoszeń | Do momentu usunięcia przez Użytkownika lub usunięcia konta |
| Historia aktywności | Ostatnie 50 zdarzeń per użytkownik |
| Dane do faktur | 5 lat (obowiązek podatkowy) |
| Logi rate-limitingu (hash IP) | 30 dni |
| UUID gości | Do czyszczenia localStorage przez Użytkownika |

Po usunięciu konta: dane osobowe usuwane w ciągu 30 dni. Dane wymagane prawnie (faktury) przechowywane przez wymagany okres.

---

## 6. Twoje prawa

Na podstawie RODO przysługują Ci następujące prawa:

### 6.1. Prawo dostępu (art. 15 RODO)
Masz prawo uzyskać potwierdzenie, czy przetwarzamy Twoje dane, oraz dostęp do nich.

### 6.2. Prawo do sprostowania (art. 16 RODO)
Masz prawo żądać poprawienia nieprawidłowych danych. W Serwisie dane profilu (imię, avatar) są pobierane z Google — zmiany dokonujesz w koncie Google.

### 6.3. Prawo do usunięcia ("prawo do bycia zapomnianym") (art. 17 RODO)
Masz prawo żądać usunięcia swoich danych. Możesz:
- Usunąć pojedyncze ogłoszenia w Dashboardzie
- Usunąć konto (usuwa wszystkie dane: profil, ogłoszenia, zdjęcia)
- Skontaktować się z nami emailowo w celu usunięcia danych

### 6.4. Prawo do ograniczenia przetwarzania (art. 18 RODO)
Masz prawo żądać ograniczenia przetwarzania danych w określonych sytuacjach.

### 6.5. Prawo do przenoszenia danych (art. 20 RODO)
Masz prawo otrzymać swoje dane w ustrukturyzowanym formacie. Serwis udostępnia:
- Eksport ogłoszeń do CSV (dostępny w Dashboardzie)
- Na życzenie: eksport pełnych danych konta w formacie JSON

### 6.6. Prawo do sprzeciwu (art. 21 RODO)
Masz prawo sprzeciwić się przetwarzaniu danych opartemu na prawnie uzasadnionym interesie (art. 6.1.f).

### 6.7. Prawo do wycofania zgody
Jeśli przetwarzanie oparte jest na zgodzie (np. marketing), możesz ją wycofać w dowolnym momencie. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania przed wycofaniem.

### 6.8. Prawo do skargi
Masz prawo złożyć skargę do organu nadzorczego:
**Prezes Urzędu Ochrony Danych Osobowych**
ul. Stawki 2, 00-193 Warszawa
www.uodo.gov.pl

---

## 7. Pliki cookies i technologie śledzące

### 7.1. Cookies niezbędne

| Cookie | Cel | Czas |
|---|---|---|
| `next-auth.session-token` | Sesja logowania (JWT) | Do wylogowania |
| `next-auth.csrf-token` | Ochrona CSRF | Sesja |
| `next-auth.callback-url` | URL powrotny po logowaniu | Sesja |
| `theme` | Preferencja ciemny/jasny motyw | Trwały |

### 7.2. Local Storage / IndexedDB

| Klucz | Technologia | Cel | Czas |
|---|---|---|---|
| `guest_uuid` | Local Storage | Identyfikacja gościa (rate-limiting) | Do ręcznego usunięcia |
| `pending_ad` | IndexedDB | Tymczasowe ogłoszenie (soft-wall) | Do zalogowania lub ręcznego usunięcia |

### 7.3. Cookies analityczne i marketingowe

Serwis **nie korzysta** z:
- Google Analytics
- Facebook Pixel
- Żadnych zewnętrznych narzędzi śledzących

W przyszłości, jeśli zdecydujemy się na analitykę, poinformujemy Użytkowników i uzyskamy zgodę (cookie banner).

---

## 8. Bezpieczeństwo danych

Stosujemy następujące środki bezpieczeństwa:
- **Szyfrowanie w transmisji:** HTTPS (TLS 1.3) dla całej komunikacji
- **Szyfrowanie w spoczynku:** Baza danych Supabase z szyfrowaniem na poziomie dysku
- **Uwierzytelnianie:** Google OAuth 2.0 (nie przechowujemy haseł)
- **Tokeny JWT:** Bezstanowa sesja, podpisana kluczem AUTH_SECRET
- **Row Level Security (RLS):** Supabase Storage — użytkownik ma dostęp tylko do swoich plików
- **Hashowanie IP:** Przechowujemy jedynie jednokierunkowy hash, nie surowy adres IP
- **Minimalizacja danych:** Zbieramy tylko niezbędne minimum

---

## 9. Transfer danych poza EOG

Niektórzy nasi dostawcy usług mają siedziby w USA (OpenAI, Google, Vercel). Transfer danych odbywa się na podstawie:
- **Standardowych klauzul umownych (SCCs)** zatwierdzonych przez Komisję Europejską
- **Data Processing Agreements (DPA)** z każdym dostawcą

Zapewniamy, że transfer danych odbywa się z zachowaniem odpowiedniego poziomu ochrony wymaganego przez RODO.

---

## 10. Dane dzieci

Serwis nie jest przeznaczony dla osób poniżej 16 roku życia. Nie zbieramy świadomie danych od dzieci. Jeśli odkryjemy, że zebrano dane osoby niepełnoletniej, niezwłocznie je usuniemy.

---

## 11. Zmiany w Polityce Prywatności

11.1. Zastrzegamy sobie prawo do aktualizacji niniejszej Polityki Prywatności.

11.2. O istotnych zmianach poinformujemy Użytkowników drogą elektroniczną (email) co najmniej 14 dni przed wejściem zmian w życie.

11.3. Aktualna wersja Polityki Prywatności jest zawsze dostępna w Serwisie.

---

## 12. Kontakt

W sprawach związanych z ochroną danych osobowych prosimy o kontakt:

**Email:** [EMAIL_KONTAKTOWY]

**Adres:** [IMIĘ I NAZWISKO], [ADRES]

---

*Draft sporządzony 2026-03-19. Wymaga weryfikacji przez prawnika przed publikacją.*
