# Design: Edycja wygenerowanej treści ogłoszenia

**Data:** 2026-03-05
**Status:** Approved
**Autor:** Claude (z użytkownikiem)

## Cel

Umożliwić użytkownikom edycję tytułu i opisu po wygenerowaniu ogłoszenia przez AI, przed zapisaniem do bazy danych.

## Kontekst

Obecnie użytkownicy widzą wygenerowany tytuł i opis, ale nie mogą ich edytować przed zapisaniem. Chcemy dodać inline editing w stylu "toggle między widokiem a edycją" - czytelny, intuicyjny pattern z minimalną złożonością.

## Kluczowe decyzje

1. **Kiedy następuje zapis**: Edytowana treść zapisywana TYLKO przy kliknięciu głównego przycisku "Zapisz" (zielonego). Brak auto-save, brak osobnych przycisków "Zatwierdź edycję".

2. **Walidacja**: Prosty check "nie puste" - puste pola blokują przycisk "Zapisz". Brak minimalnej długości ani zaawansowanych reguł.

3. **Lokalizacja ikony**: W headerze karty obok przycisku "Kopiuj" - spójna z istniejącym UI.

4. **Wybrane podejście**: Toggle między widokiem a edycją (Podejście 1) - najprostsze w implementacji, najlepsza kontrola walidacji i UX.

## UI/UX Pattern

### Tryb wyświetlania (domyślny)

**Header karty:**
- Ikona `Pencil` (lucide-react) obok przycisku "Kopiuj"
- Styl: `variant="ghost"`, hover orange (spójny z "Kopiuj")
- Tooltip: "Edytuj"

**Treść:**
- Tytuł: `<p>` z classami `text-base leading-relaxed`
- Opis: `<p>` z `whitespace-pre-wrap` (zachowuje formatowanie)

### Tryb edycji (po kliknięciu Pencil)

**Header karty:**
- Ikona `X` zastępuje `Pencil`
- Przycisk "Kopiuj" **POZOSTAJE** (można kopiować podczas edycji)
- Kolor `X`: red hover (`hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950`)
- Tooltip: "Anuluj edycję"

**Treść:**
- **Tytuł**: `<input type="text">` z auto-focus
  - Max length: 200 znaków
  - Placeholder: "Wprowadź tytuł…"
  - Styling: border orange na focus, padding jak w formularzach

- **Opis**: `<textarea>` z auto-focus
  - Rows: 12 (auto-adjust do treści)
  - Max length: 5000 znaków
  - Placeholder: "Wprowadź opis…"
  - Resize: vertical tylko

**Keyboard shortcuts:**
- `Escape` - anuluj edycję (powrót do view, zmiany POZOSTAJĄ w state)
- `Cmd/Ctrl + Enter` - zatwierdź (zamknij edycję, nie zapisz do DB)

**Walidacja:**
- Red border jeśli pole puste
- Error message pod polem: "Pole nie może być puste"
- Główny przycisk "Zapisz" disabled jeśli tytuł lub opis pusty

**Licznik znaków:**
- Pod textarea/input: `<p class="text-xs text-gray-500">123 / 200 znaków</p>`
- Zmienia się na czerwono gdy > 90% limitu

## Architektura komponentów

### Przepływ danych

```
AdGeneratorForm (parent)
  ├─ state: editedTitle, editedDescription
  ├─ props down: title, description (original from AI)
  │              editedTitle, editedDescription (editable state)
  │              callbacks: onTitleChange, onDescriptionChange
  │
  └─> AdResult (wrapper)
       └─> AdResultMain (display/edit component)
            ├─ local state: isEditingTitle, isEditingDescription
            ├─ displays: editedTitle/editedDescription (from parent)
            └─ onChange: calls parent callbacks to update state
```

### Responsibility split

**Parent state (AdGeneratorForm):**
- `editedTitle`, `editedDescription` - aktualna edytowalna wartość
- Callbacks: `setEditedTitle`, `setEditedDescription`
- Inicjalizacja: po otrzymaniu `result` z API, ustawiamy `editedTitle = result.title`
- `handleSave()` używa `editedTitle/editedDescription` zamiast oryginalnych wartości

**Local state (AdResultMain):**
- `isEditingTitle`, `isEditingDescription` - tryb edycji (UI concern)
- Refs: `titleInputRef`, `descInputRef` - auto-focus

**Props (immutable):**
- `title`, `description` - oryginalne wartości z API (referencyjne, nie używane do zapisu)

### Zmiany w komponentach

**1. AdGeneratorForm.tsx:**
```typescript
// Nowy state
const [editedTitle, setEditedTitle] = useState<string>("")
const [editedDescription, setEditedDescription] = useState<string>("")

// Po otrzymaniu result z API
useEffect(() => {
  if (result?.title) setEditedTitle(result.title)
  if (result?.description) setEditedDescription(result.description)
}, [result])

// Walidacja
const isTitleValid = editedTitle.trim().length > 0
const isDescriptionValid = editedDescription.trim().length > 0
const canSave = isTitleValid && isDescriptionValid && !isSaving

// handleSave używa editedTitle/editedDescription
```

**2. AdResult.tsx:**
```typescript
<AdResultMain
  title={displayContent.title!}
  description={displayContent.description!}
  editedTitle={editedTitle}
  editedDescription={editedDescription}
  onTitleChange={setEditedTitle}
  onDescriptionChange={setEditedDescription}
/>
```

