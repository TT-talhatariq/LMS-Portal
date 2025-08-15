'use client';
import React, { useState, useEffect } from 'react';
import Header from '../components/studentDashboard/Header';
import Sidebar from '../components/studentDashboard/Sidebar';
import Breadcrumbs from '../components/studentDashboard/Breadcrumbs';

export default function StudentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Header onMenuToggle={toggleSidebar} />
      <div className="block lg:flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main
          className={`
          flex-1 p-4 lg:p-6 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'lg:ml-0' : ''}
        `}
        >
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
