import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In | Paramount Land",
  description: "Sign in to your Paramount Land account.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mb-8">
        <Link href="/">
          <Image
            src="/images/logo_xhylzg.jpg"
            alt="Paramount Land Logo"
            width={120}
            height={120}
            className="h-auto w-auto max-h-[40px] object-contain"
          />
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold">Admin Dashboard Login</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your credentials to access the dashboard
          </p>
        </div>
        <SignIn
          routing="hash"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-sm border border-border rounded-lg",
              header: "hidden",
              footer: "hidden",
              // Hide development badge if it exists
              developmentBadge: "hidden",
              // Hide test badge if it exists
              testBadge: "hidden",
              // Hide any other potential banners or warnings
              alert: "hidden",
              // Sembunyikan tombol social login
              socialButtonsIconButton: "hidden",
              // Sembunyikan "OR" divider
              dividerRow: "hidden",
              // Sembunyikan link sign up
              footerActionLink: "hidden",
            },
            layout: {
              showOptionalFields: false,
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "iconButton",
            },
            variables: {
              borderRadius: "0.5rem",
              colorBackground: "white",
              colorPrimary: "rgb(63 131 248)",
            },
          }}
        />
      </div>
    </div>
  );
}
