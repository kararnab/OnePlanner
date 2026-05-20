// Gradient-initials avatar. Standalone (not a "use client" module) so
// importing it from a route doesn't drag in the rest of the Primitives bundle.
//
// Fallback chain:
//   1. If `src` is provided → render that photo.
//   2. Otherwise derive initials from `name` → render gradient + initials.
//   3. If `name` yields no initials (null / "" / whitespace) → render the
//      remote photo placeholder. This is the only path that fires a
//      third-party request.
const REMOTE_PLACEHOLDER =
    "https://www.iibsonline.com/public/testimonial/testimonial_image_full/183.png";

export default function Avatar({
    name = "",
    size = 40,
    gradient = true,
    src,
}: {
    name?: string;
    size?: number;
    gradient?: boolean;
    src?: string;
}) {
    const initials = name
        .split(/[\s-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");

    const photo = src || (initials.length === 0 ? REMOTE_PLACEHOLDER : null);

    if (photo) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={photo}
                alt={name || "User"}
                style={{ width: size, height: size, borderRadius: 9999, objectFit: "cover", flexShrink: 0 }}
                loading="lazy"
                decoding="async"
            />
        );
    }

    const fontSize = Math.round(size * 0.36);
    return (
        <div
            aria-label={name}
            style={{
                width: size,
                height: size,
                borderRadius: 9999,
                background: gradient ? "var(--avatar-gradient)" : "var(--surface-2)",
                color: gradient ? "#fff" : "var(--fg-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize,
                letterSpacing: "-0.01em",
                flexShrink: 0,
                userSelect: "none",
            }}
        >
            {initials}
        </div>
    );
}
