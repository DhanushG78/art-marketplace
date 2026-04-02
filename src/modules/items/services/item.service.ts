import { ArtworkFilters } from '../types';
import { useArtworkStore } from '@/store/useArtworkStore';
import { Artwork } from '@/types/artwork';

/**
 * A generic CRUD service for the marketplace entity.
 * Uses Zustand persistence to simulate a real database natively.
 */
export const itemService = {
  /**
   * Fetch all items, optionally filtered
   */
  async getItems(filters?: ArtworkFilters): Promise<Artwork[]> {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate UI loading
    
    let results = useArtworkStore.getState().artworks;
    
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter((item) => 
        item.title.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      );
    }
    
    return results;
  },

  /**
   * Fetch a single item by ID
   */
  async getItemById(id: string): Promise<Artwork | null> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return useArtworkStore.getState().artworks.find((item) => item.id === id) || null;
  },

  /**
   * Create a new item listing
   */
  async createItem(itemData: Omit<Artwork, 'id' | 'createdAt'>): Promise<Artwork> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const store = useArtworkStore.getState();
    const newItem: Artwork = {
      ...itemData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    } as Artwork;
    
    store.setArtworks([...store.artworks, newItem]);
    
    return newItem;
  },

  /**
   * Update an existing item
   */
  async updateItem(id: string, updates: Partial<Artwork>): Promise<Artwork> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const store = useArtworkStore.getState();
    const currentList = store.artworks;
    
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Item not found');
    
    const updatedList = [...currentList];
    updatedList[index] = { ...updatedList[index], ...updates };
    
    store.setArtworks(updatedList);
    
    return updatedList[index];
  },

  /**
   * Delete an item
   */
  async deleteItem(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const store = useArtworkStore.getState();
    store.setArtworks(store.artworks.filter((item) => item.id !== id));
  }
};
