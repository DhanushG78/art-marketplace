"use client";

import { appConfig } from "@/config/appConfig";
import { deleteItem } from "@/services/itemService";
import Link from "next/link";
import { useArtworkStore } from "@/store/useArtworkStore";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  item: Record<string, any>;
  onEdit?: (item: any) => void;
  onDelete?: () => void;
};

export const ItemCard = ({ item, onEdit, onDelete }: Props) => {
  const { wishlist, addToWishlist, removeFromWishlist, deleteArtwork } = useArtworkStore();
  const user = useStore((state) => state.user);
  const addToCart = useStore((state) => state.addToCart);
  const cart = useStore((state) => state.cart);
  const router = useRouter();

  const isWishlisted = wishlist.includes(item.id);
  const isInCart = cart.some((c) => c.id === item.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to save to wishlist.");
      router.push("/login");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(item.id);
      toast.success("Removed from Wishlist");
    } else {
      addToWishlist(item.id);
      toast.success("Added to Wishlist ❤️");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to add items to your cart.");
      router.push("/login");
      return;
    }
    const imageValue = Array.isArray(item.image) ? item.image[0] : item.image;
    addToCart({
      id: item.id,
      title: item.title || item.name || "Artwork",
      price: Number(item.price) || 0,
      image: imageValue || "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80",
      artistName: item.artistName || "Unknown Artist",
    });
    toast.success(isInCart ? "Quantity updated in cart!" : "Added to cart 🛒");
  };

  const { ui, fields } = appConfig;

  const imageField = fields.find(
    (f) => f.type === "file" || f.name === "image" || f.name === "images"
  );
  const priceField = fields.find(
    (f) => f.type === "number" && f.name === "price"
  );

  const imageValue = imageField ? item[imageField.name] : null;
  const imgSrc = Array.isArray(imageValue) ? imageValue[0] : imageValue;
  const priceValue = priceField ? item[priceField.name] : null;
  const titleValue = item.title || item.name || "Untitled Artwork";

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this piece?")) {
      await deleteArtwork(item.id);
      toast.success("Artwork deleted permanently.");
      onDelete?.();
    }
  };

  const isHandmade = item.isHandmade;
  const isNew =
    item.createdAt &&
    new Date().getTime() - new Date(item.createdAt).getTime() <
      7 * 24 * 60 * 60 * 1000;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 break-inside-avoid mb-6">

      {/* Image Container */}
      <Link
        href={`/${appConfig.entity.route}/${item.id}`}
        className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-gray-900 block overflow-hidden cursor-pointer"
      >
        <img
          src={imgSrc || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
          alt={titleValue}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay Dark Gradient on Hover */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        {/* Hover Overlay Details */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10 pointer-events-none">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{titleValue}</h3>
          {item.artistName && (
            <p className="text-sm font-medium text-gray-300">By {item.artistName}</p>
          )}
          {priceValue !== null && priceValue !== undefined && (
            <p className="text-lg font-black text-white mt-2">₹ {Number(priceValue).toLocaleString()}</p>
          )}
        </div>
      </Link>

      {/* Badges Overlay (Persistent) */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
        {isNew && (
          <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full shadow-md backdrop-blur-md">
            New
          </span>
        )}
        {isHandmade && (
          <span className="bg-amber-100/90 text-amber-800 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full shadow-md backdrop-blur-md border border-amber-200">
            Handmade
          </span>
        )}
      </div>

      {/* Wishlist Icon */}
      <button
        onClick={toggleWishlist}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md shadow-sm hover:scale-110 hover:bg-white dark:hover:bg-black transition-all"
        aria-label="Wishlist"
      >
        <svg
          className={`w-5 h-5 transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-900 dark:text-white"}`}
          fill={isWishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Standard Details Container */}
      <div className="p-5 flex flex-col flex-grow bg-white dark:bg-gray-950">
        <div className="flex justify-between items-start gap-2 mb-4">
          <div className="flex flex-col">
            <Link
              href={`/${appConfig.entity.route}/${item.id}`}
              className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
            >
              {titleValue}
            </Link>
            {item.artistName && (
              <Link
                href={`/artist/${item.artistId || encodeURIComponent(item.artistName)}`}
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                {item.artistName}
              </Link>
            )}
          </div>
          {ui?.showPrice !== false && priceValue !== null && priceValue !== undefined && (
            <p className="text-gray-900 dark:text-white font-black text-lg text-right flex-shrink-0">
              ₹{Number(priceValue).toLocaleString()}
            </p>
          )}
        </div>

        {/* Add to Cart Button — visible to all users (guests, buyers AND artists) */}
        <button
          id={`add-to-cart-${item.id}`}
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            isInCart
              ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 hover:bg-violet-100"
              : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-violet-600 dark:hover:bg-violet-50 hover:-translate-y-0.5 shadow-sm"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {isInCart ? "In Cart ✓" : "Add to Cart"}
        </button>

        {/* Edit / Delete Buttons for artists/admins */}
        {(onEdit || onDelete) && (
          <div className="flex w-full gap-2 border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
            {onEdit && (
              <button
                onClick={(e) => { e.preventDefault(); onEdit(item); }}
                className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:hover:bg-red-900/20 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
