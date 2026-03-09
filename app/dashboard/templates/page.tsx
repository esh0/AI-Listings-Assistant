import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function TemplatesPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Szablony</h1>
                <p className="text-muted-foreground mt-1">
                    Zapisz często używane ustawienia jako szablony
                </p>
            </div>

            {/* Coming Soon Message */}
            <Alert className="bg-primary/10 border-primary/30">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground">
                    Funkcja szablonów zostanie dodana w przyszłości.
                </AlertDescription>
            </Alert>
        </div>
    );
}
