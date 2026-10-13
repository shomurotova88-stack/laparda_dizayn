'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Oldin (Ochiq deraza)',
  afterLabel = 'Keyin (LA PARDA pardalari)',
  className = ''
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden rounded-2xl cursor-ew-resize border border-amber-900/10 shadow-xl ${className}`}
      style={{ aspectRatio: '16/10' }}
    >
      {/* After Image (Background full) */}
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt={afterLabel}
          fill
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover"
        />
        <div className="absolute top-4 right-4 bg-stone-900/80 backdrop-blur-sm text-amber-300 text-xs px-3 py-1.5 rounded-full font-medium shadow-md">
          {afterLabel}
        </div>
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover filter contrast-90 brightness-95"
        />
        <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-sm text-stone-300 text-xs px-3 py-1.5 rounded-full font-medium shadow-md">
          {beforeLabel}
        </div>
      </div>

      {/* Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_10px_rgba(217,119,6,0.6)] cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle circle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-stone-900 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" transform="rotate(180 12 12)" />
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
