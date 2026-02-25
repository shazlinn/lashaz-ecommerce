// lashaz-ecommerce/app/profile/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import LogoutButton from '@/components/frontstore/LogoutButton';
import InvoiceButton from '@/components/frontstore/InvoiceButton'; 
import { 
  ChevronLeftIcon, 
  ArrowTopRightOnSquareIcon, 
  ShieldCheckIcon,
  PencilSquareIcon,
  ShoppingBagIcon,
  TruckIcon, 
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as any; 
  
  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 font-sans text-center space-y-6">
        <h1 className="text-3xl font-bold font-josefin uppercase tracking-tight">Identity Required</h1>
        <p className="text-zinc-400 text-sm italic">Please sign in to view your beauty manifest.</p>
        <Link href="/login" className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] transition-transform active:scale-95">
          Sign In
        </Link>
      </div>
    );
  }

  // Fetching fresh User data
  const userData = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true
    }
  });

  // Fetching User's Orders with associated items
  const orders = await prisma.order.findMany({
    where: { userId: sessionUser.id },
    select: {
      id: true,
      total: true, 
      status: true,
      createdAt: true,
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const isAdmin = userData?.role?.toUpperCase() === 'ADMIN';

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 font-sans">
      <div className="mb-8">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Continue Shopping
        </Link>
      </div>

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-josefin uppercase tracking-tight text-black">Your Account</h1>
          <p className="text-gray-400 mt-2">Manage your personal details and beauty history.</p>
        </div>

        <div className="flex gap-3">
          {isAdmin && (
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-2 bg-zinc-100 hover:bg-black hover:text-white px-5 py-3 rounded-2xl transition-all text-[10px] font-bold uppercase tracking-widest group shadow-sm"
            >
              <ShieldCheckIcon className="h-4 w-4" />
              Manage Ledger
              <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          )}
          <Link 
            href="/profile/edit" 
            className="flex items-center gap-2 border border-zinc-200 hover:border-black px-5 py-3 rounded-2xl transition-all text-[10px] font-bold uppercase tracking-widest group shadow-sm"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>
      </header>

      <div className="space-y-8">
        {/* Main Identity Card */}
        <div className="rounded-[2rem] border border-gray-100 p-10 space-y-10 bg-white shadow-sm">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="grid gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</span>
              <div className="text-lg font-medium tracking-tight">{userData?.name ?? '-'}</div>
            </div>
            <div className="grid gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</span>
              <div className="text-lg font-medium tracking-tight text-zinc-500">{userData?.email ?? '-'}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 pt-8 border-t border-gray-50">
             <div className="grid gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mobile Contact</span>
              <div className={`text-lg font-medium ${!userData?.phone ? 'text-zinc-300 italic' : ''}`}>
                {userData?.phone ?? 'No phone number provided'}
              </div>
            </div>
            <div className="grid gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Primary Delivery Address</span>
              <div className={`text-sm font-medium leading-relaxed max-w-xs ${!userData?.address ? 'text-zinc-300 italic' : 'text-gray-500'}`}>
                {userData?.address ?? 'No shipping address saved yet.'}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
            <LogoutButton />
            <div className="text-right">
              <p className="text-[9px] text-gray-300 uppercase tracking-widest font-bold">La Shaz Identity Management</p>
            </div>
          </div>
        </div>

        {/* Recent Purchases Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-4">
            <ShoppingBagIcon className="h-4 w-4 text-black" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Recent Purchases</h2>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-zinc-200 p-12 text-center">
              <p className="text-xs text-zinc-400 uppercase tracking-widest">No order history found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const plainOrder = {
                  ...order,
                  total: Number(order.total),
                  createdAt: order.createdAt.toISOString(),
                  items: order.items.map((item: any) => ({
                    ...item,
                    price: Number(item.price),
                    product: { ...item.product, price: Number(item.product.price) }
                  }))
                };

                return (
                  <div key={order.id} className="rounded-3xl border border-zinc-100 bg-white p-6 flex flex-col md:flex-row justify-between items-center gap-4 group hover:border-black transition-all duration-500">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold font-mono text-zinc-400">#{order.id.slice(-6).toUpperCase()}</span>
                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          order.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          order.status === 'SHIPPED' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-zinc-50 text-zinc-500 border-zinc-100'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                      <span className="text-[12px] font-bold whitespace-nowrap">
                        RM {Number(order.total).toFixed(2)}
                      </span>
                      
                      <div className="flex items-center gap-3">
                        {/* 1. Direct Tracking Link */}
                        <Link 
                          href={`/track/${order.id}`}
                          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
                        >
                          <TruckIcon className="h-3 w-3" />
                          Track Glow
                        </Link>
                        
                        {/* 2. Invoice Generation */}
                        <InvoiceButton order={plainOrder} /> 
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
          La Shaz © 2026 — Built with Authentic Precision
        </p>
      </div>
    </div>
  );
}