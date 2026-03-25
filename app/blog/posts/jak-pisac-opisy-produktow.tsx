import Link from "next/link";

export default function JakPisacOpisyProduktow() {
    return (
        <>
            <p>
                Większość ogłoszeń sprzedażowych jest napisana źle. Nie dlatego że sprzedawcy są leniwi — ale dlatego że nikt nie uczył ich jak to robić dobrze. Efekt? Produkty które mogłyby sprzedać się w tydzień, czekają miesiącami. Ten artykuł zmienia to w 10 minut.
            </p>

            <h2>Dlaczego opis produktu ma tak duże znaczenie?</h2>
            <p>
                Kupujący online nie może dotknąć produktu, powąchać go, sprawdzić na własne oczy. Jedyne czego ma pewność to zdjęcia i słowa. Jeśli opis jest niejasny, niekompletny lub po prostu nieinteresujący — kupujący idzie dalej. Na każdej platformie masz dosłownie kilka sekund żeby go zatrzymać.
            </p>
            <p>
                Badania eye-tracking pokazują że kupujący skanują stronę ogłoszenia w określonej kolejności: zdjęcie → tytuł → cena → pierwsze zdanie opisu. Jeśli którykolwiek z tych elementów nie spełnia oczekiwań, reszta jest nieistotna.
            </p>

            <h2>Zasada 1: Zacznij od najważniejszej informacji</h2>
            <p>
                Nie zaczynaj opisu od &quot;Witam&quot;, &quot;Sprzedam&quot; ani &quot;Oferuję Państwu&quot;. Zacznij od produktu. Pierwsze zdanie powinno odpowiadać na pytanie: <em>co to dokładnie jest?</em>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Źle</p>
                    <p className="text-sm">&quot;Witam serdecznie, mam do sprzedania bardzo fajny przedmiot który może się komuś przydać...&quot;</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Dobrze</p>
                    <p className="text-sm">&quot;Aparat Canon EOS 600D z obiektywem 18-55mm, rocznik 2012, w pełni sprawny, stan bardzo dobry.&quot;</p>
                </div>
            </div>

            <h2>Zasada 2: Bądź konkretny — liczby i fakty, nie przymiotniki</h2>
            <p>
                &quot;Duży&quot;, &quot;ładny&quot;, &quot;dobry stan&quot; — to słowa które nic nie mówią kupującemu. Każdy ma inne wyobrażenie co znaczy &quot;duży&quot; lub &quot;dobry stan&quot;. Zamiast przymiotników podaj fakty:
            </p>
            <ul>
                <li>Zamiast &quot;duży stół&quot; → &quot;stół 180×90 cm&quot;</li>
                <li>Zamiast &quot;prawie nowy&quot; → &quot;używany 3 razy, bez śladów użytkowania&quot;</li>
                <li>Zamiast &quot;dobry stan&quot; → &quot;drobna rysa na prawym boku, widoczna na zdjęciu 4&quot;</li>
                <li>Zamiast &quot;szybki laptop&quot; → &quot;Intel Core i5, 16 GB RAM, SSD 512 GB&quot;</li>
            </ul>
            <p>
                Konkretne dane budują zaufanie i eliminują pytania. Kupujący który nie musi nic dopytywać — kupuje szybciej.
            </p>

            <h2>Zasada 3: Opisz wady zanim kupujący je znajdzie</h2>
            <p>
                To brzmi kontrintuicyjnie, ale działa. Sprzedawcy którzy uczciwie opisują wady produktu mają wyższy wskaźnik zakończonych transakcji i mniej sporów. Powód jest prosty: kupujący czuje się bezpieczniej kupując od kogoś kto nie ma nic do ukrycia.
            </p>
            <p>
                Co więcej — jeśli kupujący odkryje wadę sam (na zdjęciu lub po zakupie), którą przemilczałeś, stracisz zaufanie i dostaniesz negatywną opinię. Jeśli napiszesz o niej wprost, to wada staje się częścią transakcji na którą kupujący świadomie się zgadza.
            </p>
            <blockquote>
                Uczciwy sprzedawca sprzedaje szybciej niż sprytny.
            </blockquote>

            <h2>Zasada 4: Odpowiedz na pytania zanim padną</h2>
            <p>
                Każde pytanie kupującego to sygnał że opis jest niekompletny. Najczęściej zadawane pytania na każdej platformie to:
            </p>
            <ul>
                <li>&quot;Czy wysyłasz?&quot; — zawsze podaj opcje wysyłki i koszt</li>
                <li>&quot;Jaki dokładnie stan?&quot; — opisz konkretnie, z odniesieniem do zdjęć</li>
                <li>&quot;Czy cena negocjowalna?&quot; — napisz wprost czy tak, czy nie</li>
                <li>&quot;Czy to pasuje do X?&quot; — podaj wymiary, kompatybilność, rozmiar</li>
                <li>&quot;Dlaczego sprzedajesz?&quot; — krótka odpowiedź buduje zaufanie</li>
            </ul>
            <p>
                Opis który z góry odpowiada na te pytania eliminuje etap negocjacji i przyspiesza decyzję o zakupie.
            </p>

            <h2>Zasada 5: Dopasuj ton do platformy</h2>
            <p>
                Ten sam produkt powinien być opisany inaczej na OLX, inaczej na Vinted, a jeszcze inaczej na eBay. Każda platforma ma własną kulturę komunikacji i własnych użytkowników z różnymi oczekiwaniami:
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Platforma</th>
                        <th>Oczekiwany ton</th>
                        <th>Styl</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>OLX</td>
                        <td>Swobodny, bezpośredni</td>
                        <td>Krótko i na temat</td>
                    </tr>
                    <tr>
                        <td>Allegro Lokalnie</td>
                        <td>Profesjonalny</td>
                        <td>Ustrukturyzowany, pełna specyfikacja</td>
                    </tr>
                    <tr>
                        <td>Facebook Marketplace</td>
                        <td>Przyjazny, społecznościowy</td>
                        <td>Jak do znajomego</td>
                    </tr>
                    <tr>
                        <td>Vinted</td>
                        <td>Przyjazny, szczery</td>
                        <td>Lifestyle, budowanie zaufania</td>
                    </tr>
                    <tr>
                        <td>eBay</td>
                        <td>Profesjonalny, neutralny</td>
                        <td>Pełna specyfikacja po angielsku</td>
                    </tr>
                    <tr>
                        <td>Amazon</td>
                        <td>Sprzedażowy, keyword-driven</td>
                        <td>Korzyści + słowa kluczowe</td>
                    </tr>
                    <tr>
                        <td>Etsy</td>
                        <td>Storytelling, emocjonalny</td>
                        <td>Historia produktu i twórcy</td>
                    </tr>
                </tbody>
            </table>
            <p>
                Pisanie osobnego opisu dla każdej platformy ręcznie zajmuje dużo czasu. Dlatego właśnie powstał <Link href="/">Marketplace AI</Link> — generuje opisy dopasowane do tonu i reguł każdej platformy automatycznie.
            </p>

            <h2>Zasada 6: Tytuł to reklama, opis to sprzedawca</h2>
            <p>
                Tytuł ogłoszenia ma jeden cel: sprawić żeby kupujący kliknął. Opis ma jeden cel: sprawić żeby kupił. To dwie różne funkcje i należy je traktować osobno.
            </p>
            <p>
                <strong>Dobry tytuł</strong> zawiera słowa kluczowe, markę, model i stan — wszystko co pozwala algorytmowi wyświetlić ogłoszenie właściwej osobie. Nie ma tu miejsca na emocje ani przymiotniki.
            </p>
            <p>
                <strong>Dobry opis</strong> rozwija co zaczął tytuł — dodaje szczegóły, usuwa wątpliwości i przekonuje do zakupu. Tu jest miejsce na kontekst, historię i odpowiedź na pytania.
            </p>

            <h2>Zasada 7: Zdjęcia i opis muszą tworzyć spójną całość</h2>
            <p>
                Opis bez zdjęć jest niekompletny. Zdjęcia bez opisu zostawiają za dużo domysłów. Razem powinny dawać kupującemu pełny obraz produktu — żeby mógł podjąć decyzję bez żadnych wątpliwości.
            </p>
            <p>
                Praktyczna zasada: w opisie odwołuj się do zdjęć (&quot;drobna rysa widoczna na zdjęciu 3&quot;, &quot;zdjęcie 5 pokazuje kompletny zestaw akcesoriów&quot;). To sprawia że kupujący ogląda wszystkie zdjęcia i lepiej rozumie co kupuje.
            </p>
            <ul>
                <li>Min. 3-4 zdjęcia dla każdego ogłoszenia</li>
                <li>Pierwsze zdjęcie: produkt w całości, dobre oświetlenie, neutralne tło</li>
                <li>Zdjęcia wad — obowiązkowe jeśli istnieją</li>
                <li>Zdjęcia akcesoriów i zawartości zestawu</li>
            </ul>

            <h2>Jak zastosować te zasady w praktyce — szybko</h2>
            <p>
                Wdrożenie tych 7 zasad ręcznie dla każdego ogłoszenia zajmuje czas. Jeśli sprzedajesz regularnie — kilka lub kilkanaście przedmiotów miesięcznie — warto zautomatyzować ten proces.
            </p>
            <p>
                <Link href="/">Marketplace AI</Link> stosuje wszystkie te zasady automatycznie: analizuje zdjęcie produktu, dobiera odpowiedni ton do wybranej platformy, buduje strukturę opisu i sugeruje cenę. Pierwsze 3 ogłoszenia możesz wygenerować za darmo, bez rejestracji.
            </p>

            <h2>Poradniki dla konkretnych platform</h2>
            <p>
                Każda platforma ma swoje specyficzne reguły — przeczytaj dedykowany poradnik zanim zaczniesz wystawiać:
            </p>
            <ul>
                <li><Link href="/blog/jak-napisac-ogloszenie-olx">Jak napisać ogłoszenie na OLX — poradnik 2026</Link></li>
                <li><Link href="/blog/jak-sprzedac-allegro-lokalnie">Jak sprzedawać na Allegro Lokalnie — triki i porady</Link></li>
                <li><Link href="/blog/facebook-marketplace-opis">Facebook Marketplace — jak pisać opisy które sprzedają</Link></li>
                <li><Link href="/blog/opisy-vinted-przyklady">Opisy na Vinted — przykłady i szablony</Link></li>
                <li><Link href="/blog/jak-sprzedawac-na-ebay">Jak sprzedawać na eBay z Polski</Link></li>
                <li><Link href="/blog/jak-sprzedac-na-amazon">Amazon listing — jak tworzyć skuteczne oferty</Link></li>
                <li><Link href="/blog/jak-sprzedac-na-etsy">Jak sprzedawać na Etsy — poradnik dla twórców</Link></li>
            </ul>
        </>
    );
}
