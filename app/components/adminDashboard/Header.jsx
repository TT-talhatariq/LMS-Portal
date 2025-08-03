'use client';
import Image from 'next/image';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { userName } = useProfile('Admin');
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <>
      <header className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-6 shadow-sm">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1">
            <div className="w-14 flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={90} height={42} />
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Talha's School
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Visit Dashabord */}
              <Button
                onClick={() => router.push('/dashboard')}
                variant="ghost"
                className="text-slate-700 hover:bg-indigo-50 flex items-center gap-2 px-4 py-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm">Visit Student Portal</span>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">
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
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
