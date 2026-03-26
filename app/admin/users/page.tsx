// lashaz-ecommerce/app/admin/users/page.tsx
import { fetchUsers } from '@/lib/users';
import UsersClient from './users-client';

export default async function UsersPage() {
  const data = await fetchUsers(); // Server-side fetch from User model 

  return (
    <section className="space-y-6">
      {/* Page Heading aligned with Sidebar design */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted">
          Manage system access, create new accounts, or deactivate users.
        </p>
      </div>

      {/* Client component handles filtering and CRUD */}
      <UsersClient initialRows={data} />
    </section>
  );
}