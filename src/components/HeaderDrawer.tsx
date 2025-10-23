"use client"

import * as React from "react"
import { HttpTypes } from "@medusajs/types"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { Drawer } from "@/components/Drawer"
import { LocalizedLink } from "@/components/LocalizedLink"
import { SearchField } from "@/components/SearchField"
import { useSearchParams } from "next/navigation"

export const HeaderDrawer: React.FC<{
  countryOptions: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
  categories?: (HttpTypes.StoreProductCategory & {
    children?: HttpTypes.StoreProductCategory[]
  })[]
}> = ({ countryOptions, categories }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [openCategory, setOpenCategory] = React.useState<string | null>(null)

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query")

  React.useEffect(() => {
    if (searchQuery) setIsMenuOpen(false)
  }, [searchQuery])

  const toggleCategory = (id: string) => {
    setOpenCategory((curr) => (curr === id ? null : id))
  }

  return (
    <>
      <Button
        variant="ghost"
        className="p-1 text-current"
        onPress={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        <Icon name="menu" className="w-6 h-6" wrapperClassName="w-6 h-6" />
      </Button>
      <Drawer
        animateFrom="left"
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        className="rounded-none !p-0"
      >
        {({ close }) => (
          <>
            <div className="flex flex-col text-black h-full bg-white">
              <div className="flex items-center justify-between pb-4 mb-4 pt-5 w-full border-b border-gray-200 px-6">
                <div className="w-full max-w-full">
                  <SearchField
                    countryOptions={countryOptions}
                    isInputAlwaysShown
                  />
                </div>
                <button onClick={close} aria-label="Close menu" className="ml-3">
                  <Icon name="close" className="w-6" />
                </button>
              </div>

              <div className="px-4 pb-6 overflow-auto flex-1">
                {categories && categories.length > 0 ? (
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <div key={cat.id} className="rounded-md">
                        <div className="flex items-center justify-between">
                          <LocalizedLink
                            href={`/store?category=${encodeURIComponent(cat.handle)}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="py-3 px-3 block w-full text-base font-medium"
                          >
                            {cat.name || cat.handle}
                          </LocalizedLink>
                          {cat.children && cat.children.length > 0 && (
                            <button
                              aria-expanded={openCategory === cat.id}
                              onClick={() => toggleCategory(cat.id)}
                              className="p-3"
                              aria-label={`Toggle ${cat.name || cat.handle}`}
                            >
                              <motion.span
                                animate={{ rotate: openCategory === cat.id ? 90 : 0 }}
                                transition={{ duration: 0.18 }}
                                className="inline-block"
                              >
                                <Icon name="chevron-right" className="w-4 h-4" />
                              </motion.span>
                            </button>
                          )}
                        </div>

                        <AnimatePresence>
                          {cat.children && cat.children.length > 0 && openCategory === cat.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-6"
                            >
                              <div className="flex flex-col space-y-2 py-2">
                                {cat.children.map((child) => (
                                  <LocalizedLink
                                    key={child.id}
                                    href={`/store?category=${encodeURIComponent(child.handle)}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="py-2 block text-sm text-gray-700"
                                  >
                                    {child.name || child.handle}
                                  </LocalizedLink>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                ) : (
                  <LocalizedLink href="/store" onClick={() => setIsMenuOpen(false)} className="py-3 block px-3">
                    Shop
                  </LocalizedLink>
                )}
              </div>

              {/* <div className="px-6 py-4 border-t border-gray-100">
                <RegionSwitcher
                  countryOptions={countryOptions}
                  className="w-full"
                  selectButtonClassName="w-full justify-between"
                  selectIconClassName="text-current"
                />
              </div> */}
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
