import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function TemplatesPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Szablony</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Zapisz często używane ustawienia jako szablony
                </p>
            </div>

            {/* Coming Soon Message */}
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Funkcja szablonów zostanie dodana w przyszłości.
                </AlertDescription>
            </Alert>
        </div>
    );
}
