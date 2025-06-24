'use client';

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
// We'll need server actions for adding/removing tags
// import { addTagToEntity, removeTagFromEntity } from '@/app/actions/tags-actions';
import { RoleGuard } from "../auth/RoleGuard";

// This function determines if text should be light or dark based on background color
const getContrastYIQ = (hexcolor: string) => {
  if (!hexcolor) return 'black';
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
};

// Simplified props for now. This will be expanded.
type Tag = { id: string, name: string, color: string };
type TagManagerProps = {
    entityId: string;
    entityType: 'character' | 'scene' | 'chapter';
    appliedTags: Tag[];
    allAvailableTags: Tag[];
};

export function TagManager({ entityId, entityType, appliedTags, allAvailableTags }: TagManagerProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Key Elements</h3>
            <div className="flex flex-wrap gap-2 p-4 border rounded-lg min-h-[60px] bg-background">
                {appliedTags.map(tag => (
                    <Badge key={tag.id} style={{ backgroundColor: tag.color, color: getContrastYIQ(tag.color) }} className="text-sm font-medium">
                        {tag.name}
                        <RoleGuard allowedRoles={['admin', 'editor']}>
                           {/* Add a form/button here to call removeTagFromEntity */}
                           <button className="ml-2 p-0.5 rounded-full hover:bg-black/20 transition-colors"><X size={14}/></button>
                        </RoleGuard>
                    </Badge>
                ))}
                 {appliedTags.length === 0 && (
                    <p className="text-sm text-muted-foreground">No key elements tagged yet.</p>
                )}
            </div>
            <RoleGuard allowedRoles={['admin', 'editor']}>
                <div className="mt-4">
                    {/* Here you will add a Combobox (from Shadcn/UI) that is populated */}
                    {/* with `allAvailableTags` and calls `addTagToEntity` on submit. */}
                    <p className="text-sm text-muted-foreground">[Admin/Editor Combobox to add tags goes here]</p>
                </div>
            </RoleGuard>
        </div>
    );
} 