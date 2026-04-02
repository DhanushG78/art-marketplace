"use client";

import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TAX_RATE = 0.08; // 8% GST

export default function CartPage() {
  const { user } = useAuth(); // Protects this route
  const { cart, removeFromCart, updateQuantity } = useStore();
  const router = useRouter();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = subtotal * TAX_RATE;
  const grandTotal = subtotal + taxAmount;

  if (!user) return null; // useAuth handles redirect

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">
            Your Cart
            {cart.length > 0 && (
              <span className="ml-3 text-lg font-medium text-gray-400">({cart.length} item{cart.length !== 1 ? "s" : ""})</span>
            )}
          </h1>
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Discover beautiful artworks and add them to your cart.</p>
            <Link
              href="/"
              id="cart-browse-btn"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:-translate-y-0.5 transition-all shadow-lg"
            >
              Browse Artworks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex gap-5 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">by {item.artistName}</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white mt-2">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-400">₹{item.price.toLocaleString()} each</p>
                    )}
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col items-end justify-between gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                      <button
                        id={`cart-decrease-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        id={`cart-increase-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      id={`cart-remove-${item.id}`}
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-400 hover:text-red-500 font-medium transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Item Total</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST (8%)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
                    <span className="font-black text-gray-900 dark:text-white">Grand Total</span>
                    <span className="font-black text-2xl text-gray-900 dark:text-white">
                      ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  id="checkout-btn"
                  onClick={() => router.push("/payment")}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">🔒 Secure checkout • No real payment required</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
