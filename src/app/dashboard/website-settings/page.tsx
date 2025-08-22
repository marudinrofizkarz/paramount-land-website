import { Metadata } from 'next';
import { getWebsiteSettings } from '@/lib/website-settings-actions';
import { WebsiteSettingsManagement } from '@/components/website-settings-management';

export const metadata: Metadata = {
  title: 'Website Settings | Dashboard',
  description: 'Manage website settings, logos, contact information, and SEO settings'
};

export default async function WebsiteSettingsPage() {
  const { data: settings, success } = await getWebsiteSettings();

  if (!success || !settings) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground">Failed to load website settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <WebsiteSettingsManagement initialSettings={settings} />
    </div>
  );
}