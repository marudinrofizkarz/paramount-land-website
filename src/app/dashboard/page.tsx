import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { DashboardOverview } from '@/features/dashboard/components/dashboard-overview';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Paramount Land',
  description: 'Dashboard overview for Paramount Land property management'
};

export default async function Dashboard() {
  const user = await getServerUser();

  if (!user) {
    redirect('/auth/login');
    return;
  }
  
  return <DashboardOverview />;
}
