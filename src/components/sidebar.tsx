import Link from 'next/link'
import { Home, Users, Clapperboard, Map, Book, Workflow } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/projects', icon: Book, label: 'Projects' },
  { href: '/characters', icon: Users, label: 'Characters' },
  { href: '/scenes', icon: Clapperboard, label: 'Scenes' },
  { href: '/locations', icon: Map, label: 'Locations' },
  { href: '/workflows', icon: Workflow, label: 'Workflows' },
]

export default function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            {/* <Package2 className="h-6 w-6" /> */}
            <span className="">The Rebirth H22</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
} 