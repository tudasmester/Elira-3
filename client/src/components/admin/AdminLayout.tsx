import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  BookOpen,
  Users,
  School,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  User,
  Plus,
  FileText,
  Zap,
} from 'lucide-react';
import eliraNavbarIcon from '@assets/eliranavbarszeles.png';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    title: 'Áttekintés',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Kurzusok',
    href: '/admin/courses',
    icon: BookOpen,
  },
  {
    title: 'Kvízek',
    href: '/admin/quizzes',
    icon: FileText,
  },
  {
    title: 'Felhasználók',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Egyetemek',
    href: '/admin/universities',
    icon: School,
  },
  {
    title: 'Elemzések',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Aktivitásrendszer',
    href: '/admin/activity-system',
    icon: Zap,
  },
];

const quickActions = [
  {
    title: 'Új kurzus',
    href: '/admin/courses/wizard',
    icon: Plus,
    description: 'Kurzus létrehozási varázsló',
  },
  {
    title: 'Tartalom szinkron',
    href: '/admin/sync',
    icon: Zap,
    description: 'Tartalom szinkronizálása',
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location === '/admin';
    }
    return location.startsWith(path);
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/admin">
          <img 
            src={eliraNavbarIcon} 
            alt="Elira Admin" 
            className="h-8 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigáció
          </h3>
          {navigationItems.map((item) => {
            const isActive = isActivePath(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                }`}
                onClick={() => mobile && setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Gyors műveletek
          </h3>
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => mobile && setIsMobileMenuOpen(false)}
            >
              <action.icon className="h-4 w-4" />
              <div className="flex flex-col">
                <span>{action.title}</span>
                <span className="text-xs text-muted-foreground/70">
                  {action.description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t p-4">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={() => mobile && setIsMobileMenuOpen(false)}
        >
          <Settings className="h-4 w-4" />
          Beállítások
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 border-r bg-muted/40 lg:block">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menü megnyitása</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent mobile />
            </SheetContent>
          </Sheet>

          {/* Page Title */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              Admin Panel
            </h1>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@elira.hu
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Beállítások</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Kijelentkezés</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}