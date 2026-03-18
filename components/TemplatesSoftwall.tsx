import { Crown } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { TEMPLATE_PLACEHOLDERS } from "@/lib/template-placeholders";

export function TemplatesSoftwall() {
    return (
        <div className="flex flex-col items-center text-center max-w-xl mx-auto py-12 space-y-6">
            {/* Icon badge */}
            <div className="rounded-full bg-primary/10 p-4">
                <Crown className="h-8 w-8 text-primary" />
            </div>

            {/* Heading + description */}
            <div className="space-y-2">
                <h2 className="text-xl font-bold">Szablony dostępne w planie Reseler</h2>
                <p className="text-muted-foreground text-sm">
                    Zdefiniuj własny szkielet opisu ogłoszenia z placeholderami,
                    które AI wypełni na podstawie zdjęć i parametrów.
                </p>
            </div>

            {/* Placeholder list */}
            <div className="w-full text-left bg-muted rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Dostępne placeholdery:</p>
                <ul className="space-y-1">
                    {TEMPLATE_PLACEHOLDERS.map((p) => (
                        <li key={p.key} className="text-sm flex items-start gap-2">
                            <code className="bg-background border border-border rounded px-1.5 py-0.5 text-xs font-mono text-primary shrink-0">
                                {p.key}
                            </code>
                            <span className="text-muted-foreground">{p.description}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Example template */}
            <div className="w-full text-left">
                <p className="text-sm font-medium mb-2">Przykład szablonu:</p>
                <pre className="bg-muted border border-border rounded-xl p-4 text-xs text-muted-foreground whitespace-pre-wrap font-mono">
{`Sprzedam {{nazwa}}.

Stan: {{stan}}.
{{opis_techniczny}}

Dostawa: {{sposób_wysyłki}}.
Cena: {{cena}} zł.

Zapraszam do kontaktu!`}
                </pre>
            </div>

            {/* CTA */}
            <Link href="/dashboard/pricing" className={buttonVariants()}>
                Przejdź do cennika
            </Link>
        </div>
    );
}
