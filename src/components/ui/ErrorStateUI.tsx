export default function ErrorStateUI({
                              message,
                              onRefresh,
                          }: {
    message: string;
    onRefresh?: () => void;
}) {
    return (
        <div
            className="
        flex flex-col items-center justify-center
        py-12 px-4 text-center
        rounded-xl border
        bg-red-500/5
      "
            style={{
                borderColor: "var(--color-border)",
            }}
        >
            {/* Icon */}
            <div className="mb-3 text-red-500">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="opacity-80"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v3.75m0 3.75h.007M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>

            {/* Message */}
            <p className="text-sm font-medium text-red-600 mb-1">
                Something went wrong
            </p>
            <p className="text-xs opacity-70 max-w-[240px]">
                {message}
            </p>

            {/* Action */}
            {onRefresh && (
                <button
                    onClick={onRefresh}
                    className="
            mt-4 text-xs font-medium px-4 py-2 rounded-md
            border transition
            hover:bg-black/5 dark:hover:bg-white/5
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-red-500/30
          "
                    style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-foreground)",
                    }}
                >
                    Try again
                </button>
            )}
        </div>
    );
}
