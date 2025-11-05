import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const listCategories = async function () {
  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: { fields: "+category_children,+parent_category_id" },
        next: { tags: ["categories"] },
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const listParentCategories = async function () {
  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: { fields: "+category_children,parent_category_id,name" }, // include parent_category_id
        next: { tags: ["categories"] },
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) =>
      product_categories.filter((cat) => !cat.parent_category_id) // only main categories
    )

}

export const getCategoriesList = async function (
  offset: number = 0,
  limit: number = 100,
  fields?: (keyof HttpTypes.StoreProductCategory)[]
) {
  return sdk.client.fetch<{
    product_categories: HttpTypes.StoreProductCategory[]
  }>("/store/product-categories", {
    query: {
      limit,
      offset,
      fields: fields ? fields.join(",") : undefined,
    },
    next: { tags: ["categories"] },
    cache: "force-cache",
  })
}

export const getCategoryByHandle = async function (categoryHandle: string[]) {
  return sdk.client.fetch<HttpTypes.StoreProductCategoryListResponse>(
    `/store/product-categories`,
    {
      query: { handle: categoryHandle },
      next: { tags: ["categories"] },
      cache: "force-cache",
    }
  )
}

/**
 * Gets a single category by its handle path (e.g., ['men', 'shirts'])
 */
export const getCategoryByPath = async function (
  handles: string[]
): Promise<HttpTypes.StoreProductCategory | null> {
  if (handles.length === 0) return null

  // Fetch all categories to build the tree
  const allCategories = await listCategories()

  // Find the category by traversing the path
  const categoryMap = new Map(
    allCategories.map((cat) => [cat.handle, cat])
  )

  let current: HttpTypes.StoreProductCategory | undefined
  const remainingHandles = [...handles]

  // Find root category
  const rootHandle = remainingHandles.shift()
  if (!rootHandle) return null

  current = categoryMap.get(rootHandle)
  if (!current) return null

  // Traverse down the tree
  for (const handle of remainingHandles) {
    const child = allCategories.find(
      (cat) =>
        cat.handle === handle && cat.parent_category_id === current?.id
    )
    if (!child) return null
    current = child
  }

  return current
}