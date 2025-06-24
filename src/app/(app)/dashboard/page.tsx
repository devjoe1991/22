import { createClient } from '@/lib/supabase/server';
import { BarChart3, Inbox, Link2 } from 'lucide-react';

function ProjectSummary() {
  return (
    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12 flex items-center bg-slate-950 shadow-2xl shadow-purple-500/10 border border-purple-500/20">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(167, 139, 250, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(167, 139, 250, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, white 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, white 0%, transparent 100%)'
        }}
      ></div>
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">The Rebirth H22 Portal</h2>
        <p className="text-md md:text-lg text-slate-400 max-w-3xl">
          This portal is a bespoke, web-based project management and digital asset directory, designed specifically for the collaborative creation of a large-scale, immersive cinematic VR world. It serves as the central hub for the entire creative team, enabling seamless collaboration and project planning from conception to completion.
        </p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: recentActivity } = await supabase
    .from('audit_log')
    .select('*, profiles:user_id!inner(username, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <ProjectSummary />
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold mb-4 tracking-tight">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((log) => (
                <div key={log.id} className="flex items-center gap-4 p-4 bg-card rounded-lg border transition-all hover:shadow-md">
                  <img src={(log.profiles as any).avatar_url || ''} alt="avatar" className="h-10 w-10 rounded-full bg-muted" />
                  <div>
                    <p className="text-sm">
                      <span className="font-bold">{(log.profiles as any).username || 'A user'}</span> {log.action_type.replace('.', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : 'Date not available'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-10 bg-card rounded-lg border-2 border-dashed">
                <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
                <h4 className="text-lg font-medium">No Recent Activity</h4>
                <p className="text-sm text-muted-foreground">
                  New actions will appear here as they happen.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Project Stats</h3>
            <div className="p-6 bg-card rounded-lg flex flex-col items-center justify-center text-center border">
              <BarChart3 className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-lg font-medium">Analytics</p>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Quick Links</h3>
            <div className="p-6 bg-card rounded-lg flex flex-col items-center justify-center text-center border">
              <Link2 className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-lg font-medium">Bookmarks</p>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 