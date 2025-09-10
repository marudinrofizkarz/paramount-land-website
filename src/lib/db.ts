// Re-export the database client from database.ts for consistency
export function createClient() {
  return import("./database").then((module) => module.default);
}

// Re-export query functions
export async function query(sql: string, params: any[] = []) {
  const { query } = await import("./database");
  return query(sql, params);
}

export async function getOne(sql: string, params: any[] = []) {
  const { getOne } = await import("./database");
  return getOne(sql, params);
}

export async function getMany(sql: string, params: any[] = []) {
  const { getMany } = await import("./database");
  return getMany(sql, params);
}
