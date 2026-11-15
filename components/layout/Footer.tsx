'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard')) return null;
  return (
    <footer className="border-line mt-auto border-t bg-white">
      <div className="page-container">
        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="text-muted mt-4 max-w-64 text-sm leading-6">
              Good plans. Great people.
              <br />
              Unforgettable moments.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm">Discover</h3>
            <Link className="text-muted hover:text-brand mb-3 block text-sm" href="/events">
              Explore events
            </Link>
            <Link
              className="text-muted hover:text-brand mb-3 block text-sm"
              href="/events?category=Music"
            >
              Live music
            </Link>
            <Link
              className="text-muted hover:text-brand block text-sm"
              href="/events?category=Workshops"
            >
              Try something new
            </Link>
          </div>
          <div>
            <h3 className="mb-4 text-sm">Bring people together</h3>
            <Link
              className="text-muted hover:text-brand mb-3 block text-sm"
              href="/dashboard/events/new"
            >
              Create an event <ArrowUpRight className="inline size-3" />
            </Link>
            <Link className="text-muted hover:text-brand block text-sm" href="/dashboard">
              Organizer workspace
            </Link>
          </div>
          <div>
            <h3 className="mb-4 text-sm">Your EventFlow</h3>
            <Link className="text-muted hover:text-brand mb-3 block text-sm" href="/tickets">
              My tickets
            </Link>
            <Link className="text-muted hover:text-brand mb-3 block text-sm" href="/profile">
              My profile
            </Link>
            <span className="bg-mint text-brand rounded-full px-3 py-1 text-xs font-medium">
              Frontend demo
            </span>
          </div>
        </div>
        <div className="border-line text-muted flex flex-col justify-between gap-3 border-t py-6 text-xs sm:flex-row">
          <p>© 2026 EventFlow. Made for moments that matter.</p>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            Cairo, Egypt · EGP
          </span>
        </div>
      </div>
    </footer>
  );
}
