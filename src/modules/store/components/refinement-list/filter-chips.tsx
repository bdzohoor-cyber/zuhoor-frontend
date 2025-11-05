"use client"

import * as React from "react"
import { Icon } from "@/components/Icon"

type FilterChipsProps = {
  collections?: Record<string, string>
  collection?: string[]
  categories?: Record<string, string>
  category?: string[]
  types?: Record<string, string>
  type?: string[]
  onRemove: (filterType: "collection" | "category" | "type", value: string) => void
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  collections,
  collection,
  categories,
  category,
  types,
  type,
  onRemove,
}) => {
  const hasActiveFilters =
    (collection && collection.length > 0) ||
    (category && category.length > 0) ||
    (type && type.length > 0)

  if (!hasActiveFilters) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
      {/* Collection chips */}
      {collection &&
        collection.length > 0 &&
        collections &&
        collection.map((handle) => {
          const label = collections[handle] || handle
          return (
            <button
              key={`collection-${handle}`}
              onClick={() => onRemove("collection", handle)}
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-sm bg-white hover:bg-grayscale-50 border border-grayscale-200 hover:border-grayscale-300 rounded-xs transition-colors duration-200 group"
              aria-label={`Remove ${label} filter`}
            >
              <span className="font-medium text-black group-hover:text-grayscale-700">
                {label}
              </span>
              <Icon
                name="close"
                className="w-3 h-3 md:w-3.5 md:h-3.5 text-grayscale-500 group-hover:text-grayscale-700"
              />
            </button>
          )
        })}

      {/* Category chips */}
      {category &&
        category.length > 0 &&
        categories &&
        category.map((handle) => {
          const label = categories[handle] || handle
          return (
            <button
              key={`category-${handle}`}
              onClick={() => onRemove("category", handle)}
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-sm bg-white hover:bg-grayscale-50 border border-grayscale-200 hover:border-grayscale-300 rounded-xs transition-colors duration-200 group"
              aria-label={`Remove ${label} filter`}
            >
              <span className="font-medium text-black group-hover:text-grayscale-700">
                {label}
              </span>
              <Icon
                name="close"
                className="w-3 h-3 md:w-3.5 md:h-3.5 text-grayscale-500 group-hover:text-grayscale-700"
              />
            </button>
          )
        })}

      {/* Type chips */}
      {type &&
        type.length > 0 &&
        types &&
        type.map((value) => {
          const label = types[value] || value
          return (
            <button
              key={`type-${value}`}
              onClick={() => onRemove("type", value)}
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-sm bg-white hover:bg-grayscale-50 border border-grayscale-200 hover:border-grayscale-300 rounded-xs transition-colors duration-200 group"
              aria-label={`Remove ${label} filter`}
            >
              <span className="font-medium text-black group-hover:text-grayscale-700">
                {label}
              </span>
              <Icon
                name="close"
                className="w-3 h-3 md:w-3.5 md:h-3.5 text-grayscale-500 group-hover:text-grayscale-700"
              />
            </button>
          )
        })}
    </div>
  )
}

