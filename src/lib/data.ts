import type { Project, Unit } from "@/lib/types";
import { slugify } from "@/lib/utils";

let projects: Project[] = [
  {
    id: "1",
    name: "Serene Meadows",
    slug: "serene-meadows",
    description:
      "A tranquil residential community offering a peaceful and luxurious living experience surrounded by lush greenery. Our homes are designed for comfort and elegance, featuring modern amenities and spacious layouts. Come home to serenity.",
    imageUrl: "https://placehold.co/600x400.png",
    location:
      "Jl. Raya Serenity No. 123, BSD City, Tangerang Selatan, Banten 15345",
    startingPrice: "850000000",
    mainImage: "https://placehold.co/600x400.png",
    galleryImages: [
      "https://placehold.co/600x400.png",
      "https://placehold.co/800x600.png",
    ],
    youtubeUrl: "",
    brochureUrl: "",
    locationAdvantages:
      "Strategic location near shopping centers, schools, and hospitals",
    units: [
      {
        id: "1-1",
        name: "2-Bedroom Deluxe Villa",
        slug: "2-bedroom-deluxe-villa",
        type: "residential",
        salePrice: "850000000",
        dimensions: "10m x 15m",
        landArea: "150",
        buildingArea: "120",
        description:
          "A spacious villa perfect for small families with modern amenities and private garden.",
        address: "Block A1, Serene Meadows, BSD City",
        bedrooms: "2",
        bathrooms: "2",
        carports: "1",
        floors: "1",
        facilities: "Private garden, swimming pool access, gym, security 24/7",
        certification: "SHM",
        mainImage: "https://placehold.co/600x400.png",
        galleryImages: ["https://placehold.co/800x600.png"],
        youtubeUrl: "",
        brochureUrl: "",
      },
      {
        id: "1-2",
        name: "3-Bedroom Premium Villa",
        slug: "3-bedroom-premium-villa",
        type: "residential",
        salePrice: "1200000000",
        dimensions: "12m x 20m",
        landArea: "240",
        buildingArea: "180",
        description:
          "An expansive villa with a private garden and premium finishes.",
        address: "Block B2, Serene Meadows, BSD City",
        bedrooms: "3",
        bathrooms: "3",
        carports: "2",
        floors: "2",
        facilities:
          "Private garden, swimming pool, gym, playground, security 24/7",
        certification: "SHM",
        mainImage: "https://placehold.co/600x400.png",
        galleryImages: ["https://placehold.co/800x600.png"],
        youtubeUrl: "",
        brochureUrl: "",
      },
    ],
  },
  {
    id: "2",
    name: "Azure Heights",
    slug: "azure-heights",
    description:
      "Experience city living at its finest in our state-of-the-art residential tower. With breathtaking views and world-class facilities, Azure Heights is the epitome of modern luxury and convenience. Located in the heart of the city.",
    imageUrl: "https://placehold.co/600x400.png",
    location: "Jl. Sudirman No. 789, Senayan, Jakarta Pusat, DKI Jakarta 10270",
    startingPrice: "1250000000",
    mainImage: "https://placehold.co/600x400.png",
    galleryImages: [
      "https://placehold.co/600x400.png",
      "https://placehold.co/800x600.png",
    ],
    youtubeUrl: "",
    brochureUrl: "",
    locationAdvantages:
      "Prime location in Jakarta business district with easy access to MRT",
    units: [
      {
        id: "2-1",
        name: "1-Bedroom Modern Apartment",
        slug: "1-bedroom-modern-apartment",
        type: "residential",
        salePrice: "1250000000",
        dimensions: "5m x 10m",
        landArea: "50",
        buildingArea: "45",
        description:
          "A cozy apartment with a stunning city view and modern finishes.",
        address: "Floor 15, Tower A, Azure Heights, Sudirman",
        bedrooms: "1",
        bathrooms: "1",
        carports: "1",
        floors: "1",
        facilities:
          "City view, swimming pool, gym, concierge service, sky lounge",
        certification: "SHGB",
        mainImage: "https://placehold.co/600x400.png",
        galleryImages: ["https://placehold.co/800x600.png"],
        youtubeUrl: "",
        brochureUrl: "",
      },
      {
        id: "2-2",
        name: "Penthouse Luxury Suite",
        slug: "penthouse-luxury-suite",
        type: "residential",
        salePrice: "5000000000",
        dimensions: "15m x 25m",
        landArea: "375",
        buildingArea: "300",
        description:
          "The pinnacle of luxury with panoramic views and premium amenities.",
        address: "Penthouse Floor, Tower A, Azure Heights, Sudirman",
        bedrooms: "3",
        bathrooms: "3",
        carports: "2",
        floors: "2",
        facilities:
          "Panoramic city view, private pool, gym, concierge, sky lounge, helipad access",
        certification: "SHGB",
        mainImage: "https://placehold.co/600x400.png",
        galleryImages: ["https://placehold.co/800x600.png"],
        youtubeUrl: "",
        brochureUrl: "",
      },
    ],
  },
];

// Simulate a database delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProjects(): Promise<Project[]> {
  await delay(100);
  return projects;
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  await delay(100);
  return projects.find((p) => p.slug === slug);
}

export async function addProject(
  projectData: Omit<Project, "id" | "units"> & { galleryImages?: string[] }
): Promise<Project> {
  await delay(100);
  const newProject: Project = {
    id: Date.now().toString(),
    ...projectData,
    imageUrl: projectData.mainImage || "https://placehold.co/600x400.png",
    galleryImages: projectData.galleryImages || [],
    units: [],
  };
  projects.push(newProject);
  return newProject;
}

export async function addUnitToProject(
  projectSlug: string,
  unitData: Omit<Unit, "id">
): Promise<Unit | null> {
  await delay(100);
  const project = projects.find((p) => p.slug === projectSlug);
  if (!project) {
    return null;
  }
  const newUnit: Unit = {
    id: `${project.id}-${Date.now()}`,
    ...unitData,
  };
  project.units.push(newUnit);
  return newUnit;
}
