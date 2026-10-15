// Plain <img>, intentionally. Under `output: "export"` next/image renders
// as `unoptimized` anyway — its wrapper + runtime client component is dead
// weight on every page that shows the logo.
export default function BrandLogo({
    width = 70,
    height,
    className,
    priority = false,
}: {
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
}) {
    const h = height ?? width;
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src="/brand_logo.svg"
            alt="One Planner"
            width={width}
            height={h}
            className={`select-none ${className ?? ""}`}
            decoding="async"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
        />
    );
}
