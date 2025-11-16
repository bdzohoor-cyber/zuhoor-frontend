"use client"
import React, { useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { withReactQueryProvider } from "@lib/util/react-query"

type Slide = {
  id: string
  image_url: string
  alt_text: string
  order: number
}

const HeroCarousel = () => {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  
  const { data, isLoading } = useQuery({
    queryKey: ['carousel-slides'],
    queryFn: async () => {
      try {
        const headers: HeadersInit = {}
        if (publishableKey) {
          headers['x-publishable-api-key'] = publishableKey
        }
        
        const res = await fetch(`${backendUrl}/store/custom/carousel`, {
          headers
        })
        // If response is not ok, return empty array instead of throwing
        if (!res.ok) {
          console.warn('Carousel API returned non-ok status:', res.status)
          return { slides: [] }
        }
        const data = await res.json()
        // Ensure we always return the expected format
        return data?.slides ? { slides: data.slides } : { slides: [] }
      } catch (error) {
        console.warn('Carousel API error:', error)
        // Return empty array on any error - will use placeholderData
        return { slides: [] }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 1, // Only retry once
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

  // If no slides from API, use placeholder data (static images)
  if (slides.length === 0) {
    const fallbackSlides: Slide[] = [
      { id: '1', image_url: '/images/content/banner.jpeg', alt_text: 'Elegant Style', order: 0 },
      { id: '2', image_url: '/images/content/men-category.jpg', alt_text: 'Fashion Collection', order: 1 },
      { id: '3', image_url: '/images/content/women-category.jpg', alt_text: "Women's Collection", order: 2 },
    ]
    // Use fallback slides
    return (
      <div className="relative w-full h-full">
        <div 
          className="relative w-full h-full overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex h-full">
            {fallbackSlides.map((slide) => (
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

export default withReactQueryProvider(HeroCarousel)
