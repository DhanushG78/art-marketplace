"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";

export default function OrderSuccessPage() {
  const { user } = useAuth();
  // We capture a snapshot of the order since cart is cleared on success
  const [orderItems, setOrderItems] = useState<typeof cart>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const cart = useStore((state) => state.cart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // The cart is already cleared by payment page; we read from sessionStorage snapshot
    const snapshot = sessionStorage.getItem("last_order");
    if (snapshot) {
      try {
        const parsed = JSON.parse(snapshot);
        setOrderItems(parsed.items || []);
        setOrderTotal(parsed.total || 0);
      } catch {
        /* no-op */
      }
    }
  }, []);

  if (!user || !mounted) return null;

  const hasOrder = orderItems.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        {/* Success Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-bounce-slow">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Rings */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400/30 animate-ping" />
            <div className="absolute -inset-3 rounded-full border-2 border-emerald-400/20 animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl font-black text-white mb-3">Order Confirmed! 🎉</h1>
        <p className="text-gray-400 text-lg mb-2">Thank you for your purchase.</p>
        <p className="text-gray-500 text-sm mb-10">
          A receipt has been sent to <span className="text-emerald-400 font-medium">{user?.email}</span>
        </p>

        {/* Order Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 text-left shadow-2xl">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Order Summary
          </h2>

          {hasOrder ? (
            <div className="space-y-3 mb-5">
              {orderItems.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm line-clamp-1">{item.title}</p>
                    <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-500 text-sm">Your items are on their way! 🚀</p>
            </div>
          )}

          {hasOrder && (
            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Total Paid</span>
              <span className="text-emerald-400 text-2xl font-black">
                ₹{orderTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            id="back-to-home-btn"
            className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/orders"
            id="view-orders-btn"
            className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Orders
          </Link>
        </div>

        <p className="text-gray-600 text-xs mt-6">
          Order ID: #{Date.now().toString(36).toUpperCase()}
        </p>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
