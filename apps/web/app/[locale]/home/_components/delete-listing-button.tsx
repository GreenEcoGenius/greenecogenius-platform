'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { Trash2 } from 'lucide-react';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import { Trans } from '@kit/ui/trans';

export function DeleteListingButton({ listingId }: { listingId: string }) {
  const supabase = useSupabase();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listingId);

    if (!error) {
      setOpen(false);

      startTransition(() => {
        router.refresh();
      });
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:bg-destructive/10 h-8 w-8"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Trans i18nKey="marketplace.deleteConfirmTitle" />
            </DialogTitle>
            <DialogDescription>
              <Trans i18nKey="marketplace.deleteConfirmDescription" />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              <Trans i18nKey="marketplace.cancel" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trans i18nKey="marketplace.delete" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
