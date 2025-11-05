import { HttpTypes } from "@medusajs/types"

/**
 * Builds a category path (slug array) from a category object by traversing up the tree
 * @param category - The category object
 * @param allCategories - All categories flat list
 * @returns Array of category handles representing the path (e.g., ['men', 'shirts', 'polo'])
 */
export function buildCategoryPath(
  category: HttpTypes.StoreProductCategory,
  allCategories: HttpTypes.StoreProductCategory[]
): string[] {
  const path: string[] = []
  const categoryMap = new Map(
    allCategories.map((cat) => [cat.id, cat])
  )

  let current: HttpTypes.StoreProductCategory | undefined = category

  while (current) {
    path.unshift(current.handle || "")
    if (current.parent_category_id) {
      current = categoryMap.get(current.parent_category_id)
    } else {
      current = undefined
    }
  }

  return path.filter(Boolean)
}

/**
 * Builds a category URL path from a category handle path array
 * @param path - Array of category handles (e.g., ['men', 'shirts'])
 * @returns URL path string (e.g., '/category/men/shirts')
 */
export function buildCategoryUrl(path: string[]): string {
  if (path.length === 0) return "/store"
  return `/category/${path.join("/")}`
}

/**
 * Builds a category URL from a category object
 * @param category - The category object
 * @param allCategories - All categories flat list
 * @returns URL path string
 */
export function getCategoryUrl(
  category: HttpTypes.StoreProductCategory,
  allCategories: HttpTypes.StoreProductCategory[]
): string {
  const path = buildCategoryPath(category, allCategories)
  return buildCategoryUrl(path)
}

/**
 * Finds a category by its handle path
 * @param handles - Array of category handles (e.g., ['men', 'shirts'])
 * @param allCategories - All categories flat list
 * @returns The category if found, undefined otherwise
 */
export function findCategoryByPath(
  handles: string[],
  allCategories: HttpTypes.StoreProductCategory[]
): HttpTypes.StoreProductCategory | undefined {
  if (handles.length === 0) return undefined

  const categoryMap = new Map(
    allCategories.map((cat) => [cat.handle, cat])
  )

  let current: HttpTypes.StoreProductCategory | undefined
  let remainingHandles = [...handles]

  // Find root category
  const rootHandle = remainingHandles.shift()
  if (!rootHandle) return undefined

  current = categoryMap.get(rootHandle)
  if (!current) return undefined

  // Traverse down the tree
  for (const handle of remainingHandles) {
    const child = allCategories.find(
      (cat) =>
        cat.handle === handle && cat.parent_category_id === current?.id
    )
    if (!child) return undefined
    current = child
  }

  return current
}

/**
 * Builds a nested tree structure from flat category list
 * @param categories - Flat list of categories
 * @returns Array of root categories with nested children
 */
export function buildCategoryTree(
  categories: HttpTypes.StoreProductCategory[]
): (HttpTypes.StoreProductCategory & {
  children: (HttpTypes.StoreProductCategory & {
    children: HttpTypes.StoreProductCategory[]
  })[]
})[] {
  const map = new Map<
    string,
    HttpTypes.StoreProductCategory & {
      children: (HttpTypes.StoreProductCategory & {
        children: HttpTypes.StoreProductCategory[]
      })[]
    }
  >()

  // Initialize all categories with empty children array
  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] })
  })

  const roots: (HttpTypes.StoreProductCategory & {
    children: (HttpTypes.StoreProductCategory & {
      children: HttpTypes.StoreProductCategory[]
    })[]
  })[] = []

  // Build the tree
  map.forEach((category) => {
    if (category.parent_category_id) {
      const parent = map.get(category.parent_category_id)
      if (parent) {
        parent.children.push(category)
      } else {
        // Parent not found, treat as root
        roots.push(category)
      }
    } else {
      roots.push(category)
    }
  })

  return roots
}

