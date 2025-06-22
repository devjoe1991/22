'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { addCharacterToScene } from '@/app/actions/scenes-actions';
import { Input } from '@/components/ui/input';
import { useRef } from 'react';

export function TaggingForm({ sceneId, allCharacters }: { sceneId: string, allCharacters: any[] }) {
    const formRef = useRef<HTMLFormElement>(null);
    
    const handleAddCharacter = async (formData: FormData) => {
        await addCharacterToScene(formData);
        formRef.current?.reset();
    };

    return (
        <form ref={formRef} action={handleAddCharacter} className="flex items-center gap-2 p-4 border rounded-lg">
            <Input type="hidden" name="sceneId" value={sceneId} />
            <Select name="characterId" required>
                <SelectTrigger>
                    <SelectValue placeholder="Select a character to add..." />
                </SelectTrigger>
                <SelectContent>
                    {allCharacters.map(char => (
                        <SelectItem key={char.id} value={char.id}>{char.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button type="submit">Add Character</Button>
        </form>
    )
} 