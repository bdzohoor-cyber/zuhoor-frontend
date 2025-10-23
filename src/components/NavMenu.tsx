"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"

export const NavMenu: React.FC<{
  categories: (HttpTypes.StoreProductCategory & { children?: HttpTypes.StoreProductCategory[] })[]
}> = ({ categories }) => {
  const [openId, setOpenId] = React.useState<string | null>(null)

  return (
    <nav>
      <ul className="flex items-center gap-8">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="relative"
            onMouseEnter={() => setOpenId(cat.id)}
            onMouseLeave={() => setOpenId((curr) => (curr === cat.id ? null : curr))}
          >
            <LocalizedLink href={`/store?category=${encodeURIComponent(cat.handle)}`} className="inline-block">
              <span className="text-sm md:text-base">{cat.name || cat.handle}</span>
            </LocalizedLink>

            <AnimatePresence>
              {cat.children && cat.children.length > 0 && openId === cat.id && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full mt-2 bg-white text-black p-3 shadow-lg z-50 rounded"
                >
                  <ul className="flex flex-col gap-2 whitespace-nowrap ">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <LocalizedLink href={`/store?category=${encodeURIComponent(child.handle)}`} className="py-1 block hover:underline">
                          {child.name || child.handle}
                        </LocalizedLink>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavMenu
