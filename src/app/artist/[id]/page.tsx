"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { itemService } from "@/modules/items";
import { ItemCard } from "@/components/ui/ItemCard";

export default function ArtistProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const decodedId = decodeURIComponent(id as string || "");

  useEffect(() => {
    async function loadData() {
      if (!decodedId) return;
      setLoading(true);
      try {
        const allItems = await itemService.getItems();
        // Match artistId or artistName depending on what was passed
        const artistItems = allItems.filter(i => i.artistId === decodedId || i.artistName === decodedId);
        setArtworks(artistItems);
      } catch (e) {
        console.error("Failed to load artworks", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [decodedId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Find the exact artist name to display.
  const artistNameDisplay = artworks.length > 0 && artworks[0].artistName 
    ? artworks[0].artistName 
    : decodedId;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-6 py-16 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Artist Header */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-md ring-4 ring-white dark:ring-gray-900">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(artistNameDisplay)}&background=random&size=256`}
              alt={artistNameDisplay} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col items-center md:items-start flex-1 text-center md:text-left space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              {artistNameDisplay}
            </h1>
            
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              Mixed Media Artist & Creator based in New York. Exploring the boundaries between abstract concepts and hyperrealism through multiple traditional mediums.
            </p>
            
            <div className="flex gap-4 pt-2">
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl flex flex-col items-center md:items-start border border-gray-100 dark:border-gray-700">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Artworks</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">{artworks.length}</span>
              </div>
              <button onClick={() => alert("Contact dummy action")} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-sm hover:shadow-md">
                Contact Artist
              </button>
            </div>
          </div>
        </div>

        {/* Artist Portfolio */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Collection</h2>
          </div>

          {artworks.length === 0 ? (
             <div className="py-24 flex flex-col items-center justify-center w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm text-center px-4">
               <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No artworks found</h3>
               <p className="text-gray-500 dark:text-gray-400">This artist hasn't listed any pieces yet.</p>
             </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {artworks.map((item: any) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
