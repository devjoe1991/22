'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import { type Database } from '@/lib/types/supabase';
import { getUserColor } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type AuditLogWithProfile = Database['public']['Tables']['audit_log']['Row'] & {
  profiles: Pick<Database['public']['Tables']['profiles']['Row'], 'username'> | null
};

interface ActivityFeedProps {
  initialLogs: AuditLogWithProfile[];
}

export default function ActivityFeed({ initialLogs }: ActivityFeedProps) {
  const [logs, setLogs] = useState(initialLogs);

  useEffect(() => {
    // Set up Supabase real-time subscription
    const channel = supabase
      .channel('audit_log_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_log' },
        (payload) => {
          // When a new log comes in, add it to the top of the list
          const newLog = payload.new as AuditLogWithProfile;
          setLogs((prevLogs) => [newLog, ...prevLogs]);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Run only once on mount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {logs.map((log) => {
            const userColor = getUserColor(log.user_id || '');
            return (
              <li key={log.id} className="flex items-start gap-3">
                <span className={`flex h-2 w-2 translate-y-2 rounded-full ${userColor.background}`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium leading-none ${userColor.text}`}>
                      {log.profiles?.username || 'System'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.created_at!), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.action_type}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
} 