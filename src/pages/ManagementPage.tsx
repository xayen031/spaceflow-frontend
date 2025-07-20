// src/pages/ManagementPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Assuming cn utility is available for conditional classes

interface Profile {
  id: string;
  email: string;
  sirket_ismi: string | null;
  telefon_numarasi: string | null;
  ad: string | null;
  soyad: string | null;
  rol: string | null;
  created_at: string;
  updated_at: string;
}

export default function ManagementPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching profiles:", error.message);
        setError("Kullanıcı bilgileri getirilirken bir hata oluştu: " + error.message);
      } else {
        setProfiles(data as Profile[]);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  // Filter profiles based on search term
  const filteredProfiles = useMemo(() => {
    if (!searchTerm) {
      return profiles;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return profiles.filter(
      (profile) =>
        profile.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        profile.ad?.toLowerCase().includes(lowerCaseSearchTerm) ||
        profile.soyad?.toLowerCase().includes(lowerCaseSearchTerm) ||
        profile.sirket_ismi?.toLowerCase().includes(lowerCaseSearchTerm) ||
        profile.rol?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [profiles, searchTerm]);

  // Calculate pagination details
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const currentProfiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProfiles.slice(startIndex, endIndex);
  }, [filteredProfiles, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p>Kullanıcılar yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kullanıcı Yönetimi</CardTitle>
        <CardDescription>Sistemdeki tüm kullanıcıları ve rollerini yönetin.</CardDescription>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Kullanıcıları ara..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredProfiles.length === 0 && searchTerm ? (
          <p>Arama kriterlerinize uygun kullanıcı bulunamadı.</p>
        ) : filteredProfiles.length === 0 && !searchTerm ? (
          <p>Hiç kullanıcı bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Şirket Adı</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Ad</TableHead>
                  <TableHead>Soyad</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Oluşturulma Tarihi</TableHead>
                  <TableHead>Güncellenme Tarihi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProfiles.map((profile) => (
                  <TableRow
                    key={profile.id}
                  >
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>{profile.sirket_ismi || '-'}</TableCell>
                    <TableCell>{profile.telefon_numarasi || '-'}</TableCell>
                    <TableCell>{profile.ad || '-'}</TableCell>
                    <TableCell>{profile.soyad || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
                          {
                            'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200': profile.rol === 'admin',
                            'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200': profile.rol === 'user',
                            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200': profile.rol !== 'admin' && profile.rol !== 'user', // Default for other roles
                          }
                        )}
                      >
                        {profile.rol || 'Belirtilmemiş'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(profile.created_at).toLocaleString()}</TableCell>
                    <TableCell>{new Date(profile.updated_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Önceki
            </Button>
            <span className="text-sm font-medium">
              Sayfa {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}