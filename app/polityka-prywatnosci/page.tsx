import { LegalLayout } from "@/components/LegalLayout";

export const metadata = {
    title: "Polityka Prywatności — Marketplace AI",
    description: "Polityka prywatności serwisu Marketplace AI",
};

export default function PolitykaPrywatnosci() {
    return (
        <LegalLayout
            title="Polityka Prywatności"
            subtitle="Obowiązuje od: [DATA_PUBLIKACJI]"
        >
            <h2>1. Administrator danych osobowych</h2>
            <p>Administratorem Twoich danych osobowych jest [IMIĘ I NAZWISKO], prowadzący jednoosobową działalność gospodarczą pod firmą [NAZWA FIRMY], z siedzibą w [ADRES], NIP: [NIP], REGON: [REGON] (dalej: „Administrator").</p>
            <p>Kontakt z Administratorem: [EMAIL_KONTAKTOWY]</p>

            <hr />

            <h2>2. Jakie dane zbieramy?</h2>

            <h3>2.1. Użytkownicy zarejestrowani (logowanie przez Google)</h3>
            <p>Podczas logowania przez Google OAuth pobieramy:</p>
            <ul>
                <li><strong>Imię i nazwisko</strong> — wyświetlanie w profilu</li>
                <li><strong>Adres e-mail</strong> — identyfikacja konta, kontakt</li>
                <li><strong>Zdjęcie profilowe</strong> — wyświetlanie w interfejsie (opcjonalne)</li>
            </ul>
            <p>Dodatkowo przechowujemy:</p>
            <ul>
                <li><strong>Plan taryfowy i liczbę kredytów</strong> — obsługa subskrypcji</li>
                <li><strong>Identyfikator klienta Stripe</strong> — powiązanie konta z płatnościami</li>
                <li><strong>Wygenerowane ogłoszenia</strong> — tytuły, opisy, zdjęcia produktów, parametry generacji</li>
                <li><strong>Szablony ogłoszeń</strong> — predefiniowane szablony przechowywane na koncie użytkownika (dostępne w planie RESELER)</li>
                <li><strong>Historia aktywności</strong> — rejestr działań użytkownika (generowanie, zapisywanie, publikowanie, sprzedaż, archiwizacja, usuwanie ogłoszeń)</li>
            </ul>

            <h3>2.2. Goście (niezarejestrowani)</h3>
            <p>Dla niezarejestrowanych użytkowników przechowujemy:</p>
            <ul>
                <li><strong>Anonimowy identyfikator (UUID)</strong> — generowany losowo, przechowywany w przeglądarce (localStorage). Nie jest to dana osobowa — nie pozwala na identyfikację osoby.</li>
                <li><strong>Zahaszowany adres IP (SHA-256)</strong> — jednokierunkowy hash algorytmem SHA-256, służący do rate-limitingu. Nie przechowujemy surowych adresów IP.</li>
            </ul>

            <h3>2.3. Dane płatnicze</h3>
            <p>Dane płatnicze (numer karty, dane BLIK) są przetwarzane wyłącznie przez Stripe, Inc. i <strong>nie są przechowywane</strong> w naszym Serwisie.</p>

            <h3>2.4. Zdjęcia produktów</h3>
            <p>Zdjęcia przesłane przez Użytkownika:</p>
            <ul>
                <li>Są przesyłane do OpenAI API w celu analizy przez AI (chwilowo, nie są przechowywane przez OpenAI do trenowania modeli)</li>
                <li>Po zapisaniu ogłoszenia: thumbnails (zmniejszone kopie) przechowywane w Supabase Storage</li>
                <li>Użytkownik może je usunąć w dowolnym momencie (usunięcie ogłoszenia kasuje też zdjęcia)</li>
            </ul>

            <hr />

            <h2>3. W jakim celu przetwarzamy dane?</h2>
            <table>
                <thead>
                    <tr>
                        <th>Cel</th>
                        <th>Dane</th>
                        <th>Podstawa prawna (RODO)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Świadczenie usługi (generowanie ogłoszeń)</td><td>Imię, email, zdjęcia produktów</td><td>Art. 6 ust. 1 lit. b — wykonanie umowy</td></tr>
                    <tr><td>Obsługa konta użytkownika</td><td>Imię, email, avatar</td><td>Art. 6 ust. 1 lit. b — wykonanie umowy</td></tr>
                    <tr><td>Obsługa płatności i subskrypcji</td><td>Email, identyfikator klienta Stripe</td><td>Art. 6 ust. 1 lit. b — wykonanie umowy</td></tr>
                    <tr><td>Rate-limiting gości</td><td>UUID, hash IP</td><td>Art. 6 ust. 1 lit. f — uzasadniony interes: ochrona przed nadużyciami</td></tr>
                    <tr><td>Rozpatrywanie reklamacji</td><td>Email, dane konta</td><td>Art. 6 ust. 1 lit. b — wykonanie umowy</td></tr>
                    <tr><td>Wystawianie faktur</td><td>Dane do faktury (jeśli podane)</td><td>Art. 6 ust. 1 lit. c — obowiązek prawny</td></tr>
                    <tr><td>Marketing bezpośredni (email)</td><td>Email</td><td>Art. 6 ust. 1 lit. a — zgoda (opcjonalna)</td></tr>
                    <tr><td>Prowadzenie historii aktywności</td><td>Typ akcji, ID ogłoszenia, data</td><td>Art. 6 ust. 1 lit. f — uzasadniony interes: zapewnienie ciągłości usługi i audytowalności</td></tr>
                </tbody>
            </table>
            <p>Administrator informuje, że <strong>nie stosuje profilowania</strong> w rozumieniu art. 22 RODO, to jest zautomatyzowanego podejmowania decyzji wywołujących skutki prawne lub w podobny sposób istotnie wpływających na osobę fizyczną.</p>

            <hr />

            <h2>4. Komu udostępniamy dane?</h2>
            <p>Twoje dane mogą być przekazywane następującym podmiotom przetwarzającym, z którymi Administrator zawarł umowy powierzenia przetwarzania danych osobowych:</p>
            <table>
                <thead>
                    <tr>
                        <th>Podmiot</th>
                        <th>Cel</th>
                        <th>Lokalizacja</th>
                        <th>Zabezpieczenia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><strong>Google</strong> (OAuth)</td><td>Uwierzytelnianie</td><td>USA</td><td>Standardowe klauzule umowne (SCCs)</td></tr>
                    <tr><td><strong>OpenAI</strong></td><td>Generowanie treści AI</td><td>USA</td><td>SCCs, Data Processing Agreement</td></tr>
                    <tr><td><strong>Supabase</strong></td><td>Baza danych, storage</td><td>EU/USA</td><td>SCCs, szyfrowanie</td></tr>
                    <tr><td><strong>Stripe</strong></td><td>Płatności</td><td>EU</td><td>Certyfikat PCI DSS Level 1</td></tr>
                    <tr><td><strong>Vercel</strong></td><td>Hosting aplikacji</td><td>EU/USA</td><td>SCCs, Edge Functions</td></tr>
                </tbody>
            </table>
            <p><strong>Nie sprzedajemy</strong> Twoich danych osobowych osobom trzecim.</p>
            <p><strong>Nie wykorzystujemy</strong> treści Twoich ogłoszeń do trenowania modeli AI ani w celach marketingowych.</p>

            <hr />

            <h2>5. Jak długo przechowujemy dane?</h2>
            <table>
                <thead>
                    <tr>
                        <th>Dane</th>
                        <th>Okres przechowywania</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Dane konta (imię, email)</td><td>Do momentu usunięcia konta</td></tr>
                    <tr><td>Ogłoszenia i zdjęcia</td><td>Do momentu usunięcia przez Użytkownika lub usunięcia konta</td></tr>
                    <tr><td>Szablony ogłoszeń</td><td>Do momentu usunięcia przez Użytkownika lub usunięcia konta</td></tr>
                    <tr><td>Historia aktywności</td><td>Ostatnie 50 zdarzeń per użytkownik</td></tr>
                    <tr><td>Dane do faktur</td><td>5 lat (obowiązek podatkowy)</td></tr>
                    <tr><td>Logi rate-limitingu (hash IP)</td><td>30 dni</td></tr>
                    <tr><td>UUID gości</td><td>Do czyszczenia localStorage przez Użytkownika</td></tr>
                    <tr><td>Tymczasowe ogłoszenie gościa (<code>pending_ad</code>)</td><td>IndexedDB w przeglądarce — do zalogowania lub ręcznego usunięcia</td></tr>
                </tbody>
            </table>
            <p>Po usunięciu konta: dane osobowe usuwane w ciągu 30 dni. Dane wymagane prawnie (faktury) przechowywane przez wymagany okres.</p>

            <hr />

            <h2>6. Twoje prawa</h2>
            <p>Na podstawie RODO przysługują Ci następujące prawa:</p>

            <h3>6.1. Prawo dostępu (art. 15 RODO)</h3>
            <p>Masz prawo uzyskać potwierdzenie, czy przetwarzamy Twoje dane, oraz dostęp do nich.</p>

            <h3>6.2. Prawo do sprostowania (art. 16 RODO)</h3>
            <p>Masz prawo żądać poprawienia nieprawidłowych danych. W Serwisie dane profilu (imię, avatar) są pobierane z Google — zmiany dokonujesz w koncie Google.</p>

            <h3>6.3. Prawo do usunięcia (art. 17 RODO)</h3>
            <p>Masz prawo żądać usunięcia swoich danych. Możesz:</p>
            <ul>
                <li>Usunąć pojedyncze ogłoszenia w Dashboardzie</li>
                <li>Usunąć konto (usuwa wszystkie dane: profil, ogłoszenia, zdjęcia)</li>
                <li>Skontaktować się z nami emailowo w celu usunięcia danych</li>
            </ul>

            <h3>6.4. Prawo do ograniczenia przetwarzania (art. 18 RODO)</h3>
            <p>Masz prawo żądać ograniczenia przetwarzania danych w określonych sytuacjach.</p>

            <h3>6.5. Prawo do przenoszenia danych (art. 20 RODO)</h3>
            <p>Masz prawo otrzymać swoje dane w ustrukturyzowanym formacie. Serwis udostępnia:</p>
            <ul>
                <li>Eksport ogłoszeń do CSV (dostępny w Dashboardzie)</li>
                <li>Na życzenie: eksport pełnych danych konta w formacie JSON</li>
            </ul>

            <h3>6.6. Prawo do sprzeciwu (art. 21 RODO)</h3>
            <p>Masz prawo sprzeciwić się przetwarzaniu danych opartemu na prawnie uzasadnionym interesie (art. 6 ust. 1 lit. f RODO), w tym przetwarzaniu na potrzeby rate-limitingu i historii aktywności.</p>

            <h3>6.7. Prawo do wycofania zgody</h3>
            <p>Jeśli przetwarzanie oparte jest na zgodzie (np. marketing), możesz ją wycofać w dowolnym momencie. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania przed wycofaniem.</p>

            <h3>6.8. Prawo do skargi</h3>
            <p>Masz prawo złożyć skargę do organu nadzorczego:</p>
            <p><strong>Prezes Urzędu Ochrony Danych Osobowych</strong><br />ul. Stawki 2, 00-193 Warszawa<br />www.uodo.gov.pl</p>

            <hr />

            <h2>7. Pliki cookies i technologie śledzące</h2>

            <h3>7.1. Cookies niezbędne</h3>
            <table>
                <thead>
                    <tr>
                        <th>Cookie</th>
                        <th>Cel</th>
                        <th>Czas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><code>__Secure-authjs.session-token</code></td><td>Sesja logowania (JWT, 7 dni)</td><td>7 dni</td></tr>
                    <tr><td><code>__Host-authjs.csrf-token</code></td><td>Ochrona CSRF</td><td>Sesja</td></tr>
                    <tr><td><code>__Secure-authjs.callback-url</code></td><td>URL powrotny po logowaniu</td><td>Sesja</td></tr>
                </tbody>
            </table>

            <h3>7.2. Local Storage / IndexedDB</h3>
            <table>
                <thead>
                    <tr>
                        <th>Klucz</th>
                        <th>Technologia</th>
                        <th>Cel</th>
                        <th>Czas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><code>guest_uuid</code></td><td>Local Storage</td><td>Identyfikacja gościa (rate-limiting)</td><td>Do ręcznego usunięcia</td></tr>
                    <tr><td><code>pending_ad</code></td><td>IndexedDB</td><td>Tymczasowe ogłoszenie (soft-wall)</td><td>Do zalogowania lub ręcznego usunięcia</td></tr>
                </tbody>
            </table>

            <h3>7.3. Cookies analityczne i marketingowe</h3>
            <p>Serwis <strong>nie korzysta</strong> z:</p>
            <ul>
                <li>Google Analytics</li>
                <li>Facebook Pixel</li>
                <li>Żadnych zewnętrznych narzędzi śledzących</li>
            </ul>
            <p>W przyszłości, jeśli zdecydujemy się na analitykę, poinformujemy Użytkowników i uzyskamy zgodę (cookie banner).</p>

            <hr />

            <h2>8. Bezpieczeństwo danych</h2>
            <p>Stosujemy następujące środki bezpieczeństwa:</p>
            <ul>
                <li><strong>Szyfrowanie w transmisji:</strong> HTTPS (TLS 1.3) dla całej komunikacji</li>
                <li><strong>Szyfrowanie w spoczynku:</strong> Baza danych Supabase z szyfrowaniem na poziomie dysku</li>
                <li><strong>Uwierzytelnianie:</strong> Google OAuth 2.0 (nie przechowujemy haseł)</li>
                <li><strong>Tokeny JWT:</strong> Bezstanowa sesja, podpisana kluczem AUTH_SECRET, ważna 7 dni</li>
                <li><strong>Row Level Security (RLS):</strong> Supabase Storage — użytkownik ma dostęp tylko do swoich plików</li>
                <li><strong>Hashowanie IP:</strong> Przechowujemy jedynie jednokierunkowy hash SHA-256, nie surowy adres IP</li>
                <li><strong>Minimalizacja danych:</strong> Zbieramy tylko niezbędne minimum</li>
            </ul>

            <hr />

            <h2>9. Transfer danych poza EOG</h2>
            <p>Niektórzy nasi dostawcy usług mają siedziby w USA (OpenAI, Google, Vercel). Transfer danych odbywa się na podstawie:</p>
            <ul>
                <li><strong>Standardowych klauzul umownych (SCCs)</strong> zatwierdzonych przez Komisję Europejską</li>
                <li><strong>Data Processing Agreements (DPA)</strong> z każdym dostawcą</li>
            </ul>
            <p>Zapewniamy, że transfer danych odbywa się z zachowaniem odpowiedniego poziomu ochrony wymaganego przez RODO.</p>

            <hr />

            <h2>10. Dane dzieci</h2>
            <p>Serwis nie jest przeznaczony dla osób poniżej 16 roku życia. Nie zbieramy świadomie danych od dzieci. Jeśli odkryjemy, że zebrano dane osoby niepełnoletniej, niezwłocznie je usuniemy.</p>

            <hr />

            <h2>11. Zmiany w Polityce Prywatności</h2>
            <p>11.1. Zastrzegamy sobie prawo do aktualizacji niniejszej Polityki Prywatności.</p>
            <p>11.2. O istotnych zmianach poinformujemy Użytkowników drogą elektroniczną (email) co najmniej 14 dni przed wejściem zmian w życie.</p>
            <p>11.3. Aktualna wersja Polityki Prywatności jest zawsze dostępna w Serwisie.</p>

            <hr />

            <h2>12. Kontakt</h2>
            <p>W sprawach związanych z ochroną danych osobowych prosimy o kontakt:</p>
            <p><strong>Email:</strong> [EMAIL_KONTAKTOWY]</p>
            <p><strong>Adres:</strong> [IMIĘ I NAZWISKO], [ADRES]</p>
        </LegalLayout>
    );
}
