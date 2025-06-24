import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { CreateTagForm } from "./CreateTagForm";

export default async function TagSettingsPage() {
  const supabase = createSupabaseServerClient();
  // @ts-ignore
  const { data: tags } = await supabase.from('tags').select('*');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Global Tags</h1>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-lg font-semibold mb-2">Create New Tag</h2>
          <CreateTagForm />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Existing Tags</h2>
          <div className="space-y-2 border rounded-lg p-4 bg-card max-h-96 overflow-y-auto">
            {tags?.map((tag: any) => (
              <div key={tag.id} className="flex items-center gap-3 p-2 border rounded-md">
                <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: tag.color }}></div>
                <span>{tag.name}</span>
              </div>
            ))}
             {(!tags || tags.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No tags created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 