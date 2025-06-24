import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // The user should always exist here because of the middleware, but we'll handle the null case.
  const { data: profile } = user ? await supabase.from('profiles').select('username').eq('id', user.id).single() : { data: null };
  const { data: activityLog } = await supabase.from('audit_log').select('*, profiles(username)').order('created_at', { ascending: false }).limit(7);

  return (
    <div className="space-y-8">
        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {profile?.username || 'Admin'}!</h1>
            <p className="text-muted-foreground">Here&apos;s what&apos;s happening with The Rebirth H22 project today.</p>
        </div>

        {/* Project Summary Card */}
        <div className="p-8 rounded-lg bg-card border text-card-foreground shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Project Vision</h2>
            <p className="text-muted-foreground max-w-4xl">
              This portal is a bespoke, web-based project management and digital asset directory, designed specifically for the collaborative creation of a large-scale, immersive cinematic VR world. It serves as the central hub for the entire creative team.
            </p>
        </div>

        {/* Activity Log */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activityLog?.map(log => {
              const details = log.details as { item_name?: string, item_type?: string, item_id?: string };
              const verb = log.action_type.split('.')[1] || 'modified';
              
              if (!details.item_type || !details.item_id || !details.item_name) {
                return null; // Don't render logs with incomplete details for now
              }

              return (
                <div key={log.id} className="flex items-center gap-4 p-3 bg-card border rounded-lg">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                     {/* Icon would go here */}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm">
                      <span className="font-semibold">{ (log.profiles as any)?.username || 'A user'}</span>
                      <span> {verb}d the {details.item_type} </span>
                      <Link href={`/${details.item_type}s/${details.item_id}`} className="font-semibold text-primary hover:underline">
                        {details.item_name}
                      </Link>
                    </p>
                    <p className="text-xs text-muted-foreground">{log.created_at ? new Date(log.created_at).toLocaleString('en-GB', { timeZone: 'Europe/London' }) : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
} 