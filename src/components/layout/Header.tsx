// src/components/layout/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import {
  Bell,
  User,
  Shield,
  GalleryVerticalEnd,
  LogOut,
  Home,
  Search,
  Newspaper,
  Heart,
  ListOrdered,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const navigationLinks = [
  { name: 'Anasayfa', href: '/anasayfa', icon: <Home className="size-4" /> },
  { name: 'İhale Arama', href: '/ihale-arama', icon: <Search className="size-4" /> },
  { name: 'Bültenlerim', href: '/bultenlerim', icon: <Newspaper className="size-4" /> },
  { name: 'Takip Listem', href: '/takip-listem', icon: <Heart className="size-4" /> },
  { name: 'Sonuçlarım', href: '/sonuclarim', icon: <ListOrdered className="size-4" /> },
  { name: 'Sözleşmelerim', href: '/sozlesmelerim', icon: <FileText className="size-4" /> },
  { name: 'Yönetim', href: '/yonetim', icon: <Shield className="size-4" /> },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background px-4 py-3 sm:px-6 lg:px-8">
      <div className="container flex h-full items-center justify-between gap-8">
        <Link to="/" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="text-xl font-bold">Spaceflow</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-2">
            {navigationLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className={cn(
                    "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    location.pathname === link.href
                      ? "bg-accent text-accent-foreground"
                      : ""
                  )}
                >
                  {link.icon}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Bildirimler">
            <Bell className="size-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Kullanıcı Menüsü">
                <User className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profil" className="flex items-center gap-2">
                  <User className="size-4" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/cikis"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="size-4 text-red-600" />
                  Çıkış Yap
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
