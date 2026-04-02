"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { appConfig } from "@/config/appConfig";
import { Search, ShoppingCart, User, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut } from "@/services/authService";

export const Navbar = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const cart = useStore((state) => state.cart);
  const router = useRouter();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  const handleCartClick = () => {
    if (!user) {
      toast.error("Please sign in to view your cart.");
      router.push("/login");
    } else {
      router.push("/cart");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl backdrop-saturate-150 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 sm:gap-8">

          {/* Logo & Brand */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30 transition-transform group-hover:scale-105">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white hidden sm:block">
                {appConfig.appName}
              </span>
            </Link>
          </div>

          {/* Search Bar (Center) */}
          <div className="flex-1 max-w-2xl hidden md:flex">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-violet-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search artworks, artists, categories..."
                className="w-full rounded-full border border-gray-200/80 bg-gray-50/80 dark:bg-gray-900/80 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-950 focus:border-violet-500/50 focus:outline-none focus:ring-4 focus:ring-violet-500/10 shadow-inner transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button className="hidden sm:flex p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
              <Bell size={22} />
            </button>

            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={handleCartClick}
              className="relative flex p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
              title="Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{(user as any).name || user.email?.split("@")[0]}</span>
                  <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                </div>
                <button
                  id="navbar-logout-btn"
                  onClick={handleLogout}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition"
                  title="Logout"
                >
                  <User size={20} />
                </button>
                {user.role === "admin" && (
                  <Link
                    href="/dashboard"
                    className="hidden lg:flex px-4 py-2 text-sm font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:hover:bg-violet-900/40 rounded-full transition"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  id="navbar-login-link"
                  className="hidden sm:flex px-4 py-2 text-sm font-bold text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  id="navbar-signup-link"
                  className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/30 transition transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 py-2.5 overflow-x-auto no-scrollbar text-sm font-medium text-gray-600 dark:text-gray-400">
            {[
              { label: "All Art",      cat: "" },
              { label: "Paintings",    cat: "painting" },
              { label: "Sculptures",   cat: "sculpture" },
              { label: "Photography",  cat: "photography" },
              { label: "Digital",      cat: "digital" },
              { label: "Crafts",       cat: "craft" },
              { label: "Handmade",     cat: "handmade" },
            ].map(({ label, cat }) => (
              <li key={label}>
                <Link
                  href={cat ? `/?cat=${cat}#browse` : "/#browse"}
                  className="whitespace-nowrap hover:text-black dark:hover:text-white transition-colors relative group"
                >
                  {label}
                  <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
