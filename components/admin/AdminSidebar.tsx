'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Squares2X2Icon, 
  UsersIcon, 
  ShoppingBagIcon, 
  ArchiveBoxIcon 
} from '@heroicons/react/24/outline';

// Define the shape of the user prop passed from the server layout
type AdminSidebarProps = {
  user: {
    name: string;
    email: string;
  };
};

const items = [
  { href: '/admin', label: 'Dashboard', icon: Squares2X2Icon },
  { href: '/admin/users', label: 'Users', icon: UsersIcon },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBagIcon },
  { href: '/admin/products', label: 'Products', icon: ArchiveBoxIcon },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r flex flex-col" 
           style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      {/* Brand Logo Area */}
      <div className="p-6" style={{ borderColor: 'var(--border)' }}>
        <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--clr-primary-a10)' }}>
          LA SHAZ <span className="text-xs font-normal text-muted">ADMIN</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        <p className="text-[10px] uppercase font-bold text-muted px-3 mb-2">Main Menu</p>
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group
                ${active ? 'scale-[1.02] shadow-sm' : 'hover:scale-[1.01]'}
              `}
              style={{
                background: active 
                  ? 'color-mix(in oklab, var(--card) 85%, black 15%)' 
                  : 'transparent',
                color: active ? 'var(--fg)' : 'var(--muted)',
                boxShadow: active 
                  ? 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
                  : 'none',
                border: active ? '1px solid var(--border)' : '1px solid transparent'
              }}
            >
              <item.icon className={`h-5 w-5 transition-colors 
                ${active ? 'text-[var(--clr-primary-a10)]' : 'text-muted group-hover:text-fg'}`} 
              />
              <span className={active ? 'font-semibold' : 'font-medium'}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Area - Updated with dynamic user data */}
      <div className="p-4 mt-auto" style={{ borderColor: 'var(--border)' }}>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          {/* Circular avatar with the user's first initial */}
          <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center font-bold text-[var(--clr-primary-a10)] border" style={{ borderColor: 'var(--border)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-left overflow-hidden">
            <p className="truncate font-medium text-fg">{user.name}</p>
            <p className="truncate text-[10px] text-muted">{user.email}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}