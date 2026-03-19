import { LegalLayout } from "@/components/LegalLayout";

export const metadata = {
    title: "Regulamin — Marketplace AI",
    description: "Regulamin serwisu Marketplace AI",
};

export default function ReguaminPage() {
    return (
        <LegalLayout
            title="Regulamin Serwisu"
            subtitle="Obowiązuje od: [DATA_PUBLIKACJI] · Wersja draftu: 2026-03-19"
        >
            <blockquote>
                <strong>UWAGA:</strong> Niniejszy dokument jest draftem wymagającym weryfikacji przez prawnika przed publikacją.
            </blockquote>

            <hr />

            <h2>1. Postanowienia ogólne</h2>
            <p>1.1. Niniejszy Regulamin określa zasady korzystania z serwisu internetowego Marketplace Assistant (dalej: „Serwis"), dostępnego pod adresem [ADRES_STRONY].</p>
            <p>1.2. Właścicielem i administratorem Serwisu jest [IMIĘ I NAZWISKO], prowadzący jednoosobową działalność gospodarczą pod firmą [NAZWA FIRMY], z siedzibą w [ADRES], NIP: [NIP], REGON: [REGON] (dalej: „Usługodawca").</p>
            <p>1.3. Kontakt z Usługodawcą możliwy jest za pośrednictwem poczty elektronicznej: [EMAIL_KONTAKTOWY].</p>
            <p>1.4. Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu.</p>

            <hr />

            <h2>2. Definicje</h2>
            <ul>
                <li><strong>Serwis</strong> — aplikacja internetowa Marketplace Assistant umożliwiająca generowanie ogłoszeń sprzedażowych z wykorzystaniem sztucznej inteligencji.</li>
                <li><strong>Użytkownik</strong> — osoba fizyczna korzystająca z Serwisu, zarówno niezarejestrowana (Gość), jak i zarejestrowana.</li>
                <li><strong>Gość</strong> — Użytkownik korzystający z Serwisu bez zakładania Konta, w ramach darmowego limitu generacji.</li>
                <li><strong>Konto</strong> — indywidualny profil Użytkownika w Serwisie, utworzony po zalogowaniu przez Google OAuth.</li>
                <li><strong>Usługa</strong> — generowanie treści ogłoszeń sprzedażowych z wykorzystaniem sztucznej inteligencji na podstawie zdjęć i parametrów podanych przez Użytkownika.</li>
                <li><strong>Kredyt</strong> — jednostka uprawniająca do jednorazowego skorzystania z Usługi generowania ogłoszenia.</li>
                <li><strong>Subskrypcja</strong> — cykliczna (miesięczna) opłata za dostęp do wybranego planu taryfowego.</li>
                <li><strong>Dostawka</strong> — jednorazowy zakup dodatkowych Kredytów, niezwiązany z Subskrypcją.</li>
                <li><strong>Plan</strong> — jeden z dostępnych poziomów taryfowych: Free, Starter, Reseler.</li>
                <li><strong>Szablon</strong> — wzór opisu ogłoszenia z dynamicznymi polami, zapisany w Koncie Użytkownika.</li>
            </ul>

            <hr />

            <h2>3. Zasady korzystania z Serwisu</h2>

            <h3>3.1. Goście (niezarejestrowani)</h3>
            <p>3.1.1. Gość może korzystać z Usługi bez zakładania Konta, w ramach darmowego limitu: 3 generacje, maksymalnie 3 zdjęcia na generację.</p>
            <p>3.1.2. Wygenerowane treści są wyświetlane Gościowi, ale nie są zapisywane w Serwisie. Aby zapisać ogłoszenie, wymagana jest rejestracja.</p>
            <p>3.1.3. Usługodawca identyfikuje Gości za pomocą anonimowego identyfikatora (UUID) oraz adresu IP w formie zahaszowanej. Nie są to dane osobowe w rozumieniu RODO.</p>

            <h3>3.2. Użytkownicy zarejestrowani</h3>
            <p>3.2.1. Rejestracja odbywa się wyłącznie przez logowanie kontem Google (Google OAuth).</p>
            <p>3.2.2. Podczas rejestracji Serwis pobiera z konta Google: imię, adres e-mail oraz zdjęcie profilowe.</p>
            <p>3.2.3. Po rejestracji Użytkownik otrzymuje Plan Free z 5 Kredytami miesięcznie.</p>
            <p>3.2.4. Użytkownik zobowiązuje się do:</p>
            <ul>
                <li>Korzystania z Serwisu zgodnie z jego przeznaczeniem</li>
                <li>Niepodejmowania prób obejścia limitów i zabezpieczeń</li>
                <li>Niewytwarzania treści niezgodnych z prawem, obraźliwych lub wprowadzających w błąd</li>
                <li>Niekorzystania z Serwisu w sposób automatyczny (boty, scraping) bez pisemnej zgody Usługodawcy</li>
            </ul>

            <hr />

            <h2>4. Plany taryfowe i płatności</h2>

            <h3>4.1. Dostępne plany</h3>
            <table>
                <thead>
                    <tr>
                        <th>Plan</th>
                        <th>Cena brutto/mies.</th>
                        <th>Generacje/mies.</th>
                        <th>Max zdjęć/gen.</th>
                        <th>Szablony</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Free</td><td>0 zł</td><td>5</td><td>3</td><td>—</td></tr>
                    <tr><td>Starter</td><td>19,99 zł</td><td>30</td><td>5</td><td>—</td></tr>
                    <tr><td>Reseler</td><td>49,99 zł</td><td>80</td><td>8</td><td>10</td></tr>
                </tbody>
            </table>
            <p>Ceny brutto (zawierają VAT 23%, o ile Usługodawca jest czynnym podatnikiem VAT).</p>

            <h3>4.2. Dostawki kredytów</h3>
            <table>
                <thead>
                    <tr><th>Pakiet</th><th>Cena brutto</th></tr>
                </thead>
                <tbody>
                    <tr><td>10 Kredytów</td><td>9,99 zł</td></tr>
                    <tr><td>30 Kredytów</td><td>24,99 zł</td></tr>
                    <tr><td>60 Kredytów</td><td>39,99 zł</td></tr>
                </tbody>
            </table>

            <h3>4.3. Zasady płatności</h3>
            <p>4.3.1. Płatności obsługiwane są przez Stripe, Inc. (dalej: „Operator płatności"). Dostępne metody: BLIK, karty płatnicze (Visa, Mastercard).</p>
            <p>4.3.2. Subskrypcja jest odnawiana automatycznie co miesiąc. Użytkownik może anulować Subskrypcję w dowolnym momencie przez Panel klienta Stripe.</p>
            <p>4.3.3. Anulowanie Subskrypcji nie powoduje zwrotu za bieżący okres rozliczeniowy. Użytkownik zachowuje dostęp do końca opłaconego okresu.</p>
            <p>4.3.4. Kredyty z Subskrypcji resetują się na początku każdego okresu rozliczeniowego. Niewykorzystane Kredyty subskrypcji nie przechodzą na kolejny okres.</p>
            <p>4.3.5. Kredyty z Dostawek nie wygasają i są dostępne do momentu ich wykorzystania.</p>
            <p>4.3.6. System zużywa najpierw Kredyty z Subskrypcji, a następnie Kredyty z Dostawek.</p>
            <p>4.3.7. Kredyt jest konsumowany w momencie zlecenia generacji ogłoszenia (przed wyświetleniem wyniku), niezależnie od tego, czy Użytkownik zapisze wygenerowane ogłoszenie.</p>

            <h3>4.4. Faktury</h3>
            <p>4.4.1. Faktury VAT wystawiane są automatycznie przez Operatora płatności i dostępne w Panelu klienta Stripe.</p>
            <p>4.4.2. Użytkownik może podać dane do faktury (NIP) w Panelu klienta Stripe.</p>

            <hr />

            <h2>5. Usługa generowania ogłoszeń</h2>
            <p>5.1. Usługa polega na przetworzeniu zdjęć produktu i parametrów podanych przez Użytkownika w celu wygenerowania treści ogłoszenia sprzedażowego z wykorzystaniem modelu sztucznej inteligencji.</p>
            <p>5.2. Wygenerowana treść ma charakter <strong>propozycji</strong>. Użytkownik jest odpowiedzialny za weryfikację treści przed publikacją na platformie marketplace.</p>
            <p>5.3. Usługodawca <strong>nie gwarantuje</strong>:</p>
            <ul>
                <li>Poprawności rozpoznania produktu ze zdjęć</li>
                <li>Trafności sugestii cenowej</li>
                <li>Zgodności wygenerowanej treści z regulaminem docelowej platformy marketplace</li>
                <li>Skuteczności sprzedażowej ogłoszenia</li>
            </ul>
            <p>5.4. Usługodawca dołoży starań, aby generowane treści były wysokiej jakości i zgodne z zasadami poszczególnych platform, ale końcowa odpowiedzialność za treść publikowanego ogłoszenia spoczywa na Użytkowniku.</p>
            <p>5.5. Użytkownik zachowuje pełne prawa do wygenerowanych treści i może je dowolnie wykorzystywać, modyfikować i publikować.</p>
            <p>5.6. Każde zapisane ogłoszenie posiada jeden z czterech statusów: <strong>Szkic</strong> (DRAFT) — domyślny status po zapisaniu; <strong>Opublikowane</strong> (PUBLISHED) — ogłoszenie oznaczone jako wystawione na platformie; <strong>Sprzedane</strong> (SOLD) — ogłoszenie oznaczone jako zakończone sprzedażą; <strong>Zarchiwizowane</strong> (ARCHIVED) — ogłoszenie przeniesione do archiwum.</p>
            <p>5.7. Serwis rejestruje historię aktywności Użytkownika w zakresie cyklu życia ogłoszenia. Historia aktywności jest dostępna wyłącznie dla danego Użytkownika i służy celom informacyjnym.</p>
            <p>5.8. Użytkownicy Planu Reseler mają dostęp do funkcji Szablonów — zapisanych zestawów parametrów generowania ogłoszeń. Funkcja Szablonów nie jest dostępna w Planach Free i Starter.</p>

            <hr />

            <h2>6. Prawa własności intelektualnej</h2>
            <p>6.1. Serwis, jego kod źródłowy, design, logo i marka są własnością Usługodawcy i podlegają ochronie prawnej.</p>
            <p>6.2. Treści wygenerowane przez AI na zlecenie Użytkownika stanowią własność Użytkownika od momentu ich wygenerowania.</p>
            <p>6.3. Użytkownik udziela Usługodawcy niewyłącznej, nieodpłatnej licencji na przechowywanie wygenerowanych treści w bazie danych Serwisu w celu świadczenia Usługi (wyświetlanie, edycja, eksport).</p>
            <p>6.4. Usługodawca nie wykorzystuje treści Użytkowników w celach marketingowych ani nie udostępnia ich osobom trzecim.</p>

            <hr />

            <h2>7. Reklamacje</h2>
            <p>7.1. Użytkownik ma prawo złożyć reklamację dotyczącą działania Serwisu na adres email: [EMAIL_KONTAKTOWY].</p>
            <p>7.2. Reklamacja powinna zawierać: opis problemu, datę wystąpienia, adres email Konta.</p>
            <p>7.3. Usługodawca rozpatrzy reklamację w terminie 14 dni od jej otrzymania i poinformuje Użytkownika o wyniku drogą elektroniczną.</p>

            <hr />

            <h2>8. Prawo odstąpienia od umowy</h2>
            <p>8.1. Zgodnie z art. 38 pkt 13 ustawy z dnia 30 maja 2014 r. o prawach konsumenta, Użytkownikowi <strong>nie przysługuje</strong> prawo odstąpienia od umowy o dostarczanie treści cyfrowych, które nie są zapisane na nośniku materialnym, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną zgodą konsumenta przed upływem terminu do odstąpienia od umowy i po poinformowaniu go przez przedsiębiorcę o utracie prawa odstąpienia od umowy.</p>
            <p>8.2. Użytkownik wyraża powyższą zgodę w momencie aktywacji Subskrypcji lub zakupu Dostawki Kredytów i zlecenia pierwszej generacji.</p>
            <p>8.3. W przypadku problemów technicznych uniemożliwiających korzystanie z zakupionej Usługi, Usługodawca rozpatrzy indywidualnie możliwość zwrotu lub przedłużenia okresu subskrypcji.</p>

            <hr />

            <h2>9. Odpowiedzialność</h2>
            <p>9.1. Usługodawca nie ponosi odpowiedzialności za:</p>
            <ul>
                <li>Treści publikowane przez Użytkowników na platformach marketplace</li>
                <li>Skutki transakcji zawartych na podstawie wygenerowanych ogłoszeń</li>
                <li>Przerwy w działaniu Serwisu wynikające z przyczyn niezależnych (awarie serwerów, dostawców usług)</li>
                <li>Zmiany regulaminów platform marketplace wpływające na zgodność wygenerowanych treści</li>
            </ul>
            <p>9.2. Usługodawca odpowiada za szkody wyrządzone Użytkownikowi z winy umyślnej, w granicach rzeczywiście poniesionej straty.</p>
            <p>9.3. Łączna odpowiedzialność Usługodawcy wobec Użytkownika jest ograniczona do kwoty opłat uiszczonych przez Użytkownika w okresie ostatnich 3 miesięcy.</p>

            <hr />

            <h2>10. Zmiana Regulaminu</h2>
            <p>10.1. Usługodawca zastrzega sobie prawo do zmiany Regulaminu.</p>
            <p>10.2. O zmianach Regulaminu Użytkownicy zostaną poinformowani drogą elektroniczną (email) co najmniej 14 dni przed wejściem zmian w życie.</p>
            <p>10.3. Kontynuowanie korzystania z Serwisu po wejściu zmian w życie oznacza akceptację nowego Regulaminu.</p>
            <p>10.4. Użytkownik, który nie akceptuje zmian, może usunąć Konto i anulować Subskrypcję.</p>

            <hr />

            <h2>11. Postanowienia końcowe</h2>
            <p>11.1. Regulamin podlega prawu polskiemu.</p>
            <p>11.2. W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy Kodeksu cywilnego, ustawy o prawach konsumenta oraz RODO.</p>
            <p>11.3. Spory wynikające z korzystania z Serwisu będą rozstrzygane przez sąd właściwy dla siedziby Usługodawcy, z zastrzeżeniem praw konsumenta do wyboru sądu.</p>
            <p>11.4. Regulamin wchodzi w życie z dniem [DATA_PUBLIKACJI].</p>
        </LegalLayout>
    );
}
