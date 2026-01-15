// components/ui/Table.tsx
type TableProps = {
  headers: string[];
  children: React.ReactNode;
};

export function Table({ headers, children }: { headers: string[], children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)' }}>
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/50 text-muted" style={{ borderColor: 'var(--border)' }}>
          <tr>
            {headers.map((h, index) => (
              // Use a combination of the string and index to ensure uniqueness
              <th key={`${h}-${index}`} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {children}
        </tbody>
      </table>
    </div>
  );
}