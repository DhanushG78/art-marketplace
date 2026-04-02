"use client";

import Link from "next/link";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useStore } from "@/store/useStore";

export const Hero = () => {
  const { appName } = useAppConfig();
  const user = useStore((s) => s.user);

  return (
    <div className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">

      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1800&q=85"
          alt="Art gallery background"
          className="w-full h-full object-cover object-center"
        />
        {/* dark + gradient overlay so text is always legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/75 via-gray-900/60 to-gray-950/90" />
        {/* subtle vignette */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
      </div>

      {/* ── Floating colour blobs for depth ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-700" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-28 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-semibold tracking-wider uppercase shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {user ? `Welcome back, ${(user as any).name || user.email?.split("@")[0]} 👋` : "The Premier Art Marketplace"}
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-6 leading-[1.05]">
          Discover & Collect{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Premium Art
            </span>
            {/* underline accent */}
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full opacity-60" />
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
          {user?.role === "artist"
            ? `List your artworks, connect with collectors worldwide, and grow your creative business on ${appName}.`
            : `Explore thousands of original paintings, sculptures, digital art and handmade crafts. Buy directly from the artists.`}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#browse"
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-xl shadow-violet-500/40 hover:shadow-violet-500/60 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Artworks
            </span>
            {/* Shine effect */}
            <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors" />
          </Link>

          {!user && (
            <Link
              href="/signup"
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white text-sm font-bold hover:bg-white/20 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Become a Seller 🎨
            </Link>
          )}

          {user?.role === "artist" && (
            <a
              href="#browse"
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white text-sm font-bold hover:bg-white/20 transition-all hover:-translate-y-0.5 shadow-lg flex items-center gap-2"
            >
              🛒 Shop Artworks
            </a>
          )}
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-center">
          {[
            { value: "2,400+", label: "Artworks" },
            { value: "340+",   label: "Artists" },
            { value: "18K+",   label: "Collectors" },
            { value: "99%",    label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-3xl font-black text-white">{stat.value}</span>
              <span className="text-sm text-gray-400 font-medium mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/40">
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-9 rounded-full border border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
