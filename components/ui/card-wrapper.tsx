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
    headerAction?: React.ReactNode;
}

const CardWrapperComponent = React.forwardRef<HTMLDivElement, CardWrapperProps>(
    ({ children, title, icon: Icon, className, headerClassName, headerAction }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-card border border-border rounded-xl shadow-sm p-6 transition-shadow duration-200",
                    className
                )}
            >
                {title && (
                    <div className={cn("mb-4 flex items-center justify-between gap-2", headerClassName)}>
                        <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden="true" />}
                            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                        </div>
                        {headerAction && <div>{headerAction}</div>}
                    </div>
                )}
                {children}
            </div>
        );
    }
);

CardWrapperComponent.displayName = "CardWrapper";

export const CardWrapper = React.memo(CardWrapperComponent);
