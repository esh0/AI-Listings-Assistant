export interface BlogPost {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    publishedAt: string;
    updatedAt?: string;
    readingTimeMinutes: number;
    primaryKeyword: string;
    tags: string[];
    excerpt: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: "jak-napisac-ogloszenie-olx",
        title: "Jak napisać dobre ogłoszenie na OLX — kompletny poradnik 2026",
        metaTitle: "Jak napisać ogłoszenie na OLX — poradnik i przykłady 2026",
        metaDescription:
            "Dowiedz się jak napisać skuteczne ogłoszenie na OLX. Tytuł, opis, cena — wzory, przykłady przed/po i lista błędów do unikania.",
        publishedAt: "2026-03-25",
        readingTimeMinutes: 6,
        primaryKeyword: "jak napisać ogłoszenie OLX",
        tags: ["OLX", "ogłoszenia", "sprzedaż online", "poradnik"],
        excerpt:
            "Dobry tytuł, konkretny opis i odpowiednia cena to trzy rzeczy które decydują, czy Twój produkt sprzeda się szybko. Sprawdź jak je napisać.",
    },
    {
        slug: "opisy-vinted-przyklady",
        title: "Najlepsze opisy na Vinted — przykłady, szablony i porady 2026",
        metaTitle: "Opis na Vinted — przykłady i szablony dla sprzedających 2026",
        metaDescription:
            "Praktyczne przykłady opisów na Vinted które sprzedają. Szablony dla ubrań, butów i akcesoriów oraz najczęstsze błędy sprzedających.",
        publishedAt: "2026-03-25",
        readingTimeMinutes: 5,
        primaryKeyword: "opis Vinted przykład",
        tags: ["Vinted", "odzież", "ogłoszenia", "szablony"],
        excerpt:
            "Vinted rządzi się swoimi prawami — kupujący są tu wrażliwi na styl komunikacji. Dowiedz się jak pisać opisy które budują zaufanie i prowadzą do sprzedaży.",
    },
    {
        slug: "generator-ogloszen-ai",
        title: "Generator ogłoszeń AI — jak działa Marketplace AI i dlaczego to działa?",
        metaTitle: "Generator ogłoszeń AI — Marketplace AI | Jak to działa?",
        metaDescription:
            "Marketplace AI generuje opisy na OLX, Vinted, Allegro i Facebook ze zdjęcia. Sprawdź jak działa AI generator ogłoszeń sprzedażowych.",
        publishedAt: "2026-03-25",
        readingTimeMinutes: 5,
        primaryKeyword: "generator ogłoszeń AI",
        tags: ["AI", "generator ogłoszeń", "automatyzacja", "narzędzia"],
        excerpt:
            "Wrzucasz zdjęcie, wybierasz platformę i w kilka sekund masz gotowy tytuł, opis i sugestię ceny. Sprawdź jak to działa i dlaczego AI radzi sobie lepiej niż pisanie od zera.",
    },
    {
        slug: "jak-sprzedac-allegro-lokalnie",
        title: "Jak sprzedawać na Allegro Lokalnie — sprawdzone triki i porady 2026",
        metaTitle: "Allegro Lokalnie jak sprzedać — poradnik 2026",
        metaDescription:
            "Jak skutecznie sprzedawać na Allegro Lokalnie? Ogłoszenia, zdjęcia, negocjacje — praktyczny poradnik z przykładami tytułów i opisów.",
        publishedAt: "2026-03-25",
        readingTimeMinutes: 6,
        primaryKeyword: "Allegro Lokalnie jak sprzedać",
        tags: ["Allegro Lokalnie", "ogłoszenia", "sprzedaż", "poradnik"],
        excerpt:
            "Allegro Lokalnie to coraz popularniejsza alternatywa dla OLX — z inną bazą użytkowników i innymi oczekiwaniami. Dowiedz się jak pisać ogłoszenia które tam działają.",
    },
    {
        slug: "facebook-marketplace-opis",
        title: "Facebook Marketplace — jak pisać opisy które przyciągają kupujących?",
        metaTitle: "Facebook Marketplace opis — porady i przykłady 2026",
        metaDescription:
            "Jak pisać opisy na Facebook Marketplace które sprzedają? Tytuł, opis, cena, zdjęcia — poradnik z przykładami dla sprzedających w Polsce.",
        publishedAt: "2026-03-25",
        readingTimeMinutes: 5,
        primaryKeyword: "Facebook Marketplace opis",
        tags: ["Facebook Marketplace", "ogłoszenia", "sprzedaż", "FB"],
        excerpt:
            "Facebook Marketplace to sprzedaż w środowisku społecznościowym — kupujący oczekują innego tonu niż na OLX. Sprawdź jak to wykorzystać.",
    },
    {
        slug: "jak-sprzedawac-na-ebay",
        title: "Jak sprzedawać na eBay — poradnik dla polskich sprzedawców 2026",
        metaTitle: "Jak sprzedawać na eBay po polsku — poradnik 2026",
        metaDescription:
            "Jak wystawiać produkty na eBay z Polski? Tytuł, opis, wysyłka zagraniczna, stan kondycji — kompletny poradnik dla początkujących resellerów.",
        publishedAt: "2026-03-25",
        readingTimeMinutes: 7,
        primaryKeyword: "jak sprzedawać na eBay",
        tags: ["eBay", "reselling", "sprzedaż zagraniczna", "poradnik"],
        excerpt:
            "eBay to dostęp do 130 milionów kupujących z całego świata. Dowiedz się jak pisać oferty po angielsku, ustawiać wysyłkę z Polski i unikać błędów które kosztują negatywne opinie.",
    },
    {
        slug: "jak-sprzedac-na-amazon",
        title: "Jak sprzedawać na Amazon — tworzenie listingów krok po kroku 2026",
        metaTitle: "Amazon listing jak stworzyć — poradnik sprzedawcy 2026",
        metaDescription:
            "Jak tworzyć skuteczne listingi na Amazon? Tytuł, bullet points, backend keywords, zdjęcia — kompletny poradnik optymalizacji pod algorytm A9.",
        publishedAt: "2026-03-25",
        readingTimeMinutes: 7,
        primaryKeyword: "jak sprzedawać na Amazon",
        tags: ["Amazon", "listing", "e-commerce", "reselling"],
        excerpt:
            "Amazon rządzi się innymi prawami niż OLX czy eBay. Algorytm A9 decyduje kto wygra — sprawdź jak zoptymalizować tytuł, bullet points i zdjęcia żeby Twój listing był widoczny.",
    },
    {
        slug: "jak-sprzedac-na-etsy",
        title: "Jak sprzedawać na Etsy — poradnik dla twórców i resellerów 2026",
        metaTitle: "Jak sprzedawać na Etsy — poradnik 2026",
        metaDescription:
            "Jak tworzyć skuteczne listingi na Etsy? Tytuł SEO, tagi, storytelling w opisie i zdjęcia lifestyle — poradnik dla sprzedawców handmade i vintage.",
        publishedAt: "2026-03-25",
        readingTimeMinutes: 6,
        primaryKeyword: "jak sprzedawać na Etsy",
        tags: ["Etsy", "handmade", "vintage", "sprzedaż online"],
        excerpt:
            "Etsy to platforma dla twórców i kolekcjonerów gdzie storytelling sprzedaje tak samo jak SEO. Dowiedz się jak pisać tytuły, wypełniać tagi i tworzyć opisy które trafiają do serc kupujących.",
    },
    {
        slug: "jak-pisac-opisy-produktow",
        title: "Jak pisać opisy produktów które szybciej sprzedają — 7 zasad",
        metaTitle: "Jak pisać opisy produktów które sprzedają — 7 zasad",
        metaDescription:
            "7 zasad pisania opisów produktów które przyciągają kupujących i zamykają sprzedaż. Praktyczny poradnik dla sprzedających na OLX, Vinted, Allegro i innych platformach.",
        publishedAt: "2026-03-25",
        readingTimeMinutes: 6,
        primaryKeyword: "jak pisać opisy produktów",
        tags: ["copywriting", "ogłoszenia", "sprzedaż online", "poradnik"],
        excerpt:
            "Większość ogłoszeń jest napisana źle — nie z lenistwa, ale z braku wiedzy jak to robić dobrze. 7 zasad które działają na każdej platformie sprzedażowej.",
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
    return [...BLOG_POSTS].sort(
        (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}
