'use client';
import { useProfile } from '@/hooks/useProfile';
import { GraduationCap, LayoutDashboard, LogOut, User, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';

const Header = ({ onMenuToggle }) => {
  const { userName } = useProfile('Student');
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logout successfully!');
    router.push('/');
  };

  return (
    <>
      <header className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-4 lg:px-6 shadow-sm">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 mr-3 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Student Portal
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:gap-4">
          {userName === 'Super Admin' && (
            <Button
              onClick={() => router.push('/admin')}
              variant="ghost"
              className="text-slate-700 hover:bg-indigo-50 flex items-center gap-2 px-2 lg:px-4 py-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Visit Admin</span>
            </Button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:inline">
              {userName}
            </span>
          </div>
          <button
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
