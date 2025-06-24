'use client';

import { createTag } from "@/app/actions/tags-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";

interface FormState {
  error: string | null;
}

const initialState: FormState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Tag'}
    </Button>
  );
}

export function CreateTagForm() {
  const [state, formAction] = useFormState(createTag, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4 p-4 border rounded-lg bg-card">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Tag Name</label>
        <Input id="name" name="name" required placeholder="e.g., Betrayal Theme" />
      </div>
      <div>
        <label htmlFor="color" className="block text-sm font-medium mb-1">Tag Color</label>
        <div className="flex items-center gap-2">
          <Input id="color" name="color" type="color" className="p-1 h-10 w-14 block" defaultValue="#808080" />
          <Input name="color_hex" placeholder="Or type hex #..." className="flex-1" onChange={(e) => {
            const colorInput = document.querySelector<HTMLInputElement>('input[type="color"]');
            if (colorInput) colorInput.value = e.target.value;
          }}/>
        </div>
      </div>
      <SubmitButton />
    </form>
  )
} 