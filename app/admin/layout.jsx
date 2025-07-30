import React from 'react';
import Sidebar from '../components/adminDashboard/Sidebar';
import Header from '../components/adminDashboard/Header';

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
