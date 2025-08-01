'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const ConfirmDialog = ({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  disabled
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <p className="text-slate-600 text-base">{description}</p>
      </DialogHeader>
      <DialogFooter className="gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="border-slate-200 hover:bg-slate-50"
        >
          {cancelLabel}
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={loading}>
          {confirmLabel} {disabled && <Loader2 className="animate-spin" />}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmDialog;
