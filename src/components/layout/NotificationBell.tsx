'use client';

import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { markNotificationsAsRead } from '@/app/actions/notifications-actions';
import { type Database } from '@/lib/types/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type Notification = Database['public']['Tables']['notifications']['Row'];

export function NotificationBell({
  serverNotifications,
  userId,
}: {
  serverNotifications: Notification[];
  userId: string;
}) {
  const [notifications, setNotifications] = useState(serverNotifications);

  useEffect(() => {
    setNotifications(serverNotifications);
  }, [serverNotifications]);
  
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload: RealtimePostgresChangesPayload<Notification>) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleOpenChange = (open: boolean) => {
    if (!open && unreadCount > 0) {
      // Optimistically update the UI
      const newNotifications = notifications.map(n => ({...n, is_read: true}));
      setNotifications(newNotifications);
      // Call server action
      markNotificationsAsRead();
    }
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="p-2 font-semibold border-b">Notifications</div>
        <div className="space-y-2 p-2 max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const content = n.content as any;
              return (
              <Link key={n.id} href={`/${content.parent_type}s/${content.parent_id}`}>
                <div className="text-sm p-2 rounded-md hover:bg-muted">
                   New comment on <strong>{content.parent_name}</strong>
                  <div className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
              </Link>
            )})
          ) : (
            <p className="text-sm text-center text-muted-foreground p-4">No new notifications.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 