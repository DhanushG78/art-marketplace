import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Artwork } from "@/types/artwork";
import { 
  getItems, 
  createItem, 
  updateItem, 
  deleteItem 
} from "@/services/itemService";

interface ArtworkStore {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;

  // Actions
  setArtworks: (artworks: Artwork[]) => void;
  fetchArtworks: () => Promise<void>;
  addArtwork: (data: Omit<Artwork, "id" | "createdAt">) => Promise<void>;
  updateArtwork: (id: string, updates: Partial<Artwork>) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;

  getArtistArtworks: (artistId: string) => Artwork[];

  wishlist: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;

  soldStatus: Record<string, boolean>;
  markAsSold: (id: string) => void;
}

export const useArtworkStore = create<ArtworkStore>()(
  persist(
    (set, get) => ({
      artworks: [],
      loading: false,
      error: null,

      setArtworks: (artworks) => set({ artworks }),

      fetchArtworks: async () => {
        set({ loading: true, error: null });
        try {
          const data = await getItems();
          set({ artworks: data, loading: false });
        } catch (err: any) {
          set({ error: err.message || "Failed to fetch artworks", loading: false });
        }
      },

      addArtwork: async (data) => {
        set({ loading: true, error: null });
        try {
          const newItem = await createItem(data);
          set((state) => ({ 
            artworks: [newItem, ...state.artworks], 
            loading: false 
          }));
        } catch (err: any) {
          set({ error: err.message || "Failed to add artwork", loading: false });
          throw err;
        }
      },

      updateArtwork: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          await updateItem({ id, ...updates });
          set((state) => ({
            artworks: state.artworks.map((a) => (a.id === id ? { ...a, ...updates } : a)),
            loading: false,
          }));
        } catch (err: any) {
          set({ error: err.message || "Failed to update artwork", loading: false });
          throw err;
        }
      },

      deleteArtwork: async (id) => {
        set({ loading: true, error: null });
        try {
          await deleteItem(id);
          set((state) => ({
            artworks: state.artworks.filter((a) => a.id !== id),
            loading: false,
          }));
        } catch (err: any) {
          set({ error: err.message || "Failed to delete artwork", loading: false });
          throw err;
        }
      },

      getArtistArtworks: (artistId) => {
        return get().artworks.filter(
          (a) => a.artistId === artistId || a.artistName === artistId
        );
      },

      wishlist: [],
      addToWishlist: (id) =>
        set((state) => ({ wishlist: [...state.wishlist, id] })),
      removeFromWishlist: (id) =>
        set((state) => ({ wishlist: state.wishlist.filter((w) => w !== id) })),

      soldStatus: {},
      markAsSold: (id) =>
        set((state) => ({
          soldStatus: { ...state.soldStatus, [id]: true },
        })),
    }),
    {
      name: "artwork-storage",
      partialize: (state) => ({ wishlist: state.wishlist, soldStatus: state.soldStatus }),
    }
  )
);
