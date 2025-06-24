'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

type TagCategory = 'physical_attributes' | 'cosmetic_symbology' | 'animal_form';

type TagManagerProps = {
  characterId: string;
  category: TagCategory;
  tags: string[];
  updateAction: (characterId: string, category: TagCategory, newTags: string[]) => Promise<void>;
};

export function TagManager({ characterId, category, tags, updateAction }: TagManagerProps) {
  const [currentTags, setCurrentTags] = useState(tags);
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = async () => {
    if (inputValue && !currentTags.includes(inputValue)) {
      const newTags = [...currentTags, inputValue];
      await updateAction(characterId, category, newTags);
      setCurrentTags(newTags);
      setInputValue('');
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    await updateAction(characterId, category, newTags);
    setCurrentTags(newTags);
  };
  
  const formattedCategoryName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{formattedCategoryName}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {currentTags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button onClick={() => handleRemoveTag(tag)} className="rounded-full hover:bg-muted-foreground/20">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {currentTags.length === 0 && <p className="text-sm text-muted-foreground">No tags yet.</p>}
      </div>
      <div className="flex items-center gap-2">
        <Input 
          placeholder="Add a new tag..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
        />
        <Button onClick={handleAddTag} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 