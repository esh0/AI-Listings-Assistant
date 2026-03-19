# Regulamin Serwisu Marketplace Assistant

> **UWAGA:** Niniejszy dokument jest draftem wymagającym weryfikacji przez prawnika przed publikacją.
> Data sporządzenia draftu: 2026-03-06

---

## 1. Postanowienia ogólne

1.1. Niniejszy Regulamin określa zasady korzystania z serwisu internetowego Marketplace Assistant (dalej: „Serwis"), dostępnego pod adresem [ADRES_STRONY].

1.2. Właścicielem i administratorem Serwisu jest [IMIĘ I NAZWISKO], prowadzący jednoosobową działalność gospodarczą pod firmą [NAZWA FIRMY], z siedzibą w [ADRES], NIP: [NIP], REGON: [REGON] (dalej: „Usługodawca").

1.3. Kontakt z Usługodawcą możliwy jest za pośrednictwem poczty elektronicznej: [EMAIL_KONTAKTOWY].

1.4. Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu.

---

## 2. Definicje

- **Serwis** — aplikacja internetowa Marketplace Assistant umożliwiająca generowanie ogłoszeń sprzedażowych z wykorzystaniem sztucznej inteligencji.
- **Użytkownik** — osoba fizyczna korzystająca z Serwisu, zarówno niezarejestrowana (Gość), jak i zarejestrowana.
- **Gość** — Użytkownik korzystający z Serwisu bez zakładania Konta, w ramach darmowego limitu generacji.
- **Konto** — indywidualny profil Użytkownika w Serwisie, utworzony po zalogowaniu przez Google OAuth.
- **Usługa** — generowanie treści ogłoszeń sprzedażowych z wykorzystaniem sztucznej inteligencji na podstawie zdjęć i parametrów podanych przez Użytkownika.
- **Kredyt** — jednostka uprawniająca do jednorazowego skorzystania z Usługi generowania ogłoszenia.
- **Subskrypcja** — cykliczna (miesięczna) opłata za dostęp do wybranego planu taryfowego.
- **Dostawka** — jednorazowy zakup dodatkowych Kredytów, niezwiązany z Subskrypcją.
- **Plan** — jeden z dostępnych poziomów taryfowych: Free, Starter, Reseler.
- **Szablon** — wzór opisu ogłoszenia z dynamicznymi polami, zapisany w Koncie Użytkownika.

---

## 3. Zasady korzystania z Serwisu

### 3.1. Goście (niezarejestrowani)

3.1.1. Gość może korzystać z Usługi bez zakładania Konta, w ramach darmowego limitu: 3 generacje, maksymalnie 1 zdjęcie na generację.

3.1.2. Wygenerowane treści są wyświetlane Gościowi, ale nie są zapisywane w Serwisie. Aby zapisać ogłoszenie, wymagana jest rejestracja.

3.1.3. Usługodawca identyfikuje Gości za pomocą anonimowego identyfikatora (UUID) oraz adresu IP w formie zahaszowanej. Nie są to dane osobowe w rozumieniu RODO.

### 3.2. Użytkownicy zarejestrowani

3.2.1. Rejestracja odbywa się wyłącznie przez logowanie kontem Google (Google OAuth).

3.2.2. Podczas rejestracji Serwis pobiera z konta Google: imię, adres e-mail oraz zdjęcie profilowe.

3.2.3. Po rejestracji Użytkownik otrzymuje Plan Free z 5 Kredytami miesięcznie.

3.2.4. Użytkownik zobowiązuje się do:
- Korzystania z Serwisu zgodnie z jego przeznaczeniem
- Niepodejmowania prób obejścia limitów i zabezpieczeń
- Niewytwarzania treści niezgodnych z prawem, obraźliwych lub wprowadzających w błąd
- Niekorzystania z Serwisu w sposób automatyczny (boty, scraping) bez pisemnej zgody Usługodawcy

---

## 4. Plany taryfowe i płatności

### 4.1. Dostępne plany

| Plan | Cena brutto/mies. | Generacje/mies. | Max zdjęć/gen. | Szablony |
|---|---|---|---|---|
| Free | 0 zł | 5 | 3 | — |
| Starter | 19,99 zł | 30 | 5 | 3 |
| Reseler | 49,99 zł | 80 | 8 | 10 |

*Ceny brutto (zawierają VAT 23%, o ile Usługodawca jest czynnym podatnikiem VAT).*

### 4.2. Dostawki kredytów

| Pakiet | Cena brutto |
|---|---|
| 10 Kredytów | 9,99 zł |
| 30 Kredytów | 24,99 zł |
| 60 Kredytów | 39,99 zł |

### 4.3. Zasady płatności

4.3.1. Płatności obsługiwane są przez Stripe, Inc. (dalej: „Operator płatności"). Dostępne metody: BLIK, karty płatnicze (Visa, Mastercard).

4.3.2. Subskrypcja jest odnawiana automatycznie co miesiąc. Użytkownik może anulować Subskrypcję w dowolnym momencie przez Panel klienta Stripe.

4.3.3. Anulowanie Subskrypcji nie powoduje zwrotu za bieżący okres rozliczeniowy. Użytkownik zachowuje dostęp do końca opłaconego okresu.

4.3.4. Kredyty z Subskrypcji resetują się na początku każdego okresu rozliczeniowego. Niewykorzystane Kredyty subskrypcji nie przechodzą na kolejny okres.

4.3.5. Kredyty z Dostawek nie wygasają i są dostępne do momentu ich wykorzystania.

4.3.6. System zużywa najpierw Kredyty z Subskrypcji, a następnie Kredyty z Dostawek.

4.3.7. Kredyt jest konsumowany w momencie zlecenia generacji ogłoszenia (przed wyświetleniem wyniku), niezależnie od tego, czy Użytkownik zapisze wygenerowane ogłoszenie.

### 4.4. Faktury

4.4.1. Faktury VAT wystawiane są automatycznie przez Operatora płatności i dostępne w Panelu klienta Stripe.

4.4.2. Użytkownik może podać dane do faktury (NIP) w Panelu klienta Stripe.

---

## 5. Usługa generowania ogłoszeń

5.1. Usługa polega na przetworzeniu zdjęć produktu i parametrów podanych przez Użytkownika w celu wygenerowania treści ogłoszenia sprzedażowego z wykorzystaniem modelu sztucznej inteligencji.

5.2. Wygenerowana treść ma charakter **propozycji**. Użytkownik jest odpowiedzialny za weryfikację treści przed publikacją na platformie marketplace.

5.3. Usługodawca **nie gwarantuje**:
- Poprawności rozpoznania produktu ze zdjęć
- Trafności sugestii cenowej
- Zgodności wygenerowanej treści z regulaminem docelowej platformy marketplace
- Skuteczności sprzedażowej ogłoszenia

5.4. Usługodawca dołoży starań, aby generowane treści były wysokiej jakości i zgodne z zasadami poszczególnych platform, ale końcowa odpowiedzialność za treść publikowanego ogłoszenia spoczywa na Użytkowniku.

5.5. Użytkownik zachowuje pełne prawa do wygenerowanych treści i może je dowolnie wykorzystywać, modyfikować i publikować.

---

## 6. Prawa własności intelektualnej

6.1. Serwis, jego kod źródłowy, design, logo i marka są własnością Usługodawcy i podlegają ochronie prawnej.

6.2. Treści wygenerowane przez AI na zlecenie Użytkownika stanowią własność Użytkownika od momentu ich wygenerowania.

6.3. Użytkownik udziela Usługodawcy niewyłącznej, nieodpłatnej licencji na przechowywanie wygenerowanych treści w bazie danych Serwisu w celu świadczenia Usługi (wyświetlanie, edycja, eksport).

6.4. Usługodawca nie wykorzystuje treści Użytkowników w celach marketingowych ani nie udostępnia ich osobom trzecim.

---

## 7. Reklamacje

7.1. Użytkownik ma prawo złożyć reklamację dotyczącą działania Serwisu na adres email: [EMAIL_KONTAKTOWY].

7.2. Reklamacja powinna zawierać: opis problemu, datę wystąpienia, adres email Konta.

7.3. Usługodawca rozpatrzy reklamację w terminie 14 dni od jej otrzymania i poinformuje Użytkownika o wyniku drogą elektroniczną.

---

## 8. Prawo odstąpienia od umowy

8.1. Zgodnie z art. 38 pkt 13 ustawy z dnia 30 maja 2014 r. o prawach konsumenta, Użytkownikowi **nie przysługuje** prawo odstąpienia od umowy o dostarczanie treści cyfrowych, które nie są zapisane na nośniku materialnym, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną zgodą konsumenta przed upływem terminu do odstąpienia od umowy i po poinformowaniu go przez przedsiębiorcę o utracie prawa odstąpienia od umowy.

8.2. Użytkownik wyraża powyższą zgodę w momencie:
- Aktywacji Subskrypcji (rozpoczęcie korzystania z Kredytów)
- Zakupu Dostawki Kredytów i zlecenia pierwszej generacji

8.3. Przed rozpoczęciem świadczenia, Użytkownik zostanie poinformowany o utracie prawa odstąpienia i musi potwierdzić zgodę.

8.4. W przypadku problemów technicznych uniemożliwiających korzystanie z zakupionej Usługi, Usługodawca rozpatrzy indywidualnie możliwość zwrotu lub przedłużenia okresu subskrypcji.

---

## 9. Odpowiedzialność

9.1. Usługodawca nie ponosi odpowiedzialności za:
- Treści publikowane przez Użytkowników na platformach marketplace
- Skutki transakcji zawartych na podstawie wygenerowanych ogłoszeń
- Przerwy w działaniu Serwisu wynikające z przyczyn niezależnych (awarie serwerów, dostawców usług)
- Zmiany regulaminów platform marketplace wpływające na zgodność wygenerowanych treści

9.2. Usługodawca odpowiada za szkody wyrządzone Użytkownikowi z winy umyślnej, w granicach rzeczywiście poniesionej straty.

9.3. Łączna odpowiedzialność Usługodawcy wobec Użytkownika jest ograniczona do kwoty opłat uiszczonych przez Użytkownika w okresie ostatnich 3 miesięcy.

---

## 10. Zmiana Regulaminu

10.1. Usługodawca zastrzega sobie prawo do zmiany Regulaminu.

10.2. O zmianach Regulaminu Użytkownicy zostaną poinformowani drogą elektroniczną (email) co najmniej 14 dni przed wejściem zmian w życie.

10.3. Kontynuowanie korzystania z Serwisu po wejściu zmian w życie oznacza akceptację nowego Regulaminu.

10.4. Użytkownik, który nie akceptuje zmian, może usunąć Konto i anulować Subskrypcję.

---

## 11. Postanowienia końcowe

11.1. Regulamin podlega prawu polskiemu.

11.2. W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy Kodeksu cywilnego, ustawy o prawach konsumenta oraz RODO.

11.3. Spory wynikające z korzystania z Serwisu będą rozstrzygane przez sąd właściwy dla siedziby Usługodawcy, z zastrzeżeniem praw konsumenta do wyboru sądu.

11.4. Regulamin wchodzi w życie z dniem [DATA_PUBLIKACJI].

---

*Draft sporządzony 2026-03-06. Wymaga weryfikacji przez prawnika przed publikacją.*
