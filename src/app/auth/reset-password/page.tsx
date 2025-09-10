import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | Paramount Land",
  description: "Reset password akun Paramount Land Anda",
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="mb-6">
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
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground text-sm">
            Masukkan password baru untuk akun Anda
          </p>
        </div>

        <div className="grid gap-6">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="text-center">
              <p className="text-sm text-red-500 mb-4">
                Token reset password tidak ditemukan
              </p>
              <Link
                href="/auth/forgot-password"
                className="text-primary hover:underline text-sm"
              >
                Kembali ke halaman lupa password
              </Link>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-sm">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Paramount Land. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
