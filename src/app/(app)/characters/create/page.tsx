'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function CreateCharacterPage() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const { data, error } = await supabase
      .from('characters')
      .insert({ name, description })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create character', { description: error.message });
    } else {
      toast.success('Character created successfully!');
      router.push(`/characters/${data.id}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Character</CardTitle>
          <CardDescription>Fill in the details for your new character.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Character's full name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A brief description of the character."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Create Character</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 