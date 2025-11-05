"use client"

import Image from "next/image"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink, LocalizedButtonLink } from "@/components/LocalizedLink"
import { motion, useInView } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { useRef } from "react"

type CollectionsListProps = {
  collections: HttpTypes.StoreCollection[]
}

const CollectionCard: React.FC<{
  collection: HttpTypes.StoreCollection
  index: number
  totalCards: number
}> = ({ collection, index, totalCards }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-30% 0px -30% 0px" })
  
  // Calculate sticky positioning for stacking effect
  // Each card stacks with more spacing for visible deck effect
  const stickyTop = 80 + (index * 40) // Base 80px + 40px per card for stacking
  const zIndex = totalCards - index // Higher index = higher z-index (on top)

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        height: index === totalCards - 1 ? 'calc(100vh + 200px)' : '100vh',
        zIndex: zIndex,
      }}
    >
      <motion.div
        className="sticky"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.97 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        style={{ 
          top: `${stickyTop}px`,
        }}
      >
        <div className="bg-white border border-grayscale-200 rounded-xs overflow-hidden hover:border-grayscale-300 transition-colors duration-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 lg:gap-12 p-4 md:p-6 lg:p-8">
            {/* Left: Title, Description, and Button */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-normal tracking-tight text-black mb-3 md:mb-4">
                {collection.title}
              </h3>
              {typeof collection.metadata?.description === "string" &&
                collection.metadata?.description.length > 0 && (
                  <p className="text-sm md:text-base text-grayscale-600 font-light leading-relaxed mb-4 md:mb-6">
                    {collection.metadata.description}
                  </p>
                )}
              <div onClick={(e) => e.stopPropagation()}>
                <LocalizedButtonLink
                  href={`/collections/${collection.handle}`}
                  variant="outline"
                  className="px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base w-fit"
                >
                  Explore Collection
                </LocalizedButtonLink>
              </div>
            </div>
            
            {/* Right: Image */}
            {typeof collection.metadata?.image === "object" &&
              collection.metadata.image &&
              "url" in collection.metadata.image &&
              typeof collection.metadata.image.url === "string" && (
                <div className="relative w-full md:w-80 lg:w-96 flex-shrink-0 aspect-[4/3] md:aspect-square overflow-hidden rounded-xs bg-grayscale-50 group/image">
                  <LocalizedLink 
                    href={`/collections/${collection.handle}`}
                    className="block w-full h-full"
                  >
                    <Image
                      src={collection.metadata.image.url}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/image:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 320px, 384px"
                    />
                  </LocalizedLink>
                </div>
              )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const CollectionsList: React.FC<CollectionsListProps> = ({ collections }) => {
  return (
    <div className="relative">
      {collections.map((collection, index) => (
        <CollectionCard 
          key={collection.id}
          collection={collection} 
          index={index}
          totalCards={collections.length}
        />
      ))}
    </div>
  )
}

type CollectionsSectionProps = {
  collections: HttpTypes.StoreCollection[]
  className?: string
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  collections,
  className,
}) => {
  if (!collections || collections.length === 0) {
    return null
  }

  return (
    <Layout className={className}>
      <LayoutColumn className="col-span-full mb-10 md:mb-16">
        <h3 className="text-xl md:text-3xl font-display font-normal tracking-tight px-4 md:px-0 text-center">
          Collections
        </h3>
      </LayoutColumn>
      
      <LayoutColumn className="col-span-full">
        <CollectionsList collections={collections} />
      </LayoutColumn>
    </Layout>
  )
}
