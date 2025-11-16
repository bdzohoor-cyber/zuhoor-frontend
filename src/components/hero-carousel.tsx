"use client"
import React, { useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"

type Slide = {
  id: string
  image_url: string
  alt_text: string
  order: number
}

const HeroCarousel = () => {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
  
  const { data, isLoading } = useQuery({
    queryKey: ['carousel-slides'],
    queryFn: async () => {
      const res = await fetch(`${backendUrl}/store/custom/carousel`)
      if (!res.ok) throw new Error('Failed to fetch carousel')
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2,
    // Fallback to static images if API fails
    placeholderData: {
      slides: [
        { id: '1', image_url: '/images/content/banner.jpeg', alt_text: 'Elegant Style', order: 0 },
        { id: '2', image_url: '/images/content/men-category.jpg', alt_text: 'Fashion Collection', order: 1 },
        { id: '3', image_url: '/images/content/women-category.jpg', alt_text: "Women's Collection", order: 2 },
      ]
    }
  })

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
    
    // Reinitialize carousel when slides change
    if (data?.slides) {
      emblaApi.reInit()
    }
  }, [emblaApi, onSelect, data?.slides])

  if (isLoading) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-grayscale-400">Loading...</div>
      </div>
    )
  }

  // Use fallback data if error or no data
  // If error, placeholderData will be used automatically by react-query
  const slides: Slide[] = data?.slides || []

  if (slides.length === 0) {
    // Fallback: show nothing or a placeholder
    return null
  }

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
                src={slide.image_url} 
                fill 
                alt={slide.alt_text}
                priority={slide.order === 0}
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
