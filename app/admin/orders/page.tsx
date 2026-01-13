"use client";

import { useState } from "react";
import { Table } from "@/components/ui/Table";

type OrderRow = {
  id: string;
  customer: string;
  total: string;
  status: "pending" | "paid" | "shipped";
  date: string;
  tracking?: string;
};

// Mock data based on your Order Management functional requirements [cite: 715, 1043]
const MOCK: OrderRow[] = [
  { id: "ORD-7721", customer: "Amina", total: "RM 89.00", status: "paid", date: "2026-01-10", tracking: "MY123" },
  { id: "ORD-7722", customer: "Farah", total: "RM 55.00", status: "pending", date: "2026-01-11" },
];

export default function OrdersPage() {
  const [status, setStatus] = useState<"" | OrderRow["status"]>("");

  const filtered = MOCK.filter((o) => (status ? o.status === status : true));

  return (
    <section className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted">
          Monitor customer purchases, update fulfillment status, and assign tracking numbers.
        </p>
      </div>

      {/* Filters using globals.css utility classes */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="input py-2"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
          </select>
          <button className="btn-muted">
            Export
          </button>
        </div>
      </div>

      {/* Table utilizing the Table UI component [cite: 1043] */}
      <Table headers={["Order ID", "Customer", "Total", "Status", "Date", "Tracking", ""]}>
        {filtered.map((o) => (
          <tr key={o.id} className="table-row">
            <td className="px-4 py-3 font-medium text-fg">{o.id}</td>
            <td className="px-4 py-3">{o.customer}</td>
            <td className="px-4 py-3">{o.total}</td>
            <td className="px-4 py-3">
              <StatusPill status={o.status} />
            </td>
            <td className="px-4 py-3 text-muted">{o.date}</td>
            <td className="px-4 py-3 font-mono text-xs">{o.tracking ?? "-"}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-2">
                <button className="btn-muted xs py-1">View</button>
                <button className="btn-primary xs py-1">Update</button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </section>
  );
}

function StatusPill({ status }: { status: OrderRow["status"] }) {
  // Mapping to your theme success/warning/info tokens from globals.css
  const getStyle = () => {
    switch (status) {
      case "pending": return { background: 'var(--clr-warning-a20)', color: 'var(--clr-warning-a0)' };
      case "paid": return { background: 'var(--clr-success-a20)', color: 'var(--clr-success-a0)' };
      case "shipped": return { background: 'var(--clr-info-a20)', color: 'var(--clr-info-a0)' };
      default: return {};
    }
  };

  return (
    <span 
      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider" 
      style={getStyle()}
    >
      {status}
    </span>
  );
}