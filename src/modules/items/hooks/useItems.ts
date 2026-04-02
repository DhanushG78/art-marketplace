import { useEffect } from "react";
import { useArtworkStore } from "@/store/useArtworkStore";

export const useItems = () => {
  const { artworks, loading, fetchArtworks } = useArtworkStore();

  useEffect(() => {
    // Only fetch if we don't have items or to refresh
    fetchArtworks();
  }, [fetchArtworks]);

  return { 
    items: artworks, 
    loading, 
    fetchItems: fetchArtworks 
  };
};