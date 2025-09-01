import React from 'react';

interface HeroCarouselProps {
  images: { src: string; alt?: string }[];
  speedSeconds?: number; // full cycle duration (default 35s)
}

// A lightweight, CSS-only infinite sliding carousel duplicating the image sequence for seamless looping.
// Add more images by placing them in src/assets and passing their imports via the images prop.
export const HeroCarousel: React.FC<HeroCarouselProps> = ({ images, speedSeconds = 35 }) => {
  if (!images.length) return null;
  const seq = [...images, ...images]; // duplicate for seamless scroll
  return (
    <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-elegant)] bg-gradient-to-r from-primary/10 to-primary-dark/10 p-4">
      <div className="relative group">
        <div
          className="flex w-[200%] gap-6 animate-infinite-scroll"
          style={{ animationDuration: `${speedSeconds}s` }}
          aria-label="Company culture and hiring visuals carousel"
        >
          {seq.map((img, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-56 md:w-64 h-40 md:h-48 overflow-hidden rounded-xl ring-1 ring-border bg-background/30 backdrop-blur-sm"
            >
              <img
                src={img.src}
                alt={img.alt || 'Work culture'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          ))}
        </div>
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background/80 to-transparent" />
      </div>
    </div>
  );
};

export default HeroCarousel;