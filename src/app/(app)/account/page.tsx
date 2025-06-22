import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AccountForm from '@/components/account/account-form';

export default async function AccountPage() {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="flex justify-center items-start pt-16 h-full">
        <AccountForm profile={profile} />
    </div>
  );
} 