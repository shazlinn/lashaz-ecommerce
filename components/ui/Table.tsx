// components/ui/Table.tsx
type TableProps = {
  headers: string[];
  children: React.ReactNode;
};

export function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border table-card">
      <table className="min-w-full text-left text-sm">
        <thead className="table-head">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y table-rows">{children}</tbody>
      </table>
    </div>
  );
}