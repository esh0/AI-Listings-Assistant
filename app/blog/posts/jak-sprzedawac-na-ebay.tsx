import Link from "next/link";

export default function JakSprzedawacNaEbay() {
    return (
        <>
            <p>
                eBay to największy globalny marketplace C2C — ponad 130 milionów aktywnych kupujących na całym świecie. Dla polskich resellerów to dostęp do rynków zachodnioeuropejskich i amerykańskiego, gdzie te same produkty często sprzedają się drożej niż w Polsce. Żeby to wykorzystać, musisz wiedzieć jak pisać oferty zgodnie z oczekiwaniami zagranicznych kupujących.
            </p>

            <h2>eBay vs. polskie platformy — kluczowe różnice</h2>
            <p>
                eBay działa inaczej niż OLX czy Allegro Lokalnie. Kupujący są z całego świata, oczekują angielskich opisów (lub języka kraju w którym wystawiasz), profesjonalnego tonu i bardzo dokładnych informacji o produkcie i wysyłce. Każdy błąd lub brak informacji może skutkować negatywną opinią lub sporem.
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Aspekt</th>
                        <th>OLX / Allegro Lokalnie</th>
                        <th>eBay</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Zasięg</td>
                        <td>Polska</td>
                        <td>Globalny (głównie UK, USA, DE, AU)</td>
                    </tr>
                    <tr>
                        <td>Język</td>
                        <td>Polski</td>
                        <td>Angielski (lub język rynku docelowego)</td>
                    </tr>
                    <tr>
                        <td>Limit tytułu</td>
                        <td>70–75 znaków</td>
                        <td>80 znaków</td>
                    </tr>
                    <tr>
                        <td>Ton</td>
                        <td>Luźny lub profesjonalny</td>
                        <td>Zawsze profesjonalny, neutralny</td>
                    </tr>
                    <tr>
                        <td>Wysyłka</td>
                        <td>Opcjonalna</td>
                        <td>Kluczowy element oferty</td>
                    </tr>
                    <tr>
                        <td>Zwroty</td>
                        <td>Rzadko omawiane</td>
                        <td>Muszą być jasno określone</td>
                    </tr>
                </tbody>
            </table>

            <h2>Tytuł na eBay — 80 znaków, każde słowo się liczy</h2>

            <h3>Jak myśleć o tytule na eBay</h3>
            <p>
                Algorytm Cassini (wyszukiwarka eBay) traktuje tytuł jako główny czynnik rankingowy. Nie ma tu miejsca na przymiotniki — liczy się każde słowo jako potencjalne słowo kluczowe. Dobry tytuł na eBay to niemal lista słów kluczowych ułożona w logiczną całość.
            </p>
            <p>Optymalna formuła:</p>
            <ul>
                <li><strong>Marka + Model/Nazwa produktu</strong></li>
                <li><strong>Kluczowe parametry</strong> — rozmiar, kolor, pojemność, wersja</li>
                <li><strong>Stan</strong> — New, Used, Refurbished, For Parts</li>
                <li><strong>Istotne słowa kluczowe</strong> — np. "Vintage", "Rare", "Genuine", "OEM"</li>
            </ul>

            <h3>Przykłady tytułów</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Słabe tytuły</p>
                    <ul className="text-sm space-y-2">
                        <li>"Nike shoes size 42 good condition"</li>
                        <li>"Old camera for sale"</li>
                        <li>"Lego set used"</li>
                    </ul>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Dobre tytuły</p>
                    <ul className="text-sm space-y-2">
                        <li>"Nike Air Max 90 Trainers UK8 EU42 White Black Used Good Condition"</li>
                        <li>"Canon EOS 600D 18MP DSLR Camera Body Only Used Working"</li>
                        <li>"LEGO City Police Station Set 60246 Complete with Instructions"</li>
                    </ul>
                </div>
            </div>

            <h3>Czego nie pisać w tytule eBay</h3>
            <ul>
                <li>Interpunkcji i wykrzykników — &quot;!!!&quot;, &quot;***&quot;, &quot;~~~&quot;</li>
                <li>Słów &quot;wow&quot;, &quot;look&quot;, &quot;nice&quot;, &quot;great&quot; — puste, nie są słowami kluczowymi</li>
                <li>Fałszywych słów kluczowych (np. pisanie &quot;Apple&quot; przy produkcie Samsung)</li>
                <li>Ceny w tytule — eBay to zabrania</li>
            </ul>

            <h2>Opis na eBay — jak pisać profesjonalnie</h2>

            <h3>Struktura skutecznego opisu</h3>
            <p>eBay pozwala na bardzo rozbudowane opisy (do 2000 znaków w trybie tekstowym, więcej w HTML). Optymalny układ:</p>
            <ol>
                <li><strong>Krótkie wprowadzenie</strong> — co sprzedajesz, stan ogólny</li>
                <li><strong>Specyfikacja techniczna</strong> — model, parametry, wersja</li>
                <li><strong>Stan szczegółowy</strong> — każda wada opisana i sfotografowana</li>
                <li><strong>Co wchodzi w zestaw</strong> — oryginalne akcesoria, dokumenty, pudełko</li>
                <li><strong>Polityka wysyłki</strong> — skąd wysyłasz, czas realizacji, formy dostawy</li>
                <li><strong>Polityka zwrotów</strong> — czy przyjmujesz zwroty i na jakich warunkach</li>
            </ol>

            <h3>Przykład opisu — przed i po</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Przed</p>
                    <p className="text-sm">Used iPhone. Good condition. Ships from Poland. No returns.</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Po</p>
                    <p className="text-sm">Apple iPhone 13 128GB Space Grey — used, good condition. Screen: no cracks, minor micro-scratches visible under direct light (see photo 3). Body: small scuff on bottom edge (photo 4). Battery health: 89% (checked in Settings). Fully functional, Face ID works. Includes: charging cable only (no adapter). Ships from Poland via tracked courier, estimated 3–7 business days to EU. Returns accepted within 14 days if item not as described.</p>
                </div>
            </div>

            <h2>Stan produktu — kondycja na eBay</h2>
            <p>
                eBay ma predefiniowane stany produktu. Wybierz ten który pasuje, a w opisie uzupełnij szczegóły:
            </p>
            <ul>
                <li><strong>New</strong> — fabrycznie nowy, nieużywany, z metką/opakowaniem</li>
                <li><strong>New other</strong> — nowy ale bez oryginalnego opakowania</li>
                <li><strong>Manufacturer refurbished</strong> — odnowiony przez producenta</li>
                <li><strong>Seller refurbished</strong> — odnowiony przez sprzedawcę</li>
                <li><strong>Used — Like New</strong> — używany, brak śladów użytkowania</li>
                <li><strong>Used — Very Good</strong> — używany, minimalne ślady</li>
                <li><strong>Used — Good</strong> — używany, widoczne ślady, w pełni funkcjonalny</li>
                <li><strong>Used — Acceptable</strong> — wyraźne ślady, ale działa</li>
                <li><strong>For parts or not working</strong> — niesprawny lub do naprawy</li>
            </ul>

            <h2>Wysyłka — kluczowy element oferty na eBay</h2>
            <p>
                Kupujący na eBay bardzo zwracają uwagę na warunki wysyłki. Oferty z darmową wysyłką mają wyższy ranking i wyższy współczynnik konwersji. Jeśli wysyłasz z Polski do UK lub UE — uwzględnij koszt przesyłki w cenie i zaoferuj darmową wysyłkę.
            </p>
            <ul>
                <li>Podaj realistyczny czas wysyłki — eBay karze za niedotrzymanie</li>
                <li>Używaj przesyłek śledzonych — to obowiązek przy wyższych cenach</li>
                <li>Zadbaj o bezpieczne opakowanie — uszkodzenia w transporcie to Twój problem</li>
            </ul>

            <h2>Najczęstsze błędy polskich sprzedawców na eBay</h2>
            <ul>
                <li><strong>Polski opis na anglojęzycznym rynku</strong> — kupujący z UK nie przeczytają polskiego tekstu</li>
                <li><strong>Zbyt długi czas wysyłki</strong> — &quot;14-21 dni&quot; eliminuje Cię z wyników dla wielu kupujących</li>
                <li><strong>Brak polityki zwrotów</strong> — eBay obniża widoczność ofert bez zwrotów</li>
                <li><strong>Nieodpowiedni stan kondycji</strong> — zawyżony stan = spory i negatywne opinie</li>
                <li><strong>Ukryte koszty wysyłki</strong> — kupujący rezygnują przy checkout gdy widzą wysoki koszt</li>
            </ul>

            <h2>Podsumowanie — checklista przed wystawieniem na eBay</h2>
            <ul>
                <li>✓ Tytuł w języku angielskim, max 80 znaków, pełen słów kluczowych</li>
                <li>✓ Wybrany poprawny stan kondycji (Condition)</li>
                <li>✓ Opis w języku angielskim z pełną specyfikacją i szczegółami stanu</li>
                <li>✓ Wszystkie wady opisane i sfotografowane</li>
                <li>✓ Jasna polityka wysyłki z realistycznym czasem realizacji</li>
                <li>✓ Polityka zwrotów określona</li>
                <li>✓ Min. 4-6 zdjęć z różnych stron</li>
            </ul>

            <p>
                Sprawdź też jak tworzyć oferty na <Link href="/blog/jak-sprzedac-na-amazon">Amazon</Link> i <Link href="/blog/jak-sprzedac-na-etsy">Etsy</Link> — inne platformy, inne reguły.
            </p>
        </>
    );
}
