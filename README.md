# 🛒 AI Generator Ogłoszeń Sprzedażowych

Aplikacja webowa wykorzystująca AI (OpenAI GPT-4o) do automatycznego generowania profesjonalnych ogłoszeń sprzedażowych na platformy takie jak OLX, Allegro Lokalnie, Facebook Marketplace i Vinted.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)

## ✨ Funkcjonalności

- 📸 **Upload zdjęć** - Drag & drop z podglądem i walidacją (do 8 zdjęć, max 10MB, JPG/PNG/WEBP)
- 🤖 **Analiza AI** - Automatyczne rozpoznawanie produktu ze zdjęć z inteligentną obsługą niepewności
- 🎨 **Warianty stylistyczne** - 3 style komunikacji (Profesjonalny, Przyjazny, Swobodny) z rekomendacjami dla platform
- 📝 **Generowanie ogłoszeń** - Tytuły i opisy dopasowane do platformy i wybranego stylu
- 💰 **Elastyczne ceny** - Sugestie AI, własna cena lub opcja "Za darmo"
- 📷 **Analiza jakości zdjęć** - Ocena każdego zdjęcia z sugestiami poprawek
- 📊 **Podsumowanie generowania** - Przejrzyste wyświetlanie parametrów użytych do generowania
- 🌙 **Dark mode** - Automatyczne przełączanie motywu
- 📱 **Responsywny design** - Działa na każdym urządzeniu
- 📋 **Kopiowanie do schowka** - Szybkie przenoszenie treści na platformę
- ✅ **Interfejs radiowy** - Intuicyjne radio buttons zamiast dropdownów dla lepszego UX

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

1. **Upload zdjęć** - Użytkownik przeciąga lub wybiera zdjęcia produktu (do 8 sztuk)
2. **Wypełnienie formularza** - Wybór platformy (radio buttons), stanu, opcji dostawy (domyślnie oba), stylu komunikacji z rekomendacjami
3. **Obsługa ceny** - Wybór: AI sugeruje cenę, własna cena, lub "Za darmo"
4. **Generowanie** - AI analizuje zdjęcia zgodnie z hierarchią informacji (dane użytkownika > fakty widoczne > wnioski)
5. **Wyniki** - Wyświetlenie tytułu, opisu, ceny (jeśli dotyczy) oraz podsumowania parametrów generowania
6. **Kopiowanie** - Gotowy tytuł i opis można skopiować do schowka jednym kliknięciem

## 🔧 Konfiguracja

### Zmienne środowiskowe

| Zmienna | Opis | Wymagana |
|---------|------|----------|
| `OPENAI_API_KEY` | Klucz API OpenAI | ✅ Tak |
| `NEXT_PUBLIC_SITE_URL` | URL aplikacji | ❌ Nie |

### Wspierane platformy

- **OLX** - Styl zwięzły, praktyczny | Rekomendowany ton: **Swobodny**
- **Allegro Lokalnie** - Profesjonalny, szczegółowy | Rekomendowany ton: **Profesjonalny**
- **Facebook Marketplace** - Przyjazny, bezpośredni | Rekomendowany ton: **Przyjazny**
- **Vinted** - Modowy, lifestyle | Rekomendowany ton: **Przyjazny**

Każda platforma ma dedykowane zasady generowania treści z uwzględnieniem 3 wariantów stylistycznych:
- **Profesjonalny** - Formalny, rzeczowy, ekspertycki
- **Przyjazny** - Ciepły, pomocny, naturalny
- **Swobodny** - Luźny, potoczny, bezpośredni

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
  "priceType": "user_provided",
  "price": "2500",
  "delivery": "odbiór osobisty, wysyłka",
  "notes": "Komplet z pudełkiem",
  "tone": "friendly",
  "generateAllTones": false,
  "images": [
    {
      "base64": "...",
      "filename": "iphone.jpg",
      "mimeType": "image/jpeg"
    }
  ]
}
```

**Pola:**
- `platform`: "olx" | "allegro_lokalnie" | "facebook_marketplace" | "vinted"
- `productName`: Opcjonalna nazwa produktu
- `condition`: Stan produktu
- `priceType`: "user_provided" | "ai_suggest" | "free"
- `price`: Wymagane gdy priceType="user_provided"
- `delivery`: String z opcjami dostawy
- `notes`: Opcjonalne dodatkowe informacje
- `tone`: "professional" | "friendly" | "casual"
- `generateAllTones`: Zawsze false (funkcja usunięta)
- `images`: Tablica zdjęć (base64, max 8)

**Response:**

```json
{
  "isValid": true,
  "title": "iPhone 13 Pro 256GB Grafitowy – Używany, Dobry Stan",
  "description": "Sprzedam iPhone 13 Pro w kolorze grafitowym. Telefon w bardzo dobrym stanie, bez widocznych uszkodzeń. Komplet z oryginalnym pudełkiem...",
  "price": {
    "min": 2300,
    "max": 2700,
    "reason": "Cena adekwatna do stanu urządzenia i aktualnego rynku wtórnego"
  },
  "isFree": false,
  "images": [
    {
      "filename": "iphone.jpg",
      "quality": "Bardzo dobra jakość, produkt wyraźnie widoczny",
      "suggestions": "Dodaj ujęcia z tyłu telefonu i ekranu włączonego",
      "isValid": true
    }
  ],
  "confidence": {
    "productIdentification": "high",
    "specifications": "medium"
  }
}
```

**Pola odpowiedzi:**
- `isValid`: Czy generowanie się powiodło
- `title`: Wygenerowany tytuł ogłoszenia
- `description`: Wygenerowany opis
- `price`: Obiekt z min/max/reason lub null (gdy priceType="user_provided" lub "free")
- `isFree`: true gdy priceType="free"
- `images`: Analiza każdego przesłanego zdjęcia
- `confidence`: Poziom pewności AI co do identyfikacji i specyfikacji

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