import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByPath, listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { findCategoryByPath } from "@lib/util/category-paths"
import StoreTemplate from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{
    countryCode: string
    slug: string[]
  }>
  searchParams: Promise<{
    sortBy?: string
    page?: string
    collection?: string | string[]
    type?: string | string[]
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const category = await getCategoryByPath(slug)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} | Zuhoor Lifestyle`,
    description: category.description || `Browse ${category.name} products`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug, countryCode } = await params
  const { sortBy, page, collection, type } = await searchParams

  const region = await getRegion(countryCode)
  if (!region) {
    notFound()
  }

  // Get all categories to find the target category
  const allCategories = await listCategories()
  const category = findCategoryByPath(slug, allCategories)

  if (!category) {
    notFound()
  }

  // Validate and cast sortBy to SortOptions
  const validSortBy: SortOptions | undefined = 
    sortBy && (sortBy === "price_asc" || sortBy === "price_desc" || sortBy === "created_at")
      ? sortBy as SortOptions
      : undefined

  // Pass the category handle as a filter to the store template
  return (
    <StoreTemplate
      sortBy={validSortBy}
      page={page}
      countryCode={countryCode}
      category={[category.handle]}
      collection={
        !collection
          ? undefined
          : Array.isArray(collection)
            ? collection
            : [collection]
      }
      type={!type ? undefined : Array.isArray(type) ? type : [type]}
    />
  )
}

