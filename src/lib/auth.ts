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

// Login function
export async function login(values: z.infer<typeof loginSchema>) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat login. Silakan coba lagi nanti.",
    };
  }
}

// Request password reset function
export async function requestPasswordReset(
  values: z.infer<typeof forgotPasswordSchema>
) {
  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message:
        "Terjadi kesalahan saat request reset password. Silakan coba lagi nanti.",
    };
  }
}

// Reset password function
export async function resetPassword(
  token: string,
  values: z.infer<typeof resetPasswordSchema>
) {
  try {
    const response = await fetch(`/api/auth/reset-password?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message:
        "Terjadi kesalahan saat reset password. Silakan coba lagi nanti.",
    };
  }
}

// Schema validation for registration form
export const registerSchema = z
  .object({
    username: z.string().min(3, { message: "Username minimal 3 karakter" }),
    email: z.string().email({ message: "Email tidak valid" }),
    name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Konfirmasi password minimal 6 karakter" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

// Register function
export async function register(values: z.infer<typeof registerSchema>) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat registrasi. Silakan coba lagi nanti.",
    };
  }
}

// Logout function
export async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat logout. Silakan coba lagi nanti.",
    };
  }
}

// Check authentication status
export async function checkAuth() {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      return { isAuthenticated: false, user: null };
    }

    const data = await response.json();
    return {
      isAuthenticated: data.success,
      user: data.user || null,
    };
  } catch (error) {
    console.error("Auth check error:", error);
    return { isAuthenticated: false, user: null };
  }
}
