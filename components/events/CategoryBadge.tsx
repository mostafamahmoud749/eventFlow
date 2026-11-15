import { Music2, CircleDot, Palette, Drama, Layers } from 'lucide-react';
import type { Category } from '@/types';

export const categoryIcons = {
  Music: Music2,
  Sports: CircleDot,
  Arts: Palette,
  Theatre: Drama,
  Workshops: Layers,
};

type CategoryBadgeProps = { category: Category };

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const Icon = categoryIcons[category];
  return (
    <span className="bg-mint text-brand inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
      <Icon className="size-3.5" />
      {category}
    </span>
  );
}