**3. AdResultMain.tsx:**
```typescript
// Nowe propsy
interface AdResultMainProps {
  title: string;
  description: string;
  editedTitle: string;
  editedDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

// Local state
const [isEditingTitle, setIsEditingTitle] = useState(false)
const [isEditingDescription, setIsEditingDescription] = useState(false)

// Refs
const titleInputRef = useRef<HTMLInputElement>(null)
const descInputRef = useRef<HTMLTextAreaElement>(null)

// Toggle handlers
const handleEditTitle = () => {
  setIsEditingTitle(true)
  setTimeout(() => titleInputRef.current?.focus(), 0)
}

const handleCancelEditTitle = () => {
  setIsEditingTitle(false)
}

// Conditional render w JSX
{isEditingTitle ? (
  <input ref={titleInputRef} value={editedTitle} onChange={...} />
) : (
  <p>{editedTitle}</p>
)}
```

## Szczegóły implementacji

### Keyboard handlers

```typescript
const handleTitleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    handleCancelEditTitle()
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    handleCancelEditTitle()
  }
}

const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    handleCancelEditDescription()
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    handleCancelEditDescription()
  }
}
```

### Auto-resize textarea

```typescript
const textareaRef = useRef<HTMLTextAreaElement>(null)

useEffect(() => {
  const textarea = textareaRef.current
  if (textarea && isEditingDescription) {
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }
}, [editedDescription, isEditingDescription])
```

### Walidacja wyświetlania

```typescript
// W AdResultMain - błędy pod polem
{isEditingTitle && !isTitleValid && (
  <p className="text-xs text-red-600 mt-1">Pole nie może być puste</p>
)}

// Licznik znaków
const titleLength = editedTitle.length
const titleMaxLength = 200
const isTitleNearLimit = titleLength > titleMaxLength * 0.9

<p className={cn(
  "text-xs mt-1",
  isTitleNearLimit ? "text-red-600" : "text-gray-500"
)}>
  {titleLength} / {titleMaxLength} znaków
</p>
```

### Kopiowanie w trybie edycji

```typescript
const handleCopyTitle = useCallback(async () => {
  const textToCopy = isEditingTitle ? editedTitle : editedTitle
  try {
    await navigator.clipboard.writeText(textToCopy)
    setCopiedTitle(true)
    setTimeout(() => setCopiedTitle(false), 2000)
  } catch (error) {
    console.error("Nie udało się skopiować tytułu:", error)
  }
}, [editedTitle, isEditingTitle])
```

## Edge cases

1. **Użytkownik edytuje tytuł, potem klika "Nowe ogłoszenie":**
   - `handleReset()` czyści state: `setEditedTitle("")`, `setEditedDescription("")`
   - Tryb edycji automatycznie wychodzi (odmontowanie komponentu)

2. **Użytkownik edytuje opis, potem klika "Zapisz":**
   - Zapisujemy `editedTitle` i `editedDescription` (nie oryginalne z API)
   - Redirect do `/dashboard/ads`

3. **Użytkownik wkleja bardzo długi tekst:**
   - Input/textarea mają `maxLength` - przeglądarka automatycznie obcina
   - Licznik pokazuje "200 / 200" (czerwony)

4. **Użytkownik usuwa całą treść z pola:**
   - Border red, error message, przycisk "Zapisz" disabled

5. **Użytkownik kopiuje podczas edycji:**
   - Przycisk "Kopiuj" pozostaje dostępny
   - Kopiuje aktualną wartość z textarea/input

## Testowanie

**Manualne scenariusze:**
1. Wygeneruj ogłoszenie → kliknij Pencil przy tytule → zmień tytuł → kliknij X → sprawdź czy zmiana została zachowana
2. Edytuj opis → naciśnij Escape → sprawdź czy wyszło z trybu edycji
3. Wyczyść tytuł → sprawdź czy przycisk "Zapisz" jest disabled
4. Wklej 500 znaków do tytułu (max 200) → sprawdź czy obcięło i pokazało licznik czerwony
5. Edytuj tytuł → kliknij "Kopiuj" → sprawdź czy skopiował edytowaną wersję
6. Edytuj opis → Cmd+Enter → sprawdź czy wyszło z edycji (bez zapisania do DB)
7. Edytuj tytuł → kliknij "Zapisz" (główny) → sprawdź czy zapisało edytowaną wersję
8. Edytuj tytuł → kliknij "Nowe ogłoszenie" → sprawdź czy reset wyczyścił state

## Metryki sukcesu

1. Użytkownik może edytować tytuł i opis przed zapisaniem
2. Zmiany widoczne w czasie rzeczywistym w UI
3. Walidacja blokuje zapis pustych pól
4. Keyboard shortcuts działają (Escape, Cmd+Enter)
5. Licznik znaków pokazuje aktualne użycie
6. Edge cases obsłużone gracefully (paste długiego tekstu, reset formularza)

## Przyszłe ulepszenia (out of scope)

- Podgląd markdown/formatowania w opisie
- Historia edycji (undo/redo)
- Auto-save do localStorage (przetrwanie refresh)
- Spell-check w textarea
- Porównanie "przed/po" (diff view)
