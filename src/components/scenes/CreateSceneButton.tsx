'use client';

import { Button } from '@/components/ui/button';
import { createScene } from '@/app/actions/scenes-actions';
import { PlusCircle } from 'lucide-react';

export function CreateSceneButton() {
  const handleCreateScene = async () => {
    await createScene();
  };

  return (
    <form action={handleCreateScene}>
      <Button type="submit">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Scene
      </Button>
    </form>
  );
} 