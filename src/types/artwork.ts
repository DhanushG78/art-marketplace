export type Artwork = {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  description: string;
  price: number;
  category: string;
  medium: string;
  style: string;
  dimensions: string;
  isHandmade: boolean;
  image: string | string[];
  createdAt: string;
};
