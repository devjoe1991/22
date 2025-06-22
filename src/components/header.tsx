import Link from 'next/link'
import {
  Home,
  Menu,
  Users,
  Clapperboard,
  Map,
  Book,
  Workflow,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import AuthButton from '@/components/auth/auth-button'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/projects', icon: Book, label: 'Projects' },
  { href: '/characters', icon: Users, label: 'Characters' },
  { href: '/scenes', icon: Clapperboard, label: 'Scenes' },
  { href: '/locations', icon: Map, label: 'Locations' },
  { href: '/workflows', icon: Workflow, label: 'Workflows' },
]

export default function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
              The Rebirth H22
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {/* Can add a search bar here later */}
      </div>
      <AuthButton />
    </header>
  )
} 