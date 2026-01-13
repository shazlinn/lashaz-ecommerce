// app/components/admin/AdminNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm"
            style={{
              // active = filled chip; inactive = subtle text on hoverable bg
              background: active ? 'var(--fg)' : 'transparent',
              color: active ? 'var(--bg)' : 'var(--color-muted)',
            }}
            onMouseEnter={(e) => {
              if (!active) (e.currentTarget.style.background = 'var(--card)');
            }}
            onMouseLeave={(e) => {
              if (!active) (e.currentTarget.style.background = 'transparent');
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}