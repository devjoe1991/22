'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Edit, X } from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';

type EditableFieldProps = {
  initialValue: string;
  onSave: (newValue: string) => Promise<void>;
  fieldName: string;
  textSize?: string;
};

export function EditableField({ initialValue, onSave, fieldName, textSize = "text-3xl" }: EditableFieldProps) {
  const { profile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  if (profile?.role !== 'admin') {
    return <h1 className={`${textSize} font-bold`}>{initialValue}</h1>;
  }

  const handleSave = async () => {
    await onSave(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          aria-label={`Edit ${fieldName}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${textSize} font-bold h-auto p-0 border-0 shadow-none focus-visible:ring-0`}
        />
        <Button size="icon" variant="ghost" onClick={handleSave}><Check className="h-5 w-5" /></Button>
        <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}><X className="h-5 w-5" /></Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 group">
      <h1 className={`${textSize} font-bold`}>{initialValue}</h1>
      <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsEditing(true)}>
        <Edit className="h-5 w-5" />
      </Button>
    </div>
  );
} 