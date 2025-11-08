"use client";

import { useState } from "react";
import { getProviderEmoji } from "@/lib/providerLogos";
import Image from "next/image";

interface ProviderLogoProps {
  providerName: string;
  logoUrl: string;
  size?: number;
  className?: string;
}

export default function ProviderLogo({
  providerName,
  logoUrl,
  size = 48,
  className = "",
}: ProviderLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const emoji = getProviderEmoji(providerName);

  // If it's an emoji (starts with emoji character), just display it
  if (logoUrl.match(/^[\p{Emoji}]/u) || imageError) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-gray-100 text-3xl dark:bg-slate-800 ${className}`}
        style={{ width: size, height: size }}
      >
        {emoji}
      </div>
    );
  }

  // If it's a URL, try to load the image
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-slate-800 ${className}`}
      style={{ width: size, height: size }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          {emoji}
        </div>
      )}
      <Image
        src={logoUrl}
        alt={`${providerName} logo`}
        width={size}
        height={size}
        className={`object-contain ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity`}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        unoptimized // Allow external images
      />
    </div>
  );
}

