"use client";

import { useState } from "react";
import { ESIMPlan } from "@/lib/types";

interface PriceAlertProps {
  plan: ESIMPlan;
  currentPrice: number;
  onClose: () => void;
}

export default function PriceAlert({ plan, currentPrice, onClose }: PriceAlertProps) {
  const [targetPrice, setTargetPrice] = useState("");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to your backend/email service
    // For now, we'll just show a success message
    setIsSubscribed(true);
    
    // Store in localStorage for demo purposes
    const alerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]");
    alerts.push({
      planId: plan.id,
      provider: plan.provider,
      country: "Current Country", // You'd pass this as a prop
      currentPrice,
      targetPrice: parseFloat(targetPrice),
      email,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("priceAlerts", JSON.stringify(alerts));
  };

  if (isSubscribed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900/95">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Alert Set!
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              We'll notify you when the price drops to ${targetPrice} or below.
            </p>
            <button
              onClick={onClose}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900/95">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Set Price Alert
            </h3>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubscribe} className="p-6">
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {plan.provider} - {plan.data}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Current Price: <span className="font-medium">${currentPrice.toFixed(2)}</span>
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notify me when price drops to ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={currentPrice}
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder={`e.g., ${(currentPrice * 0.8).toFixed(2)}`}
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter a price lower than ${currentPrice.toFixed(2)}
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Set Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

