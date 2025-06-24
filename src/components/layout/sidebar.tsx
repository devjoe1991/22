'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Settings, Film, BookOpen, Home, PenSquare, Eye, Palette, MessageSquareText } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';
import { RoleGuard } from '../auth/RoleGuard';

export const NAV_LINKS = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/artist-statement', icon: PenSquare, label: 'Artist Statement' },
    { href: '/vision-and-mission', icon: Eye, label: 'Vision & Mission' },
    { href: "/characters", label: "Characters", icon: Users },
    { href: "/scenes", label: "Scenes", icon: Film },
    { href: "/chapters", label: "Chapters", icon: BookOpen },
    { href: "/color-keys", label: "Color Keys", icon: Palette },
    { href: "/account", label: "Account", icon: Settings },
]

// Define the type for the counts object for type safety
type ItemCounts = {
    characters: number | null;
    scenes: number | null;
    chapters: number | null;
};

export default function Sidebar({ counts }: { counts: ItemCounts }) {
    const pathname = usePathname();

    const adminNavItems = [
        { href: '/notes', icon: <MessageSquareText className="h-4 w-4" />, label: 'Notes' },
        { href: '/account', icon: <Settings className="h-4 w-4" />, label: 'Account' },
    ]

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        {/* <Package2 className="h-6 w-6" /> */}
                        <span className="">The Rebirth H22</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {NAV_LINKS.map(link => {
                            // Match the nav item label to a key in our counts object
                            const labelKey = link.label.toLowerCase() as keyof ItemCounts;
                            const count = counts ? counts[labelKey] : null;
                            const isActive = pathname.startsWith(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                        isActive && "bg-muted text-primary"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <link.icon className="h-4 w-4" />
                                        <span>{link.label}</span>
                                    </div>
                                    {/* Render the badge only if the count is greater than 0 */}
                                    {count !== null && count > 0 && (
                                        <Badge 
                                            variant={isActive ? 'default' : 'secondary'}
                                            className="h-5"
                                        >
                                            {count}
                                        </Badge>
                                    )}
                                </Link>
                            )
                        })}
                        <RoleGuard allowedRoles={['admin']}>
                            <div className="mt-4 pt-4 border-t">
                                {adminNavItems.map((item) => {
                                    const isActive = pathname.startsWith(item.href);
                                    return (
                                         <Link
                                            key={item.label}
                                            href={item.href}
                                            className={cn(
                                            "flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                            isActive && "bg-muted text-primary"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span>{item.label}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </RoleGuard>
                    </nav>
                </div>
            </div>
        </div>
    )
} 