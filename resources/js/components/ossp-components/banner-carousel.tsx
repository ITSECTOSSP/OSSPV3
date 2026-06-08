import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import * as React from 'react';

interface BannerCarouselProps {
    images: string[];
}

export default function BannerCarousel({ images }: BannerCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    React.useEffect(() => {
        if (!emblaApi) return;

        emblaApi.on('select', onSelect);
        onSelect();

        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    // autoplay
    React.useEffect(() => {
        if (!emblaApi) return;

        const interval = setInterval(() => {
            emblaApi.scrollNext();
        }, 30000);

        return () => clearInterval(interval);
    }, [emblaApi]);

    return (
        <div className="relative w-full">
            {/* VIEWPORT */}
            <div ref={emblaRef} className="overflow-hidden rounded-2xl">
                <div className="flex">
                    {images.map((src, index) => (
                        <div key={index} className="min-w-full flex-shrink-0">
                            {/* SLIDE */}
                            <div className="relative flex h-[200px] w-full items-center justify-center bg-white sm:h-[320px] md:h-[480px] lg:h-[600px] xl:h-[720px] dark:bg-black">
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ⬅️➡️ NAV BUTTONS */}
            <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60"
            >
                ‹
            </button>

            <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60"
            >
                ›
            </button>

            {/* DOTS */}
            <div className="mt-4 flex justify-center gap-2">
                {images.map((_, index) => (
                    <button
                        type="button"
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={cn(
                            'h-2 w-2 rounded-full transition-all duration-300',
                            selectedIndex === index
                                ? 'w-5 bg-[#16036c] dark:bg-white'
                                : 'bg-[#16036c]/30 dark:bg-white/30',
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
