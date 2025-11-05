"use client"

import * as React from "react"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { Drawer } from "@/components/Drawer"
import { LocalizedLink } from "@/components/LocalizedLink"
import { SearchField } from "@/components/SearchField"
import { MobileMenu } from "@/components/navigation/MobileMenu"
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
  allCategories: HttpTypes.StoreProductCategory[]
}> = ({ countryOptions, categories, allCategories }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query")

  React.useEffect(() => {
    if (searchQuery) setIsMenuOpen(false)
  }, [searchQuery])

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
                  <MobileMenu
                    categories={categories}
                    allCategories={allCategories}
                    onLinkClick={() => setIsMenuOpen(false)}
                  />
                ) : (
                  <LocalizedLink
                    href="/store"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 block px-3"
                  >
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
