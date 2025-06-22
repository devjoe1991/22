import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModelViewer from "@/components/characters/model-viewer";
import FileUpload from "./file-upload";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

interface AssetGalleryProps {
  characterId: string;
}

export default async function AssetGallery({ characterId }: AssetGalleryProps) {
  const supabase = createClient();
  const { data: assets, error } = await supabase
    .from("assets")
    .select("*")
    .eq("parent_id", characterId);

  if (error) {
    return <p className="text-destructive">Could not load assets.</p>;
  }

  const model = assets.find(a => a.file_name?.endsWith('.glb') || a.file_name?.endsWith('.gltf'));
  const images = assets.filter(a => a.file_type?.startsWith('image/'));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <FileUpload characterId={characterId} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="aspect-video relative bg-muted rounded-md md:col-span-2">
            <ModelViewer modelUrl={model?.file_url} />
          </div>
          {images.map((asset) => (
            <div key={asset.id} className="aspect-video relative bg-muted rounded-md overflow-hidden">
              <Image src={asset.file_url!} alt={asset.file_name!} fill className="object-cover" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 