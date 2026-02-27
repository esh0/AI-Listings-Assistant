"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, id, ...props }, ref) => {
        const inputId = id || React.useId();

        return (
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <input
                        type="checkbox"
                        id={inputId}
                        ref={ref}
                        className="peer sr-only"
                        {...props}
                    />
                    <div
                        className={cn(
                            "h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground flex items-center justify-center",
                            className
                        )}
                    >
                        <Check className="h-3 w-3 hidden peer-checked:block text-primary-foreground" />
                    </div>
                </div>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };