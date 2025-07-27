import React from 'react';
import Sidebar from '../components/adminDashboard/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full h-16 bg-white border-b flex items-center px-6">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
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
