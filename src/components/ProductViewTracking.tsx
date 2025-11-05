"use client"

import { useEffect } from "react"
import { trackMetaPixelEvent } from "./MetaPixel"
import { HttpTypes } from "@medusajs/types"

type ProductViewTrackingProps = {
  product: HttpTypes.StoreProduct
}

export function ProductViewTracking({ product }: ProductViewTrackingProps) {
  useEffect(() => {
    if (!product || typeof window === "undefined" || !window.fbq) {
      return
    }

    try {
      trackMetaPixelEvent("ViewContent", {
        content_name: product.title || "Product",
        content_ids: [product.id],
        content_type: "product",
        value: product.variants?.[0]?.calculated_price?.calculated_amount
          ? product.variants[0].calculated_price.calculated_amount / 100
          : 0,
        currency: product.variants?.[0]?.calculated_price?.currency_code?.toUpperCase() || "USD",
      })
    } catch (error) {
      // Silently fail
      if (process.env.NODE_ENV === "development") {
        console.warn("Meta Pixel tracking error:", error)
      }
    }
  }, [product.id]) // Only track once per product ID

  return null // This component doesn't render anything
}

