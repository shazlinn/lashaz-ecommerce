// lashaz-ecommerce/app/profile/edit/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon, CheckIcon, UserIcon, PhoneIcon, MapPinIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

//
const MALAYSIAN_STATES = [
  'Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Perak', 'Pahang', 
  'Negeri Sembilan', 'Melaka', 'Kedah', 'Terengganu', 'Kelantan', 
  'Perlis', 'Sabah', 'Sarawak', 'Putrajaya', 'Labuan'
];

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    phone: (session?.user as any)?.phone || '',
    // Split address logic
    street: '',
    city: '',
    postalCode: '',
    state: '',
    newPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        //
        await update({
          ...session,
          user: { 
            ...session?.user, 
            name: formData.name,
            phone: formData.phone,
            address: data.user.address // The combined string from the backend
          }
        });

        toast.success('Profile Updated', {
          style: { background: '#000', color: '#fff', borderRadius: '99px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }
        });
        
        router.push('/profile');
        router.refresh();
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      toast.error('Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 font-sans">
      <Link href="/profile" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-8 transition-colors">
        <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Profile
      </Link>

      <h1 className="text-4xl font-bold font-josefin uppercase tracking-tight mb-8">Edit Details</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <UserIcon className="h-3 w-3" /> Display Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-zinc-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <PhoneIcon className="h-3 w-3" /> Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-zinc-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </div>
        </div>

        {/* Structured Address Section */}
        <div className="pt-4 border-t border-gray-50 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <MapPinIcon className="h-3 w-3" /> Street Address
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({...formData, street: e.target.value})}
              className="w-full bg-zinc-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="Unit No, Street Name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full bg-zinc-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Postcode</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                className="w-full bg-zinc-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">State</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full bg-zinc-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black outline-none transition-all appearance-none"
            >
              <option value="">Select State</option>
              {MALAYSIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-2 pt-4 border-t border-gray-50">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <LockClosedIcon className="h-3 w-3" /> New Password (Optional)
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            className="w-full bg-zinc-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black outline-none transition-all"
            placeholder="Keep blank to remain unchanged"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Update La Shaz Profile'}
          {!loading && <CheckIcon className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}