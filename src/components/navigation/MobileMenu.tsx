"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Icon } from "@/components/Icon"
import { getCategoryUrl } from "@lib/util/category-paths"

type CategoryWithChildren = HttpTypes.StoreProductCategory & {
  children?: CategoryWithChildren[]
}

interface MobileMenuProps {
  categories: CategoryWithChildren[]
  allCategories: HttpTypes.StoreProductCategory[]
  onLinkClick?: () => void
}

interface MobileMenuItemProps {
  category: CategoryWithChildren
  allCategories: HttpTypes.StoreProductCategory[]
  openCategories: Set<string>
  onToggle: (id: string) => void
  onLinkClick?: () => void
  level?: number
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  category,
  allCategories,
  openCategories,
  onToggle,
  onLinkClick,
  level = 0,
}) => {
  const hasChildren = category.children && category.children.length > 0
  const isOpen = openCategories.has(category.id)

  // Consistent font sizes - never go below text-sm for readability
  const getFontSizeClass = () => {
    if (level === 0) return "text-base font-semibold"
    if (level === 1) return "text-sm font-medium"
    return "text-sm font-normal" // All deeper levels use text-sm minimum
  }

  const getTextColorClass = () => {
    if (level === 0) return "text-black"
    if (level === 1) return "text-gray-700"
    if (level === 2) return "text-gray-600"
    return "text-gray-600" // Consistent gray for deeper levels
  }

  // Calculate progressive indentation: 16px base + 16px per level
  const paddingLeft = `${(level * 16) + 16}px`

  return (
    <div className="rounded-md">
      <div 
        className={`flex items-center justify-between transition-colors duration-200 hover:bg-gray-50 rounded-md ${hasChildren ? 'cursor-pointer' : ''}`}
        onClick={hasChildren ? () => onToggle(category.id) : undefined}
      >
        <LocalizedLink
          href={getCategoryUrl(category, allCategories)}
          onClick={(e) => {
            e.stopPropagation()
            onLinkClick?.()
          }}
          className={`py-3 block flex-1 transition-colors duration-200 ${getFontSizeClass()} ${getTextColorClass()}`}
          style={{ paddingLeft }}
        >
          <span className="block">{category.name || category.handle}</span>
        </LocalizedLink>
        {hasChildren && (
          <div className="p-3 flex-shrink-0 pointer-events-none">
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="inline-block"
            >
              <Icon name="chevron-right" className="w-4 h-4 text-gray-500" />
            </motion.span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col py-2 border-l-2 border-gray-100 ml-4">
              {category.children!.map((child) => (
                <MobileMenuItem
                  key={child.id}
                  category={child}
                  allCategories={allCategories}
                  openCategories={openCategories}
                  onToggle={onToggle}
                  onLinkClick={onLinkClick}
                  level={level + 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  categories,
  allCategories,
  onLinkClick,
}) => {
  const [openCategories, setOpenCategories] = React.useState<Set<string>>(
    new Set()
  )

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="space-y-1">
      <LocalizedLink
        href="/store"
        onClick={onLinkClick}
        className="py-3 block px-3 text-base font-semibold text-black transition-colors duration-200 hover:bg-gray-50 rounded-md"
      >
        Shop
      </LocalizedLink>
      {categories.map((cat) => (
        <MobileMenuItem
          key={cat.id}
          category={cat}
          allCategories={allCategories}
          openCategories={openCategories}
          onToggle={toggleCategory}
          onLinkClick={onLinkClick}
          level={0}
        />
      ))}
    </div>
  )
}
