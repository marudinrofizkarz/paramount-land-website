"use server";

import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Import schemas from separate file
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  registerSchema,
} from "./schemas";

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
function generateToken(user: any) {
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
export async function loginUser(
  email: string,
  password: string,
  remember = false
) {
  try {
    const client = getDbClient();

    // Cari user berdasarkan email
    const result = await client.execute({
      sql: "SELECT * FROM Users WHERE email = ?",
      args: [email],
    });

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Email atau password tidak valid",
      };
    }

    const user = result.rows[0];

    // Verifikasi password
    const userPassword = user.password as string;
    const passwordMatch = await bcrypt.compare(password, userPassword);
    if (!passwordMatch) {
      return {
        success: false,
        message: "Email atau password tidak valid",
      };
    }

    // Generate token JWT
    const token = generateToken(user);

    // Return success with token
    return {
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
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

// Fungsi untuk request password reset
export async function requestPasswordReset(email: string) {
  try {
    const client = getDbClient();

    // Cari user berdasarkan email
    const result = await client.execute({
      sql: "SELECT * FROM Users WHERE email = ?",
      args: [email],
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
export async function registerUser(values: {
  username: string;
  email: string;
  name: string;
  password: string;
}) {
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
        avatar_url: null,
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

// Fungsi untuk verify token reset password
export async function verifyResetToken(token: string) {
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
export async function resetUserPassword(token: string, password: string) {
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

// Fungsi untuk verifikasi token JWT
export async function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET || "dev-secret-key";
    const decoded = jwt.verify(token, secret) as {
      sub: string;
      name: string;
      email: string;
      username: string;
      role: string;
      iat: number;
      exp: number;
    };

    // Get fresh user data from database including avatar_url
    const client = getDbClient();
    const result = await client.execute({
      sql: "SELECT id, name, email, username, role, avatar_url FROM Users WHERE id = ?",
      args: [decoded.sub],
    });

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "User tidak ditemukan",
      };
    }

    const user = result.rows[0];

    return {
      success: true,
      user: {
        id: user.id as string,
        name: user.name as string,
        email: user.email as string,
        username: user.username as string,
        role: user.role as string,
        avatar_url: user.avatar_url as string,
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

export async function getServerUser() {
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const result = await verifyToken(token);
  return result.success ? result.user : null;
}
