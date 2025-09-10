"use client";

import dynamic from "next/dynamic";

// Load AuthProvider dynamically to avoid SSR issues
const AuthProviderComponent = dynamic(
  () =>
    import("@/components/auth/client-auth-provider").then(
      (mod) => mod.AuthProvider
    ),
  { ssr: false, loading: () => <>{/* Loading state if needed */}</> }
);

export function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProviderComponent>{children}</AuthProviderComponent>;
}
