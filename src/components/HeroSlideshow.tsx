import React, { useEffect, useRef, useState } from 'react';

export interface HeroSlide {
  src: string;
  alt?: string;
}

interface HeroSlideshowProps {
  images: HeroSlide[];
  intervalMs?: number; // default 7000ms (time each slide stays fully visible)
  transitionMs?: number; // slide animation duration (default 700ms)
  pauseOnHover?: boolean;
  fit?: 'cover' | 'contain'; // image fit strategy
  className?: string;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ images, intervalMs = 5000, transitionMs = 500, pauseOnHover = true, fit = 'cover', className }) => {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const [paused, setPaused] = useState(false);
  const [dims, setDims] = useState<{w:number; h:number}|null>(null);
  const firstImgRef = useRef<HTMLImageElement | null>(null);

  // Auto advance
  useEffect(() => {
    if (count <= 1) return; // nothing to rotate
    if (paused) return;
    const id = setTimeout(() => setIndex(i => (i + 1) % count), intervalMs);
    return () => clearTimeout(id);
  }, [count, index, intervalMs, paused]);

  useEffect(() => {
    // attempt to derive natural size once first image loads
    const img = firstImgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth) {
      setDims({ w: img.naturalWidth, h: img.naturalHeight });
    } else {
      const handler = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
      img.addEventListener('load', handler, { once: true });
      return () => img.removeEventListener('load', handler);
    }
  }, [images]);

  if (!count) return null;

  return (
    <div className={"select-none " + (className || '')}>
      <div
        className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-elegant)] bg-gradient-to-r from-primary/10 to-primary-dark/10"
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
        style={dims ? { width: '100%', maxWidth: dims.w, aspectRatio: `${dims.w}/${dims.h}` } : undefined}
      >
        {/* Slide track */}
        <div
          className="flex h-full w-full"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: `transform ${transitionMs}ms cubic-bezier(0.4,0,0.2,1)`
          }}
        >
          {images.map((img, i) => (
            <div key={i} className="w-full h-full flex-shrink-0 flex items-center justify-center min-w-full" style={{ backgroundColor: '#ADD8E6' }}>
              <img
                ref={i===0 ? firstImgRef : undefined}
                src={img.src}
                alt={img.alt || 'Hero visual'}
                className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} transition-opacity duration-500`}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
        {/* Overlay gradient (subtle) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/10 via-transparent to-transparent" />
      </div>
      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-6 rounded-full transition-colors duration-300 ${i === index ? 'bg-primary' : 'bg-muted'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlideshow;