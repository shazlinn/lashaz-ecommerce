// app/admin/page.tsx
import { PageHeader } from '@/components/admin/PageHeader';

export default function AdminHome() {
  return (
    <section>
      <PageHeader title="Dashboard" subtitle="Quick overview of store activity" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric title="Sales (Today)" value="RM 0.00" />
        <Metric title="Orders (Today)" value="0" />
        <Metric title="Active Users" value="0" />
        <Metric title="Low Stock" value="0" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Recent Orders">
          <Empty>Recent orders will appear here.</Empty>
        </Panel>
        <Panel title="Top Products">
          <Empty>Top products will appear here.</Empty>
        </Panel>
      </div>
    </section>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="card">
      <div className="small text-muted">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="mb-2 card-title">{title}</div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-md border border-dashed p-6 text-center xs text-muted"
      style={{ borderColor: 'var(--border)' }}
    >
      {children}
    </div>
  );
}