'use client';

import { Badge } from "@/components/ui/badge";
import { X, ChevronsUpDown } from "lucide-react";
import { addColorKeyToEntity, removeColorKeyFromEntity } from '@/app/actions/color-key-actions';
import { RoleGuard } from "../auth/RoleGuard";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useTransition } from "react";

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
type ColorKey = { id: string, name: string, color: string };
type ColorKeyManagerProps = {
    entityId: string;
    entityType: string;
    appliedColorKeys: ColorKey[];
    allAvailableColorKeys: ColorKey[];
};

function RemoveKeyButton({ isPending }: { isPending: boolean }) {
    return (
        <button type="submit" disabled={isPending} className="ml-2 p-0.5 rounded-full hover:bg-black/20 transition-colors disabled:opacity-50">
            {isPending ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> : <X size={14} />}
        </button>
    )
}

function AddKeyForm({ entityId, entityType, allAvailableColorKeys, appliedColorKeys }: { entityId: string, entityType: string, allAvailableColorKeys: ColorKey[], appliedColorKeys: ColorKey[] }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const unappliedKeys = allAvailableColorKeys.filter(key => !appliedColorKeys.some(applied => applied.id === key.id));

    return (
        <RoleGuard allowedRoles={['admin', 'editor']}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between" disabled={isPending || unappliedKeys.length === 0}>
                        {isPending ? 'Adding...' : 'Add Color Key'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search keys..." />
                        <CommandList>
                            <CommandEmpty>No keys found.</CommandEmpty>
                            <CommandGroup>
                                {unappliedKeys.map((key) => (
                                    <CommandItem
                                        key={key.id}
                                        value={key.name}
                                        onSelect={() => {
                                            startTransition(() => {
                                                void addColorKeyToEntity(entityId, entityType, key.id);
                                            });
                                            setOpen(false);
                                        }}
                                    >
                                        <div className="w-4 h-4 rounded-full mr-2 border" style={{ backgroundColor: key.color }}></div>
                                        {key.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </RoleGuard>
    );
}

export function ColorKeyManager({ entityId, entityType, appliedColorKeys, allAvailableColorKeys }: ColorKeyManagerProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="p-4 border rounded-lg bg-card text-card-foreground">
            <h3 className="font-semibold text-lg mb-4">Color Keys</h3>
            <div className="flex flex-wrap gap-2 items-center">
                {appliedColorKeys.map(key => (
                    <Badge key={key.id} style={{ backgroundColor: key.color, color: getContrastYIQ(key.color) }} className="text-sm font-medium">
                        {key.name}
                        <RoleGuard allowedRoles={['admin', 'editor']}>
                            <form action={() => startTransition(() => removeColorKeyFromEntity(entityId, entityType, key.id))}>
                                <RemoveKeyButton isPending={isPending} />
                            </form>
                        </RoleGuard>
                    </Badge>
                ))}
                 <AddKeyForm 
                    entityId={entityId} 
                    entityType={entityType} 
                    allAvailableColorKeys={allAvailableColorKeys} 
                    appliedColorKeys={appliedColorKeys} 
                />
            </div>
        </div>
    );
} 