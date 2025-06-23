'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';
import { type Database } from '@/lib/types/supabase';
import { toast } from 'sonner';
import { addComment } from './actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type CommentWithProfile = Database['public']['Tables']['comments']['Row'] & {
  profiles: Pick<Database['public']['Tables']['profiles']['Row'], 'username' | 'avatar_url'> | null
};

interface CommentSectionProps {
  characterId: string;
  initialComments: CommentWithProfile[];
}

export default function CommentSection({ characterId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const newCommentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // This is where the real-time magic happens.
    // We subscribe to a channel that listens for any inserts on the 'comments' table.
    const channel = supabase
      .channel(`comments:${characterId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `parent_id=eq.${characterId}` },
        async (payload) => {
          // When a new comment is inserted, we fetch it along with the user's profile
          const { data: newComment, error } = await supabase
            .from('comments')
            .select('*, profiles(username, avatar_url)')
            .eq('id', payload.new.id)
            .single();
          
          if (error) {
              console.error(error);
          } else if (newComment) {
              // And add it to our local state, causing the UI to re-render.
              setComments((currentComments) => [...currentComments, newComment as unknown as CommentWithProfile]);
          }
        }
      )
      .subscribe();

    // It's crucial to unsubscribe when the component unmounts
    // to prevent memory leaks.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [characterId]);

  const handleAddComment = async () => {
    if (!newCommentRef.current?.value) return;

    const content = newCommentRef.current.value;
    newCommentRef.current.value = ''; // Clear the textarea immediately

    try {
      await addComment(characterId, content);
    } catch (error: any) {
      toast.error(error.message);
      if (newCommentRef.current) newCommentRef.current.value = content; // Restore content on error
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                <AvatarFallback>{comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{comment.profiles?.username || 'Anonymous'}</p>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full items-center space-x-2">
          <Textarea ref={newCommentRef} placeholder="Type your message here." />
          <Button onClick={handleAddComment}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
} 