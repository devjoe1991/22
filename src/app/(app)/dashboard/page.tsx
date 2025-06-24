import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Film, BookOpen, Palette } from 'lucide-react'; // Import necessary icons
import { Button } from '@/components/ui/button';

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
    { data: activityLog },
    { data: colorKeys },
    { data: myPinnedNotes },
    { data: assignedNotesData }
  ] = await Promise.all([
    supabase.from('characters').select('*', { count: 'exact', head: true }),
    supabase.from('scenes').select('*', { count: 'exact', head: true }),
    supabase.from('chapters').select('id, name').order('created_at', { ascending: true }),
    supabase.from('audit_log').select('*, profiles(username)').order('created_at', { ascending: false }).limit(7),
    (supabase as any).from('color_keys').select('id, name, color').limit(3),
    // Query 1: Get notes created by the user and pinned globally
    (supabase as any).from('notes').select('*').eq('creator_id', user?.id).eq('is_pinned_globally', true),
    // Query 2: Get notes assigned to the user by others
    (supabase as any).from('note_assignments').select('notes(*, profiles:creator_id(username))').eq('user_id', user?.id)
  ]);
  
  // Combine and process the results for the dashboard notes
  const assignedNotes = assignedNotesData?.map((item: any) => ({
      ...item.notes,
      assigned_by: item.notes.profiles.username,
  })) || [];
  const allDashboardNotes = [...(myPinnedNotes || []), ...assignedNotes];

  return (
    <div className="space-y-8">
        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {profile?.username || 'Admin'}!</h1>
            <p className="text-muted-foreground">Here&apos;s what&apos;s happening with The Rebirth H22 project today.</p>
        </div>

        {/* Pinned Notes Section */}
        {allDashboardNotes.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Pinned Notes</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allDashboardNotes.map((note: any) => (
                <Card key={note.id} className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-foreground">{note.content}</p>
                    </div>
                    {note.assigned_by && (
                      <p className="text-xs text-muted-foreground mt-3 pt-2 border-t">
                        Pinned for you by: <span className="font-semibold">{note.assigned_by}</span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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

          {/* Quick Access for Color Keys */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <span>Color Key System</span>
              </CardTitle>
              <CardDescription>Thematic keys used to link project elements.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {colorKeys?.slice(0, 3).map((key: any) => (
                  <Link key={key.id} href={`/color-keys/${key.id}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted -mx-2">
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: key.color }}></div>
                    <span className="font-medium text-sm">{key.name}</span>
                  </Link>
                ))}
              </div>
              <Button asChild variant="secondary" className="mt-4 w-full">
                <Link href="/color-keys">Manage All Color Keys</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Special Card for Chapters List */}
          <Card className="md:col-span-2 lg:col-span-4">
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