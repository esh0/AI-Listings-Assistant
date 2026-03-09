import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-lg w-full p-8 text-center space-y-6">
                <h1 className="text-3xl font-bold">Cennik</h1>
                <p className="text-muted-foreground leading-relaxed">
                    Strona cenowa jest w przygotowaniu. Wkrótce będziesz mógł zmienić plan i dokupić kredyty.
                </p>
                <div className="space-y-3">
                    <Link href="/dashboard">
                        <Button variant="outline" className="w-full">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Wróć do panelu
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
