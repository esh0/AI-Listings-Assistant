import Link from "next/link";

export default function JakSprzedacNaEtsy() {
    return (
        <>
            <p>
                Etsy to platforma dla rzemieślników, twórców i kolekcjonerów — zupełnie inna od OLX, Amazon czy eBay. Kupujący przychodzą tu po rzeczy wyjątkowe, ręcznie robione lub vintage. Jeśli sprzedajesz takie produkty, Etsy to dostęp do globalnej społeczności która aktywnie szuka czegoś oryginalnego i jest gotowa zapłacić za to więcej.
            </p>

            <h2>Czym jest Etsy i kto tu kupuje?</h2>
            <p>
                Etsy skupia kupujących którzy świadomie odrzucają masową produkcję i szukają produktów z historią, charakterem lub osobistym dotykiem. Główne kategorie które dobrze sprzedają się na Etsy:
            </p>
            <ul>
                <li>Biżuteria handmade i rzemiosło</li>
                <li>Vintage (min. 20-letnie przedmioty)</li>
                <li>Produkty cyfrowe (printable art, szablony, wzory)</li>
                <li>Personalizowane upominki i pamiątki</li>
                <li>Materiały i narzędzia dla twórców</li>
                <li>Artykuły ślubne i dekoracje</li>
            </ul>
            <p>
                Etsy nie jest właściwą platformą dla nowych produktów masowych — jeśli sprzedajesz elektronikę użytkową lub odzież sieciową, eBay lub Amazon będą lepszym wyborem.
            </p>

            <h2>Tytuł na Etsy — 140 znaków z SEO w głowie</h2>

            <h3>Jak algorytm Etsy rankuje listingi</h3>
            <p>
                Etsy Search (oparty na technologii własnej Etsy) indeksuje tytuł, tagi i atrybuty produktu. Pierwsze 40 znaków tytułu to najważniejsza część — wyświetlają się w wynikach wyszukiwania i w karcie produktu. Reszta tytułu (do 140 znaków) to dodatkowa przestrzeń na słowa kluczowe.
            </p>

            <h3>Formuła skutecznego tytułu Etsy</h3>
            <ul>
                <li>Najważniejsze słowo kluczowe na początku (pierwsze 3-4 słowa)</li>
                <li>Materiał lub technika wykonania</li>
                <li>Styl lub estetyka (Boho, Minimalist, Cottagecore, etc.)</li>
                <li>Zastosowanie lub okazja (Gift for Her, Wedding, Birthday)</li>
                <li>Kolor i wariant</li>
            </ul>

            <h3>Przykłady tytułów</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Słabe tytuły</p>
                    <ul className="text-sm space-y-2">
                        <li>"Handmade necklace, beautiful"</li>
                        <li>"Vintage item from the 70s"</li>
                        <li>"Ceramic mug I made"</li>
                    </ul>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Dobre tytuły</p>
                    <ul className="text-sm space-y-2">
                        <li>"Dainty Layering Necklace Sterling Silver, Minimalist Gold Chain Necklace, Gift for Her, Everyday Jewelry"</li>
                        <li>"Vintage 1970s Leather Crossbody Bag, Brown Boho Shoulder Purse, Hippie Festival Bag"</li>
                        <li>"Handmade Ceramic Coffee Mug 400ml, Stoneware Tea Cup, Pottery Mug, Cottagecore Kitchen Decor"</li>
                    </ul>
                </div>
            </div>

            <h2>Opis na Etsy — storytelling który sprzedaje</h2>

            <h3>Etsy to jedyna platforma gdzie historia produktu jest ważna</h3>
            <p>
                Na OLX kupujący chce wiedzieć co kupuje. Na Etsy chce wiedzieć <em>dlaczego to powstało</em>. Opis który opowiada historię — skąd pomysł, jak powstał, co sprawia że jest wyjątkowy — buduje emocjonalne połączenie z kupującym i uzasadnia wyższą cenę.
            </p>
            <p>
                Etsy pozwala na opis do 1000 znaków. Optymalny układ:
            </p>
            <ol>
                <li>Pierwsze 2-3 zdania — hook emocjonalny lub opis zastosowania</li>
                <li>Szczegóły techniczne — wymiary, materiał, technika</li>
                <li>Personalizacja — czy możliwa i w jaki sposób</li>
                <li>Czas realizacji i wysyłka</li>
                <li>Krótka historia twórcy lub pracowni (opcjonalnie)</li>
            </ol>

            <h3>Przykład opisu — przed i po</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Przed — suchy opis</p>
                    <p className="text-sm">Ceramic mug, 400ml, handmade. Microwave safe. Available in blue and green. Ships in 3-5 days.</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Po — z historią</p>
                    <p className="text-sm">Start your morning ritual with a mug that feels like it was made just for you — because it was. Each piece is wheel-thrown by hand in my small studio, so no two mugs are exactly alike. The glaze pools differently in every firing, creating its own quiet personality. Capacity: 400ml. Food-safe glaze, microwave and dishwasher safe. Available in Ocean Blue and Forest Green. Made to order — ships within 5 business days from Warsaw, Poland.</p>
                </div>
            </div>

            <h2>Tagi — 13 słów kluczowych które musisz wypełnić</h2>
            <p>
                Etsy daje każdemu listingowi 13 tagów — i każdy z nich powinieneś wypełnić. Tagi to dodatkowe słowa kluczowe, zupełnie niezależne od tytułu. Zasady:
            </p>
            <ul>
                <li>Każdy tag do 20 znaków</li>
                <li>Używaj fraz wielowyrazowych zamiast pojedynczych słów — &quot;boho wall art&quot; zamiast &quot;boho&quot;</li>
                <li>Nie powtarzaj słów z tytułu — to zmarnowane tagi</li>
                <li>Myśl jak kupujący — jakich fraz używa ktoś szukający Twojego produktu?</li>
                <li>Uwzględnij okazje (birthday gift, christmas present, mothers day) — Etsy mocno promuje tematyczne wyszukiwania</li>
            </ul>

            <h2>Zdjęcia na Etsy — estetyka i styl życia</h2>
            <p>
                Etsy to platforma wizualna — kupujący często przeglądają wyniki jak Instagram. Zdjęcia muszą być estetyczne i spójne ze stylem pracowni:
            </p>
            <ul>
                <li><strong>Główne zdjęcie</strong> — produkt na czystym tle lub w minimalistycznej aranżacji lifestyle</li>
                <li><strong>Zdjęcia kontekstowe</strong> — produkt w użyciu, w naturalnym środowisku</li>
                <li><strong>Detail shots</strong> — faktura materiału, ręczna robota, unikalne detale</li>
                <li><strong>Skala</strong> — zdjęcie z przedmiotem porównawczym lub w dłoni</li>
                <li><strong>Warianty</strong> — osobne zdjęcia każdego koloru lub rozmiaru</li>
            </ul>
            <p>
                Format zdjęcia: kwadrat (1:1) lub pionowy (4:5) — lepiej wyglądają w siatce Etsy i na mobile.
            </p>

            <h2>Cena na Etsy — nie bój się cenić wyżej</h2>
            <p>
                Kupujący na Etsy przychodza po unikalność i są gotowi za nią płacić. Zaniżona cena może paradoksalnie zaszkodzić sprzedaży — produkt wyceniony zbyt tanio wydaje się mało wartościowy lub podejrzany (czy to naprawdę handmade?).
            </p>
            <p>
                Kalkulator ceny dla produktów handmade: materiały × 3 + czas pracy (stawka godzinowa) + koszty stałe (Etsy fee, wysyłka) + marża. Nie wyceniaj poniżej kosztów licząc na volumen — to droga donikąd.
            </p>

            <h2>Najczęstsze błędy sprzedawców na Etsy</h2>
            <ul>
                <li><strong>Tytuł bez słów kluczowych</strong> — &quot;My Handmade Necklace&quot; nie rankuje na nic</li>
                <li><strong>Puste tagi lub powtórzenia z tytułu</strong> — zmarnowana przestrzeń SEO</li>
                <li><strong>Suchy, techniczny opis</strong> — bez emocji i historii nie ma różnicy między Twoim produktem a masowym</li>
                <li><strong>Jedno zdjęcie</strong> — Etsy rekomenduje min. 5-7 zdjęć na listing</li>
                <li><strong>Zbyt niska cena</strong> — dewaluuje produkt i utrudnia rentowność</li>
                <li><strong>Brak polityki sklepu</strong> — kupujący sprawdzają zasady zwrotów i czas wysyłki przed zakupem</li>
            </ul>

            <h2>Podsumowanie</h2>
            <p>
                Etsy nagradza autentyczność, storytelling i optymalizację SEO jednocześnie. Dobry tytuł pełen trafnych fraz, 13 wypełnionych tagów i opis który opowiada historię produktu — to trójka która odróżnia sklepy sprzedające od tych które stoją w miejscu.
            </p>

            <p>
                Sprzedajesz też na innych platformach? Sprawdź poradniki dla <Link href="/blog/jak-sprzedawac-na-ebay">eBay</Link> i <Link href="/blog/jak-sprzedac-na-amazon">Amazon</Link>.
            </p>
        </>
    );
}
