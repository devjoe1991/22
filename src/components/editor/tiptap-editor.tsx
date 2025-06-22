'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './toolbar';
import { useEffect, useRef, useState } from 'react';
import { Json } from '@/lib/types/supabase';
import { toast } from 'sonner';

interface TiptapEditorProps {
  content: Json | null;
  saveContent: (newContent: Json) => Promise<void>;
}

export default function TiptapEditor({ content, saveContent }: TiptapEditorProps) {
  const [editorState, setEditorState] = useState<'unsaved' | 'saving' | 'saved'>('saved');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: (typeof content === 'object' && content !== null) ? content : '',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base max-w-none p-4 m-0 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setEditorState('unsaved');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setEditorState('saving');
        const jsonContent = editor.getJSON();
        saveContent(jsonContent)
          .then(() => {
            setEditorState('saved');
            toast.success('Content saved!');
          })
          .catch((err) => {
             toast.error(`Failed to save: ${err.message}`);
          });
      }, 2000); // Debounce time: 2 seconds
    },
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 rounded-lg border">
      <Toolbar editor={editor} />
      <div className="p-2 text-xs text-muted-foreground text-right">
         Status: {editorState}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
} 