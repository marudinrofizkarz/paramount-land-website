// Helpers untuk serialisasi data database

/**
 * Memastikan data dapat dilewatkan dengan aman dari Server Components ke Client Components
 * dengan mengkonversi objek database ke plain JavaScript object
 */
export function serializeData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Helper untuk memproses objek project dari database
 * - Mengkonversi ke plain JavaScript object
 * - Mem-parsing field JSON seperti galleryImages dan advantages
 */
export function formatProjectData(project: any) {
  if (!project) return null;

  // Pastikan data adalah plain object
  const plainProject = serializeData(project);

  // Parse field JSON
  return {
    ...plainProject,
    galleryImages: JSON.parse((plainProject.galleryImages as string) || "[]"),
    advantages: JSON.parse((plainProject.advantages as string) || "[]"),
  };
}

/**
 * Helper untuk memproses array objek project dari database
 */
export function formatProjectsData(projects: any[]) {
  if (!projects || !Array.isArray(projects)) return [];

  // Pastikan semua item adalah plain objects
  return serializeData(projects);
}
