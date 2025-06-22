import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/auth/actions'
import Link from 'next/link'

export default async function AuthButton() {
  const supabase = createClient()
  const { data: { session }} = await supabase.auth.getSession()

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/account">
          <Button variant="outline">Account</Button>
        </Link>
        <form action={logout}>
          <Button>Logout</Button>
        </form>
      </div>
    )
  }

  return (
    <Link href="/login">
      <Button>Login</Button>
    </Link>
  )
} 