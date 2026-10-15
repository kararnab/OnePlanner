import { createElement } from "react";
import { Calendar } from "lucide-react";
import { LUCIDE_REGISTRY } from "./lucideMap";

/**
 * Renders a lucide icon by its kebab-case name. Uses createElement so the
 * dynamic component reference doesn't trip the react-hooks/static-components
 * lint rule (which would fire on `const Icon = LUCIDE_REGISTRY[name]` style).
 */
export default function LucideByName({
    name,
    size = 16,
    color,
}: {
    name: string;
    size?: number;
    color?: string;
}) {
    return createElement(LUCIDE_REGISTRY[name] ?? Calendar, { size, color });
}
