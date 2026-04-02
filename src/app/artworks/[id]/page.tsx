"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { itemService } from "@/modules/items";
import { useArtworkStore } from "@/store/useArtworkStore";
import { useStore } from "@/store/useStore";
import { ItemCard } from "@/components/ui/ItemCard";
import toast from "react-hot-toast";

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);
  
  const { wishlist, addToWishlist, removeFromWishlist } = useArtworkStore();
  const { user } = useStore();
  
  const isWishlisted = wishlist.includes(id as string);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const item = await itemService.getItemById(id as string);
        if (item) {
          setArtwork(item);
          // Fetch related: items from same category or artist
          const allItems = await itemService.getItems();
          setRelated(allItems.filter(i => (i.category === item.category || i.artistName === item.artistName) && i.id !== item.id).slice(0, 4));
        }
      } catch (e) {
        console.error("Failed to load artwork", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-950">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Artwork not found</h1>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(id as string);
      toast.success("Removed from Wishlist");
    } else {
      addToWishlist(id as string);
      toast.success("Added to Wishlist");
    }
  };

  const handleBuy = () => {
    toast("Checkout functionality unavailable at this time.", { icon: "💳" });
  };

  const handleContact = () => {
    toast("Opening mail client...", { icon: "✉️" });
  };

  const imgSrc = Array.isArray(artwork.image) ? artwork.image[0] : (artwork.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        
        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Image */}
          <div className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm group">
            <img 
              src={imgSrc} 
              alt={artwork.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Details */}
          <div className="space-y-8 sticky top-24">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  {artwork.category}
                </span>
                {artwork.isHandmade && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-bold rounded-full">
                    Handmade
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-2">
                {artwork.title}
              </h1>
              
              {artwork.artistName && (
                <Link href={`/artist/${artwork.artistId || encodeURIComponent(artwork.artistName)}`} className="inline-block text-lg font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  By {artwork.artistName}
                </Link>
              )}
            </div>

            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹ {Number(artwork.price).toLocaleString()}
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {artwork.description}
            </p>

            <div className="grid grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              {artwork.medium && (
                <div>
                  <span className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Medium</span>
                  <span className="font-medium text-gray-900 dark:text-white">{artwork.medium}</span>
                </div>
              )}
              {artwork.style && (
                <div>
                  <span className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Style</span>
                  <span className="font-medium text-gray-900 dark:text-white">{artwork.style}</span>
                </div>
              )}
              {artwork.dimensions && (
                <div className="col-span-2">
                  <span className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Dimensions</span>
                  <span className="font-medium text-gray-900 dark:text-white">{artwork.dimensions}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button onClick={handleBuy} className="flex-1 bg-black text-white dark:bg-white dark:text-black font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                Buy Now
              </button>
              <button 
                onClick={handleWishlist} 
                className={`flex-1 font-bold py-4 rounded-xl transition-all border ${
                  isWishlisted 
                    ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-200 text-gray-900 dark:border-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                {isWishlisted ? "♥ Wishlisted" : "♡ Add to Wishlist"}
              </button>
            </div>
            
            <button onClick={handleContact} className="w-full text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Contact Artist for Inquiry
            </button>
          </div>
        </div>

        {/* Related Artworks */}
        {related.length > 0 && (
          <div className="pt-16 border-t border-gray-100 dark:border-gray-900">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Related Artworks</h3>
            <div className="columns-1 sm:columns-2 lg:columns-4 gap-6">
              {related.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
