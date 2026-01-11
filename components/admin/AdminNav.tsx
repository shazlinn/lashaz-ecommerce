'use client';

// components/admin/AdminNav.tsx
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
            className={`rounded-md px-3 py-2 text-sm ${
              active
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}