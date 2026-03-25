import Link from "next/link";

export default function JakSprzedacAllegroLokalnie() {
    return (
        <>
            <p>
                Allegro Lokalnie to nie jest po prostu &quot;OLX numer dwa&quot;. Platforma przyciąga inną grupę kupujących — często bardziej zdecydowanych, szukających konkretnych produktów. Dobrze napisane ogłoszenie tu może działać szybciej niż na OLX, jeśli znasz reguły tej platformy.
            </p>

            <h2>Allegro Lokalnie vs. OLX — czym się różnią?</h2>
            <p>
                Allegro Lokalnie jest częścią ekosystemu Allegro — ma inne nawyki użytkowników i inny styl komunikacji niż OLX. Kupujący oczekują bardziej profesjonalnego, ustrukturyzowanego podejścia. Ogłoszenie napisane jak na Allegro aukcyjnym — z konkretami i bez skrótów myślowych — działa lepiej niż luźny styl typowy dla OLX.
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Aspekt</th>
                        <th>OLX</th>
                        <th>Allegro Lokalnie</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Styl komunikacji</td>
                        <td>Luźny, bezpośredni</td>
                        <td>Profesjonalny, ustrukturyzowany</td>
                    </tr>
                    <tr>
                        <td>Limit tytułu</td>
                        <td>70 znaków</td>
                        <td>75 znaków</td>
                    </tr>
                    <tr>
                        <td>Limit opisu</td>
                        <td>1500 znaków</td>
                        <td>1500 znaków</td>
                    </tr>
                    <tr>
                        <td>Baza użytkowników</td>
                        <td>Bardzo szeroka</td>
                        <td>Mniejsza, ale bardziej zdecydowani kupujący</td>
                    </tr>
                </tbody>
            </table>

            <h2>Tytuł ogłoszenia na Allegro Lokalnie — zasady i limity</h2>

            <h3>Limit 75 znaków — o 5 więcej niż OLX</h3>
            <p>
                Allegro Lokalnie daje nieco więcej miejsca w tytule — 75 znaków zamiast 70. To wystarczy żeby dodać jeden dodatkowy parametr, np. rok produkcji lub kolor. Nie marnuj tego miejsca na słowa-wypełniacze.
            </p>

            <h3>Słowa kluczowe w tytule — myśl jak kupujący</h3>
            <p>
                Zanim napiszesz tytuł, zastanów się czego wpisałby szukający tej rzeczy. Jeśli sprzedajesz rower — kupujący wpisze &quot;rower górski 26&quot; albo &quot;rower Trek&quot;, nie &quot;fajny rower do sprzedania&quot;. Twój tytuł musi zawierać te słowa.
            </p>

            <h3>Przykłady tytułów — przed i po</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Słabe tytuły</p>
                    <ul className="text-sm space-y-2">
                        <li>"Rower do sprzedania, dobry stan"</li>
                        <li>"Telewizor Samsung, okazja!"</li>
                        <li>"Sofa narożna — piękna!"</li>
                    </ul>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Dobre tytuły</p>
                    <ul className="text-sm space-y-2">
                        <li>"Rower górski Trek Marlin 5 26&quot; — rocznik 2022, bdb"</li>
                        <li>"Samsung QLED 55&quot; 4K 2023 — gwarancja 6 msc"</li>
                        <li>"Sofa narożna Agata, 260×180 cm, szara, lewostronna"</li>
                    </ul>
                </div>
            </div>

            <h2>Opis na Allegro Lokalnie — jak pisać profesjonalnie</h2>

            <h3>Struktura opisu — co gdzie umieścić</h3>
            <p>Allegro Lokalnie nagradza ogłoszenia z kompletną informacją. Optymalny układ:</p>
            <ol>
                <li><strong>Pierwsze zdanie</strong> — co to jest, jaki model, jaki rok</li>
                <li><strong>Parametry techniczne</strong> — wymiary, specyfikacja, pojemność, etc.</li>
                <li><strong>Stan szczegółowy</strong> — konkretne wady lub ich brak</li>
                <li><strong>Historia i powód sprzedaży</strong> — opcjonalnie, buduje zaufanie</li>
                <li><strong>Co wchodzi w skład</strong> — akcesoria, dokumenty, pudełko</li>
                <li><strong>Warunki transakcji</strong> — cena, wysyłka, odbiór</li>
            </ol>

            <h3>Limit 1500 znaków — jak go dobrze wykorzystać</h3>
            <p>
                Masz do dyspozycji tyle samo znaków co na OLX, ale ton powinien być bardziej formalny. Unikaj skrótów i potocznych zwrotów. Piszą &quot;bardzo dobry stan&quot; zamiast &quot;bdb&quot; — chyba że miejsce jest ograniczone.
            </p>

            <h3>Przykłady opisów przed i po</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Przed</p>
                    <p className="text-sm">Sprzedam rower górski Trek. Stan dobry, mało używany. Cena do negocjacji. Odbiór Gdańsk.</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Po</p>
                    <p className="text-sm">Trek Marlin 5 rozmiar M (165–175 cm), koło 26&quot;, rocznik 2022. Przerzutki Shimano 21 biegów, hamulce tarczowe mechaniczne. Stan bardzo dobry — używany sezonowo, ok. 200 km przebiegu. Przegląd techniczny wykonany w serwisie 3 miesiące temu (faktura do wglądu). Siodło i oświetlenie w zestawie. Sprzedaję, bo przerzucam się na rower elektryczny. Odbiór osobisty Gdańsk Wrzeszcz, możliwa wysyłka kurierem na koszt kupującego.</p>
                </div>
            </div>

            <h2>Zdjęcia — wymagania techniczne i praktyczne</h2>
            <p>
                Allegro Lokalnie pozwala dodać do 8 zdjęć. Minimalne wymagania to jedno zdjęcie, ale warto dodać więcej:
            </p>
            <ul>
                <li>Widok ogólny produktu z przodu — tło powinno być neutralne</li>
                <li>Widok z boku i tyłu (dla produktów gdzie to istotne)</li>
                <li>Zbliżenie na ewentualne wady, zużycia lub uszkodzenia</li>
                <li>Tabliczka znamionowa, etykieta lub numer seryjny</li>
                <li>Akcesoria które wchodzą w zestaw</li>
            </ul>
            <p>
                Zdjęcia muszą być własne — nie możesz używać zdjęć ze sklepów ani internetu. Dobre oświetlenie i ostry obraz to absolutne minimum.
            </p>

            <h2>Cena — jak ustalić i czy dawać &quot;do negocjacji&quot;</h2>
            <p>
                Allegro Lokalnie ma wbudowaną funkcję &quot;cena do negocjacji&quot;. Jeśli z niej korzystasz, kupujący mogą składać oferty — co może przyspieszyć sprzedaż jeśli Twoja cena wywoławcza jest wyższa niż rynkowa.
            </p>
            <p>
                Jak ustalić cenę wyjściową? Sprawdź podobne ogłoszenia na Allegro Lokalnie i OLX — filtruj po stanie i kategorii. Dla produktów w bardzo dobrym stanie cena ok. 60-70% ceny nowego jest realistyczna. Dla produktów starszych lub z wadami — proporcjonalnie mniej.
            </p>

            <h2>Jak reagować na zapytania</h2>
            <p>
                Szybka odpowiedź to jeden z kluczowych czynników sprzedaży — kupujący często pisze do kilku sprzedawców jednocześnie i kupuje od tego który odpowie pierwszy. Włącz powiadomienia na telefonie.
            </p>
            <p>
                W odpowiedziach bądź konkretny — jeśli kupujący pyta o stan, odpowiedz dokładnie i zaoferuj dodatkowe zdjęcie. Nie pisz &quot;jest ok&quot; — to nic nie mówi.
            </p>

            <h2>Najczęstsze błędy sprzedających na Allegro Lokalnie</h2>
            <ul>
                <li><strong>Kopiowanie opisu z OLX</strong> — inne platformy, inne oczekiwania</li>
                <li><strong>Brak parametrów technicznych</strong> — kupujący na Allegro Lokalnie oczekuje szczegółów</li>
                <li><strong>Zbyt wysokie ceny wywoławcze bez negocjacji</strong> — odstrasza kupujących</li>
                <li><strong>Brak odpowiedzi na wiadomości</strong> — ogłoszenie spada w rankingu aktywności</li>
                <li><strong>Jedno zdjęcie</strong> — minimum które nie sprzedaje</li>
            </ul>

            <h2>Podsumowanie — checklista przed publikacją</h2>
            <ul>
                <li>✓ Tytuł zawiera markę, model, kluczowy parametr i stan (max 75 znaków)</li>
                <li>✓ Opis ma kompletne parametry techniczne</li>
                <li>✓ Stan opisany konkretnie, wady nie są ukryte</li>
                <li>✓ Podałem co wchodzi w skład zestawu</li>
                <li>✓ Cena jest realistyczna — sprawdziłem podobne ogłoszenia</li>
                <li>✓ Opisałem możliwości wysyłki</li>
                <li>✓ Dodałem min. 4-5 zdjęć z różnych stron</li>
            </ul>

            <p>
                Sprawdź też <Link href="/blog/jak-napisac-ogloszenie-olx">jak pisać ogłoszenia na OLX</Link> i <Link href="/blog/facebook-marketplace-opis">jak sprzedawać na Facebook Marketplace</Link>.
            </p>
        </>
    );
}
