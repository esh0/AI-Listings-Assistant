import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdGeneratorForm } from "@/components/AdGeneratorForm";

// Force Node.js runtime
export const runtime = "nodejs";

export default async function NewAdPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin?callbackUrl=/dashboard/new");
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Nowe ogłoszenie
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Wgraj zdjęcia i wygeneruj profesjonalne ogłoszenie
                </p>
            </div>

            {/* Form */}
            <AdGeneratorForm />
        </div>
    );
}
