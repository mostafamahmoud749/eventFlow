import type { ReactNode } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
export const metadata = { title: 'Organizer workspace' };
export default function OrganizerLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
