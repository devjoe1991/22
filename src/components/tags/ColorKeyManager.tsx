'use client';

import { Badge } from "@/components/ui/badge";
import { X, ChevronsUpDown } from "lucide-react";
import { addColorKeyToEntity, removeColorKeyFromEntity } from '@/app/actions/color-key-actions';
import { RoleGuard } from "../auth/RoleGuard";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
        <button type="submit" disabled={isPending} className="ml-2 text-muted-foreground hover:text-foreground">
            {isPending ? "..." : <X className="h-4 w-4" />}
        </button>
    );
}

function AddKeyForm({ entityId, entityType, allAvailableColorKeys, appliedColorKeys }: { entityId: string, entityType: string, allAvailableColorKeys: ColorKey[], appliedColorKeys: ColorKey[] }) {
    const [open, setOpen] = useState(false);

    const handleAddKey = (keyId: string) => {
      const formData = new FormData();
      formData.append('entityId', entityId);
      formData.append('entityType', entityType);
      formData.append('keyId', keyId);

      addColorKeyToEntity(formData).then((response) => {
        if (response?.error) {
          toast.error(response.error);
        } else {
          toast.success("Key added!");
        }
      });
    };

    const unappliedKeys = allAvailableColorKeys.filter(key => !appliedColorKeys.some(applied => applied.id === key.id));

    return (
        <RoleGuard allowedRoles={['admin', 'editor']}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between" disabled={unappliedKeys.length === 0}>
                        Add Color Key
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
                                            handleAddKey(key.id);
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

    const handleRemoveKey = (keyId: string) => {
      startTransition(() => {
        removeColorKeyFromEntity(entityId, entityType, keyId)
          .then(response => {
            if (response?.error) {
              toast.error(response.error);
            } else {
              toast.success("Key removed.");
            }
          });
      });
    };

    return (
        <div className="p-4 border rounded-lg bg-card text-card-foreground">
            <h3 className="text-lg font-semibold mb-2">Color Keys</h3>
            <div className="flex flex-wrap gap-2 items-center">
                {appliedColorKeys.map((key) => (
                    <Badge key={key.id} variant="outline" className="flex items-center gap-2 pr-1" style={{ backgroundColor: `${key.color}40`, borderColor: key.color }}>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: key.color }}></div>
                        {key.name}
                        <RoleGuard allowedRoles={['admin', 'editor']}>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleRemoveKey(key.id);
                            }}>
                                <RemoveKeyButton isPending={isPending} />
                            </form>
                        </RoleGuard>
                    </Badge>
                ))}
                <AddKeyForm entityId={entityId} entityType={entityType} allAvailableColorKeys={allAvailableColorKeys} appliedColorKeys={appliedColorKeys} />
            </div>
        </div>
    );
} 