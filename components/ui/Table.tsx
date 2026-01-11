// components/ui/Table.tsx
type TableProps = {
  headers: string[];
  children: React.ReactNode;
};

export function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">{children}</tbody>
      </table>
    </div>
  );
}