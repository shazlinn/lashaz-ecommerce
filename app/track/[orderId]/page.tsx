// lashaz-ecommerce/app/track/[orderId]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function TrackingPage({ 
  params 
}: { 
  params: Promise<{ orderId: string }> 
}) {
  // Await the params to avoid the Prisma validation error
  const { orderId } = await params;

  if (!orderId) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  if (!order) notFound();

  const statusSteps = ['PAID', 'SHIPPED', 'DELIVERED'];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#FDFBF9] py-20 px-4">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="font-josefin text-4xl font-bold uppercase tracking-widest text-black">Track Your Glow</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 italic">
            Reference: #{order.id.slice(-6).toUpperCase()}
          </p>
        </div>

        {/* Status Timeline Visualizer */}
        <div className="relative flex justify-between">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
          {statusSteps.map((step, idx) => (
            <div key={step} className="flex flex-col items-center gap-3">
              <div className={`h-4 w-4 rounded-full border-4 transition-all duration-500 ${
                idx <= currentStep ? 'bg-black border-zinc-200' : 'bg-white border-zinc-100'
              }`} />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                idx <= currentStep ? 'text-black' : 'text-zinc-300'
              }`}>{step}</span>
            </div>
          ))}
        </div>

        {/* Logistics Card */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-zinc-100 space-y-8">
          <div className="flex justify-between items-end border-b border-zinc-50 pb-6">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Current Status</p>
              <p className="text-xl font-bold text-black uppercase tracking-tight">{order.status}</p>
            </div>
            {order.trackingNumber && (
              <div className="text-right">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Courier Tracking</p>
                <p className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 italic">
                  {order.trackingNumber}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Itemized Manifest</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm italic font-medium">
                <span>{item.product.name}</span>
                <span className="text-zinc-400 text-[10px] not-italic font-bold">QTY: {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Return to Profile Navigation */}
        <div className="flex flex-col items-center gap-8">
          <Link 
            href="/profile" 
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Profile Manifest
          </Link>

          <p className="text-[9px] text-zinc-300 uppercase font-medium tracking-widest">
            La Shaz Beauty Protocol — Synchronized 2026
          </p>
        </div>
      </div>
    </div>
  );
}