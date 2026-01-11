// app/admin/page.tsx
import { PageHeader } from "@/components/admin/PageHeader";

export default function AdminHome() {
  return (
    <section>
      <PageHeader
        title="Dashboard"
        subtitle="Quick overview of store activity"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Sales (Today)" value="RM 0.00" />
        <Card title="Orders (Today)" value="0" />
        <Card title="Active Users" value="0" />
        <Card title="Low Stock" value="0" />
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

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="text-sm text-zinc-600">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
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
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-3 text-sm font-medium text-zinc-700">{title}</div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-500">
      {children}
    </div>
  );
}