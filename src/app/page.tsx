"use client";

import { useItems, ItemForm } from "@/modules/items";
import { ItemCard } from "@/components/ui/ItemCard";
import { Hero } from "@/components/sections/Hero";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useState, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { useSearchParams, useRouter } from "next/navigation";

// Category → display label mapping
const CATEGORY_MAP: Record<string, string> = {
  "All Art": "All Categories",
  "Paintings": "painting",
  "Sculptures": "sculpture",
  "Photography": "photography",
  "Digital": "digital",
  "Crafts": "craft",
  "Handmade": "handmade",
};

export default function Home() {
  const { items, loading, fetchItems } = useItems();
  const { getTerminology } = useAppConfig();
  const [editingItem, setEditingItem] = useState<any>(null);
  const user = useStore((state) => state.user);
  const searchParams = useSearchParams();
  const browseRef = useRef<HTMLDivElement>(null);

  // Read initial category from URL query param (?cat=painting)
  const urlCat = searchParams.get("cat") || "";

  // Real-time Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [category, setCategory] = useState<string>(urlCat || "All Categories");
  const [style, setStyle] = useState<string>("All Styles");
  const [isHandmade, setIsHandmade] = useState<boolean | "">("");

  // Sync category from URL param when it changes (navbar tab click)
  useEffect(() => {
    const raw = searchParams.get("cat") || "";
    setCategory(raw || "All Categories");
    // Scroll to browse section smoothly
    if (raw) {
      setTimeout(() => {
        browseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [searchParams]);

  // Special "Handmade" category tab — set isHandmade filter instead of category
  const handleCategoryTab = (displayLabel: string) => {
    const value = CATEGORY_MAP[displayLabel] ?? displayLabel;
    if (value === "handmade") {
      setCategory("All Categories");
      setIsHandmade(true);
    } else {
      setIsHandmade("");
      setCategory(value);
    }
    browseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Active tab check
  const getActiveTab = () => {
    if (isHandmade === true) return "Handmade";
    if (category === "All Categories") return "All Art";
    const found = Object.entries(CATEGORY_MAP).find(([, v]) => v === category);
    return found ? found[0] : "All Art";
  };

  // Filter Items Array
  const filteredItems = items.filter((item: any) => {
    const itemTitle = item.title?.toLowerCase() || item.name?.toLowerCase() || "";
    const artist = item.artistName?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch = itemTitle.includes(search) || artist.includes(search);
    const matchesMinPrice = minPrice === "" ? true : Number(item.price || 0) >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" ? true : Number(item.price || 0) <= Number(maxPrice);
    const matchesCategory = category === "All Categories" ? true : item.category === category;
    const matchesStyle = style === "All Styles" ? true : item.style === style;
    const matchesHandmade = isHandmade === "" ? true : item.isHandmade === isHandmade;

    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesCategory && matchesStyle && matchesHandmade;
  });

  const categories = ["All Categories", "painting", "sculpture", "craft", "digital", "photography"];
  const styles = ["All Styles", "Realism", "Abstract", "Modern", "Post-Impressionism", "Classical Realism", "Folk Art", "Surrealism", "Cyberpunk", "Street Art", "Fantasy Realism", "Landscape Realism", "Wabi-Sabi", "Bohemian", "Portraiture", "Architectural", "Minimalism", "Documentary"];

  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("All Categories");
    setStyle("All Styles");
    setIsHandmade("");
  };

  const featuredItems = items.slice(0, 4);
  const activeTab = getActiveTab();
  const navTabs = Object.keys(CATEGORY_MAP);

  return (
    <>
      <Hero />

      <div ref={browseRef} id="browse" className="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Admin / Artist Form */}
          {(user?.role === "admin" || user?.role === "artist") && (
            <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{editingItem ? "Editing Listing" : "Create New Listing"}</h2>
                {editingItem && (
                  <button
                    onClick={() => setEditingItem(null)}
                    className="text-sm font-semibold text-violet-600 hover:text-violet-500 hover:underline px-4 py-2 bg-violet-50 dark:bg-violet-900/20 rounded-full"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <ItemForm
                key={editingItem ? editingItem.id : "new-post"}
                initialData={editingItem || {}}
                onSuccess={() => {
                  setEditingItem(null);
                  fetchItems();
                }}
              />
            </section>
          )}

          {/* Featured Artworks Row */}
          {!loading && featuredItems.length > 0 && (
            <section className="mb-2">
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100 mb-6">
                Featured {getTerminology(2)}
              </h2>
              <div className="columns-1 sm:columns-2 lg:columns-4 gap-6">
                {featuredItems.map((item: any) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* ─── Category Tabs (All Art, Paintings, Sculptures…) ─── */}
          <section className="flex flex-wrap items-center justify-center gap-3 py-4 border-b border-gray-200 dark:border-gray-800">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  id={`tab-${tab.toLowerCase().replace(/\s/g, "-")}`}
                  onClick={() => handleCategoryTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30 scale-105"
                      : "bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </section>

          {/* Browse Section */}
          <section className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar / Filters Panel */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
                <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  Filters
                </h3>

                <div className="space-y-7">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Search Title & Artist</label>
                    <input
                      type="text"
                      placeholder="e.g. Abstract, Priya"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 transition-all shadow-inner"
                    />
                  </div>

                  {/* Price Filter */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Min (₹)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 transition-all shadow-inner"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Max (₹)</label>
                      <input
                        type="number"
                        placeholder="Any"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => { setIsHandmade(""); setCategory(e.target.value); }}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 transition-all shadow-inner"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Style Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Style</label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 transition-all shadow-inner"
                    >
                      {styles.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Handmade Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Handmade Only</label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isHandmade === true}
                      onClick={() => setIsHandmade(isHandmade === true ? "" : true)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        isHandmade === true ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${isHandmade === true ? "translate-x-8" : "translate-x-1"}`} />
                      <span className={`ml-16 text-sm font-semibold whitespace-nowrap ${isHandmade === true ? "text-violet-600 dark:text-violet-400" : "text-gray-500"}`}>
                        {isHandmade === true ? "Handmade ✋" : "All works"}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="mt-8 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Grid Layout */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-4">
                <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
                  {activeTab === "All Art" ? `All ${getTerminology(2)}` : activeTab}
                </h2>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm py-1.5 px-4 rounded-full font-bold border border-gray-200 dark:border-gray-700 shadow-sm">
                  {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                </span>
              </div>

              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Loading artworks...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm text-center px-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No artworks found</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">Try adjusting your filters or search terms.</p>
                  <button onClick={clearFilters} className="mt-6 text-violet-600 hover:text-violet-500 font-semibold">Clear all filters</button>
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
                  {filteredItems.map((item: any) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={(user?.role === "admin" || user?.role === "artist") ? (i) => setEditingItem(i) : undefined}
                      onDelete={(user?.role === "admin" || user?.role === "artist") ? fetchItems : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}