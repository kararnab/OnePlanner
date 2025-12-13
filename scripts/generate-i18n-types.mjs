import fs from "fs";
import path from "path";

const LOCALES_DIR = path.resolve("src/locales");
const OUTPUT_FILE = path.resolve("src/lib/types/i18n.d.ts");

// Recursively flatten keys: { a: { b: "x" }} → ["a.b"]
function flattenKeys(obj, prefix = "") {
    if (obj === null || obj === undefined) {
        throw new Error(`❌ Invalid null/undefined value at "${prefix}"`);
    }

    // ✅ Treat arrays as leaf nodes
    if (Array.isArray(obj)) {
        return [prefix];
    }

    // ✅ Leaf node
    if (typeof obj === "string" || typeof obj === "number") {
        return [prefix];
    }

    if (typeof obj !== "object") {
        throw new Error(`❌ Invalid value type at "${prefix}": ${typeof obj}`);
    }

    let keys = [];

    for (const key of Object.keys(obj)) {
        const value = obj[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;

        keys.push(...flattenKeys(value, fullKey));
    }

    return keys;
}

// ✅ Load canonical English file
const defaultLangDir = path.join(LOCALES_DIR, "en");
const commonPath = path.join(defaultLangDir, "common.json");

if (!fs.existsSync(commonPath)) {
    console.error("❌ Missing: src/locales/en/common.json");
    process.exit(1);
}

const raw = fs.readFileSync(commonPath, "utf-8");
const json = JSON.parse(raw);

const keys = flattenKeys(json).sort();

// ✅ Validate other languages match keyset, handles macOS .DS_Store issues too.
const languages = fs.readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

for (const lang of languages) {
    const langFile = path.join(LOCALES_DIR, lang, "common.json");
    if (!fs.existsSync(langFile)) continue;

    const otherJson = JSON.parse(fs.readFileSync(langFile, "utf-8"));
    const otherKeys = flattenKeys(otherJson).sort();

    const missing = keys.filter((k) => !otherKeys.includes(k));
    const extra = otherKeys.filter((k) => !keys.includes(k));

    if (missing.length || extra.length) {
        console.error(`❌ i18n key mismatch in "${lang}"`);
        if (missing.length) console.error(" Missing:", missing);
        if (extra.length) console.error(" Extra:", extra);
        process.exit(1);
    }
}

const typeUnion = keys.map((k) => `  | "${k}"`).join("\n");

const output = `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Run: npm run gen:i18n

export type CommonKeys =
${typeUnion};
`;

fs.writeFileSync(OUTPUT_FILE, output);

console.log(`✅ Generated ${OUTPUT_FILE} with ${keys.length} keys.`);
