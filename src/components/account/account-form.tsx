'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function AccountForm({ profile }: { profile: any }) {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const fullName = formData.get('full_name') as string;
    const website = formData.get('website') as string;

    const { error } = await supabase.from('profiles').upsert({
      id: profile.id,
      username,
      full_name: fullName,
      website,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error('Failed to update profile', { description: error.message });
    } else {
      toast.success('Profile updated successfully!');
      router.refresh();
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Update your profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={profile?.email} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" defaultValue={profile?.username || ''} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" defaultValue={profile?.website || ''} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit">Update Profile</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 