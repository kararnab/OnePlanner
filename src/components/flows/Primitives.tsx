"use client";

import { ButtonHTMLAttributes, CSSProperties, ReactNode, useState } from "react";
import { Moon, Sun, LucideIcon } from "lucide-react";
import { useTheme } from "@/lib/hooks/useTheme";
// Re-export so existing call sites that imported Avatar from this file keep working.
// New consumers should import directly from "@/components/ui/Avatar" to avoid
// dragging the rest of this client-module into their route bundle.
export { default as Avatar } from "@/components/ui/Avatar";

/* -----------------------------------------------------------
   Card — 1px border, rounded-2xl, shadow-sm.
----------------------------------------------------------- */
export function Card({
    children,
    padding = 24,
    style,
    className,
}: {
    children: ReactNode;
    padding?: number;
    style?: CSSProperties;
    className?: string;
}) {
    return (
        <div
            className={className}
            style={{
                background: "var(--surface)",
                color: "var(--fg-1)",
                border: "1px solid var(--color-border)",
                borderRadius: 16,
                padding,
                boxShadow: "var(--shadow-sm)",
                ...style,
            }}
        >
            {children}
        </div>
    );
}

/* -----------------------------------------------------------
   Button — primary / secondary / ghost / danger.
----------------------------------------------------------- */
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface FButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    compact?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    leadingIcon?: LucideIcon;
    trailingIcon?: LucideIcon;
}

export function FButton({
    variant = "primary",
    compact = false,
    loading = false,
    fullWidth = false,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    children,
    style,
    disabled,
    ...rest
}: FButtonProps) {
    const [hover, setHover] = useState(false);
    const isDisabled = disabled || loading;

    const base: CSSProperties = {
        border: 0,
        fontWeight: 500,
        fontSize: compact ? 13 : 14,
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "inherit",
        width: fullWidth ? "100%" : undefined,
        padding: compact ? "8px 14px" : "11px 18px",
        borderRadius: compact ? 8 : 12,
        opacity: isDisabled ? 0.6 : 1,
    };

    const variantStyles: Record<ButtonVariant, CSSProperties> = {
        primary: {
            background: hover && !isDisabled ? "var(--color-primary-hover)" : "var(--color-primary)",
            color: "var(--color-primary-foreground)",
            boxShadow: compact ? "none" : "var(--shadow-primary-glow)",
        },
        secondary: {
            background: hover && !isDisabled ? "var(--surface-2)" : "var(--surface)",
            color: "var(--fg-1)",
            border: "1px solid var(--color-border-strong)",
        },
        ghost: {
            background: hover && !isDisabled ? "var(--surface-2)" : "transparent",
            color: "var(--fg-1)",
        },
        danger: {
            background: hover && !isDisabled ? "var(--color-danger-hover)" : "var(--color-danger)",
            color: "#fff",
        },
    };

    return (
        <button
            {...rest}
            disabled={isDisabled}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ ...base, ...variantStyles[variant], ...style }}
        >
            {loading && (
                <span
                    aria-hidden
                    style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "op-spin 0.8s linear infinite",
                    }}
                />
            )}
            {LeadingIcon && <LeadingIcon size={16} />}
            {children}
            {TrailingIcon && <TrailingIcon size={16} />}
        </button>
    );
}

/* -----------------------------------------------------------
   Chip — small rounded pill.
----------------------------------------------------------- */
type ChipTone = "neutral" | "primary" | "success" | "warning" | "danger";

const CHIP_PALETTE: Record<ChipTone, { bg: string; fg: string; border: string }> = {
    neutral: { bg: "var(--surface-2)", fg: "var(--fg-2)", border: "var(--color-border)" },
    primary: { bg: "var(--color-primary-soft)", fg: "var(--color-primary)", border: "transparent" },
    success: { bg: "rgba(16,185,129,0.12)", fg: "#059669", border: "transparent" },
    warning: { bg: "rgba(245,158,11,0.14)", fg: "#b45309", border: "transparent" },
    danger: { bg: "var(--color-danger-soft)", fg: "var(--color-danger)", border: "transparent" },
};

export function Chip({
    children,
    tone = "neutral",
    icon: Icon,
    size = "md",
}: {
    children: ReactNode;
    tone?: ChipTone;
    icon?: LucideIcon;
    size?: "sm" | "md";
}) {
    const palette = CHIP_PALETTE[tone];
    const pad = size === "sm" ? "2px 8px" : "4px 10px";
    const fs = size === "sm" ? 11 : 12;
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: pad,
                borderRadius: 9999,
                background: palette.bg,
                color: palette.fg,
                border: `1px solid ${palette.border}`,
                fontSize: fs,
                fontWeight: 500,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
            }}
        >
            {Icon && <Icon size={fs} />}
            {children}
        </span>
    );
}

/* -----------------------------------------------------------
   Theme toggle pill (sun/moon).
----------------------------------------------------------- */
export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            aria-label="Toggle theme"
            style={{
                width: 34,
                height: 34,
                borderRadius: 9999,
                border: "1px solid var(--color-border)",
                background: "var(--surface)",
                color: "var(--fg-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
            }}
        >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}

/* -----------------------------------------------------------
   FloatingInput — floating-label input matching the design.
----------------------------------------------------------- */
export function FloatingInput({
    label,
    value,
    onChange,
    type = "text",
    error,
    trailing,
    autoComplete,
    placeholder,
    required,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    error?: string;
    trailing?: ReactNode;
    autoComplete?: string;
    placeholder?: string;
    required?: boolean;
}) {
    const [focused, setFocused] = useState(false);
    const isFloating = focused || (value && String(value).length > 0);
    const borderColor = error
        ? "#ef4444"
        : focused
            ? "var(--color-primary)"
            : "var(--color-border-strong)";

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required={required}
                placeholder={placeholder}
                autoComplete={autoComplete}
                style={{
                    width: "100%",
                    padding: trailing ? "20px 44px 8px 16px" : "20px 16px 8px 16px",
                    borderRadius: 12,
                    border: `1px solid ${borderColor}`,
                    background: "var(--surface)",
                    color: "var(--fg-1)",
                    fontFamily: "inherit",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s",
                    boxShadow: focused
                        ? `0 0 0 4px ${error ? "rgba(239,68,68,0.18)" : "var(--color-primary-ring)"}`
                        : "none",
                }}
            />
            {trailing && (
                <div
                    style={{
                        position: "absolute",
                        right: 6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {trailing}
                </div>
            )}
            <label
                style={{
                    position: "absolute",
                    left: 16,
                    background: "var(--surface)",
                    padding: "0 4px",
                    pointerEvents: "none",
                    userSelect: "none",
                    transition: "all 0.2s",
                    color: error && isFloating ? "#ef4444" : isFloating ? "var(--color-primary)" : "var(--fg-3)",
                    fontSize: isFloating ? 11 : 14,
                    fontWeight: isFloating ? 500 : 400,
                    top: isFloating ? 0 : 14,
                    transform: isFloating ? "translateY(-50%)" : "none",
                }}
            >
                {label}
            </label>
            {error && (
                <p style={{ marginTop: 6, fontSize: 11, color: "#ef4444" }}>{error}</p>
            )}
        </div>
    );
}
