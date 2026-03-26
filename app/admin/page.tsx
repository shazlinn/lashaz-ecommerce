// lashaz-ecommerce/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardData {
  sales: number;
  orders: number;
  users: number;
  lowStock: number;
  recentOrders: any[];
  topProducts: { name: string; sales: number }[]; //
}

export default function AdminHome() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [dbStatus, setDbStatus] = useState<'LOADING' | 'ONLINE' | 'OFFLINE'>('LOADING');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [healthRes, statsRes] = await Promise.all([
          fetch('/api/admin/health'),
          fetch('/api/admin/dashboard')
        ]);

        if (healthRes.ok) setDbStatus('ONLINE');
        else setDbStatus('OFFLINE');

        if (statsRes.ok) {
          const stats = await statsRes.json();
          setData(stats);
        }
      } catch {
        setDbStatus('OFFLINE');
      }
    }
    fetchDashboard();
  }, []);

  return (
    <section className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight uppercase font-josefin text-black">Dashboard</h1>
        <p className="text-sm text-muted uppercase tracking-widest text-[10px]">Real-time Store Intelligence</p>
      </div>

      {/* Row 1: Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <Metric title="Sales (Today)" value={`RM ${data?.sales.toFixed(2) || '0.00'}`} />
        <Metric title="Orders (Today)" value={data?.orders.toString() || '0'} />
        <Metric title="Active Users" value={data?.users.toString() || '0'} />
        <Metric 
          title="Low Stock" 
          value={data?.lowStock.toString() || '0'} 
          isAlert={!!(data && data.lowStock > 0)} 
        />
        <div className="card shadow-sm border border-zinc-100 bg-white">
          <div className="small text-muted font-medium uppercase tracking-wider">Protocol Health</div>
          <div className={`mt-2 text-xl font-bold tracking-tight flex items-center gap-2 ${
            dbStatus === 'ONLINE' ? 'text-emerald-500' : 'text-red-500'
          }`}>
            <span className={`h-2 w-2 rounded-full ${dbStatus === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            {dbStatus}
          </div>
        </div>
      </div>

      {/* Row 2: Analytics Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent Transactions">
          {data?.recentOrders.length ? (
            <div className="space-y-4">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between text-sm border-b border-zinc-50 pb-3">
                  <div>
                    <p className="font-bold text-black">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-[10px] text-muted uppercase font-bold tracking-tight">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-black">RM {order.total.toFixed(2)}</p>
                    <span className="text-[9px] font-bold uppercase text-zinc-400">{order.status}</span>
                  </div>
                </div>
              ))}
              <Link href="/admin/orders" className="block text-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 pt-2 hover:text-black transition-colors">
                View Full Ledger →
              </Link>
            </div>
          ) : (
            <Empty>No recent activity detected.</Empty>
          )}
        </Panel>

        <Panel title="Best Selling Manifest">
          {data?.topProducts.length ? (
            <div className="space-y-5">
              {data.topProducts.map((product, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-tight text-zinc-600">{product.name}</span>
                    <span className="text-[10px] font-bold text-zinc-400">{product.sales} units</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-black h-full transition-all duration-1000" 
                      style={{ width: `${(product.sales / Math.max(...data.topProducts.map(p => p.sales))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty>No sales data recorded yet.</Empty>
          )}
        </Panel>
      </div>

      {/* Row 3: Logistics & Inventory Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Fulfillment Logic" className="lg:col-span-1">
          <div className="flex flex-col items-center justify-center py-4">
             <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path className="text-zinc-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-black" strokeWidth="3" strokeDasharray="75, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xl font-bold text-black">75%</span>
             </div>
             <p className="text-[10px] text-zinc-400 uppercase font-bold mt-4 tracking-widest text-center">Protocol Completion Rate</p>
          </div>
        </Panel>

        <Panel title="Critical Restock" className="lg:col-span-2">
          {data && data.lowStock > 0 ? (
            <div className="space-y-4">
              <div className="p-5 bg-red-50/50 border border-red-100 rounded-2xl flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-red-700 uppercase tracking-tight">Stock Deficiency Detected</p>
                   <p className="text-[10px] text-red-500 mt-1 uppercase tracking-widest">{data.lowStock} Items have fallen below threshold (5)</p>
                </div>
                <Link href="/admin/products" className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors">
                  Resolve Now
                </Link>
              </div>
              <div className="text-[10px] text-zinc-400 italic">Automated alerts generated from current ledger volume.</div>
            </div>
          ) : (
            <Empty>Inventory levels are synchronized and optimal.</Empty>
          )}
        </Panel>
      </div>
    </section>
  );
}

// --- Component Library ---

function Metric({ title, value, isAlert }: { title: string; value: string; isAlert?: boolean }) {
  return (
    <div className={`card shadow-sm transition-transform hover:scale-[1.01] bg-white border ${isAlert ? 'border-red-200 bg-red-50/20' : 'border-zinc-100'}`}>
      <div className="small text-muted font-medium uppercase tracking-wider">{title}</div>
      <div className={`mt-2 text-3xl font-bold tracking-tight ${isAlert ? 'text-red-600' : 'text-black'}`}>{value}</div>
    </div>
  );
}

function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`card shadow-sm border border-zinc-100 bg-white p-8 rounded-[2rem] ${className}`}>
      <div className="mb-6 text-base font-bold tracking-tight uppercase font-josefin text-black">{title}</div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 py-16 px-6 text-center text-sm text-muted bg-zinc-50/30">
      <div className="mb-4 h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center">
        <div className="h-4 w-4 rounded-full border-2 border-zinc-300" />
      </div>
      <div>{children}</div>
    </div>
  );
}