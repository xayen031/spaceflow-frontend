// src/components/admin/AddUserDialog.tsx
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';

interface AddUserDialogProps {
  onUserAdded: () => void;
}

export default function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [sirketIsmi, setSirketIsmi] = useState('');
  const [telefon, setTelefon] = useState('');
  const [rol, setRole] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setAd('');
    setSoyad('');
    setSirketIsmi('');
    setTelefon('');
    setRole('user');
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const profileData = {
        ad,
        soyad,
        sirket_ismi: sirketIsmi,
        telefon_numarasi: telefon,
        rol,
    };

    const { error } = await supabase.functions.invoke('create-user', {
      body: { email, password, profileData },
    });

    if (error) {
      toast.error(`Kullanıcı oluşturulurken hata: ${error.message}`);
    } else {
      toast.success('Kullanıcı başarıyla oluşturuldu!');
      onUserAdded();
      setIsOpen(false);
      resetForm();
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni Kullanıcı Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
          <DialogDescription>
            Sisteme yeni bir kullanıcı eklemek için formu doldurun.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddUser}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ad" className="text-right">Ad</Label>
              <Input id="ad" value={ad} onChange={(e) => setAd(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="soyad" className="text-right">Soyad</Label>
              <Input id="soyad" value={soyad} onChange={(e) => setSoyad(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Şifre</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sirket" className="text-right">Şirket Adı</Label>
              <Input id="sirket" value={sirketIsmi} onChange={(e) => setSirketIsmi(e.target.value)} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefon" className="text-right">Telefon</Label>
              <Input id="telefon" type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Rol</Label>
              <select id="role" value={rol} onChange={(e) => setRole(e.target.value)} className="col-span-3 h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={() => resetForm()}>
                    İptal
                </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ekleniyor...' : 'Kullanıcıyı Ekle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}