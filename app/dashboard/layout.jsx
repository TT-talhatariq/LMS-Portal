import React from 'react';
import Header from '../components/studentDashboard/Header';
import Sidebar from '../components/studentDashboard/Sidebar';
import Breadcrumbs from '../components/studentDashboard/Breadcrumbs';

export default function StudentLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div>
            <div className="mb-6">
              <Breadcrumbs />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
