import { HttpTypes } from "@medusajs/types"

export const getVariantItemsInStock = (variant: HttpTypes.StoreProductVariant): number => {
  if (!variant) return 0
  
  // If inventory isn't managed, or backorder is allowed, return a large number
  if (!variant.manage_inventory || variant.allow_backorder) {
    return 9999
  }

  // Return actual inventory quantity if managed
  return variant.inventory_quantity || 0
}