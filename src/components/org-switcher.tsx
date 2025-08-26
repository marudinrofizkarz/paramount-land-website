"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface Tenant {
  id: string;
  name: string;
}

export function OrgSwitcher({
  tenants,
  defaultTenant,
  onTenantSwitch,
}: {
  tenants: Tenant[];
  defaultTenant: Tenant;
  onTenantSwitch?: (tenantId: string) => void;
}) {
  const [selectedTenant, setSelectedTenant] = React.useState<
    Tenant | undefined
  >(defaultTenant || (tenants.length > 0 ? tenants[0] : undefined));
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/images/paramount-logo-light.png");
  const [isMounted, setIsMounted] = useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setLogoSrc(
        resolvedTheme === "dark"
          ? "/images/paramount-logo-dark.png"
          : "/images/paramount-logo-light.png"
      );
    }
  }, [resolvedTheme, isMounted]);

  if (!selectedTenant) {
    return null;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="flex items-center justify-center">
            {isCollapsed ? (
              <img
                src="/images/logo_xhylzg.jpg"
                alt="Paramount Land icon"
                className="h-8 w-8 rounded-md object-contain"
              />
            ) : (
              <img src={logoSrc} alt="Paramount Land logo" className="h-8" />
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
