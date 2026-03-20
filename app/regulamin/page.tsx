import { LegalLayout } from "@/components/LegalLayout";

export const metadata = {
    title: "Regulamin — Marketplace AI",
    description: "Regulamin serwisu Marketplace AI",
};

export default function ReguaminPage() {
    return (
        <LegalLayout
            title="Regulamin Aplikacji Marketplace AI"
            subtitle="Obowiązuje od: 19 marca 2026 r."
        >
            <h2>§ 1. Postanowienia ogólne</h2>
            <p>1. Niniejszy regulamin (dalej: „Regulamin") określa zasady i warunki korzystania z aplikacji „Marketplace AI" (dalej: „Aplikacja") oraz usług świadczonych przez Usługodawcę.</p>
            <p>2. Aplikacja służy do automatycznego generowania treści ogłoszeń sprzedażowych na platformy marketplace (OLX, Allegro Lokalnie, Facebook Marketplace, Vinted) z wykorzystaniem sztucznej inteligencji na podstawie zdjęć i parametrów podanych przez Użytkownika. Aplikacja jest przeznaczona zarówno dla przedsiębiorców, jak i konsumentów.</p>
            <p>3. Regulamin jest regulaminem, o którym mowa w art. 8 ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną (dalej: „Ustawa o świadczeniu usług drogą elektroniczną").</p>
            <p>4. Usługodawcą jest Anna Szałach, zamieszkała w Grobelno (adres: ul. Radosna 36, 82-200 Grobelno) (dalej: „Usługodawca").</p>
            <p>5. Kontakt z Usługodawcą jest możliwy za pomocą:</p>
            <ul>
                <li>poczty elektronicznej: kontakt@marketplace-ai.pl,</li>
                <li>poczty tradycyjnej: ul. Radosna 36, 82-200 Grobelno.</li>
            </ul>
            <p>6. Zgodnie z przepisami Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2022/2065 (akt o usługach cyfrowych, DSA), Usługodawca wyznaczył punkt kontaktowy do komunikacji z organami państw członkowskich UE oraz Usługobiorcami w sprawach objętych regulacją DSA. Punkt kontaktowy jest dostępny pod adresem: kontakt@marketplace-ai.pl.</p>
            <p>7. Przed rozpoczęciem korzystania z Aplikacji Usługobiorca zobowiązany jest zapoznać się z Regulaminem oraz Polityką prywatności dostępną pod adresem: <a href="/polityka-prywatnosci">marketplace-ai.pl/polityka-prywatnosci</a>.</p>

            <hr />

            <h2>§ 2. Definicje</h2>
            <p>Użyte w Regulaminie wyrazy pisane wielką literą mają następujące znaczenie:</p>
            <ul>
                <li><strong>Aplikacja</strong> — aplikacja internetowa „Marketplace AI" dostępna pod adresem marketplace-ai.pl, umożliwiająca generowanie ogłoszeń sprzedażowych z wykorzystaniem sztucznej inteligencji.</li>
                <li><strong>Cennik</strong> — dokument lub informacja dostępna w Aplikacji określająca aktualne ceny Usługi, dostępne Plany, Okresy Subskrypcji i inne warunki tam wskazane.</li>
                <li><strong>Dostawka</strong> — jednorazowy zakup dodatkowych Kredytów, niezwiązany z Subskrypcją; Kredyty z Dostawki nie wygasają.</li>
                <li><strong>Gość</strong> — Usługobiorca korzystający z Aplikacji bez założonego Konta, w ramach darmowego limitu generacji.</li>
                <li><strong>Konsument</strong> — osoba fizyczna dokonująca z Usługodawcą czynności prawnej niezwiązanej bezpośrednio z jej działalnością gospodarczą lub zawodową.</li>
                <li><strong>Konto</strong> — panel tworzony w systemie informatycznym Aplikacji po zalogowaniu przez Google OAuth, umożliwiający Usługobiorcy korzystanie z pełnych funkcjonalności Aplikacji.</li>
                <li><strong>Kredyt</strong> — jednostka uprawniająca do jednorazowego skorzystania z Usługi generowania ogłoszenia; Kredyt jest konsumowany w momencie zlecenia generacji (przed wyświetleniem wyniku).</li>
                <li><strong>Niezgodność</strong> — niezgodność Usługi korzystania z Aplikacji z Umową (kryteria oceny zgodności określa art. 43k ust. 1–2 Ustawy o prawach konsumenta).</li>
                <li><strong>Okres Subskrypcji</strong> — miesięczny okres, na który Usługodawca udostępnia Usługobiorcy Usługę zgodnie z Cennikiem.</li>
                <li><strong>Opłata Subskrypcyjna</strong> — opłata uiszczana przez Usługobiorcę z góry za dany Okres Subskrypcji, ustalana zgodnie z Cennikiem obowiązującym w chwili zamówienia.</li>
                <li><strong>Plan</strong> — jeden z dostępnych poziomów taryfowych: Free (bezpłatny), Starter, Reseler.</li>
                <li><strong>Polityka prywatności</strong> — dokument zawierający informacje o przetwarzaniu danych osobowych Usługobiorców przez Usługodawcę.</li>
                <li><strong>Przedsiębiorca na prawach Konsumenta</strong> — osoba fizyczna zawierająca umowę bezpośrednio związaną z jej działalnością gospodarczą, gdy z treści tej umowy wynika, że nie posiada ona dla tej osoby charakteru zawodowego, wynikającego w szczególności z przedmiotu wykonywanej przez nią działalności gospodarczej.</li>
                <li><strong>Szablon</strong> — zapisany w Koncie Usługobiorcy wzór parametrów generowania ogłoszeń, dostępny w Planie Reseler.</li>
                <li><strong>Treści Usługobiorcy</strong> — wszelkie dane, pliki, zdjęcia i materiały zapisane przez Usługobiorcę w Aplikacji (w tym wygenerowane ogłoszenia).</li>
                <li><strong>Umowa</strong> — umowa o dostarczanie usługi cyfrowej w rozumieniu Ustawy o prawach konsumenta, zawierana między Usługodawcą a Usługobiorcą na warunkach Regulaminu.</li>
                <li><strong>Usługa</strong> / <strong>Usługa korzystania z Aplikacji</strong> — usługa cyfrowa w rozumieniu Ustawy o prawach konsumenta, polegająca na umożliwieniu Usługobiorcy korzystania z funkcjonalności Aplikacji zgodnie z wybranym Planem.</li>
                <li><strong>Usługobiorca</strong> — osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej korzystająca z Aplikacji (Konsument, Przedsiębiorca na prawach Konsumenta lub Przedsiębiorca).</li>
                <li><strong>Usługodawca</strong> — podmiot zdefiniowany w § 1 ust. 4 Regulaminu.</li>
                <li><strong>Ustawa o prawach konsumenta</strong> — ustawa z dnia 30 maja 2014 r. o prawach konsumenta.</li>
            </ul>

            <hr />

            <h2>§ 3. Wymagania techniczne i zasady korzystania z Aplikacji</h2>
            <p>1. W celu prawidłowego korzystania z Aplikacji niezbędne jest łącznie:</p>
            <ul>
                <li>połączenie z siecią Internet,</li>
                <li>przeglądarka internetowa obsługująca JavaScript,</li>
                <li>posiadanie aktywnego konta poczty elektronicznej,</li>
                <li>posiadanie konta Google (do rejestracji i logowania).</li>
            </ul>
            <p>2. Usługodawca stosuje kryptograficzną ochronę transferu danych (szyfrowanie SSL/TLS) oraz właściwe środki organizacyjne i techniczne w celu uniemożliwienia dostępu osobom trzecim do danych Usługobiorców.</p>
            <p>3. Pomimo stosowanych zabezpieczeń, korzystanie z sieci Internet może być zagrożone dostaniem się szkodliwego oprogramowania do urządzenia Usługobiorcy. Usługodawca zaleca stosowanie aktualnych programów antywirusowych.</p>
            <p>4. W ramach Aplikacji zabronione jest korzystanie z wirusów, botów, robaków lub innych kodów automatyzujących procesy bez pisemnej zgody Usługodawcy.</p>
            <p>5. Usługobiorca zobowiązuje się do:</p>
            <ul>
                <li>podawania wyłącznie danych zgodnych ze stanem rzeczywistym,</li>
                <li>korzystania z Aplikacji zgodnie z jej przeznaczeniem i obowiązującym prawem,</li>
                <li>niewytwarzania treści niezgodnych z prawem, obraźliwych lub wprowadzających w błąd,</li>
                <li>niedokonywania prób obejścia limitów i zabezpieczeń Aplikacji.</li>
            </ul>

            <hr />

            <h2>§ 4. Umowa o dostarczanie Usługi</h2>
            <p>1. Na podstawie Umowy Usługodawca umożliwia Usługobiorcy korzystanie z funkcjonalności Aplikacji w zakresie wynikającym z wybranego Planu.</p>
            <p>2. Korzystanie z Aplikacji w Planie Free (bezpłatnym) nie wymaga rejestracji — Gość może wygenerować do 3 ogłoszeń bez zakładania Konta. Treści wygenerowane przez Gościa nie są zapisywane w Serwisie; aby zapisać ogłoszenie, wymagana jest rejestracja.</p>
            <p>3. W celu zawarcia Umowy i założenia Konta Usługobiorca powinien:</p>
            <ul>
                <li>wejść na stronę internetową Aplikacji i wybrać opcję logowania przez Google,</li>
                <li>zalogować się kontem Google — Aplikacja pobiera z konta Google: imię, adres e-mail oraz zdjęcie profilowe,</li>
                <li>zaakceptować Regulamin oraz Politykę prywatności.</li>
            </ul>
            <p>4. Zalogowanie się przez Google i akceptacja Regulaminu jest równoznaczna z zawarciem Umowy. Po rejestracji Usługobiorca otrzymuje Plan Free z 5 Kredytami miesięcznie.</p>
            <p>5. W celu przejścia na Plan płatny (Starter lub Reseler) Usługobiorca wybiera odpowiedni Plan w zakładce Cennik i dokonuje płatności za pośrednictwem operatora płatności Stripe. Zawarcie odpłatnej Umowy następuje z chwilą potwierdzenia płatności przez operatora.</p>
            <p>6. Usługobiorca zachowuje wszystkie Treści Usługobiorcy i dane wprowadzone do Konta niezależnie od zmiany Planu.</p>
            <p>7. Zachowanie zgodności Usługi z Umową nie wymaga instalowania aktualizacji po stronie Usługobiorcy — Aplikacja działa w całości po stronie serwera.</p>
            <p>8. Postanowienia ust. 9–13 poniżej stosuje się wyłącznie do Usługobiorców będących Konsumentami lub Przedsiębiorcami na prawach Konsumenta.</p>
            <p>9. W przypadku braku udzielenia dostępu do Usługi niezwłocznie po zawarciu Umowy, Usługobiorca wzywa Usługodawcę do niezwłocznego udzielenia dostępu za pomocą poczty elektronicznej na adres wskazany w § 1 ust. 5. W przypadku gdy Usługodawca nie udzieli dostępu niezwłocznie po otrzymaniu wezwania, Usługobiorca może odstąpić od Umowy.</p>
            <p>10. Niezależnie od ust. 9, Usługobiorca może odstąpić od Umowy bez wezwania, jeżeli zachodzi co najmniej jeden z przypadków wskazanych w art. 43j ust. 5 Ustawy o prawach konsumenta.</p>
            <p>11. Usługobiorca może wypowiedzieć Umowę w dowolnym momencie poprzez samodzielne usunięcie Konta w Aplikacji lub złożenie dyspozycji usunięcia Konta na adres e-mail wskazany w § 1 ust. 5.</p>
            <p>12. W przypadku naruszenia przez Usługobiorcę postanowień Regulaminu i nieusunięcia naruszenia pomimo wezwania, Usługodawca może wypowiedzieć Umowę z zachowaniem 7-dniowego okresu wypowiedzenia, za pomocą poczty elektronicznej.</p>
            <p>13. Usługodawca usuwa Konto niezwłocznie po otrzymaniu oświadczenia o odstąpieniu lub po upływie okresu wypowiedzenia. Usunięcie Konta jest równoznaczne z archiwizacją Treści Usługobiorcy, a następnie ich usunięciem po zakończeniu okresu archiwizacji określonego w § 12.</p>

            <hr />

            <h2>§ 5. Opłaty i rozliczenia</h2>
            <p>1. Ceny Usług podane w Cenniku są wyrażone w złotych polskich (PLN) i są cenami brutto (zawierają podatek VAT w obowiązującej stawce).</p>
            <p>2. Płatności za Usługę są realizowane za pośrednictwem operatora płatności Stripe, Inc. Funkcję podmiotu obsługującego płatności w imieniu Usługodawcy pełni F.H.U. Krzysztof Szałach, ul. Radosna 36, 82-200 Grobelno, NIP: 579-209-58-51, REGON: 361923647. Dla planów płatnych dostępna jest płatność kartą (Visa, Mastercard); dla jednorazowych Dostawek Kredytów dostępna jest dodatkowo płatność BLIK.</p>
            <p>3. Opłata Subskrypcyjna jest uiszczana automatycznie, cyklicznie z góry co miesiąc, w dniu odpowiadającym dacie zawarcia Umowy. Za dzień płatności uznaje się dzień zaksięgowania kwoty na rachunku Usługodawcy.</p>
            <p>4. Po zaksięgowaniu wpłaty Usługodawca przesyła na adres poczty elektronicznej Usługobiorcy informację o udzieleniu dostępu do wybranego Planu. Faktury VAT są wystawiane automatycznie przez operatora płatności Stripe i dostępne w Panelu klienta Stripe.</p>
            <p>5. Usługodawca wysyła na adres poczty elektronicznej Usługobiorcy następujące wiadomości związane ze świadczoną Usługą:</p>
            <ul>
                <li><strong>Email powitalny</strong> — jednorazowo po pierwszej rejestracji Konta,</li>
                <li><strong>Potwierdzenie aktywacji Planu</strong> — po każdej zmianie na Plan płatny (Starter lub Reseler),</li>
                <li><strong>Potwierdzenie zakupu Doładowania</strong> — po zakupie jednorazowego pakietu Kredytów,</li>
                <li><strong>Potwierdzenie anulowania Subskrypcji</strong> — po dezaktywacji Planu płatnego,</li>
                <li><strong>Powiadomienie o niskim stanie Kredytów</strong> — jednorazowo w danym Okresie Subskrypcji, gdy liczba dostępnych Kredytów subskrypcyjnych spadnie do 1, z informacją o możliwości zakupu Doładowania lub zmiany Planu.</li>
            </ul>
            <p>Wiadomości powyższe mają charakter transakcyjny i serwisowy — są niezbędne do prawidłowej realizacji Usługi lub bezpośrednio z nią związane. Podstawą ich wysyłki jest art. 6 ust. 1 lit. b lub f RODO. Usługobiorca może zrezygnować z powiadomienia o niskim stanie Kredytów, kontaktując się z Administratorem pod adresem wskazanym w § 1 ust. 5.</p>
            <p>6. Brak zapłaty Opłaty Subskrypcyjnej spowoduje wstrzymanie dostępu do płatnych funkcjonalności Aplikacji do momentu zaksięgowania należności.</p>
            <p>7. Kredyty z Subskrypcji odnawiają się na początku każdego Okresu Subskrypcji; niewykorzystane Kredyty subskrypcji nie przechodzą na kolejny okres. Kredyty z Dostawek nie wygasają i są dostępne do ich wykorzystania. System zużywa najpierw Kredyty z Subskrypcji, następnie Kredyty z Dostawek.</p>
            <p>8. Anulowanie Subskrypcji nie powoduje zwrotu za bieżący Okres Subskrypcji. Usługobiorca zachowuje dostęp do końca opłaconego okresu.</p>

            <hr />

            <h2>§ 6. Cennik</h2>
            <p>1. Aktualny Cennik jest dostępny w Aplikacji pod adresem: marketplace-ai.pl/pricing.</p>
            <p>2. Cennik przewiduje bezpłatny Plan Free obejmujący 5 Kredytów miesięcznie.</p>
            <p>3. Usługodawca może dokonać zmiany Cennika w każdym czasie. Zmiana Cennika nie wpływa na wysokość opłat określonych w Umowach zawartych przed zmianą Cennika — nowe ceny obowiązują od kolejnego Okresu Subskrypcji po poinformowaniu Usługobiorcy.</p>

            <hr />

            <h2>§ 7. Reklamacje — Konsumenci oraz Przedsiębiorcy na prawach Konsumenta</h2>
            <p>1. Postanowienia niniejszego paragrafu mają zastosowanie wyłącznie do Konsumentów oraz Przedsiębiorców na prawach Konsumenta.</p>
            <p>2. Dostarczana Usługobiorcy Usługa musi być zgodna z Umową przez cały okres jej dostarczania. Usługodawca ponosi odpowiedzialność za Niezgodność ujawnioną w okresie dostarczania Usługi.</p>
            <p>3. W przypadku ujawnienia Niezgodności Usługobiorca może złożyć reklamację zawierającą żądanie doprowadzenia Usługi do zgodności z Umową. Reklamacja składana jest za pomocą poczty elektronicznej na adres wskazany w § 1 ust. 5.</p>
            <p>4. Reklamacja powinna zawierać:</p>
            <ul>
                <li>imię i nazwisko Usługobiorcy,</li>
                <li>adres poczty elektronicznej,</li>
                <li>opis ujawnionej Niezgodności,</li>
                <li>żądanie doprowadzenia Usługi do zgodności z Umową.</li>
            </ul>
            <p>5. Usługodawca może odmówić doprowadzenia Usługi do zgodności z Umową, jeżeli jest to niemożliwe albo wymagałoby poniesienia nadmiernych kosztów.</p>
            <p>6. Usługodawca udziela odpowiedzi na reklamację za pomocą poczty elektronicznej w terminie 14 dni od dnia jej otrzymania, wskazując czy reklamację uznaje, odmawia jej uwzględnienia, lub odrzuca z powodu bezzasadności.</p>
            <p>7. W przypadku uznania reklamacji Usługodawca doprowadza Usługę do zgodności z Umową w rozsądnym czasie i bez nadmiernych niedogodności dla Usługobiorcy.</p>
            <p>8. W przypadku ujawnienia Niezgodności Usługobiorca może złożyć oświadczenie o odstąpieniu od Umowy, gdy:</p>
            <ul>
                <li>doprowadzenie Usługi do zgodności jest niemożliwe albo wymaga nadmiernych kosztów,</li>
                <li>Usługodawca nie doprowadził Usługi do zgodności w terminie,</li>
                <li>Niezgodność występuje nadal mimo prób jej usunięcia,</li>
                <li>Niezgodność jest na tyle istotna, że uzasadnia odstąpienie bez uprzedniego żądania usunięcia Niezgodności,</li>
                <li>z oświadczenia Usługodawcy wyraźnie wynika, że nie doprowadzi Usługi do zgodności w rozsądnym czasie.</li>
            </ul>
            <p>9. Oświadczenie o odstąpieniu od Umowy może zostać złożone za pomocą poczty elektronicznej na adres wskazany w § 1 ust. 5.</p>

            <hr />

            <h2>§ 8. Reklamacje — Przedsiębiorcy</h2>
            <p>1. Postanowienia niniejszego paragrafu mają zastosowanie wyłącznie do Przedsiębiorców (niebędących Przedsiębiorcami na prawach Konsumenta).</p>
            <p>2. W przypadku ujawnienia niezgodności Usługi z Regulaminem Usługobiorca może złożyć reklamację za pomocą poczty elektronicznej na adres wskazany w § 1 ust. 5, nie później niż w terminie 30 dni od dnia ujawnienia niezgodności.</p>
            <p>3. Reklamacja powinna zawierać: nazwę Usługobiorcy, adres poczty elektronicznej, opis ujawnionej niezgodności.</p>
            <p>4. Usługodawca udziela odpowiedzi na reklamację w terminie 21 dni od jej otrzymania. W przypadkach szczególnie skomplikowanych termin odpowiedzi może się wydłużyć do 30 dni kalendarzowych.</p>

            <hr />

            <h2>§ 9. Prawo odstąpienia od Umowy</h2>
            <p>1. Na podstawie art. 27 i n. Ustawy o prawach konsumenta, Usługobiorca będący Konsumentem ma prawo odstąpić od Umowy bez podania jakiejkolwiek przyczyny w terminie 14 dni od dnia jej zawarcia.</p>
            <p>2. Usługodawca rozszerza prawo do odstąpienia od Umowy również na Przedsiębiorców na prawach Konsumenta oraz pozostałych Przedsiębiorców.</p>
            <p>3. Prawo odstąpienia wykonuje się poprzez złożenie Usługodawcy oświadczenia o odstąpieniu od Umowy przed upływem terminu. Oświadczenie może być złożone w jakiejkolwiek formie, w szczególności za pomocą poczty elektronicznej na adres wskazany w § 1 ust. 5.</p>
            <p>4. W przypadku złożenia oświadczenia o odstąpieniu Usługodawca niezwłocznie przesyła potwierdzenie jego otrzymania za pomocą poczty elektronicznej i usuwa Konto.</p>
            <p>5. W przypadku odstąpienia od odpłatnej Umowy Usługodawca zwraca Usługobiorcy opłatę za bieżący Okres Subskrypcji proporcjonalnie do niewykorzystanego okresu, z uwzględnieniem wartości Kredytów już zużytych.</p>

            <hr />

            <h2>§ 10. Usługa generowania ogłoszeń i sztuczna inteligencja</h2>
            <p>1. Usługa polega na przetworzeniu zdjęć produktu i parametrów podanych przez Usługobiorcę w celu wygenerowania treści ogłoszenia sprzedażowego z wykorzystaniem modelu sztucznej inteligencji GPT-4.1-mini dostarczanego przez OpenAI, L.L.C. (dalej: „Model AI").</p>
            <p>2. Usługodawca informuje, że Aplikacja wykorzystuje Model AI do następujących celów: generowanie tytułu ogłoszenia, opisu produktu, sugestii cenowych oraz analizy zdjęć produktów.</p>
            <p>3. Usługobiorca przyjmuje do wiadomości, że wyniki generowane przez Model AI:</p>
            <ul>
                <li>mają charakter propozycji i mogą zawierać błędy, nieścisłości lub treści niezgodne z rzeczywistością (tzw. halucynacje),</li>
                <li>wymagają weryfikacji przez człowieka przed wykorzystaniem,</li>
                <li>nie stanowią porady prawnej, podatkowej ani innej porady profesjonalnej,</li>
                <li>mogą nie być unikalne — podobne treści mogą zostać wygenerowane dla innych Usługobiorców.</li>
            </ul>
            <p>4. Dane (w tym zdjęcia produktów) wprowadzane przez Usługobiorcę do Aplikacji są przekazywane do OpenAI w celu przetworzenia przez Model AI. OpenAI nie przechowuje tych danych w celu trenowania modeli — szczegóły określa polityka prywatności OpenAI dostępna na stronie openai.com.</p>
            <p>5. Usługobiorca zobowiązuje się do:</p>
            <ul>
                <li>weryfikacji wszystkich wyników wygenerowanych przez Model AI przed ich opublikowaniem,</li>
                <li>niepolegania wyłącznie na wygenerowanych treściach przy podejmowaniu decyzji biznesowych,</li>
                <li>oznaczania treści jako wygenerowanych przez AI tam, gdzie wymaga tego prawo.</li>
            </ul>
            <p>6. Treści wygenerowane przez Model AI na zlecenie Usługobiorcy stanowią własność Usługobiorcy w zakresie dozwolonym przez prawo, z zastrzeżeniem praw dostawców modeli AI. Usługobiorca udziela Usługodawcy niewyłącznej, nieodpłatnej licencji na przechowywanie wygenerowanych treści w bazie danych Aplikacji wyłącznie w celu świadczenia Usługi (wyświetlanie, edycja, eksport). Usługodawca nie wykorzystuje treści Usługobiorców w celach marketingowych ani nie udostępnia ich osobom trzecim.</p>
            <p>7. Usługodawca nie ponosi odpowiedzialności za:</p>
            <ul>
                <li>decyzje podjęte na podstawie wyników wygenerowanych przez Model AI,</li>
                <li>treści publikowane przez Usługobiorców na platformach marketplace oraz skutki transakcji zawartych na ich podstawie,</li>
                <li>zgodność wygenerowanych treści z regulaminami docelowych platform marketplace,</li>
                <li>naruszenia praw własności intelektualnej wynikające z treści wygenerowanych przez Model AI.</li>
            </ul>

            <hr />

            <h2>§ 11. Odpowiedzialność i poziom usług</h2>
            <p>1. Usługodawca zobowiązuje się świadczyć Usługi z dochowaniem należytej staranności.</p>
            <p>2. Strony wyłączają odpowiedzialność Usługodawcy z tytułu utraconych korzyści Usługobiorcy będącego Przedsiębiorcą (wyłączenie nie dotyczy Konsumentów ani Przedsiębiorców na prawach Konsumenta).</p>
            <p>3. W zakresie dozwolonym przez przepisy prawa Usługodawca nie ponosi odpowiedzialności za skutki:</p>
            <ul>
                <li>korzystania z Aplikacji niezgodnie z jej przeznaczeniem,</li>
                <li>podania przez Usługobiorców nieprawidłowych lub nieprawdziwych danych,</li>
                <li>uzyskania dostępu do Konta przez osoby trzecie wskutek niedostatecznego zabezpieczenia danych logowania przez Usługobiorcę.</li>
            </ul>
            <p>4. Usługodawca nie ponosi odpowiedzialności za zakłócenia w funkcjonowaniu Aplikacji wynikające z:</p>
            <ul>
                <li>działania siły wyższej (w tym niedostępności API kluczowych dostawców zewnętrznych, takich jak OpenAI, Supabase, Stripe, lub decyzji organów nadzorczych dotyczących modeli AI),</li>
                <li>prowadzonych prac serwisowych,</li>
                <li>przyczyn leżących po stronie Usługobiorcy lub przyczyn niezależnych od Usługodawcy.</li>
            </ul>
            <p>5. Usługodawca zobowiązuje się przeprowadzać prace serwisowe w sposób możliwie najmniej uciążliwy dla Usługobiorców oraz, w miarę możliwości, z wyprzedzeniem informować ich o planowanych pracach.</p>
            <p>6. Łączna odpowiedzialność Usługodawcy wobec Usługobiorcy będącego Przedsiębiorcą (niebędącego Konsumentem ani Przedsiębiorcą na prawach Konsumenta) jest ograniczona do kwoty opłat uiszczonych przez Usługobiorcę w okresie ostatnich 3 miesięcy.</p>
            <p>7. Usługodawca informuje, że Aplikacja korzysta z systemów monitorowania błędów (Sentry) wyłącznie w celu poprawy jakości i stabilności Usługi. Systemy te nie są wykorzystywane do profilowania Usługobiorców ani w celach marketingowych.</p>

            <hr />

            <h2>§ 12. Dane i dostęp po zakończeniu Umowy</h2>
            <p>1. Po zakończeniu Umowy (usunięciu Konta) Usługodawca zapewnia Usługobiorcy możliwość pobrania jego danych przez 30 dni od dnia zakończenia Umowy.</p>
            <p>2. Po upływie okresu, o którym mowa w ust. 1, Treści Usługobiorcy są trwale usuwane — na żądanie Usługobiorcy może nastąpić wcześniej.</p>
            <p>3. Usługobiorca ma prawo do:</p>
            <ul>
                <li>eksportu ogłoszeń do pliku CSV (dostępne w Dashboardzie),</li>
                <li>eksportu pełnych danych Konta w formacie JSON — na żądanie przesłane na adres wskazany w § 1 ust. 5, zrealizowanego w terminie 30 dni od zgłoszenia.</li>
            </ul>

            <hr />

            <h2>§ 13. Własność intelektualna Usługodawcy</h2>
            <p>1. Wszystkie elementy składowe Aplikacji, w szczególności: nazwa, logo, zdjęcia i opisy, interfejs, oprogramowanie, kod źródłowy oraz bazy danych — podlegają ochronie prawnej na podstawie przepisów ustawy o prawie autorskim i prawach pokrewnych, ustawy Prawo własności przemysłowej, ustawy o zwalczaniu nieuczciwej konkurencji oraz przepisów prawa Unii Europejskiej.</p>
            <p>2. Jakiekolwiek korzystanie z własności intelektualnej Usługodawcy bez jego uprzedniego, wyraźnego zezwolenia jest zabronione.</p>

            <hr />

            <h2>§ 14. Pozasądowe rozwiązywanie sporów — Konsumenci oraz Przedsiębiorcy na prawach Konsumenta</h2>
            <p>1. Postanowienia niniejszego paragrafu mają zastosowanie wyłącznie do Konsumentów oraz Przedsiębiorców na prawach Konsumenta.</p>
            <p>2. Usługobiorca ma możliwość skorzystania z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń. Szczegółowe informacje dostępne są na stronach internetowych powiatowych rzeczników konsumentów, Wojewódzkich Inspektoratów Inspekcji Handlowej oraz Urzędu Ochrony Konkurencji i Konsumentów (www.uokik.gov.pl).</p>

            <hr />

            <h2>§ 15. Dane osobowe</h2>
            <p>Informacje o przetwarzaniu danych osobowych przez Usługodawcę znajdują się w Polityce Prywatności dostępnej pod adresem: <a href="/polityka-prywatnosci">/polityka-prywatnosci</a>.</p>

            <hr />

            <h2>§ 16. Zmiana Usługi — Konsumenci oraz Przedsiębiorcy na prawach Konsumenta</h2>
            <p>1. Postanowienia niniejszego paragrafu mają zastosowanie wyłącznie do Konsumentów oraz Przedsiębiorców na prawach Konsumenta.</p>
            <p>2. Usługodawca może dokonać zmiany Usługi w przypadku: konieczności dostosowania Usługi do nowych urządzeń lub oprogramowania, decyzji o usprawnieniu Usługi poprzez dodanie lub modyfikację funkcjonalności, lub prawnego obowiązku dostosowania Usługi do aktualnego stanu prawnego. Zmiana Usługi nie wiąże się z żadnymi kosztami po stronie Usługobiorcy.</p>
            <p>3. Jeżeli zmiana Usługi będzie istotnie i negatywnie wpływała na dostęp do Usługi, Usługodawca informuje Usługobiorcę za pomocą poczty elektronicznej, nie później niż na 7 dni przed dokonaniem zmiany, o właściwościach i terminie zmiany oraz prawie do wypowiedzenia Umowy ze skutkiem natychmiastowym w terminie 30 dni od dokonania zmiany.</p>
            <p>4. Wypowiedzenie Umowy na podstawie ust. 3 następuje przez złożenie Usługodawcy oświadczenia za pomocą poczty elektronicznej na adres wskazany w § 1 ust. 5 i wywołuje takie same skutki jak odstąpienie od Umowy z powodu Niezgodności.</p>

            <hr />

            <h2>§ 17. Zmiana Regulaminu</h2>
            <p>1. Usługodawca może dokonać zmiany Regulaminu m.in. w przypadku: zmiany przedmiotu działalności, rozpoczęcia lub zaprzestania dostarczania usług, technicznej modyfikacji Aplikacji wymagającej dostosowania Regulaminu, lub prawnego obowiązku dokonania zmian.</p>
            <p>2. O zmianie Regulaminu Usługobiorca zostanie poinformowany poprzez opublikowanie zmienionej wersji w Aplikacji oraz za pomocą poczty elektronicznej, co najmniej 14 dni przed wejściem zmian w życie.</p>
            <p>3. Do umów zawartych przed zmianą Regulaminu stosuje się postanowienia ówcześnie obowiązującego Regulaminu.</p>
            <p>4. Usługobiorca, który nie zgadza się na zmianę Regulaminu, może wypowiedzieć Umowę ze skutkiem natychmiastowym w terminie 10 dni od dnia otrzymania informacji o zmianie. Brak wypowiedzenia w tym terminie uznaje się za akceptację zmian. Wypowiedzenie następuje przez złożenie oświadczenia za pomocą poczty elektronicznej na adres wskazany w § 1 ust. 5.</p>

            <hr />

            <h2>§ 18. Postanowienia końcowe</h2>
            <p>1. Aktualna wersja Regulaminu obowiązuje od dnia 19 marca 2026 r.</p>
            <p>2. Regulamin podlega prawu polskiemu. Wszelkie spory będą rozwiązywane w drodze polubownych negocjacji, a w przypadku braku porozumienia — przed sądem powszechnym właściwym dla siedziby Usługodawcy, z zastrzeżeniem praw Konsumentów do wyboru sądu.</p>
            <p>3. W sprawach nieuregulowanych w Regulaminie zastosowanie znajdą przepisy powszechnie obowiązującego prawa polskiego, w szczególności Kodeksu cywilnego, Ustawy o prawach konsumenta i RODO.</p>
        </LegalLayout>
    );
}
