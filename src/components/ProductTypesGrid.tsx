"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"

type ProductTypesGridProps = {
  productTypes: HttpTypes.StoreProductType[]
  isMobile?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const imageHoverVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export default function ProductTypesGrid({
  productTypes,
  isMobile = false,
}: ProductTypesGridProps) {
  const [hoveredTypeId, setHoveredTypeId] = useState<string | null>(
    productTypes.length > 0 ? productTypes[0].id : null
  )

  // Helper to get image URL for a product type
  const getImageUrl = (productType: HttpTypes.StoreProductType): string | null => {
    if (
      typeof productType.metadata === "object" &&
      productType.metadata !== null &&
      typeof productType.metadata.image === "object" &&
      productType.metadata.image !== null &&
      "url" in productType.metadata.image &&
      typeof productType.metadata.image.url === "string"
    ) {
      return productType.metadata.image.url
    }
    return null
  }

  // Get the currently displayed product type (hovered or first)
  const displayedType = productTypes.find(
    (type) => type.id === hoveredTypeId
  ) || productTypes[0]
  const displayedImageUrl = displayedType ? getImageUrl(displayedType) : null

  if (isMobile) {
    return (
      <motion.div
        className="col-span-full md:hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {productTypes.map((productType, index) => (
          <motion.div
            key={productType.id}
            variants={itemVariants}
            className="mb-8 px-4"
          >
            <LocalizedLink
              href={`/store?type=${productType.value}`}
              className="group block"
            >
              {getImageUrl(productType) && (
                <motion.div
                  className="relative mb-4 overflow-hidden rounded-sm min-h-[300px] bg-grayscale-50"
                  variants={imageHoverVariants}
                  initial="rest"
                  whileHover="hover"
                >
                  <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                    <Image
                      src={getImageUrl(productType)!}
                      fill
                      alt={productType.value}
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </motion.div>
              )}
              <motion.p
                className="text-lg md:text-2xl font-display font-normal tracking-tight leading-relaxed group-hover:text-grayscale-700 transition-colors duration-300"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                {productType.value}
              </motion.p>
            </LocalizedLink>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <div className="col-span-full max-md:hidden flex gap-8 lg:gap-12 min-h-[500px]">
      {/* Left: List of Product Types */}
      <motion.div
        className="flex-1 max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col gap-4">
          {productTypes.map((productType) => {
            const isHovered = hoveredTypeId === productType.id
            return (
              <motion.div
                key={productType.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredTypeId(productType.id)}
                className="relative"
              >
                <LocalizedLink
                  href={`/store?type=${productType.value}`}
                  className="group block"
                >
                  <motion.div
                    className={`
                      relative py-4 px-4 md:py-5 md:px-6
                      border-b border-grayscale-200
                      transition-all duration-300
                      ${
                        isHovered
                          ? "bg-grayscale-50 border-grayscale-300"
                          : "hover:bg-grayscale-50/50"
                      }
                    `}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.p
                      className={`
                        text-xl md:text-2xl font-display font-normal tracking-tight leading-relaxed
                        transition-colors duration-300
                        ${
                          isHovered
                            ? "text-black"
                            : "text-grayscale-600 group-hover:text-grayscale-800"
                        }
                      `}
                    >
                      {productType.value}
                    </motion.p>
                    {/* Hover indicator line */}
                    {isHovered && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-black"
                        layoutId="activeIndicator"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                </LocalizedLink>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Right: Image Display */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {displayedImageUrl && (
            <motion.div
              key={hoveredTypeId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              className="sticky top-8 w-full"
            >
              <LocalizedLink
                href={`/store?type=${displayedType.value}`}
                className="block w-full"
              >
                <div className="relative w-full min-h-[500px] overflow-hidden rounded-sm bg-grayscale-50">
                  <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
                    <Image
                      src={displayedImageUrl}
                      fill
                      alt={displayedType.value}
                      className="object-contain transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 40vw"
                    />
                  </div>
                </div>
              </LocalizedLink>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

