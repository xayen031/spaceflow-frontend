// src/components/admin/ConfirmDeleteDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export default function ConfirmDeleteDialog({ isOpen, onClose, onConfirm, userName }: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kullanıcıyı Silmeyi Onayla</DialogTitle>
          <DialogDescription>
            <strong>{userName}</strong> adlı kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              İptal
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Evet, Sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}