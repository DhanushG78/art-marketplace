import { Artwork } from '@/modules/items';

// In-memory data store for the template.
// Warning: This data will reset whenever the Next.js development server restarts. 
// In production on serverless, this array is ephemeral and will lose data frequently.
// Hook this up to a real database (Postgres, Firebase, MongoDB) for production use.
export let itemsDb: Artwork[] = [
  {
    id: '1',
    artistId: 'system-user',
    createdAt: new Date().toISOString(),
    title: 'Vintage Landscape Painting',
    description: 'A beautiful oil on canvas landscape painting.',
    price: 150.00,
    category: 'painting',
    artistName: 'John Doe',
    medium: 'Oil on Canvas',
    style: 'Realism',
    dimensions: '24x36 inches',
    isHandmade: true,
    image: 'https://via.placeholder.com/600x400?text=Painting',
  },
  {
    id: '2',
    artistId: 'system-user',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    title: 'Modern Abstract Sculpture',
    description: 'Minimalist resin sculpture.',
    price: 999.99,
    category: 'sculpture',
    artistName: 'Jane Smith',
    medium: 'Resin',
    style: 'Abstract',
    dimensions: '10x10x20 inches',
    isHandmade: true,
    image: 'https://via.placeholder.com/600x400?text=Sculpture',
  }
];
