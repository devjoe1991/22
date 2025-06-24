import { createClient } from '@/lib/supabase/server';
import { User, FileText, Code, Inbox, Link2 } from 'lucide-react';

function ProjectSummary() {
  return (
    <div className="relative rounded-xl overflow-hidden p-8 md:p-12 flex items-center bg-card border shadow-lg">
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, hsl(var(--primary)) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, hsl(var(--primary)) 0%, transparent 40%)
          `,
        }}
      ></div>
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight text-foreground">The Rebirth H22 Portal</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl">
          This portal is a bespoke, web-based project management and digital asset directory, designed specifically for the collaborative creation of a large-scale, immersive cinematic VR world. It serves as the central hub for the entire creative team, enabling seamless collaboration and project planning from conception to completion.
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-2xl font-bold mb-5 tracking-tight text-foreground">{children}</h2>
    )
}

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: recentActivity } = await supabase
    .from('audit_log')
    .select('*, profiles:user_id!inner(username, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(5);
  
  const { count: characterCount } = await supabase.from('characters').select('*', { count: 'exact', head: true });
  const { count: sceneCount } = await supabase.from('scenes').select('*', { count: 'exact', head: true });
  const { count: workflowCount } = await supabase.from('workflows').select('*', { count: 'exact', head: true });

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-card border rounded-lg p-6">{children}</div>
  );

  return (
    <div className="space-y-8">
      <ProjectSummary />
      
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <SectionTitle>Recent Activity</SectionTitle>
                <div className="space-y-3">
                {recentActivity && recentActivity.length > 0 ? (
                    recentActivity.map((log) => (
                    <div key={log.id} className="flex items-center gap-4 p-3 bg-background border rounded-lg">
                        <img src={(log.profiles as any).avatar_url || ''} alt="avatar" className="h-10 w-10 rounded-full bg-muted" />
                        <div>
                        <p className="text-sm text-muted-foreground">
                            <span className="font-bold text-foreground">{(log.profiles as any).username || 'A user'}</span> {log.action_type.replace('.', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground/80">
                            {log.created_at ? new Date(log.created_at).toLocaleString() : 'Date not available'}
                        </p>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-10 rounded-lg border-2 border-dashed">
                    <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
                    <h4 className="text-lg font-medium text-foreground">No Recent Activity</h4>
                    <p className="text-sm text-muted-foreground">
                        New actions will appear here as they happen.
                    </p>
                    </div>
                )}
                </div>
            </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <SectionTitle>Project Stats</SectionTitle>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <div className='flex items-center gap-3'>
                    <User className="h-5 w-5 text-primary"/>
                    <span className='text-foreground'>Characters</span>
                </div>
                <span className='font-bold text-foreground text-lg'>{characterCount ?? 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <div className='flex items-center gap-3'>
                    <FileText className="h-5 w-5 text-primary"/>
                    <span className='text-foreground'>Scenes</span>
                </div>
                <span className='font-bold text-foreground text-lg'>{sceneCount ?? 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <div className='flex items-center gap-3'>
                    <Code className="h-5 w-5 text-primary"/>
                    <span className='text-foreground'>Workflows</span>
                </div>
                <span className='font-bold text-foreground text-lg'>{workflowCount ?? 0}</span>
              </div>
            </div>
          </Card>
          <Card>
            <SectionTitle>Quick Links</SectionTitle>
            <div className="p-6 bg-background rounded-lg flex flex-col items-center justify-center text-center">
                <Link2 className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-md font-medium text-foreground">Bookmarks</p>
                <p className="text-sm text-muted-foreground">Coming soon...</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 