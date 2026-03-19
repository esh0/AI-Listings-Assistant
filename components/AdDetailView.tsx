"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdDetailActions } from "@/components/AdDetailActions";
import { ListingContent } from "@/components/listing/ListingContent";
import { ListingSidebar } from "@/components/listing/ListingSidebar";
import type { Platform } from "@/lib/types";
import type { AdStatus } from "@prisma/client";

interface AdDetailViewProps {
    ad: {
        id: string;
        title: string;
        description: string;
        status: AdStatus;
        platform: Platform;
        priceMin: number | null;
        priceMax: number | null;
        soldPrice: number | null;
        createdAt: Date;
        updatedAt: Date;
        images: Array<{ url: string; quality?: string; suggestions?: string }>;
        parameters: {
            condition?: string;
            tone?: string;
            delivery?: string[];
            productName?: string;
            notes?: string;
            priceType?: string;
            userPrice?: number;
        } | null;
    };
}

export function AdDetailView({ ad }: AdDetailViewProps) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(ad.title);
    const [description, setDescription] = useState(ad.description);

    return (
        <div className="space-y-4">
            {/* Top bar: back + actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Link href="/dashboard/ads">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Moje ogłoszenia
                    </Button>
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                    <AdDetailActions
                        ad={{ id: ad.id, status: ad.status }}
                        title={title}
                        description={description}
                        hasEdits={title !== ad.title || description !== ad.description}
                        editing={editing}
                        onEditToggle={() => setEditing((e) => !e)}
                    />
                </div>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                <ListingContent
                    id={ad.id}
                    platform={ad.platform}
                    status={ad.status}
                    createdAt={ad.createdAt}
                    title={title}
                    description={description}
                    editing={editing}
                    firstImage={ad.images[0]?.url}
                    onTitleChange={setTitle}
                    onDescriptionChange={setDescription}
                />
                <ListingSidebar
                    platform={ad.platform}
                    status={ad.status}
                    priceMin={ad.priceMin}
                    priceMax={ad.priceMax}
                    soldPrice={ad.soldPrice}
                    createdAt={ad.createdAt}
                    updatedAt={ad.updatedAt}
                    parameters={ad.parameters}
                    images={ad.images}
                />
            </div>
        </div>
    );
}
