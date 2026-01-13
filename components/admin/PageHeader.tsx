// components/admin/PageHeader.tsx
type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="mt-1 xs text-muted">{subtitle}</p>}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
  );
}