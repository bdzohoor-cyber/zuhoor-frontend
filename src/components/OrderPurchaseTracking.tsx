"use client"

import { useEffect } from "react"
import { trackMetaPixelEvent } from "./MetaPixel"
import { HttpTypes } from "@medusajs/types"

type OrderPurchaseTrackingProps = {
  order: HttpTypes.StoreOrder
}

export function OrderPurchaseTracking({ order }: OrderPurchaseTrackingProps) {
  useEffect(() => {
    if (!order || !order.items || typeof window === "undefined" || !window.fbq) {
      return
    }

    try {
      trackMetaPixelEvent("Purchase", {
        content_name: "Purchase",
        content_type: "product",
        value: order.total ? order.total / 100 : 0,
        currency: order.currency_code?.toUpperCase() || "USD",
        num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
        contents: order.items.map((item) => ({
          id: item.variant_id,
          quantity: item.quantity,
          item_price: item.unit_price ? item.unit_price / 100 : 0,
        })),
      })
    } catch (error) {
      // Silently fail
      if (process.env.NODE_ENV === "development") {
        console.warn("Meta Pixel tracking error:", error)
      }
    }
  }, [order.id]) // Only track once per order

  return null
}

