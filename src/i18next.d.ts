import "i18next";
import type { CommonKeys } from "@/lib/types/i18n";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "common";
        resources: {
            common: Record<CommonKeys, string>;
        };
    }
}
