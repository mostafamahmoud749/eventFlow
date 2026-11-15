import Link from 'next/link';
import { Ticket } from 'lucide-react';

type EmptyStateProps = { title: string; description: string; href?: string; label?: string };

export default function EmptyState({ title, description, href, label }: EmptyStateProps) {
  return (
    <div className="border-line rounded-xl border border-dashed bg-white px-6 py-16 text-center">
      <div className="bg-mint text-brand mx-auto mb-5 flex size-14 items-center justify-center rounded-full">
        <Ticket className="size-6" />
      </div>
      <h2 className="text-2xl">{title}</h2>
      <p className="text-muted mx-auto mt-3 max-w-md">{description}</p>
      {href && (
        <Link href={href} className="primary-link mt-6">
          {label}
        </Link>
      )}
    </div>
  );
}
