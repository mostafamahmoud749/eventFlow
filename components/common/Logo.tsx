import Link from 'next/link';
import { Ticket } from 'lucide-react';

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="EventFlow home"
      className="font-heading inline-flex shrink-0 items-center gap-2.5 text-2xl font-extrabold tracking-[-1px]"
    >
      <Ticket className="fill-coral text-coral size-8 -rotate-12 stroke-[1.5]" />
      <span>
        EventFlow<span className="text-coral">.</span>
      </span>
    </Link>
  );
}
