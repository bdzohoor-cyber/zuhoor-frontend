"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import { getCategoryUrl } from "@lib/util/category-paths"

type CategoryWithChildren = HttpTypes.StoreProductCategory & {
  children?: CategoryWithChildren[]
}

interface MegaMenuProps {
  categories: CategoryWithChildren[]
  allCategories: HttpTypes.StoreProductCategory[]
}

interface MegaMenuColumnProps {
  category: CategoryWithChildren
  allCategories: HttpTypes.StoreProductCategory[]
  level?: number
}

const MegaMenuColumn: React.FC<MegaMenuColumnProps> = ({
  category,
  allCategories,
  level = 0,
}) => {
  const hasChildren = category.children && category.children.length > 0

  return (
    <div className="flex flex-col">
      <LocalizedLink
        href={getCategoryUrl(category, allCategories)}
        className={`mb-5 font-display font-semibold tracking-tight leading-snug hover:text-gray-800 transition-colors duration-200 ${
          level === 0 ? "text-xl" : "text-base"
        }`}
      >
        {category.name || category.handle}
      </LocalizedLink>
      {hasChildren && (
        <ul className="flex flex-col gap-2.5">
          {category.children!.map((child) => (
            <li key={child.id}>
              <LocalizedLink
                href={getCategoryUrl(child, allCategories)}
                className="block py-2 text-sm text-gray-600 hover:text-black transition-all duration-200 hover:translate-x-1 group leading-relaxed"
              >
                <span className="relative">
                  {child.name || child.handle}
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300" />
                </span>
              </LocalizedLink>
              {/* Recursively render nested children with consistent sizing */}
              {child.children && child.children.length > 0 && (
                <ul className="ml-5 mt-2 space-y-1.5 border-l-2 border-gray-100 pl-4">
                  {child.children.map((grandchild) => (
                    <li key={grandchild.id}>
                      <LocalizedLink
                        href={getCategoryUrl(grandchild, allCategories)}
                        className="block py-1 text-sm text-gray-500 hover:text-gray-900 transition-all duration-200 hover:translate-x-0.5 group"
                      >
                        <span className="relative">
                          {grandchild.name || grandchild.handle}
                          <span className="absolute left-0 bottom-0 w-0 h-px bg-gray-400 group-hover:w-full transition-all duration-300" />
                        </span>
                      </LocalizedLink>
                      {/* Handle 4th level nesting */}
                      {grandchild.children && grandchild.children.length > 0 && (
                        <ul className="ml-4 mt-1.5 space-y-1 border-l border-gray-50 pl-3">
                          {grandchild.children.map((greatGrandchild) => (
                            <li key={greatGrandchild.id}>
                              <LocalizedLink
                                href={getCategoryUrl(greatGrandchild, allCategories)}
                                className="block py-0.5 text-sm text-gray-500 hover:text-gray-800 transition-all duration-200"
                              >
                                {greatGrandchild.name || greatGrandchild.handle}
                              </LocalizedLink>
                              {/* Handle 5th level nesting */}
                              {greatGrandchild.children &&
                                greatGrandchild.children.length > 0 && (
                                  <ul className="ml-3 mt-1 space-y-0.5 pl-2.5 border-l border-gray-50">
                                    {greatGrandchild.children.map((level5) => (
                                      <li key={level5.id}>
                                        <LocalizedLink
                                          href={getCategoryUrl(level5, allCategories)}
                                          className="block py-0.5 text-sm text-gray-400 hover:text-gray-700 transition-colors duration-200"
                                        >
                                          {level5.name || level5.handle}
                                        </LocalizedLink>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  categories,
  allCategories,
}) => {
  const [openId, setOpenId] = React.useState<string | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setOpenId(id)
  }

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow mouse movement to submenu
    timeoutRef.current = setTimeout(() => {
      setOpenId(null)
    }, 150)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <nav className="relative">
      <ul className="flex items-center gap-8 lg:gap-10">
        <li>
          <LocalizedLink
            href="/store"
            className="inline-block py-2 text-base font-medium tracking-tight leading-relaxed hover:text-gray-700 transition-colors duration-200 relative group"
          >
            Shop
            <motion.span
              className="absolute -bottom-1 left-0 h-0.5 bg-black"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </LocalizedLink>
        </li>
        {categories.map((cat) => {
          const hasChildren = cat.children && cat.children.length > 0
          const isOpen = openId === cat.id

          return (
            <li
              key={cat.id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(cat.id)}
              onMouseLeave={handleMouseLeave}
            >
              <LocalizedLink
                href={getCategoryUrl(cat, allCategories)}
                className="inline-block py-2 text-base font-medium tracking-tight leading-relaxed hover:text-gray-700 transition-colors duration-200 relative group"
              >
                {cat.name || cat.handle}
                {hasChildren && (
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-black"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                )}
              </LocalizedLink>

              <AnimatePresence>
                {hasChildren && isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -16, scale: 0.98, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                    exit={{ opacity: 0, y: -8, scale: 0.98, x: "-50%" }}
                    transition={{
                      duration: 0.25,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="absolute left-1/2 top-full mt-6 bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 rounded-2xl p-10 w-[calc(100vw-2rem)] max-w-[1100px] min-w-[750px] before:absolute before:-top-2.5 before:left-1/2 before:-translate-x-1/2 before:w-5 before:h-5 before:bg-white before:border-l before:border-t before:border-gray-100 before:rotate-45 before:shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
                    onMouseEnter={() => handleMouseEnter(cat.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                      {cat.children!.map((child) => (
                        <MegaMenuColumn
                          key={child.id}
                          category={child}
                          allCategories={allCategories}
                          level={0}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
