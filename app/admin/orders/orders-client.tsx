// lashaz-ecommerce/app/admin/orders/orders-client.tsx
'use client';

import { useMemo, useState } from 'react';
import { Table } from '@/components/ui/Table';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { generateInvoice } from '@/lib/invoice';
import { 
  TruckIcon, 
  CheckBadgeIcon, 
  DocumentArrowDownIcon,
  EyeIcon,
  XMarkIcon,
  EnvelopeIcon,
  ClipboardIcon,
  InformationCircleIcon // Added for the reason tooltip/icon
} from '@heroicons/react/24/outline';

export type OrderRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'PENDING';
  trackingNumber?: string | null;
  paymentReason?: string | null; // Added to sync with Webhook updates
  createdAt: string;
  items: string[];
};

export default function OrdersClient({ initialRows }: { initialRows: OrderRow[] }) {
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null); 
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return initialRows.filter((o) =>
      [o.customerName, o.customerEmail, o.id].some((v) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [query, initialRows]);

  const updateStatus = async (orderId: string, userEmail: string, newStatus: string) => {
    let trackingNumber = "";

    if (newStatus === 'SHIPPED') {
      const input = window.prompt("Enter Courier Tracking Number (Optional):");
      if (input === null) return; 
      trackingNumber = input;
    }

    const loadingToast = toast.loading(`Updating to ${newStatus}...`);
    try {
      const res = await fetch('/api/admin/orders/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          status: newStatus, 
          userEmail,
          trackingNumber 
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Protocol Updated & Email Sent!`, { id: loadingToast });
      router.refresh();
    } catch (error) {
      toast.error("Fulfillment Error", { id: loadingToast });
    }
  };

  const resendEmail = async (orderId: string, userEmail: string, status: string) => {
    const loadingToast = toast.loading("Re-transmitting Email...");
    try {
      const res = await fetch('/api/admin/orders/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, userEmail }),
      });
      if (!res.ok) throw new Error();
      toast.success("Email Successfully Resent!", { id: loadingToast });
    } catch (error) {
      toast.error("Transmission Failure", { id: loadingToast });
    }
  };

  const copyTracking = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Tracking ID Copied");
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customer or order ID..."
          className="w-full max-w-md input"
        />
        <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-0.5 opacity-60">Revenue Collection</span>
            <span className="text-lg font-bold text-black font-josefin">RM {initialRows.reduce((a, b) => a + b.total, 0).toFixed(2)}</span>
        </div>
      </div>

      <Table headers={['Order Ref', 'Customer', 'Status', 'Revenue', 'Actions']}>
        {filtered.map((o) => (
          <tr key={o.id} className="table-row group">
            <td className="px-4 py-4 font-mono text-[11px] font-bold text-muted">
              #{o.id.slice(-6).toUpperCase()}
            </td>
            <td className="px-4 py-4">
              <div className="font-medium text-fg">{o.customerName}</div>
              <div className="text-[10px] text-muted">{o.customerEmail}</div>
            </td>
            <td className="px-4 py-4">
              <div className="flex flex-col gap-1">
                <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                  o.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  o.status === 'SHIPPED' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  o.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100' :
                  'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {o.status}
                </span>
                {o.paymentReason && (
                   <span className="text-[8px] text-zinc-400 font-bold truncate max-w-[100px] uppercase">
                     {o.paymentReason}
                   </span>
                )}
              </div>
            </td>
            <td className="px-4 py-4 font-medium">{formatMYR(o.total)}</td>
            <td className="px-4 py-4 text-right">
              <div className="flex justify-end gap-2 transition-all">
                <button 
                  onClick={() => setSelectedOrder(o)}
                  className="btn-muted p-2 hover:bg-black hover:text-white transition-all shadow-sm"
                  title="View Details"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>

                {o.status === 'PAID' && (
                  <button onClick={() => updateStatus(o.id, o.customerEmail, 'SHIPPED')} className="btn-muted p-2 hover:text-amber-600" title="Ship">
                    <TruckIcon className="h-5 w-5" />
                  </button>
                )}
                {o.status === 'SHIPPED' && (
                  <button onClick={() => updateStatus(o.id, o.customerEmail, 'DELIVERED')} className="btn-muted p-2 hover:text-blue-600" title="Deliver">
                    <CheckBadgeIcon className="h-5 w-5" />
                  </button>
                )}
                <button onClick={() => generateInvoice(o)} className="btn-muted p-2 hover:text-black" title="Invoice">
                  <DocumentArrowDownIcon className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-zinc-50 px-8 py-6 border-b border-zinc-100 flex justify-between items-center">
              <div>
                <h3 className="font-josefin text-xl font-bold uppercase tracking-tight text-black">Order Context</h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Ref: #{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                <XMarkIcon className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Customer Identity</span>
                  <p className="font-bold text-black">{selectedOrder.customerName}</p>
                  <p className="text-xs text-zinc-500">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Logistics Profile</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-black uppercase text-xs">{selectedOrder.status}</p>
                      {selectedOrder.trackingNumber && (
                        <button 
                          onClick={() => copyTracking(selectedOrder.trackingNumber!)}
                          className="bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1 hover:bg-amber-100 transition-colors"
                        >
                          {selectedOrder.trackingNumber}
                          <ClipboardIcon className="h-2 w-2" />
                        </button>
                      )}
                    </div>
                    {/* Status Reason UI */}
                    {selectedOrder.paymentReason && (
                      <div className="flex items-center gap-1 text-red-500">
                        <InformationCircleIcon className="h-3 w-3" />
                        <p className="text-[9px] font-bold uppercase tracking-tight italic">
                          {selectedOrder.paymentReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-4">Itemized Manifest</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-zinc-50">
                      <span className="text-sm font-medium text-zinc-700">{item}</span>
                      <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded text-zinc-500 uppercase tracking-tighter">Qty: 1</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 rounded-2xl p-6 flex justify-between items-center text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block">Total Collection</span>
                  <span className="text-xl font-bold font-josefin">RM {selectedOrder.total.toFixed(2)}</span>
                </div>

                <button 
                  onClick={() => resendEmail(selectedOrder.id, selectedOrder.customerEmail, selectedOrder.status)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all border border-white/10 group shadow-lg shadow-black/20"
                >
                  <EnvelopeIcon className="h-4 w-4 transition-transform group-hover:-rotate-12" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Resend Protocol</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function formatMYR(val: string | number) {
  const num = typeof val === 'string' ? Number(val) : val;
  return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(num);
}