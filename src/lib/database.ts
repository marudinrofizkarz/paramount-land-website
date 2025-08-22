import { createClient } from "@libsql/client";
import { DATABASE_CONFIG } from "./env-config";

// Validate database configuration
if (!DATABASE_CONFIG.url && process.env.NODE_ENV === "production") {
  throw new Error(
    "❌ TURSO_DATABASE_URL is required for production deployment"
  );
}

if (!DATABASE_CONFIG.authToken && process.env.NODE_ENV === "production") {
  throw new Error("❌ TURSO_AUTH_TOKEN is required for production deployment");
}

// Buat koneksi ke database Turso
const db = createClient({
  url: DATABASE_CONFIG.url,
  authToken: DATABASE_CONFIG.authToken,
});

export default db;

// Utility function to serialize data for client components
export function serializeData(data: any) {
  return JSON.parse(JSON.stringify(data));
}

// Fungsi helper untuk menjalankan query
export async function query(sql: string, params: any[] = []) {
  try {
    const result = await db.execute({ sql, args: params });
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Fungsi helper untuk mendapatkan data tunggal
export async function getOne(sql: string, params: any[] = []) {
  const result = await query(sql, params);
  const data = result.rows[0] || null;
  return data ? serializeData(data) : null;
}

// Fungsi helper untuk mendapatkan banyak data
export async function getMany(sql: string, params: any[] = []) {
  const result = await query(sql, params);
  return serializeData(result.rows);
}

// Fungsi helper untuk melakukan insert
export async function insert(sql: string, params: any[] = []) {
  const result = await query(sql, params);
  return serializeData(result);
}

// Fungsi helper untuk melakukan update
export async function update(sql: string, params: any[] = []) {
  const result = await query(sql, params);
  return serializeData(result);
}

// Fungsi helper untuk melakukan delete
export async function remove(sql: string, params: any[] = []) {
  const result = await query(sql, params);
  return serializeData(result);
}
