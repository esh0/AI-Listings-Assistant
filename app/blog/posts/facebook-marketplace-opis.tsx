import Link from "next/link";

export default function FacebookMarketplaceOpis() {
    return (
        <>
            <p>
                Facebook Marketplace to sprzedaż w środowisku społecznościowym — kupujący widzą Twój profil publiczny, mają możliwość oceny, a cała komunikacja odbywa się przez Messengera. To zupełnie inne środowisko niż OLX czy Allegro, i wymaga innego podejścia do pisania ogłoszeń.
            </p>

            <h2>Czym jest Facebook Marketplace i kto z niego korzysta?</h2>
            <p>
                Facebook Marketplace to platforma do kupowania i sprzedawania lokalnie, dostępna bezpośrednio w aplikacji Facebook. Skupia osoby które kupują spontanicznie, w oparciu o zdjęcie i lokalizację — rzadko porównując oferty tak dokładnie jak na Allegro.
            </p>
            <p>
                Użytkownicy FB Marketplace to często kupujący okazjonalni — szukają konkretnej rzeczy w okolicy lub przeglądają co jest dostępne lokalnie. Dlatego lokalizacja i szybka komunikacja są tu ważniejsze niż na innych platformach.
            </p>

            <h2>Tytuł na Facebook Marketplace — limit 60 znaków</h2>

            <h3>Co wpisać w 60 znakach</h3>
            <p>
                FB Marketplace ma najkrótszy limit tytułu ze wszystkich polskich platform — zaledwie 60 znaków. Nie ma miejsca na nic zbędnego. Optymalna formuła:
            </p>
            <ul>
                <li>Nazwa produktu + marka (jeśli znana)</li>
                <li>Kluczowy parametr (rozmiar, model, kolor)</li>
                <li>Stan — skrótowo: &quot;nowy&quot;, &quot;bdb&quot;, &quot;drobne rysy&quot;</li>
            </ul>

            <h3>Przykłady skutecznych tytułów</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Słabe tytuły</p>
                    <ul className="text-sm space-y-2">
                        <li>"Sprzedam stół IKEA, dobry stan polecam"</li>
                        <li>"Zabawki dla dzieci do oddania"</li>
                        <li>"Iphone używany tanio"</li>
                    </ul>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Dobre tytuły</p>
                    <ul className="text-sm space-y-2">
                        <li>"Stół IKEA LISABO 140×78 cm — dąb, stan bdb"</li>
                        <li>"Klocki LEGO City 60297 — komplet, pudełko"</li>
                        <li>"iPhone 13 128GB czarny — jak nowy, gwarancja"</li>
                    </ul>
                </div>
            </div>

            <h2>Opis na Facebook Marketplace — jak pisać po ludzku</h2>

            <h3>Limit 1000 znaków — wystarczy na komplet</h3>
            <p>
                FB Marketplace pozwala na opis do 1000 znaków — to wystarczająco dużo żeby podać wszystkie kluczowe informacje. Nie musisz jednak wykorzystywać całości — lepszy jest krótki i konkretny tekst niż długi pełen pustych słów.
            </p>

            <h3>Ton — przyjazny i bezpośredni</h3>
            <p>
                FB Marketplace to środowisko społecznościowe. Kupujący są tu mniej formalni niż na Allegro i bardziej otwarci na rozmowę. Pisz jakbyś opowiadał o rzeczy znajomemu, a nie pisał formularz urzędowy. &quot;Stół w bardzo dobrym stanie, kupiony 2 lata temu, sprzedaję bo zmieniamy meble&quot; brzmi lepiej niż &quot;Stan: bardzo dobry. Rok zakupu: 2022.&quot;
            </p>

            <h3>Przykłady opisów przed i po</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Przed</p>
                    <p className="text-sm">Stół do jadalni. Rozkładany. Dobry stan. Sprzedam bo kupuję nowy. Cena 350 zł. Odbiór własny.</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Po</p>
                    <p className="text-sm">Stół rozkładany IKEA EKEDALEN, kolor dąb ciemny. Wymiary: 120×80 cm (rozkładany: 180×80 cm). Używany 2 lata w jadalni, stan bardzo dobry — bez rys i zagłębień, blat czysty. Sprzedaję bo przeprowadzam się do mniejszego mieszkania. Rozkręcamy do transportu. Odbiór Wrocław Fabryczna, mogę pomóc zanieść do samochodu.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Przed</p>
                    <p className="text-sm">Telefon samsung prawie nowy. Mogę wysłać. Cena 800zł ale do gadania.</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Po</p>
                    <p className="text-sm">Samsung Galaxy S23 128GB, kolor szary. Kupiony 8 miesięcy temu, używany jako drugi telefon — ekran bez rys (miał folię od pierwszego dnia), tył bez uszkodzeń. Bateria trzyma dobę bez problemu. Komplet: pudełko, kabel, gwarancja do końca 2025. Sprzedam bo przesiadam się na iPhone. Możliwy odbiór Poznań lub wysyłka InPost 24h.</p>
                </div>
            </div>

            <h2>Lokalizacja i kategoria — niedoceniane elementy</h2>
            <p>
                FB Marketplace wyświetla ogłoszenia w promieniu od lokalizacji kupującego. Upewnij się że Twoja lokalizacja jest ustawiona poprawnie — błędna lokalizacja sprawia że ogłoszenie dociera do złych osób lub w ogóle nie jest widoczne.
            </p>
            <p>
                Kategoria też ma znaczenie — ogłoszenia w złej kategorii są rzadziej wyświetlane w odpowiednich wyszukiwaniach. Nie wrzucaj mebli do &quot;Elektroniki&quot; bo byłoby bliżej pod względem ceny.
            </p>

            <h2>Zdjęcia na Facebook Marketplace — jak zrobić dobre</h2>
            <p>
                FB Marketplace pozwala dodać do 10 zdjęć. Pierwsze zdjęcie jest najważniejsze — wyświetla się w siatce ogłoszeń i decyduje o tym czy ktoś kliknie. Zasady:
            </p>
            <ul>
                <li>Pierwsze zdjęcie: produkt na neutralnym tle, dobre oświetlenie, cały przedmiot widoczny</li>
                <li>Nie używaj zdjęć ze stocków ani ze sklepu — FB może usunąć takie ogłoszenie</li>
                <li>Pokaż wady i zużycia — to zmniejsza liczbę sporów po transakcji</li>
                <li>Zdjęcia poziome lub pionowe — oba formaty działają na FB Marketplace</li>
            </ul>

            <h2>Cena i negocjacje</h2>
            <p>
                FB Marketplace ma opcję &quot;Oznacz jako negocjowalną&quot; — jeśli ją włączysz, kupujący dostają sygnał że mogą składać oferty. Wiele osób na FB zakłada że cena jest negocjowalna nawet bez tego oznaczenia.
            </p>
            <p>
                Jeśli Twoja cena jest finalna — napisz &quot;cena ostateczna&quot; lub &quot;nie schodzę z ceny&quot; w opisie. Oszczędzi to czas Tobie i kupującemu. Jeśli chcesz zostawić margines — ustal wyższą cenę wywoławczą i zaakceptuj ofertę bliżej docelowej.
            </p>

            <h2>Bezpieczeństwo transakcji na FB Marketplace</h2>
            <p>
                Kilka zasad które warto stosować:
            </p>
            <ul>
                <li>Przy drogich przedmiotach (elektronika, rower) — tylko odbiór osobisty, gotówka przy odbiorze lub przelew przed wysyłką</li>
                <li>Sprawdź profil kupującego — konto z minimalną aktywnością lub bez zdjęcia profilu może być podejrzane</li>
                <li>Nie wysyłaj rzeczy zanim nie masz pieniędzy — BLIK &quot;na hasło&quot; to popularne oszustwo</li>
                <li>Spotkania z kupującymi w miejscu publicznym — centrum handlowe, poczta</li>
            </ul>

            <h2>Najczęstsze błędy sprzedających</h2>
            <ul>
                <li><strong>Brak odpowiedzi przez Messengera</strong> — kupujący na FB oczekuje szybkiej reakcji, inaczej kupuje gdzie indziej</li>
                <li><strong>Zdjęcia złej jakości</strong> — ciemne, nieostre, z bałaganem w tle</li>
                <li><strong>Brak lokalizacji lub błędna lokalizacja</strong> — ogłoszenie nie dociera do właściwych osób</li>
                <li><strong>Zbyt formalny ton</strong> — FB to środowisko społecznościowe, nie urząd</li>
                <li><strong>Brak ceny</strong> — kupujący rzadko piszą po cenę, pomijają takie ogłoszenia</li>
            </ul>

            <h2>Podsumowanie</h2>
            <p>
                Facebook Marketplace nagradza szybkość, lokalność i ludzki ton komunikacji. Dobry tytuł, kilka zdjęć i przyjazny opis to wystarczy żeby sprzedać zdecydowaną większość rzeczy. Nie komplikuj — pisz prosto, podaj cenę i lokalizację, odpowiadaj szybko.
            </p>

            <p>
                Zobacz też nasze inne poradniki: <Link href="/blog/jak-napisac-ogloszenie-olx">ogłoszenia na OLX</Link>, <Link href="/blog/opisy-vinted-przyklady">opisy na Vinted</Link> i <Link href="/blog/jak-sprzedac-allegro-lokalnie">sprzedaż na Allegro Lokalnie</Link>.
            </p>
        </>
    );
}
