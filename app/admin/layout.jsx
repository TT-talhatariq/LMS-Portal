import React from 'react';
import Sidebar from '../components/adminDashboard/Sidebar';
import Image from 'next/image';

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-6 shadow-sm">
        <div className="flex items-center gap-1">
          <div className="w-14 flex items-center justify-center overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={90} height={42} />
          </div>

          <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Talha's School
          </h1>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
