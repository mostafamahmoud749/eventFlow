'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, UserRound, Ticket, LayoutDashboard, LogOut } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { DemoContext } from '@/components/common/DemoProvider';

export default function Header() {
  const pathname = usePathname();
  const { data, setData } = useContext(DemoContext);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const links = [
    { href: '/events', label: 'Explore events' },
    { href: '/dashboard/events/new', label: 'Create an event' },
    { href: '/tickets', label: 'My tickets' },
  ];
  if (pathname.startsWith('/dashboard')) return null;

  function closeMenus() {
    setOpen(false);
    setProfileOpen(false);
  }

  return (
    <header className="border-line relative z-40 border-b bg-white">
      <div className="page-container flex h-20 items-center justify-between gap-8">
        <Logo />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-brand whitespace-nowrap text-sm font-medium transition-colors ${pathname.startsWith(link.href) ? 'text-brand' : 'text-muted'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          {data.signedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                className="flex min-h-11 items-center gap-2"
              >
                <span className="bg-mint text-brand flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                  {data.user.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <span className="hidden text-sm font-medium lg:block">
                  {data.user.name.split(' ')[0]}
                </span>
                <ChevronDown className="size-4" />
              </button>
              {profileOpen && (
                <>
                  <button
                    className="fixed inset-0 z-40 cursor-default"
                    aria-label="Close profile menu"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="border-line shadow-card absolute top-14 right-0 z-50 w-56 rounded-xl border bg-white p-2">
                    {[
                      { href: '/profile', label: 'My profile', icon: UserRound },
                      { href: '/tickets', label: 'My tickets', icon: Ticket },
                      { href: '/dashboard', label: 'Organizer workspace', icon: LayoutDashboard },
                    ].map(({ href, label, icon: Icon }) => (
                      <Link
                        onClick={closeMenus}
                        key={href}
                        href={href}
                        className="hover:bg-mint flex items-center gap-3 rounded-lg p-3 text-sm"
                      >
                        <Icon className="size-4" />
                        {label}
                      </Link>
                    ))}
                    <button
                      className="hover:bg-mint flex w-full items-center gap-3 rounded-lg p-3 text-sm"
                      onClick={() => {
                        setData((prev) => ({ ...prev, signedIn: false }));
                        closeMenus();
                      }}
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link href="/login" className="secondary-link">
                Log in
              </Link>
              <Link href="/register" className="primary-link">
                Create account
              </Link>
            </div>
          )}
          <button
            className="hover:bg-mint flex size-11 items-center justify-center rounded-lg lg:hidden"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="border-line border-t bg-white px-5 py-4 lg:hidden"
        >
          {links.map((link) => (
            <Link
              onClick={closeMenus}
              key={link.href}
              href={link.href}
              className="hover:bg-mint block rounded-lg p-3 font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link
            onClick={closeMenus}
            href="/profile"
            className="hover:bg-mint block rounded-lg p-3 font-medium"
          >
            My profile
          </Link>
          {!data.signedIn && (
            <div className="mt-3 flex gap-3">
              <Link onClick={closeMenus} href="/login" className="secondary-link flex-1">
                Log in
              </Link>
              <Link onClick={closeMenus} href="/register" className="primary-link flex-1">
                Create account
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
