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

// Schema validation for register form
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