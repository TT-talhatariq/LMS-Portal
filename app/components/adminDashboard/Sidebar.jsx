import React from 'react';
import { Home, Users, BookOpen, Video } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  {
    label: 'Manage Student',
    icon: <Users className="h-5 w-5" />,
    href: '/admin/students',
  },
  {
    label: 'Manage Course',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/admin/courses',
  },
  {
    label: 'Manage Modules',
    icon: <Home className="h-5 w-5" />,
    href: '/admin/modules',
  },
  {
    label: 'Manage Videos',
    icon: <Video className="h-5 w-5" />,
    href: '/admin/videos',
  },
];

const Sidebar = () => {
  return (
    <aside className="h-screen w-64 border-r bg-muted p-4">
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
