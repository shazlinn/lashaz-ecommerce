// lashaz-ecommerce/app/profile/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import LogoutButton from '@/components/frontstore/LogoutButton';
import { 
  ChevronLeftIcon, 
  ArrowTopRightOnSquareIcon, 
  ShieldCheckIcon,
  PencilSquareIcon 
} from '@heroicons/react/24/outline';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  // Cast user for TypeScript safety
  const user = session?.user as any; 
  
  // Convert role to uppercase to avoid case-sensitivity issues with the database
  const userRole = user?.role?.toUpperCase() || 'CUSTOMER'; 
  
  const isAdmin = userRole === 'ADMIN';
  const isCustomer = userRole === 'CUSTOMER';

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 font-sans text-center">
        <h1 className="text-3xl font-bold font-josefin uppercase tracking-tight">Access Denied</h1>
        <p className="mt-4 text-gray-400">Please sign in to view your profile.</p>
        <Link href="/login" className="mt-6 inline-block bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-transform active:scale-95">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 font-sans">
      {/* Editorial Back Button */}
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
          <h1 className="text-4xl font-bold font-josefin uppercase tracking-tight text-black">
            Your Account
          </h1>
          <p className="text-gray-400 mt-2">Manage your personal details and settings.</p>
        </div>

        <div className="flex gap-3">
          {/* Admin Dashboard Link - Visible only to Verified Admins */}
          {isAdmin && (
            <Link 
              href="/admin/products" 
              className="flex items-center gap-2 bg-zinc-100 hover:bg-black hover:text-white px-5 py-3 rounded-2xl transition-all text-[10px] font-bold uppercase tracking-widest group shadow-sm"
            >
              <ShieldCheckIcon className="h-4 w-4" />
              Admin Dashboard
              <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          )}

          {/* Edit Profile Button - Visible to Customers */}
          {isCustomer && (
            <Link 
              href="/profile/edit" 
              className="flex items-center gap-2 border border-zinc-200 hover:border-black px-5 py-3 rounded-2xl transition-all text-[10px] font-bold uppercase tracking-widest group shadow-sm"
            >
              <PencilSquareIcon className="h-4 w-4" />
              Edit Profile
            </Link>
          )}
        </div>
      </header>

      {/* Main Profile Card */}
      <div className="rounded-[2rem] border border-gray-100 p-10 space-y-10 bg-white shadow-sm">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="grid gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</span>
            <div className="text-lg font-medium tracking-tight">{user?.name ?? '-'}</div>
          </div>

          <div className="grid gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</span>
            <div className="text-lg font-medium tracking-tight text-zinc-500">{user?.email ?? '-'}</div>
          </div>
        </div>

        {/* Contact & Shipping Details */}
        <div className="grid md:grid-cols-2 gap-10 pt-8 border-t border-gray-50">
           <div className="grid gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</span>
            <div className="text-lg font-medium">{user?.phone ?? 'Not set'}</div>
          </div>
          <div className="grid gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Default Shipping Address</span>
            <div className="text-sm font-medium text-gray-500 leading-relaxed max-w-xs">
              {user?.address ?? 'No address saved yet.'}
            </div>
          </div>
        </div>

        <div className="grid gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account Role</span>
          <div className="flex items-center gap-2 text-lg font-medium capitalize">
            {user?.role?.toLowerCase() ?? 'customer'}
            {isAdmin && (
              <span className="text-[8px] bg-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter font-bold">
                Verified Admin
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
          <LogoutButton />
          <div className="text-right">
            <p className="text-[9px] text-gray-300 uppercase tracking-widest font-bold">
              La Shaz Identity Management
            </p>
            <p className="text-[8px] text-gray-200 uppercase tracking-widest mt-0.5">
              Secure Session Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}