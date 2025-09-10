import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Account Authentication | Paramount Land - Building Homes and People with Heart",
  description:
    "Secure sign in and account management for Paramount Land clients and partners.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
