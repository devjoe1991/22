import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { CreateColorKeyForm } from "./CreateColorKeyForm";

export default async function ColorKeysSettingsPage() {
  const supabase = createSupabaseServerClient();
  // @ts-ignore
  const { data: keys } = await supabase.from('color_keys').select('*');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Color Keys</h1>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-lg font-semibold mb-2">Create New Key</h2>
          <CreateColorKeyForm />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Existing Keys</h2>
          <div className="space-y-2 border rounded-lg p-4 bg-card max-h-96 overflow-y-auto">
            {keys?.map((key: any) => (
              <div key={key.id} className="flex items-center gap-3 p-2 border rounded-md">
                <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: key.color }}></div>
                <span>{key.name}</span>
              </div>
            ))}
             {(!keys || keys.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No keys created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 