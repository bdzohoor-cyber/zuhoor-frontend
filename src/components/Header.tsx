import * as React from "react"
import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { SearchField } from "@/components/SearchField"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { HeaderDrawer } from "@/components/HeaderDrawer"
import { HeaderWrapper } from "@/components/HeaderWrapper"
import { MegaMenu } from "@/components/navigation/MegaMenu"
import { buildCategoryTree } from "@lib/util/category-paths"
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

  // Build a nested tree of categories using utility function
  const categoryTree = buildCategoryTree(categoriesFlat)

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
            <div className="flex justify-between items-center h-18 md:h-22">
              <h1 className="font-display font-normal text-lg tracking-tight">
                <LocalizedLink href="/" className="hover:opacity-70 transition-opacity duration-200">Zuhoor</LocalizedLink>
              </h1>
              <div className="max-md:hidden">
                <MegaMenu categories={categoryTree} allCategories={categoriesFlat} />
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
                <LoginLink className="p-1" />
                <CartDrawer />
              </div>
              <div className="flex items-center gap-4 md:hidden">
                <LoginLink className="p-1" />
                <CartDrawer />
                <React.Suspense>
                  <HeaderDrawer
                    countryOptions={countryOptions}
                    categories={categoryTree}
                    allCategories={categoriesFlat}
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
