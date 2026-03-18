import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function TemplatesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="pl-14 lg:pl-0">
                <h1 className="text-xl sm:text-2xl font-bold">Szablony</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
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
