// ecommerce/app/profile/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import LogoutButton from '@/components/frontstore/LogoutButton';
import OrderListWithSearch from '@/components/frontstore/OrderListWithSearch';
import { 
  ChevronLeftIcon, 
  ArrowTopRightOnSquareIcon, 
  ShieldCheckIcon,
  PencilSquareIcon
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
  const rawOrders = await prisma.order.findMany({
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

  // Safe data serializations for server-to-client processing transmission
  const formattedOrders = rawOrders.map((order) => ({
    ...order,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item: any) => ({
      ...item,
      price: Number(item.price),
      product: { ...item.product, price: Number(item.product.price) }
    }))
  }));

  const isAdmin = userData?.role?.toUpperCase() === 'ADMIN';

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 font-sans text-black">
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

      <div className="space-y-12">
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

        {/* Dynamic Recent Purchases Segment Section Container */}
        <div className="space-y-6">
          {/* 
            CRITICAL CLEANUP: 
            The standalone 'Recent Purchases' title layout has been cleanly removed from here.
            It is now handled directly inside OrderListWithSearch alongside the search bar for an optimized layout row.
          */}
          <OrderListWithSearch initialOrders={formattedOrders} />
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