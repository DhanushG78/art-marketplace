"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const TAX_RATE = 0.08;

export default function PaymentPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useStore();
  const router = useRouter();

  const [enteredAmount, setEnteredAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = subtotal * TAX_RATE;
  const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

  if (!user) return null;

  if (cart.length === 0 && status !== "success") {
    // Redirect to cart if nothing to pay
    router.push("/cart");
    return null;
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = parseFloat(enteredAmount);

    if (isNaN(entered) || entered <= 0) {
      setErrorMessage("Please enter a valid amount.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1000));

    if (Math.abs(entered - grandTotal) < 0.01) {
      setStatus("success");
      // Snapshot order before clearing cart
      sessionStorage.setItem("last_order", JSON.stringify({ items: cart, total: grandTotal }));
      clearCart();
      setTimeout(() => router.push("/order-success"), 1500);
    } else {
      setStatus("error");
      setErrorMessage(
        `Incorrect amount. Please enter exactly ₹${grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Dummy Payment</h1>
          <p className="text-gray-500 text-sm mt-1">Enter the exact total to complete your order</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
          {/* Amount to Pay */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-center">
            <p className="text-violet-200 text-sm font-medium mb-1">Total Amount Due</p>
            <p id="payment-total" className="text-white text-4xl font-black">
              ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-violet-200 text-xs mt-1">incl. 8% GST</p>
          </div>

          {/* Order Breakdown */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Order Breakdown</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300 line-clamp-1 max-w-[200px]">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between text-sm">
                <span className="text-gray-500">Tax (8%)</span>
                <span className="text-gray-700 dark:text-gray-300">₹{taxAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePay} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                Enter Amount (₹)
              </label>
              <input
                id="payment-amount-input"
                type="number"
                step="0.01"
                placeholder={`Enter ₹${grandTotal.toFixed(2)}`}
                value={enteredAmount}
                onChange={(e) => {
                  setEnteredAmount(e.target.value);
                  setStatus("idle");
                  setErrorMessage("");
                }}
                disabled={status === "success"}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Hint: Enter exactly <span className="font-bold text-violet-500">₹{grandTotal.toFixed(2)}</span> to complete payment
              </p>
            </div>

            {/* Status Messages */}
            {status === "error" && (
              <div id="payment-error" className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            {status === "success" && (
              <div id="payment-success" className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-600 dark:text-green-400 text-sm font-bold">Payment Successful! Redirecting...</p>
              </div>
            )}

            <button
              id="payment-submit-btn"
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : status === "success" ? (
                "✓ Payment Confirmed"
              ) : (
                "Pay Now"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 This is a dummy payment. No real money is charged.
        </p>
      </div>
    </div>
  );
}
