export interface Unit {
  id: string;
  name: string;
  slug: string;
  type: string;
  salePrice: string;
  dimensions: string;
  landArea: string;
  buildingArea: string;
  description: string;
  address: string;
  bedrooms?: string;
  bathrooms?: string;
  carports?: string;
  floors?: string;
  facilities?: string;
  certification: string;
  mainImage: string;
  galleryImages?: string[];
  youtubeUrl?: string;
  brochureUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  location: string;
  startingPrice: string;
  mainImage: string;
  galleryImages?: string[];
  youtubeUrl?: string;
  brochureUrl?: string;
  locationAdvantages?: string;
  units: Unit[];
}
