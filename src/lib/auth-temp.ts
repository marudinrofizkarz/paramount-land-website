"use client";

import { z } from "zod";

// Schema validation for login form
export const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  remember: z.boolean().optional(),
});

// Schema validation for forgot password form
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
});

// Schema validation for reset password form
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password minimal 6 karakter" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

// Dummy login function for now
export async function login(values: z.infer<typeof loginSchema>) {
  // Add a delay to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For now, just simulate a successful login
  if (values.email === "admin@example.com" && values.password === "admin123") {
    return {
      success: true,
      message: "Login berhasil",
    };
  }

  // Otherwise, return error
  return {
    success: false,
    message: "Email atau password tidak valid",
  };
}

// Dummy forgot password function
export async function requestPasswordReset(
  values: z.infer<typeof forgotPasswordSchema>
) {
  // Add a delay to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For now, just simulate a successful request
  return {
    success: true,
    message: "Jika email terdaftar, instruksi reset password akan dikirimkan",
  };
}

// Dummy reset password function
export async function resetPassword(
  token: string,
  values: z.infer<typeof resetPasswordSchema>
) {
  // Add a delay to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For now, just simulate a successful password reset
  return {
    success: true,
    message: "Password berhasil diubah",
  };
}
