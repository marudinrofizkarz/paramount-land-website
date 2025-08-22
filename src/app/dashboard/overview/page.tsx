import { Metadata } from 'next';
import { DashboardOverview } from '@/features/dashboard/components/dashboard-overview';

export const metadata: Metadata = {
  title: 'Dashboard Overview | Paramount Land',
  description: 'Overview dashboard for Paramount Land property management'
};

export default function DashboardOverviewPage() {
  return <DashboardOverview />;
} 