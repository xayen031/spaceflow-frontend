// src/pages/ProfilePage.tsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ProfileData {
  ad: string;
  soyad: string;
  sirket_ismi: string;
  telefon_numarasi: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    ad: '',
    soyad: '',
    sirket_ismi: '',
    telefon_numarasi: '',
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Kullanıcı bulunamadı.');
      
      setEmail(user.email || '');

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('ad, soyad, sirket_ismi, telefon_numarasi')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
      }

      if (data) {
        setProfileData({
            ad: data.ad || '',
            soyad: data.soyad || '',
            sirket_ismi: data.sirket_ismi || '',
            telefon_numarasi: data.telefon_numarasi || ''
        });
      }
    } catch (error: any) {
      toast.error(`Profil bilgileri getirilirken hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return <div className="text-center p-4">Profil yükleniyor...</div>;
  }
  
  // Bilgileri göstermek için bir yardımcı bileşen
  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm">
        {value || '-'}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
          <CardDescription>Kişisel bilgileriniz aşağıda görüntülenmektedir.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <InfoRow label="Email" value={email} />
            <InfoRow label="Ad" value={profileData.ad} />
            <InfoRow label="Soyad" value={profileData.soyad} />
            <InfoRow label="Şirket Adı" value={profileData.sirket_ismi} />
            <InfoRow label="Telefon Numarası" value={profileData.telefon_numarasi} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}