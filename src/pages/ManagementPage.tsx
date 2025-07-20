// src/pages/ManagementPage.tsx
import { useEffect, useState, useMemo, useCallback } from 'react';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import AddUserDialog from '@/components/admin/AddUserDialog';
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog';
import EditUserDialog from '@/components/admin/EditUserDialog';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// ... (Interface ve diğer kısımlar aynı)
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
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [userToEdit, setUserToEdit] = useState<Profile | null>(null);
  const itemsPerPage = 10;

  const fetchProfiles = useCallback(async () => {
    // ... (fetchProfiles içeriği aynı)
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
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: userToDelete.id },
    });
    
    if (error) {
      toast.error(`Kullanıcı silinirken hata: ${error.message}`);
    } else {
      toast.success(`${userToDelete.email} başarıyla silindi.`);
      fetchProfiles(); // Listeyi yenile
    }
    setUserToDelete(null); // Diyaloğu kapat
  };
  
  // ... (Diğer render fonksiyonları ve JSX kısımları aynı)
  const filteredProfiles = useMemo(() => {
    if (!searchTerm) {
      return profiles;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return profiles.filter(
      (profile) =>
        profile.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        (profile.ad && profile.ad.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (profile.soyad && profile.soyad.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (profile.sirket_ismi && profile.sirket_ismi.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (profile.rol && profile.rol.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [profiles, searchTerm]);

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const currentProfiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProfiles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProfiles, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const renderPaginationItems = () => {
    const paginationItems = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" isActive={i === currentPage} onClick={(e) => { e.preventDefault(); handlePageChange(i); }}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
        paginationItems.push(
            <PaginationItem key={1}>
                <PaginationLink href="#" isActive={1 === currentPage} onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>
                    1
                </PaginationLink>
            </PaginationItem>
        );
        if (currentPage > 3) {
            paginationItems.push(<PaginationEllipsis key="start-ellipsis" />);
        }
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        if (currentPage <= 2) {
          startPage = 2;
          endPage = 4;
        }
        if (currentPage >= totalPages -1) {
            startPage = totalPages -3;
            endPage = totalPages - 1;
        }
        for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(
                <PaginationItem key={i}>
                    <PaginationLink href="#" isActive={i === currentPage} onClick={(e) => { e.preventDefault(); handlePageChange(i); }}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        if (currentPage < totalPages - 2) {
            paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
        }
        paginationItems.push(
            <PaginationItem key={totalPages}>
                <PaginationLink href="#" isActive={totalPages === currentPage} onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}>
                    {totalPages}
                </PaginationLink>
            </PaginationItem>
        );
    }
    
    return paginationItems;
};

  if (loading) {
    return <div className="flex min-h-svh items-center justify-center"><p>Kullanıcılar yükleniyor...</p></div>;
  }

  if (error) {
    return <div className="flex min-h-svh items-center justify-center text-red-600"><p>{error}</p></div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-grow">
                  <CardTitle>Kullanıcı Yönetimi</CardTitle>
                  <CardDescription>Sistemdeki tüm kullanıcıları ve rollerini yönetin.</CardDescription>
              </div>
              <AddUserDialog onUserAdded={fetchProfiles} />
          </div>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Kullanıcıları ara (Email, Ad, Soyad, Şirket, Rol)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredProfiles.length === 0 ? (
            <p className="text-center text-muted-foreground">{searchTerm ? 'Arama kriterlerinize uygun kullanıcı bulunamadı.' : 'Hiç kullanıcı bulunamadı.'}</p>
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
                    <TableHead className="text-right">Aksiyonlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                        <TableCell>{profile.email}</TableCell>
                        <TableCell>{profile.sirket_ismi || '-'}</TableCell>
                        <TableCell>{profile.telefon_numarasi || '-'}</TableCell>
                        <TableCell>{profile.ad || '-'}</TableCell>
                        <TableCell>{profile.soyad || '-'}</TableCell>
                        <TableCell>
                            <span className={cn("inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium", {
                                'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200': profile.rol === 'admin',
                                'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200': profile.rol === 'user',
                                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200': !['admin', 'user'].includes(profile.rol || ''),
                            })}>
                            {profile.rol || 'Belirtilmemiş'}
                            </span>
                        </TableCell>
                        <TableCell>{new Date(profile.created_at).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="mr-2" onClick={() => setUserToEdit(profile)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setUserToDelete(profile)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
              <Pagination className="mt-4">
                  <PaginationContent>
                      <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); handlePageChange(currentPage - 1)}} />
                      </PaginationItem>
                      {renderPaginationItems()}
                      <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => {e.preventDefault(); handlePageChange(currentPage + 1)}}/>
                      </PaginationItem>
                  </PaginationContent>
              </Pagination>
          )}
        </CardContent>
      </Card>
      
      {userToDelete && (
        <ConfirmDeleteDialog
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteConfirm}
          userName={userToDelete.email}
        />
      )}

      {userToEdit && (
        <EditUserDialog
            isOpen={!!userToEdit}
            onClose={() => setUserToEdit(null)}
            onUserUpdated={fetchProfiles}
            user={userToEdit}
        />
      )}
    </>
  );
}