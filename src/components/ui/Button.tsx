"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

export default function Button({
                                   loading = false,
                                   className,
                                   children,
                                   ...props
                               }: ButtonProps) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={clsx(
                "w-full py-3 rounded-xl font-medium text-white bg-blue-600",
                "hover:bg-blue-700 transition disabled:opacity-50",
                className
            )}
        >
            {loading ? "Loading…" : children}
        </button>
    );
}
