import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Paramount Land",
  description: "Login to your Paramount Land admin account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-900/90 sm:p-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Link
            href="/"
            className="mb-4 transition-transform duration-200 hover:scale-105"
            aria-label="Go to homepage"
          >
            <Image
              src="/images/paramount-logo-light.png"
              alt="Paramount Land Logo"
              width={160}
              height={45}
              className="h-10 w-auto dark:hidden"
              priority
            />
            <Image
              src="/images/paramount-logo-dark.png"
              alt="Paramount Land Logo"
              width={160}
              height={45}
              className="hidden h-10 w-auto dark:block"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard Login
          </h1>
          <p className="text-muted-foreground text-sm">
            Masukkan email dan password untuk mengakses dashboard
          </p>
        </div>

        <div className="grid gap-6">
          <LoginForm />
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Paramount Land. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
