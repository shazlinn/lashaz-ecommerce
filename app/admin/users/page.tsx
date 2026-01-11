// app/admin/users/page.tsx
import { PageHeader } from '@/components/admin/PageHeader';
import { Table } from '@/components/ui/Table';
import { fetchUsers } from '@/lib/users';
import UsersClient from './users-client';

export default async function UsersPage() {
  const data = await fetchUsers(); // Server-side fetch

  return (
    <section>
      <PageHeader
        title="Users"
        subtitle="Search, create, or deactivate users"
      />

      {/* Client component handles lightweight filtering without refetch */}
      <UsersClient initialRows={data} />
    </section>
  );
}