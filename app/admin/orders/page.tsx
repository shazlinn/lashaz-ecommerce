// app/admin/orders/page.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Table } from "@/components/ui/Table";

type OrderRow = {
  id: string;
  customer: string;
  total: string;
  status: "pending" | "paid" | "shipped";
  date: string;
  tracking?: string;
};

const MOCK: OrderRow[] = [
  { id: "ord_1", customer: "Amina", total: "RM 89.00", status: "paid", date: "2025-06-23", tracking: "MY123" },
  { id: "ord_2", customer: "Farah", total: "RM 55.00", status: "pending", date: "2025-06-22" },
];

export default function OrdersPage() {
  const [status, setStatus] = useState<"" | OrderRow["status"]>("");

  const filtered = MOCK.filter((o) => (status ? o.status === status : true));

  return (
    <section>
      <PageHeader
        title="Orders"
        subtitle="View, update status, and add tracking"
      />
      <div className="mb-3 flex gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
        </select>
        <button className="rounded-md border border-zinc-300 px-3 py-2 text-sm">
          Export
        </button>
      </div>

      <Table headers={["Order ID", "Customer", "Total", "Status", "Date", "Tracking", ""]}>
        {filtered.map((o) => (
          <tr key={o.id}>
            <td className="px-4 py-3 font-medium">{o.id}</td>
            <td className="px-4 py-3">{o.customer}</td>
            <td className="px-4 py-3">{o.total}</td>
            <td className="px-4 py-3">
              <StatusPill status={o.status} />
            </td>
            <td className="px-4 py-3">{o.date}</td>
            <td className="px-4 py-3">{o.tracking ?? "-"}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-2">
                <button className="rounded-md border border-zinc-300 px-2 py-1 text-xs">
                  View
                </button>
                <button className="rounded-md border border-zinc-300 px-2 py-1 text-xs">
                  Update
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </section>
  );
}

function StatusPill({ status }: { status: OrderRow["status"] }) {
  const styles =
    status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : status === "paid"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-blue-100 text-blue-700";
  return (
    <span className={`rounded-full px-2 py-1 text-xs ${styles}`}>{status}</span>
  );
}