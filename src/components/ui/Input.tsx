"use client";

import { InputHTMLAttributes, ReactNode, useId, useState } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    trailing?: ReactNode;
}

export default function Input({
                                  label,
                                  className,
                                  value,
                                  onChange,
                                  disabled,
                                  error,
                                  trailing,
                                  ...props
                              }: InputProps) {
    const [focused, setFocused] = useState(false);
    const id = useId();

    const isFloating = focused || (value && String(value).length > 0);

    return (
        <div className="relative w-full">
            {/* Input */}
            <input
                id={id}
                {...props}
                value={value}
                onChange={onChange}
                disabled={disabled}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-invalid={!!error}
                className={clsx(
                    "w-full px-4 pt-5 pb-2 rounded-xl outline-none transition-all duration-200",
                    trailing && "pr-11",

                    // ✅ Base border (VISIBLE in normal mode)
                    "border border-gray-300 dark:border-gray-700",

                    // ✅ Background for contrast
                    "bg-white dark:bg-gray-900",

                    // ✅ Text colors
                    "text-gray-900 dark:text-gray-100",

                    // ✅ Focus styles
                    "focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30",

                    // ✅ Error state
                    error &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500/30",

                    // ✅ Disabled state
                    disabled &&
                    "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800",

                    className
                )}
            />

            {trailing && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    {trailing}
                </div>
            )}

            {/* Floating Label */}
            <label
                htmlFor={id}
                className={clsx(
                    "absolute left-4 pointer-events-none select-none bg-white dark:bg-gray-900 px-1 transition-all duration-200",

                    isFloating
                        ? "top-1 text-xs font-medium text-blue-600 dark:text-blue-400"
                        : "top-3.5 text-sm text-gray-500 dark:text-gray-400",

                    error && isFloating && "text-red-500"
                )}
            >
                {label}
            </label>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}
