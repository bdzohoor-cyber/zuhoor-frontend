"use client"
import React, { useEffect, useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import type { EmblaCarouselType } from 'embla-carousel'
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion"
import Image from "next/image"

type Slide = {
  id: number
  image: string
  title: string
  subtitle: string
}

const slides: Slide[] = [
  { id: 1, image: "/images/content/hero-fashion.jpg", title: "New Season, New Mood", subtitle: "Effortless silhouettes for your everyday life" },
  { id: 2, image: "/images/content/banner.jpeg", title: "Modern Classics", subtitle: "Timeless essentials reimagined for 2025" },
  { id: 3, image: "/images/content/women-category.jpg", title: "Minimal Meets Bold", subtitle: "Discover your statement in simplicity" },
]

const HeroCarousel = () => {
  const options = { loop: true }
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("select", () => onSelect(emblaApi))
  }, [emblaApi, onSelect])

  return (
    <div className="relative w-full">
      {/* Carousel Slides */}
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="relative min-w-full h-[50vh] md:h-[50vh] flex items-center justify-center">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-[1]" />
              <Image
               src={slide.image} 
               fill 
               alt={slide.title}
               priority
               className="absolute inset-0 w-full h-full object-cover object-center" />
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 w-full flex justify-center gap-3 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            animate={{ 
              width: index === selectedIndex ? 32 : 12,
              backgroundColor: index === selectedIndex ? "white" : "rgba(255, 255, 255, 0.4)"
            }}
            transition={{ duration: 0.3 }}
            className="h-1 transition-all"
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
