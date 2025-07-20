// src/components/admin/EditUserDialog.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// ManagementPage'deki Profile interface'ini buraya da alabiliriz
interface Profile {
  id: string;
  email: string;
  sirket_ismi: string | null;
  telefon_numarasi: string | null;
  ad: string | null;
  soyad: string | null;
  rol: string | null;
}

interface EditUserDialogProps {
  user: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

export default function EditUserDialog({ user, isOpen, onClose, onUserUpdated }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    sirket_ismi: '',
    telefon_numarasi: '',
    rol: 'user',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Diyalog açıldığında ve kullanıcı verisi mevcut olduğunda formu doldur
    if (user) {
      setFormData({
        ad: user.ad || '',
        soyad: user.soyad || '',
        sirket_ismi: user.sirket_ismi || '',
        telefon_numarasi: user.telefon_numarasi || '',
        rol: user.rol || 'user',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const { error } = await supabase.functions.invoke('update-user', {
        body: { userId: user.id, profileData: formData },
    });

    if (error) {
        toast.error(`Kullanıcı güncellenirken hata: ${error.message}`);
    } else {
        toast.success("Kullanıcı bilgileri başarıyla güncellendi.");
        onUserUpdated();
        onClose();
    }

    setIsSubmitting(false);
  };
  
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Kullanıcıyı Düzenle</DialogTitle>
          <DialogDescription>
            <strong>{user.email}</strong> kullanıcısının bilgilerini güncelleyin. Email ve şifre değiştirilemez.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ad" className="text-right">Ad</Label>
              <Input id="ad" value={formData.ad} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="soyad" className="text-right">Soyad</Label>
              <Input id="soyad" value={formData.soyad} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sirket_ismi" className="text-right">Şirket Adı</Label>
              <Input id="sirket_ismi" value={formData.sirket_ismi} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefon_numarasi" className="text-right">Telefon</Label>
              <Input id="telefon_numarasi" type="tel" value={formData.telefon_numarasi} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rol" className="text-right">Rol</Label>
              <select id="rol" value={formData.rol} onChange={handleChange} className="col-span-3 h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">İptal</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}