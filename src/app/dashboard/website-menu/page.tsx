import { getWebsiteMenus } from "@/lib/website-menu-actions";
import { WebsiteMenuManagement } from "@/components/website-menu-management";

export default async function WebsiteMenuManagementPage() {
  // Fetch all menus from the server
  const { data = [], success } = await getWebsiteMenus();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <WebsiteMenuManagement initialMenus={data} />
    </div>
  );
}
