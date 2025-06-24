import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CreateColorKeyForm } from "./CreateColorKeyForm";

type ColorKey = {
    id: string;
    name: string;
    color: string;
    description: string | null;
    user_id: string | null;
}

export default async function ColorKeysPage() {
    const supabase = createClient();
    const { data } = await (supabase as any).from('color_keys').select('*').order('name');
    const colorKeys: ColorKey[] = data || [];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Color Key Management</h1>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1">
                    <CreateColorKeyForm />
                </div>
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Existing Keys</h2>
                    <div className="space-y-3">
                        {colorKeys.map(key => (
                            <Link 
                                key={key.id} 
                                href={`/color-keys/${key.id}`}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: key.color }}></div>
                                    <span className="font-medium">{key.name}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">View Details &rarr;</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 