export const TEMPLATE_PLACEHOLDERS = [
  { key: "{{nazwa}}",           label: "Nazwa produktu",    description: "AI rozpozna nazwę ze zdjęć lub notatek" },
  { key: "{{stan}}",            label: "Stan produktu",     description: "Stan wybrany w formularzu" },
  { key: "{{cena}}",            label: "Cena",              description: "Cena podana lub sugerowana przez AI" },
  { key: "{{opis_techniczny}}", label: "Opis techniczny",   description: "Specyfikacje rozpoznane ze zdjęcia" },
  { key: "{{sposób_wysyłki}}",  label: "Sposób wysyłki",    description: "Wybrana opcja dostawy" },
] as const;

export type PlaceholderKey = typeof TEMPLATE_PLACEHOLDERS[number]["key"];
