"use client"

import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { motion } from "framer-motion"

export default function ProductPreview({
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

  return (
    <LocalizedLink href={`/products/${product.handle}`}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ translateY: -5 }}
        transition={{ duration: 0.25 }}
        className="group"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          className="mb-5 md:mb-6 overflow-hidden rounded-sm"
        />
        <div className="flex justify-between max-md:flex-col gap-3">
          <div className="max-md:text-xs flex-1">
            <p className="mb-1.5 font-medium text-sm md:text-base group-hover:text-gray-700 transition-colors">{product.title}</p>
            {product.collection && (
              <p className="text-gray-500 text-xs md:text-sm max-md:hidden">
                {product.collection.title}
              </p>
            )}
          </div>
          {cheapestPrice ? (
            hasReducedPrice ? (
              <div className="text-right">
                <p className="font-semibold max-md:text-xs text-red-600">
                  {cheapestPrice.calculated_price}
                </p>
                <p className="max-md:text-xs text-gray-400 line-through text-xs">
                  {cheapestPrice.original_price}
                </p>
              </div>
            ) : (
              <div className="text-right">
                <p className="font-semibold max-md:text-xs text-sm md:text-base">
                  {cheapestPrice.calculated_price}
                </p>
              </div>
            )
          ) : null}
        </div>
      </motion.div>
    </LocalizedLink>
  )
}
