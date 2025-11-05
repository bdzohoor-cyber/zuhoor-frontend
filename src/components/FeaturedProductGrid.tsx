"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { Layout, LayoutColumn } from "@/components/Layout"
import ProductPreview from "@modules/products/components/product-preview"
import { LocalizedButtonLink } from "@/components/LocalizedLink"

type Props = {
  products: HttpTypes.StoreProduct[]
  className?: string
  imageUrl?: string
  imageAlt?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const headerVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export default function FeaturedProductGrid({ 
  products, 
  className,
  imageUrl = "/images/content/banner.jpeg",
  imageAlt = "New Arrivals"
}: Props) {
  if (!products || products.length === 0) return null

  return (
    <>
      <Layout className={className}>
        <LayoutColumn className="col-span-full mb-8 md:mb-12">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Mobile: Stacked layout */}
            <div className="px-4 md:hidden text-center">
              <h3 className="text-xl font-display font-normal tracking-tight mb-3">
                New Arrivals
              </h3>
              <p className="text-sm text-grayscale-600 mb-4 font-light">
                Discover the latest additions to our collection
              </p>
            </div>

            {/* Desktop: Title only */}
            <div className="hidden md:block px-4 text-center">
              <h3 className="text-3xl font-display font-normal tracking-tight mb-3">
                New Arrivals
              </h3>
              <p className="text-sm md:text-base text-grayscale-600 font-light">
                Discover the latest additions to our collection
              </p>
            </div>
          </motion.div>
        </LayoutColumn>
      </Layout>
      
      {/* Desktop: Split layout with sticky image on left */}
      <div className="hidden md:flex w-full min-h-screen relative">
        {/* Left: Sticky Image */}
        <div className="w-1/2 sticky top-0 h-screen flex-shrink-0">
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-end justify-start p-8 md:p-12 lg:p-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  delay: 0.3,
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-normal tracking-tight text-white">
                    Just Dropped
                  </h2>
                  <p className="text-sm md:text-base text-white/85 font-light">
                    Explore our newest products
                  </p>
                </div>
                <LocalizedButtonLink
                  href="/store"
                  variant="solid"
                  className="px-8 py-3.5 text-base font-medium !bg-white !text-black hover:!bg-grayscale-100 transition-colors duration-200 w-fit"
                >
                  Shop All
                </LocalizedButtonLink>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right: Scrollable Products in 2 columns */}
        <div className="w-1/2 px-4 md:px-8 lg:px-12 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-6"
          >
            {products.map((product) => (
              <motion.div key={`desktop-${product.id}`} variants={itemVariants}>
                <ProductPreview product={product} />
              </motion.div>
            ))}
          </motion.div>
          {/* Spacer to allow scrolling past products */}
          <div className="h-20" />
        </div>
      </div>

      {/* Mobile: Stacked layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full md:hidden"
      >
        {/* Mobile Image */}
        <div className="relative w-full h-[50vh] min-h-[300px] mb-8">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-end justify-start p-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-display font-normal tracking-tight text-white">
                    Just Dropped
                  </h2>
                  <p className="text-xs text-white/85 font-light">
                    Explore our newest products
                  </p>
                </div>
              <LocalizedButtonLink
                href="/store"
                variant="solid"
                className="px-6 py-2.5 text-sm font-medium !bg-white !text-black hover:!bg-grayscale-100 transition-colors duration-200 w-fit"
              >
                Shop All
              </LocalizedButtonLink>
            </div>
          </div>
        </div>

        {/* Mobile Products */}
        <Layout>
          <div className="col-span-full px-4">
            <div className="grid grid-cols-1 gap-6">
              {products.map((product) => (
                <motion.div key={`mobile-${product.id}`} variants={itemVariants}>
                  <ProductPreview product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </Layout>
      </motion.div>
    </>
  )
}
