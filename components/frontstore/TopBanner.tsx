import { XMarkIcon } from '@heroicons/react/24/solid';

export default function TopBanner() {
  return (
    <div className="bg-black text-white px-4 py-2.5 flex items-center justify-center relative text-sm font-medium">
      <p>
        Sign up and get 20% off to your first order.{' '}
        <button className="underline hover:text-gray-300 transition-colors">
          Sign Up Now
        </button>
      </p>
      <button className="absolute right-4 text-white/80 hover:text-white transition-colors">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}