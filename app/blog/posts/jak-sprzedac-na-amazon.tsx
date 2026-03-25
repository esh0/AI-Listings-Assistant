import Link from "next/link";

export default function JakSprzedacNaAmazon() {
    return (
        <>
            <p>
                Amazon to nie marketplace ogłoszeniowy — to platforma e-commerce rządząca się własnymi prawami. Kupujący szukają tu produktów, nie ludzi. Twoja oferta konkuruje bezpośrednio z innymi sprzedawcami tego samego produktu, a algorytm A9 decyduje kto wygra. Żeby go wygrać, musisz zoptymalizować listing pod słowa kluczowe i konwersję jednocześnie.
            </p>

            <h2>Amazon vs. inne platformy — fundamentalna różnica</h2>
            <p>
                Na OLX czy eBay sprzedajesz <em>swój egzemplarz</em> produktu. Na Amazon najczęściej dołączasz do istniejącego listingu produktu — inni sprzedawcy sprzedają ten sam produkt i walczycie o Buy Box (przycisk &quot;Dodaj do koszyka&quot;). Jeśli produkt nie ma jeszcze listingu, Ty go tworzysz i stajesz się jego właścicielem.
            </p>
            <p>
                Kluczowe pojęcia dla nowych sprzedawców:
            </p>
            <ul>
                <li><strong>ASIN</strong> — unikalny identyfikator produktu na Amazon. Każdy produkt ma jeden ASIN, wielu sprzedawców może go oferować</li>
                <li><strong>Buy Box</strong> — przycisk &quot;Kup teraz&quot; — wygrywa go sprzedawca z najlepszą kombinacją ceny, czasu wysyłki i ocen</li>
                <li><strong>FBA</strong> — Fulfillment by Amazon — wysyłasz towar do magazynu Amazon, oni realizują zamówienia</li>
                <li><strong>FBM</strong> — Fulfillment by Merchant — wysyłasz samodzielnie</li>
            </ul>

            <h2>Tytuł produktu na Amazon — do 200 znaków</h2>

            <h3>Jak budować tytuł pod algorytm A9</h3>
            <p>
                Amazon daje aż 200 znaków na tytuł — to znacznie więcej niż inne platformy. Algorytm A9 indeksuje każde słowo w tytule jako słowo kluczowe, dlatego dobry tytuł Amazon to gęsty, informacyjny tekst pełen trafnych fraz.
            </p>
            <p>Standardowa formuła tytułu:</p>
            <ul>
                <li>Marka + Nazwa produktu + Model</li>
                <li>Kluczowe atrybuty (rozmiar, kolor, materiał, ilość)</li>
                <li>Zastosowanie lub odbiorca (np. &quot;for Men&quot;, &quot;Kids&quot;, &quot;Gaming&quot;)</li>
                <li>Kompatybilność jeśli dotyczy (np. &quot;Compatible with iPhone 15&quot;)</li>
            </ul>

            <h3>Przykłady tytułów</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Słabe tytuły</p>
                    <ul className="text-sm space-y-2">
                        <li>"Phone case black"</li>
                        <li>"Good quality yoga mat"</li>
                        <li>"Coffee mug"</li>
                    </ul>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Dobre tytuły</p>
                    <ul className="text-sm space-y-2">
                        <li>"TORRAS Slim Phone Case Compatible with iPhone 15 Pro, Military Grade Drop Protection, Matte Black"</li>
                        <li>"Manduka PRO Yoga Mat 6mm — Extra Long 85&quot; Non-Slip, Eco Certified, Black"</li>
                        <li>"Large Ceramic Coffee Mug 500ml with Lid, Microwave Safe, Minimalist Design, Dark Green"</li>
                    </ul>
                </div>
            </div>

            <h2>Bullet Points — 5 punktów które sprzedają</h2>
            <p>
                Bullet points (punkty funkcji) to sekcja wyświetlana bezpośrednio pod tytułem — najczęściej czytana część listingu zaraz po tytule i zdjęciach. Amazon daje 5 punktów, każdy do ok. 200 znaków.
            </p>
            <p>Każdy bullet powinien:</p>
            <ol>
                <li>Zaczynać się od CAPS LOCK kluczowej cechy — np. &quot;LONG BATTERY LIFE —&quot;</li>
                <li>Opisywać korzyść dla kupującego, nie tylko specyfikację</li>
                <li>Zawierać naturalne słowa kluczowe</li>
            </ol>

            <h3>Przykład bullet points — słuchawki bezprzewodowe</h3>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 my-4">
                <p className="text-xs font-medium text-primary uppercase tracking-wide mb-3">Dobre bullet points</p>
                <ul className="text-sm space-y-2">
                    <li>✦ <strong>40H PLAYTIME WITH QUICK CHARGE</strong> — Full charge in 2 hours gives 40 hours of wireless music. 10-minute quick charge provides 3 hours of playback for busy days</li>
                    <li>✦ <strong>ACTIVE NOISE CANCELLATION</strong> — Three ANC levels adapt to your environment. Hybrid ANC technology blocks up to 35dB of ambient noise for focused listening</li>
                    <li>✦ <strong>PREMIUM SOUND QUALITY</strong> — 40mm dynamic drivers deliver rich bass and clear highs. Tuned by audio engineers for balanced, studio-quality sound</li>
                    <li>✦ <strong>COMFORTABLE ALL-DAY WEAR</strong> — Memory foam ear cushions and adjustable headband distribute weight evenly. Foldable design fits in included carrying case</li>
                    <li>✦ <strong>UNIVERSAL COMPATIBILITY</strong> — Bluetooth 5.3 connects to any device. Includes 3.5mm audio cable for wired use with in-flight entertainment systems</li>
                </ul>
            </div>

            <h2>Opis produktu — sekcja A+ Content</h2>
            <p>
                Standardowy opis (do 2000 znaków) jest indeksowany przez algorytm. Jeśli masz zarejestrowaną markę na Amazon, możesz używać A+ Content — rozbudowanych opisów z grafikami, tabelami porównawczymi i bogatym formatowaniem. A+ Content zwiększa konwersję średnio o 5-10%.
            </p>
            <p>
                W standardowym opisie pisz dla kupujących którzy wciąż mają wątpliwości po przeczytaniu bullet points. Odpowiedz na pytania: dla kogo jest ten produkt, do czego służy, czym różni się od konkurencji.
            </p>

            <h2>Backend Keywords — niewidoczne słowa kluczowe</h2>
            <p>
                Amazon daje każdemu sprzedawcy pole &quot;Search Terms&quot; w panelu (do 250 bajtów) — to słowa kluczowe niewidoczne dla kupujących, ale indeksowane przez algorytm. Wpisz tu:
            </p>
            <ul>
                <li>Synonimy i alternatywne nazwy produktu</li>
                <li>Błędy ortograficzne popularne dla danej kategorii</li>
                <li>Powiązane frazy których nie zmieściłeś w tytule</li>
                <li>Frazy w innych językach jeśli sprzedajesz na rynkach wielojęzycznych</li>
            </ul>

            <h2>Zdjęcia — wymagania techniczne Amazon</h2>
            <p>
                Amazon ma rygorystyczne wymagania dotyczące zdjęć:
            </p>
            <ul>
                <li><strong>Główne zdjęcie</strong> — produkt na białym tle (#FFFFFF), zajmuje min. 85% kadru, brak tekstu ani logotypów</li>
                <li><strong>Rozdzielczość</strong> — min. 1000×1000 px (zoom działa od 1600 px)</li>
                <li><strong>Dodatkowe zdjęcia</strong> — mogą pokazywać produkt w użyciu, szczegóły, infografiki z wymiarami</li>
                <li><strong>Maksymalnie 9 zdjęć</strong> na listing (plus wideo jeśli masz Brand Registry)</li>
            </ul>

            <h2>Cena i Buy Box — jak wygrać</h2>
            <p>
                Buy Box wygrywa sprzedawca z optymalną kombinacją:
            </p>
            <ul>
                <li><strong>Cena całkowita</strong> (produkt + wysyłka) — musi być konkurencyjna</li>
                <li><strong>Czas wysyłki</strong> — FBA prawie zawsze wygrywa z FBM w tym kryterium</li>
                <li><strong>Ocena sprzedawcy</strong> — poniżej 90% pozytywnych = trudno wygrać Buy Box</li>
                <li><strong>Dostępność magazynowa</strong> — brak towaru = brak Buy Box</li>
            </ul>

            <h2>Najczęstsze błędy przy tworzeniu listingów na Amazon</h2>
            <ul>
                <li><strong>Tytuł pełen słów kluczowych bez sensu</strong> — algorytm to nagradza, ale kupujący rezygnują</li>
                <li><strong>Zdjęcie główne na kolorowym tle</strong> — Amazon usunie lub obniży widoczność listingu</li>
                <li><strong>Brak backend keywords</strong> — zostawiasz darmowe słowa kluczowe na stole</li>
                <li><strong>Bullet points jako specyfikacja techniczna</strong> — pisz korzyści, nie tylko parametry</li>
                <li><strong>Ignorowanie recenzji</strong> — negatywne recenzje bez odpowiedzi obniżają konwersję</li>
            </ul>

            <h2>Podsumowanie</h2>
            <p>
                Amazon wymaga innego podejścia niż wszystkie inne platformy — tu optymalizujesz pod algorytm i pod konwersję jednocześnie. Dobry tytuł, 5 solidnych bullet points, białe tło na głównym zdjęciu i wypełnione backend keywords to podstawa która odróżnia profesjonalne listingi od amatorskich.
            </p>

            <p>
                Sprawdź też nasze poradniki dla <Link href="/blog/jak-sprzedawac-na-ebay">eBay</Link> i <Link href="/blog/jak-sprzedac-na-etsy">Etsy</Link> — każda platforma rządzi się swoimi prawami.
            </p>
        </>
    );
}
