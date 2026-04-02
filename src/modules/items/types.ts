export interface Artwork {
  id: string;
  artistId: string;
  createdAt: string;
  title: string;
  price: number;
  description: string;
  category: "painting" | "sculpture" | "craft" | "digital" | "photography";
  artistName: string;
  medium: string;
  style: string;
  dimensions: string;
  isHandmade: boolean;
  image: string;
  // Catch-all for any dynamic attributes defined in appConfig.entityFields
  [key: string]: any; 
}

// Filters that could be passed to the service/hook
export interface ArtworkFilters {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  artistId?: string;
  attributes?: Record<string, string | number | boolean>;
}
