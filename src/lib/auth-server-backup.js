"use server";

import { cookies } from "next/headers";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  registerSchema,
} from "./auth-schemas";

// Konfigurasi database
function getDbClient() {
  const dbUrl = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    throw new Error("DATABASE_URL dan DATABASE_AUTH_TOKEN harus diisi di .env");
  }

  return createClient({
    url: dbUrl,
    authToken: authToken,
  });
}

// Fungsi untuk membuat JWT token
function generateToken(user) {
  const secret = process.env.JWT_SECRET || "dev-secret-key";

  return jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    secret,
    { expiresIn: "1d" }
  );
}

// Fungsi login yang sebenarnya
export async function login(values) {
  try {
    const client = getDbClient();

    // Cari user berdasarkan email
    const result = await client.execute({
      sql: "SELECT * FROM Users WHERE email = ?",
      args: [values.email],
    });

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Email atau password tidak valid",
      };
    }

    const user = result.rows[0];

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(values.password, user.password);
    if (!passwordMatch) {
      return {
        success: false,
        message: "Email atau password tidak valid",
      };
    }

    // Generate token JWT
    const token = generateToken(user);

    // Set cookie untuk autentikasi
    const cookieStore = cookies();

    cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: values.remember ? 7 * 24 * 60 * 60 : 24 * 60 * 60, // 7 days or 1 day
    });

    // Return success
    return {
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat login. Silahkan coba lagi nanti.",
    };
  }
}

// Fungsi untuk verify token reset password
export async function verifyResetToken(token) {
  try {
    const client = getDbClient();

    // Cari token reset password
    const result = await client.execute({
      sql: "SELECT * FROM PasswordResets WHERE token = ? AND expires_at > ?",
      args: [token, new Date().toISOString()],
    });

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Token reset password tidak valid atau sudah kadaluarsa",
      };
    }

    return {
      success: true,
      userId: result.rows[0].user_id,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat verifikasi token",
    };
  }
}

// Fungsi untuk reset password
export async function resetUserPassword(token, password) {
  try {
    // Verifikasi token
    const verification = await verifyResetToken(token);

    if (!verification.success || !verification.userId) {
      return verification;
    }

    const client = getDbClient();

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password user
    await client.execute({
      sql: "UPDATE Users SET password = ?, updated_at = ? WHERE id = ?",
      args: [hashedPassword, new Date().toISOString(), verification.userId],
    });

    // Hapus token yang sudah digunakan
    await client.execute({
      sql: "DELETE FROM PasswordResets WHERE token = ?",
      args: [token],
    });

    return {
      success: true,
      message: "Password berhasil diubah",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat reset password",
    };
  }
}

// Fungsi untuk request password reset
export async function requestPasswordReset(values) {
  try {
    const client = getDbClient();

    // Cari user berdasarkan email
    const result = await client.execute({
      sql: "SELECT * FROM Users WHERE email = ?",
      args: [values.email],
    });

    if (result.rows.length === 0) {
      // Untuk keamanan, tetap return success meskipun email tidak ditemukan
      return {
        success: true,
        message:
          "Jika email terdaftar, instruksi reset password akan dikirimkan",
      };
    }

    const user = result.rows[0];

    // Generate token reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token valid selama 1 jam

    // Hapus token lama jika ada
    await client.execute({
      sql: "DELETE FROM PasswordResets WHERE user_id = ?",
      args: [user.id],
    });

    // Simpan token baru
    await client.execute({
      sql: "INSERT INTO PasswordResets (user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?)",
      args: [
        user.id,
        resetToken,
        expiresAt.toISOString(),
        new Date().toISOString(),
      ],
    });

    // Di implementasi sesungguhnya, kita akan mengirim email dengan link reset password
    // Untuk contoh ini, kita hanya return success
    return {
      success: true,
      message: "Instruksi reset password telah dikirim ke email Anda",
      // Dalam implementasi riil, jangan kembalikan token seperti ini
      // Ini hanya untuk demo
      resetToken,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat request reset password",
    };
  }
}



// Fungsi register yang sebenarnya
export async function register(values) {
  try {
    const client = getDbClient();

    // Cek username
    const usernameCheck = await client.execute({
      sql: "SELECT username FROM Users WHERE username = ?",
      args: [values.username],
    });

    if (usernameCheck.rows.length > 0) {
      return {
        success: false,
        message: "Username sudah digunakan",
      };
    }

    // Cek email
    const emailCheck = await client.execute({
      sql: "SELECT email FROM Users WHERE email = ?",
      args: [values.email],
    });

    if (emailCheck.rows.length > 0) {
      return {
        success: false,
        message: "Email sudah terdaftar",
      };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(values.password, salt);

    // Generate user ID
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert user baru
    await client.execute({
      sql: `
        INSERT INTO Users 
        (id, username, email, password, name, role, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        userId,
        values.username,
        values.email,
        hashedPassword,
        values.name,
        "user", // Default role
        now,
        now,
      ],
    });

    return {
      success: true,
      message: "Registrasi berhasil",
      user: {
        id: userId,
        username: values.username,
        email: values.email,
        name: values.name,
        role: "user",
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat registrasi",
    };
  }
}

// Fungsi untuk logout
export async function logout() {
  const cookieStore = cookies();

  // Hapus cookie autentikasi
  cookieStore.delete("auth_token");

  return {
    success: true,
    message: "Logout berhasil",
  };
}

// Fungsi untuk mendapatkan user saat ini (bisa digunakan di middleware)
export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = process.env.JWT_SECRET || "dev-secret-key";
    const decoded = jwt.verify(token, secret);

    return {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// Fungsi untuk memeriksa apakah user sudah login
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}

// Fungsi untuk memeriksa apakah user memiliki role tertentu
export async function hasRole(roles) {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }

  return user.role === roles;
}

// Fungsi untuk verifikasi token JWT
export async function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET || "dev-secret-key";
    const decoded = jwt.verify(token, secret);

    return {
      success: true,
      user: {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
      },
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      success: false,
      message: "Token tidak valid atau sudah kadaluarsa",
    };
  }
}

// Fungsi untuk redirect user yang tidak memiliki autentikasi
export async function requireAuth() {
  const isLoggedIn = await isAuthenticated();

  if (!isLoggedIn) {
    return { redirect: { destination: "/auth/login", permanent: false } };
  }

  return { props: {} };
}
