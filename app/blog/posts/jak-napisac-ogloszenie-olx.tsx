export default function JakNapisacOgloszenieOlx() {
    return (
        <>
            <p>
                Miliony ogłoszeń na OLX walczą codziennie o uwagę kupujących. Większość z nich jest napisana byle jak — niejasne tytuły, brak kluczowych informacji, ceny wzięte z sufitu. Twoje ogłoszenie może wyróżniać się już po kilku minutach pracy.
            </p>

            <h2>Dlaczego ogłoszenie na OLX ma znaczenie?</h2>
            <p>
                OLX wyświetla użytkownikom listę wyników z tytułem, miniaturą zdjęcia i ceną. Kupujący podejmuje decyzję o kliknięciu w ułamku sekundy. Jeśli tytuł jest niejasny albo zdjęcie słabe — przewija dalej. Nie ma znaczenia jak dobry jest Twój produkt, jeśli ogłoszenie go nie sprzedaje.
            </p>
            <p>
                Dobrze napisane ogłoszenie działa jak dobry sprzedawca: od razu mówi co sprzedajesz, jaki jest stan, ile kosztuje i dlaczego warto kupić właśnie od Ciebie.
            </p>

            <h2>Zasady skutecznego tytułu na OLX</h2>

            <h3>Limit 70 znaków — każde słowo się liczy</h3>
            <p>
                OLX ogranicza tytuł do 70 znaków. To mniej niż jedna linijka tekstu. Nie możesz sobie pozwolić na zbędne słowa jak "sprzedam", "okazja" czy "pilnie" — algorytm OLX je depriorytetyzuje, a kupujący i tak wiedzą że to jest ogłoszenie sprzedażowe.
            </p>

            <h3>Co zawrzeć w tytule</h3>
            <p>Optymalna formuła dla większości produktów:</p>
            <ul>
                <li><strong>Nazwa produktu + marka</strong> — np. "Kurtka zimowa Adidas"</li>
                <li><strong>Kluczowy parametr</strong> — rozmiar, kolor, model, rocznik</li>
                <li><strong>Stan</strong> — nowy, jak nowy, używany, uszkodzony</li>
                <li><strong>Istotna cecha</strong> — jeśli masz miejsce</li>
            </ul>

            <h3>Czego unikać w tytule</h3>
            <ul>
                <li>"Sprzedam" — OLX to serwis ogłoszeń, to oczywiste</li>
                <li>"Okazja", "super cena", "tanio" — puste słowa bez wartości</li>
                <li>"Pilnie" — budzi podejrzenia, nie zaufanie</li>
                <li>Wielkie litery w całym tytule — wygląda jak spam</li>
                <li>Błędy ortograficzne — obniżają wiarygodność i widoczność w wyszukiwarce</li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Słaby tytuł</p>
                    <p className="text-sm font-medium">"SPRZEDAM buty! Super okazja tanio!!!"</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Dobry tytuł</p>
                    <p className="text-sm font-medium">"Nike Air Max 90 roz. 42 biały — stan bdb"</p>
                </div>
            </div>

            <h2>Jak napisać opis na OLX — krok po kroku</h2>
            <p>
                Opis na OLX może mieć do 1500 znaków. To wystarczy na kompletną informację o produkcie. Struktura która działa:
            </p>

            <h3>1. Pierwsze zdanie — najważniejsza informacja</h3>
            <p>
                Nie zaczynaj od "Witam". Zacznij od produktu: co to jest, jaki model, jaki stan. Kupujący skanuje opis wzrokiem — pierwsze zdanie musi natychmiast odpowiadać na pytanie "co to jest?".
            </p>

            <h3>2. Szczegóły techniczne produktu</h3>
            <p>
                Podaj wszystko co kupujący musiałby zapytać, żeby nie musiał pisać. Dla elektroniki: model, rok produkcji, parametry. Dla ubrań: skład materiału, wymiary, czy jest metka. Dla mebli: wymiary, kolor, materiał.
            </p>

            <h3>3. Stan i historia użytkowania</h3>
            <p>
                Bądź konkretny i uczciwy. "Używany, drobne ryski na obudowie widoczne na zdjęciach" jest lepsza niż "stan bardzo dobry" — bo jest weryfikowalna i buduje zaufanie. Jeśli produkt jest nowy z metką — napisz to wprost.
            </p>

            <h3>4. Warunki sprzedaży</h3>
            <p>
                Cena, możliwość negocjacji (lub nie), dostępne formy dostawy, lokalizacja odbioru osobistego. Im mniej pytań kupujący musi zadać, tym szybciej kupuje.
            </p>

            <h2>Przykłady — przed i po</h2>

            <h3>Przykład 1: ubrania</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Przed</p>
                    <p className="text-sm">Sprzedam kurtkę zimową. Dobra cena. Odbiór osobisty Warszawa.</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Po — AI</p>
                    <p className="text-sm">Kurtka zimowa Zara roz. M, kolor czarny. Sezon zimowy 2023/24, noszona ok. 10 razy — stan bardzo dobry, brak przetarć. Skład: 80% poliester. Odbiór Warszawa Mokotów lub wysyłka InPost 15 zł.</p>
                </div>
            </div>

            <h3>Przykład 2: elektronika</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Przed</p>
                    <p className="text-sm">Laptop do sprzedania. Działa bez zarzutów. Cena do negocjacji.</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Po — AI</p>
                    <p className="text-sm">Lenovo ThinkPad E15 Gen 2 (2021). Intel Core i5-1135G7, 16 GB RAM, SSD 512 GB, ekran 15,6&quot; FHD. Stan: dobry — obudowa bez rys, klawiatura kompletna, bateria trzyma ok. 4h. System Windows 11 Pro. Bez ładowarki (compat. 65W USB-C). Odbiór Kraków lub wysyłka.</p>
                </div>
            </div>

            <h3>Przykład 3: meble</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Przed</p>
                    <p className="text-sm">Stolik kawowy IKEA. Ładny, pasuje do każdego wnętrza. Sprzedam bo kupiliśmy nowy.</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Po — AI</p>
                    <p className="text-sm">Stolik kawowy IKEA VITTSJÖ, kolor czarnobrązowy. Wymiary: 100×60×45 cm. Stan: dobry — drobne ryski na blacie widoczne na zdjęciach, nogi bez uszkodzeń. Możliwy demontaż do transportu. Odbiór własny Wrocław, nie wysyłam ze względu na rozmiar.</p>
                </div>
            </div>

            <h2>Najczęstsze błędy w ogłoszeniach na OLX</h2>
            <ul>
                <li><strong>Brak zdjęć lub jedno nieostre zdjęcie</strong> — kupujący chce zobaczyć produkt z kilku stron</li>
                <li><strong>Zbyt ogólny tytuł</strong> — "laptop do sprzedania" nie powie nic algorytmowi OLX</li>
                <li><strong>Brak ceny lub "do uzgodnienia"</strong> — większość kupujących pomija takie ogłoszenia</li>
                <li><strong>Przepisywanie specyfikacji producenta</strong> — zamiast tego opisz realne użytkowanie</li>
                <li><strong>Brak informacji o wysyłce</strong> — kupujący spoza Twojego miasta to duża część rynku</li>
            </ul>

            <h2>Jak wybrać właściwą cenę?</h2>
            <p>
                Przed ustawieniem ceny przejrzyj podobne ogłoszenia na OLX — filtruj po stanie produktu i lokalizacji. Cena 10-15% niższa od nowych egzemplarzy jest zazwyczaj rozsądna dla produktów w bardzo dobrym stanie.
            </p>
            <p>
                Jeśli zależy Ci na szybkiej sprzedaży — wyceniaj nieco poniżej mediany podobnych ogłoszeń. Jeśli czas nie gra roli — możesz próbować wyżej i stopniowo obniżać.
            </p>
            <p>
                Zwrot "możliwa negocjacja" lub "ostateczna" to sygnał dla kupujących. Jeśli cena jest finalna — napisz to wprost. Jeśli możesz ustąpić kilka procent — daj kupującemu tę furtką.
            </p>

            <h2>Zdjęcia — co wpływa na sprzedaż</h2>
            <p>
                OLX pozwala dodać do 8 zdjęć. Warto to wykorzystać:
            </p>
            <ul>
                <li><strong>Pierwsze zdjęcie</strong> — widok frontu w dobrym świetle, bez zbędnego tła</li>
                <li><strong>Stan i detale</strong> — wszelkie ryski, uszkodzenia, zużycie (to buduje zaufanie, nie obniża sprzedaż)</li>
                <li><strong>Oznaczenia</strong> — metka rozmiaru, numer seryjny, tabliczka znamionowa</li>
                <li><strong>Akcesoria</strong> — wszystko co jest dołączone do zestawu</li>
            </ul>
            <p>
                Naturalne światło dzienne jest zawsze lepsze od sztucznego. Neutralne tło (biała ściana, podłoga) sprawia że produkt jest widoczny bez rozproszeń.
            </p>

            <h2>Podsumowanie — checklista przed publikacją</h2>
            <ul>
                <li>✓ Tytuł zawiera nazwę, markę, stan i kluczowy parametr (max 70 znaków)</li>
                <li>✓ Opis zaczyna się od konkretnej informacji o produkcie</li>
                <li>✓ Podałem wymiary / rozmiar / parametry techniczne</li>
                <li>✓ Opisałem stan uczciwie — ze wszystkimi wadami</li>
                <li>✓ Podałem cenę i czy jest negocjowalna</li>
                <li>✓ Napisałem o formach wysyłki i lokalizacji odbioru</li>
                <li>✓ Dodałem min. 3 zdjęcia z różnych stron</li>
            </ul>
        </>
    );
}
