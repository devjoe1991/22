'use client';

import { createColorKey } from "@/app/actions/color-key-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/RoleGuard";

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
      {pending ? 'Creating...' : 'Create Color Key'}
    </Button>
  );
}

export function CreateColorKeyForm() {
  const [state, formAction] = useFormState(createColorKey, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <RoleGuard allowedRoles={['admin']}>
        <form action={formAction} className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold">Create New Key</h2>
            <div className="grid gap-4">
                <Input name="name" placeholder="Key Name (e.g., 'Primary Theme')" required />
                <Input name="color" type="color" className="p-0 h-10" required />
            </div>
            <SubmitButton />
        </form>
    </RoleGuard>
  );
} 