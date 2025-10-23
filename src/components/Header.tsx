import * as React from "react"
import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import { SearchField } from "@/components/SearchField"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { HeaderDrawer } from "@/components/HeaderDrawer"
import { HeaderWrapper } from "@/components/HeaderWrapper"
import NavMenu from "@/components/NavMenu"
import dynamic from "next/dynamic"

const LoginLink = dynamic(
  () => import("@modules/header/components/LoginLink"),
  { loading: () => <></> }
)

const CartDrawer = dynamic(
  () => import("@/components/CartDrawer").then((mod) => mod.CartDrawer),
  { loading: () => <></> }
)

export const Header: React.FC = async () => {
  const regions = await listRegions()
  const categoriesFlat = await listCategories()

  // Build a nested tree of categories based on parent_category_id
  const map = new Map<string, HttpTypes.StoreProductCategory & { children: HttpTypes.StoreProductCategory[] }>()
  categoriesFlat.forEach((c) => map.set(c.id, { ...c, children: [] }))
  const roots: (HttpTypes.StoreProductCategory & { children: HttpTypes.StoreProductCategory[] })[] = []
  map.forEach((c) => {
    if (c.parent_category_id) {
      const parent = map.get(c.parent_category_id)
      if (parent) parent.children.push(c)
      else roots.push(c)
    } else {
      roots.push(c)
    }
  })

  const countryOptions = regions
    .map((r) => {
      return (r.countries ?? []).map((c) => ({
        country: c.iso_2,
        region: r.id,
        label: c.display_name,
      }))
    })
    .flat()
    .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))

  return (
    <>
      <HeaderWrapper>
        <Layout>
          <LayoutColumn>
            <div className="flex justify-between items-center h-18 md:h-21">
              <h1 className="font-medium text-md">
                <LocalizedLink href="/">Zuhoor Lifestyle</LocalizedLink>
              </h1>
              <div className="max-md:hidden">
                <NavMenu categories={roots} />
              </div>
              <div className="flex items-center gap-3 lg:gap-6 max-md:hidden">
                {/* <RegionSwitcher
                  countryOptions={countryOptions}
                  className="w-16"
                  selectButtonClassName="h-auto !gap-0 !p-1 transition-none"
                  selectIconClassName="text-current"
                /> */}
                <React.Suspense>
                  <SearchField countryOptions={countryOptions} />
                </React.Suspense>
                <LoginLink className="p-1 group-data-[light=true]:md:text-white group-data-[sticky=true]:md:text-black" />
                <CartDrawer />
              </div>
              <div className="flex items-center gap-4 md:hidden">
                <LoginLink className="p-1 group-data-[light=true]:md:text-white" />
                <CartDrawer />
                <React.Suspense>
                  <HeaderDrawer
                    countryOptions={countryOptions}
                    categories={roots}
                  />
                </React.Suspense>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </HeaderWrapper>
    </>
  )
}
