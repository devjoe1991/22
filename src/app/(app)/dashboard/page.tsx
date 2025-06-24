import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Film, BookOpen } from 'lucide-react'; // Import necessary icons

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // The user should always exist here because of the middleware, but we'll handle the null case.
  const { data: profile } = user ? await supabase.from('profiles').select('username').eq('id', user.id).single() : { data: null };
  
  // Fetch counts, chapters, and activity log concurrently
  const [
    { count: charactersCount },
    { count: scenesCount },
    { data: chapters },
    { data: activityLog }
  ] = await Promise.all([
    supabase.from('characters').select('*', { count: 'exact', head: true }),
    supabase.from('scenes').select('*', { count: 'exact', head: true }),
    supabase.from('chapters').select('id, name').order('created_at', { ascending: true }),
    supabase.from('audit_log').select('*, profiles(username)').order('created_at', { ascending: false }).limit(7)
  ]);

  return (
    <div className="space-y-8">
        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {profile?.username || 'Admin'}!</h1>
            <p className="text-muted-foreground">Here&apos;s what&apos;s happening with The Rebirth H22 project today.</p>
        </div>

        {/* Counters and Chapters Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Counter Box for Characters */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Characters</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{charactersCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">Managed character profiles</p>
            </CardContent>
          </Card>

          {/* Counter Box for Scenes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scenes</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scenesCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">Constructed narrative scenes</p>
            </CardContent>
          </Card>

          {/* Special Card for Chapters List */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>Project Chapters</span>
              </CardTitle>
              <CardDescription>A list of all chapters. Click any chapter to view its details and linked scenes.</CardDescription>
            </CardHeader>
            <CardContent>
              {chapters && chapters.length > 0 ? (
                <div className="space-y-2">
                  {chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/chapters/${chapter.id}`}
                      className="block rounded-md border p-3 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      {chapter.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No chapters have been created yet.
                </div>
              )}
            </CardContent>
          </Card>
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