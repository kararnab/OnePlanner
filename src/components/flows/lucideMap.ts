import {
    MessageCircle,
    Compass,
    FileSearch,
    Infinity as InfinityIcon,
    Calendar,
    FileText,
    File as FileIcon,
    FolderArchive,
    Image as ImageIcon,
    type LucideIcon,
} from "lucide-react";

/**
 * Resolves a lucide-react icon component from the kebab-case name returned by
 * the mock API. Centralised so we only import the icons the screens actually
 * use, and so adding a new icon to the mock data is a one-line change.
 */
export const LUCIDE_REGISTRY: Record<string, LucideIcon> = {
    "message-circle": MessageCircle,
    "compass": Compass,
    "file-search": FileSearch,
    "infinity": InfinityIcon,
    "calendar": Calendar,
    "file-text": FileText,
    "file": FileIcon,
    "folder-archive": FolderArchive,
    "image": ImageIcon,
};

export function resolveIcon(name: string): LucideIcon {
    return LUCIDE_REGISTRY[name] ?? Calendar;
}
