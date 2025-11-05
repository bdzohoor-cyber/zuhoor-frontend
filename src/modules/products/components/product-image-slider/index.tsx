"use client"

import * as React from "react"
import Image from "next/image"
import { EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import type { HttpTypes } from "@medusajs/types"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ProductImageSliderProps = {
  thumbnail?: HttpTypes.StoreProduct["thumbnail"]
  images?: HttpTypes.StoreProduct["images"]
  productTitle?: string
  className?: string
}

export default function ProductImageSlider({
  thumbnail,
  images,
  productTitle = "Product",
  className,
}: ProductImageSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
    skipSnaps: false,
  })

  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect).on("reInit", onSelect)
    onSelect(emblaApi)
  }, [emblaApi, onSelect])

  // Combine thumbnail and images, with thumbnail first if it exists
  const allImages = React.useMemo(() => {
    const imageArray: string[] = []
    
    // Add thumbnail first if it exists and is different from first image
    if (thumbnail) {
      imageArray.push(thumbnail)
    }
    
    // Add all images, filtering out duplicates of thumbnail
    if (images && images.length > 0) {
      images.forEach((img) => {
        if (img.url && img.url !== thumbnail) {
          imageArray.push(img.url)
        }
      })
    }
    
    return imageArray.length > 0 ? imageArray : []
  }, [thumbnail, images])

  if (allImages.length === 0) {
    return (
      <div
        className={`relative w-full aspect-square overflow-hidden bg-gray-50 rounded-xs ${className || ""}`}
      >
        <div className="w-full h-full absolute inset-0 flex items-center justify-center">
          <PlaceholderImage size={24} />
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full aspect-square overflow-hidden rounded-xs ${className || ""}`}>
      <div className="relative w-full h-full" ref={emblaRef}>
        <div className="flex h-full">
          {allImages.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              className="relative min-w-full h-full flex-shrink-0"
            >
              <Image
                src={imageUrl}
                alt={`${productTitle} - Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center"
                priority={index === 0}
                quality={85}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator - only show if more than 1 image */}
      {allImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                index === selectedIndex
                  ? "bg-black w-4"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

