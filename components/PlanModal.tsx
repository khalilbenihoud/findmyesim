"use client";

import { useEffect } from "react";

interface ESIMPlan {
  id: string;
  provider: string;
  providerImage: string;
  data: string;
  dataType: "4G" | "5G" | "4G/5G";
  duration: string;
  price: number;
  networkRating: number;
  reviewCount: number;
  features: string[];
  partnerOperators: string[];
  networkPerformance: {
    speed: string;
    latency: string;
    reliability: string;
  };
  specifications: {
    activation: string;
    hotspot: string;
    tethering: string;
    voice: string;
    sms: string;
  };
}

interface PlanModalProps {
  plan: ESIMPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanModal({ plan, isOpen, onClose }: PlanModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
      >
        ★
      </span>
    ));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900/95 dark:backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900/95 dark:backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {plan.provider} - {plan.data}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Provider Info */}
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800">
              <span className="text-2xl">{plan.providerImage}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {plan.provider}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex">{renderStars(plan.networkRating)}</div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.networkRating.toFixed(1)} ({plan.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${plan.price}
              </p>
            </div>
          </div>

          {/* Key Details */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">Data</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {plan.data}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {plan.dataType}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">Validity</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {plan.duration}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {plan.networkRating.toFixed(1)}/5
              </p>
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Specifications
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex justify-between border-b border-gray-200 py-2 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Activation</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {plan.specifications.activation}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Hotspot</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {plan.specifications.hotspot}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Tethering</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {plan.specifications.tethering}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Voice Calls</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {plan.specifications.voice}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">SMS</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {plan.specifications.sms}
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {plan.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Network Performance */}
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Network Performance
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">Speed</p>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {plan.networkPerformance.speed}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">Latency</p>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {plan.networkPerformance.latency}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">Reliability</p>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {plan.networkPerformance.reliability}
                </p>
              </div>
            </div>
          </div>

          {/* Partner Operators */}
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Partner Operators
            </h4>
            <div className="flex flex-wrap gap-2">
              {plan.partnerOperators.map((operator, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {operator}
                </span>
              ))}
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={() => {
              // Handle purchase logic here
              alert(`Redirecting to purchase ${plan.provider} plan...`);
            }}
            className="w-full rounded-lg bg-gray-900 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Purchase Now - ${plan.price}
          </button>
        </div>
      </div>
    </div>
  );
}

