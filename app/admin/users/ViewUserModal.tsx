'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ShoppingBagIcon,
  CalendarIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

interface ViewUserModalProps {
  userId: string;
  renderTrigger: () => React.ReactNode;
}

export default function ViewUserModal({ userId, renderTrigger }: ViewUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`/api/admin/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, userId]);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{renderTrigger()}</div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          {/* FIXED: Changed bg-zinc-900 to bg-white with dark:bg-zinc-900 */}
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
            
            {/* Header Section */}
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">
              <h2 className="font-josefin font-bold uppercase tracking-widest text-sm flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                <IdentificationIcon className="h-5 w-5" /> Customer Details
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors">
                <XMarkIcon className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-10">
              {loading ? (
                <div className="py-20 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 animate-pulse">
                  Fetching La Shaz Profile...
                </div>
              ) : user ? (
                <>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Customer Name</p>
                      <p className="font-josefin font-bold uppercase text-xs tracking-tight text-zinc-900 dark:text-white">
                        {user.name || '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email Address</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="grid grid-cols-2 gap-8 mb-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                          <PhoneIcon className="h-3 w-3" /> Contact Phone
                        </p>
                        <p className="font-josefin font-bold uppercase text-xs tracking-tight text-zinc-900 dark:text-white">
                          {user.phone || 'Not Provided'}
                        </p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Account Status</p>
                         <span className={`inline-block text-[10px] font-bold uppercase tracking-tighter px-3 py-1 rounded-full ${
                           user.status === 'active' 
                           ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                           : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
                         }`}>
                           {user.status}
                         </span>
                      </div>
                    </div>

                    <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/30 p-6 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" /> Shipping Destination
                      </p>
                      
                      {user.address ? (
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-relaxed text-zinc-900 dark:text-zinc-200">
                            {user.address.split(',')[0]}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                             {user.address.split(',').slice(1).join(',')}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-400 italic">No shipping address on file.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-1">
                      <ShoppingBagIcon className="h-3 w-3" /> Recent Activity
                    </p>
                    {user.orders?.length > 0 ? (
                      <div className="space-y-3">
                        {user.orders.map((order: any) => (
                          <div key={order.id} className="flex justify-between items-center p-4 bg-zinc-50/50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                              <CalendarIcon className="h-4 w-4 text-zinc-400 dark:text-zinc-600" />
                              <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-800 dark:text-zinc-200">
                                Order #{order.id.slice(-6)}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold tracking-tight text-zinc-900 dark:text-white">
                              RM {Number(order.totalAmount).toFixed(2)}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-zinc-50/50 dark:bg-zinc-800/20 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-600">
                          New Customer - 0 Orders
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
               <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">
                 La Shaz Identity Protocol
               </p>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-black text-white px-10 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-100 dark:hover:text-black transition-all active:scale-95 shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}