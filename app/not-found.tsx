import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-container py-24 text-center">
      <p className="font-heading text-brand/20 text-7xl font-extrabold">404</p>
      <h1 className="mt-6 text-4xl">A little off the beaten track.</h1>
      <p className="text-muted mx-auto mt-4 max-w-md leading-7">
        We couldn’t find that page, but there’s still a whole city of experiences waiting for you.
      </p>
      <Link href="/events" className="primary-link mt-7">
        Explore events <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
