// components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-gray-100 pt-16 pb-8 font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/">
              <Image
                src="/lashaz-logo.svg" 
                alt="La Shaz"
                width={120}
                height={40}
                className="object-contain h-8 w-auto"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Meticulously crafted beauty essentials designed to enhance your 
              natural radiance and cater to your unique beauty journey.
            </p>
            {/* Social Icons Placeholder */}
            <div className="flex gap-4">
              {['twitter', 'facebook', 'instagram', 'github'].map((social) => (
                <div key={social} className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-current rounded-sm" /> 
                </div>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-josefin font-bold uppercase tracking-widest text-black mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link href="/features" className="hover:text-black transition-colors">Features</Link></li>
              <li><Link href="/works" className="hover:text-black transition-colors">Works</Link></li>
              <li><Link href="/career" className="hover:text-black transition-colors">Career</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-josefin font-bold uppercase tracking-widest text-black mb-6">Help</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link href="/support" className="hover:text-black transition-colors">Customer Support</Link></li>
              <li><Link href="/delivery" className="hover:text-black transition-colors">Delivery Details</Link></li>
              <li><Link href="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="font-josefin font-bold uppercase tracking-widest text-black mb-6">FAQ</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link href="/account" className="hover:text-black transition-colors">Account</Link></li>
              <li><Link href="/manage-deliveries" className="hover:text-black transition-colors">Manage Deliveries</Link></li>
              <li><Link href="/orders" className="hover:text-black transition-colors">Orders</Link></li>
              <li><Link href="/payments" className="hover:text-black transition-colors">Payments</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            La Shaz © 2000-2023, All Rights Reserved
          </p>
          <div className="flex gap-4">
            {/* Payment Method Icons Placeholder */}
            {['Visa', 'Mastercard', 'PayPal', 'ApplePay', 'GPay'].map((pay) => (
              <div key={pay} className="h-6 w-10 bg-white border border-gray-100 rounded-md flex items-center justify-center text-[8px] font-bold text-gray-300 uppercase">
                {pay}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}