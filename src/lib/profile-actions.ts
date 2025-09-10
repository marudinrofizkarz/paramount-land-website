"use server";

import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Database client
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

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    avatar_url?: string;
  }
) {
  try {
    const client = getDbClient();

    // Build dynamic query based on provided fields
    const updateFields: string[] = [];
    const values: any[] = [];

    if (data.name) {
      updateFields.push("name = ?");
      values.push(data.name);
    }

    if (data.username) {
      // Check if username already exists for other users
      const usernameCheck = await client.execute({
        sql: "SELECT id FROM Users WHERE username = ? AND id != ?",
        args: [data.username, userId],
      });

      if (usernameCheck.rows.length > 0) {
        return {
          success: false,
          message: "Username sudah digunakan oleh user lain",
        };
      }

      updateFields.push("username = ?");
      values.push(data.username);
    }

    if (data.email) {
      // Check if email already exists for other users
      const emailCheck = await client.execute({
        sql: "SELECT id FROM Users WHERE email = ? AND id != ?",
        args: [data.email, userId],
      });

      if (emailCheck.rows.length > 0) {
        return {
          success: false,
          message: "Email sudah digunakan oleh user lain",
        };
      }

      updateFields.push("email = ?");
      values.push(data.email);
    }

    if (data.password) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      updateFields.push("password = ?");
      values.push(hashedPassword);
    }

    if (data.avatar_url !== undefined) {
      updateFields.push("avatar_url = ?");
      values.push(data.avatar_url);
    }

    if (updateFields.length === 0) {
      return {
        success: false,
        message: "Tidak ada data yang diupdate",
      };
    }

    // Add updated_at and user id
    updateFields.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(userId);

    const sql = `UPDATE Users SET ${updateFields.join(", ")} WHERE id = ?`;

    await client.execute({
      sql,
      args: values,
    });

    // Get updated user data
    const updatedUser = await client.execute({
      sql: "SELECT id, name, email, username, role, avatar_url FROM Users WHERE id = ?",
      args: [userId],
    });

    if (updatedUser.rows.length === 0) {
      return {
        success: false,
        message: "User tidak ditemukan setelah update",
      };
    }

    const user = updatedUser.rows[0];

    // Revalidate relevant paths
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profile berhasil diperbarui",
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
    console.error("Update profile error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat memperbarui profile",
    };
  }
}

export async function uploadAvatarToCloudinary(imageFile: File) {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      process.env.CLOUDINARY_UPLOAD_PRESET || ""
    );
    formData.append("folder", "avatars");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();

    return {
      success: true,
      url: data.secure_url,
      public_id: data.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      message: "Failed to upload image",
    };
  }
}
