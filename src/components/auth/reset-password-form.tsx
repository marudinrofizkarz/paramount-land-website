"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Using schema from auth.ts

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Verify token when component mounts - simplified for now
  useState(() => {
    // Simulate token verification
    setTimeout(() => {
      setEmail("user@example.com"); // Just a placeholder
      setIsVerifying(false);
    }, 1000);
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    try {
      setIsLoading(true);
      setError(null);

      // Import dynamically to avoid issues
      const { resetPassword } = await import("@/lib/auth");
      const response = await resetPassword(token, data);

      if (response.success) {
        setIsSuccess(true);
        toast({
          title: "Password berhasil diubah",
          description: "Silakan login dengan password baru Anda",
        });
      } else {
        setError(response.message || "Gagal reset password");
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi nanti.");
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Show loading state while verifying token
  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memverifikasi token...</p>
      </div>
    );
  }

  // Show error if token is invalid
  if (error && !isSuccess) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription className="flex flex-col space-y-4">
          <p>{error}</p>
          <Button
            size="sm"
            onClick={() => router.push("/auth/forgot-password")}
          >
            Coba Reset Password Lagi
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-6">
      {isSuccess ? (
        <div className="rounded-lg border border-muted p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Password Berhasil Diubah</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Password Anda telah berhasil diubah. Silakan login dengan password
            baru Anda.
          </p>
          <Button className="mt-2" onClick={() => router.push("/auth/login")}>
            Masuk
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {email && (
              <Alert className="mb-4">
                <AlertDescription>
                  Reset password untuk: <strong>{email}</strong>
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
