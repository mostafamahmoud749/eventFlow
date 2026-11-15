'use client';

import { useContext, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  House,
  Menu,
  Plus,
  Settings,
  Ticket,
  X,
  AudioLines,
} from 'lucide-react';
import Logo from '@/components/common/Logo';
import { DemoContext } from '@/components/common/DemoProvider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname().replace(/\/$/, '');
  const { data } = useContext(DemoContext);
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Overview', href: '/dashboard', icon: House },
    { label: 'My events', href: '/dashboard/events', icon: CalendarDays },
    { label: 'Reservations', href: '/dashboard/reservations', icon: Ticket },
    { label: 'Organization settings', href: '/dashboard/settings', icon: Settings },
  ];
  const active = links.find(
    (link) =>
      pathname === link.href ||
      (link.href !== '/dashboard' && pathname.startsWith(`${link.href}/`)),
  );
  return (
    <div className="min-h-screen lg:pl-64">
      {open && (
        <button
          aria-label="Close organizer menu"
          className="bg-ink/30 fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`border-line fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto border-r bg-white p-5 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-12 items-center justify-between">
          <Logo />
          <button
            className="lg:hidden"
            aria-label="Close organizer menu"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="border-line mt-8 mb-6 flex items-center gap-3 rounded-lg border p-3">
          <div className="bg-ink flex size-9 items-center justify-center rounded-lg text-white">
            <AudioLines className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{data.organization.name}</p>
            <p className="text-muted mt-0.5 text-xs">Organizer workspace</p>
          </div>
        </div>
        <Link
          href="/dashboard/events/new"
          onClick={() => setOpen(false)}
          className="primary-link mb-5 w-full"
        >
          <Plus className="size-4" />
          Create an event
        </Link>
        <nav aria-label="Organizer navigation" className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={active?.href === href ? 'page' : undefined}
              className={`flex min-h-12 items-center gap-3 rounded-lg px-3 py-3 text-sm ${active?.href === href ? 'bg-mint text-brand font-semibold' : 'text-muted hover:bg-canvas'}`}
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-10">
          <Link
            href="/"
            className="text-muted hover:text-brand mb-5 flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="size-4" />
            Back to exploring
          </Link>
          <Link href="/profile" className="border-line flex items-center gap-3 border-t pt-5">
            <span className="bg-mint text-brand flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
              {data.user.name
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{data.user.name}</p>
              <p className="text-muted mt-1 text-[11px]">Personal account</p>
            </div>
          </Link>
        </div>
      </aside>
      <header className="border-line flex h-20 items-center justify-between gap-4 border-b bg-white px-5 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open organizer menu"
            onClick={() => setOpen(true)}
            className="border-line flex size-11 items-center justify-center rounded-lg border lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <p className="text-muted flex items-center gap-2 text-sm">
            <span className="hidden sm:inline">{data.organization.name}</span>
            <ChevronRight className="hidden size-3 sm:inline" />
            <span className="text-ink font-medium">{active?.label || 'Overview'}</span>
          </p>
        </div>
        <span className="bg-mint text-brand rounded-full px-3 py-1.5 text-xs font-medium">
          Demo workspace
        </span>
      </header>
      <div className="mx-auto max-w-[1380px] p-5 py-8 lg:p-10">{children}</div>
    </div>
  );
}
