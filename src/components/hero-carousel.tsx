"use client"
import React, { useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

type Slide = {
  id: number
  image: string
  alt: string
}

const slides: Slide[] = [
  { id: 1, image: "/images/content/banner.jpeg", alt: "Elegant Style" },
  { id: 2, image: "/images/content/men-category.jpg", alt: "Fashion Collection" },
  { id: 3, image: "/images/content/women-category.jpg", alt: "Women's Collection" },
]

const HeroCarousel = () => {
  const options = { 
    loop: true,
    align: 'start' as const,
    duration: 40,
    dragFree: false,
  }
  
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ 
      delay: 6000, 
      stopOnInteraction: false, 
      stopOnMouseEnter: false,
      stopOnFocusIn: false,
    })
  ])

  const onSelect = useCallback(() => {
    // Carousel updates automatically
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", () => onSelect())
    emblaApi.on("reInit", () => onSelect())
  }, [emblaApi, onSelect])

  return (
    <div className="relative w-full h-full">
      <div 
        className="relative w-full h-full overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex h-full">
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className="relative min-w-full h-full flex-shrink-0"
            >
              <Image
                src={slide.image} 
                fill 
                alt={slide.alt}
                priority={slide.id === 1}
                quality={95}
                sizes="100vw"
                className="object-cover object-center select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeroCarousel
