import { HttpTypes } from "@medusajs/types"
import { getProductsListWithSort } from "@lib/data/products"
import FeaturedProductGrid from "@/components/FeaturedProductGrid"
// skeleton import intentionally omitted; component renders synchronously

export const FeaturedProductSection: React.FC<{
  className?: string
  countryCode?: string
}> = async ({
  className,
  countryCode = "bd",
}) => {
  // Fetch newest products (no pagination, no filters)
  const productsResp = await getProductsListWithSort({
    page: 1,
    sortBy: "created_at",
    countryCode,
    queryParams: { limit: 9 },
  })


  if (!productsResp) return null

  const products = productsResp.response.products as HttpTypes.StoreProduct[]

  if (!products || products.length === 0) return null

  return <FeaturedProductGrid products={products} className={className} />
    
}
