'use client';

import { useState } from 'react';
import { ImageOff } from 'lucide-react';

import { getListingImageUrl } from '~/lib/queries/listings';

interface ListingImageProps {
  storagePath: string | null;
  alt: string;
  className?: string;
}

export function ListingImage({
  storagePath,
  alt,
  className = '',
}: ListingImageProps) {
  const [errored, setErrored] = useState(false);
  const url = storagePath ? getListingImageUrl(storagePath) : null;

  if (!url || errored) {
    return (
      <div className={`flex items-center justify-center bg-[#0A2F1F] ${className}`}>
        <ImageOff className="h-5 w-5 text-[#F5F5F0]/30" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      onError={() => setErrored(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}
