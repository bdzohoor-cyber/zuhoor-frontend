"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { Layout, LayoutColumn } from "@/components/Layout"
import ProductPreview from "@modules/products/components/product-preview"

type Props = {
  products: HttpTypes.StoreProduct[]
  className?: string
}

export default function FeaturedProductGrid({ products, className }: Props) {
  if (!products || products.length === 0) return null

  return (
    <>
      <Layout className={className}>
        <LayoutColumn>
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-lg md:text-3xl font-semibold tracking-tight mb-2 md:mb-3">New Arrivals</h3>
            <p className="text-sm md:text-base text-gray-600">Discover the latest additions to our collection</p>
          </motion.div>
        </LayoutColumn>
      </Layout>
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full mt-8 md:mt-12"
      >
        <Layout className="gap-y-8 md:gap-8">
          {products.map((product, index) => (
            <LayoutColumn 
              key={product.id}
              className="!col-span-6 md:!col-span-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <ProductPreview product={product} />
              </motion.div>
            </LayoutColumn>
          ))}
        </Layout>
      </motion.div>
    </>
  )
}
