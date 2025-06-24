'use client';

import { Badge } from "@/components/ui/badge";
import { X, ChevronsUpDown } from "lucide-react";
import { addTagToEntity, removeTagFromEntity } from '@/app/actions/tags-actions';
import { RoleGuard } from "../auth/RoleGuard";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

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

function RemoveTagButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="ml-2 p-0.5 rounded-full hover:bg-black/20 transition-colors disabled:opacity-50">
            {pending ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> : <X size={14} />}
        </button>
    )
}

function AddTagForm({ entityId, entityType, allAvailableTags, appliedTags }: { entityId: string, entityType: string, allAvailableTags: Tag[], appliedTags: Tag[] }) {
    const [open, setOpen] = useState(false)
    const { pending } = useFormStatus();

    const unappliedTags = allAvailableTags.filter(tag => !appliedTags.some(applied => applied.id === tag.id));

    return (
        <RoleGuard allowedRoles={['admin', 'editor']}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between" disabled={pending}>
                        {pending ? "Adding..." : "+ Add Tag"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandList>
                            <CommandEmpty>No tags found.</CommandEmpty>
                            <CommandGroup>
                                {unappliedTags.map((tag) => (
                                    <CommandItem
                                        key={tag.id}
                                        value={tag.name}
                                        onSelect={async () => {
                                            await addTagToEntity(entityId, entityType, tag.id);
                                            setOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: tag.color }}></div>
                                            {tag.name}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </RoleGuard>
    )
}

export function TagManager({ entityId, entityType, appliedTags, allAvailableTags }: TagManagerProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Key Elements</h3>
            <div className="flex flex-wrap gap-2 p-4 border rounded-lg min-h-[60px] bg-background">
                {appliedTags.map(tag => (
                    <Badge key={tag.id} style={{ backgroundColor: tag.color, color: getContrastYIQ(tag.color) }} className="text-sm font-medium">
                        {tag.name}
                        <RoleGuard allowedRoles={['admin', 'editor']}>
                           <form action={async () => {
                                await removeTagFromEntity(entityId, entityType, tag.id)
                           }}>
                                <RemoveTagButton />
                           </form>
                        </RoleGuard>
                    </Badge>
                ))}
                 {appliedTags.length === 0 && (
                    <p className="text-sm text-muted-foreground">No key elements tagged yet.</p>
                )}
            </div>
            <div className="mt-4">
                <AddTagForm entityId={entityId} entityType={entityType} allAvailableTags={allAvailableTags} appliedTags={appliedTags} />
            </div>
        </div>
    );
} 