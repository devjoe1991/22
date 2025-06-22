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
import AuthButton from './auth/auth-button'
import { NotificationBell } from './layout/NotificationBell'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/types/supabase'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/projects', icon: Book, label: 'Projects' },
  { href: '/characters', icon: Users, label: 'Characters' },
  { href: '/scenes', icon: Clapperboard, label: 'Scenes' },
  { href: '/locations', icon: Map, label: 'Locations' },
  { href: '/workflows', icon: Workflow, label: 'Workflows' },
]

type Notification = Database['public']['Tables']['notifications']['Row']

export async function Header() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  let notifications: Notification[] = []
  if (user) {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
    notifications = data || []
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
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
      <div className="relative ml-auto flex items-center md:grow-0">
        {user && <NotificationBell serverNotifications={notifications} userId={user.id} />}
      </div>
      <div className="relative flex items-center md:grow-0">
        <AuthButton />
      </div>
    </header>
  )
} 