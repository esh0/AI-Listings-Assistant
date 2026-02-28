"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardWrapperProps {
    children: React.ReactNode;
    title?: string;
    icon?: LucideIcon;
    className?: string;
    headerClassName?: string;
}

export function CardWrapper({
    children,
    title,
    icon: Icon,
    className,
    headerClassName,
}: CardWrapperProps) {
    return (
        <div
            className={cn(
                "bg-card border border-border rounded-xl shadow-sm p-6 transition-shadow duration-200 hover:shadow-md",
                className
            )}
        >
            {title && (
                <div className={cn("mb-4 flex items-center gap-2", headerClassName)}>
                    {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden="true" />}
                    <h2 className="text-lg font-semibold">{title}</h2>
                </div>
            )}
            {children}
        </div>
    );
}
