"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { forgotPasswordSchema } from "@/lib/auth";
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
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion"; // Pastikan framer-motion sudah diinstal

// Using the schema from auth.ts

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      // Import dynamically to avoid issues
      const { requestPasswordReset } = await import("@/lib/auth");
      const response = await requestPasswordReset(data);

      if (response.success) {
        setIsSuccess(true);
        toast({
          title: "Reset password berhasil",
          description: "Silakan cek email Anda untuk petunjuk selanjutnya",
        });

        // In a real application, you would send an email here
        // For this example, we'll just show a success message
      } else {
        setError(response.message || "Gagal mengirim reset password");
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi nanti.");
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      {error && (
        <Alert variant="destructive" className="animate-fadeIn">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border border-muted bg-muted/10 p-6 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-800/30">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
          </div>
          <h3 className="mb-2 text-xl font-medium">Email Terkirim</h3>
          <p className="mb-6 text-muted-foreground">
            Kami telah mengirimkan instruksi reset password ke email Anda.
            Silakan cek kotak masuk atau folder spam.
          </p>
          <Button
            variant="outline"
            className="mt-2 transition-all duration-200 hover:bg-primary hover:text-white"
            onClick={() => router.push("/auth/login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Login
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="yourname@example.com"
                          className="pl-10 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium transition-all duration-200 hover:opacity-90 hover:shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    <span>Kirim Link Reset Password</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      )}
    </div>
  );
}
