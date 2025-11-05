"use client"

import { useMemo, useState, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import { getProductPrice } from "@lib/util/get-product-price"
import { motion } from "framer-motion"
import ProductImageSlider from "@modules/products/components/product-image-slider"
import { useAddLineItem } from "hooks/cart"
import { useCountryCode } from "hooks/country-code"
import { useToast } from '@/components/ui/toast-context'
import { withReactQueryProvider } from "@lib/util/react-query"
import { Icon } from "@/components/Icon"

function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { cheapestPrice } = getProductPrice({
    product: product,
  })

  const hasReducedPrice =
    cheapestPrice &&
    cheapestPrice.calculated_price_number <
      (cheapestPrice?.original_price_number || 0)

  // Variant selection logic
  const countryCode = useCountryCode()
  const { mutate: addToCart, isPending } = useAddLineItem()
  const { toast } = useToast()
  const [selectedOptionValue, setSelectedOptionValue] = useState<string | null>(null)

  // Find the first option that's not Material or Color (or use Size if available)
  const variantOption = useMemo(() => {
    if (!product.options || product.options.length === 0) return null
    
    // Priority: Size > first non-Material/Color option
    const sizeOption = product.options.find((o) => 
      o.title?.toLowerCase() === "size" || o.title?.toLowerCase() === "sizes"
    )
    if (sizeOption) return sizeOption
    
    // Find first option that's not Material or Color
    const otherOption = product.options.find(
      (o) => o.title?.toLowerCase() !== "material" && o.title?.toLowerCase() !== "color"
    )
    return otherOption || product.options[0]
  }, [product.options])

  // Get unique option values for this option from all variants
  const optionValues = useMemo(() => {
    if (!variantOption || !product.variants) return []
    
    const values = new Set<string>()
    product.variants.forEach((variant) => {
      const variantOptionValue = variant.options?.find(
        (opt) => opt.option_id === variantOption.id
      )
      if (variantOptionValue?.value) {
        // Check if variant is in stock
        const inStock = !variant.manage_inventory || 
          variant.allow_backorder || 
          (variant.inventory_quantity ?? 0) > 0
        if (inStock) {
          values.add(variantOptionValue.value)
        }
      }
    })
    
    return Array.from(values).sort()
  }, [product.variants, variantOption])

  // Find variant when option value is selected
  const findVariantForOption = useCallback((optionValue: string) => {
    if (!variantOption || !product.variants) return null
    
    return product.variants.find((variant) => {
      const variantOptionValue = variant.options?.find(
        (opt) => opt.option_id === variantOption.id
      )?.value
      
      return variantOptionValue === optionValue && (
        !variant.manage_inventory || 
        variant.allow_backorder || 
        (variant.inventory_quantity ?? 0) > 0
      )
    })
  }, [product.variants, variantOption])

  // Handle variant button click
  const handleVariantClick = useCallback((e: React.MouseEvent, optionValue: string) => {
    e.preventDefault()
    e.stopPropagation()

    const variant = findVariantForOption(optionValue)
    if (!variant) {
      toast({
        title: "Not Available",
        description: "This variant is currently out of stock",
      })
      return
    }

    setSelectedOptionValue(optionValue)
    
    // Add to cart
    addToCart(
      {
        variantId: variant.id,
        quantity: 1,
        countryCode,
      },
      {
        onSuccess: () => {
          toast({
            title: "Added to Cart",
            description: `${product.title} added to your cart`,
          })
          // Reset selection after a brief delay
          setTimeout(() => setSelectedOptionValue(null), 1000)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "There was an error adding the item to your cart",
          })
          if (process.env.NODE_ENV === "development") {
            console.error("Add to cart error:", error)
          }
          setSelectedOptionValue(null)
        },
      }
    )
  }, [findVariantForOption, addToCart, countryCode, product.title, toast])

  // Check if product has multiple variants and show buttons
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1
  const showVariantButtons = hasMultipleVariants && variantOption && optionValues.length > 0

  return (
    <LocalizedLink href={`/products/${product.handle}`}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ 
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
        }}
        className="group h-full flex flex-col bg-white border border-grayscale-200 rounded-xs overflow-hidden hover:border-grayscale-300 transition-colors duration-200"
      >
        {/* Image Slider Section */}
        <div className="relative mb-0 overflow-hidden">
          <ProductImageSlider
            thumbnail={product.thumbnail}
            images={product.images}
            productTitle={product.title}
            className="w-full"
          />
          {/* Loading Overlay */}
          {isPending && selectedOptionValue && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-3"
              >
                <Icon
                  name="loader"
                  className="w-8 h-8 text-white animate-spin"
                />
                <p className="text-sm font-medium text-white">Adding to cart...</p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="px-4 py-4 md:px-5 md:py-5 flex flex-col gap-3 md:gap-4 flex-1">
          {/* Title and Collection */}
          <div className="flex-1 min-w-0">
            <p className="mb-1.5 md:mb-2 font-normal text-base md:text-base group-hover:text-grayscale-700 transition-colors duration-300 line-clamp-2 leading-relaxed">
              {product.title}
            </p>
            {product.collection && (
              <p className="text-grayscale-500 text-xs md:text-sm max-md:hidden mt-1 font-light">
                {product.collection.title}
              </p>
            )}
          </div>

          {/* Variant Buttons */}
          {showVariantButtons && (
            <div className="flex flex-wrap gap-2 mb-2" onClick={(e) => e.stopPropagation()}>
              {optionValues.map((value) => {
                const isSelected = selectedOptionValue === value
                const isProcessing = isPending && isSelected
                return (
                  <button
                    key={value}
                    onClick={(e) => handleVariantClick(e, value)}
                    disabled={isPending && !isSelected}
                    className={`
                      px-2.5 py-1 text-xs font-medium 
                      border rounded-xs
                      transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        isSelected
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-grayscale-300 hover:border-black hover:bg-grayscale-50"
                      }
                    `}
                    aria-label={`Add ${product.title} ${variantOption?.title} ${value} to cart`}
                  >
                    {isProcessing ? "..." : value}
                  </button>
                )
              })}
            </div>
          )}

          {/* Price Section */}
          <div className="flex justify-between items-center pt-1 border-t border-grayscale-100">
            <div className="flex-1 min-w-0">
              {product.collection && (
                <p className="text-grayscale-500 text-xs md:hidden font-light">
                  {product.collection.title}
                </p>
              )}
            </div>
            {cheapestPrice ? (
              hasReducedPrice ? (
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="font-semibold text-base md:text-base text-red-600 leading-snug">
                    {cheapestPrice.calculated_price}
                  </p>
                  <p className="text-grayscale-400 line-through text-xs md:text-sm leading-tight mt-0.5 font-light">
                    {cheapestPrice.original_price}
                  </p>
                </div>
              ) : (
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="font-semibold text-base md:text-base leading-snug">
                    {cheapestPrice.calculated_price}
                  </p>
                </div>
              )
            ) : null}
          </div>
        </div>
      </motion.div>
    </LocalizedLink>
  )
}

export default withReactQueryProvider(ProductPreview)
