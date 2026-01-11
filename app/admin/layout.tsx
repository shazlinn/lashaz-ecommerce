// app/admin/layout.tsx
import type { ReactNode } from "react";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-lg font-semibold">Admin</div>
          <AdminNav />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="mt-12 border-t border-zinc-100">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500">
          La Shaz SmartShop Admin
        </div>
      </footer>
    </div>
  );
}