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
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
        )}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
  );
}