import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Lupa Password | Paramount Land",
  description: "Reset password akun Paramount Land Anda",
};

export default function ForgotPasswordPage() {
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
              className="h-12 w-auto dark:hidden"
              priority
            />
            <Image
              src="/images/paramount-logo-dark.png"
              alt="Paramount Land Logo"
              width={160}
              height={45}
              className="hidden h-12 w-auto dark:block"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Lupa Password
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs">
            Masukkan email Anda dan kami akan mengirimkan link untuk reset
            password
          </p>
        </div>

        <div className="grid gap-6">
          <ForgotPasswordForm />
        </div>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Ingat password Anda?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:text-primary/80 hover:underline transition-colors"
            >
              Kembali ke login
            </Link>
          </p>
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
