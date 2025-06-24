'use client';

import { useState, useTransition } from 'react';
import { updateCharacterAttributeTags } from '@/app/actions/character-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, PlusCircle } from 'lucide-react';
import { RoleGuard } from '../auth/RoleGuard';

type AttributeTags = {
    physical_attributes: string[];
    cosmetic_symbology: string[];
    animal_form: string[];
}

type AttributeTagManagerProps = {
    characterId: string;
    initialTags: AttributeTags;
};

function AttributeSection({ title, type, tags, onUpdate }: { title: string, type: keyof AttributeTags, tags: string[], onUpdate: (type: keyof AttributeTags, newTags: string[]) => void }) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue && !tags.includes(inputValue)) {
            onUpdate(type, [...tags, inputValue]);
            setInputValue('');
        }
    };

    const handleRemove = (tagToRemove: string) => {
        onUpdate(type, tags.filter(t => t !== tagToRemove));
    };

    return (
        <div>
            <h4 className="font-semibold mb-2">{title}</h4>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                        <RoleGuard allowedRoles={['admin', 'editor']}>
                            <button onClick={() => handleRemove(tag)} className="ml-1.5 p-0.5 rounded-full hover:bg-destructive/20">
                                <X className="h-3 w-3" />
                            </button>
                        </RoleGuard>
                    </Badge>
                ))}
            </div>
             <RoleGuard allowedRoles={['admin', 'editor']}>
                <div className="flex items-center gap-2">
                    <Input 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Add new attribute..."
                        className="h-8"
                    />
                    <Button onClick={handleAdd} size="sm" variant="outline"><PlusCircle className="h-4 w-4 mr-2" /> Add</Button>
                </div>
            </RoleGuard>
        </div>
    );
}


export function AttributeTagManager({ characterId, initialTags }: AttributeTagManagerProps) {
    const [tags, setTags] = useState(initialTags);
    const [isPending, startTransition] = useTransition();

    const handleUpdate = (type: keyof AttributeTags, newTags: string[]) => {
        const updatedTags = { ...tags, [type]: newTags };
        setTags(updatedTags);
        startTransition(() => {
            void updateCharacterAttributeTags(characterId, type, newTags);
        });
    };

    return (
        <div className="p-4 border rounded-lg bg-card text-card-foreground space-y-4">
            <h3 className="font-semibold text-lg">Character Attributes</h3>
            <AttributeSection title="Physical Attributes" type="physical_attributes" tags={tags.physical_attributes} onUpdate={handleUpdate} />
            <AttributeSection title="Cosmetic Symbology" type="cosmetic_symbology" tags={tags.cosmetic_symbology} onUpdate={handleUpdate} />
            <AttributeSection title="Animal Form" type="animal_form" tags={tags.animal_form} onUpdate={handleUpdate} />
        </div>
    );
} 