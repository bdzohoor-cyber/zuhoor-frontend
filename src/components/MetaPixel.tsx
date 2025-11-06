"use client"

import Script from "next/script"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

declare global {
  interface Window {
    fbq: (
      command: "init" | "track" | "trackSingle" | "trackCustom",
      eventName: string,
      data?: Record<string, unknown>
    ) => void
  }
}

type MetaPixelProps = {
  pixelId: string
}

export function MetaPixel({ pixelId }: MetaPixelProps) {
  const pathname = usePathname()
  const previousPathname = useRef<string | undefined>(undefined)

  // Track page views on route changes (as per official docs - PageView should fire on navigation)
  useEffect(() => {
    // Only track if pathname actually changed (avoid duplicate on initial mount + route change)
    if (
      typeof window !== "undefined" &&
      typeof window.fbq === "function" &&
      pathname !== previousPathname.current
    ) {
      window.fbq("track", "PageView")
      previousPathname.current = pathname
    }
  }, [pathname])

  if (!pixelId) {
    return null
  }

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <Image
          height={1}
          width={1}
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
          unoptimized
        />
      </noscript>
    </>
  )
}

// Helper function with performance optimization
export function trackMetaPixelEvent(
  eventName: string,
  data?: Record<string, unknown>
) {
  // Use requestIdleCallback if available for non-critical tracking
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return
  }

  // Use requestIdleCallback for non-critical events (better performance)
  if (
    typeof window.requestIdleCallback !== "undefined" &&
    ['ViewContent', 'Search'].includes(eventName)
  ) {
    window.requestIdleCallback(
      () => {
        window.fbq?.("track", eventName, data)
      },
      { timeout: 2000 }
    )
  } else {
    // Critical events (Purchase, AddToCart) track immediately
    try {
      window.fbq("track", eventName, data)
    } catch (error) {
      // Silently fail - don't break the app
      if (process.env.NODE_ENV === "development") {
        console.warn("Meta Pixel tracking error:", error)
      }
    }
  }
}

// Helper function to track custom events (single pixel)
export function trackMetaPixelCustomEvent(
  eventName: string,
  data?: Record<string, unknown>
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return
  }
  
  try {
    window.fbq("trackCustom", eventName, data)
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Meta Pixel custom tracking error:", error)
    }
  }
}

