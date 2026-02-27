# 🛒 AI Generator Ogłoszeń Sprzedażowych

Aplikacja webowa wykorzystująca AI (OpenAI GPT-4o) do automatycznego generowania profesjonalnych ogłoszeń sprzedażowych na platformy takie jak OLX, Allegro Lokalnie, Facebook Marketplace i Vinted.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)

## ✨ Funkcjonalności

- 📸 **Upload zdjęć** - Drag & drop z podglądem i walidacją (max 10MB, JPG/PNG/WEBP)
- 🤖 **Analiza AI** - Automatyczne rozpoznawanie produktu ze zdjęcia
- 📝 **Generowanie ogłoszeń** - Tytuły i opisy dopasowane do platformy sprzedażowej
- 💰 **Sugestie cenowe** - Rekomendowane przedziały cenowe z uzasadnieniem
- 📷 **Analiza jakości zdjęć** - Ocena i sugestie poprawek
- 🌙 **Dark mode** - Automatyczne przełączanie motywu
- 📱 **Responsywny design** - Działa na każdym urządzeniu
- 📋 **Kopiowanie do schowka** - Szybkie przenoszenie treści na platformę

## 🚀 Szybki start

### Wymagania

- Node.js 18+
- Klucz API OpenAI z dostępem do modelu GPT-4o

### Instalacja

```bash
# Klonuj repozytorium
git clone <repo-url>
cd marketplace-assistant

# Zainstaluj zależności
npm install

# Skopiuj plik konfiguracyjny
cp .env.example .env.local

# Dodaj swój klucz API OpenAI do .env.local
# OPENAI_API_KEY=sk-your-api-key-here

# Uruchom serwer deweloperski
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## 📁 Struktura projektu

```
marketplace-assistant/
├── app/
│   ├── api/
│   │   └── generate-ad/
│   │       └── route.ts        # Endpoint API OpenAI
│   ├── globals.css             # Style globalne + zmienne CSS
│   ├── layout.tsx              # Layout z metadanymi SEO
│   └── page.tsx                # Główna strona aplikacji
├── components/
│   ├── ui/                     # Komponenty UI (shadcn/ui style)
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   ├── AdResult.tsx            # Wyświetlanie wygenerowanego ogłoszenia
│   ├── LoadingSpinner.tsx      # Spinner ładowania
│   ├── ProductForm.tsx         # Formularz danych produktu
│   ├── ThemeProvider.tsx       # Provider motywu
│   ├── ThemeToggle.tsx         # Przełącznik dark/light mode
│   └── UploadDropzone.tsx      # Upload zdjęć drag & drop
├── lib/
│   ├── openai.ts               # Klient OpenAI + prompt
│   ├── schemas.ts              # Walidacja Zod
│   ├── types.ts                # TypeScript interfaces
│   └── utils.ts                # Funkcje pomocnicze
├── .env.example                # Przykładowa konfiguracja
├── .env.local                  # Lokalna konfiguracja (gitignore)
├── next.config.ts              # Konfiguracja Next.js
├── package.json
├── tailwind.config.ts          # Konfiguracja Tailwind
└── tsconfig.json               # Konfiguracja TypeScript
```

## 🎯 Jak to działa

1. **Upload zdjęcia** - Użytkownik przeciąga lub wybiera zdjęcie produktu
2. **Wypełnienie formularza** - Wybór platformy, stanu, opcji dostawy
3. **Generowanie** - AI analizuje zdjęcie i tworzy ogłoszenie
4. **Kopiowanie** - Gotowy tytuł i opis można skopiować do schowka

## 🔧 Konfiguracja

### Zmienne środowiskowe

| Zmienna | Opis | Wymagana |
|---------|------|----------|
| `OPENAI_API_KEY` | Klucz API OpenAI | ✅ Tak |
| `NEXT_PUBLIC_SITE_URL` | URL aplikacji | ❌ Nie |

### Wspierane platformy

- **OLX** - Styl zwięzły, praktyczny
- **Allegro Lokalnie** - Profesjonalny, szczegółowy
- **Facebook Marketplace** - Przyjazny, bezpośredni
- **Vinted** - Modowy, lifestyle

## 🚢 Deployment

### Vercel (rekomendowane)

```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Zaloguj się
vercel login

# Deploy
vercel

# Dodaj zmienne środowiskowe
vercel env add OPENAI_API_KEY

# Deploy produkcyjny
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 API Reference

### POST /api/generate-ad

Generuje ogłoszenie sprzedażowe na podstawie zdjęcia i danych produktu.

**Request Body:**

```json
{
  "platform": "olx",
  "productName": "iPhone 13 Pro",
  "condition": "używany, w dobrym stanie",
  "price": "2500",
  "delivery": "odbiór osobisty, wysyłka",
  "notes": "Komplet z pudełkiem",
  "image": {
    "base64": "...",
    "filename": "iphone.jpg",
    "mimeType": "image/jpeg"
  }
}
```

**Response:**

```json
{
  "isValid": true,
  "title": "iPhone 13 Pro 256GB Grafitowy – Używany, Dobry Stan",
  "description": "Oferuję iPhone 13 Pro w kolorze grafitowym...",
  "price": {
    "min": 2300,
    "max": 2700,
    "reason": "Cena adekwatna do stanu i rynku wtórnego"
  },
  "images": [
    {
      "filename": "iphone.jpg",
      "quality": "dobra",
      "suggestions": "dodaj ujęcia ekranu i tyłu",
      "isValid": true,
      "reason": "Zdjęcie czytelne, produkt rozpoznawalny"
    }
  ]
}
```

## 🛠 Rozwój

```bash
# Uruchom testy
npm run lint

# Build produkcyjny
npm run build

# Uruchom produkcję lokalnie
npm start
```

## 📄 Licencja

MIT License - możesz używać tego projektu do celów prywatnych i komercyjnych.

## 🤝 Wsparcie

Jeśli masz pytania lub problemy:
1. Sprawdź czy masz aktualny klucz API OpenAI
2. Upewnij się, że masz dostęp do modelu GPT-4o
3. Sprawdź logi konsoli w przeglądarce i serwerze

---

Stworzono z ❤️ przy użyciu Next.js, TypeScript i OpenAI