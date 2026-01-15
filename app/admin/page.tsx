'use client';

export default function AdminHome() {
  return (
    <section className="space-y-8">
      {/* Local Page Header - Unique to this page */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted">Quick overview of store activity </p>
      </div>

      {/* Stats Grid - Using your Metric component */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Metric title="Sales (Today)" value="RM 0.00" />
        <Metric title="Orders (Today)" value="0" />
        <Metric title="Active Users" value="0" />
        <Metric title="Low Stock" value="0" />
      </div>

      {/* Data Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
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
    <div className="card shadow-sm transition-transform hover:scale-[1.01]">
      <div className="small text-muted font-medium uppercase tracking-wider">{title}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
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
    <div className="card shadow-sm border" style={{ borderColor: 'var(--border)' }}>
      <div className="mb-4 text-base font-semibold tracking-tight">{title}</div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 px-6 text-center text-sm text-muted"
      style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
    >
      <div className="mb-2 h-10 w-10 rounded-full bg-muted/20 flex items-center justify-center">
        {/* Placeholder icon */}
        <div className="h-4 w-4 rounded-full border-2 border-muted/30" />
      </div>
      {children}
    </div>
  );
}