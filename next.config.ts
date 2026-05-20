import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
    output: "export",
    trailingSlash: true,
    experimental: {
        // Ensures only the icons actually imported from lucide-react / framer-motion
        // ship in each route's bundle. Both libs have very wide barrel files
        // (lucide-react alone is 45 MB unminified) so this matters.
        optimizePackageImports: ["lucide-react", "framer-motion"],
    },
};

export default withBundleAnalyzer(nextConfig);
