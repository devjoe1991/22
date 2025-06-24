'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Settings, Film, BookOpen, Home, PenSquare, Eye } from 'lucide-react';
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/artist-statement', icon: PenSquare, label: 'Artist Statement' },
    { href: '/vision-and-mission', icon: Eye, label: 'Vision & Mission' },
    { href: "/characters", label: "Characters", icon: Users },
    { href: "/scenes", label: "Scenes", icon: Film },
    { href: "/chapters", label: "Chapters", icon: BookOpen },
    { href: "/account", label: "Account", icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname();

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
                            const isActive = pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                        isActive && "bg-muted text-primary"
                                    )}
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>
        </div>
    )
} 